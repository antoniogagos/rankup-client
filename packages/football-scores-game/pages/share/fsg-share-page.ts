import { msg } from '@rankup/common/i18n/localize.js';
import { shareIcon } from '@rankup/samba/icons.js';
import ButtonStyles from '@rankup/samba/styles/buttons-css.js';
import LinkStyles from '@rankup/samba/styles/links-css.js';
import MarginStyles from '@rankup/samba/styles/margin-css.js';
import TypographyStyles from '@rankup/samba/styles/typography-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

@customElement('fsg-share-page')
export class FsgSharePage extends LitElement {
	render() {
		return html`
			<h1 class="text-bold">${msg('Invita a tus amigos')}</h1>
			<p class="f3 mt-4 mb-4">
				${msg(
					`Invita a tus amigos compartiendo el enlace al pulsar el boton de Compartir o pasándoles el código de acceso único para acceder al torneo.`,
				)}
			</p>
			<div class="description">
				<button class="btn btn--primary btn--md">${msg('Compartir enlace')} ${shareIcon}</button>
				<div class="contest-code-description mt-6">
					<div>${msg('Código de acceso al torneo:')}</div>
					<div class="contest-code text-bold mt-2">PUI_KD</div>
				</div>
			</div>
		`;
	}

	static styles = [
		ButtonStyles,
		LinkStyles,
		MarginStyles,
		TypographyStyles,
		css`
			:host {
				display: flex;
				align-items: flex-start;
				flex-direction: column;
				padding: 0 2rem;
			}
			.description {
				display: flex;
				flex-direction: column;
				gap: 2rem;
				width: 100%;
			}
			.contest-code-description {
				align-items: center;
				display: flex;
				flex-direction: column;
				margin-top: 1.5rem;
			}
			.contest-code {
			}
			.btn--md {
				width: 100%;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-share-page': FsgSharePage;
	}
}
