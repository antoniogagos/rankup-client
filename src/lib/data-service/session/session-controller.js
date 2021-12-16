// import { HadronHttpApi } from '../hadron-http-api/hadron-http-api.js';
/** @typedef {import('../types').Session} Session */
/** @typedef {import('../types').LoggedUser} LoggedUser */
/** @typedef {import('../types').ISessionProvider} ISessionProvider */
/** @typedef {import('../types').IApiService} IApiService */
/** @typedef {import('lit').ReactiveController} ReactiveController */
/** @typedef {HTMLElement & import('lit').ReactiveControllerHost} ReactiveControllerHost */

// const apiService = new HadronHttpApi();

/** @type {IApiService | null} */
let API_SERVICE = null;

/** @type {Session} */
let _session = null;

/** @type {LoggedUser} */
let _user = null;

/** @type {Set<SessionController>} */
const _controllers = new Set();

/** @type {Promise<void>} */
let _logInReq = null;

/** @type {NodeJS.Timeout} */
let _scheduledRefreshTimeout = null;

/** @type {() => void} */
let _scheduledRefreshWhenOnline = null;

/** @param {Session | null} session */
function _updateSession(session) {
  const username = session?.user.username ?? _session?.user.username;
  if (session) {
    API_SERVICE.config = {
      ...API_SERVICE.config,
      credentials: session.credentials,
      region: session.region,
    };
  }
  if (username) {
    if (session) {
      window.localStorage.setItem('username', username);
      window.localStorage.setItem(`${username}.session`, JSON.stringify(session));
    } else {
      window.localStorage.removeItem('username');
      window.localStorage.removeItem(`${username}.session`);
    }
  }
  _session = session;
  _user = session?.user;
}

/** @implements {ReactiveController} */
export class SessionController {
  /**
   * @param {ReactiveControllerHost} host
   * @param {Map<string, ISessionProvider>} sessionProviders
   * @param {IApiService} apiService
   * @param {Object} [p2]
   * @param {function(Session):void} [p2.onUpdated]
   * @param {function(LoggedUser):void} [p2.onUserChanged]
   * @param {function(LoggedUser):void} [p2.onUserChanged]
   */
  constructor(host, sessionProviders, apiService, { onUpdated, onUserChanged } = {}) {
    if (!sessionProviders?.size) {
      throw new Error('No session providers found');
    }
    if (!apiService || (API_SERVICE && API_SERVICE !== apiService)) {
      throw new Error('SessionController invalid api service');
    }
    API_SERVICE = apiService;
    this.host = host;
    this.onUpdated = onUpdated;
    this.onUserChanged = onUserChanged;
    this.#sessionProviders = sessionProviders;
    host.addController(this);
    this.#restoreSession();
  }

  /** @type {ReactiveControllerHost} */
  host = null;

  /** @type {function(Session): void} */
  onUpdated = null;

  /** @type {Map<string, ISessionProvider>} */
  #sessionProviders = new Map();

  get session() {
    return _session;
  }

  get user() {
    return _user;
  }

