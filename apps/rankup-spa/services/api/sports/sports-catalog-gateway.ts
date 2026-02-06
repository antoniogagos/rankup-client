import { mapCompetition, mapCompetitionPage, mapSeason, mapSeasonList, mapSportList, mapTeam } from './sports-mappers.js';
import type * as Api from '@rankup/api';
import type { ISportsCatalogGateway } from '@rankup/rankup/domains/sports/catalog/contracts/sportsCatalogGateway.js';
import type * as Domain from '@rankup/rankup/domains/sports/catalog/contracts/types.js';

const mapListCompetitionsQuery = (query?: Domain.ListCompetitionsQuery): Api.ListCompetitionsQuery | undefined =>
	query
		? {
			sportId: query.sportId,
			type: query.type,
			status: query.status,
			countryCode: query.countryCode,
			q: query.q,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

export class SportsCatalogGateway implements ISportsCatalogGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listSports(): Promise<Domain.SportList> {
		const response = await this.apiClient.listSports();
		return mapSportList(response);
	}

	public async listCompetitions(query?: Domain.ListCompetitionsQuery): Promise<Domain.CompetitionPage> {
		const response = await this.apiClient.listCompetitions(mapListCompetitionsQuery(query));
		return mapCompetitionPage(response);
	}

	public async getCompetition(params: Domain.GetCompetitionParams): Promise<Domain.Competition> {
		const response = await this.apiClient.getCompetition({ competitionId: params.competitionId });
		return mapCompetition(response);
	}

	public async listCompetitionSeasons(params: Domain.ListCompetitionSeasonsParams): Promise<Domain.SeasonList> {
		const response = await this.apiClient.listCompetitionSeasons({ competitionId: params.competitionId });
		return mapSeasonList(response);
	}

	public async getCompetitionSeason(params: Domain.GetCompetitionSeasonParams): Promise<Domain.Season> {
		const response = await this.apiClient.getCompetitionSeason({
			competitionId: params.competitionId,
			seasonId: params.seasonId,
		});
		return mapSeason(response);
	}

	public async getTeam(params: Domain.GetTeamParams): Promise<Domain.Team> {
		const response = await this.apiClient.getTeam({ teamId: params.teamId });
		return mapTeam(response);
	}
}
