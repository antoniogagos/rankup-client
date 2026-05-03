import type { EngineMatch } from '../types.js';

export interface SportsSchedulePort {
	listMatchdayMatches(tournamentId: string, matchday: number): Promise<EngineMatch[]>;
	listTournamentMatchdays(tournamentId: string): Promise<number[]>;
	upsertMatchResult(match: EngineMatch): Promise<void>;
}
