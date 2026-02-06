import type { IStatsService } from '../contracts/stats.js';
import type { IStatsGateway as StatsGateway } from '../contracts/statsGateway.js';
import { IStatsGateway } from '../contracts/statsGateway.js';
import type { GetMyStatsQuery, GetMyTournamentMatchdayStatsParams, GetMyTournamentMatchdayStatsQuery, GetMyTournamentStatsParams, GetMyTournamentStatsQuery, GetTournamentMatchdayStatsParams, GetTournamentMatchdayStatsQuery, GetTournamentStatsParams, GetTournamentStatsQuery, GetUserStatsParams, GetUserStatsQuery, MatchdayStatsSnapshot, MyStatsSnapshot, PublicUserStatsSnapshot, TournamentStatsSnapshot, UserMatchdayStatsSnapshot, UserTournamentStatsSnapshot } from '../contracts/types.js';

export class StatsService implements IStatsService {
	public constructor(@IStatsGateway private readonly gateway: StatsGateway) {}

	public async getMyStats(query?: GetMyStatsQuery): Promise<MyStatsSnapshot> {
		return this.gateway.getMyStats(query);
	}

	public async getUserStats(params: GetUserStatsParams, query?: GetUserStatsQuery): Promise<PublicUserStatsSnapshot> {
		return this.gateway.getUserStats(params, query);
	}

	public async getTournamentStats(params: GetTournamentStatsParams, query?: GetTournamentStatsQuery): Promise<TournamentStatsSnapshot> {
		return this.gateway.getTournamentStats(params, query);
	}

	public async getMyTournamentStats(params: GetMyTournamentStatsParams, query?: GetMyTournamentStatsQuery): Promise<UserTournamentStatsSnapshot> {
		return this.gateway.getMyTournamentStats(params, query);
	}

	public async getTournamentMatchdayStats(
		params: GetTournamentMatchdayStatsParams,
		query?: GetTournamentMatchdayStatsQuery,
	): Promise<MatchdayStatsSnapshot> {
		return this.gateway.getTournamentMatchdayStats(params, query);
	}

	public async getMyTournamentMatchdayStats(
		params: GetMyTournamentMatchdayStatsParams,
		query?: GetMyTournamentMatchdayStatsQuery,
	): Promise<UserMatchdayStatsSnapshot> {
		return this.gateway.getMyTournamentMatchdayStats(params, query);
	}
}
