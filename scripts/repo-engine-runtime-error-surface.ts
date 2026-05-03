import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import * as ts from 'typescript';

const runtimeRoot = 'packages/rankup/src/runtime';

function fail(message: string, output?: string): never {
	console.error('repo:guardrails failed');
	console.error(`- ${message}`);
	if (output) {
		console.error(output);
	}
	process.exit(1);
}

function listRuntimeFiles(): string[] {
	const command = `rg --files --glob "*.ts" ${runtimeRoot}`;
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
		fail('Unable to list runtime files for generic-error guardrail.');
	}
}

function formatViolation(filePath: string, source: ts.SourceFile, position: number, detail: string): string {
	const location = source.getLineAndCharacterOfPosition(position);
	return `${filePath}:${location.line + 1}:${location.character + 1} - ${detail}`;
}

function isGenericErrorThrow(expression: ts.Expression): boolean {
	if (ts.isNewExpression(expression)) {
		return ts.isIdentifier(expression.expression) && expression.expression.text === 'Error';
	}
	if (ts.isCallExpression(expression)) {
		return ts.isIdentifier(expression.expression) && expression.expression.text === 'Error';
	}
	return false;
}

export function runEngineRuntimeErrorSurfaceGuardrail(): void {
	const files = listRuntimeFiles();
	if (files.length === 0) {
		return;
	}

	const violations: string[] = [];

	for (const filePath of files) {
		const text = readFileSync(filePath, 'utf8');
		const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

		const visit = (node: ts.Node): void => {
			if (ts.isThrowStatement(node) && node.expression && isGenericErrorThrow(node.expression)) {
				violations.push(
					formatViolation(
						filePath,
						source,
						node.expression.getStart(source),
						'Runtime must not throw generic Error(). Use RuntimeProblem (or a domain-specific mapped error) with canonical code/status/detail.',
					),
				);
			}
			ts.forEachChild(node, visit);
		};

		visit(source);
	}

	if (violations.length > 0) {
		fail(
			'Engine runtime error surface violated: generic Error throws are forbidden in packages/rankup/src/runtime/**.',
			violations.join('\n'),
		);
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runEngineRuntimeErrorSurfaceGuardrail();
}
