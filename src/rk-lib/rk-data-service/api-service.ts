import type {
  ApiServiceConfig,
  IApiService,
  LoggedUser,
  SignInResponse,
} from '../../lib/data-service/types.js';

export const RkApiService: IApiService = {
  config: {},

  updateConfig(config: ApiServiceConfig) {
    this.config = {
      ...this.config,
      ...config,
    };
  },

  Auth: {
    async SignIn({
      token,
      provider,
      username,
      password,
    }: {
      token?: string;
      provider?: string;
      username?: string;
      password?: string;
    }): Promise<SignInResponse> {
      return {
        credentials: {
          AccessKeyId: 'access-key-id',
          Expiration: 'expiration',
          SecretKey: 'eecret-key',
          SessionToken: 'session-token',
        },
        user: {
          userId: 'user-id',
          email: 'phoga@rankup.app',
          createdAt: new Date().toISOString(),
          username: 'phoga',
          picture: null,
        },
        isNewUser: false,
      };
    },
  },
};
