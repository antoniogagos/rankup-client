import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import * as ts from 'typescript';
import { runRatchet } from './repo-ratchet';
import { runAgentEntryGuardrail } from './repo-agent-entry';
import { runStructuralAdr } from './repo-structural-adr';
import { runWorkLogGuardrail } from './repo-work-log';
import { runWorkLogVerification } from './repo-work-log-verification';
import { runP0TestGuardrails } from './test-guardrails-p0';
import { runEngineNoPiiLoggingGuardrail } from './repo-engine-no-pii-logging';
import { runEnginePortabilityBoundaryGuardrail } from './repo-engine-portability-boundary';
import { runEngineRuntimeErrorSurfaceGuardrail } from './repo-engine-runtime-error-surface';
import { runEngineTypeSafetyBoundaryGuardrail } from './repo-engine-type-safety-boundary';
import { runOpenApiSotDriftGuardrail } from './repo-openapi-sot-drift';

function runInlineDecoratorGuardrail(): void {
	const command = ['rg -n -U', '"@(property|state|query|queryAll|queryAsync|service)\\\\([^\\\\n]*\\\\)\\\\s*\\\\n\\\\s*(public|private|protected)?\\\\s*(readonly\\\\s+)?[#A-Za-z_\\\\$]"', 'packages'].join(' ');
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- Decorators (@property/@state/@service/etc) must be on the same line as the field.');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Decorator inline guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run decorator inline guardrail.');
		throw error;
	}
}

function runSingleLineImportsGuardrail(): void {
	const command = ['rg -n -U', '--glob "*.ts"', '"import\\\\s+(type\\\\s+)?\\\\{[^}]*\\\\n[^}]*\\\\}\\\\s*from"', '.'].join(' ');
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- Imports must stay on a single line (no multi-line named imports).');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Single-line import guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run single-line import guardrail.');
		throw error;
	}
}

function runImportSpacingGuardrail(): void {
	const command = ['rg -n -U', '--glob "*.ts"', '"^import[^\\\\n]*\\\\n\\\\n+import"', '.'].join(' ');
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- Blank lines between import statements are not allowed.');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Import spacing guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run import spacing guardrail.');
		throw error;
	}
}

function runGatewayMappingGuardrail(): void {
	const glob = '--glob "apps/rankup-spa/services/api/**/*-gateway.ts"';

	const spreadCommand = ['rg -n -U', glob, '"\\.\\.\\.\\s*api[A-Za-z0-9_$]*"', '.'].join(' ');
	try {
		const output = execSync(spreadCommand, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- Gateway mapping must not spread API DTOs (e.g., `...api*`). Use explicit mapping or helpers.');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Gateway spread guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			// no matches
		} else if (status === 0) {
			return;
		} else {
			console.error('repo:guardrails failed');
			console.error('- Unable to run gateway spread guardrail.');
			throw error;
		}
	}

	const castCommand = ['rg -n -U', glob, '"\\bas\\s+Domain\\.[A-Za-z0-9_]+"', '.'].join(' ');
	try {
		const output = execSync(castCommand, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- Gateway mapping must not use `as Domain.*` assertions. Map explicitly.');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Gateway cast guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		if (status === 0) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run gateway cast guardrail.');
		throw error;
	}
}

