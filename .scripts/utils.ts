import fs from 'fs';

/**
 * @returns mew array with all falsy values removed. The original array IS NOT modified.
 */
export function coalesce<T>(array: ReadonlyArray<T | undefined | null>): T[] {
	return array.filter(e => !!e) as T[];
}

export function getFolders(folder: string): string[] {
	return fs
		.readdirSync(folder, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);
}
