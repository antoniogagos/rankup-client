import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const CORE_DIR = resolve(process.cwd(), 'packages/api-mock/src/core');
const MATCH_STATUS_MAPPING_FILE = resolve(CORE_DIR, 'match-status.ts');
const TYPES_FILE = resolve(CORE_DIR, 'types.ts');

const PROVIDER_STATUS_LITERAL_PATTERN = /['"](LIVE|IN_PLAY|HT|FT|AET|PEN|FINAL|NS|POSTP|CANCL|CANC|ABAN)['"]/g;

type Violation = {
	file: string;
	line: number;
	column: number;
	match: string;
};

function collectTsFiles(directory: string): string[] {
	const files: string[] = [];
	for (const entry of readdirSync(directory)) {
		const absolutePath = resolve(directory, entry);
		const stats = statSync(absolutePath);
		if (stats.isDirectory()) {
			files.push(...collectTsFiles(absolutePath));
			continue;
		}
		if (stats.isFile() && absolutePath.endsWith('.ts')) {
			files.push(absolutePath);
		}
	}
	return files;
}

function findProviderStatusLiteralViolations(filePath: string): Violation[] {
	const source = readFileSync(filePath, 'utf8');
	const violations: Violation[] = [];
	PROVIDER_STATUS_LITERAL_PATTERN.lastIndex = 0;
	let match = PROVIDER_STATUS_LITERAL_PATTERN.exec(source);
	while (match) {
		const index = match.index;
		const prefix = source.slice(0, index);
		const line = prefix.split('\n').length;
		const lastLineStart = prefix.lastIndexOf('\n');
		const column = index - (lastLineStart >= 0 ? lastLineStart : -1);
		violations.push({
			file: filePath,
			line,
			column,
			match: match[0] ?? '',
		});
		match = PROVIDER_STATUS_LITERAL_PATTERN.exec(source);
	}
	return violations;
}

function runProviderStatusLiteralGuardrail(): void {
	const files = collectTsFiles(CORE_DIR);
	const violations: Violation[] = [];

	for (const filePath of files) {
		if (filePath === MATCH_STATUS_MAPPING_FILE) {
			continue;
		}
		violations.push(...findProviderStatusLiteralViolations(filePath));
	}

	if (violations.length > 0) {
		console.error('repo:openapi-sot-drift failed');
		console.error('- Provider match status literals are forbidden in api-mock core files (except canonical mapping module).');
		for (const violation of violations) {
			console.error(`  - ${violation.file}:${violation.line}:${violation.column} -> ${violation.match}`);
		}
		process.exit(1);
	}
}

function runMatchStatusCatalogSourceGuardrail(): void {
	const source = readFileSync(MATCH_STATUS_MAPPING_FILE, 'utf8');
	if (!source.includes("from '@rankup/api/generated/match-status-catalog.js'")) {
		console.error('repo:openapi-sot-drift failed');
		console.error('- packages/api-mock/src/core/match-status.ts must import @rankup/api/generated/match-status-catalog.js.');
		process.exit(1);
	}

	const literalViolations = findProviderStatusLiteralViolations(MATCH_STATUS_MAPPING_FILE);
	if (literalViolations.length > 0) {
		console.error('repo:openapi-sot-drift failed');
		console.error('- packages/api-mock/src/core/match-status.ts must not hardcode provider status literals; use generated catalog only.');
		for (const violation of literalViolations) {
			console.error(`  - ${violation.file}:${violation.line}:${violation.column} -> ${violation.match}`);
		}
		process.exit(1);
	}
}

function runOperationIdTypeGuardrail(): void {
	const source = readFileSync(TYPES_FILE, 'utf8');
	if (/export\s+type\s+OperationId\s*=\s*\n\s*\|/.test(source)) {
		console.error('repo:openapi-sot-drift failed');
		console.error('- packages/api-mock/src/core/types.ts must not declare manual OperationId literal unions; derive from generated OpenAPI operations.');
		process.exit(1);
	}
}

export function runOpenApiSotDriftGuardrail(): void {
	runProviderStatusLiteralGuardrail();
	runMatchStatusCatalogSourceGuardrail();
	runOperationIdTypeGuardrail();
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runOpenApiSotDriftGuardrail();
}
