import { msg } from '@lit/localize';
import { Locale } from './localization.js';

export const PublicPaths = {
  APP: 'app',
  SIGNIN: msg('iniciar-sesion', { desc: 'This is part of the URL.' }),
  SIGNUP: msg('registro', { desc: 'This is part of the URL.' }),
  FORGOT_PASSWORD: msg('recordar-contraseña', { desc: 'This is part of the URL.' }),
  RESET_PASSWORD: msg('reestablecer-contraseña', { desc: 'This is part of the URL.' }),
};

export const AppPaths = {
  TOURNEYS: msg('torneos', { id: 'PathTourneys', desc: 'This is part of the URL.' }),
  TOURNEY: msg('torneo', { id: 'PathTourneys', desc: 'This is part of the URL.' }),
};

type PublicPathsKeys = keyof typeof PublicPaths;
type AppPathsKeys = keyof typeof AppPaths;
type AllKeys = PublicPathsKeys | AppPathsKeys;

export function path(key: AllKeys): string {
  if (key in AppPaths) {
    return `/${Locale}/app/${AppPaths[key as AppPathsKeys]}`;
  }
  return `/${Locale}/${PublicPaths[key as PublicPathsKeys]}`;
}

const isDev = window.location.host.slice(0, 9) === 'localhost';

if (isDev) {
  Object.keys(PublicPaths).forEach(key => {
    if (key in AppPaths) {
      console.warn(`localize: Repeated pathname ${key}`);
    }
  });
}
