import { mapMatchdayStatsSnapshot, mapMyStatsSnapshot, mapPublicUserStatsSnapshot, mapTournamentStatsSnapshot, mapUserMatchdayStatsSnapshot, mapUserTournamentStatsSnapshot } from './stats-mappers.js';
import type * as Api from '@rankup/api';
import type { IStatsGateway } from '@rankup/rankup/domains/engagement/stats/contracts/statsGateway.js';
import type * as Domain from '@rankup/rankup/domains/engagement/stats/contracts/types.js';

const mapGetMyStatsQuery = (query?: Domain.GetMyStatsQuery): Api.GetMyStatsQuery | undefined =>
	query
		? {
			gameModeId: query.gameModeId,
			sportId: query.sportId,
			verifiedOnly: query.verifiedOnly,
			timeframe: query.timeframe,
			from: query.from,
			to: query.to,
			include: query.include,
		}
		: undefined;

const mapGetUserStatsQuery = (query?: Domain.GetUserStatsQuery): Api.GetUserStatsQuery | undefined =>
	query
		? {
			gameModeId: query.gameModeId,
			sportId: query.sportId,
			verifiedOnly: query.verifiedOnly,
			timeframe: query.timeframe,
		}
		: undefined;

const mapGetTournamentStatsQuery = (query?: Domain.GetTournamentStatsQuery): Api.GetTournamentStatsQuery | undefined =>
	query
		? {
			verifiedOnly: query.verifiedOnly,
			include: query.include,
		}
		: undefined;

const mapGetMyTournamentStatsQuery = (
	query?: Domain.GetMyTournamentStatsQuery,
): Api.GetMyTournamentStatsQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapGetTournamentMatchdayStatsQuery = (
	query?: Domain.GetTournamentMatchdayStatsQuery,
): Api.GetTournamentMatchdayStatsQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapGetMyTournamentMatchdayStatsQuery = (
	query?: Domain.GetMyTournamentMatchdayStatsQuery,
): Api.GetMyTournamentMatchdayStatsQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class StatsGateway implements IStatsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getMyStats(query?: Domain.GetMyStatsQuery): Promise<Domain.MyStatsSnapshot> {
		const response = await this.apiClient.getMyStats(mapGetMyStatsQuery(query));
		return mapMyStatsSnapshot(response);
	}

	public async getUserStats(params: Domain.GetUserStatsParams, query?: Domain.GetUserStatsQuery): Promise<Domain.PublicUserStatsSnapshot> {
		const response = await this.apiClient.getUserStats({ userId: params.userId }, mapGetUserStatsQuery(query));
		return mapPublicUserStatsSnapshot(response);
	}

	public async getTournamentStats(
		params: Domain.GetTournamentStatsParams,
		query?: Domain.GetTournamentStatsQuery,
	): Promise<Domain.TournamentStatsSnapshot> {
		const response = await this.apiClient.getTournamentStats(
			{ tournamentId: params.tournamentId },
			mapGetTournamentStatsQuery(query),
		);
		return mapTournamentStatsSnapshot(response);
	}

	public async getMyTournamentStats(
		params: Domain.GetMyTournamentStatsParams,
		query?: Domain.GetMyTournamentStatsQuery,
	): Promise<Domain.UserTournamentStatsSnapshot> {
		const response = await this.apiClient.getMyTournamentStats(
			{ tournamentId: params.tournamentId },
			mapGetMyTournamentStatsQuery(query),
		);
		return mapUserTournamentStatsSnapshot(response);
	}

	public async getTournamentMatchdayStats(
		params: Domain.GetTournamentMatchdayStatsParams,
		query?: Domain.GetTournamentMatchdayStatsQuery,
	): Promise<Domain.MatchdayStatsSnapshot> {
		const response = await this.apiClient.getTournamentMatchdayStats(
			{ tournamentId: params.tournamentId, matchday: params.matchday },
			mapGetTournamentMatchdayStatsQuery(query),
		);
		return mapMatchdayStatsSnapshot(response);
	}

	public async getMyTournamentMatchdayStats(
		params: Domain.GetMyTournamentMatchdayStatsParams,
		query?: Domain.GetMyTournamentMatchdayStatsQuery,
	): Promise<Domain.UserMatchdayStatsSnapshot> {
		const response = await this.apiClient.getMyTournamentMatchdayStats(
			{ tournamentId: params.tournamentId, matchday: params.matchday },
			mapGetMyTournamentMatchdayStatsQuery(query),
		);
		return mapUserMatchdayStatsSnapshot(response);
	}
}
