import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('rk-404-page')
export class Rk404Page extends LitElement {
	render() {
		return html`
			<h1>404 Missing</h1>
			<a href="/">${msg('Volver')}</a>
		`;
	}

	static styles = [
		css`
			:host {
				display: block;
				background: beige;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-404-page': Rk404Page;
	}
}
