import fs from 'fs';

/**
 * @template T
 * @param {ReadonlyArray<T | undefined | null>} array
 * @returns {T[]} New array with all falsy values removed. The original array IS NOT modified.
 */
export function coalesce(array) {
	return /** @type {T[]} */ (array.filter(e => !!e));
}

/**
 * @param {string} folder
 */
export function getFolders(folder) {
	return fs
		.readdirSync(folder, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);
}
