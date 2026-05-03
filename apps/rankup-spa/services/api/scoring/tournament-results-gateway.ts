import { mapLegacyUserMatchdayStatsToResults, mapMatchdayResults } from './results-mappers.js';
import type * as Api from '@rankup/api';
import type { ITournamentResultsGateway } from '@rankup/rankup/domains/scoring/results/contracts/tournamentResultsGateway.js';
import type * as Domain from '@rankup/rankup/domains/scoring/results/contracts/types.js';

export const operationOwners = {
	getMatchdayResultsSummary: 'api.tournament.results.getMatchdayResultsSummary',
	getMyMatchdayResults: 'api.tournament.results.getMyMatchdayResults',
	getUserMatchdayResults: 'api.tournament.results.getUserMatchdayResults',
} as const;

type GetMyMatchdayResultsParams = Api.paths['/tournaments/{tournamentId}/matchdays/{matchday}/results/me']['get']['parameters']['path'];
type GetMyMatchdayResultsQuery = Api.paths['/tournaments/{tournamentId}/matchdays/{matchday}/results/me']['get']['parameters']['query'];
type GetMyMatchdayResultsResponse = Api.paths['/tournaments/{tournamentId}/matchdays/{matchday}/results/me']['get']['responses']['200']['content']['application/json'];

type GetMyMatchdayResultsOperation = (
	params: GetMyMatchdayResultsParams,
	query?: GetMyMatchdayResultsQuery,
) => Promise<GetMyMatchdayResultsResponse>;

type GetMyTournamentMatchdayStatsOperation = (
	params: Api.GetMyTournamentMatchdayStatsParams,
	query?: Api.GetMyTournamentMatchdayStatsQuery,
) => Promise<Api.GetMyTournamentMatchdayStatsResponse>;

const mapGetMyMatchdayResultsQuery = (query?: Domain.GetMyMatchdayResultsQuery): GetMyMatchdayResultsQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapLegacyGetMyTournamentMatchdayStatsQuery = (
	query?: Domain.GetMyMatchdayResultsQuery,
): Api.GetMyTournamentMatchdayStatsQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class TournamentResultsGateway implements ITournamentResultsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getMyMatchdayResults(
		params: Domain.GetMyMatchdayResultsParams,
		query?: Domain.GetMyMatchdayResultsQuery,
	): Promise<Domain.MatchdayResults> {
		const operationClient = this.apiClient as unknown as Record<string, unknown>;
		const getMyMatchdayResultsOperation = operationClient.getMyMatchdayResults;
		if (typeof getMyMatchdayResultsOperation === 'function') {
			const response = await (getMyMatchdayResultsOperation as GetMyMatchdayResultsOperation)(
				{ tournamentId: params.tournamentId, matchday: params.matchday },
				mapGetMyMatchdayResultsQuery(query),
			);
			return mapMatchdayResults(response);
		}

		const legacyGetMyTournamentMatchdayStats = operationClient.getMyTournamentMatchdayStats;
		if (typeof legacyGetMyTournamentMatchdayStats !== 'function') {
			throw new Error('RankupApiClient does not implement getMyMatchdayResults or getMyTournamentMatchdayStats.');
		}
		const legacyResponse = await (legacyGetMyTournamentMatchdayStats as GetMyTournamentMatchdayStatsOperation)(
			{ tournamentId: params.tournamentId, matchday: params.matchday },
			mapLegacyGetMyTournamentMatchdayStatsQuery(query),
		);
		return mapLegacyUserMatchdayStatsToResults(legacyResponse);
	}
}
