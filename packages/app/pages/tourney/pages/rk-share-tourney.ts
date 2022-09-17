import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import ButtonStyles from 'samba/styles/button.css' assert { type: 'css' };
import LinkStyles from 'samba/styles/link.css' assert { type: 'css' };
import MarginStyles from 'samba/styles/margin.css' assert { type: 'css' };
import ResetStyles from 'samba/styles/reset.css' assert { type: 'css' };
import TypographyStyles from 'samba/styles/typography.css' assert { type: 'css' };

import { Icons } from '../../../authenticated-icons.js';

@customElement('rk-share-tourney')
export class RkShareTourney extends LitElement {
  private _onGoBackClick() {
    window.history.back();
  }

  private _onGoBackKeydown() {
    //
  }

  render() {
    return html`
      <header>
        <button
          id="arrow"
          @click=${this._onGoBackClick}
          @keydown=${this._onGoBackKeydown}
          class="link--primary">
          ${Icons('arrow-left', 20)}
        </button>
      </header>
      <main>
        <h1 class="text-bold">${msg('Invita a tus amigos')}</h1>
        <p class="f3 mt-4 mb-4">
          ${msg(
            `Invita a tus amigos compartiendo el enlace al pulsar el boton de Compartir o pasándoles el código de acceso único para acceder al torneo.`,
          )}
        </p>
        <div class="description">
          <button class="btn btn--primary btn--md">
            ${msg('Compartir enlace')} ${Icons('share', 20)}
          </button>
          <div class="tourney-code-description mt-6">
            <div>${msg('Código de acceso al torneo:')}</div>
            <div class="tourney-code text-bold mt-2">PUI_KD</div>
          </div>
        </div>
      </main>
    `;
  }

  static styles = [
    ButtonStyles,
    LinkStyles,
    MarginStyles,
    ResetStyles,
    TypographyStyles,
    css`
      :host {
        align-items: flex-start;
        background: var(--color-canvas-default);
        box-sizing: border-box;
        color: var(--color-fg-default);
        display: block;
        display: flex;
        flex-direction: column;
        height: 100%;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 10;
      }
      header {
        width: 100%;
        box-sizing: border-box;
        height: 6.6rem;
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      main {
        padding: 0 2rem;
        width: 100%;
        max-width: 450px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      .description {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        width: 100%;
      }
      .tourney-code-description {
        align-items: center;
        display: flex;
        flex-direction: column;
        margin-top: 1.5rem;
      }
      .tourney-code {
      }
      .btn--md {
        width: 100%;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-share-tourney': RkShareTourney;
  }
}
