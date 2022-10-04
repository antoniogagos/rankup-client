import { msg } from '@rankup/common/i18n/localize.js';
import type { Route } from '@rankup/common/router/types';

export const Routes: Route[] = [
	{
		name: 'oauth-redirect',
		path: 'oauth',
		localize: false,
		// redirect: 'my-contests',
		componentName: 'auth-sign-in-page',
		componentPath: './pages/sign-in/auth-sign-in-page.ts',
		publicPage: true,
		animation: 'slide',
	},
	{
		name: 'sign-in',
		path: msg('iniciar-sesion', { desc: 'url' }),
		componentName: 'auth-sign-in-page',
		componentPath: './pages/sign-in/auth-sign-in-page.ts',
		publicPage: true,
		animation: 'slide',
	},
	{
		name: 'sign-up',
		path: msg('registro', { desc: 'url' }),
		componentName: 'auth-sign-up-page',
		componentPath: './pages/sign-up/auth-sign-up-page.ts',
		publicPage: true,
		animation: 'slide',
	},
	{
		name: 'reset-password',
		path: msg('restablecer-contraseña', { desc: 'url' }),
		componentName: 'auth-reset-password-page',
		componentPath: './pages/reset-password/auth-reset-password-page.ts',
		publicPage: true,
		animation: 'slide',
	},
	{
		name: 'forgot-password',
		path: msg('recuperar-contraseña', { desc: 'url' }),
		componentName: 'auth-forgot-password-page',
		componentPath: './pages/forgot-password/auth-forgot-password-page.ts',
		publicPage: true,
		animation: 'slide',
	},
	{
		name: 'confirm-registration',
		path: msg('confirmar-registro', { desc: 'url' }),
		componentName: 'auth-confirm-registration-page',
		componentPath: './pages/confirm-registration/auth-confirm-registration-page.ts',
		publicPage: true,
		animation: 'slide',
	},
];
