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

type WaiverEntry = {
	operationId: string;
	waiverType: string;
};

const OPERATIONS_PATH = resolve(process.cwd(), 'packages/api/src/generated/operations.json');
const WAIVERS_PATH = resolve(process.cwd(), 'diagnostics/operation-waivers.json');
const GATEWAY_MAPPING_PATH = resolve(process.cwd(), 'apps/rankup-spa/services/api/gateway-mapping.ts');

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
	const unknownOperationIds: string[] = [];
	const parseErrors: string[] = [];

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
			const entry = operationMap.get(operationId);
			if (entry && isAdminOperation(entry)) {
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

function run(): void {
	const manifest = readJson<OperationManifest>(OPERATIONS_PATH);
	if (!manifest || !Array.isArray(manifest.operations)) {
		throw new Error('operations.json must include an operations array.');
	}

	const operations = manifest.operations;
	const nonAdminOperations = operations.filter(entry => !isAdminOperation(entry));
	const operationIds = new Set(operations.map(entry => entry.operationId));
	const waivers = loadWaivers();
	const gatewayFiles = getGatewayFiles();
	const gatewayFileSet = new Set(gatewayFiles.map(file => relative(process.cwd(), file)));
	const { ownerMap, parseErrors, unknownOperationIds } = collectGatewayOwners(operations, gatewayFiles);
	const {
		mapping: gatewayOperationMapping,
		parseErrors: mappingParseErrors,
		unknownOperationIds: unknownMappedOperationIds,
		unknownGatewayFiles,
	} = loadGatewayOperationMapping(operationIds, gatewayFileSet);

	const missingOwners: OperationEntry[] = [];
	const missingGatewayMappings: OperationEntry[] = [];
	const duplicates: Array<{ operation: OperationEntry; owners: string[] }> = [];
	const mappingMismatches: Array<{ operation: OperationEntry; expectedGateway: string; detectedGateway: string }> = [];

	for (const entry of nonAdminOperations) {
		const waiverTypes = waivers.get(entry.operationId);
		const mappedGateway = gatewayOperationMapping.get(entry.operationId);
		const owners = ownerMap.get(entry.operationId);

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
			duplicates.push({ operation: entry, owners: [...owners].sort() });
			continue;
		}
		if (mappedGateway) {
			const detectedGateway = [...owners][0];
			if (mappedGateway !== detectedGateway) {
				mappingMismatches.push({ operation: entry, expectedGateway: mappedGateway, detectedGateway });
			}
		}
	}

	const errors: string[] = [];
	for (const parseError of parseErrors) {
		errors.push(`- ${parseError}`);
	}
	for (const parseError of mappingParseErrors) {
		errors.push(`- ${parseError}`);
	}
	for (const unknown of unknownOperationIds) {
		errors.push(`- Unknown operationId referenced: ${unknown}`);
	}
	for (const unknown of unknownMappedOperationIds) {
		errors.push(`- Unknown operationId referenced by gatewayOperationMapping: ${unknown}`);
	}
	for (const unknown of unknownGatewayFiles) {
		errors.push(`- Unknown gateway file referenced by gatewayOperationMapping: ${unknown}`);
	}
	for (const entry of missingOwners) {
		errors.push(
			`- ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path}) missing owner (action: add operationOwners entry in mapped gateway)`,
		);
	}
	for (const entry of missingGatewayMappings) {
		errors.push(
			`- ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path}) missing gatewayOperationMapping entry (action: add apps/rankup-spa/services/api/gateway-mapping.ts#gatewayOperationMapping.${entry.operationId})`,
		);
	}
	for (const duplicate of duplicates) {
		errors.push(
			`- ${duplicate.operation.operationId} (${duplicate.operation.method.toUpperCase()} ${duplicate.operation.path}) duplicate owners: ${duplicate.owners.join(', ')}`,
		);
	}
	for (const mismatch of mappingMismatches) {
		errors.push(
			`- ${mismatch.operation.operationId} (${mismatch.operation.method.toUpperCase()} ${mismatch.operation.path}) mapping mismatch: gatewayOperationMapping=${mismatch.expectedGateway}, detectedOwner=${mismatch.detectedGateway}`,
		);
	}

	console.log(`gateways:ownership (global) -> non-admin operations: ${nonAdminOperations.length}`);
	console.log(`- with explicit owner: ${nonAdminOperations.length - missingOwners.length}/${nonAdminOperations.length}`);
	console.log(`- with gateway mapping: ${nonAdminOperations.length - missingGatewayMappings.length}/${nonAdminOperations.length}`);

	if (errors.length > 0) {
		console.error('gateways:ownership failed');
		for (const error of errors) {
			console.error(error);
		}
		process.exit(1);
	}
}

try {
	run();
} catch (error) {
	console.error('gateways:ownership failed');
	console.error(error);
	process.exit(1);
}
