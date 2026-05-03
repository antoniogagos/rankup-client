import type { EngineTournament } from '../types.js';

export interface TournamentRepo {
	getById(tournamentId: string): Promise<EngineTournament | null>;
	save(tournament: EngineTournament): Promise<void>;
}
