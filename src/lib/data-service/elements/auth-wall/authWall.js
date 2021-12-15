import { LitElement, html, css } from 'lit';
import { SessionController } from '../../session/session-controller.js';
/** @typedef {import('../../types').Session} Session */
/** @typedef {import('../../types').ISessionProvider} ISessionProvider */
/** @typedef {import('../../types').IApiService} IApiService */

export class AuthWall extends LitElement {
  static properties = {
    _loading: { state: true },
  };

  /** @type {Map<string, ISessionProvider>} */
  sessionProviders = null;

  /** @type {IApiService} */
  apiService = null;

  /** @type {SessionController} */
  #sessionController = null;

  constructor() {
    super();
    this._loading = true;
  }

  connectedCallback() {
    super.connectedCallback();
    [...this.children].forEach(el => el.toggleAttribute('hidden', true));
    if (!this.sessionProviders?.size) {
      throw new Error('AuthWall no session providers found');
    }
    if (!this.apiService) {
      throw new Error('AuthWall no api service found');
    }
    this.#sessionController = new SessionController(this, this.sessionProviders, this.apiService, {
      onUpdated: this.#onSessionUpdated.bind(this),
    });
  }

  /** @param {Session} session */
  #onSessionUpdated(session) {
    [...this.children].forEach(el => {
      el.toggleAttribute('hidden', false);
      if (el.localName === 'hadron-app') {
        const _el = /** @type {HTMLElement & {username?: string}} */ (el);
        _el.username = session?.user.usernameLowerCase ?? null;
      }
    });
    if (session && window.location.pathname.startsWith('/login')) {
      window.location.replace('/app/dashboard');
    }
    this._loading = false;
    this.requestUpdate();
  }

  #loginWithGoogle() {
    this.#sessionController.logIn({ provider: 'google' });
  }

  #logout() {
    this.#sessionController.logOut();
  }

  render() {
    return this.#sessionController.user
      ? html`
          <slot name="authenticated"></slot>
        `
      : html`
          <slot name="unauthenticated">
            <div>Login Form</div>
            <button @click=${this.#loginWithGoogle}>Login With Google</button>
          </slot>
        `;
  }

  static styles = [
    css`
      :host {
        display: contents;
      }
    `,
  ];
}
