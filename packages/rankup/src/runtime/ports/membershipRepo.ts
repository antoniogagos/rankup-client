import type { EngineMembership } from '../types.js';

export interface MembershipRepo {
	getByTournamentAndUser(tournamentId: string, userId: string): Promise<EngineMembership | null>;
	add(membership: EngineMembership): Promise<boolean>;
	countByTournament(tournamentId: string): Promise<number>;
	listByTournament(tournamentId: string): Promise<EngineMembership[]>;
}
