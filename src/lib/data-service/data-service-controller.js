import { SessionController } from './session/session-controller.js';
/** @typedef {import('./types').LoggedUser} LoggedUser */
/** @typedef {import('./types').ISessionProvider} ISessionProvider */
/** @typedef {import('./types').IApiService} IApiService */
/** @typedef {import('./types').Session} Session */
/** @typedef {import('lit').ReactiveController} ReactiveController */
/** @typedef {import('lit').ReactiveElement} ReactiveElement */

/**
 * @template {IApiService} T
 * @template {Map<string, ISessionProvider>} SessionProviders
 * @implements {ReactiveController}
 */
export class DataService {
  /** @type {SessionController<SessionProviders> | null} */
  sessionController = null;

  sessionProviders = /** @type {SessionProviders} */ (new Map());

  /** @type {ReactiveElement | null} */
  host = null;

  /** @type {T | null} */
  #apiService = null;

  /** @type {(user: LoggedUser) => void | null} */
  #onUserChanged = null;

  /**
   * @param {ReactiveElement} host
   * @param {SessionProviders} sessionProviders
   * @param {T} apiService
   * @param {Object} [param]
   * @param {(user: LoggedUser) => void} [param.onUserChanged]
   */
  constructor(host, sessionProviders, apiService, { onUserChanged } = {}) {
    if (!sessionProviders?.size) {
      throw new Error('No session providers found');
    }
    this.host = host;
    this.sessionProviders = sessionProviders;
    this.#apiService = apiService;
    this.#onUserChanged = onUserChanged;
    host.addController(this);
  }

  get user() {
    return this.sessionController.user;
  }

  get isSignedIn() {
    return this.sessionController.isSignedIn;
  }

  get request() {
    return this.#apiService;
  }

  hostConnected() {
    this.sessionController = new SessionController(
      this.host,
      this.sessionProviders,
      this.#apiService,
      {
        onUpdated: this.#onSessionUpdated.bind(this),
        onUserChanged: this.#onUserChanged?.bind(this),
      },
    );
  }

  hostDisconnected() {
    this.host.removeController(this.sessionController);
    this.sessionController = null;
  }

  /** @param {Session} session */
  #onSessionUpdated(session) {
    this.#apiService.config = {
      ...this.#apiService.config,
      credentials: session?.credentials ?? null,
      region: session?.region ?? null,
    };
  }
}