function runApiTournamentsNamingGuardrail(): void {
	if (existsSync('apps/rankup-spa/services/api/tournament')) {
		console.error('repo:guardrails failed');
		console.error('- Legacy API folder apps/rankup-spa/services/api/tournament is forbidden. Use services/api/tournaments.');
		process.exit(1);
	}

	const checks = [
		{
			command:
				'rg -n "services/api/tournament/" apps/rankup-spa --glob "*.ts"',
			message:
				'Imports must not reference services/api/tournament/. Use services/api/tournaments/.',
		},
		{
			command:
				'rg -n "\\.\\./tournament/" apps/rankup-spa/services/api apps/rankup-spa/lib --glob "*.ts"',
			message:
				'Relative imports must not reference ../tournament/. Use ../tournaments/.',
		},
	];

	for (const check of checks) {
		try {
			const output = execSync(check.command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
				.toString()
				.trim();
			if (output) {
				console.error('repo:guardrails failed');
				console.error(`- ${check.message}`);
				console.error(output);
				process.exit(1);
			}
			console.error('repo:guardrails failed');
			console.error(`- ${check.message}`);
			process.exit(1);
		} catch (error) {
			const status = (error as { status?: number }).status;
			if (status === 1) {
				continue;
			}
			console.error('repo:guardrails failed');
			console.error('- Unable to run API tournaments naming guardrail.');
			throw error;
		}
	}
}

function runLitCssIndentGuardrail(): void {
	const command = 'rg -l --glob "*.ts" \'css`\' packages';
	let files: string[] = [];
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (!output) {
			return;
		}
		files = output
			.split('\n')
			.map(line => line.trim())
			.filter(Boolean);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to scan for css template literals.');
		throw error;
	}

	const indentViolations: string[] = [];
	const closeIndentViolations: string[] = [];
	const closeBracketViolations: string[] = [];

	const getLineIndent = (text: string, lineStarts: readonly number[], line: number): string => {
		const start = lineStarts[line];
		const end = line + 1 < lineStarts.length ? lineStarts[line + 1] : text.length;
		const lineText = text.slice(start, end).replace(/\r?\n$/, '');
		const match = lineText.match(/^\s*/);
		return match ? match[0] : '';
	};

	const findFirstNonEmptyLine = (raw: string): { indent: string; offset: number } | null => {
		let lineStart = 0;
		while (lineStart <= raw.length) {
			let lineEnd = raw.indexOf('\n', lineStart);
			if (lineEnd === -1) {
				lineEnd = raw.length;
			}
			let line = raw.slice(lineStart, lineEnd);
			if (line.endsWith('\r')) {
				line = line.slice(0, -1);
			}
			if (line.trim().length > 0) {
				const indentMatch = line.match(/^[\t ]*/);
				const indent = indentMatch ? indentMatch[0] : '';
				return { indent, offset: lineStart };
			}
			if (lineEnd === raw.length) {
				break;
			}
			lineStart = lineEnd + 1;
		}
		return null;
	};

	for (const file of files) {
		const text = readFileSync(file, 'utf8');
		const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
		const lineStarts = source.getLineStarts();

		const visit = (node: ts.Node): void => {
			if (ts.isTaggedTemplateExpression(node)) {
				const tag = node.tag;
				if (ts.isIdentifier(tag) && tag.text === 'css') {
					const template = node.template;
					const templateStart = template.getStart(source);
					const templateEnd = template.getEnd();
					const raw = text.slice(templateStart + 1, templateEnd - 1);
					if (!raw.includes('\n')) {
						return;
					}
					const firstLine = findFirstNonEmptyLine(raw);
					if (!firstLine) {
						return;
					}
					const cssLineInfo = source.getLineAndCharacterOfPosition(node.getStart(source));
					const cssIndent = getLineIndent(text, lineStarts, cssLineInfo.line);
					if (firstLine.indent !== cssIndent) {
						const violationPos = templateStart + 1 + firstLine.offset;
						const location = source.getLineAndCharacterOfPosition(violationPos);
						indentViolations.push(`${file}:${location.line + 1}:${location.character + 1}`);
					}
					const backtickIndex = templateEnd - 1;
					const lineStart = text.lastIndexOf('\n', backtickIndex - 1);
					const lineStartIndex = lineStart === -1 ? 0 : lineStart + 1;
					const closingIndent = text.slice(lineStartIndex, backtickIndex);
					if (closingIndent !== cssIndent && /^[\t ]*$/.test(closingIndent)) {
						const location = source.getLineAndCharacterOfPosition(backtickIndex);
						closeIndentViolations.push(`${file}:${location.line + 1}:${location.character + 1}`);
					}
				}
			}
			if (ts.isPropertyDeclaration(node) && node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.StaticKeyword)) {
				const name = node.name;
				const isStyles = (ts.isIdentifier(name) && name.text === 'styles') || (ts.isStringLiteral(name) && name.text === 'styles');
				if (isStyles && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
					const elements = node.initializer.elements.filter(element => element && !ts.isOmittedExpression(element));
					const lastElement = elements[elements.length - 1];
					if (lastElement && ts.isTaggedTemplateExpression(lastElement) && ts.isIdentifier(lastElement.tag) && lastElement.tag.text === 'css') {
						const templateEnd = lastElement.template.getEnd();
						if (text[templateEnd] !== ']') {
							const location = source.getLineAndCharacterOfPosition(templateEnd);
							closeBracketViolations.push(`${file}:${location.line + 1}:${location.character + 1}`);
						}
					}
				}
			}
			ts.forEachChild(node, visit);
		};

		visit(source);
	}

	if (indentViolations.length > 0 || closeIndentViolations.length > 0 || closeBracketViolations.length > 0) {
		console.error('repo:guardrails failed');
		if (indentViolations.length > 0) {
			console.error('- Lit css templates must align content with the css` line (no extra indentation).');
			console.error(indentViolations.join('\n'));
		}
		if (closeIndentViolations.length > 0) {
			console.error('- Lit css template closing backticks must align with the css` line.');
			console.error(closeIndentViolations.join('\n'));
		}
		if (closeBracketViolations.length > 0) {
			console.error('- Lit css templates in static styles arrays must close as `]` (no trailing comma/newline).');
			console.error(closeBracketViolations.join('\n'));
		}
		process.exit(1);
	}
}

