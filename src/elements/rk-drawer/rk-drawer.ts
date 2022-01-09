import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { Task, TaskStatus } from '@lit-labs/task';
import type { OverlayController } from 'samba/overlay/types.js';
// @ts-ignore
import buttonStyles from 'samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import resetStyles from 'samba/styles/reset.css' assert { type: 'css' };
import { Icons } from '../../unauthenticated-icons.js';

export interface RkDrawerParameters {}

@customElement('rk-drawer')
export class RkDrawer extends LitElement implements RkDrawerParameters {
  private _tourneys = new Task(
    this,
    () => rkApp.ds.GetUserTourneys(),
    () => [null],
  );

  overlayController?: OverlayController<this> = null;

  connectedCallback(): void {
    super.connectedCallback?.();
    const url = new URL(window.location.toString());
    url.searchParams.set('drawer', '1');
    window.history.pushState({ drawer: 1, ...window.history.state }, null, url.toString());
    window.addEventListener('popstate', this._onPopstate);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    const { drawer, ..._state } = window.history.state ?? {};
    if (drawer) {
      const url = new URL(window.location.toString());
      url.searchParams.delete('drawer');
      window.history.replaceState(_state, null, url);
    }
    window.removeEventListener('popstate', this._onPopstate);
  }

  private _onPopstate = (evt: Event) => {
    this.overlayController?.close();
  };

  private _onSignOutClicked() {
    rkApp.sessionManager.signOut();
  }

  render() {
    return html`
      <main opened>
        <img src="/assets/images/rk-logo-with-bg.svg" alt="Rankup logo" />
        <div class="rankup">Rankup</div>
        <button class="btn">${Icons('create-tourney', 18)}${msg('Crear liga')}</button>
        <button class="btn">${Icons('join-tourney', 18)}${msg('Unirse a una liga')}</button>
        <button id="signoutBtn" class="btn" @click=${this._onSignOutClicked}>
          ${Icons('sign-out', 18)}${msg('Cerrar sesión')}
        </button>
        <div class="divisor-line"></div>
        <button class="btn">${Icons('twitter', 18)}${msg('¡Síguenos en Twitter!')}</button>
        <button class="btn">${Icons('newsletter', 18)}${msg('Rankup newsletter')}</button>
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
