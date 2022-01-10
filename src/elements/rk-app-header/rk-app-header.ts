import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { Icons } from '../../authenticated-icons.js';
import { openOverlay } from 'samba/overlay/open-overlay.js';
import '../../elements/rk-drawer/rk-drawer.js';
import type { RkDrawer } from '../../elements/rk-drawer/rk-drawer.js';
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import resetStyles from '/samba/styles/reset.css' assert { type: 'css' };

export class RkAppHeader extends LitElement {
  private _onMenuClick() {
    openOverlay<RkDrawer>('rk-drawer', null, {
      addOverlayStyles: false,
      cancelOnOutsideClick: true,
      withBackdrop: true,
      animationIn: [
        { transform: 'translateX(-20px)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 },
      ],
      animationOut: [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(-20px)', opacity: 0 },
      ],
    });
  }

  render() {
    return html`
      <header>
        <button @click=${this._onMenuClick}>${Icons('hamburger', 24)}</button>
        <section>
          <button>${Icons('bell-with-number', 24)}</button>
          <button>
            <img alt="Player avatar" src="/assets/images/default-avatar.svg" />
          </button>
        </section>
      </header>
    `;
  }

  static styles = [
    resetStyles,
    buttonStyles,
    css`
      header {
        align-items: center;
        background: var(--color-header-bg);
        box-sizing: border-box;
        color: var(--color-header-text);
        display: flex;
        flex-direction: row;
        height: 70px;
        justify-content: space-between;
        padding: 2rem;
        width: 100%;
        z-index: 2;
      }

      header section {
        display: flex;
        gap: 2rem;
      }
    `,
  ];
}

customElements.define('rk-app-header', RkAppHeader);

declare global {
  interface HTMLElementTagNameMap {
    'rk-app-header': RkAppHeader;
  }
}
