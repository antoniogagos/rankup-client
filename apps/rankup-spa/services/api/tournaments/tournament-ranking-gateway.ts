import { mapRankingPage, mapRankingWindow } from './tournament-mappers.js';
import type * as Api from '@rankup/api';
import type { ITournamentRankingGateway } from '@rankup/rankup/domains/scoring/ranking/contracts/tournamentRankingGateway.js';
import type * as Domain from '@rankup/rankup/domains/scoring/ranking/contracts/types.js';

export const operationOwners = {
	getMyTournamentMatchdayRankingWindow: 'api.tournament.ranking.getMyTournamentMatchdayRankingWindow',
	getMyTournamentSeasonRankingWindow: 'api.tournament.ranking.getMyTournamentSeasonRankingWindow',
	listTournamentMatchdayRanking: 'api.tournament.ranking.listTournamentMatchdayRanking',
	listTournamentSeasonRanking: 'api.tournament.ranking.listTournamentSeasonRanking',
} as const;

const mapGetTournamentRankingQuery = (query?: Domain.GetTournamentRankingQuery): Api.GetTournamentRankingQuery | undefined =>
	query
		? {
				view: query.view,
				include: query.include ? query.include.slice() : undefined,
				cursor: query.cursor,
				pageSize: query.pageSize,
		  }
		: undefined;

const mapGetTournamentRankingWindowQuery = (
	query?: Domain.GetTournamentRankingWindowQuery,
): Api.GetTournamentRankingWindowQuery | undefined =>
	query
		? {
				window: query.window,
				view: query.view,
		  }
		: undefined;

export class TournamentRankingGateway implements ITournamentRankingGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getTournamentRanking(
		params: Domain.GetTournamentRankingParams,
		query?: Domain.GetTournamentRankingQuery,
	): Promise<Domain.TournamentRankingPage> {
		const response = await this.apiClient.getTournamentRanking({ tournamentId: params.tournamentId }, mapGetTournamentRankingQuery(query));
		return mapRankingPage(response);
	}

	public async getTournamentRankingWindow(
		params: Domain.GetTournamentRankingWindowParams,
		query?: Domain.GetTournamentRankingWindowQuery,
	): Promise<Domain.TournamentRankingWindow> {
		const response = await this.apiClient.getTournamentRankingWindow(
			{ tournamentId: params.tournamentId },
			mapGetTournamentRankingWindowQuery(query),
		);
		return mapRankingWindow(response);
	}

	public async getTournamentMatchdayRanking(
		params: Domain.GetTournamentMatchdayRankingParams,
		query?: Domain.GetTournamentMatchdayRankingQuery,
	): Promise<Domain.TournamentRankingPage> {
		const response = await this.apiClient.getTournamentMatchdayRanking(
			{ tournamentId: params.tournamentId, matchday: params.matchday },
			mapGetTournamentRankingQuery(query),
		);
		return mapRankingPage(response);
	}

	public async getTournamentMatchdayRankingWindow(
		params: Domain.GetTournamentMatchdayRankingWindowParams,
		query?: Domain.GetTournamentMatchdayRankingWindowQuery,
	): Promise<Domain.TournamentRankingWindow> {
		const response = await this.apiClient.getTournamentMatchdayRankingWindow(
			{ tournamentId: params.tournamentId, matchday: params.matchday },
			mapGetTournamentRankingWindowQuery(query),
		);
		return mapRankingWindow(response);
	}
}
