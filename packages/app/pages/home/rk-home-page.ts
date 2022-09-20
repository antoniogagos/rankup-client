import '../../components/rk-app-header/rk-app-header.js';
import '../../components/rk-tourney-list/rk-tourney-list.js';

// import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import buttonStyles from 'samba/styles/button-css.js';

// import { Icons } from '../../authenticated-icons.js';
// import { path } from '../../lib/url-paths/url-paths.js';

@customElement('rk-home-page')
export class RkHomePage extends LitElement {
	@property({ type: Boolean })
	toggleDrawer = false;

	render() {
		return html`
			<rk-app-header></rk-app-header>
			<rk-tourney-list></rk-tourney-list>
		`;
	}

	static styles = [
		buttonStyles,
		css`
			:host {
				display: block;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'rk-home-page': RkHomePage;
	}
}
