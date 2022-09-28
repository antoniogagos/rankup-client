import { msg } from '@rankup/common/i18n/localize';
import type { Route } from '@rankup/common/router/types';

export const Routes: Route[] = [
	{
		name: 'my-contests',
		path: msg('mis-torneos', { desc: 'url' }),
		componentPath: './pages/contest-list/myc-contest-list-page.ts',
		componentName: 'myc-contest-list-page',
		publicPage: false,
		animation: 'slide',
		displayFooter: true,
		displayHeader: true,
	},
	{
		name: 'create-contest',
		path: msg('crear-torneo', { desc: 'url' }),
		componentPath: './pages/create-contest/myc-create-contest-page.ts',
		componentName: 'myc-create-contest-page',
		publicPage: false,
		animation: 'slide',
	},
	{
		name: 'join-contest',
		path: msg('unirse-torneo', { desc: 'url' }),
		componentPath: './pages/join-contest/myc-join-contest-page.ts',
		componentName: 'myc-join-contest-page',
		publicPage: true,
		animation: 'slide',
	},
];
