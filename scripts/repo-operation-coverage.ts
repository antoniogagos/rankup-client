import { defaultMockHandlers } from '../packages/api-mock/src/core/handlers.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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

function run() {
	const manifest = readJson<OperationManifest>(OPERATIONS_PATH);
	if (!manifest || !Array.isArray(manifest.operations)) {
		throw new Error('operations.json must include an operations array.');
	}

	const handlerIds = new Set(Object.keys(defaultMockHandlers));
	const waivers = loadWaivers();
	const missing: OperationEntry[] = [];

	for (const entry of manifest.operations) {
		if (isAdminOperation(entry)) {
			continue;
		}
		if (handlerIds.has(entry.operationId)) {
			continue;
		}
		const waiverTypes = waivers.get(entry.operationId);
		if (waiverTypes?.has('missingMockHandler')) {
			continue;
		}
		missing.push(entry);
	}

	if (missing.length > 0) {
		console.error('api-mock:coverage failed');
		for (const entry of missing) {
			console.error(`- ${entry.operationId} (${entry.method.toUpperCase()} ${entry.path}) missing defaultMockHandlers entry`);
		}
		process.exit(1);
	}
}

try {
	run();
} catch (error) {
	console.error('api-mock:coverage failed');
	console.error(error);
	process.exit(1);
}
