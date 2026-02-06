import '../../elements/rk-app-header/rk-app-header.js';
import '../../elements/rk-tourney-list/rk-tourney-list.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('rk-home-page')
export class HomePage extends LitElement {
	@property({ type: Boolean }) toggleDrawer = false;

	override render() {
		return html`
			<rk-app-header></rk-app-header>
			<rk-tourney-list></rk-tourney-list>
		`;
	}

	static override styles = [
		css`
		:host {
			display: block;
		}
		`];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-home-page': HomePage;
	}
}
