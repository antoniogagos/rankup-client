import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { once } from 'node:events';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv';
import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPIV3 } from 'openapi-types';
import type { MockDb } from '../mock-db.js';
import { resetMockDb } from '../mock-db.js';
import { resetEngineMockHarness } from '../core/engine-runtime.js';
import { createMockRegistry, executeMockHandler } from '../core/registry.js';
import type { MockRegistry } from '../core/registry.js';
import type { ScenarioDefaults } from '../core/scenario.js';
import { parseScenarioOverrides, resolveScenario } from '../core/scenario.js';
import type { MockHandlerContextMap, MockHandlers, OperationId } from '../core/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEFAULT_SPEC_PATH = resolve(__dirname, '../../../..', 'packages/api/openapi.yaml');

const DEFAULT_HEADERS = {
	'access-control-allow-origin': '*',
	'access-control-allow-headers': 'content-type, authorization, x-idempotency-key',
	'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
};

type RequestSchemaMap = Record<string, OpenAPIV3.SchemaObject>;

type ValidationIssue = {
	location: 'path' | 'query' | 'body';
	message: string;
	instancePath?: string;
	schemaPath?: string;
	keyword?: string;
	params?: Record<string, unknown>;
};

type OperationEntry = {
	operationId: string;
	method: string;
	path: string;
	pathRegex: RegExp;
	pathKeys: string[];
	requestBodyRequired: boolean;
	requestBodySchemas: RequestSchemaMap;
	requestBodyValidators: Map<string, ValidateFunction>;
	pathValidator?: ValidateFunction;
	queryValidator?: ValidateFunction;
	responseStatus: number;
	responseMediaType: string;
	responseSchema?: OpenAPIV3.SchemaObject;
	responses: OpenAPIV3.ResponsesObject;
};

type MatchResult = {
	operation: OperationEntry;
	params: Record<string, string>;
};

type QueryValue = string | string[];

type Logger = Pick<Console, 'info' | 'warn' | 'error'>;

export type OpenApiMockServerOptions = {
	specPath?: string;
	logger?: Logger;
	db?: MockDb;
	handlers?: Partial<MockHandlers>;
	registry?: ReturnType<typeof createMockRegistry>;
	useCoreHandlers?: boolean;
	scenario?: ScenarioDefaults;
};

export type OpenApiMockServer = {
	server: Server;
	spec: OpenAPIV3.Document;
	operations: OperationEntry[];
	registry?: MockRegistry;
};

export type OpenApiMockServerRunning = OpenApiMockServer & {
	port: number;
	baseUrl: string;
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

function normalizeHeaders(headers: IncomingMessage['headers']): Record<string, string | string[]> {
	const normalized: Record<string, string | string[]> = {};
	for (const [key, value] of Object.entries(headers)) {
		if (typeof value === 'string' || Array.isArray(value)) {
			normalized[key] = value;
		}
	}
	return normalized;
}

async function readBody(req: IncomingMessage): Promise<string> {
	let raw = '';
	for await (const chunk of req) {
		raw += typeof chunk === 'string' ? chunk : chunk.toString('utf8');
	}
	return raw;
}

function normalizeContentType(value: string | undefined) {
	if (!value) return undefined;
	return value.split(';')[0]?.trim().toLowerCase();
}

function parseBody(raw: string, contentType: string | undefined): unknown {
	if (!raw) return undefined;
	const normalizedType = normalizeContentType(contentType) ?? '';
	if (normalizedType.includes('application/json') || normalizedType.endsWith('+json')) {
		return JSON.parse(raw);
	}
	if (normalizedType.includes('application/x-www-form-urlencoded')) {
		return Object.fromEntries(new URLSearchParams(raw));
	}
	return raw;
}

function parseQueryParams(searchParams: URLSearchParams): Record<string, QueryValue> {
	const query: Record<string, QueryValue> = {};
	for (const [key, value] of searchParams.entries()) {
		if (key in query) {
			const existing = query[key];
			query[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
		} else {
			query[key] = value;
		}
	}
	return query;
}

function sleep(durationMs: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(resolve, durationMs);
	});
}

