import { Locale } from './localization.js';
import { msg } from '@lit/localize';

export const PublicPaths = {
	APP: 'app',
	SIGNIN: msg('iniciar-sesion', { desc: 'This is part of the URL.' , id: 'apps.rankup.spa.lib.localization.rk.url.paths.msg.l6c10'}),
	SIGNUP: msg('registro', { desc: 'This is part of the URL.' , id: 'apps.rankup.spa.lib.localization.rk.url.paths.msg.l7c10'}),
	FORGOT_PASSWORD: msg('recordar-contraseña', { desc: 'This is part of the URL.' , id: 'apps.rankup.spa.lib.localization.rk.url.paths.msg.l8c19'}),
	RESET_PASSWORD: msg('restablecer-contraseña', { desc: 'This is part of the URL.' , id: 'apps.rankup.spa.lib.localization.rk.url.paths.msg.l9c18'}),
	CONFIRM_REGISTRATION: msg('confirmar-registro', { desc: 'This is part of the URL.' , id: 'apps.rankup.spa.lib.localization.rk.url.paths.msg.l10c24'}),
};

export const AppPaths = {
	TOURNEYS: msg('torneos', { id: 'paths.tourneys', desc: 'This is part of the URL.' }),
	TOURNEY: msg('torneo', { id: 'paths.tourneys', desc: 'This is part of the URL.' }),
	CHAT: msg('chat', { id: 'paths.tourneys', desc: 'This is part of the URL.' }),
	MATCHDAY: msg('jornada', { id: 'paths.tourneys', desc: 'This is part of the URL.' }),
	RANKING: msg('clasificacion', { id: 'paths.tourneys', desc: 'This is part of the URL.' }),
	SHARE_TOURNEY: msg('compartir-torneo', {
		id: 'paths.tourneys',
		desc: 'This is part of the URL.',
	}),
	RULES_TOURNEY: msg('sistema-de-puntuacion', {
		id: 'paths.tourneys',
		desc: 'This is part of the URL.',
	}),
	JOIN_TOURNEY: msg('unirse-torneo', { id: 'apps.rankup.spa.lib.localization.rk.url.paths.msg.l27c16' }),
	CREATE_TOURNEY: msg('crear-torneo', { id: 'apps.rankup.spa.lib.localization.rk.url.paths.msg.l28c18' }),
	SETTINGS_TOURNEY: msg('ajustes-torneo', { id: 'apps.rankup.spa.lib.localization.rk.url.paths.msg.l29c20' }),
};

type PublicPathsKeys = keyof typeof PublicPaths;
type AppPathsKeys = keyof typeof AppPaths;
type AllKeys = PublicPathsKeys | AppPathsKeys;

export function path(key: AllKeys, rest?: string): string {
	if (key in AppPaths) {
		return `/${Locale}/app/${AppPaths[key as AppPathsKeys]}${rest ? `/${rest}` : ''}`;
	}
	return `/${Locale}/${PublicPaths[key as PublicPathsKeys]}${rest ? `/${rest}` : ''}`;
}

export function relativePath(key: AllKeys, rest?: string): string {
	if (key in AppPaths) {
		return `/${AppPaths[key as AppPathsKeys]}${rest ? `/${rest}` : ''}`;
	}
	return `/${PublicPaths[key as PublicPathsKeys]}${rest ? `/${rest}` : ''}`;
}

const isDev = window.location.host.slice(0, 9) === 'localhost';

if (isDev) {
	for (const key of Object.keys(PublicPaths)) {
		if (key in AppPaths) {
			console.warn(`localize: Repeated pathname ${key}`);
		}
	}
}
