import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { customElement, property, state } from 'lit/decorators.js';
import { Task, TaskStatus } from '@lit-labs/task';
import type { OverlayController } from 'samba/overlay/types.js';
// @ts-ignore
import buttonStyles from 'samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import resetStyles from 'samba/styles/reset.css' assert { type: 'css' };
import { Icons } from '../../authenticated-icons.js';
import { path } from '../../lib/localization/rk-url-paths.js';

export interface RkDrawerParameters {}

@customElement('rk-drawer')
export class RkDrawer extends LitElement implements RkDrawerParameters {
  overlayController?: OverlayController<this> = null;

  private _onSignoutClick() {
    rkApp.sessionManager.signOut();
    this.overlayController?.close();
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
        <button id="signoutBtn" @click=${this._onSignoutClick} class="btn btn--md">
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
