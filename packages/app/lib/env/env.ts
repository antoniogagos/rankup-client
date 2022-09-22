import type { Route } from '@rankup/common/types/rankup-json';

import _env from '../../env.json';

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
	Routes: Required<Route>[];
}

export default _env as Env;
