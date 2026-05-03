import { TournamentRankingService } from '../../../../src/domains/scoring/ranking/services/tournamentRankingService.js';
import { TournamentResultsService } from '../../../../src/domains/scoring/results/services/tournamentResultsService.js';
import { FakeScoringGateway } from '../../../testkit/fakes/fakeScoringGateway.js';
import { fixtures } from '@rankup/testkit/fixtures.js';
import { describe, expect, it } from 'vitest';

const scoringNotFoundDomainError = {
	kind: 'NotFound',
	status: 404,
	code: 'notFound',
	message: 'Ranking resource not found.',
} as const;

type FakeResultsGatewayCall = {
	op: 'getMyMatchdayResults';
	params: {
		tournamentId: string;
		matchday: number;
	};
	query?: {
		include?: string[];
	};
};

class FakeResultsGateway {
	public readonly calls: FakeResultsGatewayCall[] = [];

	public async getMyMatchdayResults(
		params: {
			tournamentId: string;
			matchday: number;
		},
		query?: {
			include?: string[];
		},
	): Promise<{
		tournamentId: string;
		matchday: number;
		gameModeId: 'scorePrediction';
		user: {
			userId: string;
			displayName?: string;
			avatarUrl?: string;
		};
		serverTime: string;
		state: 'pending' | 'provisional' | 'final';
		totalPoints: number;
		pointsState?: 'pending' | 'provisional' | 'final';
		lines: Array<{
			matchId: string;
			state: 'pending' | 'provisional' | 'final' | 'void';
		}>;
	}> {
		this.calls.push({ op: 'getMyMatchdayResults', params, query });
		return {
			tournamentId: params.tournamentId,
			matchday: params.matchday,
			gameModeId: 'scorePrediction',
			user: {
				userId: fixtures.builders.userId(),
				displayName: 'Test User',
			},
			serverTime: fixtures.builders.isoDate(),
			state: 'final',
			totalPoints: 14,
			pointsState: 'final',
			lines: [{ matchId: fixtures.builders.matchId(), state: 'final' }],
		};
	}
}

describe('[P0] scoring service contract', () => {
	it('passes params/query for ranking reads', async () => {
		const gateway = new FakeScoringGateway();
		const service = new TournamentRankingService(gateway);

		await service.getTournamentRanking({ tournamentId: fixtures.builders.tournamentId() as never }, { cursor: 'abc', pageSize: 20 });
		await service.getTournamentMatchdayRanking(
			{ tournamentId: fixtures.builders.tournamentId() as never, matchday: 1 },
			{ view: 'compact', include: ['metrics'] },
		);

		expect(gateway.calls).toContainEqual(expect.objectContaining({ op: 'getTournamentRanking' }));
		expect(gateway.calls).toContainEqual(expect.objectContaining({ op: 'getTournamentMatchdayRanking' }));
	});

	it('passes params/query for results reads', async () => {
		const gateway = new FakeResultsGateway();
		const service = new TournamentResultsService(gateway as never);
		const tournamentId = fixtures.builders.tournamentId();
		const matchday = 1;

		const result = await service.getMyMatchdayResults({ tournamentId, matchday }, { include: ['breakdown'] });

		expect(result.tournamentId).toBe(tournamentId);
		expect(result.matchday).toBe(matchday);
		expect(gateway.calls).toContainEqual(
			expect.objectContaining({
				op: 'getMyMatchdayResults',
				params: expect.objectContaining({ tournamentId, matchday }),
				query: expect.objectContaining({ include: ['breakdown'] }),
			}),
		);
	});

	it('enforces matchday validation before gateway invocation', async () => {
		const gateway = new FakeScoringGateway();
		const service = new TournamentRankingService(gateway);

		await expect(
			service.getTournamentMatchdayRanking({ tournamentId: fixtures.builders.tournamentId() as never, matchday: 0 }, { view: 'compact' }),
		).rejects.toThrow('matchday must be a positive integer.');
	});

	it('rethrows ranking gateway problems unchanged', async () => {
		const gateway = new FakeScoringGateway();
		gateway.handlers.getTournamentRanking = async () => {
			throw scoringNotFoundDomainError;
		};
		const service = new TournamentRankingService(gateway);

		await expect(service.getTournamentRanking({ tournamentId: 'missing' as never })).rejects.toMatchObject(scoringNotFoundDomainError);
	});
});
