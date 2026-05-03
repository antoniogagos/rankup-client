import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ALLOWLIST_PATH = resolve(process.cwd(), 'diagnostics/operation-waivers.json');
const OPERATIONS_PATH = resolve(process.cwd(), 'packages/api/src/generated/operations.json');

const WAIVER_TYPES = new Set(['missingMockHandler', 'missingFixture', 'missingOwner', 'httpFidelityMissing', 'schemaValidationFlaky']);
const WAIVER_SCOPES = new Set(['coverage', 'schema', 'http']);
const WAIVER_SEVERITIES = new Set(['P0', 'P1', 'P2']);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DAYS_TO_MS = 24 * 60 * 60 * 1000;

const MAX_WAIVERS_TOTAL = Number.isFinite(Number(process.env.WAIVERS_MAX_TOTAL)) ? Number(process.env.WAIVERS_MAX_TOTAL) : 0;
const MAX_WAIVER_TTL_DAYS = Number.isFinite(Number(process.env.WAIVER_MAX_TTL_DAYS)) ? Number(process.env.WAIVER_MAX_TTL_DAYS) : 30;

type OperationManifest = {
	operations: Array<{
		operationId: string;
		method: string;
		path: string;
		tags: string[];
	}>;
};

type WaiverEntry = {
	operationId: string;
	waiverType: string;
	reason: string;
	owner: string;
	issue: string;
	createdAt: string;
	expiresAt: string;
	plan: string;
	scope: string;
	severity: string;
};

function readJson<T>(path: string): T {
	return JSON.parse(readFileSync(path, 'utf8')) as T;
}

