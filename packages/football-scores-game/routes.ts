import { msg } from '@rankup/common/i18n/localize';
import type { Route } from '@rankup/common/router/types';

export const Routes: Route[] = [
	{
		name: 'resultados',
		path: msg('resultados', { desc: 'url' }) + '/*',
		componentPath: './fsg-index.ts',
		componentName: 'fsg-index',
		publicPage: false,
		animation: 'slide',
	},
];
