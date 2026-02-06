import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as ts from 'typescript';
import { defaultMockHandlers } from '../packages/api-mock/src/core/handlers.js';

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
	reason: string;
	owner: string;
	issue: string;
	createdAt: string;
	expiresOn: string;
	scope: string;
	severity: string;
};

type Fixture = {
	operationId: string;
};

const OPERATIONS_PATH = resolve(process.cwd(), 'packages/api/src/generated/operations.json');
const WAIVERS_PATH = resolve(process.cwd(), 'diagnostics/operation-waivers.json');

const DEFAULT_OWNER = process.env.WAIVERS_OWNER ?? 'rankup-platform';
const DEFAULT_ISSUE = process.env.WAIVERS_ISSUE ?? 'migration-adr-0056';
const DEFAULT_REASON = process.env.WAIVERS_REASON ?? 'Seeded by waivers:seed for ADR-0056 rollout.';
const DEFAULT_SEVERITY = process.env.WAIVERS_SEVERITY ?? 'P0';

function readJson<T>(path: string): T {
	return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function writeJson(path: string, data: unknown): void {
	writeFileSync(path, `${JSON.stringify(data, null, '\t')}\n`, 'utf8');
}

function isAdminOperation(entry: OperationEntry): boolean {
	const tags = entry.tags ?? [];
	if (tags.some(tag => tag === 'admin' || tag.startsWith('admin.'))) {
		return true;
	}
	return entry.path.startsWith('/admin');
}

function getDateStamp(date: Date): string {
	return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
	const next = new Date(date);
	next.setUTCDate(next.getUTCDate() + days);
	return next;
}

function loadWaivers(): WaiverEntry[] {
	const raw = readJson<unknown>(WAIVERS_PATH);
	if (!Array.isArray(raw)) {
		throw new Error('operation-waivers.json must be a JSON array.');
	}
	return raw as WaiverEntry[];
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

function extractOperationOwners(source: ts.SourceFile): { entries: string[]; found: boolean } {
	const entries: string[] = [];
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
	return { entries, found };
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

function loadFixtureOperationIds(): Set<string> {
	const ids = new Set<string>();
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
		if (data?.operationId) {
			ids.add(data.operationId);
		}
	}
	return ids;
}

function loadOwnerOperationIds(operationIds: Set<string>): Set<string> {
	const owners = new Set<string>();
	for (const file of getGatewayFiles()) {
		const text = readFileSync(file, 'utf8');
		const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
		const { entries, found } = extractOperationOwners(source);
		const used = found ? entries : inferOperationOwners(source, operationIds);
		for (const operationId of used) {
			owners.add(operationId);
		}
	}
	return owners;
}

function buildWaiver(operationId: string, waiverType: string): WaiverEntry {
	const createdAt = getDateStamp(new Date());
	const expiresOn = getDateStamp(addDays(new Date(), 30));
	const scope = waiverType === 'httpFidelityMissing' ? 'http' : waiverType === 'schemaValidationFlaky' ? 'schema' : 'coverage';
	return {
		operationId,
		waiverType,
		reason: DEFAULT_REASON,
		owner: DEFAULT_OWNER,
		issue: DEFAULT_ISSUE,
		createdAt,
		expiresOn,
		scope,
		severity: DEFAULT_SEVERITY,
	};
}

function run() {
	const manifest = readJson<OperationManifest>(OPERATIONS_PATH);
	if (!manifest || !Array.isArray(manifest.operations)) {
		throw new Error('operations.json must include an operations array.');
	}

	const operations = manifest.operations.filter(entry => !isAdminOperation(entry));
	const operationIds = new Set(operations.map(entry => entry.operationId));
	const handlerIds = new Set(Object.keys(defaultMockHandlers));
	const fixtureIds = loadFixtureOperationIds();
	const ownerIds = loadOwnerOperationIds(operationIds);

	const existing = loadWaivers();
	const existingKey = new Set(existing.map(waiver => `${waiver.operationId}:${waiver.waiverType}`));
	const next: WaiverEntry[] = [...existing];

	for (const entry of operations) {
		if (!handlerIds.has(entry.operationId) && !existingKey.has(`${entry.operationId}:missingMockHandler`)) {
			next.push(buildWaiver(entry.operationId, 'missingMockHandler'));
			existingKey.add(`${entry.operationId}:missingMockHandler`);
		}
		if (!fixtureIds.has(entry.operationId) && !existingKey.has(`${entry.operationId}:missingFixture`)) {
			next.push(buildWaiver(entry.operationId, 'missingFixture'));
			existingKey.add(`${entry.operationId}:missingFixture`);
		}
		if (!fixtureIds.has(entry.operationId) && !existingKey.has(`${entry.operationId}:httpFidelityMissing`)) {
			next.push(buildWaiver(entry.operationId, 'httpFidelityMissing'));
			existingKey.add(`${entry.operationId}:httpFidelityMissing`);
		}
		if (!ownerIds.has(entry.operationId) && !existingKey.has(`${entry.operationId}:missingOwner`)) {
			next.push(buildWaiver(entry.operationId, 'missingOwner'));
			existingKey.add(`${entry.operationId}:missingOwner`);
		}
	}

	next.sort((a, b) => {
		if (a.operationId === b.operationId) {
			return a.waiverType.localeCompare(b.waiverType);
		}
		return a.operationId.localeCompare(b.operationId);
	});

	writeJson(WAIVERS_PATH, next);
	console.log(`waivers:seed -> ${next.length} entries`);
}

try {
	run();
} catch (error) {
	console.error('waivers:seed failed');
	console.error(error);
	process.exit(1);
}
