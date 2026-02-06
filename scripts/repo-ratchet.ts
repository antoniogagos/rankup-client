import { existsSync } from 'node:fs';
import { extname } from 'node:path';
import { getChangedFiles, getTrackedFiles, getUntrackedFiles, hasFile, hasPrefix, type Change } from './repo-utils';

const JS_EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);
const JS_ALLOWLIST_PREFIXES = ['scripts/eslint-rules/'];
const JS_ALLOWLIST_FILES = new Set([
	'eslint.config.js',
	'web-dev-server.config.mjs',
	'apps/rankup-spa/web-dev-server.config.mjs',
	'apps/rankup-web/web-dev-server.config.mjs',
]);

function isDistPath(filePath: string): boolean {
	if (filePath.startsWith('dist/')) {
		return true;
	}
	return filePath.split('/').includes('dist');
}

function isJsFile(filePath: string): boolean {
	return JS_EXTENSIONS.has(extname(filePath));
}

function isAllowedJsFile(filePath: string): boolean {
	if (JS_ALLOWLIST_FILES.has(filePath)) {
		return true;
	}
	return JS_ALLOWLIST_PREFIXES.some(prefix => filePath.startsWith(prefix));
}

function getAddedJsFiles(changes: Change[], untracked: string[]): string[] {
	const added: string[] = [];
	for (const change of changes) {
		if (change.status.startsWith('A') || change.status.startsWith('C')) {
			if (isJsFile(change.path)) {
				added.push(change.path);
			}
			continue;
		}
		if (change.status.startsWith('R')) {
			const oldIsJs = change.oldPath ? isJsFile(change.oldPath) : false;
			const newIsJs = isJsFile(change.path);
			if (newIsJs && !oldIsJs) {
				added.push(change.path);
			}
		}
	}
	for (const filePath of untracked) {
		if (isJsFile(filePath)) {
			added.push(filePath);
		}
	}
	return added;
}

function getDistChanges(changes: Change[], untracked: string[]): string[] {
	const distChanges: string[] = [];
	for (const change of changes) {
		if (isDistPath(change.path)) {
			distChanges.push(change.path);
		}
	}
	for (const filePath of untracked) {
		if (isDistPath(filePath)) {
			distChanges.push(filePath);
		}
	}
	return distChanges;
}

function getOpenApiViolations(changes: Change[], untracked: string[]): string[] {
	const violations: string[] = [];
	const openApiPath = 'packages/api/openapi.yaml';
	const openApiChanged = hasFile(changes, openApiPath) || untracked.includes(openApiPath);
	if (!openApiChanged) {
		return violations;
	}
	const generatedChanged = hasFile(changes, 'packages/api/src/generated/openapi.ts');
	if (!generatedChanged) {
		violations.push(`${openApiPath} changed without updating packages/api/src/generated/openapi.ts`);
	}
	const mockChanged = hasPrefix(changes, 'packages/api-mock/src/') || untracked.some(filePath => filePath.startsWith('packages/api-mock/src/'));
	if (!mockChanged) {
		violations.push(`${openApiPath} changed without updating mocks in packages/api-mock/src/`);
	}
	return violations;
}

export function runRatchet(): void {
	const changes = getChangedFiles();
	const tracked = getTrackedFiles();
	const untracked = getUntrackedFiles();

	const distChanges = getDistChanges(changes, untracked);
	const trackedJs = tracked
		.filter(isJsFile)
		.filter(filePath => existsSync(filePath))
		.filter(filePath => !isAllowedJsFile(filePath));
	const addedJs = getAddedJsFiles(changes, untracked).filter(filePath => !isAllowedJsFile(filePath));
	const openApiViolations = getOpenApiViolations(changes, untracked);

	const errors: string[] = [];

	if (trackedJs.length > 0) {
		errors.push(`tracked JS/MJS/CJS files are not allowed: ${trackedJs.join(', ')}`);
	}
	if (distChanges.length > 0) {
		errors.push(`dist artifacts changed: ${distChanges.join(', ')}`);
	}
	if (addedJs.length > 0) {
		errors.push(`new JS files are not allowed: ${addedJs.join(', ')}`);
	}
	if (openApiViolations.length > 0) {
		errors.push(...openApiViolations);
	}

	if (errors.length > 0) {
		console.error('repo:ratchet failed');
		for (const error of errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runRatchet();
}
