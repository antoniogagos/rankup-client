import { configureTransformLocalization } from '@lit/localize';

export const { getLocale } = configureTransformLocalization({ sourceLocale: 'es' });

export const AllLocales = ['en', 'es', 'es-ar', 'es-mx', 'es-co', 'pt-br', 'pt-pt'] as const;

export function updateLocale(newLocale: LocaleType) {
	const url = new URL(window.location.href);
	const currentLocale = url.pathname.split('/')[1] as LocaleType;
	if (currentLocale !== newLocale && AllLocales.includes(currentLocale)) {
		const parts = url.pathname.split('/');
		parts[1] = newLocale;
		url.pathname = parts.join('/');
		window.location.assign(url.href);
	}
}

enum LocaleType {
	en = 'en',
	es = 'es',
	'es-ar' = 'es-ar',
	'es-mx' = 'es-mx',
	'es-co' = 'es-co',
	'pt-br' = 'pt-br',
	'pt-pt' = 'pt-pt',
}
