import { mapAuthSession, mapRegistration } from './accounts-mappers.js';
import type * as Api from '@rankup/api';
import type { IAuthGateway } from '@rankup/rankup/domains/accounts/auth/contracts/authGateway.js';
import type * as Domain from '@rankup/rankup/domains/accounts/auth/contracts/types.js';

export const operationOwners = {
	confirmPasswordReset: 'api.accounts.auth.confirmPasswordReset',
	confirmRegistration: 'api.accounts.auth.confirmRegistration',
	createOauthLink: 'api.accounts.auth.createOauthLink',
	createSession: 'api.accounts.auth.createSession',
	deleteOauthLink: 'api.accounts.auth.deleteOauthLink',
	getAppBootstrap: 'api.meta.config.getAppBootstrap',
	getAppConfig: 'api.meta.config.getAppConfig',
	getHealthz: 'api.meta.health.getHealthz',
	getReadyz: 'api.meta.health.getReadyz',
	listOauthLinks: 'api.accounts.auth.listOauthLinks',
	logout: 'api.accounts.auth.logout',
	oauthAuthorize: 'api.accounts.auth.oauthAuthorize',
	oauthTokenExchange: 'api.accounts.auth.oauthTokenExchange',
	refreshSession: 'api.accounts.auth.refreshSession',
	registerUser: 'api.accounts.auth.registerUser',
	requestPasswordReset: 'api.accounts.auth.requestPasswordReset',
	resendRegistrationConfirmation: 'api.accounts.auth.resendRegistrationConfirmation',
} as const;

const mapRegisterUserRequest = (request: Domain.RegisterUserRequest): Api.RegisterUserRequest => ({
	email: request.email,
	password: request.password,
	username: request.username,
	locale: request.locale,
});

const mapConfirmRegistrationRequest = (request: Domain.ConfirmRegistrationRequest): Api.ConfirmRegistrationRequest => ({
	email: request.email,
	code: request.code,
});

const mapResendConfirmationRequest = (request: Domain.ResendConfirmationRequest): Api.ResendConfirmationRequest => ({
	email: request.email,
});

const mapCreateSessionRequest = (request: Domain.CreateSessionRequest): Api.CreateSessionRequest => ({
	email: request.email,
	password: request.password,
});

const mapRefreshSessionRequest = (request: Domain.RefreshSessionRequest): Api.RefreshSessionRequest => ({
	refreshToken: request.refreshToken,
});

const mapRequestPasswordReset = (request: Domain.RequestPasswordResetRequest): Api.RequestPasswordResetRequest => ({
	email: request.email,
});

const mapConfirmPasswordReset = (request: Domain.ConfirmPasswordResetRequest): Api.ConfirmPasswordResetRequest => ({
	email: request.email,
	code: request.code,
	newPassword: request.newPassword,
});

const mapOAuthAuthorizeParams = (params: Domain.OAuthAuthorizeParams): Api.AuthorizeParams => ({
	provider: params.provider,
	redirectUri: params.redirectUri,
	state: params.state,
	codeChallenge: params.codeChallenge,
	codeChallengeMethod: params.codeChallengeMethod,
});

const mapOAuthTokenRequest = (request: Domain.OAuthTokenRequest): Api.TokenRequestBody => {
	if (request.grantType === 'authorization_code') {
		return {
			grantType: request.grantType,
			provider: request.provider,
			code: request.code,
			redirectUri: request.redirectUri,
			codeVerifier: request.codeVerifier,
		};
	}
	return {
		grantType: request.grantType,
		provider: request.provider,
		idToken: request.idToken,
		nonce: request.nonce,
	};
};

export class AuthGateway implements IAuthGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async registerUser(request: Domain.RegisterUserRequest): Promise<Domain.Registration> {
		const response = await this.apiClient.registerUser(mapRegisterUserRequest(request));
		return mapRegistration(response);
	}

	public async confirmRegistration(request: Domain.ConfirmRegistrationRequest): Promise<Domain.AuthSession> {
		const response = await this.apiClient.confirmRegistration(mapConfirmRegistrationRequest(request));
		return mapAuthSession(response);
	}

	public async resendRegistrationConfirmation(request: Domain.ResendConfirmationRequest): Promise<void> {
		await this.apiClient.resendRegistrationConfirmation(mapResendConfirmationRequest(request));
	}

	public async createSession(request: Domain.CreateSessionRequest): Promise<Domain.AuthSession> {
		const response = await this.apiClient.createSession(mapCreateSessionRequest(request));
		return mapAuthSession(response);
	}

	public async refreshSession(request: Domain.RefreshSessionRequest): Promise<Domain.AuthSession> {
		const response = await this.apiClient.refreshSession(mapRefreshSessionRequest(request));
		return mapAuthSession(response);
	}

	public async logout(): Promise<void> {
		await this.apiClient.logout();
	}

	public async requestPasswordReset(request: Domain.RequestPasswordResetRequest): Promise<void> {
		await this.apiClient.requestPasswordReset(mapRequestPasswordReset(request));
	}

	public async confirmPasswordReset(request: Domain.ConfirmPasswordResetRequest): Promise<void> {
		await this.apiClient.confirmPasswordReset(mapConfirmPasswordReset(request));
	}

	public async authorize(params: Domain.OAuthAuthorizeParams): Promise<Domain.OAuthAuthorizeResult> {
		const response = await this.apiClient.authorize(mapOAuthAuthorizeParams(params));
		return { location: response.headers.Location };
	}

	public async token(request: Domain.OAuthTokenRequest): Promise<Domain.AuthSession> {
		const response = await this.apiClient.token(mapOAuthTokenRequest(request));
		return mapAuthSession(response);
	}
}
