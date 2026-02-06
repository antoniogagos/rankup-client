import { execSync } from 'child_process';

export type Change = {
	status: string;
	path: string;
	oldPath?: string;
};

function runGit(command: string): string {
	return execSync(command, { encoding: 'utf8' }).toString();
}

export function getChangedFiles(): Change[] {
	const output = runGit('git diff --name-status -z HEAD');
	if (!output) {
		return [];
	}
	const parts = output.split('\0').filter(Boolean);
	const changes: Change[] = [];
	let i = 0;
	while (i < parts.length) {
		const status = parts[i++] ?? '';
		if (status.startsWith('R') || status.startsWith('C')) {
			const oldPath = parts[i++] ?? '';
			const path = parts[i++] ?? '';
			if (path) {
				changes.push({ status, path, oldPath });
			}
		} else {
			const path = parts[i++] ?? '';
			if (path) {
				changes.push({ status, path });
			}
		}
	}
	return changes;
}

export function getUntrackedFiles(): string[] {
	const output = runGit('git ls-files --others --exclude-standard -z');
	if (!output) {
		return [];
	}
	return output.split('\0').filter(Boolean);
}

export function getTrackedFiles(): string[] {
	const output = runGit('git ls-files -z');
	if (!output) {
		return [];
	}
	return output.split('\0').filter(Boolean);
}

export function hasFile(changes: Change[], filePath: string): boolean {
	return changes.some(change => change.path === filePath || change.oldPath === filePath);
}

export function hasPrefix(changes: Change[], prefix: string): boolean {
	return changes.some(change => change.path.startsWith(prefix));
}
