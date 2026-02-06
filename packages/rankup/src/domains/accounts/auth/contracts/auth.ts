import type { AuthSession, ConfirmPasswordResetRequest, ConfirmRegistrationRequest, CreateSessionRequest, OAuthAuthorizeParams, OAuthAuthorizeResult, OAuthTokenRequest, RefreshSessionRequest, RegisterUserRequest, Registration, RequestPasswordResetRequest, ResendConfirmationRequest } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IAuthService {
	registerUser(request: RegisterUserRequest): Promise<Registration>;
	confirmRegistration(request: ConfirmRegistrationRequest): Promise<AuthSession>;
	resendRegistrationConfirmation(request: ResendConfirmationRequest): Promise<void>;
	createSession(request: CreateSessionRequest): Promise<AuthSession>;
	refreshSession(request: RefreshSessionRequest): Promise<AuthSession>;
	logout(): Promise<void>;
	requestPasswordReset(request: RequestPasswordResetRequest): Promise<void>;
	confirmPasswordReset(request: ConfirmPasswordResetRequest): Promise<void>;
	authorize(params: OAuthAuthorizeParams): Promise<OAuthAuthorizeResult>;
	token(request: OAuthTokenRequest): Promise<AuthSession>;
}

export const IAuthService = createDecorator<IAuthService>('authService');
