export interface Credentials {
  Expiration: string;
  AccessKeyId: string;
  SecretKey: string;
  SessionToken: string;
}

export interface LoggedUser {
  userId: string;
  email: string;
  username: string;
  createdAt: string;
  name?: string;
  picture?: string;
  updatedAt?: string;
  usernameLowerCase?: string;
  lastConnectionAt?: string;
}

export interface Session {
  provider: string;
  credentials: Credentials;
  user: LoggedUser;
  // identityId: string;
  iotEndpoint?: string;
  region?: string;
}

export interface OauthLoggedUser {
  tokenId: string;
  pictureUrl?: string;
  email?: string;
  name?: string;
}

export interface ISessionProvider {
  isOAuthProvider: boolean;
  isLogged(): Promise<boolean>;
  logIn({ username, password }: { username?: string; password?: string }): Promise<OauthLoggedUser>;
  logIn(): Promise<OauthLoggedUser>;
  logOut(): void;
  refresh(): Promise<OauthLoggedUser>;
}

export interface ApiServiceConfig {
  credentials?: Credentials;
  region?: string;
}

export interface SignInResponse {
  credentials: Credentials;
  user: LoggedUser;
  isNewUser?: boolean;
  iotEndpoint?: string;
  region?: string;
}

export interface IApiService {
  config: ApiServiceConfig;
  updateConfig(config: ApiServiceConfig): void;

  Auth: {
    SignIn: (params: {
      token?: string;
      provider?: string;
      username?: string;
      password?: string;
    }) => Promise<SignInResponse>;
  };
}
