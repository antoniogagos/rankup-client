import type { TournamentMatchdaySummary } from '@rankup/api';
import { matchStatusCatalog, type CanonicalMatchStatus } from '@rankup/api/generated/match-status-catalog.js';

export type CanonicalMockMatchStatus = CanonicalMatchStatus;

const CANONICAL_STATUSES: CanonicalMockMatchStatus[] = ['pending', 'provisional', 'final', 'void'];
const canonicalByProviderStatus: Record<string, CanonicalMockMatchStatus> = {};

for (const canonicalStatus of CANONICAL_STATUSES) {
	for (const providerStatus of matchStatusCatalog[canonicalStatus]) {
		canonicalByProviderStatus[providerStatus] = canonicalStatus;
	}
}

export function toCanonicalMockMatchStatus(status: string | undefined): CanonicalMockMatchStatus {
	if (!status) {
		return 'pending';
	}
	return canonicalByProviderStatus[status] ?? 'pending';
}

export function toTournamentMatchdayStatus(matches: ReadonlyArray<{ status?: string }>): TournamentMatchdaySummary['status'] {
	if (matches.some(match => toCanonicalMockMatchStatus(match.status) === 'provisional')) {
		return 'live';
	}

	if (matches.length > 0 && matches.every(match => {
		const canonicalStatus = toCanonicalMockMatchStatus(match.status);
		return canonicalStatus === 'final' || canonicalStatus === 'void';
	})) {
		return 'finished';
	}

	return 'upcoming';
}
