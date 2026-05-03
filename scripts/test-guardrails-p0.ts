import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import * as ts from 'typescript';

// Legacy gateways temporarily waived until dedicated mapper suites are added.
// Any gateway outside this baseline must ship with a mapper P0 suite.
const gatewayMapperRatchetBaseline = new Set<string>([
	'apps/rankup-spa/services/api/accounts/auth-gateway.ts',
	'apps/rankup-spa/services/api/accounts/me-gateway.ts',
	'apps/rankup-spa/services/api/accounts/social-gateway.ts',
	'apps/rankup-spa/services/api/accounts/users-gateway.ts',
	'apps/rankup-spa/services/api/achievements/achievements-catalog-gateway.ts',
	'apps/rankup-spa/services/api/achievements/achievements-grants-gateway.ts',
	'apps/rankup-spa/services/api/creators/creators-catalog-gateway.ts',
	'apps/rankup-spa/services/api/creators/creators-directory-gateway.ts',
	'apps/rankup-spa/services/api/engagement/live-gateway.ts',
	'apps/rankup-spa/services/api/engagement/recaps-gateway.ts',
	'apps/rankup-spa/services/api/engagement/stats-gateway.ts',
	'apps/rankup-spa/services/api/engagement/tournament-chat-gateway.ts',
	'apps/rankup-spa/services/api/engagement/updates-gateway.ts',
	'apps/rankup-spa/services/api/media/media-assets-gateway.ts',
	'apps/rankup-spa/services/api/media/media-uploads-gateway.ts',
	'apps/rankup-spa/services/api/promotions/promotions-campaigns-gateway.ts',
	'apps/rankup-spa/services/api/promotions/promotions-rewards-gateway.ts',
	'apps/rankup-spa/services/api/ranked/ranked-leaderboards-gateway.ts',
	'apps/rankup-spa/services/api/ranked/ranked-seasons-gateway.ts',
	'apps/rankup-spa/services/api/rules/game-modes-gateway.ts',
	'apps/rankup-spa/services/api/rules/rulesets-gateway.ts',
	'apps/rankup-spa/services/api/scoring/tournament-results-gateway.ts',
	'apps/rankup-spa/services/api/sports/sports-catalog-gateway.ts',
	'apps/rankup-spa/services/api/sports/sports-schedule-gateway.ts',
	'apps/rankup-spa/services/api/submissions/tournament-submissions-gateway.ts',
	'apps/rankup-spa/services/api/tournaments/tournament-core-gateway.ts',
	'apps/rankup-spa/services/api/tournaments/tournament-invitation-codes-gateway.ts',
	'apps/rankup-spa/services/api/tournaments/tournament-invites-gateway.ts',
	'apps/rankup-spa/services/api/tournaments/tournament-matchdays-gateway.ts',
	'apps/rankup-spa/services/api/tournaments/tournament-members-gateway.ts',
	'apps/rankup-spa/services/api/tournaments/tournament-ranking-gateway.ts',
	'apps/rankup-spa/services/api/trustSafety/trust-appeals-gateway.ts',
	'apps/rankup-spa/services/api/trustSafety/trust-enforcement-gateway.ts',
	'apps/rankup-spa/services/api/trustSafety/trust-policies-gateway.ts',
	'apps/rankup-spa/services/api/trustSafety/trust-reports-gateway.ts',
	'apps/rankup-spa/services/api/verified/verified-events-gateway.ts',
	'apps/rankup-spa/services/api/verified/verified-hub-gateway.ts',
]);

const gatewayGlobs = ['apps/**/services/api/**/*-gateway.ts', 'packages/**/src/**/gateways/**/*Gateway.ts'];
const apiMapperGlob = 'apps/rankup-spa/services/api/**/*-mappers.ts';
const httpClientPath = 'apps/rankup-spa/services/api/http-client.ts';
const problemMapperNamePattern = /ProblemToDomainError$/;

function fail(message: string): never {
	console.error('repo:p0-test-guardrails failed');
	console.error(`- ${message}`);
	process.exit(1);
}