function runLitHtmlIndentGuardrail(): void {
	const command = 'rg -l --glob "*.ts" \'html`\' packages';
	let files: string[] = [];
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (!output) {
			return;
		}
		files = output
			.split('\n')
			.map(line => line.trim())
			.filter(Boolean);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to scan for html template literals.');
		throw error;
	}

	const indentViolations: string[] = [];
	const closeIndentViolations: string[] = [];

	const getLineIndent = (text: string, lineStarts: readonly number[], line: number): string => {
		const start = lineStarts[line];
		const end = line + 1 < lineStarts.length ? lineStarts[line + 1] : text.length;
		const lineText = text.slice(start, end).replace(/\r?\n$/, '');
		const match = lineText.match(/^\s*/);
		return match ? match[0] : '';
	};

	const findFirstNonEmptyLine = (raw: string): { indent: string; offset: number } | null => {
		let lineStart = 0;
		while (lineStart <= raw.length) {
			let lineEnd = raw.indexOf('\n', lineStart);
			if (lineEnd === -1) {
				lineEnd = raw.length;
			}
			let line = raw.slice(lineStart, lineEnd);
			if (line.endsWith('\r')) {
				line = line.slice(0, -1);
			}
			if (line.trim().length > 0) {
				const indentMatch = line.match(/^[\t ]*/);
				const indent = indentMatch ? indentMatch[0] : '';
				return { indent, offset: lineStart };
			}
			if (lineEnd === raw.length) {
				break;
			}
			lineStart = lineEnd + 1;
		}
		return null;
	};

	for (const file of files) {
		const text = readFileSync(file, 'utf8');
		const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
		const lineStarts = source.getLineStarts();

		const visit = (node: ts.Node): void => {
			if (ts.isTaggedTemplateExpression(node)) {
				const tag = node.tag;
				if (ts.isIdentifier(tag) && tag.text === 'html') {
					const template = node.template;
					const templateStart = template.getStart(source);
					const templateEnd = template.getEnd();
					const raw = text.slice(templateStart + 1, templateEnd - 1);
					if (!raw.includes('\n')) {
						return;
					}
					const firstLine = findFirstNonEmptyLine(raw);
					if (!firstLine) {
						return;
					}
					const htmlLineInfo = source.getLineAndCharacterOfPosition(node.getStart(source));
					const htmlIndent = getLineIndent(text, lineStarts, htmlLineInfo.line);
					const expectedIndent = `${htmlIndent}\t`;
					if (firstLine.indent !== expectedIndent) {
						const violationPos = templateStart + 1 + firstLine.offset;
						const location = source.getLineAndCharacterOfPosition(violationPos);
						indentViolations.push(`${file}:${location.line + 1}:${location.character + 1}`);
					}
					const backtickIndex = templateEnd - 1;
					const lineStart = text.lastIndexOf('\n', backtickIndex - 1);
					const lineStartIndex = lineStart === -1 ? 0 : lineStart + 1;
					const closingIndent = text.slice(lineStartIndex, backtickIndex);
					if (closingIndent !== htmlIndent && /^[\t ]*$/.test(closingIndent)) {
						const location = source.getLineAndCharacterOfPosition(backtickIndex);
						closeIndentViolations.push(`${file}:${location.line + 1}:${location.character + 1}`);
					}
				}
			}
			ts.forEachChild(node, visit);
		};

		visit(source);
	}

	if (indentViolations.length > 0 || closeIndentViolations.length > 0) {
		console.error('repo:guardrails failed');
		if (indentViolations.length > 0) {
			console.error('- Lit html templates must indent content one tab beyond the html` line.');
			console.error(indentViolations.join('\n'));
		}
		if (closeIndentViolations.length > 0) {
			console.error('- Lit html template closing backticks must align with the html` line.');
			console.error(closeIndentViolations.join('\n'));
		}
		process.exit(1);
	}
}

