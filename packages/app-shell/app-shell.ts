import './components/layout/app-layout.js';
import './lib/utils/request-idle-callback-polyfill.js';

import { contextProvider } from '@lit-labs/context';
import { routerContext } from '@rankup/common/contexts/main-router-context.js';
import { eventListener } from '@rankup/common/lit-controllers/listeners-controller/decorators/event-listeners.js';
import { RouterController, RouterStyles } from '@rankup/common/router/router.js';
import type { ComponentRoute, RedirectRoute } from '@rankup/common/router/types';
import ScrollbarStyles from '@rankup/samba/styles/scrollbar-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';

import Routes from './global-routes.js';
import { DataService } from './lib/data-service/data-service.js';
import {
	EventsMap as SessionManagerEvents,
	SessionManager,
} from './managers/session/session-manager.js';

// const root = new ContextRoot();
// root.attach(document.body);
requestIdleCallback(() => import('./lazy-imports.js'));

/**
 * @fires session-updated
 */
@customElement('app-shell')
export class AppShell extends LitElement {
	@state()
	showHeader?: boolean;

	@state()
	showFooter?: boolean;

	ds = new DataService(this);

	sessionManager = new SessionManager(this);

	@contextProvider({ context: routerContext })
	@property({ attribute: false })
	router = new RouterController(
		this,
		Routes.map(route => ({
			...route,
			enter: async () => {
				if ((route as RedirectRoute).redirect) {
					return true;
				}
				// redirection for auth-protected pages
				const _route = route as ComponentRoute;
				if (!_route.publicPage) {
					await this.sessionManager.waitLoginComplete();
					if (!this.sessionManager.isLogged) {
						this.router.redirect('/iniciar-sesion');
						return false;
					}
				}
				this.showFooter = _route.displayFooter ?? false;
				this.showHeader = _route.displayHeader ?? false;
				return true;
			},
		})),
	);

	constructor() {
		super();
		window.appShell ??= this;
	}

	get currentRoute() {
		const { pathname } = window.location;
		return Routes.find(route => {
			if (!(route as RedirectRoute).redirect) {
				const _route = route as ComponentRoute;
				const pattern = new URLPattern({ pathname: _route.path });
				return pattern.test({ pathname });
			}
			return false;
		});
	}

	@eventListener({ eventName: 'session-updated' })
	protected onSessionUpdated(evt: SessionManagerEvents['session-updated']) {
		const { session } = evt.detail;
		this.ds.userId = session?.userId ?? null;
		this.ds.authorizationToken = session?.accessToken ?? null;
		if (session) {
			// this.ds
			// 	.GetUser()
			// 	.then(resp => resp.json())
			// 	.then(data => console.log('getUserResponse', data))
			// 	.catch(error => console.error('getUserResp', error));
		} else {
			this.router.redirect('/');
		}
	}

	protected shouldUpdate(): boolean {
		// All routes will set showHeader/Footer (false by default) - wait until it's set so that we
		// know on first-paint if we want to display them or not
		return typeof this.showHeader === 'boolean' && typeof this.showFooter === 'boolean';
	}

	render() {
		return html`
			<sb-overlay-container></sb-overlay-container>
			<app-layout
				id="routerContainer"
				.headerHidden=${!this.showHeader}
				.footerHidden=${!this.showFooter}>
				${this.router.outlet()}
			</app-layout>
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
			app-layout {
				/** same as app-layout, so that it behaves the same when not loaded */
				display: flex;
				flex-direction: column;
				height: 100%;
			}
		`,
	];
}

declare global {
	let appShell: AppShell;

	interface Window {
		appShell: AppShell;
	}

	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}
