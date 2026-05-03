import type { ITournamentRankingGateway } from '../../../src/domains/scoring/ranking/contracts/tournamentRankingGateway.js';
import type * as Ranking from '../../../src/domains/scoring/ranking/contracts/types.js';
import { fixtures } from '@rankup/testkit/fixtures.js';

export type FakeScoringGatewayCall = {
	op: keyof ITournamentRankingGateway;
	params?: unknown;
	query?: unknown;
};

export class FakeScoringGateway implements ITournamentRankingGateway {
	public readonly calls: FakeScoringGatewayCall[] = [];

	public handlers: {
		getTournamentRanking?: (params: Ranking.GetTournamentRankingParams, query?: Ranking.GetTournamentRankingQuery) => Promise<Ranking.TournamentRankingPage>;
		getTournamentRankingWindow?: (
			params: Ranking.GetTournamentRankingWindowParams,
			query?: Ranking.GetTournamentRankingWindowQuery,
		) => Promise<Ranking.TournamentRankingWindow>;
		getTournamentMatchdayRanking?: (
			params: Ranking.GetTournamentMatchdayRankingParams,
			query?: Ranking.GetTournamentMatchdayRankingQuery,
		) => Promise<Ranking.TournamentRankingPage>;
		getTournamentMatchdayRankingWindow?: (
			params: Ranking.GetTournamentMatchdayRankingWindowParams,
			query?: Ranking.GetTournamentMatchdayRankingWindowQuery,
		) => Promise<Ranking.TournamentRankingWindow>;
	} = {};

	public async getTournamentRanking(
		params: Ranking.GetTournamentRankingParams,
		query?: Ranking.GetTournamentRankingQuery,
	): Promise<Ranking.TournamentRankingPage> {
		this.calls.push({ op: 'getTournamentRanking', params, query });
		if (this.handlers.getTournamentRanking) {
			return this.handlers.getTournamentRanking(params, query);
		}
		return fixtures.domain.rankings.tournamentRankingPage() as Ranking.TournamentRankingPage;
	}

	public async getTournamentRankingWindow(
		params: Ranking.GetTournamentRankingWindowParams,
		query?: Ranking.GetTournamentRankingWindowQuery,
	): Promise<Ranking.TournamentRankingWindow> {
		this.calls.push({ op: 'getTournamentRankingWindow', params, query });
		if (this.handlers.getTournamentRankingWindow) {
			return this.handlers.getTournamentRankingWindow(params, query);
		}
		const page = fixtures.domain.rankings.tournamentRankingPage() as Ranking.TournamentRankingPage;
		return {
			meta: page.meta,
			headsup: page.headsup,
			center: page.items[0],
			items: page.items,
		};
	}

	public async getTournamentMatchdayRanking(
		params: Ranking.GetTournamentMatchdayRankingParams,
		query?: Ranking.GetTournamentMatchdayRankingQuery,
	): Promise<Ranking.TournamentRankingPage> {
		this.calls.push({ op: 'getTournamentMatchdayRanking', params, query });
		if (this.handlers.getTournamentMatchdayRanking) {
			return this.handlers.getTournamentMatchdayRanking(params, query);
		}
		return fixtures.domain.rankings.tournamentRankingPage() as Ranking.TournamentRankingPage;
	}

	public async getTournamentMatchdayRankingWindow(
		params: Ranking.GetTournamentMatchdayRankingWindowParams,
		query?: Ranking.GetTournamentMatchdayRankingWindowQuery,
	): Promise<Ranking.TournamentRankingWindow> {
		this.calls.push({ op: 'getTournamentMatchdayRankingWindow', params, query });
		if (this.handlers.getTournamentMatchdayRankingWindow) {
			return this.handlers.getTournamentMatchdayRankingWindow(params, query);
		}
		const page = fixtures.domain.rankings.tournamentRankingPage() as Ranking.TournamentRankingPage;
		return {
			meta: page.meta,
			headsup: page.headsup,
			center: page.items[0],
			items: page.items,
		};
	}
}
