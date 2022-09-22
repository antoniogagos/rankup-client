import { msg } from '@lit/localize';
import type { Match } from '@rankup/common/football/types';
import { chevronDownIcon, chevronUpIcon, speedometerIcon } from '@rankup/samba/icons.js';
import MatchCardStyles from '@rankup/samba/styles/sb-bet-match-card-css.js';
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

declare global {
	interface HTMLElementTagNameMap {
		'fsg-bet-match': FsgBetMatch;
	}
}
