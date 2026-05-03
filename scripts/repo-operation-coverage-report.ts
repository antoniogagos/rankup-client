import { defaultMockHandlers } from '../packages/api-mock/src/core/handlers.js';
import { notImplementedOperationIds } from '../packages/api-mock/src/core/not-implemented-handler.js';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import * as ts from 'typescript';

type OperationEntry = {
	operationId: string;
	method: string;
	path: string;
	tags: string[];
};

type OperationManifest = {
	operations: OperationEntry[];
};

type ParityBaseline = {
	operationIds: string[];
};

type ReleaseCriticalCatalog = {
	version: string;
	description?: string;
	operationIds: string[];
};

type OperationCoverageState = {
	operationId: string;
	method: string;
	path: string;
	tags: string[];
	isAdmin: boolean;
	inBaseline: boolean;
	isReleaseCritical: boolean;
	isNotImplementedHandler: boolean;
	gatewayOwners: string[];
	hasGatewayOwner: boolean;
	hasGatewayMappingEntry: boolean;
	hasMockHandler: boolean;
	usesFallbackHandler: boolean;
	hasExplicitMockHandler: boolean;
	fixturePaths: string[];
	hasFixture: boolean;
	hasCanonicalFixture: boolean;
	canonicalFixturePath: string;
	fourWayGlobalPass: boolean;
	failures: string[];
};

type OperationCoverageSummary = {
	total: number;
	withGatewayOwner: number;
	withGatewayMappingEntry: number;
	withMockHandler: number;
	withExplicitMockHandler: number;
	withFixture: number;
	withCanonicalFixture: number;
	fourWayGlobalPass: number;
	releaseCriticalCount: number;
	releaseCriticalNotImplemented: number;
};

type OperationCoverageReport = {
	version: string;
	generatedAt: string;
	description: string;
	sources: {
		operationsManifest: string;
		baseline: string;
		releaseCriticalCatalog: string;
		gatewayMapping: string;
		fixturesGlob: string;
		mockHandlers: string;
	};
	scope: {
		totalOperations: number;
		totalAdminOperations: number;
		totalNonAdminOperations: number;
		totalBaselineOperations: number;
		totalBaselineNonAdminOperations: number;
		totalReleaseCriticalOperations: number;
		totalReleaseCriticalNonAdminOperations: number;
	};
	summaries: {
		nonAdmin: OperationCoverageSummary;
		baselineNonAdmin: OperationCoverageSummary;
		releaseCriticalNonAdmin: OperationCoverageSummary;
	};
	failureCounts: Record<string, number>;
	notes: string[];
	operations: OperationCoverageState[];
};

const OPERATIONS_PATH = resolve(process.cwd(), 'packages/api/src/generated/operations.json');
const BASELINE_PATH = resolve(process.cwd(), 'diagnostics/parity-baseline-operations.json');
const RELEASE_CRITICAL_PATH = resolve(process.cwd(), 'diagnostics/release-critical-operations.json');
const GATEWAY_MAPPING_PATH = resolve(process.cwd(), 'apps/rankup-spa/services/api/gateway-mapping.ts');
const OUTPUT_PATH = resolve(process.cwd(), 'diagnostics/operation-coverage-global-report.json');
const FIXTURES_GLOB = 'packages/api-mock/src/fixtures';

