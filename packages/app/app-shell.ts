import '@rankup/samba/overlay/sb-overlay-container.js';
import './components/layout/app-layout.js';

import { localizePath } from '@rankup/common/i18n/localize.js';
import { eventListener } from '@rankup/common/lit-controllers/listeners-controller/decorators/event-listeners.js';
import { MainRouter, redirect, RouterStyles } from '@rankup/common/router/router.js';
import type { Route } from '@rankup/common/types/rankup-json.js';
import ScrollbarStyles from '@rankup/samba/styles/scrollbar-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { state } from 'lit/decorators/state.js';

import { DataService } from './lib/data-service/data-service.js';
import env from './lib/env/env.js';
import {
	EventsMap as SessionManagerEvents,
	SessionManager,
} from './managers/session/session-manager.js';

/**
 * @fires session-updated
 */
@customElement('app-shell')
export class AppShell extends LitElement {
	@state()
	showHeader = true;

	@state()
	showFooter = true;

	ds = new DataService(this);

	sessionManager = new SessionManager(this);

	private _router = MainRouter(this, [
		...env.Routes.map(route => ({
			...route,
			// localize (prepend /lang-code/) unless specified by the attr "localize": false
			path: route.localize !== false ? localizePath(route.path) : route.path,
			redirect: this._computeRedirect(route, env.Routes),
			enter: async () => {
				// redirection for auth-protected pages
				if (!route.publicPage) {
					await this.sessionManager.waitLoginComplete();
					if (!this.sessionManager.isLogged) {
						this.redirect('/iniciar-sesion');
						return false;
					}
				}
				this.showFooter = route.displayFooter ?? false;
				this.showHeader = route.displayHeader ?? false;
				return true;
			},
		})),
	]);

	constructor() {
		super();
		window.appShell ??= this;
	}

	/**
	 * The redirect page might need to be localized before using it. We must find it to check.
	 */
	private _computeRedirect(route: Route, routes: Route[]): string | undefined {
		if (route.redirect) {
			const redirectRoute = routes.find(r => r.path === route.redirect);
			if (redirectRoute?.localize !== false) {
				return localizePath(route.redirect);
			}
			return route.redirect;
		}
	}

	@eventListener({ eventName: 'session-updated' })
	protected onSessionUpdated(evt: SessionManagerEvents['session-updated']) {
		const { session } = evt.detail;
		this.ds.userId = session?.userId ?? null;
		this.ds.authorizationToken = session?.accessToken ?? null;
		if (session) {
			// test
			this.ds
				.GetUser()
				.then(resp => resp.json())
				.then(data => console.log('getUserResponse', data))
				.catch(error => console.error('getUserResp', error));
		} else {
			this.redirect('/');
		}
	}

	redirect(pagePath: string, searchParams?: { [key: string]: string | undefined }) {
		redirect(this._router, pagePath, searchParams);
	}

	protected shouldUpdate(): boolean {
		// Wait until a route has been computed to avoid a first render with layout and no content.
		// This way we can pass the appropriate showHeader/Footer for the route to be render
		return !!this._router.outlet();
	}

	render() {
		return html`
			<app-layout
				?header-hidden=${!this.showHeader}
				?footer-hidden=${!this.showFooter}
				class="router-container">
				${this._router.outlet()}
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
