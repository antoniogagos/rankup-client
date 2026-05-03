import type { EngineRuntimeContext } from '../../context/engineRuntimeContext.js';
import { RuntimeProblem } from '../../errors.js';

export async function evaluateTournamentLifecycle(
	context: EngineRuntimeContext,
	tournamentId: string,
	requestId?: string,
): Promise<'upcoming' | 'live' | 'finished' | 'archived' | 'cancelled'> {
	const tournament = await context.tournamentRepo.getById(tournamentId);
	if (!tournament) {
		throw new RuntimeProblem('notFound', 404, 'Tournament not found.', requestId);
	}
	if (tournament.status === 'archived' || tournament.status === 'cancelled') {
		return tournament.status;
	}
	const matchdays = await context.sportsSchedulePort.listTournamentMatchdays(tournamentId);
	if (matchdays.length === 0) {
		return tournament.status;
	}
	for (const matchday of matchdays) {
		const matches = await context.sportsSchedulePort.listMatchdayMatches(tournamentId, matchday);
		if (!matches.every(match => match.status === 'final' || match.status === 'void')) {
			return tournament.status;
		}
	}
	const updatedTournament = {
		...tournament,
		status: 'finished' as const,
		version: tournament.version + 1,
	};
	await context.tournamentRepo.save(updatedTournament);
	return updatedTournament.status;
}
