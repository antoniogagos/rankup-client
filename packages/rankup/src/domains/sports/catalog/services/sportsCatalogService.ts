import type { ISportsCatalogService } from '../contracts/sportsCatalog.js';
import type { ISportsCatalogGateway as SportsCatalogGateway } from '../contracts/sportsCatalogGateway.js';
import { ISportsCatalogGateway } from '../contracts/sportsCatalogGateway.js';
import type { Competition, CompetitionPage, GetCompetitionParams, GetCompetitionSeasonParams, GetTeamParams, ListCompetitionSeasonsParams, ListCompetitionsQuery, Season, SeasonList, SportList, Team } from '../contracts/types.js';

export class SportsCatalogService implements ISportsCatalogService {
	public constructor(@ISportsCatalogGateway private readonly gateway: SportsCatalogGateway) {}

	public async listSports(): Promise<SportList> {
		return this.gateway.listSports();
	}

	public async listCompetitions(query?: ListCompetitionsQuery): Promise<CompetitionPage> {
		return this.gateway.listCompetitions(query);
	}

	public async getCompetition(params: GetCompetitionParams): Promise<Competition> {
		return this.gateway.getCompetition(params);
	}

	public async listCompetitionSeasons(params: ListCompetitionSeasonsParams): Promise<SeasonList> {
		return this.gateway.listCompetitionSeasons(params);
	}

	public async getCompetitionSeason(params: GetCompetitionSeasonParams): Promise<Season> {
		return this.gateway.getCompetitionSeason(params);
	}

	public async getTeam(params: GetTeamParams): Promise<Team> {
		return this.gateway.getTeam(params);
	}
}
