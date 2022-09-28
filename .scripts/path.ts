import { fileURLToPath } from 'url';
import Path from 'path';

export function relativeFromFileURL(moduleURL: string, ...paths: string[]): string {
	const _moduleURL = moduleURL.startsWith('file:') ? moduleURL : 'file://' + moduleURL;
	const dir = Path.dirname(fileURLToPath(_moduleURL));
	return Path.resolve(dir, ...paths);
}
