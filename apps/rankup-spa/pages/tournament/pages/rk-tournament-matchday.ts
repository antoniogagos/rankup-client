import '../../../elements/rk-tournament-matchday/rk-tournament-matchday-live.js';
import '../../../elements/rk-tournament-matchday/rk-tournament-matchday-not-started.js';
import { Icons } from '../../../authenticated-icons.js';
import { hasMatchdayStarted } from '../../../lib/utils/has-matchday-started.js';
import { getCurrentTournamentId } from '../../../lib/utils/tournament-path.js';
// import { msg } from '@lit/localize';
import { Task } from '@lit/task';
import { service } from '@rankup/platform/instantiation/browser/provider.js';
import { ITournamentMatchdaysService } from '@rankup/rankup/domains/tournaments/matchdays/contracts/tournamentMatchdays.js';
import ResetStyles from '@rankup/samba/styles/reset.css';
import ScrollbarStyles from '@rankup/samba/styles/scrollbar.css';
import TypographyStyles from '@rankup/samba/styles/typography.css';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('rk-tournament-matchday')
export class RkTournamentMatchday extends LitElement {
	@property({ type: Boolean }) override hidden = true;

	@service(ITournamentMatchdaysService) private readonly _tournamentService!: ITournamentMatchdaysService;

	private _fixture = new Task(
		this,
		() => {
			const tournamentId = getCurrentTournamentId() ?? 'fj_rew';
			return this._tournamentService.getMatchdayMatches({ tournamentId, matchday: 1 });
		},
		() => [],
	);

	override shouldUpdate(): boolean {
		return !this.hidden;
	}

	override render() {
		return html`
			${this._fixture.render({
				pending: () => html` Loading `,
				complete: fixture =>
					hasMatchdayStarted(fixture.items)
						? html`
							<header>
								<button class="matchday-select f4 text-bold">Jornada 20 ${Icons('chevron-down', 16)}</button>
								<div class="points text-bold">
									<span class="points-number">85</span>
									<span class="f6">puntos</span>
								</div>
							</header>
							<rk-tournament-matchday-live .fixture=${fixture.items}></rk-tournament-matchday-live>
						`
						: html`
							<header>
								<button class="matchday-select f4 text-bold">Jornada 20 ${Icons('chevron-down', 16)}</button>
							</header>
							<rk-tournament-matchday-not-started .fixture=${fixture.items}></rk-tournament-matchday-not-started>
						`,
			})}
		`;
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
			padding-bottom: 3.5rem;
			padding: 0 1.5rem;
			right: 0;
			max-width: 450px;
			margin: 0 auto;
		}

		header {
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			margin: 0 auto;
			max-width: 450px;
		}

		.points {
			margin-bottom: -1rem;
		}

		.points-number {
			font-size: 4rem;
			font-weight: bolder;
		}

		.matchday-select {
			color: var(--color-accent-fg);
			padding: 0.5rem;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-tournament-matchday': RkTournamentMatchday;
	}
}