function runApiMockServerLeakageGuardrail(): void {
	const command = 'rg -n "@rankup/api-mock/server" apps/rankup-spa packages/samba';
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- UI packages must not import @rankup/api-mock/server');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- UI packages must not import @rankup/api-mock/server');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run anti-leakage check for @rankup/api-mock/server');
		throw error;
	}
}

function runUiApiMockGuardrail(): void {
	const command = 'rg -n "@rankup/api-mock" apps/rankup-spa/pages apps/rankup-spa/elements packages/samba';
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- UI packages must not import @rankup/api-mock');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- UI api-mock guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run UI api-mock guardrail.');
		throw error;
	}
}

function runAppApiMockGuardrail(): void {
	const command = 'rg -n "@rankup/api-mock" apps/rankup-spa --glob \"*.ts\" --glob \"!apps/rankup-spa/services/api/**\" --glob \"!apps/rankup-spa/lib/composition-root.ts\"';
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- @rankup/api-mock imports are only allowed in app services/api wiring or the composition root.');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- App api-mock guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run app api-mock guardrail.');
		throw error;
	}
}

function runAppApiContractGuardrail(): void {
	const command = 'rg -n \"@rankup/api[\\\"\\\'/]\" apps/rankup-spa --glob \"*.ts\" --glob \"!apps/rankup-spa/services/api/**\"';
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- @rankup/api imports are only allowed in app services/api wiring.');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- App api contract guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run app api contract guardrail.');
		throw error;
	}
}

function runDomainApiContractGuardrail(): void {
	const command = 'rg -n \"@rankup/api[\\\"\\\'/]\" packages/rankup/src/domains --glob \"*.ts\"';
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- Domain packages must not import @rankup/api.');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Domain api contract guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run domain api contract guardrail.');
		throw error;
	}
}

function runPlatformProductSdkGuardrail(): void {
	const command = 'rg -n "@rankup/api|@rankup/api-mock" packages/platform --glob \"*.ts\"';
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- Platform must not import product SDKs (@rankup/api, @rankup/api-mock).');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Platform product SDK guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run platform product SDK guardrail.');
		throw error;
	}
}

function runUiApiClientGuardrail(): void {
	const checks = [
		{
			command: 'rg -n "@service\\(IRankupApiClient" apps/rankup-spa/pages apps/rankup-spa/elements',
			message: 'UI must not inject IRankupApiClient via @service.',
		},
		{
			command: 'rg -n "IRankupApiClient" apps/rankup-spa/pages apps/rankup-spa/elements',
			message: 'UI must not reference IRankupApiClient.',
		},
	];

	for (const check of checks) {
		try {
			const output = execSync(check.command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
				.toString()
				.trim();
			if (output) {
				console.error('repo:guardrails failed');
				console.error(`- ${check.message}`);
				console.error(output);
				process.exit(1);
			}
			console.error('repo:guardrails failed');
			console.error(`- ${check.message}`);
			process.exit(1);
		} catch (error) {
			const status = (error as { status?: number }).status;
			if (status === 1) {
				continue;
			}
			console.error('repo:guardrails failed');
			console.error('- Unable to run UI IRankupApiClient guardrail.');
			throw error;
		}
	}
}

function runUiFetchGuardrail(): void {
	const command = 'rg -n "fetch\\(" apps/rankup-spa/pages apps/rankup-spa/elements';
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- UI must not call fetch() directly.');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- UI fetch guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run UI fetch guardrail.');
		throw error;
	}
}