function normalizePath(filePath: string): string {
	return filePath.replace(/^\.\/+/, '').replace(/\\/g, '/');
}

function collectFiles(globPattern: string): string[] {
	try {
		const output = execSync(`rg --files --glob "${globPattern}" .`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (!output) {
			return [];
		}
		return output
			.split('\n')
			.map(line => normalizePath(line.trim()))
			.filter(Boolean);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return [];
		}
		throw error;
	}
}

function runOnlySkipGuardrail(testFiles: readonly string[]): void {
	for (const filePath of testFiles) {
		const content = readFileSync(filePath, 'utf8');
		if (content.includes('.only(') || content.includes('.skip(')) {
			fail(`P0 tests must not include .only/.skip -> ${filePath}`);
		}
	}
}

function collectGatewayFiles(): string[] {
	return [...new Set(gatewayGlobs.flatMap(globPattern => collectFiles(globPattern)))];
}

function collectMapperP0Tests(): string[] {
	return [...new Set(collectFiles('**/__tests__/p0/mappers/*.mapper.test.ts'))];
}

function collectExpectedMapperSuffixes(gatewayPath: string): string[] {
	const fileName = gatewayPath.split('/').at(-1)?.replace(/\.ts$/, '') ?? '';
	if (!fileName) {
		return [];
	}
	const stems = new Set<string>([fileName]);
	if (fileName.endsWith('-gateway')) {
		stems.add(fileName.slice(0, -'-gateway'.length));
	}
	if (fileName.endsWith('Gateway')) {
		stems.add(fileName.slice(0, -'Gateway'.length));
	}
	return [...stems].map(stem => `/__tests__/p0/mappers/${stem}.mapper.test.ts`);
}

function hasMapperSuiteForGateway(gatewayPath: string, mapperTests: readonly string[]): boolean {
	const expectedSuffixes = collectExpectedMapperSuffixes(gatewayPath);
	return expectedSuffixes.some(expectedSuffix => mapperTests.some(testPath => testPath.endsWith(expectedSuffix)));
}

function runDynamicGatewayMapperRatchetGuardrail(): void {
	const gatewayFiles = collectGatewayFiles();
	const mapperTests = collectMapperP0Tests();
	const missing: string[] = [];
	for (const gatewayPath of gatewayFiles) {
		if (gatewayMapperRatchetBaseline.has(gatewayPath)) {
			continue;
		}
		if (!hasMapperSuiteForGateway(gatewayPath, mapperTests)) {
			const expected = collectExpectedMapperSuffixes(gatewayPath).join(' OR ');
			missing.push(`${gatewayPath} -> ${expected}`);
		}
	}
	if (missing.length > 0) {
		fail(
			`Missing mapper P0 suite for newly detected gateway(s).\n` +
				`Add one mapper test that matches the naming rule:\n${missing.join('\n')}`,
		);
	}
}

function collectP0Tests(): string[] {
	try {
		const output = execSync('rg --files --glob "**/__tests__/p0/**/*.test.ts" .', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (!output) {
			return [];
		}
		return output
			.split('\n')
			.map(line => line.trim())
			.filter(Boolean);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return [];
		}
		throw error;
	}
}

