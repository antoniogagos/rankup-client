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

type CanonicalMatchStatus = 'pending' | 'provisional' | 'final' | 'void';

type MatchStatusCatalog = Record<CanonicalMatchStatus, string[]>;

const SPEC_PATH = resolve(process.cwd(), 'packages/api/openapi.yaml');
const OUTPUT_TS = resolve(process.cwd(), 'packages/api/src/generated/operations.ts');
const OUTPUT_JSON = resolve(process.cwd(), 'packages/api/src/generated/operations.json');
const OUTPUT_MATCH_STATUS_TS = resolve(process.cwd(), 'packages/api/src/generated/match-status-catalog.ts');
const OUTPUT_MATCH_STATUS_JSON = resolve(process.cwd(), 'packages/api/src/generated/match-status-catalog.json');

const HTTP_METHODS: OpenAPIV3.HttpMethods[] = ['get', 'put', 'post', 'delete', 'patch', 'options', 'head', 'trace'];
const CANONICAL_MATCH_STATUSES: CanonicalMatchStatus[] = ['pending', 'provisional', 'final', 'void'];

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

function renderMatchStatusCatalogTs(catalog: MatchStatusCatalog): string {
	const knownProviderStatuses: string[] = [];
	const seen = new Set<string>();
	for (const status of CANONICAL_MATCH_STATUSES) {
		for (const providerStatus of catalog[status]) {
			if (seen.has(providerStatus)) {
				continue;
			}
			seen.add(providerStatus);
			knownProviderStatuses.push(providerStatus);
		}
	}

	const lines: string[] = [];
	lines.push('// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.');
	lines.push('// Source: packages/api/openapi.yaml (components.schemas.MatchStatus.x-rankup-canonical-statuses)');
	lines.push('');
	lines.push('export const matchStatusCatalog = {');
	for (const status of CANONICAL_MATCH_STATUSES) {
		const providerStatuses = catalog[status].map(value => `'${escapeString(value)}'`).join(', ');
		lines.push(`\t${status}: [${providerStatuses}],`);
	}
	lines.push('} as const;');
	lines.push('');
	lines.push("export type CanonicalMatchStatus = 'pending' | 'provisional' | 'final' | 'void';");
	lines.push(`export const knownProviderMatchStatuses = [${knownProviderStatuses.map(value => `'${escapeString(value)}'`).join(', ')}] as const;`);
	lines.push('');
	return lines.join('\n');
}

function resolveMatchStatusCatalog(document: OpenAPIV3.Document): MatchStatusCatalog {
	const schemaCandidate = document.components?.schemas?.MatchStatus;
	if (!schemaCandidate || '$ref' in schemaCandidate) {
		throw new Error('Missing concrete components.schemas.MatchStatus in OpenAPI document');
	}

	const extensionValue = (schemaCandidate as Record<string, unknown>)['x-rankup-canonical-statuses'];
	if (!extensionValue || typeof extensionValue !== 'object' || Array.isArray(extensionValue)) {
		throw new Error('MatchStatus must declare x-rankup-canonical-statuses object in OpenAPI');
	}

	const catalog: MatchStatusCatalog = {
		pending: [],
		provisional: [],
		final: [],
		void: [],
	};
	const seenProviderStatuses = new Set<string>();

	for (const canonicalStatus of CANONICAL_MATCH_STATUSES) {
		const groupValue = (extensionValue as Record<string, unknown>)[canonicalStatus];
		if (!Array.isArray(groupValue)) {
			throw new Error(`MatchStatus x-rankup-canonical-statuses.${canonicalStatus} must be an array`);
		}

		const normalized: string[] = [];
		for (const candidate of groupValue) {
			if (typeof candidate !== 'string') {
				throw new Error(`MatchStatus x-rankup-canonical-statuses.${canonicalStatus} must contain strings only`);
			}
			const value = candidate.trim();
			if (!value) {
				throw new Error(`MatchStatus x-rankup-canonical-statuses.${canonicalStatus} cannot contain empty strings`);
			}
			if (normalized.includes(value)) {
				throw new Error(`MatchStatus x-rankup-canonical-statuses.${canonicalStatus} contains duplicate value "${value}"`);
			}
			if (seenProviderStatuses.has(value)) {
				throw new Error(`MatchStatus x-rankup-canonical-statuses value "${value}" appears in more than one canonical bucket`);
			}
			normalized.push(value);
			seenProviderStatuses.add(value);
		}

		catalog[canonicalStatus] = normalized;
	}

	return catalog;
}

async function main() {
	const document = (await SwaggerParser.parse(SPEC_PATH)) as OpenAPIV3.Document;
	const matchStatusCatalog = resolveMatchStatusCatalog(document);
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
	const matchStatusTsOutput = renderMatchStatusCatalogTs(matchStatusCatalog);
	writeFileSync(OUTPUT_TS, `${tsOutput}\n`, 'utf8');
	writeFileSync(OUTPUT_JSON, `${JSON.stringify({ operations }, null, '\t')}\n`, 'utf8');
	writeFileSync(OUTPUT_MATCH_STATUS_TS, `${matchStatusTsOutput}\n`, 'utf8');
	writeFileSync(OUTPUT_MATCH_STATUS_JSON, `${JSON.stringify({ matchStatusCatalog }, null, '\t')}\n`, 'utf8');
}

main().catch(error => {
	console.error('openapi:ops:gen failed');
	console.error(error);
	process.exit(1);
});
