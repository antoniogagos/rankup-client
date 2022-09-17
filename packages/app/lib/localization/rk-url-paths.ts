import { msg } from '@lit/localize';

import { Locale } from './localization.js';

export const PublicPaths = {
  APP: 'app',
  SIGNIN: msg('iniciar-sesion', { desc: 'This is part of the URL.' }),
  SIGNUP: msg('registro', { desc: 'This is part of the URL.' }),
  FORGOT_PASSWORD: msg('recordar-contraseña', { desc: 'This is part of the URL.' }),
  RESET_PASSWORD: msg('restablecer-contraseña', { desc: 'This is part of the URL.' }),
  CONFIRM_REGISTRATION: msg('confirmar-registro', { desc: 'This is part of the URL.' }),
};

export const AppPaths = {
  TOURNEYS: msg('torneos', { id: 'PathTourneys', desc: 'This is part of the URL.' }),
  TOURNEY: msg('torneo', { id: 'PathTourneys', desc: 'This is part of the URL.' }),
  CHAT: msg('chat', { id: 'PathTourneys', desc: 'This is part of the URL.' }),
  MATCHDAY: msg('jornada', { id: 'PathTourneys', desc: 'This is part of the URL.' }),
  RANKING: msg('clasificacion', { id: 'PathTourneys', desc: 'This is part of the URL.' }),
  SHARE_TOURNEY: msg('compartir-torneo', { id: 'PathTourneys', desc: 'This is part of the URL.' }),
  RULES_TOURNEY: msg('sistema-de-puntuacion', {
    id: 'PathTourneys',
    desc: 'This is part of the URL.',
  }),
  JOIN_TOURNEY: msg('unirse-torneo'),
  CREATE_TOURNEY: msg('crear-torneo'),
  SETTINGS_TOURNEY: msg('ajustes-torneo'),
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
