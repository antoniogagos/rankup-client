import { Icons } from '../../../authenticated-icons.js';
import { calculateOddsHandicap } from '../../../lib/utils/calculate-odds-handicap.js';
import { msg } from '@lit/localize';
import type { Match } from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';
import ResetStyles from '@rankup/samba/styles/reset.css';
import MatchCardStyles from '@rankup/samba/styles/sb-bet-match-card.css';
import TypographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('rk-sb-bet-match')
export class RkSbBetMatch extends LitElement {
	@property({ attribute: false }) match?: Match;

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

	override render() {
		if (!this.match) return;
		const scheduledAt = this.match.scheduledAt ? new Date(this.match.scheduledAt) : null;
		const hasDerby = Boolean(this.match.isDerby);
		const hasUpsetOdds = calculateOddsHandicap(this.match.odds);
		return html`
			<div class="match-card f6">
				<div class="match-card-header">
					<div>${scheduledAt ? new Intl.DateTimeFormat(['ban', 'id']).format(scheduledAt) : ''}</div>
					<div class="card-header--right-content">
						${hasDerby
							? html`
								<div>${msg('Derbi')}</div>
								<img id="derbiLightningImg" src="/assets/images/lightning.svg" alt="Lightning" />
							`
							: ''}
						${hasUpsetOdds ? html` <div>${msg('Sorpresa')} ${Icons('speedometer', 20)}</div> ` : ''}
					</div>
				</div>
				<div class="teams">
					<div class="team home-team">
						<span class="team-name">Sevilla</span>
						<img width="42" height="42" src="/assets/teams/sevilla.png" alt="home logo" />
						<div class="bet-handler">
							<button class="chevron-btn" @click=${() => this._onInputHandlerClick('add', 'home')}>${Icons('chevron-up', 10)}</button>
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
							<button class="chevron-btn" @click=${() => this._onInputHandlerClick('subtract', 'home')}>${Icons('chevron-down', 10)}</button>
						</div>
					</div>
					<div class="team away-team">
						<div class="bet-handler">
							<button class="chevron-btn" @click=${() => this._onInputHandlerClick('add', 'away')}>${Icons('chevron-up', 10)}</button>
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
							<button class="chevron-btn" @click=${() => this._onInputHandlerClick('subtract', 'away')}>${Icons('chevron-down', 10)}</button>
						</div>
						<img width="42" height="42" src="/assets/teams/betis.png" alt="away logo" />
						<span class="team-name">betis</span>
					</div>
				</div>
				<div class="offset-shadows">
					<div></div>
					<div></div>
				</div>
			</div>
			${hasDerby || hasUpsetOdds
				? html`
					<div class="foot-note">
						${hasDerby
							? html`
								<div>
									<img id="derbiLightningImg" class="xs" src="/assets/images/lightning.svg" alt="Lightning" />
									${msg('¡Derbi! Bonus de +5 puntos al acertar resultado exacto')}
								</div>
							`
							: ''}
						${hasUpsetOdds ? html` <div>${Icons('speedometer', 10)} ${msg('¡Sorpresa! Bonus de puntos si empata o gana el Sevilla')}</div> ` : ''}
					</div>
				`
				: ''}
		`;
	}

	static override styles = [
		ResetStyles,
		MatchCardStyles,
		TypographyStyles,
		css`
		:host {
			color: var(--color-fg-default);
			display: block;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-sb-bet-match': RkSbBetMatch;
	}
}
