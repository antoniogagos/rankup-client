import { LitElement, html, css } from 'lit';
import { msg } from '@lit/localize';
import { property, state } from 'lit/decorators.js';
import { Task, TaskStatus } from '@lit-labs/task';
import { Icons } from '../../authenticated-icons.js';
import { AppPaths, path } from '../../lib/localization/rk-url-paths.js';
import { appRouterAnimations } from '../../router-animations.js';
// @ts-ignore
import resetStyles from '/samba/styles/reset.css' assert { type: 'css' };
// @ts-ignore
import buttonStyles from '/samba/styles/button.css' assert { type: 'css' };
// @ts-ignore
import tourneyCardStyles from '/samba/styles/tourney-card.css' assert { type: 'css' };
// @ts-ignore
import typographyStyles from '/samba/styles/typography.css' assert { type: 'css' };
// @ts-ignore
import marginStyles from '/samba/styles/margin.css' assert { type: 'css' };

export class RkTourneyList extends LitElement {
  private _tourneys = new Task(
    this,
    () => rkApp.ds.GetUserTourneys(),
    () => [null],
  );

  render() {
    // <!-- <div path=${path('TOURNEY') + '/:id'} animation="opacity">Tourney Foo</div> -->
    //   <!-- <main class="mt-4 mb-3">
    //     <div class="empty-state-message mt-6">
    //       <h2>${msg('No estás participando en ninguna liga')}</h2>
    //       <div class="empty-state-buttons mt-4">
    //         <button class="btn btn--primary">
    //           ${msg('Crear liga')} ${Icons('create-tourney', 18)}
    //         </button>
    //         <button class="btn btn--primary">
    //           ${msg('Unirse a una liga')} ${Icons('join-tourney', 18)}
    //         </button>
    //       </div>
    //     </div> -->
    return html`

        <a href="${path(
          'TOURNEY',
          `fj_rew/${AppPaths.MATCHDAY}`,
        )}" animation="opacity" class="tourney-card" competitionId="laliga">
          <div><img src="/assets/images/laliga.svg" alt="LaLiga logo" /></div>
          <div class="tourney-description">
            <div class="tourney-name">The Squad Team</div>
            <span>${Icons('person', 10)} 6</span>
          </div>
          <div><img src="/assets/images/gold-medal.svg" alt="Gold medal" /></div>
          <div class="offset-shadows">
            <div></div>
            <div></div>
          </div>
        </a>
        <div class="tourney-card" competitionId="premier">
          <div><img src="/assets/images/premier-league.svg" alt="Premier League logo" /></div>
          <div class="tourney-description">
            <div class="tourney-name">Una de Premier</div>
            <span>${Icons('person', 10)} 8</span>
          </div>
          <div><img src="/assets/images/silver-medal.svg" alt="Silver medal" /></div>
          <div class="offset-shadows">
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="tourney-card" competitionId="champions">
          <div><img src="/assets/images/champions-league.svg" alt="Champions League logo" /></div>
          <div class="tourney-description">
            <div class="tourney-name">Champions League</div>
            <span>${Icons('person', 10)} 12</span>
          </div>
          <div><img src="/assets/images/silver-medal.svg" alt="Silver medal" /></div>
          <div class="offset-shadows">
            <div></div>
            <div></div>
          </div>
        </div>
      </main>
      <img id="RkLogoSplash" src="/assets/images/rk-logo-splash.svg" alt="Rankup logo" />
    `;
  }
  //  ${this._tourneys.render({
  //   pending: () => html``,
  //   complete: this.renderTourneys
  // })}

  static styles = [
    resetStyles,
    typographyStyles,
    buttonStyles,
    tourneyCardStyles,
    marginStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;
        margin-top: 3rem;
      }
      main {
        align-items: center;
        background: var(--color-header-bg);
        box-sizing: border-box;
        color: var(--color-header-text);
        display: flex;
        flex-direction: column;
        gap: 3.5rem;
        justify-content: space-between;
        width: 100%;
        z-index: 2;
        height: 100%;
      }
      #RkLogoSplash {
        bottom: 0;
        left: 0;
        margin: 0 auto;
        max-width: 32.4rem;
        position: absolute;
        right: 0;
        width: 100%;
        z-index: 0;
      }
      .empty-state-message {
        align-items: center;
        display: flex;
        flex-direction: column;
      }
      .empty-state-message h2 {
        max-width: 30rem;
        text-align: center;
      }
      .empty-state-buttons {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        justify-content: center;
      }
    `,
  ];
}

customElements.define('rk-tourney-list', RkTourneyList);

declare global {
  interface HTMLElementTagNameMap {
    'rk-tourney-list': RkTourneyList;
  }
}
