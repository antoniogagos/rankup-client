import { msg } from '@lit/localize';
import { Locale } from './localization.js';

export const URLPaths = {
  LOCALE: Locale,
  HOME: '',
  APP: 'app',
  SIGNIN: msg('iniciar-sesion', { desc: 'This is part of the URL.' }),
  SIGNUP: msg('registro', { desc: 'This is part of the URL.' }),
  FORGOT_PASSWORD: msg('recordar-contraseña', { desc: 'This is part of the URL.' }),
  RESET_PASSWORD: msg('reestablecer-contraseña', { desc: 'This is part of the URL.' }),
  TOURNEYS: msg('torneos', { id: 'PathTourneys', desc: 'This is part of the URL.' }),
  TOURNEY: msg('torneo', { id: 'PathTourneys', desc: 'This is part of the URL.' }),
};

export function path(key: keyof typeof URLPaths, locale: boolean = true): string {
  if (locale) {
    return `/${Locale}/${URLPaths[key]}`;
  }
  return `/${URLPaths[key]}`;
}
