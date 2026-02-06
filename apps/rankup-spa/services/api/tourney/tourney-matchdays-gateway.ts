import { mapMatchdayAvailability, mapTournamentMatchday, mapTournamentMatchdayPage, mapTournamentMatchPage } from './tourney-mappers.js';
import type * as Api from '@rankup/api';
import type { ITourneyMatchdaysGateway } from '@rankup/rankup/domains/tournaments/matchdays/contracts/tourneyMatchdaysGateway.js';
import type * as Domain from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';

const mapListTournamentMatchdaysQuery = (
	query?: Domain.ListTournamentMatchdaysQuery,
): Api.ListTournamentMatchdaysQuery | undefined =>
	query
		? {
				status: query.status,
				fromMatchday: query.fromMatchday,
				toMatchday: query.toMatchday,
				include: query.include ? query.include.slice() : undefined,
				cursor: query.cursor,
				pageSize: query.pageSize,
		  }
		: undefined;

const mapGetMatchdayMatchesQuery = (query?: Domain.GetMatchdayMatchesQuery): Api.GetMatchdayMatchesQuery | undefined =>
	query
		? {
				status: query.status,
				include: query.include ? query.include.slice() : undefined,
		  }
		: undefined;

export class TourneyMatchdaysGateway implements ITourneyMatchdaysGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listTournamentMatchdays(
		params: Domain.ListTournamentMatchdaysParams,
		query?: Domain.ListTournamentMatchdaysQuery,
	): Promise<Domain.TournamentMatchdayPage> {
		const response = await this.apiClient.listTournamentMatchdays(
			{ tournamentId: params.tournamentId },
			mapListTournamentMatchdaysQuery(query),
		);
		return mapTournamentMatchdayPage(response);
	}

	public async getTournamentMatchday(params: Domain.GetTournamentMatchdayParams): Promise<Domain.TournamentMatchday> {
		const response = await this.apiClient.getTournamentMatchday({
			tournamentId: params.tournamentId,
			matchday: params.matchday,
		});
		return mapTournamentMatchday(response);
	}

	public async getTournamentMatchdayAvailability(params: Domain.GetTournamentMatchdayAvailabilityParams): Promise<Domain.MatchdayAvailability> {
		const response = await this.apiClient.getTournamentMatchdayAvailability({
			tournamentId: params.tournamentId,
			matchday: params.matchday,
		});
		return mapMatchdayAvailability(response);
	}

	public async getMatchdayMatches(
		params: Domain.GetMatchdayMatchesParams,
		query?: Domain.GetMatchdayMatchesQuery,
	): Promise<Domain.TournamentMatchPage> {
		const response = await this.apiClient.getMatchdayMatches(
			{ tournamentId: params.tournamentId, matchday: params.matchday },
			mapGetMatchdayMatchesQuery(query),
		);
		return mapTournamentMatchPage(response);
	}
}