function sendJson(res: ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}, contentType: string = 'application/json') {
	res.writeHead(status, {
		'content-type': contentType,
		...DEFAULT_HEADERS,
		...headers,
	});
	res.end(JSON.stringify(body));
}

function sendText(
	res: ServerResponse,
	status: number,
	text: string,
	contentType = 'text/plain; charset=utf-8',
	headers: Record<string, string> = {},
) {
	res.writeHead(status, {
		'content-type': contentType,
		...DEFAULT_HEADERS,
		...headers,
	});
	res.end(text);
}

function sendResponse(res: ServerResponse, status: number, body: unknown, mediaType: string, headers: Record<string, string> = {}) {
	if (status === 204) {
		res.writeHead(status, { ...DEFAULT_HEADERS, ...headers });
		res.end();
		return;
	}
	const normalized = normalizeContentType(mediaType) ?? '';
	if (normalized.includes('json') || normalized.endsWith('+json')) {
		sendJson(res, status, body, headers, mediaType);
		return;
	}
	if (body == null) {
		sendText(res, status, '', mediaType, headers);
		return;
	}
	if (typeof body === 'string') {
		sendText(res, status, body, mediaType, headers);
		return;
	}
	sendText(res, status, JSON.stringify(body), mediaType, headers);
}

function escapeRegex(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compilePath(pathTemplate: string) {
	const keys: string[] = [];
	const escaped = escapeRegex(pathTemplate);
	const pattern = escaped.replace(/\\\{([^}]+)\\\}/g, (_match, key) => {
		keys.push(String(key));
		return '([^/]+)';
	});
	return { regex: new RegExp(`^${pattern}$`), keys };
}

function matchOperation(operations: OperationEntry[], method: string, path: string): MatchResult | null {
	const normalizedMethod = method.toLowerCase();
	for (const operation of operations) {
		if (operation.method !== normalizedMethod) continue;
		const match = operation.pathRegex.exec(path);
		if (!match) continue;
		const params: Record<string, string> = {};
		operation.pathKeys.forEach((key, index) => {
			params[key] = decodeURIComponent(match[index + 1]);
		});
		return { operation, params };
	}
	return null;
}

function pickResponse(operation: OpenAPIV3.OperationObject) {
	const responses = operation.responses ?? {};
	const responseKeys = Object.keys(responses);
	const preferredStatus = responseKeys.find(key => key === '200') ?? responseKeys.find(key => key.startsWith('2')) ?? responseKeys[0] ?? '200';
	const response = responses[preferredStatus] as OpenAPIV3.ResponseObject | undefined;
	const content = response?.content ?? {};
	const mediaType = content['application/json'] ? 'application/json' : Object.keys(content)[0] ?? 'application/json';
	const schema = content[mediaType]?.schema as OpenAPIV3.SchemaObject | undefined;
	const statusNumber = Number(preferredStatus);
	return {
		status: Number.isNaN(statusNumber) ? 200 : statusNumber,
		mediaType,
		schema,
	};
}

function toResponseObject(response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined): OpenAPIV3.ResponseObject | undefined {
	if (!response || '$ref' in response) {
		return undefined;
	}
	return response;
}

function toHeaderObject(header: OpenAPIV3.HeaderObject | OpenAPIV3.ReferenceObject | undefined): OpenAPIV3.HeaderObject | undefined {
	if (!header || '$ref' in header) {
		return undefined;
	}
	return header;
}

function resolveResponseForStatus(responses: OpenAPIV3.ResponsesObject, status: number): OpenAPIV3.ResponseObject | undefined {
	const statusKey = String(status);
	const direct = toResponseObject(responses[statusKey] as OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined);
	if (direct) {
		return direct;
	}

	const rangeKey = `${Math.floor(status / 100)}XX`;
	const ranged = toResponseObject(responses[rangeKey] as OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined);
	if (ranged) {
		return ranged;
	}

	return toResponseObject(responses.default as OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject | undefined);
}