function readJson<T>(path: string): T {
	return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function isAdminOperation(entry: OperationEntry): boolean {
	const tags = entry.tags ?? [];
	if (tags.some(tag => tag === 'admin' || tag.startsWith('admin.'))) {
		return true;
	}
	return entry.path.startsWith('/admin');
}

function loadBaselineOperationIds(): Set<string> {
	const raw = readJson<ParityBaseline>(BASELINE_PATH);
	if (!raw || !Array.isArray(raw.operationIds)) {
		throw new Error('parity-baseline-operations.json must include operationIds[].');
	}
	return new Set(raw.operationIds);
}

function loadReleaseCriticalOperationIds(): Set<string> {
	const raw = readJson<ReleaseCriticalCatalog>(RELEASE_CRITICAL_PATH);
	if (!raw || typeof raw !== 'object' || !Array.isArray(raw.operationIds)) {
		throw new Error('release-critical-operations.json must include operationIds[].');
	}
	return new Set(raw.operationIds.filter((operationId): operationId is string => typeof operationId === 'string' && operationId.length > 0));
}

function getGatewayFiles(): string[] {
	const output = execSync('rg --files -g "*-gateway.ts" apps/rankup-spa/services/api', { encoding: 'utf8' }).toString().trim();
	if (!output) {
		return [];
	}
	return output.split('\n').map(line => line.trim()).filter(Boolean);
}

function unwrapObjectLiteral(expression: ts.Expression | undefined): ts.ObjectLiteralExpression | null {
	if (!expression) {
		return null;
	}
	if (ts.isObjectLiteralExpression(expression)) {
		return expression;
	}
	if (ts.isAsExpression(expression) || ts.isSatisfiesExpression(expression)) {
		return unwrapObjectLiteral(expression.expression);
	}
	if (ts.isParenthesizedExpression(expression)) {
		return unwrapObjectLiteral(expression.expression);
	}
	return null;
}

function readPropertyName(name: ts.PropertyName): string | null {
	if (ts.isIdentifier(name)) {
		return name.text;
	}
	if (ts.isStringLiteral(name)) {
		return name.text;
	}
	if (ts.isNumericLiteral(name)) {
		return name.text;
	}
	return null;
}

function extractOperationOwners(source: ts.SourceFile, filePath: string): { entries: string[]; errors: string[]; found: boolean } {
	const entries: string[] = [];
	const errors: string[] = [];
	let found = false;

	const visit = (node: ts.Node): void => {
		if (ts.isVariableStatement(node)) {
			for (const declaration of node.declarationList.declarations) {
				if (!ts.isIdentifier(declaration.name) || declaration.name.text !== 'operationOwners') {
					continue;
				}
				found = true;
				const literal = unwrapObjectLiteral(declaration.initializer);
				if (!literal) {
					errors.push(`${filePath}: operationOwners must be an object literal.`);
					continue;
				}
				for (const prop of literal.properties) {
					if (ts.isPropertyAssignment(prop) || ts.isShorthandPropertyAssignment(prop)) {
						const name = ts.isPropertyAssignment(prop) ? readPropertyName(prop.name) : prop.name.text;
						if (name) {
							entries.push(name);
						}
					}
				}
			}
		}
		ts.forEachChild(node, visit);
	};

	visit(source);
	return { entries, errors, found };
}

function inferOperationOwners(source: ts.SourceFile, operationIds: Set<string>): string[] {
	const entries = new Set<string>();
	const visit = (node: ts.Node): void => {
		if (ts.isPropertyAccessExpression(node)) {
			const candidate = node.name.text;
			if (operationIds.has(candidate)) {
				const target = node.expression;
				if (ts.isPropertyAccessExpression(target) && target.name.text === 'apiClient') {
					entries.add(candidate);
				}
			}
		}
		ts.forEachChild(node, visit);
	};
	visit(source);
	return [...entries];
}

function collectGatewayOwners(
	operations: OperationEntry[],
): { ownerMap: Map<string, Set<string>>; parseErrors: string[]; unknownOperationIds: string[] } {
	const operationMap = new Map<string, OperationEntry>();
	const operationIds = new Set<string>();
	for (const entry of operations) {
		operationMap.set(entry.operationId, entry);
		operationIds.add(entry.operationId);
	}

	const ownerMap = new Map<string, Set<string>>();
	const parseErrors: string[] = [];
	const unknownOperationIds: string[] = [];

	for (const file of getGatewayFiles()) {
		const text = readFileSync(file, 'utf8');
		const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
		const { entries, errors, found } = extractOperationOwners(source, file);
		if (errors.length > 0) {
			parseErrors.push(...errors);
		}
		const used = found ? entries : inferOperationOwners(source, operationIds);
		if (used.length === 0) {
			continue;
		}

		const owner = relative(process.cwd(), file);
		for (const operationId of used) {
			if (!operationIds.has(operationId)) {
				unknownOperationIds.push(`${owner}: ${operationId}`);
				continue;
			}

			const operation = operationMap.get(operationId);
			if (operation && isAdminOperation(operation)) {
				continue;
			}

			const owners = ownerMap.get(operationId) ?? new Set<string>();
			owners.add(owner);
			ownerMap.set(operationId, owners);
		}
	}

	return { ownerMap, parseErrors, unknownOperationIds };
}

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function collectGatewayMappingEntries(operationIds: Set<string>): Set<string> {
	const mappingFile = readFileSync(GATEWAY_MAPPING_PATH, 'utf8');
	const mapped = new Set<string>();
	for (const operationId of operationIds) {
		const pattern = new RegExp(`\\b${escapeRegex(operationId)}\\b`, 'm');
		if (pattern.test(mappingFile)) {
			mapped.add(operationId);
		}
	}
	return mapped;
}

function collectFixtures(): Map<string, string[]> {
	const byOperation = new Map<string, string[]>();
	let files: string[] = [];
	try {
		const output = execSync(`rg --files -g "*.json" ${FIXTURES_GLOB}`, { encoding: 'utf8' }).toString().trim();
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
		const data = readJson<{ operationId?: string }>(file);
		if (!data?.operationId) {
			continue;
		}
		const entries = byOperation.get(data.operationId) ?? [];
		entries.push(file);
		byOperation.set(data.operationId, entries);
	}

	return byOperation;
}

function detectFallbackHandlerRef(handlers: Record<string, object>): object | null {
	const counts = new Map<object, number>();
	for (const value of Object.values(handlers)) {
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}
	let topRef: object | null = null;
	let topCount = 0;
	for (const [value, count] of counts.entries()) {
		if (count > topCount) {
			topRef = value;
			topCount = count;
		}
	}
	return topCount > 1 ? topRef : null;
}

function summarize(rows: OperationCoverageState[]): OperationCoverageSummary {
	return {
		total: rows.length,
		withGatewayOwner: rows.filter(row => row.hasGatewayOwner).length,
		withGatewayMappingEntry: rows.filter(row => row.hasGatewayMappingEntry).length,
		withMockHandler: rows.filter(row => row.hasMockHandler).length,
		withExplicitMockHandler: rows.filter(row => row.hasExplicitMockHandler).length,
		withFixture: rows.filter(row => row.hasFixture).length,
		withCanonicalFixture: rows.filter(row => row.hasCanonicalFixture).length,
		fourWayGlobalPass: rows.filter(row => row.fourWayGlobalPass).length,
		releaseCriticalCount: rows.filter(row => row.isReleaseCritical).length,
		releaseCriticalNotImplemented: rows.filter(row => row.isReleaseCritical && row.isNotImplementedHandler).length,
	};
}

function run(): void {
	const manifest = readJson<OperationManifest>(OPERATIONS_PATH);
	if (!manifest || !Array.isArray(manifest.operations)) {
		throw new Error('operations.json must include an operations array.');
	}

	const baselineOperationIds = loadBaselineOperationIds();
	const releaseCriticalOperationIds = loadReleaseCriticalOperationIds();
	const notImplementedHandlers = new Set<string>(notImplementedOperationIds);
	const operationIds = new Set(manifest.operations.map(operation => operation.operationId));
	const unknownBaselineIds = [...baselineOperationIds].filter(operationId => !operationIds.has(operationId));
	const unknownReleaseCriticalIds = [...releaseCriticalOperationIds].filter(operationId => !operationIds.has(operationId));
	const { ownerMap, parseErrors, unknownOperationIds } = collectGatewayOwners(manifest.operations);
	const mappedOperationIds = collectGatewayMappingEntries(operationIds);
	const fixturesByOperation = collectFixtures();

	const handlers = defaultMockHandlers as Record<string, object>;
	const fallbackHandlerRef = detectFallbackHandlerRef(handlers);

	const rows: OperationCoverageState[] = [];
	const failureCounts = new Map<string, number>();

	for (const operation of manifest.operations) {
		const isAdmin = isAdminOperation(operation);
		const isReleaseCritical = releaseCriticalOperationIds.has(operation.operationId);
		const isNotImplementedHandler = notImplementedHandlers.has(operation.operationId);
		const owners = ownerMap.get(operation.operationId);
		const gatewayOwners = owners ? [...owners].sort() : [];
		const hasGatewayOwner = gatewayOwners.length > 0;
		const hasGatewayMappingEntry = mappedOperationIds.has(operation.operationId);
		const hasMockHandler = Object.prototype.hasOwnProperty.call(handlers, operation.operationId);
		const usesFallbackHandler = hasMockHandler && fallbackHandlerRef !== null && handlers[operation.operationId] === fallbackHandlerRef;
		const hasExplicitMockHandler = hasMockHandler && !usesFallbackHandler;
		const fixturePaths = (fixturesByOperation.get(operation.operationId) ?? []).slice().sort();
		const hasFixture = fixturePaths.length > 0;
		const canonicalFixturePath = `packages/api-mock/src/fixtures/generated/${operation.operationId}.json`;
		const hasCanonicalFixture = fixturePaths.includes(canonicalFixturePath);
		const hasOnlyCanonicalFixture = hasFixture && fixturePaths.length === 1 && fixturePaths[0] === canonicalFixturePath;

		const failures: string[] = [];
		if (!isAdmin) {
			if (!hasGatewayOwner) {
				failures.push('missingOwner');
			}
			if (!hasGatewayMappingEntry) {
				failures.push('missingGatewayMapping');
			}
			if (!hasMockHandler) {
				failures.push('missingMockHandler');
			}
			if (usesFallbackHandler) {
				failures.push('fallbackMockHandlerForbidden');
			}
			if (!hasFixture) {
				failures.push('missingFixture');
			}
			if (hasFixture && !hasOnlyCanonicalFixture) {
				failures.push('nonCanonicalFixturePath');
			}
			if (isReleaseCritical && isNotImplementedHandler) {
				failures.push('releaseCriticalNotImplemented');
			}
		}

		for (const failure of failures) {
			failureCounts.set(failure, (failureCounts.get(failure) ?? 0) + 1);
		}

		rows.push({
			operationId: operation.operationId,
			method: operation.method,
			path: operation.path,
			tags: operation.tags ?? [],
			isAdmin,
			inBaseline: baselineOperationIds.has(operation.operationId),
			isReleaseCritical,
			isNotImplementedHandler,
			gatewayOwners,
			hasGatewayOwner,
			hasGatewayMappingEntry,
			hasMockHandler,
			usesFallbackHandler,
			hasExplicitMockHandler,
			fixturePaths,
			hasFixture,
			hasCanonicalFixture,
			canonicalFixturePath,
			fourWayGlobalPass: failures.length === 0,
			failures,
		});
	}

	const nonAdminRows = rows.filter(row => !row.isAdmin);
	const baselineNonAdminRows = rows.filter(row => row.inBaseline && !row.isAdmin);
	const releaseCriticalNonAdminRows = rows.filter(row => row.isReleaseCritical && !row.isAdmin);

	const notes: string[] = [];
	if (unknownBaselineIds.length > 0) {
		notes.push(`Unknown baseline operationIds: ${unknownBaselineIds.join(', ')}`);
	}
	if (unknownReleaseCriticalIds.length > 0) {
		notes.push(`Unknown release-critical operationIds: ${unknownReleaseCriticalIds.join(', ')}`);
	}
	if (parseErrors.length > 0) {
		notes.push(`Gateway parse errors: ${parseErrors.length}`);
	}
	if (unknownOperationIds.length > 0) {
		notes.push(`Unknown operationIds referenced by gateways: ${unknownOperationIds.length}`);
	}
	if (mappedOperationIds.size === 0) {
		notes.push('gateway-mapping.ts currently exposes mapping helpers, not per-operation entries.');
	}

	const report: OperationCoverageReport = {
		version: '2026-02-09',
		generatedAt: new Date().toISOString(),
		description: 'Global 4-way operation coverage inventory with release-critical notImplemented ratchet.',
		sources: {
			operationsManifest: 'packages/api/src/generated/operations.json',
			baseline: 'diagnostics/parity-baseline-operations.json',
			releaseCriticalCatalog: 'diagnostics/release-critical-operations.json',
			gatewayMapping: 'apps/rankup-spa/services/api/gateway-mapping.ts',
			fixturesGlob: `${FIXTURES_GLOB}/**/*.json`,
			mockHandlers: 'packages/api-mock/src/core/handlers.ts#defaultMockHandlers',
		},
		scope: {
			totalOperations: rows.length,
			totalAdminOperations: rows.filter(row => row.isAdmin).length,
			totalNonAdminOperations: nonAdminRows.length,
			totalBaselineOperations: rows.filter(row => row.inBaseline).length,
			totalBaselineNonAdminOperations: baselineNonAdminRows.length,
			totalReleaseCriticalOperations: rows.filter(row => row.isReleaseCritical).length,
			totalReleaseCriticalNonAdminOperations: releaseCriticalNonAdminRows.length,
		},
		summaries: {
			nonAdmin: summarize(nonAdminRows),
			baselineNonAdmin: summarize(baselineNonAdminRows),
			releaseCriticalNonAdmin: summarize(releaseCriticalNonAdminRows),
		},
		failureCounts: Object.fromEntries([...failureCounts.entries()].sort((a, b) => b[1] - a[1])),
		notes,
		operations: rows,
	};

	writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, '\t')}\n`, 'utf8');

	console.log(`repo:operation-coverage:report -> ${relative(process.cwd(), OUTPUT_PATH)}`);
	console.log(`- non-admin operations: ${report.scope.totalNonAdminOperations}`);
	console.log(`- global 4-way pass: ${report.summaries.nonAdmin.fourWayGlobalPass}/${report.scope.totalNonAdminOperations}`);
	console.log(`- baseline non-admin operations: ${report.scope.totalBaselineNonAdminOperations}`);
	console.log(`- baseline global 4-way pass: ${report.summaries.baselineNonAdmin.fourWayGlobalPass}/${report.scope.totalBaselineNonAdminOperations}`);
	console.log(`- release-critical non-admin operations: ${report.scope.totalReleaseCriticalNonAdminOperations}`);
	console.log(
		`- releaseCriticalNotImplemented: ${report.summaries.releaseCriticalNonAdmin.releaseCriticalNotImplemented}/${report.scope.totalReleaseCriticalNonAdminOperations}`,
	);
	for (const [failure, count] of Object.entries(report.failureCounts)) {
		console.log(`- ${failure}: ${count}`);
	}
}

try {
	run();
} catch (error) {
	console.error('repo:operation-coverage:report failed');
	console.error(error);
	process.exit(1);
}
