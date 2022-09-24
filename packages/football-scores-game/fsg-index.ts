import './components/header/fsg-header.js';

import { redirect, Router, RouterStyles } from '@rankup/common/router/router.js';
import ScrollbarStyles from '@rankup/samba/styles/scrollbar-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

@customElement('fsg-index')
export class FsgIndex extends LitElement {
	private _router = Router(this, [
		{
			path: ':id/ranking',
			publicPage: false,
			render: params =>
				html`
					${params.id}
					<h2 class="page" animation="slide">ranking</h2>
				`,
		},
		{
			path: ':id/jornada',
			publicPage: false,
			render: params =>
				html`
					${params.id}
					<h2 class="page" animation="slide">jornada</h2>
				`,
		},
		{
			path: ':id/informacion',
			publicPage: false,
			render: params =>
				html`
					${params.id}
					<h2 class="page" animation="slide">informacion</h2>
				`,
		},
		{
			path: ':id/compartir-torneo',
			publicPage: false,
			render: params =>
				html`
					${params.id}
					<h2 class="page" animation="slide">compartir torneo</h2>
				`,
		},
		{
			path: ':id/ajustes',
			publicPage: false,
			render: params =>
				html`
					${params.id}
					<h2 class="page" animation="slide">ajustes</h2>
				`,
		},
		{
			path: '404',
			publicPage: false,
			render: () => html` <h2 class="page" animation="slide">404 missing</h2> `,
		},
		{
			path: ':id',
			publicPage: false,
			enter: params => redirect(this._router, `${params.id}/ranking`),
		},
		{
			path: '*',
			redirect: '404',
			publicPage: false,
		},
	]);

	render() {
		return html`
			<fsg-header class="header"></fsg-header>
			<div class="router-container">${this._router?.outlet()}</div>
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
