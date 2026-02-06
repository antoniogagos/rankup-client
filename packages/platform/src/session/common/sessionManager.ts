import { createDecorator } from '../../instantiation/common/decorators.js';
import type { Providers, Session } from './types.js';

export interface ISessionManager {
	readonly isLogged: boolean;
	session: Session | null;
	signUpWithPassword(params: { email: string; password: string; username: string }): Promise<{
		email: string;
		userId: string;
		userConfirmed: boolean;
	}>;
	signUpWithOAuth(provider: Providers): Promise<void>;
	signInWithPassword(params: { email: string; password: string }): Promise<void>;
	signInWithOAuth(provider: Providers): Promise<void>;
	signOut(): void;
	forgotPassword(email: string): Promise<void>;
	confirmForgottenPassword(email: string, verificationCode: string, newPassword: string): Promise<void>;
	changePassword(email: string, oldPassword: string, newPassword: string): Promise<unknown>;
	confirmRegistration(email: string, confirmCode: string): Promise<void>;
	resendConfirmationCode(email: string): Promise<unknown>;
}

export const ISessionManager = createDecorator<ISessionManager>('sessionManager');
