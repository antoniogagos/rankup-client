import { path } from '../localization/rk-url-paths.js';

const DEFAULT_TOURNAMENT_ID = 'fj_rew';

function getPathname(): string {
	if (typeof window === 'undefined') {
		return '';
	}
	return window.location.pathname;
}

export function getCurrentTournamentId(pathname: string = getPathname()): string | null {
	const base = path('TOURNAMENT');
	if (!pathname.startsWith(base)) {
		return null;
	}
	const rest = pathname.slice(base.length).split('/').filter(Boolean);
	return rest[0] ?? null;
}

export function getCurrentTournamentBase(pathname: string = getPathname()): string {
	const base = path('TOURNAMENT');
	const tournamentId = getCurrentTournamentId(pathname) ?? DEFAULT_TOURNAMENT_ID;
	return `${base}/${tournamentId}`;
}
