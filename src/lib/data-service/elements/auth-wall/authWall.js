import { LitElement, html, css } from 'lit';
// import { SessionController } from '../../session/session-controller.js';
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

  /** @type {import('../../session/session-controller').SessionController} */
  #sessionController = null;

  constructor() {
    super();
    this._loading = true;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.#dispatchSessionUpdate();
    const SessionController = await this.lazyLoadSessionController();
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

  /** @returns {Promise<typeof import('../../session/session-controller').SessionController>} */
  async lazyLoadSessionController() {
    const { SessionController } = await import('../../session/session-controller.js');
    return SessionController;
  }

  #dispatchSessionUpdate() {
    this.dispatchEvent(new CustomEvent('session-updated', { detail: { session: this.#session } }));
  }

  /** @param {Session} session */
  #onSessionUpdated(session) {
    [...this.children].forEach(el => {
      el.toggleAttribute('hidden', false);
      // if (el.localName === 'hadron-app') {
      //   const _el = /** @type {HTMLElement & {username?: string}} */ (el);
      //   _el.username = session?.user.usernameLowerCase ?? null;
      // }
    });
    // if (session && window.location.pathname.startsWith('/login')) {
    //   window.location.replace('/app/dashboard');
    // }
    this._loading = false;
    this.requestUpdate();
    this.#dispatchSessionUpdate();
  }

  /** @returns {Session | null} */
  #getSessionFromLocalST() {
    try {
      const username = window.localStorage.getItem('username');
      const sessionStr = username ? window.localStorage.getItem(`${username}.session`) : null;
      const session = /** @type {Session | null} */ (sessionStr ? JSON.parse(sessionStr) : null);
      if (session?.credentials?.Expiration) {
        const ts = new Date(session.credentials.Expiration).getTime();
        const isExpired = Date.now() > ts;
        if (isExpired) {
          // not logged
        } else {
          return session;
        }
      }
    } catch {
      // ignore errors
    }
    return null;
  }

  #loginWithGoogle() {
    this.#sessionController.logIn({ provider: 'google' });
  }

  #logout() {
    this.#sessionController.logOut();
  }

  get #session() {
    return this.#sessionController?.session ?? this.#getSessionFromLocalST();
  }

  render() {
    return this.#session
      ? html`
          <slot name="authenticated"></slot>
        `
      : html`
          <slot name="unauthenticated"></slot>
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