function tryGetHeaderExample(header: OpenAPIV3.HeaderObject): string | undefined {
	const fromHeader = (header as { example?: unknown }).example;
	if (typeof fromHeader === 'string' && fromHeader.length > 0) {
		return fromHeader;
	}
	if (typeof fromHeader === 'number' || typeof fromHeader === 'boolean') {
		return String(fromHeader);
	}
	const schema = header.schema as OpenAPIV3.SchemaObject | undefined;
	const fromSchema = schema ? (schema as { example?: unknown }).example : undefined;
	if (typeof fromSchema === 'string' && fromSchema.length > 0) {
		return fromSchema;
	}
	if (typeof fromSchema === 'number' || typeof fromSchema === 'boolean') {
		return String(fromSchema);
	}
	return undefined;
}

function normalizeSingleHeaderValue(value: string | string[] | undefined): string | undefined {
	if (!value) {
		return undefined;
	}
	return Array.isArray(value) ? value[0] : value;
}

function resolveContentLanguage(requestHeaders: Record<string, string | string[]>): string {
	const raw = normalizeSingleHeaderValue(requestHeaders['accept-language']);
	if (!raw) {
		return 'en';
	}
	const preferred = raw
		.split(',')
		.map(item => item.trim())
		.filter(item => item.length > 0)[0];
	if (!preferred) {
		return 'en';
	}
	return preferred.split(';')[0]?.trim() || 'en';
}

function resolveDefaultResponseHeaderValue(
	headerName: string,
	header: OpenAPIV3.HeaderObject,
	operationId: string,
	requestHeaders: Record<string, string | string[]>,
): string {
	const headerLower = headerName.toLowerCase();
	if (headerLower === 'x-request-id') {
		return `mock-request-${operationId}-${Date.now()}`;
	}
	if (headerLower === 'etag') {
		return `"mock-etag-${operationId}"`;
	}
	if (headerLower === 'location') {
		return `https://mock.rankup.dev/${operationId}`;
	}
	if (headerLower === 'content-language') {
		return resolveContentLanguage(requestHeaders);
	}
	if (headerLower === 'cache-control') {
		return tryGetHeaderExample(header) ?? 'no-store';
	}
	if (headerLower === 'vary') {
		return tryGetHeaderExample(header) ?? 'Accept-Language';
	}

	const fromExample = tryGetHeaderExample(header);
	if (fromExample) {
		return fromExample;
	}
	const schema = header.schema as OpenAPIV3.SchemaObject | undefined;
	switch (schema?.type) {
		case 'integer':
		case 'number':
			return '0';
		case 'boolean':
			return 'false';
		default:
			return `mock-${headerName.toLowerCase()}`;
	}
}

function hasHeader(headers: Record<string, string>, headerName: string): boolean {
	return Object.keys(headers).some(name => name.toLowerCase() === headerName.toLowerCase());
}

function applyResponseHeadersFromSpec(
	operation: OperationEntry,
	status: number,
	responseHeaders: Record<string, string>,
	requestHeaders: Record<string, string | string[]>,
): void {
	const response = resolveResponseForStatus(operation.responses, status);
	if (!response?.headers) {
		return;
	}
	for (const [headerName, headerDefinition] of Object.entries(response.headers)) {
		if (hasHeader(responseHeaders, headerName)) {
			continue;
		}
		const header = toHeaderObject(headerDefinition as OpenAPIV3.HeaderObject | OpenAPIV3.ReferenceObject | undefined);
		if (!header) {
			continue;
		}
		responseHeaders[headerName] = resolveDefaultResponseHeaderValue(headerName, header, operation.operationId, requestHeaders);
	}
}

