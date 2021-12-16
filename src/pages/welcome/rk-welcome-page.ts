import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import buttonStyles from 'samba/styles/button.css' assert { type: 'css' };
import { Icons } from '../../unauthenticated-icons.js';
// @ts-ignore

export class WelcomePage extends LitElement {
  render() {
    return html`
      <div class="main">
        <img alt="Rankup logo" src="/assets/icons/rk-logo-bubbles.svg" />
        <span class="title">Rankup</span>
        <p>Challenge your friends in a season-long tournament 🎯</p>
        <a class="btn btn--primary" href="/access">${msg('Jugar ya')} ${Icons('back-arrow', 16)}</a>
      </div>
      <picture>
        <source type="image/avif" srcset="/assets/images/ball-bg.avif" />
        <img alt="ball" src="/assets/images/ball-bg.webp" />
      </picture>
    `;
  }

  static styles = [
    buttonStyles,
    css`
      .main {
        align-items: center;
        background: var(--color-bg-backdrop);
        color: var(--color-scale-gray-0);
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
        margin-top: -2.5rem;
      }

      .main p {
        font-size: 1.8rem;
        margin: 1.4rem auto;
        max-width: 260px;
        text-align: center;
      }

      .btn {
        position: absolute;
        bottom: 10vh;
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

customElements.define('rk-welcome-page', WelcomePage);

declare global {
  interface HTMLElementTagNameMap {
    'rk-welcome-page': WelcomePage;
  }
}