function runHttpClientNoGenericHttpThrowGuardrail(): void {
	const sourceText = readFileSync(httpClientPath, 'utf8');
	const source = ts.createSourceFile(httpClientPath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const violations: string[] = [];

	const visit = (node: ts.Node): void => {
		if (
			ts.isThrowStatement(node) &&
			node.expression &&
			ts.isNewExpression(node.expression) &&
			ts.isIdentifier(node.expression.expression) &&
			node.expression.expression.text === 'Error'
		) {
			const messageArgument = node.expression.arguments?.[0];
			if (messageArgument) {
				const messageText = messageArgument.getText(source);
				if (/\bHTTP\b/.test(messageText)) {
					const location = source.getLineAndCharacterOfPosition(node.getStart(source));
					violations.push(`${httpClientPath}:${location.line + 1}:${location.character + 1}`);
				}
			}
		}
		ts.forEachChild(node, visit);
	};

	visit(source);

	if (violations.length > 0) {
		fail(
			`HTTP client must not throw generic Error("HTTP ..."). Route non-2xx paths through mapProblemToDomainError.\n` +
				violations.join('\n'),
		);
	}
}

function collectApiMapperFiles(): string[] {
	return [...new Set(collectFiles(apiMapperGlob))];
}

function hasCanonicalProblemMapperImport(source: ts.SourceFile): boolean {
	for (const statement of source.statements) {
		if (!ts.isImportDeclaration(statement) || !statement.importClause || !statement.moduleSpecifier) {
			continue;
		}
		if (!ts.isStringLiteral(statement.moduleSpecifier)) {
			continue;
		}
		if (!statement.moduleSpecifier.text.includes('problem/mapProblemToDomainError.js')) {
			continue;
		}
		const bindings = statement.importClause.namedBindings;
		if (!bindings || !ts.isNamedImports(bindings)) {
			continue;
		}
		for (const element of bindings.elements) {
			const importedName = element.propertyName?.text ?? element.name.text;
			if (importedName === 'mapProblemToDomainError' && element.name.text === 'mapProblemToDomainError') {
				return true;
			}
		}
	}
	return false;
}

function unwrapExpression(expression: ts.Expression): ts.Expression {
	let current = expression;
	while (true) {
		if (ts.isParenthesizedExpression(current) || ts.isAsExpression(current) || ts.isTypeAssertionExpression(current) || ts.isSatisfiesExpression(current)) {
			current = current.expression;
			continue;
		}
		if (ts.isNonNullExpression(current)) {
			current = current.expression;
			continue;
		}
		return current;
	}
}

function isCanonicalProblemMapperCall(expression: ts.Expression): boolean {
	const unwrapped = unwrapExpression(expression);
	return ts.isCallExpression(unwrapped) && ts.isIdentifier(unwrapped.expression) && unwrapped.expression.text === 'mapProblemToDomainError';
}

function isCanonicalProblemMapperFunctionBody(body: ts.ConciseBody): boolean {
	if (ts.isBlock(body)) {
		if (body.statements.length !== 1 || !ts.isReturnStatement(body.statements[0]) || !body.statements[0].expression) {
			return false;
		}
		return isCanonicalProblemMapperCall(body.statements[0].expression);
	}
	return isCanonicalProblemMapperCall(body);
}

type ProblemMapperDeclaration =
	| {
			name: string;
			location: string;
			kind: 'direct';
	  }
	| {
			name: string;
			location: string;
			kind: 'alias';
			target: string;
	  }
	| {
			name: string;
			location: string;
			kind: 'invalid';
			reason: string;
	  };

function toLocation(source: ts.SourceFile, node: ts.Node): string {
	const location = source.getLineAndCharacterOfPosition(node.getStart(source));
	return `${source.fileName}:${location.line + 1}:${location.character + 1}`;
}

function collectProblemMapperDeclarations(source: ts.SourceFile): ProblemMapperDeclaration[] {
	const declarations: ProblemMapperDeclaration[] = [];

	const collectVariableDeclaration = (declaration: ts.VariableDeclaration): void => {
		if (!ts.isIdentifier(declaration.name) || !problemMapperNamePattern.test(declaration.name.text)) {
			return;
		}
		const location = toLocation(source, declaration.name);
		const initializer = declaration.initializer;
		if (!initializer) {
			declarations.push({
				name: declaration.name.text,
				location,
				kind: 'invalid',
				reason: 'must initialize with mapProblemToDomainError or a valid ProblemToDomainError alias',
			});
			return;
		}
		if (ts.isIdentifier(initializer)) {
			if (!problemMapperNamePattern.test(initializer.text)) {
				declarations.push({
					name: declaration.name.text,
					location,
					kind: 'invalid',
					reason: `alias target "${initializer.text}" must end with ProblemToDomainError`,
				});
				return;
			}
			declarations.push({
				name: declaration.name.text,
				location,
				kind: 'alias',
				target: initializer.text,
			});
			return;
		}
		if ((ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer)) && isCanonicalProblemMapperFunctionBody(initializer.body)) {
			declarations.push({
				name: declaration.name.text,
				location,
				kind: 'direct',
			});
			return;
		}
		declarations.push({
			name: declaration.name.text,
			location,
			kind: 'invalid',
			reason: 'must delegate to mapProblemToDomainError(problem)',
		});
	};

	for (const statement of source.statements) {
		if (ts.isVariableStatement(statement)) {
			for (const declaration of statement.declarationList.declarations) {
				collectVariableDeclaration(declaration);
			}
			continue;
		}
		if (ts.isFunctionDeclaration(statement) && statement.name && problemMapperNamePattern.test(statement.name.text)) {
			const location = toLocation(source, statement.name);
			if (statement.body && isCanonicalProblemMapperFunctionBody(statement.body)) {
				declarations.push({
					name: statement.name.text,
					location,
					kind: 'direct',
				});
				continue;
			}
			declarations.push({
				name: statement.name.text,
				location,
				kind: 'invalid',
				reason: 'must return mapProblemToDomainError(problem)',
			});
		}
	}

	return declarations;
}

