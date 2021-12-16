import { configureTransformLocalization } from '@lit/localize';

export const { getLocale } = configureTransformLocalization({ sourceLocale: 'es' });

export const Locale = getLocale();

export const AllLocales = /** @type {const} */ (['es', 'en']);

/** @typedef {typeof AllLocales[number]} AllLocalesEnum */

/**
 * @param {AllLocalesEnum} newLocale
 */
export function updateLocale(newLocale) {
  const url = new URL(window.location.href);
  const currentLocale = /** @type {AllLocalesEnum} */ (url.pathname.split('/')[1]);
  if (currentLocale !== newLocale && AllLocales.includes(currentLocale)) {
    const parts = url.pathname.split('/');
    parts[1] = newLocale;
    url.pathname = parts.join('/');
    window.location.assign(url.href);
  }
}
