import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SPEC_PATH = resolve(process.cwd(), 'packages/api/openapi.yaml');

function countIndent(line: string): number {
	let count = 0;
	for (const char of line) {
		if (char === ' ') {
			count += 1;
			continue;
		}
		if (char === '\t') {
			count += 4;
			continue;
		}
		break;
	}
	return count;
}

function blockHasEntry(lines: string[], startIndex: number, baseIndent: number, entry: string): boolean {
	for (let index = startIndex + 1; index < lines.length; index += 1) {
		const line = lines[index];
		if (!line.trim()) {
			continue;
		}
		const indent = countIndent(line);
		if (indent <= baseIndent) {
			return false;
		}
		if (indent === baseIndent + 4 && line.trim().startsWith(`${entry}:`)) {
			return true;
		}
	}
	return false;
}

function insertDefaultProblem(lines: string[]): { lines: string[]; inserted: number } {
	const output: string[] = [];
	let topLevel = '';
	let inserted = 0;

	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		const trimmed = line.trim();
		const indent = countIndent(line);
		if (indent === 0 && trimmed.endsWith(':')) {
			topLevel = trimmed.slice(0, -1);
		}
		if (topLevel === 'components' && trimmed === 'responses:') {
			const baseIndent = indent;
			const hasDefault = blockHasEntry(lines, index, baseIndent, 'DefaultProblem');
			output.push(line);
			if (!hasDefault) {
				const entryIndent = ' '.repeat(baseIndent + 4);
				output.push(`${entryIndent}DefaultProblem:`);
				output.push(`${entryIndent}    description: Generic Problem Details response.`);
				output.push(`${entryIndent}    headers:`);
				output.push(`${entryIndent}        X-Request-Id:`);
				output.push(`${entryIndent}            $ref: "#/components/headers/X-Request-Id"`);
				output.push(`${entryIndent}    content:`);
				output.push(`${entryIndent}        application/problem+json:`);
				output.push(`${entryIndent}            schema:`);
				output.push(`${entryIndent}                $ref: "#/components/schemas/Problem"`);
				inserted += 1;
			}
			continue;
		}
		if (topLevel === 'paths' && trimmed === 'responses:') {
			const baseIndent = indent;
			const hasDefault = blockHasEntry(lines, index, baseIndent, 'default');
			output.push(line);
			if (!hasDefault) {
				const entryIndent = ' '.repeat(baseIndent + 4);
				output.push(`${entryIndent}default:`);
				output.push(`${entryIndent}    $ref: "#/components/responses/DefaultProblem"`);
				inserted += 1;
			}
			continue;
		}
		output.push(line);
	}

	return { lines: output, inserted };
}

function main(): void {
	const input = readFileSync(SPEC_PATH, 'utf8');
	const lines = input.split('\n');
	const result = insertDefaultProblem(lines);
	if (result.inserted === 0) {
		return;
	}
	writeFileSync(SPEC_PATH, result.lines.join('\n'), 'utf8');
}

try {
	main();
} catch (error) {
	console.error('openapi:add-default-problem failed');
	console.error(error);
	process.exit(1);
}
