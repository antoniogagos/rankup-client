import { configureTransformLocalization, msg, str } from '@lit/localize';

import AllLocales from './locales.json' assert { type: 'json' };

export { msg, str };

export const { getLocale } = configureTransformLocalization({ sourceLocale: 'es' });

type LocaleType = 'en' | 'es' | 'es-mx' | 'pt-br';

export function updateLocale(newLocale: LocaleType) {
	const url = new URL(window.location.href);
	const currentLocale = url.pathname.split('/')[1] as LocaleType;
	if (currentLocale !== newLocale && AllLocales.includes(currentLocale as any)) {
		const parts = url.pathname.split('/');
		parts[1] = newLocale;
		url.pathname = parts.join('/');
		window.location.assign(url.href);
	}
}

export function localizePath(...paths: string[]): string {
	const parts: string[] = [getLocale()];
	for (const path of paths) {
		if (path) {
			const start = path.startsWith('/') ? 1 : 0;
			const end = path.length - (path.endsWith('/') ? -2 : -1);
			parts.push(path.slice(start, end));
		}
	}
	return `/${parts.join('/')}`;
}

const LangCodesReg = new RegExp(`^\/?(${AllLocales.join('|')})\/`);

export function languageCodeFromPath(path: string): string | undefined {
	return path.match(LangCodesReg)?.[1];
}
