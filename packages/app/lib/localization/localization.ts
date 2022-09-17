import { configureTransformLocalization } from '@lit/localize';

export const { getLocale } = configureTransformLocalization({ sourceLocale: 'es' });

export const Locale = getLocale();

enum LocaleType {
  es = 'es',
  en = 'en',
}

export const AllLocales = ['es', 'en'] as const;

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
