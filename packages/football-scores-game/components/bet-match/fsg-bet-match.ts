import type { Match } from '@rankup/common/football/types';
import { msg } from '@rankup/common/i18n/localize.js';
import { chevronDownIcon, chevronUpIcon, speedometerIcon } from '@rankup/samba/icons.js';
import TypographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { calculateOddsHandicap } from '../../lib/utils/calculate-odds-handicap.js';

@customElement('fsg-bet-match')
export class FsgBetMatch extends LitElement {
	@property({ attribute: false })
	match?: Match;

	private _onInputHandlerClick(operation: string, side: string) {
		const inputId = `#${side}Input`;
		const input = this.shadowRoot!.querySelector(inputId) as HTMLInputElement;
		if (operation === 'add') {
			input.stepUp();
		} else {
			input.stepDown();
		}
		this.requestUpdate();
	}

	private _betInputVal(side: string): number {
		const inputId = `#${side}Input`;
		const input = this.shadowRoot?.querySelector(inputId) as HTMLInputElement;
		return Number(input?.value);
	}

	render() {
		if (!this.match) return;
		return html`
			<div class="match-card f6">
				<div class="match-card-header">
					<div>${new Intl.DateTimeFormat(['ban', 'id']).format(this.match?.date)}</div>
					<div class="card-header--right-content">
						${this.match!.derby
							? html`
									<div>${msg('derby')}</div>
									<img id="derbyLightningImg" src="/assets/images/lightning.svg" alt="Lightning" />
							  `
							: ''}
						${calculateOddsHandicap(this.match.odds)
							? html` <div>${msg('Sorpresa')} ${speedometerIcon}</div> `
							: ''}
					</div>
				</div>
				<div class="teams">
					<div class="team home-team">
						<span class="team-name">Sevilla</span>
						<img width="42" height="42" src="/assets/teams/sevilla.png" alt="home logo" />
						<div class="bet-handler">
							<button class="chevron-btn" @click=${() => this._onInputHandlerClick('add', 'home')}>
								${chevronUpIcon}
							</button>
							<input
								tabindex="-1"
								readonly
								min="0"
								step="1"
								value="0"
								type="number"
								class="bet-input ${classMap({
									win: this._betInputVal('home') > this._betInputVal('away'),
									draw: this._betInputVal('home') === this._betInputVal('away'),
									lose: this._betInputVal('home') < this._betInputVal('away'),
								})}"
								id="homeInput" />
							<button
								class="chevron-btn"
								@click=${() => this._onInputHandlerClick('subtract', 'home')}>
								${chevronDownIcon}
							</button>
						</div>
					</div>
					<div class="team away-team">
						<div class="bet-handler">
							<button class="chevron-btn" @click=${() => this._onInputHandlerClick('add', 'away')}>
								${chevronUpIcon}
							</button>
							<input
								tabindex="-1"
								readonly
								min="0"
								step="1"
								value="0"
								type="number"
								class="bet-input ${classMap({
									win: this._betInputVal('away') > this._betInputVal('home'),
									draw: this._betInputVal('away') === this._betInputVal('home'),
									lose: this._betInputVal('away') < this._betInputVal('home'),
								})}"
								id="awayInput" />
							<button
								class="chevron-btn"
								@click=${() => this._onInputHandlerClick('subtract', 'away')}>
								${chevronDownIcon}
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
			${this.match.derby || calculateOddsHandicap(this.match.odds)
				? html`
						<div class="foot-note">
							${this.match.derby
								? html`
										<div>
											<img
												id="derbyLightningImg"
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
											${speedometerIcon}
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
		TypographyStyles,
		css`
			:host {
				color: var(--color-fg-default);
				display: block;
			}
			.match-card {
				background-color: rgb(231, 237, 244);
				border-radius: 1.5rem;
				box-sizing: border-box;
				color: var(--color-fg-default);
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
				height: 13rem;
				justify-content: space-between;
				margin: 0 auto;
				max-width: 45rem;
				padding: 1rem 2rem;
				position: relative;
				width: 100%;
				user-select: none;
			}

			.card-header--right-content {
				align-items: center;
				display: flex;
				font-weight: 600;
				color: var(--color-attention-emphasis);
			}

			.card-header--right-content > div {
				display: flex;
				align-items: center;
				flex-direction: row;
				gap: 0.4rem;
			}

			.match-card-header {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				width: 100%;
			}

			.teams {
				align-items: center;
				display: flex;
				flex: 1 1 0%;
				gap: 1.5rem;
				justify-content: center;
				width: 100%;
			}

			.team {
				align-items: center;
				display: flex;
				flex: 1 1 0%;
				gap: 1rem;
				height: 100%;
				justify-content: space-between;
			}

			.team-name {
				font-weight: 700;
				font-size: 1.4rem;
			}

			.teams .away-team {
				text-align: right;
			}

			.bet-handler {
				align-items: center;
				display: grid;
				grid-template-rows: auto 3rem auto;
				height: 100%;
			}

			.bet-input {
				background-color: var(--color-canvas-muted);
				border-radius: 2rem;
				border: none;
				box-sizing: border-box;
				color: var(--color-fg-subtle);
				font-weight: 600;
				height: 3.5rem;
				text-align: center;
				width: 3.5rem;
				font-size: 1.8rem;
				cursor: default;
			}

			.bet-input:focus {
				outline: none;
			}

			.bet-input[type='number']::-webkit-inner-spin-button,
			.bet-input[type='number']::-webkit-outer-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}

			.bet-input.win {
				color: var(--var-fg-default);
				background-color: #d1ecd3;
				/* color: #007b3f; */
			}

			.bet-input.draw {
				color: var(--var-fg-default);
				background-color: #d1e2ec;
				/* color: #35779c; */
			}

			.bet-input.lose {
				color: var(--var-fg-default);
				background-color: #ffdbdc;
				/* color: #c50000; */
			}

			.foot-note {
				color: var(--color-fg-subtle);
				font-size: 1.1rem;
				font-weight: 600;
				margin: 0 auto;
				margin-top: 1.25rem;
				max-width: 45rem;
				padding: 0.2rem 0.5rem;
			}

			.foot-note > div {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				padding: 0rem 0.25rem;
			}

			.chevron-btn {
				display: flex;
				justify-content: center;
				color: var(--color-fg-muted);
			}

			#derbyLightningImg {
				height: 2rem;
				width: 1.4rem;
			}

			#derbyLightningImg.xs {
				height: 1.5rem;
				width: 10px;
			}

			.offset-shadows > div {
				position: absolute;
				height: 6px;
				border-bottom-left-radius: 4rem;
				border-bottom-right-radius: 4rem;
				left: 0;
				right: 0;
				margin: auto;
			}

			.offset-shadows div:first-child {
				width: 90%;
				bottom: -0.5rem;
				background: rgb(238, 242, 246);
			}

			.offset-shadows div:last-child {
				width: 70%;
				bottom: -1rem;
				background: rgb(241, 245, 248);
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-bet-match': FsgBetMatch;
	}
}
