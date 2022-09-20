import './components/tourney-header/fsg-tourney-header.js';

import { Router, RouterStyles } from 'common/router/nested-router.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import ScrollbarStyles from 'samba/styles/scrollbar-css.js';

@customElement('fsg-index')
export class FsgIndex extends LitElement {
	private _router = Router(this, [
		{
			path: '/{id}/ranking',
			render: () => html`ranking-page`,
		},
		{
			path: '/{id}/contest',
			render: () => html`contest-info`,
		},
		{
			path: '/404',
			render: () => html`missing`,
		},
		{
			path: '*',
			enter: () => {
				this._router.goto('404');
				return false;
			},
		},
	]);

	render() {
		return html`
			<fsg-tourney-header></fsg-tourney-header>
			<div id="routerContainer">${this._router.outlet()}</div>
		`;
	}

	static styles = [
		RouterStyles,
		ScrollbarStyles,
		css`
			:host {
				display: contents;
			}
			@supports not (display: contents) {
				:host {
					display: block;
					height: 100%;
				}
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'fsg-index': FsgIndex;
	}
}
