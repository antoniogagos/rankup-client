import '../../../elements/rk-tournament-matchday/rk-tournament-matchday-live.js';
import '../../../elements/rk-tournament-matchday/rk-tournament-matchday-not-started.js';
import { Icons } from '../../../authenticated-icons.js';
import { hasMatchdayStarted } from '../../../lib/utils/has-matchday-started.js';
import { getCurrentTournamentId } from '../../../lib/utils/tournament-path.js';
import { msg } from '@lit/localize';
import { Task } from '@lit/task';
import { service } from '@rankup/platform/instantiation/browser/provider.js';
import { ITournamentMatchdaysService } from '@rankup/rankup/domains/tournaments/matchdays/contracts/tournamentMatchdays.js';
import type { Match } from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';
import ResetStyles from '@rankup/samba/styles/reset.css';
import ScrollbarStyles from '@rankup/samba/styles/scrollbar.css';
import TypographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @element rk-tournament-matchday
 */
@customElement('rk-tournament-matchday')
export class RkTournamentMatchday extends LitElement {
	@property({ type: Boolean }) override hidden = true;

	@service(ITournamentMatchdaysService) private readonly _tournamentService!: ITournamentMatchdaysService;

	@state() private _isEditingPredictions = false;

	private readonly _matchday = 20;

	private _fixture = new Task(
		this,
		() => {
			const tournamentId = getCurrentTournamentId() ?? 'tournament-1';
			return this._tournamentService.getMatchdayMatches({ tournamentId, matchday: this._matchday });
		},
		() => [],
	);

	override shouldUpdate(): boolean {
		return !this.hidden;
	}

	override render() {
		return html`
			${this._fixture.render({
				pending: () => html`<div class="matchday-state">${msg('Loading matchday', { id: 'apps.rankup.spa.pages.tournament.pages.rk.tournament.matchday.loading' })}</div>`,
				complete: fixture => this._renderFixture(fixture.items),
			})}
		`;
	}

	private _renderFixture(fixture: Match[]) {
		const hasStarted = hasMatchdayStarted(fixture);
		const isPredictionEditor = this._isEditingPredictions || this._isPredictionsModeFromUrl() || !hasStarted;
		return html`
			<header class="matchday-toolbar">
				<button class="matchday-select f4 text-bold">
					${msg('Matchday', { id: 'apps.rankup.spa.pages.tournament.pages.rk.tournament.matchday.matchday.label' })} ${this._matchday}
					${Icons('chevron-down', 16)}
				</button>
				${hasStarted && !isPredictionEditor
					? html`
						<div class="points text-bold" aria-label=${msg('85 points', { id: 'apps.rankup.spa.pages.tournament.pages.rk.tournament.matchday.points.aria' })}>
							<span class="points-number">85</span>
							<span class="points-label f6">${msg('points', { id: 'apps.rankup.spa.pages.tournament.pages.rk.tournament.matchday.points.label' })}</span>
						</div>
					`
					: ''}
			</header>
			${isPredictionEditor
				? html`<rk-tournament-matchday-not-started .fixture=${fixture}></rk-tournament-matchday-not-started>`
				: html`
					<rk-tournament-matchday-live .fixture=${fixture}></rk-tournament-matchday-live>
					<div class="matchday-actions">
						<a class="modify-predictions" href=${this._getPredictionsHref()} @click=${() => this._onModifyPredictionsClick()}>
							${msg('Modify predictions', { id: 'apps.rankup.spa.pages.tournament.pages.rk.tournament.matchday.modify.predictions' })}
							<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path d="M10.9 2.2 13.8 5.1 5.9 13H3V10.1L10.9 2.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
								<path d="M9.8 3.3 12.7 6.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
							</svg>
						</a>
					</div>
				`}
		`;
	}

	private _onModifyPredictionsClick() {
		this._isEditingPredictions = true;
	}

	private _isPredictionsModeFromUrl(): boolean {
		return new URLSearchParams(window.location.search).get('mode') === 'predictions';
	}

	private _getPredictionsHref(): string {
		return `${window.location.pathname}?mode=predictions`;
	}

	static override styles = [
		ResetStyles,
		TypographyStyles,
		ScrollbarStyles,
		css`
		:host {
			box-sizing: border-box;
			color: var(--color-fg-default);
			display: block;
			margin: 0 auto;
			max-width: 45rem;
			padding: 0 1.5rem 8rem;
			right: 0;
		}

		.matchday-toolbar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0 auto;
			max-width: 45rem;
			min-height: 4.8rem;
		}

		.points {
			align-items: baseline;
			color: #303036;
			display: flex;
			gap: 0.3rem;
			letter-spacing: 0;
			margin-top: -0.5rem;
		}

		.points-number {
			font-size: 4.1rem;
			font-weight: 800;
			line-height: 1;
		}

		.points-label {
			line-height: 1;
		}

		.matchday-select {
			color: var(--color-accent-fg);
			align-items: center;
			display: inline-flex;
			gap: 0.4rem;
			padding: 0.5rem 0;
		}

		.matchday-actions {
			display: flex;
			justify-content: flex-end;
			margin-top: 2.6rem;
		}

		.modify-predictions {
			align-items: center;
			background: #fff;
			border: 0.2rem solid #111;
			border-radius: 999px;
			box-sizing: border-box;
			color: #111;
			display: inline-flex;
			font-size: 1.4rem;
			font-weight: 800;
			gap: 1.6rem;
			min-height: 3.2rem;
			padding: 0.4rem 1.4rem 0.4rem 2.2rem;
			text-decoration: none;
		}

		.modify-predictions svg {
			flex: 0 0 auto;
		}

		.matchday-state {
			color: var(--color-fg-muted);
			font-weight: 600;
			padding-top: 2rem;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tournament-matchday': RkTournamentMatchday;
	}
}
