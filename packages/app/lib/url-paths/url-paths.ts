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

export function path(key: AllKeys, rest?: string): string {
	const locale = getLocale();
	if (key in AppPaths) {
		return `/${locale}/app/${AppPaths[key as AppPathsKeys]}${rest ? `/${rest}` : ''}`;
	}
	return `/${locale}/${PublicPaths[key as PublicPathsKeys]}${rest ? `/${rest}` : ''}`;
}

export function relativePath(key: AllKeys, rest?: string): string {
	if (key in AppPaths) {
		return `/${AppPaths[key as AppPathsKeys]}${rest ? `/${rest}` : ''}`;
	}
	return `/${PublicPaths[key as PublicPathsKeys]}${rest ? `/${rest}` : ''}`;
}

if (env.isDevEnv) {
	for (const key of Object.keys(PublicPaths)) {
		if (key in AppPaths) {
			console.warn(`localize: Repeated pathname ${key}`);
		}
	}
}
