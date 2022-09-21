import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('rk-404-page')
export class Rk404Page extends LitElement {
	render() {
		return html`
			<h1>Page not found</h1>
			<a href="${rkPublicApp.router.link('/')}">${msg('Volver')}</a>
		`;
	}

	static styles = [
		css`
			:host {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				color: #333;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-404-page': Rk404Page;
	}
}
