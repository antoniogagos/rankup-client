import { msg } from '@lit/localize';
import { Task } from '@lit-labs/task';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import type { OverlayController } from 'samba/overlay/types.js';
import buttonStyles from 'samba/styles/button.css' assert { type: 'css' };
import resetStyles from 'samba/styles/reset.css' assert { type: 'css' };

import { Icons } from '../../authenticated-icons.js';
import { path } from '../../lib/localization/rk-url-paths.js';

export interface RkDrawerParameters {}

@customElement('rk-drawer')
export class RkDrawer extends LitElement implements RkDrawerParameters {
  private _tourneys = new Task(
    this,
    () => rkApp.ds.GetUserTourneys(),
    () => [null],
  );

  overlayController?: OverlayController<this>;

  connectedCallback(): void {
    super.connectedCallback?.();
    const url = new URL(window.location.toString());
    url.searchParams.set('drawer', '1');
    window.history.pushState({ drawer: 1, ...window.history.state }, '', url.toString());
    window.addEventListener('popstate', this._onPopstate);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    const { drawer, ..._state } = window.history.state ?? {};
    if (drawer) {
      const url = new URL(window.location.toString());
      url.searchParams.delete('drawer');
      window.history.replaceState(_state, '', url);
    }
    window.removeEventListener('popstate', this._onPopstate);
  }

  private _onPopstate = () => {
    this.overlayController?.close();
  };

  private _onSignOutClicked() {
    this.overlayController?.close();
    rkApp.sessionManager.signOut();
  }

  render() {
    return html`
      <main opened>
        <img src="/assets/images/rk-logo-with-bg.svg" alt="Rankup logo" />
        <div class="rankup">Rankup</div>
        <a href=${path('CREATE_TOURNEY')}>
          <button class="btn btn--md">${Icons('create-tourney', 18)}${msg('Crear liga')}</button>
        </a>
        <a href=${path('JOIN_TOURNEY')}>
          <button class="btn btn--md">
            ${Icons('join-tourney', 18)}${msg('Unirse a una liga')}
          </button>
        </a>
        <button id="signoutBtn" @click=${this._onSignOutClicked} class="btn btn--md">
          ${Icons('sign-out', 18)}${msg('Cerrar sesión')}
        </button>
        <div class="divisor-line"></div>
        <button class="btn btn--md">${Icons('twitter', 18)}${msg('¡Síguenos en Twitter!')}</button>
        <button class="btn btn--md">${Icons('newsletter', 18)}${msg('Rankup newsletter')}</button>
      </main>
    `;
  }

  static styles = [
    resetStyles,
    buttonStyles,
    css`
      :host {
        display: inline-block;
        height: 100%;
      }
      main {
        align-items: flex-start;
        background: var(--color-canvas-overlay);
        box-sizing: border-box;
        color: var(--color-fg-default);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
        justify-content: flex-start;
        max-width: 35rem;
        padding: 2rem;
        position: absolute;
        transform: translateX(-100%);
        transition: transform 350ms ease-in-out;
        width: 65vw;
        z-index: 2;
      }
      main[opened] {
        transform: translateX(0);
      }
      a {
        width: 100%;
      }
      #signoutBtn {
        margin-top: 3.5rem;
      }
      .rankup {
        font-size: 2.2rem;
        font-weight: bold;
        margin-bottom: 2rem;
      }
      .btn {
        width: 100%;
        border-radius: 8px;
      }
      .divisor-line {
        background-color: var(--color-canvas-subtle);
        height: 0.1rem;
        width: 100%;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-drawer': RkDrawer;
  }
}
