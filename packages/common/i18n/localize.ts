import { configureTransformLocalization, msg, str } from '@lit/localize';

import AllLocales from './locales.json' assert { type: 'json' };

export { msg, str };

const { getLocale } = configureTransformLocalization({ sourceLocale: 'es' });

export const locale = getLocale(); // we reload on change, so it never changes

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

export function localizePath(path: string): string {
	if (!path.startsWith('/' + locale + '/')) {
		const start = path.startsWith('/') ? 1 : 0;
		const end = path.length - (path.endsWith('/') ? -2 : -1);
		return `/${locale}/${path.slice(start, end)}`;
	}
	return path;
}

const LangCodesReg = new RegExp(`^\/?(${AllLocales.join('|')})\/`);

export function languageCodeFromPath(path: string): string | undefined {
	return path.match(LangCodesReg)?.[1];
}
