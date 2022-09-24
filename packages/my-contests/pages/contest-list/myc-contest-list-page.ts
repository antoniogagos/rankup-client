import { Task } from '@lit-labs/task';
import { localizePath, msg, str } from '@rankup/common/i18n/localize';
import { personIcon } from '@rankup/samba/icons.js';
import buttonStyles from '@rankup/samba/styles/button-css.js';
import marginStyles from '@rankup/samba/styles/margin-css.js';
import typographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import contestCardStyles from './contest-card-css.js';

@customElement('myc-contest-list-page')
export class MycContestListPage extends LitElement {
	private _contestList = new Task(
		this,
		() => appShell.ds.GetUserTourneys(),
		() => [null],
	);

	render() {
		// <!-- <div path=${path('TOURNEY') + '/:id'} animation="opacity">Tourney Foo</div> -->
		//   <!-- <main class="mt-4 mb-3">
		//     <div class="empty-state-message mt-6">
		//       <h2>${msg('No estás participando en ninguna liga')}</h2>
		//       <div class="empty-state-buttons mt-4">
		//         <button class="btn btn--primary">
		//           ${msg('Crear liga')} ${createTourneyIcon}
		//         </button>
		//         <button class="btn btn--primary">
		//           ${msg('Unirse a una liga')} ${joinTourneyIcon}
		//         </button>
		//       </div>
		//     </div> -->
		const id = 'fj_rew';
		return html`
      <a href="${localizePath(
				msg(str`resultados/${id}/jornada`),
			)}" animation="opacity" class="contest-card" competitionId="laliga">
          <div><img src="/assets/images/laliga.svg" alt="LaLiga logo" /></div>
          <div class="contest-description">
            <div class="contest-name">The Squad Team</div>
            <span>${personIcon} 6</span>
          </div>
          <div><img src="/assets/images/gold-medal.svg" alt="Gold medal" /></div>
          <div class="offset-shadows">
            <div></div>
            <div></div>
          </div>
        </a>
        <div class="contest-card" competitionId="premier">
          <div><img src="/assets/images/premier-league.svg" alt="Premier League logo" /></div>
          <div class="contest-description">
            <div class="contest-name">Una de Premier</div>
            <span>${personIcon} 8</span>
          </div>
          <div><img src="/assets/images/silver-medal.svg" alt="Silver medal" /></div>
          <div class="offset-shadows">
            <div></div>
            <div></div>
          </div>
        </div>
        <div class="contest-card" competitionId="champions">
          <div><img src="/assets/images/champions-league.svg" alt="Champions League logo" /></div>
          <div class="contest-description">
            <div class="contest-name">Champions League</div>
            <span>${personIcon} 12</span>
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

	static styles = [
		typographyStyles,
		buttonStyles,
		contestCardStyles,
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

declare global {
	interface HTMLElementTagNameMap {
		'myc-contest-list': MycContestListPage;
	}
}
