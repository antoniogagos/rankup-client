/// <reference types="urlpattern-polyfill" />
import '@rankup/samba/overlay/overlay-container';
import type { AuthWall } from './elements/rk-auth-wall/rk-auth-wall.js';
import type { AppServices } from './lib/app-services.js';
import { createAppServices } from './lib/app-services.js';
import { createCompositionRoot } from './lib/composition-root.js';
import { ensureMockBanner } from './lib/mock-banner.js';
import { listen } from '@rankup/base/browser/event.js';
import { DisposableStore } from '@rankup/base/common/lifecycle.js';
import { isMockMode } from '@rankup/platform/environment/browser/env.js';
import { ProviderService, setRootProviderService } from '@rankup/platform/instantiation/browser/providerService.js';
import { createSessionManager } from '@rankup/platform/session/browser/sessionManagerService.js';
import type { ISessionManager } from '@rankup/platform/session/common/sessionManager.js';

if (!('URLPattern' in globalThis)) await import('urlpattern-polyfill');

const authWall = document.body.querySelector('rk-auth-wall') as AuthWall | null;
if (!authWall) {
	throw new Error('rk-auth-wall not found');
}

const overlayContainer = document.body.querySelector('overlay-container') as { closeAll?: () => void } | null;

const disposables = new DisposableStore();

let authAppImported = false;
let unAuthAppImported = false;
let hasPendingSession = false;
let pendingSession: unknown = null;
let bootReady = false;

let sessionManager: ISessionManager;
let appServices: AppServices;

const assignAuthAppProps = () => {
	const app = document.body.querySelector('rk-app') as { appServices?: AppServices; sessionManager?: ISessionManager } | null;
	if (!app) {
		return;
	}
	app.appServices = appServices;
	app.sessionManager = sessionManager;
};

const assignPublicAppProps = () => {
	const app = document.body.querySelector('rk-unauthenticated-app') as { sessionManager?: ISessionManager } | null;
	if (!app) {
		return;
	}
	app.sessionManager = sessionManager;
};

const updateAppForSession = (session: unknown) => {
	overlayContainer?.closeAll?.();
	if (session) {
		setColorScheme();
		if (!authAppImported) {
			import('./rk-app.js').then(assignAuthAppProps);
			authAppImported = true;
		} else {
			assignAuthAppProps();
		}
		return;
	}
	removeColorScheme();
	if (!unAuthAppImported) {
		import('./rk-unauthenticated-app.js').then(assignPublicAppProps);
		unAuthAppImported = true;
	} else {
		assignPublicAppProps();
	}
};

disposables.add(listen(authWall, 'session-updated', (evt: Event) => {
	const { session } = (evt as CustomEvent).detail;
	if (!bootReady) {
		pendingSession = session;
		hasPendingSession = true;
		return;
	}
	updateAppForSession(session);
}));

await import('./elements/rk-auth-wall/rk-auth-wall.js');
await customElements.whenDefined('rk-auth-wall');

sessionManager = createSessionManager(authWall);

const instantiationService = createCompositionRoot({
	getAccessToken: () => sessionManager.session?.accessToken ?? null,
	sessionManager,
});

const providerService = new ProviderService(instantiationService);
setRootProviderService(providerService);
providerService.provide(authWall, instantiationService, {
	claimAll: true,
	handleMissingServices: true,
});

appServices = createAppServices(instantiationService);

ensureMockBanner();

if (isMockMode && !sessionManager.session) {
	sessionManager
		.signInWithPassword({
			email: 'mock@rankup.local',
			password: 'mock-password',
		})
		.catch(() => {});
}

bootReady = true;
if (hasPendingSession) {
	updateAppForSession(pendingSession);
} else {
	updateAppForSession(sessionManager.session);
}

disposables.add(listen(window, 'pagehide', () => {
	disposables.dispose();
}));

function setColorScheme() {
	let theme = 'light';
	if (localStorage.getItem('theme')) {
		theme = localStorage.getItem('theme') ?? 'light';
	} else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
		theme = 'dark';
	}
	if (theme === 'dark') {
		// document.documentElement.setAttribute('data-color-mode', 'dark');
	} else {
		removeColorScheme();
	}
}

function removeColorScheme() {
	document.documentElement.removeAttribute('data-color-mode');
}
