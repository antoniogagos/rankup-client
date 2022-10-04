import '../../components/matchday/fsg-matchday-live.js';
import '../../components/matchday/fsg-matchday-not-started.js';

import { Task } from '@lit-labs/task';
import { eventListener } from '@rankup/common/decorators/event-listener.js';
import type { Match } from '@rankup/common/football/types';
import { chevronDownIcon } from '@rankup/samba/icons.js';
import buttonsCss from '@rankup/samba/styles/buttons-css.js';
import ScrollbarCss from '@rankup/samba/styles/scrollbar-css.js';
import TypographyCss from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { hasMatchdayStarted } from '../../lib/utils/has-matchday-started.js';

@customElement('fsg-matchday-page')
export class FsgMatchdayPage extends LitElement {
	@property({ type: Boolean })
	hidden = true;

	// shouldUpdate(): boolean {
	// 	return !this.hidden;
	// }

	// private _listeners = new EventsListenerController(this, {
	// 	'match-update': this._onMatchUpdated.bind(this),
	// });

	private _fixture: Task<number[], Match[]> = new Task(
		this,
		() => /* appShell.ds.GetMatchdayMatches() */ [],
		() => [this._lastUpdate],
	);

	private _lastUpdate: number = Date.now();

	@eventListener({ eventName: 'match-update' })
	_onMatchUpdated(evt: CustomEvent) {
		const matchUpdated = this._fixture.value?.find(m => m.matchId === evt.detail.match.matchId);
		if (matchUpdated) {
			this._lastUpdate = Date.now();
		}
	}

	render() {
		return html`
			${this._fixture.render({
				pending: () => html` Loading `,
				complete: fixture =>
					hasMatchdayStarted(fixture)
						? html`
								<header>
									<button class="matchday-select f4 text-bold">
										Jornada 20 ${chevronDownIcon}
									</button>
									<div class="points text-bold">
										<span class="points-number">85</span>
										<span class="f6">puntos</span>
									</div>
								</header>
								<fsg-matchday-live .fixture=${fixture}></fsg-matchday-live>
						  `
						: html`
								<header>
									<button class="matchday-select f4 text-bold">
										Jornada 20 ${chevronDownIcon}
									</button>
								</header>
								<fsg-matchday-not-started .fixture=${fixture}></fsg-matchday-not-started>
						  `,
			})}
		`;
	}

	static styles = [
		buttonsCss,
		TypographyCss,
		ScrollbarCss,
		css`
			:host {
				display: flex;
				align-items: flex-start;
				flex-direction: column;
				padding: 0 2rem;
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
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-matchday-page': FsgMatchdayPage;
	}
}
