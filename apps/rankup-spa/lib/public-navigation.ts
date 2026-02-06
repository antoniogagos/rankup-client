import { path, PublicPaths } from './localization/rk-url-paths.js';

type AppRouter = {
	navigate: (uri: string) => void;
};

export function redirectToPublicPage(pagePath: keyof typeof PublicPaths, queryParams?: Record<string, string>): void {
	let url = path(pagePath);
	if (queryParams) {
		url += '?' + new URLSearchParams(queryParams).toString();
	}
	const publicApp = document.body.querySelector('rk-unauthenticated-app');
	const router = publicApp?.shadowRoot?.querySelector('app-router') as AppRouter | null;
	if (router?.navigate) {
		router.navigate(url);
		return;
	}
	window.location.assign(url);
}
