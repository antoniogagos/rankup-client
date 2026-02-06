import { getChangedFiles, getUntrackedFiles, type Change } from './repo-utils';

const STRUCTURAL_PATTERNS: RegExp[] = [/^package\.json$/, /^packages\/[^/]+\/package\.json$/, /^tsconfig.*\.json$/, /^packages\/[^/]+\/tsconfig.*\.json$/, /^\.nvmrc$/, /^\.yarnrc\.yml$/, /^rollup\.config\./, /^web-dev-server\.config\./, /^\.github\/workflows\/.*\.yml$/, /^docs\/quality\//, /^docs\/engineering\//, /^docs\/architecture\//, /^docs\/work\//];

function isStructural(path: string): boolean {
	return STRUCTURAL_PATTERNS.some(pattern => pattern.test(path));
}

function getAllPaths(changes: Change[], untracked: string[]): string[] {
	const paths = changes.flatMap(change => [change.path, change.oldPath].filter(Boolean) as string[]);
	return paths.concat(untracked);
}

function getTodayString(): string {
	const now = new Date();
	const yyyy = now.getFullYear();
	const mm = String(now.getMonth() + 1).padStart(2, '0');
	const dd = String(now.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

export function runWorkLogGuardrail(): void {
	const changes = getChangedFiles();
	const untracked = getUntrackedFiles();
	const allPaths = getAllPaths(changes, untracked);
	const structuralChanges = allPaths.filter(isStructural);

	if (structuralChanges.length === 0) {
		return;
	}

	const today = getTodayString();
	const requiredLog = `docs/work/log/${today}.md`;

	const currentUpdated = allPaths.includes('docs/work/CURRENT.md');
	const epicUpdated = allPaths.some(path => path.startsWith('docs/work/epics/') && path.endsWith('.md'));
	const logUpdated = allPaths.includes(requiredLog);

	const errors: string[] = [];
	if (!currentUpdated) {
		errors.push('docs/work/CURRENT.md not updated');
	}
	if (!epicUpdated) {
		errors.push('docs/work/epics/*.md not updated');
	}
	if (!logUpdated) {
		errors.push(`${requiredLog} not updated`);
	}

	if (errors.length > 0) {
		console.error('repo:work-log failed');
		console.error(`- structural changes detected: ${structuralChanges.join(', ')}`);
		for (const error of errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runWorkLogGuardrail();
}
