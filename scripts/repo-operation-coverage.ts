import { defaultMockHandlers } from '../packages/api-mock/src/core/handlers.js';
import { notImplementedOperationIds } from '../packages/api-mock/src/core/not-implemented-handler.js';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
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

type ReleaseCriticalCatalog = {
	version: string;
	description?: string;
	operationIds: string[];
};

type WaiverEntry = {
	operationId: string;
	waiverType: string;
};

const OPERATIONS_PATH = resolve(process.cwd(), 'packages/api/src/generated/operations.json');
const RELEASE_CRITICAL_OPERATIONS_PATH = resolve(process.cwd(), 'diagnostics/release-critical-operations.json');
const WAIVERS_PATH = resolve(process.cwd(), 'diagnostics/operation-waivers.json');
const GATEWAY_MAPPING_PATH = resolve(process.cwd(), 'apps/rankup-spa/services/api/gateway-mapping.ts');
const HANDLERS_PATH = resolve(process.cwd(), 'packages/api-mock/src/core/handlers.ts');
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

function loadReleaseCriticalOperationIds(): Set<string> {
	const raw = readJson<ReleaseCriticalCatalog>(RELEASE_CRITICAL_OPERATIONS_PATH);
	if (!raw || typeof raw !== 'object' || !Array.isArray(raw.operationIds)) {
		throw new Error('release-critical-operations.json must include operationIds[].');
	}
	return new Set(raw.operationIds.filter((operationId): operationId is string => typeof operationId === 'string' && operationId.length > 0));
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
	gatewayFiles: string[],
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

	for (const file of gatewayFiles) {
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

function extractGatewayOperationMapping(
	source: ts.SourceFile,
	filePath: string,
): { mapping: Map<string, string>; errors: string[]; found: boolean } {
	const mapping = new Map<string, string>();
	const errors: string[] = [];
	let found = false;

	const visit = (node: ts.Node): void => {
		if (ts.isVariableStatement(node)) {
			for (const declaration of node.declarationList.declarations) {
				if (!ts.isIdentifier(declaration.name) || declaration.name.text !== 'gatewayOperationMapping') {
					continue;
				}
				found = true;
				const literal = unwrapObjectLiteral(declaration.initializer);
				if (!literal) {
					errors.push(`${filePath}: gatewayOperationMapping must be an object literal.`);
					continue;
				}
				for (const prop of literal.properties) {
					if (!ts.isPropertyAssignment(prop)) {
						errors.push(`${filePath}: gatewayOperationMapping must contain only property assignments.`);
						continue;
					}
					const operationId = readPropertyName(prop.name);
					if (!operationId) {
						errors.push(`${filePath}: gatewayOperationMapping has an invalid operationId key.`);
						continue;
					}
					if (!ts.isStringLiteral(prop.initializer)) {
						errors.push(`${filePath}: gatewayOperationMapping.${operationId} must be a string literal gateway path.`);
						continue;
					}
					if (mapping.has(operationId)) {
						errors.push(`${filePath}: duplicate gatewayOperationMapping entry for ${operationId}.`);
						continue;
					}
					mapping.set(operationId, prop.initializer.text);
				}
			}
		}
		ts.forEachChild(node, visit);
	};

	visit(source);
	return { mapping, errors, found };
}

function loadGatewayOperationMapping(
	operationIds: Set<string>,
	gatewayFiles: Set<string>,
): { mapping: Map<string, string>; parseErrors: string[]; unknownOperationIds: string[]; unknownGatewayFiles: string[] } {
	const text = readFileSync(GATEWAY_MAPPING_PATH, 'utf8');
	const source = ts.createSourceFile(GATEWAY_MAPPING_PATH, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const { mapping, errors, found } = extractGatewayOperationMapping(source, GATEWAY_MAPPING_PATH);
	const parseErrors = [...errors];
	if (!found) {
		parseErrors.push(`${relative(process.cwd(), GATEWAY_MAPPING_PATH)}: missing gatewayOperationMapping export.`);
	}

	const unknownOperationIds: string[] = [];
	const unknownGatewayFiles: string[] = [];
	for (const [operationId, gatewayFile] of mapping.entries()) {
		if (!operationIds.has(operationId)) {
			unknownOperationIds.push(operationId);
		}
		if (!gatewayFiles.has(gatewayFile)) {
			unknownGatewayFiles.push(`${operationId} -> ${gatewayFile}`);
		}
	}

	return { mapping, parseErrors, unknownOperationIds, unknownGatewayFiles };
}

function collectFixtures(): Map<string, string[]> {
	const fixturesByOperation = new Map<string, string[]>();
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
		if (data?.operationId) {
			const entries = fixturesByOperation.get(data.operationId) ?? [];
			entries.push(file);
			fixturesByOperation.set(data.operationId, entries);
		}
	}

	return fixturesByOperation;
}

function detectForbiddenFallbackPatterns(): string[] {
	const source = readFileSync(HANDLERS_PATH, 'utf8');
	const patterns: string[] = [];
	if (source.includes('fallbackMockHandler')) {
		patterns.push('fallbackMockHandler symbol detected');
	}
	if (/Object\.values\(\s*operations\s*\)/.test(source) && /\[operation\.operationId\]/.test(source)) {
		patterns.push('dynamic handler injection from operations catalog detected');
	}
	return patterns;
}

function run(): void {
	const manifest = readJson<OperationManifest>(OPERATIONS_PATH);
	if (!manifest || !Array.isArray(manifest.operations)) {
		throw new Error('operations.json must include an operations array.');
	}

	const operations = manifest.operations;
	const nonAdminOperations = operations.filter(entry => !isAdminOperation(entry));
	const operationIds = new Set(operations.map(entry => entry.operationId));
	const releaseCriticalOperationIds = loadReleaseCriticalOperationIds();
	const handlers = new Set(Object.keys(defaultMockHandlers));
	const notImplementedHandlers = new Set<string>(notImplementedOperationIds);
	const waivers = loadWaivers();
	const fixturesByOperation = collectFixtures();
	const forbiddenFallbackPatterns = detectForbiddenFallbackPatterns();
	const gatewayFiles = getGatewayFiles();
	const gatewayFileSet = new Set(gatewayFiles.map(file => relative(process.cwd(), file)));
	const { ownerMap, parseErrors, unknownOperationIds } = collectGatewayOwners(operations, gatewayFiles);
	const {
		mapping: gatewayOperationMapping,
		parseErrors: mappingParseErrors,
		unknownOperationIds: unknownMappedOperationIds,
		unknownGatewayFiles,
	} = loadGatewayOperationMapping(operationIds, gatewayFileSet);

	const missingMockHandlers: OperationEntry[] = [];
	const missingFixtures: OperationEntry[] = [];
	const missingOwners: OperationEntry[] = [];
	const missingGatewayMappings: OperationEntry[] = [];
	const duplicateOwners: Array<{ operation: OperationEntry; owners: string[] }> = [];
	const mappingMismatches: Array<{ operation: OperationEntry; expectedGateway: string; detectedGateway: string }> = [];
	const nonCanonicalFixtures: Array<{ operation: OperationEntry; expectedPath: string; actualPaths: string[] }> = [];
	const releaseCriticalNotImplemented: OperationEntry[] = [];

	const unknownReleaseCriticalOperationIds = [...releaseCriticalOperationIds].filter(operationId => !operationIds.has(operationId));
	const releaseCriticalAdminOperations = operations.filter(entry => isAdminOperation(entry) && releaseCriticalOperationIds.has(entry.operationId));

	for (const entry of nonAdminOperations) {
		const waiverTypes = waivers.get(entry.operationId);
		const mappedGateway = gatewayOperationMapping.get(entry.operationId);
		const owners = ownerMap.get(entry.operationId);
		const fixturePaths = (fixturesByOperation.get(entry.operationId) ?? []).slice().sort();
		const canonicalFixturePath = `packages/api-mock/src/fixtures/generated/${entry.operationId}.json`;
		const hasFixture = fixturePaths.length > 0;
		const hasOnlyCanonicalFixture = hasFixture && fixturePaths.length === 1 && fixturePaths[0] === canonicalFixturePath;

		if (!handlers.has(entry.operationId) && !waiverTypes?.has('missingMockHandler')) {
			missingMockHandlers.push(entry);
		}
		if (!hasFixture && !waiverTypes?.has('missingFixture')) {
			missingFixtures.push(entry);
		}
		if (hasFixture && !hasOnlyCanonicalFixture) {
			nonCanonicalFixtures.push({
				operation: entry,
				expectedPath: canonicalFixturePath,
				actualPaths: fixturePaths,
			});
		}
		if (releaseCriticalOperationIds.has(entry.operationId) && notImplementedHandlers.has(entry.operationId)) {
			releaseCriticalNotImplemented.push(entry);
		}
		if (!mappedGateway) {
			missingGatewayMappings.push(entry);
		}

		if (!owners || owners.size === 0) {
			if (!waiverTypes?.has('missingOwner')) {
				missingOwners.push(entry);
			}
			continue;
		}

		if (owners.size > 1) {
			duplicateOwners.push({ operation: entry, owners: [...owners].sort() });
			continue;
		}

		if (mappedGateway) {
			const detectedGateway = [...owners][0];
			if (mappedGateway !== detectedGateway) {
				mappingMismatches.push({
					operation: entry,
					expectedGateway: mappedGateway,
					detectedGateway,
				});
			}
		}
	}

	const blockingErrors: string[] = [];
	for (const error of parseErrors) {
		blockingErrors.push(`- ${error}`);
	}
	for (const error of mappingParseErrors) {
		blockingErrors.push(`- ${error}`);
	}
	for (const unknownOperationId of unknownOperationIds) {
		blockingErrors.push(`- Unknown operationId referenced by gateway: ${unknownOperationId}`);
	}
	for (const unknownOperationId of unknownMappedOperationIds) {
		blockingErrors.push(`- Unknown operationId referenced by gatewayOperationMapping: ${unknownOperationId}`);
	}
	for (const unknownOperationId of unknownReleaseCriticalOperationIds) {
		blockingErrors.push(`- Unknown operationId referenced by release-critical catalog: ${unknownOperationId}`);
	}
	for (const entry of releaseCriticalAdminOperations) {
		blockingErrors.push(
			`- ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path}) is admin but listed as release-critical (action: keep release-critical catalog non-admin only)`,
		);
	}
	for (const unknownGatewayFile of unknownGatewayFiles) {
		blockingErrors.push(`- Unknown gateway file referenced by gatewayOperationMapping: ${unknownGatewayFile}`);
	}
	for (const pattern of forbiddenFallbackPatterns) {
		blockingErrors.push(
			`- fallbackMockHandlerForbidden (${relative(process.cwd(), HANDLERS_PATH)}): ${pattern} (action: declare per-operation handlers explicitly via implemented/notImplemented entries)`,
		);
	}
	for (const entry of missingOwners) {
		blockingErrors.push(
			`- ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path}) missing owner (action: add operationOwners entry in mapped gateway and keep mapping in apps/rankup-spa/services/api/gateway-mapping.ts in sync)`,
		);
	}
	for (const entry of missingGatewayMappings) {
		blockingErrors.push(
			`- ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path}) missing gatewayOperationMapping entry (action: add apps/rankup-spa/services/api/gateway-mapping.ts#gatewayOperationMapping.${entry.operationId})`,
		);
	}
	for (const duplicate of duplicateOwners) {
		blockingErrors.push(
			`- ${duplicate.operation.operationId} (${duplicate.operation.method.toUpperCase()} ${duplicate.operation.path}) has duplicate owners: ${duplicate.owners.join(', ')}`,
		);
	}
	for (const mismatch of mappingMismatches) {
		blockingErrors.push(
			`- ${mismatch.operation.operationId} (${mismatch.operation.method.toUpperCase()} ${mismatch.operation.path}) mapping mismatch: gatewayOperationMapping=${mismatch.expectedGateway}, detectedOwner=${mismatch.detectedGateway}`,
		);
	}
	for (const entry of missingMockHandlers) {
		blockingErrors.push(
			`- ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path}) missing defaultMockHandlers entry (action: add explicit handler or waiver missingMockHandler)`,
		);
	}
	for (const entry of missingFixtures) {
		blockingErrors.push(
			`- ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path}) missing fixture (action: add packages/api-mock/src/fixtures/generated/${entry.operationId}.json or waiver missingFixture)`,
		);
	}
	for (const entry of nonCanonicalFixtures) {
		blockingErrors.push(
			`- ${entry.operation.operationId} (${entry.operation.method.toUpperCase()} ${entry.operation.path}) nonCanonicalFixturePath: expected=${entry.expectedPath}; actual=${entry.actualPaths.join(
				', ',
			)} (action: keep exactly one canonical fixture at packages/api-mock/src/fixtures/generated/<operationId>.json)`,
		);
	}
	for (const entry of releaseCriticalNotImplemented) {
		blockingErrors.push(
			`- ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path}) releaseCriticalNotImplemented (action: replace 501 fallback with explicit handler behavior and remove from packages/api-mock/src/core/not-implemented-handler.ts)`,
		);
	}

	const releaseCriticalNonAdminCount = nonAdminOperations.filter(entry => releaseCriticalOperationIds.has(entry.operationId)).length;

	console.log('repo:operation-coverage (global)');
	console.log(`- non-admin operations: ${nonAdminOperations.length}`);
	console.log(`- release-critical operations: ${releaseCriticalNonAdminCount}`);
	console.log(`- with owners: ${nonAdminOperations.length - missingOwners.length}/${nonAdminOperations.length}`);
	console.log(`- with gateway mapping: ${nonAdminOperations.length - missingGatewayMappings.length}/${nonAdminOperations.length}`);
	console.log(`- with defaultMockHandlers: ${nonAdminOperations.length - missingMockHandlers.length}/${nonAdminOperations.length}`);
	console.log(`- with fixtures: ${nonAdminOperations.length - missingFixtures.length}/${nonAdminOperations.length}`);
	console.log(`- with canonical fixtures: ${nonAdminOperations.length - missingFixtures.length - nonCanonicalFixtures.length}/${nonAdminOperations.length}`);
	console.log(`- releaseCriticalNotImplemented: ${releaseCriticalNotImplemented.length}/${releaseCriticalNonAdminCount}`);

	if (blockingErrors.length > 0) {
		console.error('repo:operation-coverage failed');
		for (const error of blockingErrors) {
			console.error(error);
		}
		process.exit(1);
	}
}

try {
	run();
} catch (error) {
	console.error('repo:operation-coverage failed');
	console.error(error);
	process.exit(1);
}
