import { msg } from '@rankup/common/i18n/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

@customElement('app-footer')
export class AppFooter extends LitElement {
	render() {
		return html`
			<div class="item">${msg('En vivo', { desc: 'main menu' })}</div>
			<div class="item">${msg('Mis torneos', { desc: 'main menu' })}</div>
			<div class="item">${msg('Lobby', { desc: 'main menu' })}</div>
		`;
	}

	static styles = [
		css`
			:host {
				display: flex;
				place-content: center;
			}
			.item {
				padding: 1.2rem;
				flex: 1;
				text-align: center;
				gap: 1.2rem;
			}
			.item:hover {
				background: #aaaaaa;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'app-footer': AppFooter;
	}
}
