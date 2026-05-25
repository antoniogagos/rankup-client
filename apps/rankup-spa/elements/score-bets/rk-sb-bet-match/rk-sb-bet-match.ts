import { Icons } from '../../../authenticated-icons.js';
import { msg } from '@lit/localize';
import type { Match } from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';
import ResetStyles from '@rankup/samba/styles/reset.css';
import MatchCardStyles from '@rankup/samba/styles/sb-bet-match-card.css';
import TypographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * @element rk-sb-bet-match
 */
@customElement('rk-sb-bet-match')
export class RkSbBetMatch extends LitElement {
	@property({ attribute: false }) match?: Match;

	@state() private _homePrediction = 1;

	@state() private _awayPrediction = 1;

	private _onInputHandlerClick(operation: 'add' | 'subtract', side: 'home' | 'away', evt: Event) {
		evt.stopPropagation();
		const delta = operation === 'add' ? 1 : -1;
		if (side === 'home') {
			this._homePrediction = Math.max(0, this._homePrediction + delta);
		} else {
			this._awayPrediction = Math.max(0, this._awayPrediction + delta);
		}
	}

	private _betInputVal(side: string): number {
		return side === 'home' ? this._homePrediction : this._awayPrediction;
	}

	override render() {
		if (!this.match) return;
		const scheduledAt = this.match.scheduledAt ? new Date(this.match.scheduledAt) : null;
		const hasDerby = Boolean(this.match.isDerby);
		const homeName = this.match.homeTeam?.name ?? 'Home';
		const awayName = this.match.awayTeam?.name ?? 'Away';
		return html`
			<div class="match-card f6">
				<div class="match-card-header">
					<div>${this._formatScheduleLabel(scheduledAt)}</div>
					<div class="card-header--right-content">
						${hasDerby
							? html`
								<div class="match-badge match-badge--derby">
									<span class="warning-mark" aria-hidden="true"></span>
									${msg('Derby', { id: 'apps.rankup.spa.elements.score.bets.rk.sb.bet.match.derby.badge' })}
								</div>
							`
							: ''}
					</div>
				</div>
				<div class="teams">
					<div class="team home-team">
						<span class="team-name">${homeName}</span>
						<img width="42" height="42" src=${this._getTeamCrestUrl(homeName)} alt=${this._getTeamAlt(homeName)} />
						<div class="bet-handler">
							<button class="chevron-btn" aria-label=${msg('Increase home prediction', { id: 'apps.rankup.spa.elements.score.bets.rk.sb.bet.match.home.increase' })} @click=${(evt: Event) => this._onInputHandlerClick('add', 'home', evt)}>${Icons('chevron-up', 10)}</button>
							<div
								class="bet-input ${classMap({
									win: this._betInputVal('home') > this._betInputVal('away'),
									draw: this._betInputVal('home') === this._betInputVal('away'),
									lose: this._betInputVal('home') < this._betInputVal('away'),
								})}"
								id="homeInput">${this._homePrediction}</div>
							<button class="chevron-btn" aria-label=${msg('Decrease home prediction', { id: 'apps.rankup.spa.elements.score.bets.rk.sb.bet.match.home.decrease' })} @click=${(evt: Event) => this._onInputHandlerClick('subtract', 'home', evt)}>${Icons('chevron-down', 10)}</button>
						</div>
					</div>
					${hasDerby ? html`<div class="derby-bolt" aria-hidden="true"></div>` : ''}
					<div class="team away-team">
						<div class="bet-handler">
							<button class="chevron-btn" aria-label=${msg('Increase away prediction', { id: 'apps.rankup.spa.elements.score.bets.rk.sb.bet.match.away.increase' })} @click=${(evt: Event) => this._onInputHandlerClick('add', 'away', evt)}>${Icons('chevron-up', 10)}</button>
							<div
								class="bet-input ${classMap({
									win: this._betInputVal('away') > this._betInputVal('home'),
									draw: this._betInputVal('away') === this._betInputVal('home'),
									lose: this._betInputVal('away') < this._betInputVal('home'),
								})}"
								id="awayInput">${this._awayPrediction}</div>
							<button class="chevron-btn" aria-label=${msg('Decrease away prediction', { id: 'apps.rankup.spa.elements.score.bets.rk.sb.bet.match.away.decrease' })} @click=${(evt: Event) => this._onInputHandlerClick('subtract', 'away', evt)}>${Icons('chevron-down', 10)}</button>
						</div>
						<img width="42" height="42" src=${this._getTeamCrestUrl(awayName)} alt=${this._getTeamAlt(awayName)} />
						<span class="team-name">${awayName}</span>
					</div>
				</div>
				<div class="offset-shadows">
					<div></div>
					<div></div>
				</div>
			</div>
			${hasDerby
				? html`
					<div class="foot-note">
						<div>
							<span class="warning-mark xs" aria-hidden="true"></span>
							${msg('Derby! Exact result has a bonus of +5 points', { id: 'apps.rankup.spa.elements.score.bets.rk.sb.bet.match.derby.footnote' })}
						</div>
					</div>
				`
				: ''}
		`;
	}

	private _formatScheduleLabel(date: Date | null): string {
		if (!date) {
			return '';
		}
		const now = new Date();
		const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
		const startOfMatchDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
		const dayOffset = Math.round((startOfMatchDay - startOfToday) / 86400000);
		const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
		if (dayOffset === 0) {
			return `${msg('Today', { id: 'apps.rankup.spa.elements.score.bets.rk.sb.bet.match.today' })} ${time}`;
		}
		if (dayOffset === 1) {
			return `${msg('Tomorrow', { id: 'apps.rankup.spa.elements.score.bets.rk.sb.bet.match.tomorrow' })} ${time}`;
		}
		return `${date.toLocaleDateString('en-GB', { weekday: 'long' })} ${time}`;
	}

	private _getTeamCrestUrl(name: string): string {
		const normalized = name.toLowerCase();
		if (normalized.includes('betis')) {
			return '/assets/teams/betis.png';
		}
		if (normalized.includes('sevilla')) {
			return '/assets/teams/sevilla.png';
		}
		return '/assets/images/rk-logo-with-bg.svg';
	}

	private _getTeamAlt(name: string): string {
		return `${name} logo`;
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
