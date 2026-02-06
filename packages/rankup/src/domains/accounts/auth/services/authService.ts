import type { IAuthService } from '../contracts/auth.js';
import type { IAuthGateway as AuthGateway } from '../contracts/authGateway.js';
import { IAuthGateway } from '../contracts/authGateway.js';
import type { AuthSession, ConfirmPasswordResetRequest, ConfirmRegistrationRequest, CreateSessionRequest, OAuthAuthorizeParams, OAuthAuthorizeResult, OAuthTokenRequest, RefreshSessionRequest, RegisterUserRequest, Registration, RequestPasswordResetRequest, ResendConfirmationRequest } from '../contracts/types.js';

export class AuthService implements IAuthService {
	public constructor(@IAuthGateway private readonly gateway: AuthGateway) {}

	public async registerUser(request: RegisterUserRequest): Promise<Registration> {
		return this.gateway.registerUser(request);
	}

	public async confirmRegistration(request: ConfirmRegistrationRequest): Promise<AuthSession> {
		return this.gateway.confirmRegistration(request);
	}

	public async resendRegistrationConfirmation(request: ResendConfirmationRequest): Promise<void> {
		return this.gateway.resendRegistrationConfirmation(request);
	}

	public async createSession(request: CreateSessionRequest): Promise<AuthSession> {
		return this.gateway.createSession(request);
	}

	public async refreshSession(request: RefreshSessionRequest): Promise<AuthSession> {
		return this.gateway.refreshSession(request);
	}

	public async logout(): Promise<void> {
		return this.gateway.logout();
	}

	public async requestPasswordReset(request: RequestPasswordResetRequest): Promise<void> {
		return this.gateway.requestPasswordReset(request);
	}

	public async confirmPasswordReset(request: ConfirmPasswordResetRequest): Promise<void> {
		return this.gateway.confirmPasswordReset(request);
	}

	public async authorize(params: OAuthAuthorizeParams): Promise<OAuthAuthorizeResult> {
		return this.gateway.authorize(params);
	}

	public async token(request: OAuthTokenRequest): Promise<AuthSession> {
		return this.gateway.token(request);
	}
}
