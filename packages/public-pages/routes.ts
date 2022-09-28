import type { Route } from '@rankup/common/router/types';

export const Routes: Route[] = [
	{
		name: 'root',
		path: '/',
		componentPath: './pages/welcome/pp-welcome-page.ts',
		componentName: 'pp-welcome-page',
		localize: false,
		publicPage: true,
		animation: 'slide',
	},
	{
		name: '404',
		path: '/404',
		componentPath: './pages/404/pp-404-page.ts',
		componentName: 'pp-404-page',
		localize: false,
		publicPage: true,
		animation: 'slide',
	},
	{
		path: '*',
		localize: false,
		publicPage: true,
		redirect: '404',
	},
];
