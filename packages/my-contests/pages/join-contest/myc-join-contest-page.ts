import { msg } from '@rankup/common/i18n/localize.js';
import { arrowLeftIcon, arrowRightIcon } from '@rankup/samba/icons.js';
import ButtonStyles from '@rankup/samba/styles/button-css.js';
// import FormControlStyles from '@rankup/samba/styles/form-control-css.js';
import LinkStyles from '@rankup/samba/styles/link-css.js';
import MarginStyles from '@rankup/samba/styles/margin-css.js';
import TypographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

@customElement('myc-join-contest-page')
export class MycJoinContestPage extends LitElement {
	private _onGoBackClick() {
		window.history.back();
	}

	private _onGoBackKeydown() {
		//
	}

	render() {
		return html`
			<header>
				<button
					id="arrow"
					@click=${this._onGoBackClick}
					@keydown=${this._onGoBackKeydown}
					class="link--primary">
					${arrowLeftIcon}
				</button>
			</header>
			<main>
				<h1 class="text-bold">${msg('Unirse a un torneo')}</h1>
				<p class="f3 mt-4 mb-4">
					${msg('Introduce el código de invitación del torneo al que quieras unirte.')}
				</p>
				<input
					class="mb-3"
					id="textInput"
					type="text"
					placeholder=${msg('Escribe el código aquí')} />
				<div class="description mt-4">
					<button class="btn btn--primary btn--lg">${msg('Jugar ya')} ${arrowRightIcon}</button>
				</div>
			</main>
		`;
	}

	static styles = [
		ButtonStyles,
		LinkStyles,
		MarginStyles,
		TypographyStyles,
		css`
			:host {
				align-items: flex-start;
				background: var(--color-canvas-default);
				box-sizing: border-box;
				color: var(--color-fg-default);
				display: block;
				display: flex;
				flex-direction: column;
				height: 100%;
				position: absolute;
				top: 0;
				width: 100%;
				z-index: 2;
			}
			p {
				max-width: 30rem;
				text-align: left;
			}
			header {
				width: 100%;
				box-sizing: border-box;
				height: 6.6rem;
				padding: 2rem;
				display: flex;
				align-items: center;
				justify-content: flex-start;
			}
			main {
				padding: 0 2rem;
				width: 100%;
				max-width: 45rem;
				margin: 0 auto;
				box-sizing: border-box;
			}
			#textInput {
				width: 100%;
				background: none;
				border: none;
				border-bottom: 0.3rem solid var(--color-canvas-inverted);
				color: var(--color-fg-default);
				padding: 1rem;
				font-size: 1.4rem;
				font-weight: bold;
				box-sizing: border-box;
				font-family: inherit;
			}
			#textInput::placeholder {
				color: var(--color-fg-subtle);
			}
			.description {
				display: flex;
				flex-direction: column;
				gap: 2rem;
				text-align: center;
				width: 100%;
			}
			.contest-code {
				width: fit-content;
				margin: 0 auto;
				background: var(--color-canvas-subtle);
				font-weight: 500;
				padding: 0.5rem 2rem;
				box-sizing: border-box;
				border-radius: 0.5rem;
			}
			.btn {
				width: 100%;
			}
			.btn svg {
				margin-top: 0.2rem;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'myc-join-contest-page': MycJoinContestPage;
	}
}