function formatDate(value: string): Date | null {
	if (!DATE_RE.test(value)) {
		return null;
	}
	const parsed = new Date(`${value}T00:00:00Z`);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function requiredString(value: unknown): string | null {
	if (typeof value !== 'string') {
		return null;
	}
	const normalized = value.trim();
	return normalized.length > 0 ? normalized : null;
}

function getUtcTodayStart(): Date {
	const now = new Date();
	now.setUTCHours(0, 0, 0, 0);
	return now;
}

function loadOperationIds(): Set<string> {
	const manifest = readJson<OperationManifest>(OPERATIONS_PATH);
	if (!manifest || !Array.isArray(manifest.operations)) {
		throw new Error('operations.json must include an operations array.');
	}
	return new Set(manifest.operations.map(operation => operation.operationId));
}

function loadWaivers(): WaiverEntry[] {
	const raw = readJson<unknown>(ALLOWLIST_PATH);
	if (!Array.isArray(raw)) {
		throw new Error('operation-waivers.json must be a JSON array.');
	}
	return raw as WaiverEntry[];
}

function validateWaivers(waivers: WaiverEntry[], operationIds: Set<string>): string[] {
	const errors: string[] = [];
	const todayStart = getUtcTodayStart();
	const seen = new Set<string>();

	waivers.forEach((waiver, index) => {
		const prefix = `waiver[${index}]`;
		if (!waiver || typeof waiver !== 'object') {
			errors.push(`${prefix} must be an object.`);
			return;
		}
		if ('expiresOn' in (waiver as Record<string, unknown>)) {
			errors.push(`${prefix}.expiresOn is legacy; use expiresAt.`);
		}
		if (!requiredString(waiver.operationId)) {
			errors.push(`${prefix}.operationId is required.`);
		} else if (!operationIds.has(waiver.operationId)) {
			errors.push(`${prefix}.operationId \"${waiver.operationId}\" not found in operations manifest.`);
		}
		if (!WAIVER_TYPES.has(waiver.waiverType)) {
			errors.push(`${prefix}.waiverType must be one of ${[...WAIVER_TYPES].join(', ')}.`);
		}
		const dedupeKey = `${waiver.operationId}:${waiver.waiverType}`;
		if (seen.has(dedupeKey)) {
			errors.push(`${prefix} duplicates waiver for ${dedupeKey}.`);
		}
		seen.add(dedupeKey);
		if (!requiredString(waiver.reason)) {
			errors.push(`${prefix}.reason is required.`);
		}
		if (!requiredString(waiver.owner)) {
			errors.push(`${prefix}.owner is required.`);
		}
		if (!requiredString(waiver.issue)) {
			errors.push(`${prefix}.issue is required.`);
		}
		if (!requiredString(waiver.plan)) {
			errors.push(`${prefix}.plan is required.`);
		}
		if (!WAIVER_SCOPES.has(waiver.scope)) {
			errors.push(`${prefix}.scope must be one of ${[...WAIVER_SCOPES].join(', ')}.`);
		}
		if (!WAIVER_SEVERITIES.has(waiver.severity)) {
			errors.push(`${prefix}.severity must be one of ${[...WAIVER_SEVERITIES].join(', ')}.`);
		}
		const createdAt = waiver.createdAt ? formatDate(waiver.createdAt) : null;
		if (!createdAt) {
			errors.push(`${prefix}.createdAt must be YYYY-MM-DD.`);
		}
		const expiresAt = waiver.expiresAt ? formatDate(waiver.expiresAt) : null;
		if (!expiresAt) {
			errors.push(`${prefix}.expiresAt must be YYYY-MM-DD.`);
		}
		if (createdAt && expiresAt) {
			if (expiresAt.getTime() < createdAt.getTime()) {
				errors.push(`${prefix}.expiresAt ${waiver.expiresAt} must be >= createdAt ${waiver.createdAt}.`);
			}
			const ttlDays = Math.floor((expiresAt.getTime() - createdAt.getTime()) / DAYS_TO_MS);
			if (ttlDays > MAX_WAIVER_TTL_DAYS) {
				errors.push(`${prefix}.expiresAt exceeds max TTL (${ttlDays} > ${MAX_WAIVER_TTL_DAYS} days).`);
			}
		}
		if (expiresAt && expiresAt.getTime() < todayStart.getTime()) {
			errors.push(`${prefix}.expiresAt ${waiver.expiresAt} is expired.`);
		}
	});

	if (MAX_WAIVERS_TOTAL >= 0 && waivers.length > MAX_WAIVERS_TOTAL) {
		errors.push(`Waiver budget exceeded: ${waivers.length} > ${MAX_WAIVERS_TOTAL}.`);
	}

	return errors;
}

function reportWaivers(waivers: WaiverEntry[]) {
	const now = getUtcTodayStart();
	const soon = waivers.filter(waiver => {
		const expiresAt = waiver.expiresAt ? formatDate(waiver.expiresAt) : null;
		if (!expiresAt) {
			return false;
		}
		const delta = expiresAt.getTime() - now.getTime();
		return delta <= 7 * 24 * 60 * 60 * 1000;
	});

	const owners = new Map<string, number>();
	for (const waiver of waivers) {
		owners.set(waiver.owner, (owners.get(waiver.owner) ?? 0) + 1);
	}
	const ownerRows = [...owners.entries()].sort((a, b) => b[1] - a[1]);

	console.log(`waivers: total=${waivers.length}`);
	if (soon.length > 0) {
		console.log('waivers expiring <= 7 days:');
		for (const waiver of soon) {
			console.log(`- ${waiver.operationId} (${waiver.expiresAt}) [${waiver.owner}]`);
		}
	} else {
		console.log('waivers expiring <= 7 days: none');
	}
	if (ownerRows.length > 0) {
		console.log('waivers by owner:');
		for (const [owner, count] of ownerRows) {
			console.log(`- ${owner}: ${count}`);
		}
	}
	console.log(`waiver max ttl days: ${MAX_WAIVER_TTL_DAYS}`);
}

function usage(): void {
	console.error('Usage: yarn waivers:check | yarn waivers:report');
}

function run() {
	const mode = process.argv[2];
	if (!mode || (mode !== 'check' && mode !== 'report')) {
		usage();
		process.exit(1);
	}

	const operationIds = loadOperationIds();
	const waivers = loadWaivers();
	const errors = validateWaivers(waivers, operationIds);

	if (errors.length > 0) {
		console.error('operation-waivers check failed');
		for (const error of errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}

	if (mode === 'report') {
		reportWaivers(waivers);
	}
}

try {
	run();
} catch (error) {
	console.error('operation-waivers check failed');
	console.error(error);
	process.exit(1);
}
