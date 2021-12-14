import { SessionController } from './session/session-controller.js';
/** @typedef {import('./types').LoggedUser} LoggedUser */
/** @typedef {import('./types').ISessionProvider} ISessionProvider */
/** @typedef {import('./types').IApiService} IApiService */
/** @typedef {import('./types').Session} Session */
/** @typedef {import('lit').ReactiveController} ReactiveController */
/** @typedef {HTMLElement & import('lit').ReactiveControllerHost} ReactiveControllerHost */

/**
 * @template {IApiService} T
 * @implements {ReactiveController}
 */
export class DataService {
  /** @type {SessionController | null} */
  sessionController = null;

  /** @type {ReactiveControllerHost | null} */
  host = null;

  /** @type {Map<string, ISessionProvider>} */
  sessionProviders = new Map();

  /** @type {T | null} */
  request = null;

  /**
   * @param {ReactiveControllerHost} host
   * @param {Map<string, ISessionProvider>} sessionProviders
   * @param {T} apiService
   * @param {Object} [param]
   * @param {function(LoggedUser):void} [param.onUserChanged]
   */
  constructor(host, sessionProviders, apiService, { onUserChanged } = {}) {
    if (!sessionProviders?.size) {
      throw new Error('No session providers found');
    }
    this.host = host;
    this.sessionProviders = sessionProviders;
    this.apiService = apiService;
    this.onUserChanged = onUserChanged;
    host.addController(this);
  }

  get user() {
    return this.sessionController.user;
  }

  get isSignedIn() {
    return this.sessionController.isSignedIn;
  }

  hostConnected() {
    this.sessionController = new SessionController(
      this.host,
      this.sessionProviders,
      this.apiService,
      {
        onUpdated: this.#onSessionUpdated.bind(this),
        onUserChanged: this.#onUserChanged.bind(this),
      },
    );
  }

  hostDisconnected() {
    this.host.removeController(this.sessionController);
    this.sessionController = null;
  }

  /** @param {Session} session */
  #onSessionUpdated(session) {
    this.apiService.config = {
      ...this.apiService.config,
      credentials: session?.credentials ?? null,
      region: session?.region ?? null,
    };
  }

  /** @param {LoggedUser} user */
  #onUserChanged(user) {
    this.onUserChanged?.(user);
  }
}
