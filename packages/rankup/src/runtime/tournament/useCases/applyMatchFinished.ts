import { stableHash } from '../../../shared/validation/stableHash.js';
import type { EngineRuntimeContext } from '../../context/engineRuntimeContext.js';
import { RuntimeProblem } from '../../errors.js';
import type { EngineMatch, RuntimeResponse } from '../../types.js';
import { RecomputeTournamentUseCase } from './recomputeTournament.js';

export type ApplyMatchFinishedInput = {
	eventId: string;
	tournamentId: string;
	matchday: number;
	matchId: string;
	status: 'pending' | 'provisional' | 'final' | 'void';
	home: number | null;
	away: number | null;
	finalOutcomeType?: 'regular' | 'extra_time' | 'penalty_shootout';
	requestId?: string;
	correlationId?: string;
	causationId?: string;
};

export type ApplyMatchFinishedOutput = {
	tournamentId: string;
	matchId: string;
	processed: boolean;
	seasonSnapshotId: string;
};

export class ApplyMatchFinishedUseCase {
	private readonly recomputeUseCase: RecomputeTournamentUseCase;

	public constructor(private readonly context: EngineRuntimeContext) {
		this.recomputeUseCase = new RecomputeTournamentUseCase(context);
	}

	public async execute(input: ApplyMatchFinishedInput): Promise<RuntimeResponse<ApplyMatchFinishedOutput>> {
		const eventDedupeKey = stableHash({
			kind: 'sports-event',
			eventId: input.eventId,
			tournamentId: input.tournamentId,
		});
		const resultFingerprint = stableHash({
			tournamentId: input.tournamentId,
			matchId: input.matchId,
			status: input.status,
			home: input.home,
			away: input.away,
			finalOutcomeType: input.finalOutcomeType ?? null,
		});
		const resultDedupeKey = stableHash({
			kind: 'match-result',
			tournamentId: input.tournamentId,
			matchId: input.matchId,
			resultFingerprint,
		});

		const matches = await this.context.sportsSchedulePort.listMatchdayMatches(input.tournamentId, input.matchday);
		const currentMatch = matches.find(match => match.matchId === input.matchId);
		if (!currentMatch) {
			throw new RuntimeProblem('notFound', 404, 'Match not found in tournament matchday.', input.requestId);
		}

		const eventClaimed = await this.context.processedEventRepo.markIfAbsent(eventDedupeKey);
		if (!eventClaimed) {
			const latest = await this.context.scoringRepo.getLatestSnapshot(input.tournamentId, 'season');
			return {
				status: 200,
				body: {
					tournamentId: input.tournamentId,
					matchId: input.matchId,
					processed: false,
					seasonSnapshotId: latest?.snapshotId ?? '',
				},
				headers: {},
			};
		}

		const resultClaimed = await this.context.processedEventRepo.markIfAbsent(resultDedupeKey);
		if (!resultClaimed) {
			const latest = await this.context.scoringRepo.getLatestSnapshot(input.tournamentId, 'season');
			return {
				status: 200,
				body: {
					tournamentId: input.tournamentId,
					matchId: input.matchId,
					processed: false,
					seasonSnapshotId: latest?.snapshotId ?? '',
				},
				headers: {},
			};
		}

		const updatedMatch: EngineMatch = {
			...currentMatch,
			status: input.status,
			score: {
				home: input.home,
				away: input.away,
			},
			finalOutcomeType: input.finalOutcomeType,
			resultFingerprint,
		};
		await this.context.sportsSchedulePort.upsertMatchResult(updatedMatch);

		const recompute = await this.recomputeUseCase.execute({
			tournamentId: input.tournamentId,
			reason: 'sports.match_finished',
			requestId: input.requestId,
			correlationId: input.correlationId ?? input.eventId,
			causationId: input.causationId ?? input.eventId,
		});

		return {
			status: 200,
			body: {
				tournamentId: input.tournamentId,
				matchId: input.matchId,
				processed: recompute.body.processed,
				seasonSnapshotId: recompute.body.seasonSnapshotId,
			},
			headers: {},
		};
	}
}
