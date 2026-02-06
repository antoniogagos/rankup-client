import type { AuthorizeParams, AuthorizeResponse, CreateDuelRematchParams, CreateDuelRematchRequest, CreateDuelRematchResponse, CreateDuelRequest, CreateDuelResponse, CreateTournamentRequest, CreateTournamentResponse, GetMatchdayMatchesParams, GetMatchdayMatchesQuery, GetMatchdayMatchesResponse, GetTournamentRankingParams, GetTournamentRankingQuery, GetTournamentRankingResponse, GetUserParams, GetUserQuery, GetUserResponse, ListCompetitionsQuery, ListCompetitionsResponse, ListMyDuelsQuery, ListMyDuelsResponse, ListMyTournamentsQuery, ListMyTournamentsResponse, Problem, TokenRequestBody, TokenResponse } from '@rankup/api';
import type { MockDb } from '../mock-db.js';

export type OperationId =
	| 'getUserPublicProfile'
	| 'listCompetitions'
	| 'listMyTournaments'
	| 'listMyDuels'
	| 'createTournament'
	| 'createDuel'
	| 'createDuelRematch'
	| 'listTournamentSeasonRanking'
	| 'listTournamentMatchdayMatches'
	| 'oauthAuthorize'
	| 'oauthTokenExchange';

export type MockHandlerContextMap = {
	getUserPublicProfile: { params: GetUserParams; query?: GetUserQuery };
	listCompetitions: { query?: ListCompetitionsQuery };
	listMyTournaments: { query?: ListMyTournamentsQuery };
	listMyDuels: { query?: ListMyDuelsQuery };
	createTournament: { body: CreateTournamentRequest };
	createDuel: { body: CreateDuelRequest };
	createDuelRematch: { params: CreateDuelRematchParams; body?: CreateDuelRematchRequest };
	listTournamentSeasonRanking: { params: GetTournamentRankingParams; query?: GetTournamentRankingQuery };
	listTournamentMatchdayMatches: { params: GetMatchdayMatchesParams; query?: GetMatchdayMatchesQuery };
	oauthAuthorize: { params: AuthorizeParams };
	oauthTokenExchange: { body: TokenRequestBody };
};

export type MockHandlerResponseMap = {
	getUserPublicProfile: GetUserResponse;
	listCompetitions: ListCompetitionsResponse;
	listMyTournaments: ListMyTournamentsResponse;
	listMyDuels: ListMyDuelsResponse;
	createTournament: CreateTournamentResponse;
	createDuel: CreateDuelResponse;
	createDuelRematch: CreateDuelRematchResponse;
	listTournamentSeasonRanking: GetTournamentRankingResponse;
	listTournamentMatchdayMatches: GetMatchdayMatchesResponse;
	oauthAuthorize: AuthorizeResponse;
	oauthTokenExchange: TokenResponse;
};

export type MockHandlerResult<TResponse> = {
	status: number;
	response: TResponse;
};

export type MockErrorResponse = Problem;

export type MockHandler<TContext, TResponse> = (context: TContext, db: MockDb) => MockHandlerResult<TResponse>;

export type MockHandlers = {
	[K in OperationId]: MockHandler<MockHandlerContextMap[K], MockHandlerResponseMap[K]>;
};
