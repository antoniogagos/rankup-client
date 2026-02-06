import type { Match } from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';
import MatchRowStyles from '@rankup/samba/styles/rk-match-row.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// import { hasMatchdayStarted } from '../../lib/utils/has-matchday-started.js';

@customElement('rk-match-row')
export class RKMatchRow extends LitElement {
	@property({ attribute: false }) match?: Match;

	override shouldUpdate() {
		return !!this.match;
	}

	override render() {
		if (!this.match) {
			return html``;
		}
		const score = this.match.score;
		const hasScore = score?.home !== undefined && score?.away !== undefined;
		const scheduledAt = this.match.scheduledAt ? new Date(this.match.scheduledAt) : null;
		return html`
			<div class="match-row">
				<div class="left-section">
					<div class="team home">
						<span class="team-name">${this.match.homeTeam?.shortName ?? 'Home'}</span>
						<img width="24" height="24" src="/assets/teams/sevilla.png" alt="home logo" />
					</div>
					<div class="result ${hasScore ? 'live' : 'not-started'}">
						${hasScore
							? html`
								<span>${score?.home ?? 0}</span>
								<span class="divisor-line"></span>
								<span>${score?.away ?? 0}</span>
								<div class="match-time-lapsed-line"></div>
							`
							: html`
								<div>${scheduledAt ? scheduledAt.toLocaleDateString(undefined, { weekday: 'short' }) : '—'}</div>
								<div>${scheduledAt ? scheduledAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—'}</div>
							`}
					</div>
					<div class="team away">
						<img width="24" height="24" src="/assets/teams/betis.png" alt="away logo" />
						<span class="team-name">${this.match.awayTeam?.shortName ?? 'Away'}</span>
					</div>
				</div>
				<div class="right-section">
					<div class="bet">${Math.floor(Math.random() * (4 - 0 + 1) + 0)}-${Math.floor(Math.random() * (4 - 0 + 1) + 0)}</div>
					${hasScore ? html` <div class="points positive">+12</div> ` : ''}
				</div>
			</div>
		`;
	}

	static override styles = [
		MatchRowStyles,
		css`
		:host {
			display: block;
			width: 100%;
			background-color: var(--color-canvas-secondary);
			color: var(--color-fg-default);
			border-radius: 0.8rem;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-match-row': RKMatchRow;
	}
}