function buildParametersSchema(parameters: OpenAPIV3.ParameterObject[], location: 'path' | 'query'): OpenAPIV3.SchemaObject | undefined {
	const filtered = parameters.filter(param => param.in === location);
	if (filtered.length === 0) return undefined;

	const properties: Record<string, OpenAPIV3.SchemaObject> = {};
	const required: string[] = [];

	for (const param of filtered) {
		if (!param.schema) continue;
		properties[param.name] = param.schema as OpenAPIV3.SchemaObject;
		if (param.required || location === 'path') {
			required.push(param.name);
		}
	}

	return {
		type: 'object',
		properties,
		required: required.length > 0 ? required : undefined,
		additionalProperties: false,
	};
}

async function loadSpec(specPath: string): Promise<OpenAPIV3.Document> {
	return (await SwaggerParser.dereference(specPath)) as OpenAPIV3.Document;
}

function collectParameters(pathItem: OpenAPIV3.PathItemObject, operation: OpenAPIV3.OperationObject): OpenAPIV3.ParameterObject[] {
	const combined = [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])];
	return combined.filter((param): param is OpenAPIV3.ParameterObject => !('$ref' in param));
}

function createOperationEntry(path: string, method: string, pathItem: OpenAPIV3.PathItemObject, operation: OpenAPIV3.OperationObject): OperationEntry | null {
	if (!operation.operationId) return null;
	const { regex, keys } = compilePath(path);
	const parameters = collectParameters(pathItem, operation);
	const pathSchema = buildParametersSchema(parameters, 'path');
	const querySchema = buildParametersSchema(parameters, 'query');
	const pathValidator = pathSchema ? ajv.compile(pathSchema) : undefined;
	const queryValidator = querySchema ? ajv.compile(querySchema) : undefined;
	const requestBody = operation.requestBody as OpenAPIV3.RequestBodyObject | undefined;
	const requestBodyRequired = Boolean(requestBody?.required);
	const requestBodySchemas: RequestSchemaMap = {};
	const requestBodyValidators = new Map<string, ValidateFunction>();
	const content = requestBody?.content ?? {};

	for (const [mediaType, media] of Object.entries(content)) {
		if (media?.schema) {
			requestBodySchemas[mediaType] = media.schema as OpenAPIV3.SchemaObject;
			requestBodyValidators.set(mediaType, ajv.compile(media.schema as OpenAPIV3.SchemaObject));
		}
	}

	const responsePick = pickResponse(operation);
	return {
		operationId: operation.operationId,
		method,
		path,
		pathRegex: regex,
		pathKeys: keys,
		requestBodyRequired,
		requestBodySchemas,
		requestBodyValidators,
		pathValidator,
		queryValidator,
		responseStatus: responsePick.status,
		responseMediaType: responsePick.mediaType,
		responseSchema: responsePick.schema,
		responses: operation.responses ?? {},
	};
}

function buildOperations(spec: OpenAPIV3.Document): OperationEntry[] {
	const operations: OperationEntry[] = [];
	for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
		if (!pathItem) continue;
		const pathObject = pathItem as OpenAPIV3.PathItemObject;
		for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
			const operation = (pathObject as Record<string, OpenAPIV3.OperationObject | undefined>)[method];
			if (!operation) continue;
			const entry = createOperationEntry(path, method, pathObject, operation);
			if (entry) operations.push(entry);
		}
	}
	return operations;
}

function selectBodyValidator(operation: OperationEntry, contentType: string | undefined): ValidateFunction | undefined {
	if (operation.requestBodyValidators.size === 0) return undefined;
	const normalized = normalizeContentType(contentType);
	if (normalized && operation.requestBodyValidators.has(normalized)) {
		return operation.requestBodyValidators.get(normalized);
	}
	if (normalized?.endsWith('+json') && operation.requestBodyValidators.has('application/json')) {
		return operation.requestBodyValidators.get('application/json');
	}
	const fallbackKey = operation.requestBodyValidators.keys().next().value as string | undefined;
	return fallbackKey ? operation.requestBodyValidators.get(fallbackKey) : undefined;
}

