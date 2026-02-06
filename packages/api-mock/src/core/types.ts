import type { AuthorizeParams, AuthorizeResponse, ClearMyMatchdaySubmissionParams, CreateDuelRematchParams, CreateDuelRematchRequest, CreateDuelRematchResponse, CreateDuelRequest, CreateDuelResponse, CreateTournamentRequest, CreateTournamentResponse, GetMatchdayMatchesParams, GetMatchdayMatchesQuery, GetMatchdayMatchesResponse, GetMyMatchdaySubmissionParams, GetMyMatchdaySubmissionResponse, GetTournamentMatchdayRankingParams, GetTournamentMatchdayRankingQuery, GetTournamentMatchdayRankingResponse, GetTournamentMatchdayRankingWindowParams, GetTournamentMatchdayRankingWindowQuery, GetTournamentMatchdayRankingWindowResponse, GetTournamentRankingParams, GetTournamentRankingQuery, GetTournamentRankingResponse, GetTournamentRankingWindowParams, GetTournamentRankingWindowQuery, GetTournamentRankingWindowResponse, GetUserMatchdaySubmissionParams, GetUserMatchdaySubmissionResponse, GetUserParams, GetUserQuery, GetUserResponse, ListCompetitionsQuery, ListCompetitionsResponse, ListMatchdaySubmissionsParams, ListMatchdaySubmissionsQuery, ListMatchdaySubmissionsResponse, ListMyDuelsQuery, ListMyDuelsResponse, ListMyTournamentsQuery, ListMyTournamentsResponse, Problem, TokenRequestBody, TokenResponse, UpsertMyMatchdaySubmissionParams, UpsertMyMatchdaySubmissionRequest, UpsertMyMatchdaySubmissionResponse } from '@rankup/api';
import type { MockDb } from '../mock-db.js';

export type OperationId =
	| 'getUserPublicProfile'
	| 'listCompetitions'
	| 'listDiscoverableTournaments'
	| 'listMyTournaments'
	| 'listMyDuels'
	| 'createTournament'
	| 'createDuel'
	| 'createDuelRematch'
	| 'getTournament'
	| 'updateTournament'
	| 'archiveTournament'
	| 'deleteTournament'
	| 'lockTournament'
	| 'unlockTournament'
	| 'unarchiveTournament'
	| 'transferTournamentOwnership'
	| 'getTournamentRules'
	| 'listTournamentSeasonRanking'
	| 'listTournamentMatchdayMatches'
	| 'listTournamentMatchdayRanking'
	| 'getMyTournamentSeasonRankingWindow'
	| 'getMyTournamentMatchdayRankingWindow'
	| 'getMyMatchdayResults'
	| 'getUserMatchdayResults'
	| 'getMatchdayResultsSummary'
	| 'listTournamentUpdates'
	| 'streamTournamentLive'
	| 'listMatchdaySubmissions'
	| 'getMyMatchdaySubmission'
	| 'upsertMyMatchdaySubmission'
	| 'clearMyMatchdaySubmission'
	| 'getUserMatchdaySubmission'
	| 'oauthAuthorize'
	| 'oauthTokenExchange';

