import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import * as ts from 'typescript';

type DeterminismViolationKind = 'dateNow' | 'mathRandom' | 'setTimeout' | 'sleep';

type AllowlistEntry = {
	filePath: string;
	line: number;
	kind: DeterminismViolationKind;
	reason: string;
};

const deterministicGuardGlobs = ['**/__tests__/p0/**/*.ts', 'packages/testkit/src/**/*.ts', 'vitest.setup.ts'];

// Keep this list intentionally small and explicit. Add entries only with a reason.
const deterministicCallAllowlist: AllowlistEntry[] = [];

function fail(message: string, details?: string): never {
	console.error('test:p0:determinism failed');
	console.error(`- ${message}`);
	if (details) {
		console.error(details);
	}
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
			.filter(Boolean)
			.filter(filePath => filePath.endsWith('.ts'))
			.filter(filePath => !filePath.endsWith('.d.ts'));
	} catch (error) {
		const status = (error as { status?: number }).status;
		if (status === 1) {
			return [];
		}
		throw error;
	}
}

function collectDeterministicGuardFiles(): string[] {
	return [...new Set(deterministicGuardGlobs.flatMap(globPattern => collectFiles(globPattern)))].sort();
}

function allowlistKey(filePath: string, line: number, kind: DeterminismViolationKind): string {
	return `${normalizePath(filePath)}:${line}:${kind}`;
}

function makeAllowlistSet(): Set<string> {
	const keys = new Set<string>();
	for (const entry of deterministicCallAllowlist) {
		keys.add(allowlistKey(entry.filePath, entry.line, entry.kind));
	}
	return keys;
}

function formatViolation(filePath: string, source: ts.SourceFile, position: number, detail: string): string {
	const location = source.getLineAndCharacterOfPosition(position);
	return `${normalizePath(filePath)}:${location.line + 1}:${location.character + 1} - ${detail}`;
}

function maybeAddViolation(
	violations: string[],
	allowlist: Set<string>,
	filePath: string,
	source: ts.SourceFile,
	position: number,
	kind: DeterminismViolationKind,
	detail: string,
): void {
	const location = source.getLineAndCharacterOfPosition(position);
	const line = location.line + 1;
	if (allowlist.has(allowlistKey(filePath, line, kind))) {
		return;
	}
	violations.push(formatViolation(filePath, source, position, detail));
}

function runCallsiteGuardrail(filePath: string, source: ts.SourceFile, allowlist: Set<string>, violations: string[]): void {
	const visit = (node: ts.Node): void => {
		if (ts.isCallExpression(node)) {
			const expression = node.expression;
			if (ts.isPropertyAccessExpression(expression)) {
				if (ts.isIdentifier(expression.expression) && expression.expression.text === 'Date' && expression.name.text === 'now') {
					maybeAddViolation(
						violations,
						allowlist,
						filePath,
						source,
						expression.getStart(source),
						'dateNow',
						'Date.now() is forbidden in P0 scope; inject a fixed clock/time source.',
					);
				}
				if (ts.isIdentifier(expression.expression) && expression.expression.text === 'Math' && expression.name.text === 'random') {
					maybeAddViolation(
						violations,
						allowlist,
						filePath,
						source,
						expression.getStart(source),
						'mathRandom',
						'Math.random() is forbidden in P0 scope; use deterministic fixtures/seeded ids.',
					);
				}
				if (
					expression.name.text === 'setTimeout'
					&& ts.isIdentifier(expression.expression)
					&& (expression.expression.text === 'globalThis' || expression.expression.text === 'window')
				) {
					maybeAddViolation(
						violations,
						allowlist,
						filePath,
						source,
						expression.getStart(source),
						'setTimeout',
						'setTimeout() usage is forbidden in P0 scope; avoid sleeps and timing waits.',
					);
				}
			}
			if (ts.isIdentifier(expression) && expression.text === 'setTimeout') {
				maybeAddViolation(
					violations,
					allowlist,
					filePath,
					source,
					expression.getStart(source),
					'setTimeout',
					'setTimeout() usage is forbidden in P0 scope; avoid sleeps and timing waits.',
				);
			}
			if (ts.isIdentifier(expression) && expression.text === 'sleep') {
				maybeAddViolation(
					violations,
					allowlist,
					filePath,
					source,
					expression.getStart(source),
					'sleep',
					'sleep() usage is forbidden in P0 scope; assertions must be deterministic without arbitrary waits.',
				);
			}
		}
		ts.forEachChild(node, visit);
	};

	visit(source);
}

function runGlobalSetupGuardrail(violations: string[]): void {
	const setupPath = 'vitest.setup.ts';
	const content = readFileSync(setupPath, 'utf8');
	if (!/process\.env\.TZ\s*=\s*['"]UTC['"]/.test(content)) {
		violations.push(`${setupPath}:1:1 - vitest.setup.ts must set process.env.TZ = "UTC" for deterministic P0 runs.`);
	}
	if (!content.includes('disableNetwork();')) {
		violations.push(`${setupPath}:1:1 - vitest.setup.ts must disable network by default for P0 runs.`);
	}
}

export function runP0DeterminismGuardrails(): void {
	const files = collectDeterministicGuardFiles();
	if (files.length === 0) {
		fail('No files matched the P0 determinism guard scope.');
	}

	const allowlist = makeAllowlistSet();
	const violations: string[] = [];

	for (const filePath of files) {
		const text = readFileSync(filePath, 'utf8');
		const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
		runCallsiteGuardrail(filePath, source, allowlist, violations);
	}

	runGlobalSetupGuardrail(violations);

	if (violations.length > 0) {
		fail(
			'Determinism checks failed in P0 scope. Remove non-deterministic calls or add an explicit allowlist entry with reason.',
			violations.join('\n'),
		);
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runP0DeterminismGuardrails();
}
