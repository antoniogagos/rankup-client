import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { path } from '../../../lib/localization/rk-url-paths.js';
import { Icons } from '../../../authenticated-icons.js';
import { property, state } from 'lit/decorators.js';
import { Task } from '@lit-labs/task';
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import linkStyles from '/samba/styles/link.css' assert { type: 'css' };
// @ts-ignore
import typographyStyles from '/samba/styles/typography.css' assert { type: 'css' };
// @ts-ignore
import marginStyles from '/samba/styles/margin.css' assert { type: 'css' };

interface UserRanking {
  position: number;
  points: number;
  user: { userId: string; username: string; picture?: string };
}

export enum RankingType {
  SEASON = 1,
  MATCHDAY,
}

/*
 * @fires selected-ranking-changed
 */
export class RkTourneyRanking extends LitElement {
  // @property({ type: Boolean })
  // hidden = true;

  // shouldUpdate(): boolean {
  //   return !this.hidden;
  // }

  @property({ type: Number })
  selectedRanking = RankingType.SEASON;

  private _ranking = new Task(
    this,
    () => rkApp.ds.request.Tourneys.GetRanking(),
    () => [null],
  );

  private _onSelectRankingClick(evt: MouseEvent) {
    const selectedRanking = (evt.target as HTMLButtonElement).getAttribute('name');
    this.selectedRanking = Number(selectedRanking);
    this.dispatchEvent(
      new CustomEvent('selected-ranking-changed', {
        detail: { selectedRanking: Number(selectedRanking) },
      }),
    );
  }

  private _renderRankingRow(user: UserRanking) {
    const medals = [null, 'gold-medal.svg', 'silver-medal.svg', 'bronze-medal.svg'];
    return html`
      <div class="row">
        <img class="avatar" src="/assets/avatars/${user.user.picture}" alt="Avatar" />
        <div class="username">${user.user.username}</div>
        <div class="position">
          ${medals[user.position]
            ? html`
                <img
                  width="36"
                  height="36"
                  src="/assets/images/${medals[user.position]}"
                  alt="Player position ${user.position}" />
              `
            : html`
                <span class="text-bold">${user.position}</span>
              `}
        </div>
        <div class="points">${user.points}</div>
      </div>
    `;
  }

  private _renderRanking(ranking: UserRanking[]) {
    if (this.selectedRanking === RankingType.SEASON) {
      const winner = ranking.slice(0, 1)[0];
      const winnerAvatarHref = `/assets/avatars/${winner.user.picture}`;
      const winnerBackgroundGradient = `linear-gradient(
        0deg,
        rgba(4, 138, 123, 0.80) 0%,
        rgba(0, 104, 87, 0.80) 100%
      )`;
      return html`
        <div class="row-season-winner f1 text-bold">
          <div
            class="row-season-winner-bg"
            style="background-image: ${winnerBackgroundGradient}, url(${winnerAvatarHref})"></div>
          ${this._renderRankingRow(winner)}
        </div>
        <div class="ranking-without-winner">
          ${ranking.slice(1, ranking.length).map(user => this._renderRankingRow(user))}
        </div>
      `;
    } else {
      return ranking.map(user => this._renderRankingRow(user));
    }
  }

  render() {
    return html`
      <div class="main">
        <div class="ranking">
          ${this._ranking.render({
            pending: () => html``,
            complete: ranking => this._renderRanking(ranking),
          })}
        </div>
        <div class="buttons mb-3" @click=${this._onSelectRankingClick}>
          <button
            class="btn btn--primary btn--md f4"
            name=${RankingType.SEASON}
            ?selected=${this.selectedRanking === RankingType.SEASON}>
            ${msg('Temporada')}
          </button>
          <button
            class="btn btn--primary btn--md f4 matchday-btn"
            name=${RankingType.MATCHDAY}
            ?selected=${this.selectedRanking === RankingType.MATCHDAY}>
            ${msg('Jornada 8')}
            <span id="chevron">${Icons('chevron-down', 10)}</span>
          </button>
        </div>
      </div>
    `;
  }

  static styles = [
    buttonStyles,
    linkStyles,
    typographyStyles,
    marginStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      .main {
        align-items: center;
        background: var(--color-canvas-default);
        color: var(--color-fg-default);
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        display: grid;
        grid-template-rows: 1fr max-content;
      }
      .row {
        width: 100%;
        display: grid;
        grid-template-areas: 'position avatar username points';
        grid-template-columns: 36px 45px auto 50px;
        padding: 1rem 2rem;
        box-sizing: border-box;
        align-items: center;
        grid-column-gap: 2rem;
      }
      .row-season-winner {
        align-items: flex-end;
        color: var(--color-season-winner-text);
        display: flex;
        height: 20.5rem;
        position: absolute;
        text-shadow: 0px 1px 0px hsl(0deg 0% 0% / 14%);
        top: 0px;
        width: 100%;
        font-weight: bold;
      }
      .row-season-winner .row {
        z-index: 1;
      }
      .row-season-winner-bg {
        width: 100%;
        height: 100%;
        background-position: top;
        position: absolute;
        z-index: 0;
        background-size: cover;
      }
      /* row season winner + rk-tourney-header height */
      .ranking-without-winner {
        padding-top: calc(20.5rem - 6.6rem);
      }
      .position {
        grid-area: position;
        text-align: center;
      }
      .avatar {
        grid-area: avatar;
      }
      .username {
        grid-area: username;
        text-align: left;
      }
      .points {
        grid-area: points;
        text-align: right;
      }
      .buttons {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
        justify-content: center;
      }
      .buttons button {
        color: var(--color-fg-muted);
        border-color: var(--color-border-subtle);
      }
      .buttons [selected] {
        color: var(--color-scale-green-6);
        background-color: var(--color-scale-green-0);
        border-color: var(--color-scale-green-6);
      }
      .matchday-btn {
        position: relative;
      }
      #chevron {
        position: absolute;
        right: 20px;
      }
    `,
  ];
}

customElements.define('rk-tourney-ranking', RkTourneyRanking);

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-ranking': RkTourneyRanking;
  }
}
