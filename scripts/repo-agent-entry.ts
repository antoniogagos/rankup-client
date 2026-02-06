import { getChangedFiles, getUntrackedFiles, type Change } from './repo-utils';

const STRUCTURAL_PATTERNS: RegExp[] = [/^package\.json$/, /^packages\/[^/]+\/package\.json$/, /^tsconfig.*\.json$/, /^packages\/[^/]+\/tsconfig.*\.json$/, /^\.nvmrc$/, /^\.yarnrc\.yml$/, /^rollup\.config\./, /^web-dev-server\.config\./, /^\.github\/workflows\/.*\.yml$/, /^docs\/quality\//, /^docs\/engineering\//, /^docs\/architecture\//, /^docs\/work\//];

function isStructural(path: string): boolean {
	return STRUCTURAL_PATTERNS.some(pattern => pattern.test(path));
}

function getAllPaths(changes: Change[], untracked: string[]): string[] {
	const paths = changes.flatMap(change => [change.path, change.oldPath].filter(Boolean) as string[]);
	return paths.concat(untracked);
}

export function runAgentEntryGuardrail(): void {
	const changes = getChangedFiles();
	const untracked = getUntrackedFiles();
	const allPaths = getAllPaths(changes, untracked);
	const structuralChanges = allPaths.filter(isStructural);

	if (structuralChanges.length === 0) {
		return;
	}

	const agentsUpdated = allPaths.includes('AGENTS.md');
	const currentUpdated = allPaths.includes('docs/work/CURRENT.md');

	const errors: string[] = [];
	if (!agentsUpdated) {
		errors.push('AGENTS.md not updated');
	}
	if (!currentUpdated) {
		errors.push('docs/work/CURRENT.md not updated');
	}

	if (errors.length > 0) {
		console.error('repo:agent-entry failed');
		console.error(`- structural changes detected: ${structuralChanges.join(', ')}`);
		for (const error of errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runAgentEntryGuardrail();
}
