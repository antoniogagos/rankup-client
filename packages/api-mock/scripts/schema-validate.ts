import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv, { type ValidateFunction } from 'ajv';
import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPIV3 } from 'openapi-types';
import { startOpenApiMockServer } from '../src/server/openapi-contract.js';

type OperationEntry = {
	operationId: string;
	method: string;
	path: string;
	tags: string[];
};

type OperationManifest = {
	operations: OperationEntry[];
};

type WaiverEntry = {
	operationId: string;
	waiverType: string;
};

type Fixture = {
	operationId: string;
	params?: Record<string, unknown>;
	query?: Record<string, unknown>;
	headers?: Record<string, string>;
	body?: unknown;
	expect?: {
		status?: number;
		contentType?: string;
	};
};

const SPEC_PATH = resolve(process.cwd(), 'packages/api/openapi.yaml');
const OPERATIONS_PATH = resolve(process.cwd(), 'packages/api/src/generated/operations.json');
const WAIVERS_PATH = resolve(process.cwd(), 'diagnostics/operation-waivers.json');
const BASELINE_PATH = resolve(process.cwd(), 'diagnostics/parity-baseline-operations.json');
const COVERAGE_SCOPE = process.env.OPERATION_COVERAGE_SCOPE === 'global' ? 'global' : 'baseline';

type ParityBaseline = {
	operationIds: string[];
};

const ajv = new Ajv({
	allErrors: true,
	coerceTypes: 'array',
	strict: false,
	validateFormats: false,
});

if (!ajv.getKeyword('nullable')) {
	ajv.addKeyword('nullable');
}

function readJson<T>(path: string): T {
	return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function normalizeContentType(value: string | null | undefined): string {
	if (!value) {
		return '';
	}
	return value.split(';')[0]?.trim().toLowerCase();
}

function isAdminOperation(entry: OperationEntry): boolean {
	const tags = entry.tags ?? [];
	if (tags.some(tag => tag === 'admin' || tag.startsWith('admin.'))) {
		return true;
	}
	return entry.path.startsWith('/admin');
}

function loadWaivers(): Map<string, Set<string>> {
	const raw = readJson<unknown>(WAIVERS_PATH);
	if (!Array.isArray(raw)) {
		throw new Error('operation-waivers.json must be a JSON array.');
	}
	const map = new Map<string, Set<string>>();
	for (const waiver of raw as WaiverEntry[]) {
		if (!waiver || typeof waiver !== 'object') {
			continue;
		}
		const set = map.get(waiver.operationId) ?? new Set<string>();
		set.add(waiver.waiverType);
		map.set(waiver.operationId, set);
	}
	return map;
}

function loadBaselineOperationIds(): Set<string> {
	const raw = readJson<ParityBaseline>(BASELINE_PATH);
	if (!raw || !Array.isArray(raw.operationIds)) {
		throw new Error('parity-baseline-operations.json must include operationIds[].');
	}
	return new Set(raw.operationIds);
}

function isInScope(entry: OperationEntry, baselineOperationIds: Set<string> | null): boolean {
	if (isAdminOperation(entry)) {
		return false;
	}
	if (!baselineOperationIds) {
		return true;
	}
	return baselineOperationIds.has(entry.operationId);
}

function buildOperationMap(spec: OpenAPIV3.Document): Map<string, { operation: OpenAPIV3.OperationObject }> {
	const map = new Map<string, { operation: OpenAPIV3.OperationObject }>();
	const paths = spec.paths ?? {};
	for (const pathItem of Object.values(paths)) {
		if (!pathItem) continue;
		const item = pathItem as OpenAPIV3.PathItemObject;
		for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
			const operation = (item as Record<string, OpenAPIV3.OperationObject | undefined>)[method];
			if (!operation?.operationId) continue;
			map.set(operation.operationId, { operation });
		}
	}
	return map;
}

function toResponseObject(response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined): OpenAPIV3.ResponseObject | undefined {
	if (!response || '$ref' in response) {
		return undefined;
	}
	return response;
}

function collectExpectedResponseHeaders(operation: OpenAPIV3.OperationObject, status: number): string[] {
	const responses = operation.responses ?? {};
	const statusKey = String(status);
	const direct = toResponseObject(responses[statusKey] as OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined);
	if (direct?.headers) {
		return Object.keys(direct.headers);
	}
	const rangeKey = `${Math.floor(status / 100)}XX`;
	const ranged = toResponseObject(responses[rangeKey] as OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined);
	if (ranged?.headers) {
		return Object.keys(ranged.headers);
	}
	const fallback = toResponseObject(responses.default as OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined);
	return fallback?.headers ? Object.keys(fallback.headers) : [];
}