function validateCanonicalProblemMapperUsageInFile(filePath: string): string[] {
	const sourceText = readFileSync(filePath, 'utf8');
	const source = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const declarations = collectProblemMapperDeclarations(source);
	if (declarations.length === 0) {
		return [];
	}

	const errors: string[] = [];
	if (!hasCanonicalProblemMapperImport(source)) {
		errors.push(`${filePath}: missing canonical import mapProblemToDomainError from ../problem/mapProblemToDomainError.js`);
	}

	for (const declaration of declarations) {
		if (declaration.kind === 'invalid') {
			errors.push(`${declaration.location} - ${declaration.name}: ${declaration.reason}`);
		}
	}

	const directNames = new Set(declarations.filter(declaration => declaration.kind === 'direct').map(declaration => declaration.name));
	if (directNames.size === 0) {
		errors.push(`${filePath}: at least one *ProblemToDomainError declaration must delegate directly to mapProblemToDomainError.`);
	}

	const aliasMap = new Map(
		declarations.filter(declaration => declaration.kind === 'alias').map(declaration => [declaration.name, declaration.target] as const),
	);

	const resolveAlias = (name: string, stack: Set<string>): boolean => {
		if (directNames.has(name)) {
			return true;
		}
		if (stack.has(name)) {
			return false;
		}
		const target = aliasMap.get(name);
		if (!target) {
			return false;
		}
		const nextStack = new Set(stack);
		nextStack.add(name);
		return resolveAlias(target, nextStack);
	};

	for (const declaration of declarations) {
		if (declaration.kind !== 'alias') {
			continue;
		}
		if (!resolveAlias(declaration.name, new Set())) {
			errors.push(`${declaration.location} - ${declaration.name}: alias chain must resolve to a direct mapProblemToDomainError delegation.`);
		}
	}

	return errors;
}

function runCanonicalProblemMapperGuardrail(): void {
	const mapperFiles = collectApiMapperFiles();
	const errors = mapperFiles.flatMap(validateCanonicalProblemMapperUsageInFile);
	if (errors.length > 0) {
		fail(
			`ProblemDetails mappers must not invent ad-hoc DomainError shapes. Use canonical mapProblemToDomainError in *ProblemToDomainError exports.\n` +
				errors.join('\n'),
		);
	}
}

export function runP0TestGuardrails(): void {
	runHttpClientNoGenericHttpThrowGuardrail();
	runCanonicalProblemMapperGuardrail();
	runDynamicGatewayMapperRatchetGuardrail();
	const p0Tests = collectP0Tests();
	runOnlySkipGuardrail(p0Tests);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runP0TestGuardrails();
}
