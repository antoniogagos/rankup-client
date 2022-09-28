import { contextProvided } from '@lit-labs/context';
import { Task } from '@lit-labs/task';
import { routerContext, RoutesController } from '@rankup/common/contexts/main-router-context.js';
import { personIcon } from '@rankup/samba/icons.js';
import buttonsStyles from '@rankup/samba/styles/buttons-css.js';
import marginStyles from '@rankup/samba/styles/margin-css.js';
import typographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import contestCardStyles from './contest-card-css.js';

@customElement('myc-contest-list-page')
export class MycContestListPage extends LitElement {
	@contextProvided({ context: routerContext })
	router!: RoutesController;

	contestId?: string = 'fj_rew';

	private _contestList = new Task(
		this,
		async () => appShell.ds.GetUserTourneys(),
		() => [null],
	);

	private _renderContests(/* _contestList: any[] */) {
		return html`
			<a
				href=${this.router.link('resultados', { '*': this.contestId })}
				animation="opacity"
				class="contest-card"
				competitionId="laliga">
				<div><img width="79" height="79" src="/assets/images/laliga.svg" alt="LaLiga logo" /></div>
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
				<div>
					<img
						width="79"
						height="79"
						src="/assets/images/premier-league.svg"
						alt="Premier League logo" />
				</div>
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
				<div>
					<img
						width="79"
						height="79"
						src="/assets/images/champions-league.svg"
						alt="Champions League logo" />
				</div>
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
		`;
	}

	render() {
		return html`
			${this._contestList.render({
				complete: (/* value */) => this._renderContests(/* value */),
				pending: () =>
					html`<img class="loading" src="/assets/images/rk-logo-splash.svg" alt="Rankup logo" />`,
				// "error": () => msg('There was an error loading contests')
			})}
		`;
	}

	static styles = [
		typographyStyles,
		buttonsStyles,
		contestCardStyles,
		marginStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 3rem;
				margin-top: 1rem;
			}
			.loading {
				bottom: 0;
				left: 0;
				margin: 0 auto;
				max-width: 32.4rem;
				position: absolute;
				right: 0;
				width: 100%;
				z-index: 0;
				top: 0;
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