function hasResponseHeader(response: Response, headerName: string): boolean {
	return response.headers.has(headerName);
}

function selectResponseSchema(operation: OpenAPIV3.OperationObject, status: number, contentType: string): OpenAPIV3.SchemaObject | undefined {
	const responses = operation.responses ?? {};
	const statusKey = String(status);
	const response =
		(responses[statusKey] as OpenAPIV3.ResponseObject | undefined) ??
		(responses.default as OpenAPIV3.ResponseObject | undefined);
	if (!response) {
		return undefined;
	}
	const content = response.content ?? {};
	const normalized = normalizeContentType(contentType);
	if (normalized && content[normalized]?.schema) {
		return content[normalized]?.schema as OpenAPIV3.SchemaObject;
	}
	if (normalized.endsWith('+json') && content['application/json']?.schema) {
		return content['application/json']?.schema as OpenAPIV3.SchemaObject;
	}
	const fallbackMedia = Object.keys(content)[0];
	return fallbackMedia ? (content[fallbackMedia]?.schema as OpenAPIV3.SchemaObject | undefined) : undefined;
}

function buildPath(template: string, params?: Record<string, unknown>): string {
	return template.replace(/\{([^}]+)\}/g, (_match, key) => {
		const value = params?.[key];
		if (value === undefined || value === null) {
			throw new Error(`Missing path param "${key}"`);
		}
		return encodeURIComponent(String(value));
	});
}

function applyQuery(url: URL, query?: Record<string, unknown>): void {
	if (!query) {
		return;
	}
	Object.entries(query).forEach(([key, value]) => {
		if (value === undefined || value === null) {
			return;
		}
		if (Array.isArray(value)) {
			url.searchParams.set(key, value.map(item => String(item)).join(','));
			return;
		}
		url.searchParams.set(key, String(value));
	});
}

function loadFixtures(): { fixtures: Fixture[]; byOperation: Map<string, Fixture[]>; errors: string[] } {
	const result: Fixture[] = [];
	const byOperation = new Map<string, Fixture[]>();
	const errors: string[] = [];
	let files: string[] = [];
	try {
		const output = readFileSync(resolve(process.cwd(), 'packages/api-mock/src/fixtures/.gitkeep'), 'utf8');
		void output;
	} catch {
		// noop
	}
	try {
		const output = execSync('rg --files -g "*.json" packages/api-mock/src/fixtures', { encoding: 'utf8' }).toString().trim();
		if (output) {
			files = output.split('\n').map(line => line.trim()).filter(Boolean);
		}
	} catch (error) {
		// rg returns exit 1 if no files
		const status = (error as { status?: number }).status;
		if (status !== 1) {
			throw error;
		}
	}

	for (const file of files) {
		const data = readJson<Fixture>(file);
		if (!data?.operationId) {
			errors.push(`${file}: missing operationId`);
			continue;
		}
		result.push(data);
		const list = byOperation.get(data.operationId) ?? [];
		list.push(data);
		byOperation.set(data.operationId, list);
	}

	return { fixtures: result, byOperation, errors };
}

