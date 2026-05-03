import type { GetTournamentMatchdayRankingParams, GetTournamentMatchdayRankingQuery, GetTournamentMatchdayRankingWindowParams, GetTournamentMatchdayRankingWindowQuery, GetTournamentRankingParams, GetTournamentRankingQuery, GetTournamentRankingWindowParams, GetTournamentRankingWindowQuery, TournamentRankingPage, TournamentRankingWindow } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITournamentRankingService {
	getTournamentRanking(params: GetTournamentRankingParams, query?: GetTournamentRankingQuery): Promise<TournamentRankingPage>;
	getTournamentRankingWindow(params: GetTournamentRankingWindowParams, query?: GetTournamentRankingWindowQuery): Promise<TournamentRankingWindow>;
	getTournamentMatchdayRanking(params: GetTournamentMatchdayRankingParams, query?: GetTournamentMatchdayRankingQuery): Promise<TournamentRankingPage>;
	getTournamentMatchdayRankingWindow(
		params: GetTournamentMatchdayRankingWindowParams,
		query?: GetTournamentMatchdayRankingWindowQuery,
	): Promise<TournamentRankingWindow>;
}

export const ITournamentRankingService = createDecorator<ITournamentRankingService>('tournamentRankingService');
