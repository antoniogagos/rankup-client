import { validateMatchdayNumber } from '../../shared/validation/validateMatchdayNumber.js';
import type { ITournamentMatchdaysService } from '../contracts/tournamentMatchdays.js';
import type { ITournamentMatchdaysGateway as TournamentMatchdaysGateway } from '../contracts/tournamentMatchdaysGateway.js';
import { ITournamentMatchdaysGateway } from '../contracts/tournamentMatchdaysGateway.js';
import type { GetMatchdayMatchesParams, GetMatchdayMatchesQuery, GetTournamentMatchdayAvailabilityParams, GetTournamentMatchdayParams, ListTournamentMatchdaysParams, ListTournamentMatchdaysQuery, MatchdayAvailability, TournamentMatchday, TournamentMatchdayPage, TournamentMatchPage } from '../contracts/types.js';

export class TournamentMatchdaysService implements ITournamentMatchdaysService {
	public constructor(@ITournamentMatchdaysGateway private readonly gateway: TournamentMatchdaysGateway) {}

	public async listTournamentMatchdays(
		params: ListTournamentMatchdaysParams,
		query?: ListTournamentMatchdaysQuery,
	): Promise<TournamentMatchdayPage> {
		return this.gateway.listTournamentMatchdays(params, query);
	}

	public async getTournamentMatchday(params: GetTournamentMatchdayParams): Promise<TournamentMatchday> {
		validateMatchdayNumber(params.matchday);
		return this.gateway.getTournamentMatchday(params);
	}

	public async getTournamentMatchdayAvailability(params: GetTournamentMatchdayAvailabilityParams): Promise<MatchdayAvailability> {
		validateMatchdayNumber(params.matchday);
		return this.gateway.getTournamentMatchdayAvailability(params);
	}

	public async getMatchdayMatches(params: GetMatchdayMatchesParams, query?: GetMatchdayMatchesQuery): Promise<TournamentMatchPage> {
		validateMatchdayNumber(params.matchday);
		return this.gateway.getMatchdayMatches(params, query);
	}
}
