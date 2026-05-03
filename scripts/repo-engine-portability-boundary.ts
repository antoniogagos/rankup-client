import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import * as ts from 'typescript';

const guardedPaths = [
	'packages/rankup/src/runtime',
	'packages/rankup/src/algorithms',
	'packages/rankup/src/registry',
	'packages/rankup/src/shared',
];

const forbiddenImportPatterns: Array<{ pattern: RegExp; reason: string }> = [
	{ pattern: /^@rankup\/api(?:$|\/)/, reason: 'Engine core must not import @rankup/api.' },
	{ pattern: /^@rankup\/api-mock(?:$|\/)/, reason: 'Engine core must not import @rankup/api-mock.' },
	{ pattern: /^@rankup\/platform(?:$|\/)/, reason: 'Engine core must not import platform implementations.' },
	{ pattern: /^@rankup\/samba(?:$|\/)/, reason: 'Engine core must not import UI packages.' },
];

const forbiddenNodeModules = new Set([
	'assert',
	'buffer',
	'child_process',
	'cluster',
	'crypto',
	'dgram',
	'diagnostics_channel',
	'dns',
	'events',
	'fs',
	'http',
	'https',
	'module',
	'net',
	'os',
	'path',
	'perf_hooks',
	'process',
	'readline',
	'repl',
	'stream',
	'timers',
	'tls',
	'url',
	'util',
	'v8',
	'vm',
	'worker_threads',
	'zlib',
]);

const forbiddenConstructorGlobals = new Set([
	'BroadcastChannel',
	'EventSource',
	'FileReader',
	'Headers',
	'Request',
	'Response',
	'WebSocket',
	'Worker',
	'XMLHttpRequest',
]);

function fail(message: string, output?: string): never {
	console.error('repo:guardrails failed');
	console.error(`- ${message}`);
	if (output) {
		console.error(output);
	}
	process.exit(1);
}

function listEngineFiles(): string[] {
	const command = ['rg --files --glob "*.ts"', ...guardedPaths].join(' ');
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (!output) {
			return [];
		}
		return output
			.split('\n')
			.map(line => line.trim())
			.filter(Boolean)
			.filter(filePath => !filePath.endsWith('.d.ts'));
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return [];
		}
		fail('Unable to list engine source files for portability guardrail.');
	}
}

function formatViolation(filePath: string, source: ts.SourceFile, position: number, detail: string): string {
	const location = source.getLineAndCharacterOfPosition(position);
	return `${filePath}:${location.line + 1}:${location.character + 1} - ${detail}`;
}

function runImportBoundaryGuardrail(filePath: string, source: ts.SourceFile, violations: string[]): void {
	for (const statement of source.statements) {
		if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) {
			continue;
		}
		const moduleSpecifier = statement.moduleSpecifier.text;
		const position = statement.moduleSpecifier.getStart(source);

		for (const rule of forbiddenImportPatterns) {
			if (rule.pattern.test(moduleSpecifier)) {
				violations.push(formatViolation(filePath, source, position, `${rule.reason} Found import "${moduleSpecifier}".`));
			}
		}

		if (moduleSpecifier.startsWith('node:')) {
			violations.push(
				formatViolation(filePath, source, position, `Engine core must stay runtime-portable (node:* imports are forbidden). Found "${moduleSpecifier}".`)
			);
			continue;
		}

		if (forbiddenNodeModules.has(moduleSpecifier)) {
			violations.push(
				formatViolation(filePath, source, position, `Engine core must stay runtime-portable (Node built-in imports are forbidden). Found "${moduleSpecifier}".`)
			);
		}

		if (moduleSpecifier.includes('/browser/') || /(^|\/)apps\//.test(moduleSpecifier) || /(^|\/)packages\/samba\//.test(moduleSpecifier)) {
			violations.push(
				formatViolation(
					filePath,
					source,
					position,
					`Engine core must not depend on UI/browser implementation paths. Found import "${moduleSpecifier}".`
				)
			);
		}
	}
}

