import type { Match } from '@rankup/common/football/types';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('fsg-match-row')
export class FsgMatchRow extends LitElement {
	@property({ attribute: false })
	match?: Match;

	shouldUpdate() {
		return !!this.match;
	}

	render() {
		return html`
			<div class="match-row">
				<div class="left-section">
					<div class="team home">
						<span class="team-name">Sev</span>
						<img width="32" height="32" src="/assets/teams/sevilla.png" alt="home logo" />
					</div>
					<div class="result ${this.match!.result ? 'live' : 'not-started'}">
						${this.match!.result
							? html`
									<span>${this.match!.result?.split('-')[0]}</span>
									<span class="divisor-line"></span>
									<span>${this.match!.result?.split('-')[1]}</span>
									<div class="match-time-lapsed-line"></div>
							  `
							: html`
									<div>Sab</div>
									<div>14:00</div>
							  `}
					</div>
					<div class="team away">
						<img width="32" height="32" src="/assets/teams/villareal.png" alt="away logo" />
						<span class="team-name">Vil</span>
					</div>
				</div>
				<div class="right-section">
					<div class="bet">
						${Math.floor(Math.random() * (4 - 0 + 1) + 0)}-${Math.floor(
							Math.random() * (4 - 0 + 1) + 0,
						)}
					</div>
					${this.match!.result ? html` <div class="points positive">+12</div> ` : ''}
				</div>
			</div>
		`;
	}

	static styles = [
		css`
			:host {
				display: block;
				width: 100%;
				background-color: var(--color-canvas-secondary);
				color: var(--color-fg-default);
				border-radius: 0.8rem;
			}

			.match-row {
				align-items: center;
				box-shadow: 0 1px 1px rgb(0 0 0 / 4%);
				box-sizing: border-box;
				display: flex;
				height: 4.8rem;
				justify-content: space-between;
				padding: 0.4rem 1rem;
			}

			.left-section,
			.team {
				align-items: center;
				display: flex;
				gap: 1rem;
			}

			.result {
				width: 4.5rem;
				position: relative;
			}

			.result .divisor-line {
				height: calc(100% - 0.4rem);
				width: 2px;
				background: #374060;
			}

			.result.live {
				padding: 0.2rem;
				font-weight: bold;
				align-items: center;
				background: rgb(45, 52, 80);
				border-radius: 0.3rem;
				box-sizing: border-box;
				color: rgb(255, 255, 255, 0.95);
				display: flex;
				gap: 0.5rem;
				justify-content: center;
			}

			.result.not-started {
				text-align: center;
				font-size: 1.2rem;
				color: var(--color-fg-subtle);
			}

			.points {
				border-radius: 0.4rem;
				box-sizing: border-box;
				padding: 0.2rem;
				position: absolute;
				right: 3rem;
				width: 4.5rem;
				text-align: center;
			}

			.points.positive {
				background-color: #d1ecd3;
				color: #007b3f;
				font-weight: bold;
			}

			.team-name {
				text-transform: uppercase;
				font-size: 1.2rem;
				font-weight: 600;
				color: var(--color-fg-muted);
			}

			.match-time-lapsed-line {
				position: absolute;
				bottom: -0.05rem;
				left: 0;
				width: 70%;
				height: 2px;
				background: #00eb00;
				border-radius: 0.3rem;
			}

			.right-section {
				align-items: center;
				display: flex;
				gap: 1rem;
			}

			.bet {
				align-items: center;
				background: rgb(246, 249, 254);
				border-radius: 0.3rem;
				box-sizing: border-box;
				color: rgb(57 79 116);
				display: flex;
				font-weight: bold;
				gap: 0.5rem;
				justify-content: center;
				padding: 0.2rem;
				position: absolute;
				right: 8.5rem;
				width: 4.5rem;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-match-row': FsgMatchRow;
	}
}
