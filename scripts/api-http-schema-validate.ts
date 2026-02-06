import { execSync } from 'child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv, { type ValidateFunction } from 'ajv';
import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPIV3 } from 'openapi-types';
import { startOpenApiMockServer } from '../packages/api-mock/src/server/openapi-contract.js';
import { createHttpRankupApiClient } from '../apps/rankup-spa/services/api/http-client.js';

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

function buildOperationMap(spec: OpenAPIV3.Document): Map<string, { operation: OpenAPIV3.OperationObject; hasSse: boolean }> {
	const map = new Map<string, { operation: OpenAPIV3.OperationObject; hasSse: boolean }>();
	const paths = spec.paths ?? {};
	for (const pathItem of Object.values(paths)) {
		if (!pathItem) continue;
		const item = pathItem as OpenAPIV3.PathItemObject;
		for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
			const operation = (item as Record<string, OpenAPIV3.OperationObject | undefined>)[method];
			if (!operation?.operationId) continue;
			const responses = operation.responses ?? {};
			const hasSse = Object.values(responses).some(resp => {
				const response = resp as OpenAPIV3.ResponseObject | undefined;
				const content = response?.content ?? {};
				return Object.keys(content).some(contentType => normalizeContentType(contentType) === 'text/event-stream');
			});
			map.set(operation.operationId, { operation, hasSse });
		}
	}
	return map;
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

function loadFixtures(): { fixtures: Fixture[]; byOperation: Map<string, Fixture[]>; errors: string[] } {
	const result: Fixture[] = [];
	const byOperation = new Map<string, Fixture[]>();
	const errors: string[] = [];
	let files: string[] = [];
	try {
		const output = execSync('rg --files -g "*.json" packages/api-mock/src/fixtures', { encoding: 'utf8' }).toString().trim();
		if (output) {
			files = output.split('\n').map(line => line.trim()).filter(Boolean);
		}
	} catch (error) {
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

function buildArgs(fixture: Fixture): unknown[] {
	const hasParams = fixture.params && Object.keys(fixture.params).length > 0;
	const hasQuery = fixture.query && Object.keys(fixture.query).length > 0;
	const hasBody = fixture.body !== undefined && fixture.body !== null;

	if (hasParams && hasBody) {
		return [fixture.params, fixture.body];
	}
	if (hasParams && hasQuery) {
		return [fixture.params, fixture.query];
	}
	if (hasParams) {
		return [fixture.params];
	}
	if (hasBody) {
		return [fixture.body];
	}
	if (hasQuery) {
		return [fixture.query];
	}
	return [];
}

async function run() {
	const manifest = readJson<OperationManifest>(OPERATIONS_PATH);
	if (!manifest || !Array.isArray(manifest.operations)) {
		throw new Error('operations.json must include an operations array.');
	}

	const waivers = loadWaivers();
	const { fixtures, byOperation, errors: fixtureErrors } = loadFixtures();
	const missingFixtures: OperationEntry[] = [];

	for (const entry of manifest.operations) {
		if (isAdminOperation(entry)) {
			continue;
		}
		if (byOperation.has(entry.operationId)) {
			continue;
		}
		const waiverTypes = waivers.get(entry.operationId);
		if (!waiverTypes?.has('httpFidelityMissing')) {
			missingFixtures.push(entry);
		}
	}

	if (fixtureErrors.length > 0 || missingFixtures.length > 0) {
		console.error('api-http:schema-validate failed');
		for (const error of fixtureErrors) {
			console.error(`- ${error}`);
		}
		for (const entry of missingFixtures) {
			console.error(`- Missing fixture (http fidelity) for ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path})`);
		}
		process.exit(1);
	}

	const spec = (await SwaggerParser.dereference(SPEC_PATH)) as OpenAPIV3.Document;
	const operationMap = buildOperationMap(spec);
	const server = await startOpenApiMockServer({ specPath: SPEC_PATH });

	const responseState = {
		status: 0,
		contentType: '',
		body: null as unknown,
	};

	const fetchFn: typeof fetch = async (input, init) => {
		const response = await fetch(input, init);
		const clone = response.clone();
		const contentType = normalizeContentType(clone.headers.get('content-type'));
		let payload: unknown = null;
		if (response.status !== 204) {
			if (contentType.includes('json') || contentType.endsWith('+json')) {
				payload = await clone.json().catch(() => null);
			} else {
				payload = await clone.text().catch(() => '');
			}
		}
		responseState.status = response.status;
		responseState.contentType = contentType;
		responseState.body = payload;
		return response;
	};

	const client = createHttpRankupApiClient({
		apiBaseUrl: server.baseUrl,
		fetchFn,
	});

	const validatorCache = new Map<string, ValidateFunction>();
	const errors: string[] = [];

	for (const fixture of fixtures) {
		const entry = manifest.operations.find(op => op.operationId === fixture.operationId);
		if (!entry) {
			errors.push(`Unknown operationId in fixture: ${fixture.operationId}`);
			continue;
		}
		if (isAdminOperation(entry)) {
			continue;
		}
		const waiverTypes = waivers.get(fixture.operationId);
		if (waiverTypes?.has('httpFidelityMissing') || waiverTypes?.has('schemaValidationFlaky')) {
			continue;
		}
		const specEntry = operationMap.get(fixture.operationId);
		if (!specEntry) {
			errors.push(`OpenAPI spec missing operationId ${fixture.operationId}`);
			continue;
		}
		if (specEntry.hasSse) {
			errors.push(`${fixture.operationId}: SSE operation requires httpFidelityMissing waiver`);
			continue;
		}

		const clientFn = (client as Record<string, unknown>)[fixture.operationId];
		if (typeof clientFn !== 'function') {
			errors.push(`${fixture.operationId}: http client missing method (add waiver httpFidelityMissing)`);
			continue;
		}

		try {
			const args = buildArgs(fixture);
			await (clientFn as (...args: unknown[]) => Promise<unknown>)(...args);
		} catch (error) {
			errors.push(`${fixture.operationId}: http client call failed (${(error as Error).message})`);
			continue;
		}

		const status = responseState.status;
		const contentType = responseState.contentType;
		const isJson = contentType.includes('json') || contentType.endsWith('+json');

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
		const valid = validator(responseState.body);
		if (!valid) {
			errors.push(`${fixture.operationId}: response schema invalid (${validator.errors?.map(err => err.message).join(', ') ?? 'unknown'})`);
		}
	}

	server.server.close();

	if (errors.length > 0) {
		console.error('api-http:schema-validate failed');
		for (const error of errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}
}

run().catch(error => {
	console.error('api-http:schema-validate failed');
	console.error(error);
	process.exit(1);
});
