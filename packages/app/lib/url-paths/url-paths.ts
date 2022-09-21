import { msg } from '@lit/localize';
import { getLocale } from 'common/i18n/locales.js';

import env from '../env/env.js';

export const PublicPaths = {
	APP: 'app',
	CONFIRM_REGISTRATION: msg('confirmar-registro', { desc: 'Part of the URL' }),
	FORGOT_PASSWORD: msg('recordar-contraseña', { desc: 'Part of the URL' }),
	RESET_PASSWORD: msg('restablecer-contraseña', { desc: 'Part of the URL' }),
	SIGN_IN: msg('iniciar-sesion', { desc: 'Part of the URL' }),
	SIGN_UP: msg('registro', { desc: 'Part of the URL' }),
};

export const AppPaths = {
	CHAT: msg('chat', { desc: 'Part of the URL' }),
	CREATE_TOURNEY: msg('crear-torneo', { desc: 'Part of the URL' }),
	JOIN_TOURNEY: msg('unirse-torneo', { desc: 'Part of the URL' }),
	MATCHDAY: msg('jornada', { desc: 'Part of the URL' }),
	RANKING: msg('clasificacion', { desc: 'Part of the URL' }),
	RULES_TOURNEY: msg('sistema-de-puntuacion', { desc: 'Part of the URL' }),
	SETTINGS_TOURNEY: msg('ajustes-torneo', { desc: 'Part of the URL' }),
	SHARE_TOURNEY: msg('compartir-torneo', { desc: 'Part of the URL' }),
	TOURNEY: msg('torneo', { desc: 'Part of the URL' }),
	TOURNEYS: msg('torneos', { desc: 'Part of the URL' }),
};

type PublicPathsKeys = keyof typeof PublicPaths;
type AppPathsKeys = keyof typeof AppPaths;
type AllKeys = PublicPathsKeys | AppPathsKeys;

export function path(key: AllKeys | string, rest = ''): string {
	const locale = getLocale();
	if (key in AppPaths) {
		return `/${pathJoin(locale, 'app', AppPaths[key as AppPathsKeys], rest)}`;
	}
	if (key in PublicPaths) {
		return `/${pathJoin(locale, PublicPaths[key as PublicPathsKeys], rest)}`;
	}
	return `/${pathJoin(locale, key, rest)}`;
}

export function relativePath(key: AllKeys, rest = ''): string {
	if (key in AppPaths) {
		return `/${pathJoin(AppPaths[key as AppPathsKeys], rest)}`;
	}
	if (key in PublicPaths) {
		return `/${pathJoin(PublicPaths[key as PublicPathsKeys], rest)}`;
	}
	return `/${pathJoin(key, rest)}`;
}

function pathJoin(...paths: string[]): string {
	const parts: string[] = [];
	for (const str of paths) {
		if (str) {
			const start = str.startsWith('/') ? 1 : 0;
			const end = str.length - (str.endsWith('/') ? -2 : -1);
			parts.push(str.slice(start, end));
		}
	}
	return parts.join('/');
}

if (env.isDevEnv) {
	for (const key of Object.keys(PublicPaths)) {
		if (key in AppPaths) {
			console.warn(`localize: Repeated pathname ${key}`);
		}
	}
}
