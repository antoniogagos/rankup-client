import { stableHash } from '../../../shared/validation/stableHash.js';
import type { EngineRuntimeContext } from '../../context/engineRuntimeContext.js';
import { RuntimeProblem } from '../../errors.js';
import type { RuntimeResponse } from '../../types.js';
import { resolveEventMetadata } from '../../utils/eventMetadata.js';
import { buildMatchdaySnapshot, buildSeasonSnapshot } from '../services/buildRankingSnapshots.js';
import { evaluateTournamentLifecycle } from '../services/evaluateTournamentLifecycle.js';

export type RecomputeTournamentInput = {
	tournamentId: string;
	reason: string;
	eventKey?: string;
	requestId?: string;
	correlationId?: string;
	causationId?: string;
};

export type RecomputeTournamentOutput = {
	tournamentId: string;
	processed: boolean;
	matchdaySnapshots: string[];
	seasonSnapshotId: string;
	tournamentStatus: 'upcoming' | 'live' | 'finished' | 'archived' | 'cancelled';
};

export class RecomputeTournamentUseCase {
	public constructor(private readonly context: EngineRuntimeContext) {}

	public async execute(input: RecomputeTournamentInput): Promise<RuntimeResponse<RecomputeTournamentOutput>> {
		const dedupeKey = input.eventKey ? stableHash({ tournamentId: input.tournamentId, eventKey: input.eventKey }) : null;
		if (dedupeKey) {
			const dedupeClaimed = await this.context.processedEventRepo.markIfAbsent(dedupeKey);
			if (!dedupeClaimed) {
				const latestSeason = await this.context.scoringRepo.getLatestSnapshot(input.tournamentId, 'season');
				const lifecycleStatus = await evaluateTournamentLifecycle(this.context, input.tournamentId, input.requestId);
				return {
					status: 200,
					body: {
						tournamentId: input.tournamentId,
						processed: false,
						matchdaySnapshots: [],
						seasonSnapshotId: latestSeason?.snapshotId ?? '',
						tournamentStatus: lifecycleStatus,
					},
					headers: {},
				};
			}
		}

		const tournament = await this.context.tournamentRepo.getById(input.tournamentId);
		if (!tournament) {
			throw new RuntimeProblem('notFound', 404, 'Tournament not found.', input.requestId);
		}

		const matchdays = await this.context.sportsSchedulePort.listTournamentMatchdays(input.tournamentId);
		const matchdaySnapshotIds: string[] = [];
		for (const matchday of matchdays) {
			const snapshot = await buildMatchdaySnapshot(this.context, tournament, matchday, input.reason);
			await this.context.scoringRepo.saveSnapshot(snapshot);
			matchdaySnapshotIds.push(snapshot.snapshotId);
		}
		const seasonSnapshot = await buildSeasonSnapshot(this.context, tournament, input.reason);
		await this.context.scoringRepo.saveSnapshot(seasonSnapshot);
		const lifecycleStatus = await evaluateTournamentLifecycle(this.context, input.tournamentId, input.requestId);

		await this.context.eventBusPort.publish({
			eventId: this.context.idGeneratorPort.nextId('evt'),
			type: 'ranking.snapshot_published',
			occurredAt: this.context.clockPort.nowIso(),
			...resolveEventMetadata({
				requestId: input.requestId,
				correlationId: input.correlationId,
				causationId: input.causationId,
			}),
			payload: {
				tournamentId: input.tournamentId,
				seasonSnapshotId: seasonSnapshot.snapshotId,
				matchdaySnapshotIds,
				reason: input.reason,
				tournamentStatus: lifecycleStatus,
			},
		});

		return {
			status: 200,
			body: {
				tournamentId: input.tournamentId,
				processed: true,
				matchdaySnapshots: matchdaySnapshotIds,
				seasonSnapshotId: seasonSnapshot.snapshotId,
				tournamentStatus: lifecycleStatus,
			},
			headers: {},
		};
	}
}
