import type { GetMyStatsQuery, GetMyTournamentMatchdayStatsParams, GetMyTournamentMatchdayStatsQuery, GetMyTournamentStatsParams, GetMyTournamentStatsQuery, GetTournamentMatchdayStatsParams, GetTournamentMatchdayStatsQuery, GetTournamentStatsParams, GetTournamentStatsQuery, GetUserStatsParams, GetUserStatsQuery, MatchdayStatsSnapshot, MyStatsSnapshot, PublicUserStatsSnapshot, TournamentStatsSnapshot, UserMatchdayStatsSnapshot, UserTournamentStatsSnapshot } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IStatsGateway {
	getMyStats(query?: GetMyStatsQuery): Promise<MyStatsSnapshot>;
	getUserStats(params: GetUserStatsParams, query?: GetUserStatsQuery): Promise<PublicUserStatsSnapshot>;
	getTournamentStats(params: GetTournamentStatsParams, query?: GetTournamentStatsQuery): Promise<TournamentStatsSnapshot>;
	getMyTournamentStats(params: GetMyTournamentStatsParams, query?: GetMyTournamentStatsQuery): Promise<UserTournamentStatsSnapshot>;
	getTournamentMatchdayStats(params: GetTournamentMatchdayStatsParams, query?: GetTournamentMatchdayStatsQuery): Promise<MatchdayStatsSnapshot>;
	getMyTournamentMatchdayStats(
		params: GetMyTournamentMatchdayStatsParams,
		query?: GetMyTournamentMatchdayStatsQuery,
	): Promise<UserMatchdayStatsSnapshot>;
}

export const IStatsGateway = createDecorator<IStatsGateway>('statsGateway');
