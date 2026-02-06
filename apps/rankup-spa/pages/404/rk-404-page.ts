import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('rk-404-page')
export class Rk404Page extends LitElement {
	override render() {
		return html`
			<h1>404 Missing</h1>
			<a href="/">${msg('Volver', { id: 'apps.rankup.spa.pages.404.rk.404.page.msg.l10c18' })}</a>
		`;
	}

	static override styles = [
		css`
		:host {
			display: block;
			background: beige;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-404-page': Rk404Page;
	}
}
