import { getFolders, coalesce } from './utils.mjs';
import { relativeFromFileURL } from './path.mjs';
import fs from 'fs';
import Path from 'path';

/** @typedef {import('@rankup/common/types/rankup-json').RankupJSON} RankupJSON */

const MONOREPO_FOLDER = relativeFromFileURL(import.meta.url, '../packages');

export const PACKAGE_NAMES = getFolders(MONOREPO_FOLDER);

/**
 * @param {string[]} packages
 * @return {RankupJSON[]}
 */
export function getRankupFiles(packages) {
	return coalesce(packages.map(pkgName => getRankupFile(pkgName)));
}

/**
 * @param {string} pkgName
 * @return {RankupJSON | undefined}
 */
export function getRankupFile(pkgName) {
	const path = Path.join(MONOREPO_FOLDER, pkgName, 'rankup.json');
	if (fs.statSync(path, { throwIfNoEntry: false })?.isFile()) {
		const content = fs.readFileSync(path, { encoding: 'utf-8' });
		try {
			/** @type {RankupJSON} */
			const meta = JSON.parse(content);
			return meta;
		} catch (error) {
			console.error(error);
		}
	}
}
