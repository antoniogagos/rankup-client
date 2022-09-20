import { fileURLToPath } from 'url';
import Path from 'path';

/**
 * @param {string} moduleURL
 * @param {...string} paths`
 * @returns {string}
 */
export function relativeFromFileURL(moduleURL, ...paths) {
	const dir = Path.dirname(fileURLToPath(moduleURL));
	return Path.resolve(dir, ...paths);
}
