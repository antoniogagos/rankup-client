import type { ReactiveController, ReactiveElement } from 'lit';
import { RkSessionProviders } from '../../lib/rk-data-service/session-providers.js';
import { RkApiService } from '../../lib/rk-data-service/api-service.js';
import { SessionController } from '../../lib/data-service/session/session-controller.js';

export class SessionManager implements ReactiveController {
  host: ReactiveElement;

  #sessionController: SessionController<typeof RkSessionProviders> | null = null;

  constructor(host: ReactiveElement) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected() {
    this.#sessionController = new SessionController(
      this.host,
      RkSessionProviders,
      new RkApiService(),
      {
        onUpdated: this.onSessionUpdated.bind(this),
      },
    );
  }

  hostDisconnected() {
    // Note that internal controllers must be added/removed by this element, bc the user of this
    // controller doesn't know about it's existence
    this.host.removeController(this.#sessionController);
    this.#sessionController = null;
  }

  get user() {
    return this.#sessionController.user;
  }

  get isLogged() {
    return this.#sessionController.isSignedIn;
  }

  signUp({
    provider,
    username,
    password,
  }: {
    provider: KeyOfMap<typeof RkSessionProviders>;
    username?: string;
    password?: string;
  }) {
    return this.#sessionController.signUp({ provider, username, password });
  }

  signIn({
    provider,
    username,
    password,
  }: {
    provider: KeyOfMap<typeof RkSessionProviders>;
    username?: string;
    password?: string;
  }) {
    return this.#sessionController.logIn({ provider, username, password });
  }

  signOut() {
    this.#sessionController.logOut();
  }

  private onSessionUpdated() {}

  // private dispatch(
  //   eventName: string,
  //   detail: any,
  //   { composed, cancelable }: { composed?: boolean; cancelable?: boolean } = {},
  // ) {
  //   const params = { bubbles: true, composed, cancelable, detail };
  //   const evt = new CustomEvent(eventName, params) as EventsMap[EventName];
  //   this.host.dispatchEvent(evt);
  //   return evt;
  // }
}
