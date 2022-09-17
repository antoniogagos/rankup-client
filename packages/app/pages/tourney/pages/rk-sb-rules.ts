import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import ButtonStyles from 'samba/styles/button.css' assert { type: 'css' };
import LinkStyles from 'samba/styles/link.css' assert { type: 'css' };
import MarginStyles from 'samba/styles/margin.css' assert { type: 'css' };
import TypographyStyles from 'samba/styles/typography.css' assert { type: 'css' };

import { Icons } from '../../../authenticated-icons.js';

@customElement('rk-sb-rules')
export class RkSbRules extends LitElement {
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
        <h1 class="text-bold">${msg('Sistema de puntuación')}</h1>
        <p class="f3 mt-4 mb-4">
          ${msg(
            `Al finalizar cada partido, se calcularán los puntos para ese partido.
            Según tu pronóstico y el resultado final tendrás una determinada puntuación.`,
          )}
        </p>
        <div class="f3 description mt-4">
          ${msg('Al acertar el...')}
          <ul class="rules">
            <li>
              <span class="rule-text">Ganador del partido</span>
              <span class="rule-points text-bold positive">+8</span>
            </li>
            <li>
              <span class="rule-text">Resultado exacto</span>
              <span class="rule-points text-bold positive">+6</span>
            </li>
            <li>
              <span class="rule-text">Goles exactos de un equipo</span>
              <span class="rule-points text-bold positive">+2</span>
            </li>
            <li>
              <span class="rule-text">Fallar goles exactos de ambos equipos (excepto empates)</span>
              <span class="rule-points text-bold negative">-2</span>
            </li>
          </ul>
          <img src="/assets/images/rk-sb-live-match-card.png" alt="" />
        </div>
      </main>
    `;
  }

  static styles = [
    ButtonStyles,
    LinkStyles,
    TypographyStyles,
    MarginStyles,
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
      p {
        max-width: 400px;
        text-align: left;
      }
      .rules li {
        display: list-item;
        align-items: center;
        margin-bottom: 1.5rem;
        gap: 1.5rem;
        margin-left: 2rem;
      }
      .rules {
        padding: 1rem;
        margin: 0;
      }
      .rule-text {
        max-width: 250px;
      }
      .rule-points {
        padding: 0.3rem 0.6rem;
        border-radius: 0.5rem;
        margin-left: 0.5rem;
      }
      .positive {
        background-color: #9cf6a5;
      }
      .negative {
        background-color: #ffb8b8;
      }
      .description {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .tourney-code {
        width: fit-content;
        background: var(--color-canvas-subtle);
        padding: 0.5rem 3rem;
        width: fit-content;
        border: 1px dotted var(--color-border-default);
        box-sizing: border-box;
        border-radius: 0.5rem;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'rk-sb-rules': RkSbRules;
  }
}
