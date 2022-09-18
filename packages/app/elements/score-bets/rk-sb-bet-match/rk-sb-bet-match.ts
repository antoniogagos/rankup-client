import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import MatchCardStyles from 'samba/styles/sb-bet-match-card-css.js';
import TypographyStyles from 'samba/styles/typography-css.js';

import { Icons } from '../../../authenticated-icons.js';
import type { Match } from '../../../lib/data-service/data-service.js';
import { calculateOddsHandicap } from '../../../lib/utils/calculate-odds-handicap.js';

@customElement('rk-sb-bet-match')
export class RkSbBetMatch extends LitElement {
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
						${this.match!.derbi
							? html`
									<div>${msg('Derbi')}</div>
									<img id="derbiLightningImg" src="/assets/images/lightning.svg" alt="Lightning" />
							  `
							: ''}
						${calculateOddsHandicap(this.match.odds)
							? html` <div>${msg('Sorpresa')} ${Icons('speedometer', 20)}</div> `
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
								class="bet-input ${classMap({
									win: this._betInputVal('home') > this._betInputVal('away'),
									draw: this._betInputVal('home') === this._betInputVal('away'),
									lose: this._betInputVal('home') < this._betInputVal('away'),
								})}"
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
								class="bet-input ${classMap({
									win: this._betInputVal('away') > this._betInputVal('home'),
									draw: this._betInputVal('away') === this._betInputVal('home'),
									lose: this._betInputVal('away') < this._betInputVal('home'),
								})}"
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
		'rk-sb-bet-match': RkSbBetMatch;
	}
}
