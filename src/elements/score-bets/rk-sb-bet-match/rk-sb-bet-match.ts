import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { Icons } from '../../../authenticated-icons.js';
import { classMap } from 'lit/directives/class-map.js';
import { calculateOddsHandicap } from '../../../lib/utils/calculate-odds-handicap.js';
import type { Match } from '../../../lib/rk-data-service/api-service.js';
// @ts-ignore
import MatchCardStyles from '/samba/styles/sb-bet-match-card.css' assert { type: 'css' };
// @ts-ignore
import TypographyStyles from '/samba/styles/typography.css' assert { type: 'css' };
// @ts-ignore
import ResetStyles from '/samba/styles/reset.css' assert { type: 'css' };

export class RkSbBetMatch extends LitElement {
  @property({ attribute: false })
  match: Match = null;

  private _onInputHandlerClick(operation: string, side: string) {
    const inputId = `#${side}Input`;
    const input = this.shadowRoot.querySelector(inputId) as HTMLInputElement;
    operation === 'add' ? input.stepUp() : input.stepDown();
    this.requestUpdate();
  }

  private _betInputVal(side: string): number {
    const inputId = `#${side}Input`;
    const input = this.shadowRoot?.querySelector(inputId) as HTMLInputElement;
    return Number(input?.value);
  }

  render() {
    const homeBetInputClasses = classMap({
      win: this._betInputVal('home') > this._betInputVal('away'),
      draw: this._betInputVal('home') === this._betInputVal('away'),
      lose: this._betInputVal('home') < this._betInputVal('away'),
    });
    const awayBetInputClasses = classMap({
      win: this._betInputVal('away') > this._betInputVal('home'),
      draw: this._betInputVal('away') === this._betInputVal('home'),
      lose: this._betInputVal('away') < this._betInputVal('home'),
    });
    return html`
      <div class="match-card f6">
        <div class="match-card-header">
          <div>${new Intl.DateTimeFormat(['ban', 'id']).format(this.match?.date)}</div>
          <div class="card-header--right-content">
            ${this.match.derbi
              ? html`
                  <div>${msg('Derbi')}</div>
                  <img id="derbiLightningImg" src="/assets/images/lightning.svg" alt="Lightning" />
                `
              : ''}
            ${calculateOddsHandicap(this.match.odds)
              ? html`
                  <div>${msg('Sorpresa')} ${Icons('speedometer', 20)}</div>
                `
              : ''}
          </div>
        </div>
        <div class="teams">
          <div class="team home-team">
            <span class="team-name">Sevilla</span>
            <img width="42" height="42" src="/assets/teams/sevilla.png" alt="home logo" />
            <div class="bet-handler">
              <button class="chevron-btn" @click=${() => this._onInputHandlerClick('add', 'home')}>
                ${Icons('chevron-up', 10)}
              </button>
              <input
                tabindex="-1"
                readonly
                min="0"
                step="1"
                value="0"
                type="number"
                class="bet-input ${homeBetInputClasses}"
                id="homeInput" />
              <button
                class="chevron-btn"
                @click=${() => this._onInputHandlerClick('subtract', 'home')}>
                ${Icons('chevron-down', 10)}
              </button>
            </div>
          </div>
          <div class="team away-team">
            <div class="bet-handler">
              <button class="chevron-btn" @click=${() => this._onInputHandlerClick('add', 'away')}>
                ${Icons('chevron-up', 10)}
              </button>
              <input
                tabindex="-1"
                readonly
                min="0"
                step="1"
                value="0"
                type="number"
                class="bet-input ${awayBetInputClasses}"
                id="awayInput" />
              <button
                class="chevron-btn"
                @click=${() => this._onInputHandlerClick('subtract', 'away')}>
                ${Icons('chevron-down', 10)}
              </button>
            </div>
            <img width="42" height="42" src="/assets/teams/villareal.png" alt="away logo" />
            <span class="team-name">Villareal</span>
          </div>
        </div>
        <div class="offset-shadows">
          <div></div>
          <div></div>
        </div>
      </div>
      ${this.match.derbi || calculateOddsHandicap(this.match.odds)
        ? html`
            <div class="foot-note">
              ${this.match.derbi
                ? html`
                    <div>
                      <img
                        id="derbiLightningImg"
                        class="xs"
                        src="/assets/images/lightning.svg"
                        alt="Lightning" />
                      ${msg('¡Derbi! Bonus de +5 puntos al acertar resultado exacto')}
                    </div>
                  `
                : ''}
              ${calculateOddsHandicap(this.match.odds)
                ? html`
                    <div>
                      ${Icons('speedometer', 10)}
                      ${msg('¡Sorpresa! Bonus de puntos si empata o gana el Sevilla')}
                    </div>
                  `
                : ''}
            </div>
          `
        : ''}
    `;
  }

  static styles = [
    ResetStyles,
    MatchCardStyles,
    TypographyStyles,
    css`
      :host {
        color: var(--color-fg-default);
        display: block;
      }
    `,
  ];
}

customElements.define('rk-sb-bet-match', RkSbBetMatch);

declare global {
  interface HTMLElementTagNameMap {
    'rk-sb-bet-match': RkSbBetMatch;
  }
}
