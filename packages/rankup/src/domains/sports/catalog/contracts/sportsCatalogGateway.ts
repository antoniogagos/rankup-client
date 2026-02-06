import type { Competition, CompetitionPage, GetCompetitionParams, GetCompetitionSeasonParams, GetTeamParams, ListCompetitionSeasonsParams, ListCompetitionsQuery, Season, SeasonList, SportList, Team } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ISportsCatalogGateway {
	listSports(): Promise<SportList>;
	listCompetitions(query?: ListCompetitionsQuery): Promise<CompetitionPage>;
	getCompetition(params: GetCompetitionParams): Promise<Competition>;
	listCompetitionSeasons(params: ListCompetitionSeasonsParams): Promise<SeasonList>;
	getCompetitionSeason(params: GetCompetitionSeasonParams): Promise<Season>;
	getTeam(params: GetTeamParams): Promise<Team>;
}

export const ISportsCatalogGateway = createDecorator<ISportsCatalogGateway>('sportsCatalogGateway');