function collectAjvErrors(errors: ErrorObject[] | null | undefined, location: ValidationIssue['location']) {
	if (!errors) return [];
	return errors.map(error => ({
		location,
		message: error.message ?? 'Invalid value',
		instancePath: error.instancePath,
		schemaPath: error.schemaPath,
		keyword: error.keyword,
		params: error.params as Record<string, unknown>,
	}));
}

function validateParams(validator: ValidateFunction | undefined, data: unknown, location: ValidationIssue['location']): ValidationIssue[] {
	if (!validator) return [];
	const valid = validator(data);
	return valid ? [] : collectAjvErrors(validator.errors ?? [], location);
}

async function createSampler() {
	const samplerModule = (await import('openapi-sampler')) as {
		default?: {
			sample: (schema: unknown, options?: Record<string, unknown>, spec?: unknown) => unknown;
		};
		sample?: (schema: unknown, options?: Record<string, unknown>, spec?: unknown) => unknown;
	};
	const sampler = (samplerModule.default ?? samplerModule) as {
		sample: (schema: unknown, options?: Record<string, unknown>, spec?: unknown) => unknown;
	};
	if (!sampler?.sample) {
		throw new Error('openapi-sampler did not export a sample function');
	}
	return sampler;
}

export async function createOpenApiMockServer(options: OpenApiMockServerOptions = {}): Promise<OpenApiMockServer> {
	const logger = options.logger ?? console;
	const specPath = options.specPath ?? DEFAULT_SPEC_PATH;
	const spec = await loadSpec(specPath);
	const operations = buildOperations(spec);
	const sampler = await createSampler();
	const useCoreHandlers = options.useCoreHandlers ?? true;
	const scenarioDefaults = options.scenario;
	const registry =
		options.registry ??
		(useCoreHandlers
			? createMockRegistry({
					db: options.db,
					handlers: options.handlers,
			  })
			: undefined);
	const coreOperationIds = registry ? new Set(Object.keys(registry.handlers)) : null;

	const buildCoreContext = (
		operationId: OperationId,
		params: Record<string, string>,
		query: Record<string, QueryValue>,
		body: unknown,
		requestHeaders: Record<string, string | string[]>,
	): MockHandlerContextMap[OperationId] | null => {
		switch (operationId) {
			case 'getUserPublicProfile': {
				const userId = params.userId;
				if (!userId) return null;
				return { params: { userId }, query: Object.keys(query).length ? (query as MockHandlerContextMap['getUserPublicProfile']['query']) : undefined };
			}
			case 'listCompetitions':
				return { query: Object.keys(query).length ? (query as MockHandlerContextMap['listCompetitions']['query']) : undefined };
			case 'listDiscoverableTournaments':
				return {
					query: Object.keys(query).length ? (query as MockHandlerContextMap['listDiscoverableTournaments']['query']) : undefined,
				};
			case 'listMyTournaments':
				return { query: Object.keys(query).length ? (query as MockHandlerContextMap['listMyTournaments']['query']) : undefined };
			case 'joinTournament': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				const idempotencyHeader = requestHeaders['x-idempotency-key'];
				const idempotencyKey = Array.isArray(idempotencyHeader) ? idempotencyHeader[0] : idempotencyHeader;
				return {
					params: { tournamentId },
					body: body && typeof body === 'object' ? (body as MockHandlerContextMap['joinTournament']['body']) : undefined,
					headers: {
						idempotencyKey: typeof idempotencyKey === 'string' && idempotencyKey.length > 0 ? idempotencyKey : undefined,
					},
				};
			}
			case 'joinTournamentByInvitationCode': {
				const code = params.code;
				if (!code) return null;
				const idempotencyHeader = requestHeaders['x-idempotency-key'];
				const idempotencyKey = Array.isArray(idempotencyHeader) ? idempotencyHeader[0] : idempotencyHeader;
				return {
					params: { code },
					body:
						body && typeof body === 'object'
							? (body as MockHandlerContextMap['joinTournamentByInvitationCode']['body'])
							: undefined,
					headers: {
						idempotencyKey: typeof idempotencyKey === 'string' && idempotencyKey.length > 0 ? idempotencyKey : undefined,
					},
				};
			}
			case 'getTournament': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return {
					params: { tournamentId },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['getTournament']['query']) : undefined,
				};
			}
			case 'updateTournament': {
				const tournamentId = params.tournamentId;
				if (!tournamentId || !body || typeof body !== 'object') return null;
				return {
					params: { tournamentId },
					body: body as MockHandlerContextMap['updateTournament']['body'],
				};
			}
			case 'archiveTournament': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return { params: { tournamentId } };
			}
			case 'deleteTournament': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return {
					params: { tournamentId },
					body: body && typeof body === 'object' ? (body as MockHandlerContextMap['deleteTournament']['body']) : undefined,
				};
			}
			case 'lockTournament': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return {
					params: { tournamentId },
					body: body && typeof body === 'object' ? (body as MockHandlerContextMap['lockTournament']['body']) : undefined,
				};
			}
			case 'unlockTournament': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return { params: { tournamentId } };
			}
			case 'unarchiveTournament': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return { params: { tournamentId } };
			}
			case 'transferTournamentOwnership': {
				const tournamentId = params.tournamentId;
				if (!tournamentId || !body || typeof body !== 'object') return null;
				const newOwnerUserId = (body as Record<string, unknown>).newOwnerUserId;
				if (typeof newOwnerUserId !== 'string') return null;
				return {
					params: { tournamentId },
					body: { newOwnerUserId },
				};
			}
			case 'getTournamentRules': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return {
					params: { tournamentId },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['getTournamentRules']['query']) : undefined,
				};
			}
			case 'listTournamentSeasonRanking': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return {
					params: { tournamentId },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['listTournamentSeasonRanking']['query']) : undefined,
				};
			}
			case 'listTournamentMatchdayMatches': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday)) return null;
				return {
					params: { tournamentId, matchday },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['listTournamentMatchdayMatches']['query']) : undefined,
				};
			}
			case 'listTournamentMatchdayRanking': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday)) return null;
				return {
					params: { tournamentId, matchday },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['listTournamentMatchdayRanking']['query']) : undefined,
				};
			}
			case 'getMyTournamentSeasonRankingWindow': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return {
					params: { tournamentId },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['getMyTournamentSeasonRankingWindow']['query']) : undefined,
				};
			}
			case 'getMyTournamentMatchdayRankingWindow': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday)) return null;
				return {
					params: { tournamentId, matchday },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['getMyTournamentMatchdayRankingWindow']['query']) : undefined,
				};
			}
			case 'getMyMatchdayResults': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday)) return null;
				return {
					params: { tournamentId, matchday },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['getMyMatchdayResults']['query']) : undefined,
				};
			}
			case 'getUserMatchdayResults': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				const userId = params.userId;
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday) || !userId) return null;
				return {
					params: { tournamentId, matchday, userId },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['getUserMatchdayResults']['query']) : undefined,
				};
			}
			case 'getMatchdayResultsSummary': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday)) return null;
				return {
					params: { tournamentId, matchday },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['getMatchdayResultsSummary']['query']) : undefined,
				};
			}
			case 'listTournamentUpdates': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return {
					params: { tournamentId },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['listTournamentUpdates']['query']) : undefined,
				};
			}
			case 'streamTournamentLive': {
				const tournamentId = params.tournamentId;
				if (!tournamentId) return null;
				return {
					params: { tournamentId },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['streamTournamentLive']['query']) : undefined,
				};
			}
			case 'listMatchdaySubmissions': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday)) return null;
				return {
					params: { tournamentId, matchday },
					query: Object.keys(query).length ? (query as MockHandlerContextMap['listMatchdaySubmissions']['query']) : undefined,
				};
			}
			case 'getMyMatchdaySubmission': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday)) return null;
				return { params: { tournamentId, matchday } };
			}
			case 'upsertMyMatchdaySubmission': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday) || !body || typeof body !== 'object') return null;
				return {
					params: { tournamentId, matchday },
					body: body as MockHandlerContextMap['upsertMyMatchdaySubmission']['body'],
				};
			}
			case 'clearMyMatchdaySubmission': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday)) return null;
				const idempotencyHeader = requestHeaders['x-idempotency-key'];
				const idempotencyKey = Array.isArray(idempotencyHeader) ? idempotencyHeader[0] : idempotencyHeader;
				return {
					params: { tournamentId, matchday },
					headers: {
						idempotencyKey: typeof idempotencyKey === 'string' && idempotencyKey.length > 0 ? idempotencyKey : undefined,
					},
				};
			}
			case 'getUserMatchdaySubmission': {
				const tournamentId = params.tournamentId;
				const matchdayRaw = params.matchday;
				const matchday = Number(matchdayRaw);
				const userId = params.userId;
				if (!tournamentId || !matchdayRaw || Number.isNaN(matchday) || !userId) return null;
				return { params: { tournamentId, matchday, userId } };
			}
			case 'oauthAuthorize': {
				const provider = query.provider;
				const redirectUri = query.redirectUri;
				const state = query.state;
				if (typeof provider !== 'string' || typeof redirectUri !== 'string' || typeof state !== 'string') return null;
				const codeChallenge = typeof query.codeChallenge === 'string' ? query.codeChallenge : undefined;
				const codeChallengeMethod =
					typeof query.codeChallengeMethod === 'string' && query.codeChallengeMethod === 'S256' ? 'S256' : undefined;
				return { params: { provider, redirectUri, state, codeChallenge, codeChallengeMethod } };
			}
			case 'oauthTokenExchange':
				return body && typeof body === 'object' ? ({ body } as MockHandlerContextMap['oauthTokenExchange']) : null;
			default:
				return null;
		}
	};

	const handler = async (req: IncomingMessage, res: ServerResponse) => {
		if (!req.url || !req.method) {
			sendText(res, 400, 'Invalid request');
			return;
		}

		if (req.method.toUpperCase() === 'OPTIONS') {
			res.writeHead(204, DEFAULT_HEADERS);
			res.end();
			return;
		}

		const url = new URL(req.url, 'http://localhost');
		const match = matchOperation(operations, req.method, url.pathname);

		if (!match) {
			sendJson(res, 404, { message: 'Not found' });
			return;
		}

		const requestHeaders = normalizeHeaders(req.headers);
		const query = parseQueryParams(url.searchParams);
		const scenario = resolveScenario(scenarioDefaults, parseScenarioOverrides({ headers: requestHeaders, query }));
		if (scenario.reset && registry) {
			resetMockDb(registry.db);
			resetEngineMockHarness(registry.db);
		}

		const rawBody = await readBody(req);
		let body: unknown;
		try {
			body = parseBody(rawBody, req.headers['content-type']);
		} catch (error) {
			sendJson(res, 400, { message: 'Invalid body', error: String(error) });
			return;
		}

		const issues: ValidationIssue[] = [];

		issues.push(...validateParams(match.operation.pathValidator, match.params, 'path'));
		issues.push(...validateParams(match.operation.queryValidator, query, 'query'));

		if (match.operation.requestBodyRequired && body == null) {
			issues.push({
				location: 'body',
				message: 'Request body is required',
			});
		} else {
			const validator = selectBodyValidator(match.operation, req.headers['content-type']);
			if (validator) {
				const valid = validator(body);
				if (!valid) {
					issues.push(...collectAjvErrors(validator.errors ?? [], 'body'));
				}
			}
		}

		if (issues.length > 0) {
			sendJson(res, 400, {
				message: 'Request validation failed',
				operationId: match.operation.operationId,
				errors: issues,
			});
			return;
		}

		let responseBody: unknown = null;
		let responseStatus = match.operation.responseStatus;
		let responseMediaType = match.operation.responseMediaType;
		let responseSource: 'core' | 'mock' | 'scenario' = 'mock';
		const responseHeaders: Record<string, string> = {
			'x-operation-id': match.operation.operationId,
		};

		const authHeader = requestHeaders['authorization'];
		const hasAuth = Array.isArray(authHeader) ? authHeader.length > 0 : Boolean(authHeader);

		if (scenario.forceStatus !== undefined) {
			responseStatus = scenario.forceStatus;
			responseMediaType = 'application/json';
			responseSource = 'scenario';
			responseBody =
				responseStatus === 204
					? null
					: {
							message: 'Forced response status',
							status: responseStatus,
							operationId: match.operation.operationId,
					  };
		} else if (scenario.authMode === 'required' && !hasAuth) {
			responseStatus = 401;
			responseMediaType = 'application/json';
			responseSource = 'scenario';
			responseHeaders['www-authenticate'] = 'Bearer';
			responseBody = {
				message: 'Authorization required',
				operationId: match.operation.operationId,
			};
		}

		if (responseSource !== 'scenario' && registry && coreOperationIds?.has(match.operation.operationId)) {
			const operationId = match.operation.operationId as OperationId;
			const context = buildCoreContext(operationId, match.params, query, body, requestHeaders);
			if (context) {
				try {
					const handlerResult = await executeMockHandler(registry, operationId, context as MockHandlerContextMap[OperationId]);
					responseBody = handlerResult.response;
					responseStatus = handlerResult.status;
					if (handlerResult.headers) {
						for (const [headerName, headerValue] of Object.entries(handlerResult.headers)) {
							responseHeaders[headerName] = headerValue;
						}
					}
					responseSource = 'core';
				} catch (error) {
					const runtimeProblem = (error as { problem?: { status?: number; type?: string; title?: string; detail?: string; code?: string } })?.problem;
					if (runtimeProblem?.status && runtimeProblem.type && runtimeProblem.title && runtimeProblem.detail) {
						responseStatus = runtimeProblem.status;
						responseMediaType = 'application/problem+json';
						responseBody = runtimeProblem;
						responseSource = 'core';
					} else {
						responseStatus = 500;
						responseMediaType = 'application/problem+json';
						responseBody = {
							type: 'https://errors.rankup.dev/internal',
							title: 'Internal Server Error',
							status: 500,
							detail: 'Unhandled core handler error.',
							code: 'internalError',
						};
						responseSource = 'core';
					}
				}
			}
		}

		if (responseSource === 'mock') {
			responseBody = match.operation.responseSchema ? sampler.sample(match.operation.responseSchema, { skipReadOnly: true, skipWriteOnly: true, quiet: true }, spec) : null;
		}

		if (scenario.delayMs > 0) {
			await sleep(scenario.delayMs);
		}

		applyResponseHeadersFromSpec(match.operation, responseStatus, responseHeaders, requestHeaders);

		logger.info(`[openapi-mock] ${req.method} ${url.pathname} -> ${match.operation.operationId} (${responseSource})`);

		sendResponse(res, responseStatus, responseBody, responseMediaType, responseHeaders);
	};

	const server = createServer(handler);
	return { server, spec, operations, registry };
}

export async function startOpenApiMockServer(options: OpenApiMockServerOptions & { port?: number } = {}): Promise<OpenApiMockServerRunning> {
	const { port = 4010 } = options;
	const { server, spec, operations } = await createOpenApiMockServer(options);
	server.listen(port);
	await once(server, 'listening');
	const address = server.address();
	if (!address || typeof address !== 'object') {
		throw new Error('Failed to start server');
	}
	const baseUrl = `http://127.0.0.1:${address.port}`;
	return { server, spec, operations, port: address.port, baseUrl };
}

export function getDefaultHeaders() {
	return { ...DEFAULT_HEADERS };
}

export function toOpenApiRequest(req: IncomingMessage) {
	if (!req.url || !req.method) return null;
	const url = new URL(req.url, 'http://localhost');
	return {
		method: req.method,
		path: url.pathname,
		headers: normalizeHeaders(req.headers),
		query: parseQueryParams(url.searchParams),
	};
}
