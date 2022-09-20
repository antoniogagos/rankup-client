import type { Route as RkRoute } from 'common/types/rankup-json';

import _env from '../../env.json' assert { type: 'json' };

export interface Env {
	isDevEnv: boolean;
	ApiURL: string;
	ApiVersion: string;
	Region: string;
	Auth: {
		UserPoolId: string;
		ClientId: string;
		OAuthServerURL: string;
		RedirectURI: string;
	};
	Routes: Route[];
}

export interface Route extends RkRoute {
	path: string;
	componentFileName: string;
}

export default _env as Env;
