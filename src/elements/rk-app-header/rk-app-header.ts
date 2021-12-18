import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { Icons } from '../../unauthenticated-icons.js';
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import resetStyles from '/samba/styles/reset.css' assert { type: 'css' };

export class RkAppHeader extends LitElement {
  render() {
    return html`
      <header>
        <button>${Icons('hamburger', 24)}</button>
        <section>
          <button>${Icons('bell', 24)}</button>
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
        padding: 20px;
        width: 100%;
        z-index: 2;
      }

      header section {
        display: flex;
        gap: 20px;
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
