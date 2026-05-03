import type { AuthorizeParams, AuthorizeResponse, ClearMyMatchdaySubmissionParams, CreateDuelRematchParams, CreateDuelRematchRequest, CreateDuelRematchResponse, CreateDuelRequest, CreateDuelResponse, CreateTournamentRequest, CreateTournamentResponse, GetMatchdayMatchesParams, GetMatchdayMatchesQuery, GetMatchdayMatchesResponse, GetMyMatchdaySubmissionParams, GetMyMatchdaySubmissionResponse, GetTournamentMatchdayAvailabilityParams, GetTournamentMatchdayAvailabilityResponse, GetTournamentMatchdayParams, GetTournamentMatchdayRankingParams, GetTournamentMatchdayRankingQuery, GetTournamentMatchdayRankingResponse, GetTournamentMatchdayRankingWindowParams, GetTournamentMatchdayRankingWindowQuery, GetTournamentMatchdayRankingWindowResponse, GetTournamentMatchdayResponse, GetTournamentRankingParams, GetTournamentRankingQuery, GetTournamentRankingResponse, GetTournamentRankingWindowParams, GetTournamentRankingWindowQuery, GetTournamentRankingWindowResponse, GetUserMatchdaySubmissionParams, GetUserMatchdaySubmissionResponse, GetUserParams, GetUserQuery, GetUserResponse, JoinTournamentByInvitationCodeParams, JoinTournamentByInvitationCodeRequest, JoinTournamentByInvitationCodeResponse, JoinTournamentParams, JoinTournamentRequest, JoinTournamentResponse, ListCompetitionsQuery, ListCompetitionsResponse, ListMatchdaySubmissionsParams, ListMatchdaySubmissionsQuery, ListMatchdaySubmissionsResponse, ListMyDuelsQuery, ListMyDuelsResponse, ListMyTournamentsQuery, ListMyTournamentsResponse, ListTournamentMatchdaysParams, ListTournamentMatchdaysQuery, ListTournamentMatchdaysResponse, Problem, TokenRequestBody, TokenResponse, UpsertMyMatchdaySubmissionParams, UpsertMyMatchdaySubmissionRequest, UpsertMyMatchdaySubmissionResponse } from '@rankup/api';
import type { OperationId as OpenApiOperationId } from '@rankup/api/generated/operations.js';
import type { MockDb } from '../mock-db.js';

export type MockHandlerContextMap = {
	getUserPublicProfile: { params: GetUserParams; query?: GetUserQuery };
	listCompetitions: { query?: ListCompetitionsQuery };
	listDiscoverableTournaments: { query?: Record<string, unknown> };
	listMyTournaments: { query?: ListMyTournamentsQuery };
	listMyDuels: { query?: ListMyDuelsQuery };
	createTournament: { body: CreateTournamentRequest };
	createDuel: { body: CreateDuelRequest };
	createDuelRematch: { params: CreateDuelRematchParams; body?: CreateDuelRematchRequest };
	joinTournament: { params: JoinTournamentParams; body?: JoinTournamentRequest; headers?: { idempotencyKey?: string } };
	joinTournamentByInvitationCode: {
		params: JoinTournamentByInvitationCodeParams;
		body?: JoinTournamentByInvitationCodeRequest;
		headers?: { idempotencyKey?: string };
	};
	getTournament: { params: { tournamentId: string }; query?: Record<string, unknown> };
	listTournamentMatchdays: { params: ListTournamentMatchdaysParams; query?: ListTournamentMatchdaysQuery };
	getTournamentMatchday: { params: GetTournamentMatchdayParams };
	getTournamentMatchdayAvailability: { params: GetTournamentMatchdayAvailabilityParams };
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
	clearMyMatchdaySubmission: { params: ClearMyMatchdaySubmissionParams; headers?: { idempotencyKey?: string } };
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
	joinTournament: JoinTournamentResponse;
	joinTournamentByInvitationCode: JoinTournamentByInvitationCodeResponse;
	getTournament: unknown;
	listTournamentMatchdays: ListTournamentMatchdaysResponse;
	getTournamentMatchday: GetTournamentMatchdayResponse;
	getTournamentMatchdayAvailability: GetTournamentMatchdayAvailabilityResponse;
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

type AssertNever<T extends never> = T;
type ContextOperationId = keyof MockHandlerContextMap;
type ResponseOperationId = keyof MockHandlerResponseMap;
type _UnknownContextOperationIds = Exclude<ContextOperationId, OpenApiOperationId>;
type _UnknownResponseOperationIds = Exclude<ResponseOperationId, OpenApiOperationId>;
type _MissingResponseOperationIds = Exclude<ContextOperationId, ResponseOperationId>;
type _MissingContextOperationIds = Exclude<ResponseOperationId, ContextOperationId>;

export type OperationIdConsistencyGuard =
	| AssertNever<_UnknownContextOperationIds>
	| AssertNever<_UnknownResponseOperationIds>
	| AssertNever<_MissingResponseOperationIds>
	| AssertNever<_MissingContextOperationIds>;

export type OperationId = Extract<ContextOperationId & ResponseOperationId, OpenApiOperationId>;

export type MockHandlerResult<TResponse> = {
	status: number;
	response: TResponse;
	headers?: Record<string, string>;
};

export type MockErrorResponse = Problem;

export type MockHandler<TContext, TResponse> = (
	context: TContext,
	db: MockDb,
) => MockHandlerResult<TResponse> | Promise<MockHandlerResult<TResponse>>;

export type MockHandlers = {
	[K in OperationId]: MockHandler<MockHandlerContextMap[K], MockHandlerResponseMap[K]>;
};
