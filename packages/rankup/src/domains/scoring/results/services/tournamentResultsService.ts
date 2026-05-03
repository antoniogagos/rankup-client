import { validateMatchdayNumber } from '../../../tournaments/shared/validation/validateMatchdayNumber.js';
import type { ITournamentResultsService } from '../contracts/tournamentResults.js';
import type { ITournamentResultsGateway as TournamentResultsGateway } from '../contracts/tournamentResultsGateway.js';
import { ITournamentResultsGateway } from '../contracts/tournamentResultsGateway.js';
import type { GetMyMatchdayResultsParams, GetMyMatchdayResultsQuery, MatchdayResults } from '../contracts/types.js';

export class TournamentResultsService implements ITournamentResultsService {
	public constructor(@ITournamentResultsGateway private readonly gateway: TournamentResultsGateway) {}

	public async getMyMatchdayResults(
		params: GetMyMatchdayResultsParams,
		query?: GetMyMatchdayResultsQuery,
	): Promise<MatchdayResults> {
		validateMatchdayNumber(params.matchday);
		return this.gateway.getMyMatchdayResults(params, query);
	}
}
