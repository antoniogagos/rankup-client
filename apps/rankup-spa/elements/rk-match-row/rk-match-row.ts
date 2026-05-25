import type { Match } from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';
import MatchRowStyles from '@rankup/samba/styles/rk-match-row.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
// import { hasMatchdayStarted } from '../../lib/utils/has-matchday-started.js';

type CompactPrediction = {
	home: number;
	away: number;
};

const compactPredictionSeed: CompactPrediction[] = [
	{ home: 2, away: 0 },
	{ home: 2, away: 0 },
	{ home: 2, away: 0 },
	{ home: 2, away: 0 },
	{ home: 3, away: 1 },
	{ home: 2, away: 0 },
	{ home: 2, away: 0 },
	{ home: 2, away: 0 },
];

const compactScoreSeed: CompactPrediction[] = [
	{ home: 3, away: 1 },
	{ home: 1, away: 1 },
	{ home: 0, away: 2 },
	{ home: 0, away: 1 },
	{ home: 3, away: 1 },
	{ home: 3, away: 1 },
	{ home: 0, away: 1 },
	{ home: 0, away: 0 },
];

const compactPointsSeed = [16, 16, 16, 16, 0, 16, 16, 0];

/**
 * @element rk-match-row
 */
@customElement('rk-match-row')
export class RKMatchRow extends LitElement {
	@property({ attribute: false }) match?: Match;

	@property({ type: Number }) rowIndex = 0;

	override shouldUpdate() {
		return !!this.match;
	}

	override render() {
		if (!this.match) {
			return html``;
		}
		const score = this._getDisplayScore();
		const prediction = this._getPrediction();
		const points = this._getPoints();
		return html`
			<div class="match-row">
				<div class="team team--home">
					<span class="team-name">${this._getTeamCode(this.match.homeTeam?.shortName, this.match.homeTeam?.name, 'Home')}</span>
					<img width="30" height="30" src=${this._getTeamCrestUrl(this.match.homeTeam?.name)} alt=${this._getTeamAlt(this.match.homeTeam?.name, 'home')} />
				</div>
				<div class="result live">
					<span>${score.home}</span>
					<span class="divisor-line"></span>
					<span>${score.away}</span>
					<div class="match-time-lapsed-line"></div>
				</div>
				<div class="team team--away">
					<img width="30" height="30" src=${this._getTeamCrestUrl(this.match.awayTeam?.name)} alt=${this._getTeamAlt(this.match.awayTeam?.name, 'away')} />
					<span class="team-name">${this._getTeamCode(this.match.awayTeam?.shortName, this.match.awayTeam?.name, 'Away')}</span>
				</div>
				<div class="right-section">
					<div class="bet">
						<span>${prediction.home}</span>
						<span class="bet-divider"></span>
						<span>${prediction.away}</span>
					</div>
					<div class="points ${points > 0 ? 'positive' : 'neutral'}">${points > 0 ? `+${points}` : '0'}</div>
				</div>
			</div>
		`;
	}

	private _getDisplayScore(): CompactPrediction {
		const score = this.match?.score;
		if (score?.home !== undefined && score.away !== undefined) {
			return { home: score.home, away: score.away };
		}
		return compactScoreSeed[this.rowIndex % compactScoreSeed.length];
	}

	private _getPrediction(): CompactPrediction {
		return compactPredictionSeed[this.rowIndex % compactPredictionSeed.length];
	}

	private _getPoints(): number {
		return compactPointsSeed[this.rowIndex % compactPointsSeed.length];
	}

	private _getTeamCode(shortName: string | undefined, name: string | undefined, fallback: string): string {
		const source = shortName ?? name ?? fallback;
		return source.slice(0, 3).toUpperCase();
	}

	private _getTeamCrestUrl(name: string | undefined): string {
		const normalized = name?.toLowerCase() ?? '';
		if (normalized.includes('betis')) {
			return '/assets/teams/betis.png';
		}
		if (normalized.includes('sevilla')) {
			return '/assets/teams/sevilla.png';
		}
		return '/assets/images/rk-logo-with-bg.svg';
	}

	private _getTeamAlt(name: string | undefined, fallback: string): string {
		return `${name ?? fallback} logo`;
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
