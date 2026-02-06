import { validateMatchdayNumber } from '../../../tournaments/shared/validation/validateMatchdayNumber.js';
import type { ITourneyRankingService } from '../contracts/tourneyRanking.js';
import type { ITourneyRankingGateway as TourneyRankingGateway } from '../contracts/tourneyRankingGateway.js';
import { ITourneyRankingGateway } from '../contracts/tourneyRankingGateway.js';
import type { GetTournamentMatchdayRankingParams, GetTournamentMatchdayRankingQuery, GetTournamentMatchdayRankingWindowParams, GetTournamentMatchdayRankingWindowQuery, GetTournamentRankingParams, GetTournamentRankingQuery, GetTournamentRankingWindowParams, GetTournamentRankingWindowQuery, TournamentRankingPage, TournamentRankingWindow } from '../contracts/types.js';

export class TourneyRankingService implements ITourneyRankingService {
	public constructor(@ITourneyRankingGateway private readonly gateway: TourneyRankingGateway) {}

	public async getTournamentRanking(params: GetTournamentRankingParams, query?: GetTournamentRankingQuery): Promise<TournamentRankingPage> {
		return this.gateway.getTournamentRanking(params, query);
	}

	public async getTournamentRankingWindow(
		params: GetTournamentRankingWindowParams,
		query?: GetTournamentRankingWindowQuery,
	): Promise<TournamentRankingWindow> {
		return this.gateway.getTournamentRankingWindow(params, query);
	}

	public async getTournamentMatchdayRanking(
		params: GetTournamentMatchdayRankingParams,
		query?: GetTournamentMatchdayRankingQuery,
	): Promise<TournamentRankingPage> {
		validateMatchdayNumber(params.matchday);
		return this.gateway.getTournamentMatchdayRanking(params, query);
	}

	public async getTournamentMatchdayRankingWindow(
		params: GetTournamentMatchdayRankingWindowParams,
		query?: GetTournamentMatchdayRankingWindowQuery,
	): Promise<TournamentRankingWindow> {
		validateMatchdayNumber(params.matchday);
		return this.gateway.getTournamentMatchdayRankingWindow(params, query);
	}
}
