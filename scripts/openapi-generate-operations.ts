import SwaggerParser from '@apidevtools/swagger-parser';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { OpenAPIV3 } from 'openapi-types';

type OperationEntry = {
	operationId: string;
	method: OpenAPIV3.HttpMethods;
	path: string;
	tags: string[];
};

const SPEC_PATH = resolve(process.cwd(), 'packages/api/openapi.yaml');
const OUTPUT_TS = resolve(process.cwd(), 'packages/api/src/generated/operations.ts');
const OUTPUT_JSON = resolve(process.cwd(), 'packages/api/src/generated/operations.json');

const HTTP_METHODS: OpenAPIV3.HttpMethods[] = ['get', 'put', 'post', 'delete', 'patch', 'options', 'head', 'trace'];

function normalizeTags(tags: unknown): string[] {
	if (!Array.isArray(tags)) {
		return [];
	}
	return tags.map(tag => String(tag)).sort();
}

function escapeString(value: string): string {
	return value.replace(/'/g, "\\'");
}

function renderOperationsTs(operations: OperationEntry[]): string {
	const lines: string[] = [];
	lines.push('// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.');
	lines.push('// Source: packages/api/openapi.yaml');
	lines.push('');
	lines.push('export const operations = {');
	for (const operation of operations) {
		const tags = operation.tags.map(tag => `'${escapeString(tag)}'`).join(', ');
		const tagList = tags.length > 0 ? `[${tags}]` : '[]';
		lines.push(`\t'${escapeString(operation.operationId)}': { operationId: '${escapeString(operation.operationId)}', method: '${operation.method}', path: '${escapeString(operation.path)}', tags: ${tagList} },`);
	}
	lines.push('} as const;');
	lines.push('');
	lines.push('export type OperationId = keyof typeof operations;');
	lines.push('export type OperationEntry = (typeof operations)[OperationId];');
	lines.push('export const operationIds = Object.keys(operations) as OperationId[];');
	lines.push('');
	return lines.join('\n');
}

async function main() {
	const document = (await SwaggerParser.parse(SPEC_PATH)) as OpenAPIV3.Document;
	const operations: OperationEntry[] = [];
	const seen = new Map<string, OperationEntry>();
	const paths = document.paths ?? {};

	for (const [path, pathItem] of Object.entries(paths)) {
		if (!pathItem) {
			continue;
		}
		for (const method of HTTP_METHODS) {
			const operation = (pathItem as OpenAPIV3.PathItemObject)[method];
			if (!operation) {
				continue;
			}
			const operationId = operation.operationId;
			if (!operationId) {
				throw new Error(`Missing operationId for ${method.toUpperCase()} ${path}`);
			}
			if (seen.has(operationId)) {
				const existing = seen.get(operationId);
				throw new Error(`Duplicate operationId ${operationId} for ${method.toUpperCase()} ${path} (already used by ${existing?.method.toUpperCase()} ${existing?.path})`);
			}
			const entry: OperationEntry = {
				operationId,
				method,
				path,
				tags: normalizeTags(operation.tags),
			};
			seen.set(operationId, entry);
			operations.push(entry);
		}
	}

	operations.sort((left, right) => left.operationId.localeCompare(right.operationId));

	const tsOutput = renderOperationsTs(operations);
	writeFileSync(OUTPUT_TS, `${tsOutput}\n`, 'utf8');
	writeFileSync(OUTPUT_JSON, `${JSON.stringify({ operations }, null, '\t')}\n`, 'utf8');
}

main().catch(error => {
	console.error('openapi:ops:gen failed');
	console.error(error);
	process.exit(1);
});
