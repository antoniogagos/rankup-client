import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import 'samba/overlay/overlay-container.js';
import { appRouterAnimations } from './router-animations.js';
import { RkDataServiceController } from './lib/rk-data-service/data-service-controller.js';
import { path } from './lib/localization/rk-url-paths.js';
import { SessionManager } from './managers/session/session-manager.js';
import './elements/app-router/app-router.js';
import './pages/home/rk-home-page.js';
import './pages/tourney/rk-tourney-page.js';
import './pages/create-tourney/rk-create-tourney-page.js';
import './pages/join-tourney/rk-join-tourney-page.js';
// @ts-ignore
import AppRouterStyles from '../../src/elements/app-router/styles.css' assert { type: 'css' };
// @ts-ignore
import ScrollbarStyles from '../../samba/styles/scrollbar.css' assert { type: 'css' };

@customElement('rk-app')
export class RkApp extends LitElement {
  ds = new RkDataServiceController(this);

  sessionManager = new SessionManager(this);

  constructor() {
    super();
    window.rkApp = this;
  }

  onSignOutClick() {
    this.sessionManager.signOut();
  }

  // <button path=${path('TOURNEYS')} @click=${this.onSignOutClick}>Sign Out</button>
  // <div path=${path('TOURNEYS')} animation="opacity">
  //   List of tourneys
  //   <button @click=${this.onSignOutClick}>Sign Out</button>
  // </div>
  // <div path=${path('TOURNEY') + '/:id'} animation="opacity">Tourney Foo</div>
  render() {
    return html`
      <app-router .animations=${appRouterAnimations}>
        <rk-home-page path=${path('TOURNEYS')} animation="opacity"></rk-home-page>
        <rk-tourney-page path=${path('TOURNEY', '*')} animation="opacity"></rk-tourney-page>
        <rk-join-tourney-page
          path=${path('JOIN_TOURNEY')}
          animation="opacity"></rk-join-tourney-page>
        <rk-create-tourney-page
          path=${path('CREATE_TOURNEY')}
          animation="opacity"></rk-create-tourney-page>
        <hw-404-page path="/404"></hw-404-page>
        <app-router__redirect path="*" redirect=${path('TOURNEYS')}></app-router__redirect>
      </app-router>
    `;
  }

  static styles = [
    AppRouterStyles,
    ScrollbarStyles,
    css`
      :host {
        display: contents;
      }

      @supports not (display: contents) {
        :host {
          display: block;
          height: 100%;
        }
      }
    `,
  ];
}

declare global {
  let rkApp: RkApp;

  interface Window {
    rkApp: RkApp;
  }

  interface HTMLElementTagNameMap {
    'rk-app': RkApp;
  }
}
