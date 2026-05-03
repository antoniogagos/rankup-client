import type { ScorePredictionLockPolicy } from '../../registry/gameModes/types.js';

export type LockableMatch = {
	lockState: 'open' | 'locked';
	scheduledAt?: string;
};

function toEpochMs(value: string): number {
	const parsed = Date.parse(value);
	if (Number.isNaN(parsed)) {
		throw new Error(`Invalid date-time value: ${value}`);
	}
	return parsed;
}

export function isMatchLocked(match: LockableMatch, policy: ScorePredictionLockPolicy, nowIso: string): boolean {
	if (match.lockState === 'locked') {
		return true;
	}
	if (!match.scheduledAt) {
		return false;
	}
	if (policy.type === 'manual') {
		return false;
	}
	const nowMs = toEpochMs(nowIso);
	const scheduledMs = toEpochMs(match.scheduledAt);
	if (policy.type === 'kickoff') {
		return nowMs >= scheduledMs;
	}
	const graceSeconds = policy.graceSeconds ?? 0;
	return nowMs >= scheduledMs + graceSeconds * 1000;
}
