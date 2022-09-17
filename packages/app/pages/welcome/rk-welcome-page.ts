import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import buttonStyles from 'samba/styles/button.css' assert { type: 'css' };

import { Icons } from '../../authenticated-icons.js';
import { path } from '../../lib/localization/rk-url-paths.js';

@customElement('rk-welcome-page')
export class WelcomePage extends LitElement {
  render() {
    return html`
      <div class="main">
        <img class="logo" src="/assets/icons/rk-logo.svg" alt="Rankup logo" />
        <span class="title">Rankup</span>
        <p>${msg('Juega contra tus amigos prediciendo los resultados')}</p>
        <a class="btn btn--primary btn--lg" href=${path('SIGNIN')}>
          ${msg('Jugar ya')} ${Icons('arrow-right', 16)}
        </a>
      </div>
      <picture>
        <source type="image/avif" srcset="/assets/images/ball-bg.avif" />
        <img src="/assets/images/ball-bg.webp" alt="Goal" />
      </picture>
    `;
  }

  static styles = [
    buttonStyles,
    css`
      .main {
        align-items: center;
        background: var(--color-landing-bg);
        color: var(--color-landing-text);
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        position: absolute;
        width: 100%;
        z-index: 2;
      }

      .title {
        font-size: 3.5rem;
        font-weight: bold;
        margin: 1.4rem;
      }

      .main p {
        font-size: 1.8rem;
        max-width: 260px;
        margin: 0;
        text-align: center;
      }

      .btn {
        position: absolute;
        bottom: 10vh;
      }

      .logo {
        filter: invert(100%);
      }

      picture img {
        height: 100%;
        left: 0;
        object-fit: cover;
        overflow: hidden;
        pointer-events: none;
        position: absolute;
        top: 0;
        width: 100%;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-welcome-page': WelcomePage;
  }
}
