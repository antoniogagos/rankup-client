import type { CognitoUserSession, ISignUpResult } from 'amazon-cognito-identity-js';
import type { ReactiveController, ReactiveElement } from 'lit';

// } from 'amazon-cognito-identity-js'; // can't be used because is only for node, we use the minified version
import env from '../../lib/env/env.js';
import {
	AuthenticationDetails,
	CognitoIdToken,
	CognitoRefreshToken,
	CognitoUser,
	CognitoUserAttribute,
	CognitoUserPool,
} from './amazon-cognito-identity-js.js';

export type Providers = 'Google' | 'Cognito';

export interface Session {
	idToken: string;
	accessToken: string;
	refreshToken: string;
	provider: Providers;
	email: string;
	userId: string;
	expiresAt: number;
	userConfirmationNecessary?: boolean;
}

export type EventsMap = {
	'session-updated': CustomEvent<{
		session: Session | null;
		old: Session | null;
	}>;
	foo: CustomEvent<{ bar: boolean }>;
};

const { Auth } = env;
const { ClientId, OAuthServerURL, RedirectURI, UserPoolId } = Auth;

let _session: Session | null = null;
let _scheduledSessionRefresh: NodeJS.Timeout | null = null;

export class SessionManager implements ReactiveController {
	host: ReactiveElement;

	constructor(host: ReactiveElement) {
		this.host = host;
		this.host.addController(this);
	}

	hostConnected() {
		_session = this._updateSessionFromLocalStorage();
		this._finishExternalProviderLoginIfNeeded();
		this._restoreAndRefreshSession();
	}

	hostDisconnected() {
		//
	}

	private _updateSessionFromLocalStorage(): Session | null {
		try {
			const ns = 'CognitoIdentityServiceProvider';
			const reg = new RegExp(ns + '\\.\\w+\\.LastAuthUser');
			const key = Object.keys(window.localStorage).find(k => k.match(reg));
			if (key) {
				const { localStorage } = window;
				const userId = localStorage.getItem(key);
				const clientId = key.split('.')[1];
				const accessToken = localStorage.getItem(`${ns}.${clientId}.${userId}.accessToken`);
				const idToken = localStorage.getItem(`${ns}.${clientId}.${userId}.idToken`);
				const refreshToken = localStorage.getItem(`${ns}.${clientId}.${userId}.refreshToken`);
				const email = localStorage.getItem(`${ns}.${clientId}.${userId}.email`);
				const provider = localStorage.getItem(`${ns}.${clientId}.${userId}.provider`);
				const expiresAt = Number(localStorage.getItem(`${ns}.${clientId}.${userId}.expiresAt`));
				if (!this._isExpired(expiresAt)) {
					return {
						email,
						userId,
						accessToken,
						idToken,
						refreshToken,
						expiresAt,
						provider,
					} as Session;
				}
			}
		} catch {
			return null;
		}
		return null;
	}

	get isLogged(): boolean {
		return !!this.session;
	}

	set session(value: Session | null) {
		const old = _session;
		_session = value;
		this._scheduleRefreshSession(value);
		this.dispatch('session-updated', { session: value, old }, { composed: true, bubbles: true });
	}

	get session() {
		return _session;
	}

	async signUpWithPassword(params: { email: string; password: string; username: string }): Promise<{
		email: string;
		userId: string;
		userConfirmed: boolean;
	}> {
		return this._signupInWithCognitoUserPass(params.email, params.password, params.username);
	}

	async signUpWithOAuth(provider: Providers): Promise<void> {
		this._redirectToOauthProviderLogin(provider);
	}

	async signInWithPassword(params: { email: string; password: string }): Promise<void> {
		this.session = await this._signInInWithCognitoUserPass(params.email, params.password);
	}

	async signInWithOAuth(provider: Providers): Promise<void> {
		this._redirectToOauthProviderLogin(provider);
	}

	signOut() {
		const user = new CognitoUserPool({ UserPoolId, ClientId }).getCurrentUser();
		if (user) {
			user.signOut();
		} else {
			for (const key of Object.keys(localStorage)) {
				if (/^CognitoIdentityServiceProvider\./.test(key)) {
					localStorage.removeItem(key);
				}
			}
			localStorage.clear();
			// TODO just delete session and local storage
		}
		this.session = null;
	}

