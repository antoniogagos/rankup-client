import _env from '../../env.js';

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
}

export default _env as Env;