function runUiDomainBoundaryGuardrail(): void {
	const command = 'rg -n "@rankup/rankup/domains/.+/(browser|mock)" apps/rankup-spa/pages apps/rankup-spa/elements packages/samba';
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- UI packages must not import domain browser/mock implementations.');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- UI domain boundary guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run UI domain boundary guardrail.');
		throw error;
	}
}

function runPlatformDomainBoundaryGuardrail(): void {
	const command = 'rg -n "@rankup/rankup/domains/" packages/platform';
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- Platform must not depend on domain packages.');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Platform domain guardrail did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run platform domain guardrail.');
		throw error;
	}
}

function runOpenApiLocationGuardrail(): void {
	const command = 'rg --files -g "openapi.y*ml" -g "!**/node_modules/**" -g "!**/.git/**"';
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		const files = output ? output.split('\n').map(line => line.trim()).filter(Boolean) : [];
		const canonical = 'packages/api/openapi.yaml';
		const violations = files.filter(filePath => filePath !== canonical);
		if (!files.includes(canonical)) {
			console.error('repo:guardrails failed');
			console.error(`- Canonical OpenAPI spec missing: ${canonical}`);
			process.exit(1);
		}
		if (violations.length > 0) {
			console.error('repo:guardrails failed');
			console.error('- OpenAPI spec must live only at packages/api/openapi.yaml.');
			console.error(violations.join('\n'));
			process.exit(1);
		}
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			console.error('repo:guardrails failed');
			console.error('- Canonical OpenAPI spec missing: packages/api/openapi.yaml');
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to run OpenAPI location guardrail.');
		throw error;
	}
}

function runLitLocalizeMsgIdGuardrail(): void {
	const command = 'rg --files apps packages --glob "*.ts"';
	let files: string[] = [];
	try {
		const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (!output) {
			return;
		}
		files = output
			.split('\n')
			.map(line => line.trim())
			.filter(Boolean)
			.filter(filePath => !filePath.endsWith('.d.ts'));
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return;
		}
		console.error('repo:guardrails failed');
		console.error('- Unable to scan TypeScript files for localize msg() id enforcement.');
		throw error;
	}

	const msgIdPattern = /^[a-z0-9]+(\.[a-z0-9]+)*$/;
	const violations: string[] = [];

	const getPropertyName = (name: ts.PropertyName): string | null => {
		if (ts.isIdentifier(name)) {
			return name.text;
		}
		if (ts.isStringLiteral(name)) {
			return name.text;
		}
		return null;
	};

	for (const filePath of files) {
		const text = readFileSync(filePath, 'utf8');
		const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

		const msgIdentifiers = new Set<string>();
		for (const statement of source.statements) {
			if (!ts.isImportDeclaration(statement) || !statement.importClause || !statement.moduleSpecifier) {
				continue;
			}
			if (!ts.isStringLiteral(statement.moduleSpecifier) || statement.moduleSpecifier.text !== '@lit/localize') {
				continue;
			}
			const bindings = statement.importClause.namedBindings;
			if (!bindings || !ts.isNamedImports(bindings)) {
				continue;
			}
			for (const element of bindings.elements) {
				const imported = element.propertyName?.text ?? element.name.text;
				if (imported === 'msg') {
					msgIdentifiers.add(element.name.text);
				}
			}
		}

		if (msgIdentifiers.size === 0) {
			continue;
		}

		const visit = (node: ts.Node): void => {
			if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && msgIdentifiers.has(node.expression.text)) {
				const location = source.getLineAndCharacterOfPosition(node.getStart(source));
				const locationLabel = `${filePath}:${location.line + 1}:${location.character + 1}`;
				const optionsArgument = node.arguments[1];
				if (!optionsArgument) {
					violations.push(`${locationLabel} - msg() is missing options with explicit id`);
					return;
				}
				if (!ts.isObjectLiteralExpression(optionsArgument)) {
					violations.push(`${locationLabel} - msg() options must be an object literal with id`);
					return;
				}
				const idProperty = optionsArgument.properties.find(property => {
					if (!ts.isPropertyAssignment(property) && !ts.isShorthandPropertyAssignment(property)) {
						return false;
					}
					if (!property.name) {
						return false;
					}
					return getPropertyName(property.name) === 'id';
				});
				if (!idProperty || !ts.isPropertyAssignment(idProperty)) {
					violations.push(`${locationLabel} - msg() options must include id`);
					return;
				}
				if (!ts.isStringLiteral(idProperty.initializer)) {
					violations.push(`${locationLabel} - msg() id must be a string literal`);
					return;
				}
				if (!msgIdPattern.test(idProperty.initializer.text)) {
					violations.push(`${locationLabel} - msg() id "${idProperty.initializer.text}" must match ^[a-z0-9]+(\\.[a-z0-9]+)*$`);
				}
			}
			ts.forEachChild(node, visit);
		};

		visit(source);
	}

	if (violations.length > 0) {
		console.error('repo:guardrails failed');
		console.error('- Lit Localize policy: every msg() must include explicit id with dot-separated lowercase tokens.');
		console.error(violations.join('\n'));
		process.exit(1);
	}
}

