import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../lib/localization/rk-url-paths.js';
import { Icons } from '../../authenticated-icons.js';
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import linkStyles from '/samba/styles/link.css' assert { type: 'css' };

export class RkShareTourney extends LitElement {
  render() {
    return html`
      <div class="main">
        <a id="arrow" class="link--primary">${Icons('arrow-left', 16)}</a>
      </div>
    `;
  }

  static styles = [
    buttonStyles,
    linkStyles,
    css`
      .main {
        align-items: center;
        background: var(--color-landing-bg);
        color: var(--color-landing-text);
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        width: 100%;
      }
      #arrow {
        position: absolute;
        top: 40px;
        left: 40px;
      }
    `,
  ];
}

customElements.define('rk-share-tourney', RkShareTourney);

declare global {
  interface HTMLElementTagNameMap {
    'rk-share-tourney': RkShareTourney;
  }
}
