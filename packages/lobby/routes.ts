import { msg } from '@rankup/common/i18n/localize.js';
import type { Route } from '@rankup/common/router/types';

export const Routes: Route[] = [
	{
		name: 'lobby',
		path: msg('lobby', { desc: 'url' }),
		componentPath: './pages/index/lobby-index-page.ts',
		componentName: 'lobby-index-page',
		animation: 'slide',
		publicPage: false,
		displayFooter: true,
		displayHeader: true,
	},
];
