import './components/header/fsg-header.js';
import './pages/matchday/fsg-matchday-page.js';
import './pages/ranking/fsg-ranking-page.js';
import './pages/settings/fsg-settings-page.js';
import './pages/share/fsg-share-page.js';
import './pages/rules/fsg-rules-page.js';

import { contextProvider } from '@lit-labs/context';
import { msg } from '@rankup/common/i18n/localize.js';
import { RouterStyles, RoutesController } from '@rankup/common/router/routes.js';
import ScrollbarStyles from '@rankup/samba/styles/scrollbar-css.js';
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { customElement } from 'lit/decorators/custom-element.js';

import { routerContext } from './contexts/router-context.js';

@customElement('fsg-index')
export class FsgIndex extends LitElement {
	@contextProvider({ context: routerContext })
	@property({ attribute: false })
	router = new RoutesController(this, [
		{
			name: 'ranking',
			path: `:id/${msg('ranking')}`,
			publicPage: false,
			componentName: 'fsg-ranking-page',
		},
		{
			name: 'matchday',
			path: `:id/${msg('jornada')}`,
			publicPage: false,
			animation: 'slide',
			componentName: 'fsg-matchday-page',
		},
		{
			name: 'share',
			path: `:id/${msg('compartir-torneo')}`,
			publicPage: false,
			animation: 'slide',
			componentName: 'fsg-share-page',
		},
		{
			name: 'settings',
			path: `:id/${msg('ajustes')}`,
			publicPage: false,
			animation: 'slide',
			componentName: 'fsg-settings-page',
		},
		{
			name: 'rules',
			path: `:id/${msg('reglas')}`,
			publicPage: false,
			animation: 'slide',
			componentName: 'fsg-rules-page',
		},
		{
			path: '404',
			publicPage: false,
			animation: 'slide',
			render: () => html` <h2 class="page" animation="slide">404 missing</h2> `,
		},
		{
			path: ':id',
			publicPage: false,
			redirect: `ranking`,
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
			<div id="routerContainer">${this.router?.outlet()}</div>
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
			#routerContainer {
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
