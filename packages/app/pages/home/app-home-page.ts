import '../../components/header/app-header.js';
import '../../components/tourney-list/app-tourney-list.js';

import buttonStyles from '@rankup/samba/styles/button-css.js';
// import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// import { Icons } from '../../authenticated-icons.js';
// import { path } from '../../lib/url-paths/url-paths.js';

@customElement('app-home-page')
export class AppHomePage extends LitElement {
	@property({ type: Boolean })
	toggleDrawer = false;

	render() {
		return html`
			<app-header></app-header>
			<app-tourney-list></app-tourney-list>
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
		'home-page': AppHomePage;
	}
}
