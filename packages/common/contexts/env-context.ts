import { createContext } from '@lit-labs/context';

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

export const envContext = createContext<Env>('env');
