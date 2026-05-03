import type { TournamentRepo } from '../../ports/tournamentRepo.js';
import type { EngineTournament } from '../../types.js';

export class InMemoryTournamentRepo implements TournamentRepo {
	private readonly tournaments = new Map<string, EngineTournament>();

	public constructor(seed: EngineTournament[] = []) {
		for (const tournament of seed) {
			this.tournaments.set(tournament.tournamentId, { ...tournament });
		}
	}

	public async getById(tournamentId: string): Promise<EngineTournament | null> {
		const tournament = this.tournaments.get(tournamentId);
		return tournament ? { ...tournament } : null;
	}

	public async save(tournament: EngineTournament): Promise<void> {
		this.tournaments.set(tournament.tournamentId, { ...tournament });
	}
}
