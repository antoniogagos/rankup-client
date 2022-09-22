import { msg } from '@lit/localize';
import { arrowLeftIcon, arrowRightIcon } from '@rankup/samba/icons.js';
import ButtonStyles from '@rankup/samba/styles/button-css.js';
import LinkStyles from '@rankup/samba/styles/link-css.js';
import MarginStyles from '@rankup/samba/styles/margin-css.js';
import TypographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

// import { path } from '../../lib/url-paths/url-paths.js';

const leagues: string[] = ['laliga', 'champions-league', 'premier-league'];
const names: { [key: string]: string } = {
	laliga: 'La Liga',
	'champions-league': 'Champions League',
	'premier-league': 'Premier League',
};

@customElement('app-create-tourney-page')
export class AppCreateTourneyPage extends LitElement {
	private _onClickGoBack() {
		window.history.back();
	}

	render() {
		return html`
			<header>
				<button id="arrow" @click=${this._onClickGoBack} class="link--primary">
					${arrowLeftIcon}
				</button>
			</header>
			<main>
				<h1 class="text-bold">${msg('Crear una liga')}</h1>
				<div class="f3 mt-5 mb-3">${msg('Escoge una competición:')}</div>
				${leagues.map(
					league => html`
						<div class="league-container f4 text-bold">
							<label for="${league}">
								<img src="/assets/images/${league}.svg" width="42" alt="league" />
								${names[league]}
							</label>
							<input type="radio" id="${league}" name="drone" .value=${league} />
						</div>
					`,
				)}
				<p class="f4 mt-5">${msg('Introduce el nombre de la liga.')}</p>
				<input class="mb-3" id="textInput" type="text" placeholder=${msg('Nombre de la liga')} />
				<button class="btn btn--primary btn--lg mt-6">
					${msg('Empezar liga')} ${arrowRightIcon}
				</button>
			</main>
		`;
	}

	static styles = [
		ButtonStyles,
		LinkStyles,
		TypographyStyles,
		MarginStyles,
		css`
			:host {
				align-items: flex-start;
				background: var(--color-canvas-default);
				box-sizing: border-box;
				color: var(--color-fg-default);
				display: flex;
				flex-direction: column;
				height: 100%;
				position: absolute;
				top: 0;
				width: 100%;
				z-index: 2;
			}
			header {
				align-items: center;
				box-sizing: border-box;
				display: flex;
				height: 6.6rem;
				justify-content: flex-start;
				padding: 2rem;
				width: 100%;
			}
			main {
				box-sizing: border-box;
				margin: 0 auto;
				max-width: 450px;
				padding: 0 2rem;
				width: 100%;
			}
			label {
				align-items: center;
				cursor: default;
				display: flex;
				gap: 0.5rem;
				pointer-events: all;
				width: 100%;
			}
			.league-container {
				align-items: center;
				background: var(--color-canvas-secondary);
				border-radius: 0.8rem;
				border: 2px solid var(--color-border-muted);
				box-sizing: border-box;
				display: flex;
				height: 4.6rem;
				justify-content: flex-start;
				margin: 1.75rem 0;
				padding: 0.5rem 1.5rem;
				width: 100%;
			}
			#textInput {
				background: none;
				box-sizing: border-box;
				color: var(--color-fg-default);
				font-family: inherit;
				font-size: 1.4rem;
				font-weight: bold;
				padding: 1rem;
				width: 100%;
				border: none;
				border-bottom: 3px solid var(--color-canvas-inverted);
			}
			#textInput::placeholder {
				color: var(--color-fg-subtle);
			}
			.btn {
				width: 100%;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-create-tourney-page': AppCreateTourneyPage;
	}
}
