import '../../../elements/rk-tourney-matchday/rk-tourney-matchday-live.js';
import '../../../elements/rk-tourney-matchday/rk-tourney-matchday-not-started.js';
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { Task } from '@lit-labs/task';
import { hasMatchdayStarted } from '../../../lib/utils/has-matchday-started.js';
import { ListenersController } from 'modules/lit-controllers/listeners-controller/listeners-controller.js';
import { Icons } from '../../..//authenticated-icons.js';
import type { Match } from '../../../lib/rk-data-service/api-service';
// @ts-ignore
import ResetStyles from '/samba/styles/reset.css' assert { type: 'css' };
// @ts-ignore
import linkStyles from '/samba/styles/link.css' assert { type: 'css' };
// @ts-ignore
import TypographyStyles from '/samba/styles/typography.css' assert { type: 'css' };
// @ts-ignore
import marginStyles from '/samba/styles/margin.css' assert { type: 'css' };
// @ts-ignore
import ScrollbarStyles from '/samba/styles/scrollbar.css' assert { type: 'css' };

export class RkTourneyMatchday extends LitElement {
  @property({ type: Boolean })
  hidden = true;

  shouldUpdate(): boolean {
    return !this.hidden;
  }

  private _listeners = new ListenersController(this, [
    //prettier-ignore
    [rkApp, {
      'match-update': this._onMatchUpdated.bind(this)
    }],
  ]);

  private _onMatchUpdated(evt: CustomEvent) {
    const matchUpdated = this._fixture.value.find(m => m.matchId === evt.detail.match.matchId);
    if (matchUpdated) {
      this._lastUpdate = Date.now();
    }
  }

  private _fixture = new Task(
    this,
    () => rkApp.ds.request.Matches.GetMatchdayMatches(),
    () => [this._lastUpdate],
  );

  private _lastUpdate: number = Date.now();

  render() {
    return html`
      ${this._fixture.render({
        pending: () =>
          html`
            Loading
          `,
        complete: fixture => {
          return hasMatchdayStarted(fixture)
            ? html`
                <header>
                  <button class="matchday-select f4 text-bold">
                    Jornada 20 ${Icons('chevron-down', 16)}
                  </button>
                  <div class="points text-bold">
                    <span class="points-number">85</span>
                    <span class="f6">puntos</span>
                  </div>
                </header>
                <rk-tourney-matchday-live .fixture=${fixture}></rk-tourney-matchday-live>
              `
            : html`
                <header>
                  <button class="matchday-select f4 text-bold">
                    Jornada 20 ${Icons('chevron-down', 16)}
                  </button>
                </header>
                <rk-tourney-matchday-not-started
                  .fixture=${fixture}></rk-tourney-matchday-not-started>
              `;
        },
      })}
    `;
  }

  static styles = [
    ResetStyles,
    TypographyStyles,
    ScrollbarStyles,
    css`
      :host {
        box-sizing: border-box;
        color: var(--color-fg-default);
        display: block;
        padding-bottom: 3.5rem;
        padding: 0 1.5rem;
        right: 0;
        max-width: 450px;
        margin: 0 auto;
      }
      header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin: 0 auto;
        max-width: 450px;
      }
      .points {
        margin-bottom: -1rem;
      }
      .points-number {
        font-size: 4rem;
        font-weight: bolder;
      }
      .matchday-select {
        color: var(--color-accent-fg);
        padding: 0.5rem;
      }
    `,
  ];
}

customElements.define('rk-tourney-matchday', RkTourneyMatchday);

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-matchday': RkTourneyMatchday;
  }
}