  get isExpired() {
    return Boolean(!_session || this.#isExpired(_session));
  }

  get isSignedIn() {
    return Boolean(_user && !this.isExpired);
  }

  hostConnected() {
    _controllers.add(this);
  }

  hostDisconnected() {
    _controllers.delete(this);
  }

  /**
   * @param {{
   *   provider: string
   *   username?: string
   *   password?: string
   * }} param0
   * @returns {Promise<void>}
   */
  async logIn({ provider }) {
    if (!navigator.onLine) throw new Error('DisconnectedError');
    _logInReq ??= new Promise((resolve, reject) => {
      const old = _session;
      const OAuthProvider = this.#getSessionProvider(provider);
      OAuthProvider.refresh()
        .then(oauthLoggedUser =>
          API_SERVICE.Auth.SignIn({
            token: oauthLoggedUser.tokenId,
            provider,
          }),
        )
        .then(resp => {
          _updateSession({ ...resp, provider });
          this.#dispatchUpdate(old);
          resolve();
        })
        .catch(err => {
          console.error(err);
          reject(err);
        })
        .finally(() => {
          _logInReq = null;
        });
    });
    return _logInReq;
  }

  async logOut() {
    this.#clearSession();
  }

  /**
   * @param {{
   *   provider: string
   *   username: string
   * }} param0
   */
  async signUp({ provider, username }) {
    if (!navigator.onLine) {
      throw new Error('DisconnectedError');
    }
  }

  /** @returns {Promise<boolean>} */
  async refresh() {
    if (!_session) {
      throw new Error('NoSessionError');
    }
    let refreshed = false;
    if (navigator.onLine) {
      try {
        await this.logIn({ provider: _session.provider });
        refreshed = true;
      } catch (err) {
        this.#scheduleRefresh(new Date(Date.now() + 1000 * 60 * 18));
      }
    } else {
      this.#scheduleRefreshWhenOnline();
    }
    return refreshed;
  }

  async #restoreSession() {
    if (!_session) {
      const username = window.localStorage.getItem('username');
      /** @type {Session} */
      const session = username
        ? JSON.parse(window.localStorage.getItem(`${username}.session`))
        : null;
      _updateSession(session);
      if (session) {
        if (this.#isExpired(_session)) {
          console.debug('session:is-expired');
          this.refresh();
        } else {
          console.debug('session:not-expired', this.#getExpirationDate(_session));
          this.#scheduleRefresh(this.#getExpirationDate(_session));
        }
      } else {
        for (const [name, provider] of this.#sessionProviders) {
          if (provider.isOAuthProvider && (await provider.isLogged())) {
            this.logIn({ provider: name });
            // return;
          }
        }
        // const isLoggedUsingGoogle = await GoogleSession.isLogged();
        // if (isLoggedUsingGoogle) {
        //   this.logIn({ provider: 'google' });
        //   return;
        // }
      }
    }
    // Note: this session could be expired, but we want to notify the session. This way we can
    // assume the user is logged-in and load the rest while refreshing in the background
    this.onUpdated?.(_session);
    this.onUserChanged?.(_session?.user);
  }

  #clearSession() {
    const old = _session;
    clearTimeout(_scheduledRefreshTimeout);
    window.localStorage.removeItem('username');
    if (_session) {
      const OAuthProvider = this.#getSessionProvider(_session.provider);
      OAuthProvider.logOut();
      window.localStorage.removeItem(`${_session.user.username}.session`);
    }
    _updateSession(null);
    this.#dispatchUpdate(old);
  }

  /**
   * @param {string} provider
   * @returns {ISessionProvider}
   */
  #getSessionProvider(provider) {
    return this.#sessionProviders.get(provider);
    // return provider === 'google' ? GoogleSession : null;
  }

  /**
   * @param {Session} session
   * @returns {Date}
   */
  #getExpirationDate(session) {
    return new Date(session.credentials.Expiration);
  }

  /**
   * @param {Session} session
   * @returns {Boolean}
   */
  #isExpired(session) {
    return Boolean(!session || Date.now() > this.#getExpirationDate(session).getTime());
  }

  /**
   * Schedules a future session refresh.
   * If the user if offline it ignores the refresh. When the user
   * gets back online, the sessión will be refreshed if needed.
   *
   * @param  {Date} expirationDate
   */
  #scheduleRefresh(expirationDate) {
    const remaining = expirationDate.getTime() - Date.now();
    const timeoutMs = Math.max(0, remaining - 15 * 60 * 1000);
    console.debug('Refreshing in', remaining / 1000 / 60, 'min');
    clearTimeout(_scheduledRefreshTimeout);
    _scheduledRefreshTimeout = setTimeout(_ => {
      if (window.navigator.onLine) {
        this.refresh();
      } else {
        this.#scheduleRefreshWhenOnline();
      }
    }, timeoutMs);
  }

  #scheduleRefreshWhenOnline() {
    if (!_scheduledRefreshWhenOnline) {
      _scheduledRefreshWhenOnline = () => {
        _scheduledRefreshWhenOnline = null;
        this.refresh();
      };
      window.addEventListener('online', _scheduledRefreshWhenOnline, { once: true });
    }
  }

  /** @param {Session} oldSession */
  #dispatchUpdate(oldSession) {
    if (_session !== oldSession) {
      const userChanged = oldSession?.user.userId !== _session?.user.userId;
      _controllers.forEach(controller => {
        controller.onUpdated?.(_session);
        if (userChanged) {
          controller.onUserChanged?.(_session?.user);
        }
      });
    }
  }
}