export type MockHandlerContextMap = {
	getUserPublicProfile: { params: GetUserParams; query?: GetUserQuery };
	listCompetitions: { query?: ListCompetitionsQuery };
	listDiscoverableTournaments: { query?: Record<string, unknown> };
	listMyTournaments: { query?: ListMyTournamentsQuery };
	listMyDuels: { query?: ListMyDuelsQuery };
	createTournament: { body: CreateTournamentRequest };
	createDuel: { body: CreateDuelRequest };
	createDuelRematch: { params: CreateDuelRematchParams; body?: CreateDuelRematchRequest };
	getTournament: { params: { tournamentId: string }; query?: Record<string, unknown> };
	updateTournament: { params: { tournamentId: string }; body: Record<string, unknown> };
	archiveTournament: { params: { tournamentId: string } };
	deleteTournament: { params: { tournamentId: string }; body?: Record<string, unknown> };
	lockTournament: { params: { tournamentId: string }; body?: Record<string, unknown> };
	unlockTournament: { params: { tournamentId: string } };
	unarchiveTournament: { params: { tournamentId: string } };
	transferTournamentOwnership: { params: { tournamentId: string }; body: { newOwnerUserId: string } };
	getTournamentRules: { params: { tournamentId: string }; query?: Record<string, unknown> };
	listTournamentSeasonRanking: { params: GetTournamentRankingParams; query?: GetTournamentRankingQuery };
	listTournamentMatchdayMatches: { params: GetMatchdayMatchesParams; query?: GetMatchdayMatchesQuery };
	listTournamentMatchdayRanking: { params: GetTournamentMatchdayRankingParams; query?: GetTournamentMatchdayRankingQuery };
	getMyTournamentSeasonRankingWindow: { params: GetTournamentRankingWindowParams; query?: GetTournamentRankingWindowQuery };
	getMyTournamentMatchdayRankingWindow: {
		params: GetTournamentMatchdayRankingWindowParams;
		query?: GetTournamentMatchdayRankingWindowQuery;
	};
	getMyMatchdayResults: { params: { tournamentId: string; matchday: number }; query?: Record<string, unknown> };
	getUserMatchdayResults: { params: { tournamentId: string; matchday: number; userId: string }; query?: Record<string, unknown> };
	getMatchdayResultsSummary: { params: { tournamentId: string; matchday: number }; query?: Record<string, unknown> };
	listTournamentUpdates: { params: { tournamentId: string }; query?: Record<string, unknown> };
	streamTournamentLive: { params: { tournamentId: string }; query?: Record<string, unknown> };
	listMatchdaySubmissions: { params: ListMatchdaySubmissionsParams; query?: ListMatchdaySubmissionsQuery };
	getMyMatchdaySubmission: { params: GetMyMatchdaySubmissionParams };
	upsertMyMatchdaySubmission: { params: UpsertMyMatchdaySubmissionParams; body: UpsertMyMatchdaySubmissionRequest };
	clearMyMatchdaySubmission: { params: ClearMyMatchdaySubmissionParams };
	getUserMatchdaySubmission: { params: GetUserMatchdaySubmissionParams };
	oauthAuthorize: { params: AuthorizeParams };
	oauthTokenExchange: { body: TokenRequestBody };
};

export type MockHandlerResponseMap = {
	getUserPublicProfile: GetUserResponse;
	listCompetitions: ListCompetitionsResponse;
	listDiscoverableTournaments: unknown;
	listMyTournaments: ListMyTournamentsResponse;
	listMyDuels: ListMyDuelsResponse;
	createTournament: CreateTournamentResponse;
	createDuel: CreateDuelResponse;
	createDuelRematch: CreateDuelRematchResponse;
	getTournament: unknown;
	updateTournament: unknown;
	archiveTournament: undefined;
	deleteTournament: unknown;
	lockTournament: undefined;
	unlockTournament: undefined;
	unarchiveTournament: undefined;
	transferTournamentOwnership: unknown;
	getTournamentRules: unknown;
	listTournamentSeasonRanking: GetTournamentRankingResponse;
	listTournamentMatchdayMatches: GetMatchdayMatchesResponse;
	listTournamentMatchdayRanking: GetTournamentMatchdayRankingResponse;
	getMyTournamentSeasonRankingWindow: GetTournamentRankingWindowResponse;
	getMyTournamentMatchdayRankingWindow: GetTournamentMatchdayRankingWindowResponse;
	getMyMatchdayResults: unknown;
	getUserMatchdayResults: unknown;
	getMatchdayResultsSummary: unknown;
	listTournamentUpdates: unknown;
	streamTournamentLive: string;
	listMatchdaySubmissions: ListMatchdaySubmissionsResponse;
	getMyMatchdaySubmission: GetMyMatchdaySubmissionResponse;
	upsertMyMatchdaySubmission: UpsertMyMatchdaySubmissionResponse;
	clearMyMatchdaySubmission: undefined;
	getUserMatchdaySubmission: GetUserMatchdaySubmissionResponse;
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
