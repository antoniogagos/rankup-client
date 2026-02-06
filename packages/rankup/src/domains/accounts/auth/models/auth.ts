import type { UserSummary } from '../../shared/models/user.js';

export type RegistrationStatus = 'pendingConfirmation' | 'complete';

export type Registration = {
	registrationId: string;
	email: string;
	status: RegistrationStatus;
	createdAt: string;
	expiresAt?: string;
};

export type RegisterUserRequest = {
	email: string;
	password: string;
	username?: string;
	locale?: string;
};

export type ConfirmRegistrationRequest = {
	email: string;
	code: string;
};

export type ResendConfirmationRequest = {
	email: string;
};

export type CreateSessionRequest = {
	email: string;
	password: string;
};

export type RefreshSessionRequest = {
	refreshToken: string;
};

export type RequestPasswordResetRequest = {
	email: string;
};

export type ConfirmPasswordResetRequest = {
	email: string;
	code: string;
	newPassword: string;
};

export type AuthSession = {
	accessToken: string;
	expiresAt: string;
	tokenType: 'Bearer';
	user: UserSummary;
	refreshToken?: string;
	idToken?: string;
};

export type OAuthProvider = string;
export type OAuthGrantType = 'authorization_code' | 'id_token';

export type OAuthAuthorizationCodeGrant = {
	grantType: 'authorization_code';
	provider: OAuthProvider;
	code: string;
	redirectUri: string;
	codeVerifier?: string;
};

export type OAuthIdTokenGrant = {
	grantType: 'id_token';
	provider: OAuthProvider;
	idToken: string;
	nonce?: string;
};

export type OAuthTokenRequest = OAuthAuthorizationCodeGrant | OAuthIdTokenGrant;

export type OAuthAuthorizeParams = {
	provider: string;
	redirectUri: string;
	state: string;
	codeChallenge?: string;
	codeChallengeMethod?: 'S256';
};

export type OAuthAuthorizeResult = {
	location?: string;
};
