import envExample from '../env.json.example' assert { type: 'json' };

type EnvConfig = typeof envExample & {
  Auth?: typeof envExample.auth;
  Mock?: boolean;
};

const globalEnv = (globalThis as { RK_ENV?: Partial<EnvConfig> }).RK_ENV;
const authFromExample = (envExample as { Auth?: typeof envExample.auth }).Auth ?? envExample.auth;
const authFromGlobal = (globalEnv as { Auth?: typeof envExample.auth })?.Auth ?? globalEnv?.auth;

export const env: EnvConfig = {
  ...envExample,
  ...globalEnv,
  Auth: {
    ...authFromExample,
    ...authFromGlobal,
  },
};

export const authConfig = (env as { Auth?: typeof envExample.auth }).Auth ?? envExample.auth;
export const apiURL = env.ApiURL ?? '';
export const isMockMode =
  env.Mock === true || !apiURL || !authConfig?.ClientId || !authConfig?.UserPoolId;
