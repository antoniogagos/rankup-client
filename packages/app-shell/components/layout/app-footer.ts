import { contextProvided } from '@lit-labs/context';
import { routerContext, RoutesController } from '@rankup/common/contexts/main-router-context.js';
import { msg } from '@rankup/common/i18n/localize';
import { eventListener } from '@rankup/common/lit-controllers/listeners-controller/decorators/event-listeners';
import { EventsMap as RouterEventsMap } from '@rankup/common/router/extended-lit-router-mixin';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { state } from 'lit/decorators/state.js';

enum Page {
	live = 'live',
	lobby = 'lobby',
	contest = 'my-contests',
}

@customElement('app-footer')
export class AppFooter extends LitElement {
	@contextProvided({ context: routerContext })
	router!: RoutesController;

	@state()
	active?: Page;

	connectedCallback() {
		super.connectedCallback?.();
		this._updateActivePage(appShell.currentRoute?.name ?? '');
	}

	@eventListener({ eventName: 'router-page-changed', target: appShell })
	protected _onRouteChanges(evt: RouterEventsMap['router-page-changed']) {
		this._updateActivePage(evt.detail.route.name ?? '');
	}

	private _updateActivePage(page: string) {
		this.active = Object.values(Page).includes(page as Page) ? (page as Page) : undefined;
	}

	render() {
		return html`
			<a href=${this.router.link('live')} class="item" ?active=${this.active === 'live'}
				>${msg('En vivo', { desc: 'main menu' })}</a
			>
			<a
				href=${this.router.link('my-contests')}
				class="item"
				?active=${this.active === 'my-contests'}
				>${msg('Mis torneos', { desc: 'main menu' })}</a
			>
			<a href=${this.router.link('lobby')} class="item" ?active=${this.active === 'lobby'}
				>${msg('Lobby', { desc: 'main menu' })}</a
			>
		`;
	}

	static styles = [
		css`
			:host {
				display: flex;
				place-content: center;
				background: hsl(0deg 0% 90%);
				color: var(--color-footer-text);
				box-shadow: var(--color-footer-shadow);
			}
			.item {
				padding: 1.2rem;
				flex: 1;
				text-align: center;
				text-decoration: none;
				color: inherit;
			}
			.item:active {
				background: unset;
			}
			.item[active] {
				background: var(--color-btn-danger-selected-text);
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'app-footer': AppFooter;
	}
}
