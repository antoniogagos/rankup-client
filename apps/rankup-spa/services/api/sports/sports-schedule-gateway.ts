import { mapMatch, mapMatchdayList, mapMatchEventPage, mapMatchPage, mapSearchMatchPage } from './sports-mappers.js';
import type * as Api from '@rankup/api';
import type { ISportsScheduleGateway } from '@rankup/rankup/domains/sports/schedule/contracts/sportsScheduleGateway.js';
import type * as Domain from '@rankup/rankup/domains/sports/schedule/contracts/types.js';

const mapListMatchdaysQuery = (query?: Domain.ListMatchdaysQuery): Api.ListMatchdaysQuery | undefined =>
	query
		? {
			status: query.status,
		}
		: undefined;

const mapListMatchdayMatchesQuery = (query?: Domain.ListMatchdayMatchesQuery): Api.ListMatchdayMatchesQuery | undefined =>
	query
		? {
			status: query.status,
			include: query.include ? query.include.slice() : undefined,
		}
		: undefined;

const mapSearchMatchesQuery = (query?: Domain.SearchMatchesQuery): Api.SearchMatchesQuery | undefined =>
	query
		? {
			sportId: query.sportId,
			competitionId: query.competitionId,
			seasonId: query.seasonId,
			matchday: query.matchday,
			teamId: query.teamId,
			status: query.status,
			from: query.from,
			to: query.to,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapListMatchEventsQuery = (query?: Domain.ListMatchEventsQuery): Api.ListMatchEventsQuery | undefined =>
	query
		? {
			since: query.since,
			order: query.order,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

export class SportsScheduleGateway implements ISportsScheduleGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listMatchdays(params: Domain.ListMatchdaysParams, query?: Domain.ListMatchdaysQuery): Promise<Domain.MatchdayList> {
		const response = await this.apiClient.listMatchdays(
			{
				competitionId: params.competitionId,
				seasonId: params.seasonId,
			},
			mapListMatchdaysQuery(query),
		);
		return mapMatchdayList(response);
	}

	public async listMatchdayMatches(
		params: Domain.ListMatchdayMatchesParams,
		query?: Domain.ListMatchdayMatchesQuery,
	): Promise<Domain.MatchPage> {
		const response = await this.apiClient.listMatchdayMatches(
			{
				competitionId: params.competitionId,
				seasonId: params.seasonId,
				matchday: params.matchday,
			},
			mapListMatchdayMatchesQuery(query),
		);
		return mapMatchPage(response);
	}

	public async searchMatches(query?: Domain.SearchMatchesQuery): Promise<Domain.MatchPage> {
		const response = await this.apiClient.searchMatches(mapSearchMatchesQuery(query));
		return mapSearchMatchPage(response);
	}

	public async getMatch(params: Domain.GetMatchParams): Promise<Domain.Match> {
		const response = await this.apiClient.getMatch({ matchId: params.matchId });
		return mapMatch(response);
	}

	public async listMatchEvents(
		params: Domain.ListMatchEventsParams,
		query?: Domain.ListMatchEventsQuery,
	): Promise<Domain.MatchEventPage> {
		const response = await this.apiClient.listMatchEvents({ matchId: params.matchId }, mapListMatchEventsQuery(query));
		return mapMatchEventPage(response);
	}
}
