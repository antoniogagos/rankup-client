type AuthConfig = {
	UserPoolId?: string;
	ClientId?: string;
	OAuthServerURL?: string;
	RedirectURI?: string;
};

type EnvConfig = {
	IS_DEV_ENV?: boolean;
	ApiURL?: string;
	ApiVersion?: string;
	Region?: string;
	Mock?: boolean;
	Auth?: AuthConfig;
};

const defaultAuth: AuthConfig = {
	UserPoolId: '',
	ClientId: '',
	OAuthServerURL: '',
	RedirectURI: '',
};

const defaultEnv: EnvConfig = {
	IS_DEV_ENV: false,
	ApiURL: '',
	ApiVersion: '',
	Region: '',
	Mock: false,
	Auth: defaultAuth,
};

function getEnvGlobal(): { __APP_ENV__?: Partial<EnvConfig> } {
	if (typeof globalThis !== 'undefined') {
		return globalThis as { __APP_ENV__?: Partial<EnvConfig> };
	}
	if (typeof self !== 'undefined') {
		return self as { __APP_ENV__?: Partial<EnvConfig> };
	}
	if (typeof window !== 'undefined') {
		return window as { __APP_ENV__?: Partial<EnvConfig> };
	}
	return {};
}

const globalEnv = getEnvGlobal().__APP_ENV__ ?? {};
const authFromGlobal = (globalEnv as { Auth?: AuthConfig; auth?: AuthConfig }).Auth ?? (globalEnv as { auth?: AuthConfig }).auth ?? {};

export const env: EnvConfig = {
	...defaultEnv,
	...globalEnv,
	Auth: {
		...defaultAuth,
		...authFromGlobal,
	},
};

export const authConfig = env.Auth ?? defaultAuth;
export const apiURL = env.ApiURL ?? '';

const mockParam = typeof window !== 'undefined' ? new URL(window.location.href).searchParams.get('mock') : null;

export const isMockMode = env.Mock === true || mockParam === '1' || mockParam === 'true';
