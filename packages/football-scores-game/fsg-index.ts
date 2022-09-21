import './components/tourney-header/fsg-tourney-header.js';

import { Router, RouterStyles } from 'common/router/nested-router.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import ScrollbarStyles from 'samba/styles/scrollbar-css.js';

@customElement('fsg-index')
export class FsgIndex extends LitElement {
	private _router = Router(this, [
		{
			path: ':id/ranking',
			render: () => html`<div class="page" animation="slide">ranking-page</div>`,
		},
		{
			path: ':id/contest',
			render: () => html`<div class="page" animation="slide">contest-info</div>`,
		},
		{
			path: ':id',
			render: params =>
				html`<div class="page" animation="slide">matchday for tourney "${params.id}"</div>`,
		},
	]);

	render() {
		return html`
			<fsg-tourney-header class="header"></fsg-tourney-header>
			<div class="router-container">${this._router.outlet()}</div>
		`;
	}

	static styles = [
		RouterStyles,
		ScrollbarStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
			}
			.router-container {
				position: relative;
				flex: 1;
			}
			.header {
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-index': FsgIndex;
	}
}
