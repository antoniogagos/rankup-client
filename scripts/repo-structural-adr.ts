import { getChangedFiles, getUntrackedFiles, type Change } from './repo-utils';

const STRUCTURAL_PATTERNS: RegExp[] = [/^package\.json$/, /^packages\/[^/]+\/package\.json$/, /^tsconfig.*\.json$/, /^packages\/[^/]+\/tsconfig.*\.json$/, /^\.nvmrc$/, /^\.yarnrc\.yml$/, /^rollup\.config\./, /^web-dev-server\.config\./, /^\.github\/workflows\/.*\.yml$/, /^docs\/quality\//, /^docs\/engineering\//];

function isStructural(path: string): boolean {
	return STRUCTURAL_PATTERNS.some(pattern => pattern.test(path));
}

function hasAdrChange(changes: Change[], untracked: string[]): boolean {
	const adrPaths = changes
		.map(change => change.path)
		.concat(untracked)
		.filter(path => path.startsWith('docs/adr/'))
		.filter(path => path !== 'docs/adr/README.md')
		.filter(path => path !== 'docs/adr/PENDING.md');
	return adrPaths.some(path => /^docs\/adr\/\d{4}-/.test(path));
}

function hasAdrIndexChange(changes: Change[], untracked: string[]): boolean {
	return changes.some(change => change.path === 'docs/adr/README.md') || untracked.includes('docs/adr/README.md');
}

export function runStructuralAdr(): void {
	const changes = getChangedFiles();
	const untracked = getUntrackedFiles();
	const structuralChanges = changes
		.map(change => change.path)
		.concat(untracked)
		.filter(isStructural);

	if (structuralChanges.length === 0) {
		return;
	}

	const adrChanged = hasAdrChange(changes, untracked);
	const adrIndexChanged = hasAdrIndexChange(changes, untracked);

	if (!adrChanged || !adrIndexChanged) {
		console.error('repo:structural-adr failed');
		console.error(`- structural changes detected: ${structuralChanges.join(', ')}`);
		if (!adrChanged) {
			console.error('- missing ADR update in docs/adr/0000-*.md');
		}
		if (!adrIndexChanged) {
			console.error('- missing ADR index update in docs/adr/README.md');
		}
		process.exit(1);
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	runStructuralAdr();
}
