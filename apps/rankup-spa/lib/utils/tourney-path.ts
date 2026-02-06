import { path } from '../localization/rk-url-paths.js';

const DEFAULT_TOURNEY_ID = 'fj_rew';

function getPathname(): string {
	if (typeof window === 'undefined') {
		return '';
	}
	return window.location.pathname;
}

export function getCurrentTourneyId(pathname: string = getPathname()): string | null {
	const base = path('TOURNEY');
	if (!pathname.startsWith(base)) {
		return null;
	}
	const rest = pathname.slice(base.length).split('/').filter(Boolean);
	return rest[0] ?? null;
}

export function getCurrentTourneyBase(pathname: string = getPathname()): string {
	const base = path('TOURNEY');
	const tourneyId = getCurrentTourneyId(pathname) ?? DEFAULT_TOURNEY_ID;
	return `${base}/${tourneyId}`;
}
