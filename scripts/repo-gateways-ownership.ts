import { execSync } from 'child_process';
import { readFileSync } from 'node:fs';
import { relative,resolve } from 'node:path';
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

function run() {
	const manifest = readJson<OperationManifest>(OPERATIONS_PATH);
	if (!manifest || !Array.isArray(manifest.operations)) {
		throw new Error('operations.json must include an operations array.');
	}

	const operations = manifest.operations;
	const operationMap = new Map<string, OperationEntry>();
	for (const entry of operations) {
		operationMap.set(entry.operationId, entry);
	}
	const operationIds = new Set(operationMap.keys());
	const waivers = loadWaivers();

	const ownerMap = new Map<string, Set<string>>();
	const unknownOperationIds: string[] = [];
	const parseErrors: string[] = [];

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
			const entry = operationMap.get(operationId);
			if (entry && isAdminOperation(entry)) {
				continue;
			}
			const owners = ownerMap.get(operationId) ?? new Set<string>();
			owners.add(owner);
			ownerMap.set(operationId, owners);
		}
	}

	const missing: OperationEntry[] = [];
	const duplicates: Array<{ operationId: string; owners: string[] }> = [];

	for (const entry of operations) {
		if (isAdminOperation(entry)) {
			continue;
		}
		const owners = ownerMap.get(entry.operationId);
		if (!owners || owners.size === 0) {
			const waiverTypes = waivers.get(entry.operationId);
			if (!waiverTypes?.has('missingOwner')) {
				missing.push(entry);
			}
			continue;
		}
		if (owners.size > 1) {
			duplicates.push({ operationId: entry.operationId, owners: [...owners].sort() });
		}
	}

	if (parseErrors.length > 0 || unknownOperationIds.length > 0 || missing.length > 0 || duplicates.length > 0) {
		console.error('gateways:ownership failed');
		for (const error of parseErrors) {
			console.error(`- ${error}`);
		}
		for (const unknown of unknownOperationIds) {
			console.error(`- Unknown operationId referenced: ${unknown}`);
		}
		for (const entry of missing) {
			console.error(`- Missing owner for ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path})`);
		}
		for (const duplicate of duplicates) {
			console.error(`- Duplicate owners for ${duplicate.operationId}: ${duplicate.owners.join(', ')}`);
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
