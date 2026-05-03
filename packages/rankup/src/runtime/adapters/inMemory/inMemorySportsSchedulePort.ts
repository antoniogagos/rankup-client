import type { SportsSchedulePort } from '../../ports/sportsSchedulePort.js';
import type { EngineMatch } from '../../types.js';

function toKey(tournamentId: string, matchday: number, matchId: string): string {
	return `${tournamentId}:${matchday}:${matchId}`;
}

function cloneMatch(match: EngineMatch): EngineMatch {
	return {
		...match,
		score: { ...match.score },
	};
}

export class InMemorySportsSchedulePort implements SportsSchedulePort {
	private readonly matches = new Map<string, EngineMatch>();

	public constructor(seed: EngineMatch[] = []) {
		for (const match of seed) {
			this.matches.set(toKey(match.tournamentId, match.matchday, match.matchId), cloneMatch(match));
		}
	}

	public async listMatchdayMatches(tournamentId: string, matchday: number): Promise<EngineMatch[]> {
		const entries: EngineMatch[] = [];
		for (const match of this.matches.values()) {
			if (match.tournamentId === tournamentId && match.matchday === matchday) {
				entries.push(cloneMatch(match));
			}
		}
		entries.sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt));
		return entries;
	}

	public async listTournamentMatchdays(tournamentId: string): Promise<number[]> {
		const matchdays = new Set<number>();
		for (const match of this.matches.values()) {
			if (match.tournamentId === tournamentId) {
				matchdays.add(match.matchday);
			}
		}
		return [...matchdays].sort((left, right) => left - right);
	}

	public async upsertMatchResult(match: EngineMatch): Promise<void> {
		this.matches.set(toKey(match.tournamentId, match.matchday, match.matchId), cloneMatch(match));
	}
}