function runEngineTestDisciplineGuardrail(): void {
	const onlySkipCommand = 'rg -n --glob "*.test.ts" "\\\\.(only|skip)\\\\(" packages/rankup/test';
	try {
		const output = execSync(onlySkipCommand, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- Engine test suites must not contain .only() or .skip().');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Engine test discipline guardrail (.only/.skip) did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status !== 1) {
			console.error('repo:guardrails failed');
			console.error('- Unable to run engine test discipline guardrail (.only/.skip).');
			throw error;
		}
	}

	const nodeTestImportCommand = 'rg -n --glob "*.test.ts" "node:test|node:assert/strict" packages/rankup/test';
	try {
		const output = execSync(nodeTestImportCommand, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
			.toString()
			.trim();
		if (output) {
			console.error('repo:guardrails failed');
			console.error('- Engine tests must use Vitest (node:test and node:assert/strict are forbidden in packages/rankup/test).');
			console.error(output);
			process.exit(1);
		}
		console.error('repo:guardrails failed');
		console.error('- Engine test discipline guardrail (node:test imports) did not behave as expected.');
		process.exit(1);
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status !== 1) {
			console.error('repo:guardrails failed');
			console.error('- Unable to run engine test discipline guardrail (node:test imports).');
			throw error;
		}
	}
}

function runProblemDetailsCanonicalizationGuardrails(): void {
	runP0TestGuardrails();
}

export function runGuardrails(): void {
	runAgentEntryGuardrail();
	runStructuralAdr();
	runWorkLogGuardrail();
	runWorkLogVerification();
	runInlineDecoratorGuardrail();
	runSingleLineImportsGuardrail();
	runImportSpacingGuardrail();
	runGatewayMappingGuardrail();
	runApiTournamentsNamingGuardrail();
	runLitCssIndentGuardrail();
	runLitHtmlIndentGuardrail();
	runUiApiClientGuardrail();
	runUiFetchGuardrail();
	runUiDomainBoundaryGuardrail();
	runPlatformDomainBoundaryGuardrail();
	runPlatformProductSdkGuardrail();
	runOpenApiLocationGuardrail();
	runOpenApiSotDriftGuardrail();
	runUiApiMockGuardrail();
	runAppApiMockGuardrail();
	runAppApiContractGuardrail();
	runDomainApiContractGuardrail();
	runApiMockServerLeakageGuardrail();
	runLitLocalizeMsgIdGuardrail();
	runEngineTestDisciplineGuardrail();
	runEnginePortabilityBoundaryGuardrail();
	runEngineRuntimeErrorSurfaceGuardrail();
	runEngineTypeSafetyBoundaryGuardrail();
	runEngineNoPiiLoggingGuardrail();
	runProblemDetailsCanonicalizationGuardrails();
	runRatchet();
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runGuardrails();
}
