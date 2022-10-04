import './components/layout/app-layout.js';
import './lib/utils/request-idle-callback-polyfill.js';

import type { ContextKey, ContextType } from '@lit-labs/context';
import { ContextProvider, contextProvider, ContextRoot } from '@lit-labs/context';
import type {
	EventsMap as SessionManagerEvents,
	SessionManager,
} from '@rankup/authentication/managers/session/session-manager.js';
import { envContext } from '@rankup/common/contexts/env-context.js';
import { routerContext } from '@rankup/common/contexts/main-router-context.js';
import { sessionManagerContext } from '@rankup/common/contexts/session-manager-context.js';
import { eventListener } from '@rankup/common/decorators/event-listener.js';
import { RouterController, RouterStyles } from '@rankup/common/router/router.js';
import type { ComponentRoute, RedirectRoute, Route } from '@rankup/common/router/types';
import type { ManagerClass } from '@rankup/common/utils/managers.js';
import ScrollbarStyles from '@rankup/samba/styles/scrollbar-css.js';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { state } from 'lit/decorators/state.js';

import env from './env.js';
import Routes from './global-routes.js';
import { DataService } from './lib/data-service/data-service.js';

// <-- Workaround: there is another bug with @lit-labs/context at ContextRoot, which is registering
// event.target for later re-dispatching of the event, instead of composedPath()[0]
// https://github.com/lit/lit/issues/3319
document.body.addEventListener('context-request', evt => {
	// redefine target for the event before the ContextRoot captures it
	const target = evt.composedPath()[0];
	Object.defineProperty(evt, 'target', { get: () => target });
});
// --->

const root = new ContextRoot();
root.attach(document.body);

@customElement('app-shell')
export class AppShell extends LitElement {
	ds = new DataService(this);

	managers: Map<string, ManagerClass<AppShell>> = new Map();

	private _providersByManagerController: WeakMap<
		ManagerClass<AppShell>,
		ContextProvider<ContextKey<unknown, unknown>>
	> = new WeakMap();

	@state()
	showHeader?: boolean;

	@state()
	showFooter?: boolean;

	@contextProvider({ context: envContext })
	@state()
	env = env;

	@contextProvider({ context: routerContext })
	@property({ attribute: false })
	router = new RouterController(
		this,
		Routes.map(route => ({ ...route, enter: this._routeEnterCallback.bind(this, route) })),
	);

	constructor() {
		super();
		window.appShell ??= this;
		this._lazyLoadResources();
	}

	private _lazyLoadResources() {
		requestIdleCallback(
			async deadline => {
				if (deadline.didTimeout || deadline.timeRemaining() > 40) {
					import('./lazy-imports.js');
					this._loadSessionManager();
				} else {
					this._lazyLoadResources();
				}
			},
			{ timeout: 1000 },
		);
	}

	/**
	 * Allows any package to add globally accessible managers.
	 * Other packages will use these manager via contexts, not referring to the appShell.
	 *
	 * i.e. import { myManagerContext } from '@rankup/common/contexts/my-manager-context.js'
	 *
	 * The only difference is that implementations can go in another packages and be lazy (with the
	 * subscribe option for contextConsumer's)
	 */
	private async registerManager<
		K extends typeof ManagerClass<AppShell>,
		T extends ContextKey<unknown, InstanceType<K>>,
	>(name: string, context: T, Manager: K): Promise<ManagerClass<AppShell>> {
		if (this.managers.has(name)) {
			throw new Error('Manager name already in use');
		}
		// <----
		// Workaround: there is a bug with the context provider dispatching an event before adding listeners
		// https://github.com/lit/lit/issues/3319
		this.addEventListener(
			'context-provider',
			async evt => {
				evt.stopPropagation();
				// stop the event and fire it on next microtask
				await Promise.resolve();
				this.dispatchEvent(evt);
			},
			{ once: true },
		);
		// ---->
		const controller = new Manager(this);
		const provider = new ContextProvider(this, context, controller as ContextType<T>);
		this.managers.set(name, controller);
		this._providersByManagerController.set(controller, provider); // is this needed?
		return controller;
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
		const { session, old } = evt.detail;
		this.ds.userId = session?.userId ?? null;
		this.ds.authorizationToken = session?.accessToken ?? null;
		if (session) {
			// this.ds
			// 	.GetUser()
			// 	.then(resp => resp.json())
			// 	.then(data => console.log('getUserResponse', data))
			// 	.catch(error => console.error('getUserResp', error));
		} else if (old) {
			this.router.redirect('/');
		}
	}

	async _routeEnterCallback(route: Route): Promise<boolean> {
		if (!(route as RedirectRoute).redirect) {
			// redirection for auth-protected pages
			const _route = route as ComponentRoute;
			if (!_route.publicPage) {
				const sessionManager = await this._loadSessionManager(); // sessionManager is lazily loaded
				await sessionManager.waitLoginComplete();
				if (!sessionManager.isLogged) {
					this.router.redirect('sign-in');
					return false;
				}
			}
			this.showFooter = _route.displayFooter ?? false;
			this.showHeader = _route.displayHeader ?? false;
		}
		return true;
	}

	// lazy loads the session manager
	async _loadSessionManager(): Promise<SessionManager> {
		const pkg = await import('@rankup/authentication/managers/session/session-manager.js');
		// this fn can be called multiple times so after the import the manager might be registered
		return (
			(this.managers.get('sessionManager') as SessionManager) ??
			this.registerManager('sessionManager', sessionManagerContext, pkg.SessionManager)
		);
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