	async forgotPassword(email: string): Promise<void> {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: new CognitoUserPool({ UserPoolId, ClientId }),
		});
		return new Promise((resolve, reject) => {
			cognitoUser.forgotPassword({
				onSuccess: () => resolve(),
				onFailure: (err: any) => {
					console.error(err.message || JSON.stringify(err));
					reject(err);
				},
			});
		});
	}

	async confirmForgottenPassword(email: string, verificationCode: string, newPassword: string) {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: new CognitoUserPool({ UserPoolId, ClientId }),
		});
		return new Promise<void>((resolve, reject) => {
			cognitoUser.confirmPassword(verificationCode, newPassword, {
				onSuccess: () => resolve(),
				onFailure: (err: any) => reject(err),
			});
		});
	}

	async changePassword(email: string, oldPassword: string, newPassword: string) {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: new CognitoUserPool({ UserPoolId, ClientId }),
		});
		return new Promise((resolve, reject) => {
			cognitoUser.changePassword(oldPassword, newPassword, (err: Error, result: any) => {
				if (err) {
					console.error(err.message || JSON.stringify(err));
					reject(err);
				} else {
					console.log('changePassword:success', { result });
					resolve(result);
				}
			});
		});
	}

	async confirmRegistration(email: string, confirmCode: string): Promise<void> {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: new CognitoUserPool({ UserPoolId, ClientId }),
		});
		return new Promise((resolve, reject) => {
			cognitoUser.confirmRegistration(confirmCode, true, (err: Error) => {
				if (err) {
					console.error(err.message || JSON.stringify(err));
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	async resendConfirmationCode(email: string) {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: new CognitoUserPool({ UserPoolId, ClientId }),
		});
		return new Promise((resolve, reject) => {
			cognitoUser.resendConfirmationCode((err: Error, result: any) => {
				if (err) {
					console.error(err.message || JSON.stringify(err));
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	}

	async refreshSession(): Promise<Session> {
		if (!_session) {
			throw new Error('No session');
		}
		const cognitoUser = this._getCurrentCognitoUser();
		const sessionToken = new CognitoRefreshToken({ RefreshToken: _session.refreshToken });
		return new Promise<Session>((resolve, reject) => {
			cognitoUser.refreshSession(sessionToken, (err: Error, session: any) => {
				if (err) {
					console.error(err.message || JSON.stringify(err));
					reject(err);
				} else {
					this.session = this._cognitoUserSessionToSession(session);
					resolve(this.session);
				}
			});
		});
	}

	private async _finishExternalProviderLoginIfNeeded() {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('googleAuth') && urlParams.has('code')) {
			const code = urlParams.get('code');
			if (code) {
				const session = await this._getSessionFromCode(code, 'Google');
				this.session = session;
				const { userId } = session;
				// These are the keys used by the amazon-cognito-identity-js module to keep the session.
				// That module doesn't work with external OAuth providers, but we can set the same keys and
				// after that, refreshing and restoring will work.
				const base = `CognitoIdentityServiceProvider.${ClientId}`;
				window.localStorage.setItem(`${base}.${userId}.accessToken`, this.session.accessToken);
				window.localStorage.setItem(`${base}.${userId}.idToken`, this.session.idToken);
				window.localStorage.setItem(`${base}.${userId}.refreshToken`, this.session.refreshToken);
				window.localStorage.setItem(`${base}.${userId}.provider`, 'Google');
				window.localStorage.setItem(`${base}.${userId}.expiresAt`, String(session.expiresAt));
				window.localStorage.setItem(`${base}.LastAuthUser`, userId);
				window.localStorage.setItem(`${base}.clockDrift`, '0');
				this._removeLoginInfoFromCurrentURL();
			}
		}
	}

	private _sessionNeedsRefresh(session: Session): boolean {
		return session && this._isExpired(session.expiresAt);
	}

	private _isExpired(expiresAt: number): boolean {
		return Date.now() > expiresAt - 10 * 60 * 1000; // remains less than 10 minutes to expiration
	}

	private _getCurrentCognitoUser() {
		return new CognitoUserPool({ UserPoolId, ClientId }).getCurrentUser();
	}

	private async _getSessionFromCode(code: string, provider: Providers): Promise<Session> {
		// https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
		const authResp = await fetch(`${OAuthServerURL}/token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
			body: Object.entries({
				grant_type: 'authorization_code',
				client_id: ClientId,
				redirect_uri: RedirectURI,
				code,
				scope: 'email openid',
			})
				.map(([key, val]) => encodeURIComponent(key) + '=' + encodeURIComponent(val))
				.join('&'),
		});
		const authJson = await authResp.json();
		const accessToken: string = authJson.access_token;
		const expiresIn: number = authJson.expires_in;
		const idToken: string = authJson.id_token;
		const refreshToken: string = authJson.refresh_token;
		const idTokenPayload = new CognitoIdToken({ IdToken: idToken }).payload;
		// const tokenType: string = authJson.token_type;
		// const accessTokenPayload = new CognitoIdToken({ IdToken: accessToken }).payload;
		// const refreshTokenPayload = new CognitoIdToken({ IdToken: refreshToken }).payload;
		const session: Session = {
			email: idTokenPayload.email,
			userId: idTokenPayload.sub,
			accessToken,
			idToken,
			refreshToken,
			expiresAt: expiresIn,
			provider,
		};
		return session;
	}

	private _redirectToOauthProviderLogin(provider: Providers) {
		const url = new URL(`${OAuthServerURL}/authorize`);
		url.searchParams.set('identity_provider', provider);
		url.searchParams.set('redirect_uri', RedirectURI);
		url.searchParams.set('response_type', 'CODE');
		url.searchParams.set('client_id', ClientId);
		url.searchParams.set('scope', 'aws.cognito.signin.user.admin email openid');
		window.location.href = url.toString();
	}

	private _removeLoginInfoFromCurrentURL() {
		const url = new URL(window.location.href);
		url.searchParams.delete('googleAuth');
		url.searchParams.delete('code');
		window.history.pushState({}, '', url.toString());
	}

	private _restoreAndRefreshSession() {
		// Restore and refresh session
		const cognitoUser = new CognitoUserPool({ UserPoolId, ClientId }).getCurrentUser();
		if (cognitoUser != null) {
			cognitoUser.getSession((err: any, session: CognitoUserSession) => {
				if (err) {
					console.error(err.message || JSON.stringify(err));
				} else if (session.isValid()) {
					this.session = this._cognitoUserSessionToSession(session);
				}
			});
		}
	}

	private async _signupInWithCognitoUserPass(
		email: string,
		password: string,
		username: string,
	): Promise<{ email: string; userId: string; userConfirmed: boolean }> {
		return new Promise((resolve, reject) => {
			const userPool = new CognitoUserPool({ UserPoolId, ClientId });
			const attrUsername = new CognitoUserAttribute({
				Name: 'custom:rk_username',
				Value: username,
			});
			userPool.signUp(
				email,
				password,
				[attrUsername],
				null,
				(err: Error, result: ISignUpResult) => {
					if (err) {
						console.error(err.message || JSON.stringify(err));
						reject(err);
					} else {
						const { userConfirmed, userSub: userId } = result;
						resolve({
							email,
							userId,
							userConfirmed,
						});
					}
				},
			);
		});
	}

	private async _signInInWithCognitoUserPass(email: string, password: string): Promise<Session> {
		const authDetails = new AuthenticationDetails({ Username: email, Password: password });
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: new CognitoUserPool({ UserPoolId, ClientId }),
		});
		return new Promise((resolve, reject) => {
			cognitoUser.authenticateUser(authDetails, {
				onSuccess: (result: CognitoUserSession, userConfirmationNecessary: boolean) => {
					resolve(this._cognitoUserSessionToSession(result, userConfirmationNecessary));
				},
				onFailure: (err: any) => {
					console.debug(err.message || JSON.stringify(err));
					reject(err);
				},
			});
		});
	}

	private _cognitoUserSessionToSession(
		session: CognitoUserSession,
		userConfirmationNecessary?: boolean,
	): Session {
		const idTokenPayload = session.getIdToken().payload;
		return {
			email: idTokenPayload.email,
			userConfirmationNecessary: !!userConfirmationNecessary,
			provider: 'Cognito',
			idToken: session.getIdToken().getJwtToken(),
			accessToken: session.getAccessToken().getJwtToken(),
			refreshToken: session.getRefreshToken().getToken(),
			expiresAt: session.getAccessToken().getExpiration() * 1000,
			userId: idTokenPayload.sub,
		};
	}

	private _scheduleRefreshSession(session: Session | null) {
		if (_scheduledSessionRefresh != null) clearTimeout(_scheduledSessionRefresh);
		if (session) {
			const { expiresAt } = session;
			const msToExpiration = expiresAt - Date.now();
			const msToRefresh = Math.max(0, msToExpiration - 1000 * 60 * 3);
			_scheduledSessionRefresh = setTimeout(() => {
				this.refreshSession();
				_scheduledSessionRefresh = null;
			}, msToRefresh);
		}
	}

	private dispatch<EventName extends keyof EventsMap>(
		eventName: EventName,
		detail: EventsMap[EventName]['detail'],
		opts?: { bubbles?: boolean; composed?: boolean },
	) {
		const params = { bubbles: true, composed: true, detail, ...opts };
		const evt = new CustomEvent(eventName, params);
		this.host.dispatchEvent(evt);
	}
}