async function run() {
	const manifest = readJson<OperationManifest>(OPERATIONS_PATH);
	if (!manifest || !Array.isArray(manifest.operations)) {
		throw new Error('operations.json must include an operations array.');
	}

	const waivers = loadWaivers();
	const baselineOperationIds = COVERAGE_SCOPE === 'baseline' ? loadBaselineOperationIds() : null;
	const { fixtures, byOperation, errors: fixtureErrors } = loadFixtures();
	const missingFixtures: OperationEntry[] = [];

	const operationsMap = new Map<string, OperationEntry>();
	for (const entry of manifest.operations) {
		operationsMap.set(entry.operationId, entry);
	}
	const unknownBaselineIds = baselineOperationIds ? [...baselineOperationIds].filter(operationId => !operationsMap.has(operationId)) : [];

	for (const entry of manifest.operations) {
		if (!isInScope(entry, baselineOperationIds)) {
			continue;
		}
		if (byOperation.has(entry.operationId)) {
			continue;
		}
		const waiverTypes = waivers.get(entry.operationId);
		if (!waiverTypes?.has('missingFixture')) {
			missingFixtures.push(entry);
		}
	}

	if (fixtureErrors.length > 0 || unknownBaselineIds.length > 0 || missingFixtures.length > 0) {
		console.error('api-mock:schema-validate failed');
		for (const error of fixtureErrors) {
			console.error(`- ${error}`);
		}
		for (const operationId of unknownBaselineIds) {
			console.error(`- Baseline operationId "${operationId}" not found in operations manifest`);
		}
		for (const entry of missingFixtures) {
			console.error(`- Missing fixture for ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path})`);
		}
		process.exit(1);
	}

	const spec = (await SwaggerParser.dereference(SPEC_PATH)) as OpenAPIV3.Document;
	const operationMap = buildOperationMap(spec);
	const server = await startOpenApiMockServer({ specPath: SPEC_PATH });

	const validatorCache = new Map<string, ValidateFunction>();
	const errors: string[] = [];

	for (const fixture of fixtures) {
		const entry = operationsMap.get(fixture.operationId);
		if (!entry) {
			errors.push(`Unknown operationId in fixture: ${fixture.operationId}`);
			continue;
		}
		if (!isInScope(entry, baselineOperationIds)) {
			continue;
		}
		const waiverTypes = waivers.get(fixture.operationId);
		if (waiverTypes?.has('schemaValidationFlaky')) {
			continue;
		}
		const specEntry = operationMap.get(fixture.operationId);
		if (!specEntry) {
			errors.push(`OpenAPI spec missing operationId ${fixture.operationId}`);
			continue;
		}

		let path: string;
		try {
			path = buildPath(entry.path, fixture.params);
		} catch (error) {
			errors.push(`${fixture.operationId}: ${(error as Error).message}`);
			continue;
		}
		const url = new URL(`${server.baseUrl}${path}`);
		applyQuery(url, fixture.query);

		const headers: Record<string, string> = {
			'x-rankup-mock-reset': 'true',
			...(fixture.headers ?? {}),
		};
		let body: string | undefined;
		if (fixture.body !== undefined && fixture.body !== null) {
			body = JSON.stringify(fixture.body);
			if (!headers['content-type']) {
				headers['content-type'] = 'application/json';
			}
		}

		const response = await fetch(url.toString(), {
			method: entry.method.toUpperCase(),
			redirect: 'manual',
			headers,
			body,
		});

		const status = response.status;
		const contentType = normalizeContentType(response.headers.get('content-type'));
		const isJson = contentType.includes('json') || contentType.endsWith('+json');
		const payload = status === 204 ? null : isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

		if (fixture.expect?.status !== undefined && fixture.expect.status !== status) {
			errors.push(`${fixture.operationId}: expected status ${fixture.expect.status}, got ${status}`);
			continue;
		}
		if (fixture.expect?.contentType && !contentType.includes(fixture.expect.contentType)) {
			errors.push(`${fixture.operationId}: expected content-type ${fixture.expect.contentType}, got ${contentType || 'none'}`);
			continue;
		}
		if (fixture.expect?.status === undefined && status >= 400) {
			errors.push(`${fixture.operationId}: unexpected status ${status}`);
			continue;
		}

		const expectedHeaders = collectExpectedResponseHeaders(specEntry.operation, status);
		for (const headerName of expectedHeaders) {
			if (!hasResponseHeader(response, headerName)) {
				errors.push(`${fixture.operationId}: missing required response header "${headerName}" for status ${status}`);
			}
		}

		const schema = selectResponseSchema(specEntry.operation, status, contentType);
		if (!schema || !isJson) {
			continue;
		}
		const cacheKey = `${fixture.operationId}:${status}:${contentType}`;
		let validator = validatorCache.get(cacheKey);
		if (!validator) {
			validator = ajv.compile(schema);
			validatorCache.set(cacheKey, validator);
		}
		const valid = validator(payload);
		if (!valid) {
			errors.push(`${fixture.operationId}: response schema invalid (${validator.errors?.map(err => err.message).join(', ') ?? 'unknown'})`);
		}
	}

	server.server.close();

	if (errors.length > 0) {
		console.error('api-mock:schema-validate failed');
		for (const error of errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}
}

run().catch(error => {
	console.error('api-mock:schema-validate failed');
	console.error(error);
	process.exit(1);
});