function runGlobalUsageGuardrail(filePath: string, source: ts.SourceFile, violations: string[]): void {
	const isDeclarationName = (node: ts.Identifier): boolean => {
		const parent = node.parent;
		if (ts.isVariableDeclaration(parent) && parent.name === node) {
			return true;
		}
		if (ts.isParameter(parent) && parent.name === node) {
			return true;
		}
		if (ts.isFunctionDeclaration(parent) && parent.name === node) {
			return true;
		}
		if (ts.isClassDeclaration(parent) && parent.name === node) {
			return true;
		}
		if (ts.isInterfaceDeclaration(parent) && parent.name === node) {
			return true;
		}
		if (ts.isTypeAliasDeclaration(parent) && parent.name === node) {
			return true;
		}
		if (ts.isEnumDeclaration(parent) && parent.name === node) {
			return true;
		}
		if (ts.isImportClause(parent) || ts.isImportSpecifier(parent) || ts.isNamespaceImport(parent) || ts.isImportEqualsDeclaration(parent)) {
			return true;
		}
		if (ts.isPropertyDeclaration(parent) && parent.name === node) {
			return true;
		}
		if (ts.isPropertySignature(parent) && parent.name === node) {
			return true;
		}
		if (ts.isPropertyAssignment(parent) && parent.name === node) {
			return true;
		}
		if (ts.isMethodDeclaration(parent) && parent.name === node) {
			return true;
		}
		if (ts.isMethodSignature(parent) && parent.name === node) {
			return true;
		}
		return false;
	};

	const visit = (node: ts.Node): void => {
		if (ts.isCallExpression(node)) {
			if (ts.isIdentifier(node.expression) && node.expression.text === 'fetch') {
				violations.push(
					formatViolation(filePath, source, node.expression.getStart(source), 'Engine core must not call global fetch(); use runtime ports/adapters instead.')
				);
			}
			if (
				ts.isPropertyAccessExpression(node.expression)
				&& ts.isIdentifier(node.expression.expression)
				&& node.expression.expression.text === 'globalThis'
				&& node.expression.name.text === 'fetch'
			) {
				violations.push(
					formatViolation(filePath, source, node.expression.getStart(source), 'Engine core must not call globalThis.fetch(); use runtime ports/adapters instead.')
				);
			}
		}

		if (ts.isPropertyAccessExpression(node)) {
			if (ts.isIdentifier(node.expression) && ['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'process', 'Buffer'].includes(node.expression.text)) {
				violations.push(
					formatViolation(
						filePath,
						source,
						node.expression.getStart(source),
						`Engine core must not depend on global "${node.expression.text}" (browser/Node runtime coupling).`
					)
				);
			}
			if (
				ts.isIdentifier(node.expression)
				&& node.expression.text === 'globalThis'
				&& ['window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'process', 'Buffer'].includes(node.name.text)
			) {
				violations.push(
					formatViolation(
						filePath,
						source,
						node.getStart(source),
						`Engine core must not depend on globalThis.${node.name.text} (runtime coupling).`
					)
				);
			}
		}

		if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && forbiddenConstructorGlobals.has(node.expression.text)) {
			violations.push(
				formatViolation(
					filePath,
					source,
					node.expression.getStart(source),
					`Engine core must not instantiate browser/network global "${node.expression.text}" directly.`
				)
			);
		}

		if (ts.isIdentifier(node) && (node.text === '__dirname' || node.text === '__filename')) {
			if (!isDeclarationName(node)) {
				violations.push(
					formatViolation(filePath, source, node.getStart(source), `Engine core must not depend on Node global "${node.text}" (runtime-portability violation).`)
				);
			}
		}

		ts.forEachChild(node, visit);
	};

	visit(source);
}

export function runEnginePortabilityBoundaryGuardrail(): void {
	const files = listEngineFiles();
	if (files.length === 0) {
		return;
	}

	const violations: string[] = [];
	for (const filePath of files) {
		const text = readFileSync(filePath, 'utf8');
		const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
		runImportBoundaryGuardrail(filePath, source, violations);
		runGlobalUsageGuardrail(filePath, source, violations);
	}

	if (violations.length > 0) {
		fail(
			'Engine portability/boundary guardrail failed: runtime|algorithms|registry|shared must stay neutral (no UI/platform/SDK imports and no browser/Node globals).',
			violations.join('\n')
		);
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runEnginePortabilityBoundaryGuardrail();
}
