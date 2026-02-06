import { listen } from '@rankup/base/browser/event.js';
import { DisposableStore } from '@rankup/base/common/lifecycle.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * @fires session-updated
 */
@customElement('rk-auth-wall')
export class AuthWall extends LitElement {
	constructor() {
		super();
		const session = this._isLoggedFromLocalST();
		this._isLogged = !!session;
		this.dispatchEvent(
			new CustomEvent('session-updated', {
				detail: {
					session,
					old: null,
				},
			}),
		);
	}

	private _isLogged = false;

	private readonly _disposables = new DisposableStore();

	override connectedCallback() {
		super.connectedCallback?.();
		this._disposables.clear();
		this._disposables.add(listen(this, 'session-updated', this._onSessionUpdated));
	}

	override disconnectedCallback() {
		super.disconnectedCallback?.();
		this._disposables.clear();
	}

	private _onSessionUpdated = (evt: Event) => {
		const { session } = (evt as CustomEvent).detail;
		this._isLogged = !!session;
		this.requestUpdate();
	};

	/** @returns {boolean} */
	private _isLoggedFromLocalST() {
		try {
			const ns = 'CognitoIdentityServiceProvider';
			const reg = new RegExp(ns + '\\.\\w+\\.LastAuthUser');
			const key = Object.keys(window.localStorage).find(k => k.match(reg));
			if (key) {
				// const { localStorage } = window;
				// const userId = localStorage.getItem(key);
				// const clientId = key.split('.')[1];
				// const accessToken = localStorage.getItem(`${ns}.${clientId}.${userId}.accessToken`);
				// const idToken = localStorage.getItem(`${ns}.${clientId}.${userId}.idToken`);
				// const refreshToken = localStorage.getItem(`${ns}.${clientId}.${userId}.refreshToken`);
				return true;
			}
		} catch {
			// ignore
		}
		return false;
	}

	override render() {
		return this._isLogged ? html` <slot name="authenticated"></slot> ` : html` <slot name="unauthenticated"></slot> `;
	}

	static override styles = [
		css`
		:host {
			display: block;
			display: contents;
			height: 100%;
			width: 100%;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-auth-wall': AuthWall;
	}
}
