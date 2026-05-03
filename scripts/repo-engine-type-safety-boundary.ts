import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import * as ts from 'typescript';

const guardedPaths = [
	'packages/rankup/src/runtime',
	'packages/rankup/src/algorithms',
	'packages/rankup/src/registry',
	'packages/rankup/src/shared',
];

const explicitUnknownAllowlist = new Set([
	'packages/rankup/src/runtime/errors.ts',
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
		fail('Unable to list engine source files for type-safety guardrail.');
	}
}

function formatViolation(filePath: string, source: ts.SourceFile, position: number, detail: string): string {
	const location = source.getLineAndCharacterOfPosition(position);
	return `${filePath}:${location.line + 1}:${location.character + 1} - ${detail}`;
}

type ForbiddenTypeKeyword = 'any' | 'unknown' | 'never';

function toForbiddenKeyword(typeNode: ts.TypeNode | undefined): ForbiddenTypeKeyword | null {
	if (!typeNode) {
		return null;
	}
	if (typeNode.kind === ts.SyntaxKind.AnyKeyword) {
		return 'any';
	}
	if (typeNode.kind === ts.SyntaxKind.UnknownKeyword) {
		return 'unknown';
	}
	if (typeNode.kind === ts.SyntaxKind.NeverKeyword) {
		return 'never';
	}
	return null;
}

function isUnderPortContractNode(node: ts.Node): boolean {
	let current: ts.Node | undefined = node;
	while (current) {
		if (ts.isInterfaceDeclaration(current) || ts.isTypeAliasDeclaration(current)) {
			return true;
		}
		current = current.parent;
	}
	return false;
}

function isUnknownKeywordAllowed(filePath: string, node: ts.Node): boolean {
	if (explicitUnknownAllowlist.has(filePath)) {
		return true;
	}
	if (filePath.startsWith('packages/rankup/src/runtime/ports/')) {
		return isUnderPortContractNode(node);
	}
	return false;
}

export function runEngineTypeSafetyBoundaryGuardrail(): void {
	const files = listEngineFiles();
	if (files.length === 0) {
		return;
	}

	const violations: string[] = [];

	for (const filePath of files) {
		const text = readFileSync(filePath, 'utf8');
		const source = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

		const visit = (node: ts.Node): void => {
			if (node.kind === ts.SyntaxKind.AnyKeyword) {
				violations.push(
					formatViolation(
						filePath,
						source,
						node.getStart(source),
						'Engine core forbids `any`. Use a specific type or a well-defined domain model.',
					),
				);
			}

			if (node.kind === ts.SyntaxKind.UnknownKeyword && !isUnknownKeywordAllowed(filePath, node)) {
				violations.push(
					formatViolation(
						filePath,
						source,
						node.getStart(source),
						'Engine core forbids `unknown` outside the explicit allowlist (ports contracts + approved files). Model a concrete type instead.',
					),
				);
			}

			if (ts.isAsExpression(node) || ts.isTypeAssertionExpression(node)) {
				const assertedKeyword = toForbiddenKeyword(node.type);
				if (assertedKeyword) {
					violations.push(
						formatViolation(
							filePath,
							source,
							node.type.getStart(source),
							`Engine core forbids \`as ${assertedKeyword}\`/type-assertion patching. Narrow or model the type explicitly.`,
						),
					);
				}

				if (ts.isAsExpression(node.expression)) {
					const innerKeyword = toForbiddenKeyword(node.expression.type);
					if (innerKeyword) {
						violations.push(
							formatViolation(
								filePath,
								source,
								node.expression.type.getStart(source),
								`Engine core forbids chained assertion patching via \`as ${innerKeyword} as ...\`.`,
							),
						);
					}
				}
			}

			ts.forEachChild(node, visit);
		};

		visit(source);
	}

	if (violations.length > 0) {
		fail(
			'Engine type-safety boundary violated (`any`, unrestricted `unknown`, and assertion patching via `unknown`/`never` are forbidden in engine core paths).',
			violations.join('\n'),
		);
	}
}
