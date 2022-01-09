import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { repeat } from 'lit/directives/repeat.js';
import { path, relativePath } from '../../../lib/localization/rk-url-paths.js';
import { Icons } from '../../../authenticated-icons.js';
import { property, query, state } from 'lit/decorators.js';
import { Task } from '@lit-labs/task';
import '/samba/toggle-input/toggle-input.js';
// @ts-ignore
import ButtonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import LinkStyles from '/samba/styles/link.css' assert { type: 'css' };
// @ts-ignore
import TypographyStyles from '/samba/styles/typography.css' assert { type: 'css' };
// @ts-ignore
import MarginStyles from '/samba/styles/margin.css' assert { type: 'css' };
// @ts-ignore
import FormControlStyles from '/samba/styles/form-control.css' assert { type: 'css' };

export class RkTourneySettings extends LitElement {
  @property({ type: Boolean })
  hidden = true;

  shouldUpdate(): boolean {
    return !this.hidden;
  }

  private _onClickGoBack() {
    history.back();
  }

  render() {
    const staticPath = path('TOURNEY') + '/fj_rew';
    return html`
      <header>
        <a id="arrow" @click=${this._onClickGoBack} class="link--primary">
          ${Icons('arrow-left', 20)}
        </a>
      </header>
      <main>
        <h1 class="text-bold">${msg('Ajustes')}</h1>
        <section>
          <p class="section-title text-bold f3 mt-6 mb-3">
            ${Icons('bell', 24)} ${msg('Notificaciones')}
          </p>
          <div class="section-list f5">
            <div class="list--item">
              <div class="list--item-block f4">
                <!-- <img
                  width="28"
                  height="28"
                  src="/assets/images/finished-match.webp"
                  alt="Finished match" /> -->
                ${msg('Partidos finalizados')}
              </div>
              <toggle-input tabindex="0"></toggle-input>
            </div>
            <div class="list--item">
              <div class="list--item-block f4">
                <!-- <img
                  width="28"
                  height="28"
                  src="/assets/images/postponed-match.webp"
                  alt="Postponed match" /> -->
                ${msg('Partidos postpuestos a punto de comenzar')}
              </div>
              <toggle-input tabindex="0"></toggle-input>
            </div>
            <div class="list--item">
              <div class="list--item-block f4">
                <!-- <img width="28" height="28" src="/assets/images/goal.webp" alt="Goal" /> -->
                ${msg('Goles en vivo')}
              </div>
              <toggle-input tabindex="0"></toggle-input>
            </div>
            <div class="list--item">
              <div class="list--item-block f4">
                <!-- <img
                  width="28"
                  height="28"
                  src="/assets/images/finished-matchday.webp"
                  alt="Finished matchday" /> -->
                ${msg('Jornada finalizada')}
              </div>
              <toggle-input tabindex="0"></toggle-input>
            </div>
            <div class="list--item">
              <div class="list--item-block f4">
                <!-- <img
                  width="28"
                  height="28"
                  src="/assets/images/new-messages.webp"
                  alt="New message" /> -->
                ${msg('Nuevos mensajes en el chat')}
              </div>
              <toggle-input tabindex="0"></toggle-input>
            </div>
          </div>
        </section>
        <div class="buttons mt-6">
          <a class="btn btn--primary btn--md" href=${staticPath + relativePath('RULES_TOURNEY')}>
            ${msg('Ver sistema de puntuación')} ${Icons('paper', 24)}
          </a>
          <button class="btn btn--primary btn--md btn--danger">
            ${msg('Abandonar torneo')} ${Icons('leave', 20)}
          </button>
        </div>
      </main>
    `;
  }

  static styles = [
    ButtonStyles,
    LinkStyles,
    TypographyStyles,
    MarginStyles,
    FormControlStyles,
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
      .section-title {
        align-items: center;
        display: flex;
        font-weight: bold;
        justify-content: flex-start;
        gap: 0.4rem;
      }
      .section-list {
        margin-right: 0.8rem;
        padding: 0 1rem;
      }
      .list--item {
        align-items: flex-start;
        display: flex;
        gap: 2rem;
        justify-content: space-between;
        margin-bottom: 1.2rem;
      }
      .list--item-block {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .buttons {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
        width: 100%;
      }
      .btn {
        width: fit-content;
      }
    `,
  ];
}

customElements.define('rk-tourney-settings', RkTourneySettings);

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-settings': RkTourneySettings;
  }
}
