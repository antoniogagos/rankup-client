import { getFolders, coalesce } from './utils';
import { relativeFromFileURL } from './path';
import fs from 'fs';
import Path from 'path';

// import type { RankupJSON } from '@rankup/common/types/rankup-json.js';

const MONOREPO_FOLDER = relativeFromFileURL(__filename, '../packages');

export const PACKAGE_NAMES = getFolders(MONOREPO_FOLDER);

// export function getRankupFiles(packages: string[]): RankupJSON[] {
// 	return coalesce(packages.map(pkgName => getRankupFile(pkgName)));
// }

// export function getRankupFile(pkgName: string): RankupJSON | undefined {
// 	const path = Path.join(MONOREPO_FOLDER, pkgName, 'rankup.json');
// 	if (fs.statSync(path, { throwIfNoEntry: false })?.isFile()) {
// 		const content = fs.readFileSync(path, { encoding: 'utf-8' });
// 		try {
// 			const meta = JSON.parse(content) as RankupJSON;
// 			return meta;
// 		} catch (error) {
// 			console.error(error);
// 		}
// 	}
// }
