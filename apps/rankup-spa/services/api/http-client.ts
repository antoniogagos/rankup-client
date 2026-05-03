import type { AcceptMyTournamentInviteParams, AcceptMyTournamentInviteRequest, AcceptMyTournamentInviteResponse, AuthorizeParams, AuthorizeResponse, CancelTournamentInviteParams, CreateDuelRematchParams, CreateDuelRematchRequest, CreateDuelRematchResponse, CreateDuelRequest, CreateDuelResponse, CreateInvitationCodeRequest, CreateTournamentInvitationCodeParams, CreateTournamentInvitationCodeResponse, CreateTournamentInvitesParams, CreateTournamentInvitesRequest, CreateTournamentInvitesResponse, CreateTournamentRequest, CreateTournamentResponse, DeclineMyTournamentInviteParams, DeclineMyTournamentInviteRequest, DeclineMyTournamentInviteResponse, GetCompetitionParams, GetCompetitionResponse, GetCompetitionSeasonParams, GetCompetitionSeasonResponse, GetGameModeParams, GetGameModeResponse, GetMatchdayMatchesParams, GetMatchdayMatchesQuery, GetMatchdayMatchesResponse, ListMatchdaySubmissionsParams, ListMatchdaySubmissionsQuery, ListMatchdaySubmissionsResponse, GetMyMatchdaySubmissionParams, GetMyMatchdaySubmissionResponse, UpsertMyMatchdaySubmissionParams, UpsertMyMatchdaySubmissionRequest, UpsertMyMatchdaySubmissionResponse, ClearMyMatchdaySubmissionParams, GetUserMatchdaySubmissionParams, GetUserMatchdaySubmissionResponse, GetMatchParams, GetMatchResponse, GetMyTournamentInviteParams, GetMyTournamentInviteQuery, GetMyTournamentInviteResponse, GetMyTournamentInviteUnreadCountResponse, GetRulesetParams, GetRulesetResponse, GetTeamParams, GetTeamResponse, GetTournamentMatchdayAvailabilityParams, GetTournamentMatchdayAvailabilityResponse, GetTournamentMatchdayParams, GetTournamentMatchdayRankingParams, GetTournamentMatchdayRankingQuery, GetTournamentMatchdayRankingResponse, GetTournamentMatchdayRankingWindowParams, GetTournamentMatchdayRankingWindowQuery, GetTournamentMatchdayRankingWindowResponse, GetTournamentMatchdayResponse, GetTournamentPreviewParams, GetTournamentPreviewQuery, GetTournamentPreviewResponse, GetTournamentRankingParams, GetTournamentRankingQuery, GetTournamentRankingResponse, GetTournamentRankingWindowParams, GetTournamentRankingWindowQuery, GetTournamentRankingWindowResponse, GetUserParams, GetUserQuery, GetUserResponse, GetVerifiedEventParams, GetVerifiedEventQuery, GetVerifiedEventResponse, GetVerifiedHubQuery, GetVerifiedHubResponse, GetVerifiedTournamentPreviewParams, GetVerifiedTournamentPreviewResponse, HideMyTournamentInviteParams, JoinTournamentByInvitationCodeParams, JoinTournamentByInvitationCodeRequest, JoinTournamentByInvitationCodeResponse, JoinTournamentParams, JoinTournamentRequest, JoinTournamentResponse, LeaveTournamentParams, ListCompetitionSeasonsParams, ListCompetitionSeasonsResponse, ListCompetitionsQuery, ListCompetitionsResponse, ListGameModesQuery, ListGameModesResponse, ListMatchdayMatchesParams, ListMatchdayMatchesQuery, ListMatchdayMatchesResponse, ListMatchdaysParams, ListMatchdaysQuery, ListMatchdaysResponse, ListMatchEventsParams, ListMatchEventsQuery, ListMatchEventsResponse, ListMyDuelsQuery, ListMyDuelsResponse, ListMyTournamentInvitesQuery, ListMyTournamentInvitesResponse, ListMyTournamentsQuery, ListMyTournamentsResponse, ListRulesetsQuery, ListRulesetsResponse, ListSportsResponse, RegisterUserRequest, RegisterUserResponse, ConfirmRegistrationRequest, ConfirmRegistrationResponse, ResendConfirmationRequest, CreateSessionRequest, CreateSessionResponse, RefreshSessionRequest, RefreshSessionResponse, RequestPasswordResetRequest, ConfirmPasswordResetRequest, GetMeResponse, UpdateMeRequest, UpdateMeResponse, SearchUsersQuery, SearchUsersResponse, ResolveUserByUsernameParams, ResolveUserByUsernameResponse, GetMyRelationshipParams, GetMyRelationshipResponse, ListMyFriendsQuery, ListMyFriendsResponse, ListMyFollowersQuery, ListMyFollowersResponse, ListMyFollowingQuery, ListMyFollowingResponse, FollowUserParams, FollowUserResponse, UnfollowUserParams, ListTournamentInvitationCodesParams, ListTournamentInvitationCodesQuery, ListTournamentInvitationCodesResponse, ListTournamentInvitesParams, ListTournamentInvitesQuery, ListTournamentInvitesResponse, ListTournamentMatchdaysParams, ListTournamentMatchdaysQuery, ListTournamentMatchdaysResponse, ListTournamentMembersParams, ListTournamentMembersQuery, ListTournamentMembersResponse, ListVerifiedEventTournamentsParams, ListVerifiedEventTournamentsQuery, ListVerifiedEventTournamentsResponse, ListVerifiedEventsQuery, ListVerifiedEventsResponse, ListVerifiedTournamentsQuery, ListVerifiedTournamentsResponse, MarkMyTournamentInviteSeenParams, BatchUpdateMyNotificationsRequest, BatchUpdateMyNotificationsResponse, DismissMyNotificationParams, DeleteTournamentChatMessageParams, DeleteTournamentChatMessageRequest, EditTournamentChatMessageParams, EditTournamentChatMessageRequest, EditTournamentChatMessageResponse, GetMyFeedItemParams, GetMyFeedItemResponse, GetMyFeedReadCursorResponse, GetMyNotificationParams, GetMyNotificationQuery, GetMyNotificationResponse, GetMyNotificationUnreadCountQuery, GetMyNotificationUnreadCountResponse, GetMyRecapParams, GetMyRecapResponse, GetMyStatsQuery, GetMyStatsResponse, GetMyTournamentMatchdayStatsParams, GetMyTournamentMatchdayStatsQuery, GetMyTournamentMatchdayStatsResponse, GetMyTournamentStatsParams, GetMyTournamentStatsQuery, GetMyTournamentStatsResponse, GetTournamentChatMessageParams, GetTournamentChatMessageResponse, GetTournamentChatParams, GetTournamentChatResponse, GetTournamentChatReadCursorParams, GetTournamentChatReadCursorResponse, GetTournamentChatUnreadCountParams, GetTournamentChatUnreadCountResponse, GetTournamentMatchdayStatsParams, GetTournamentMatchdayStatsQuery, GetTournamentMatchdayStatsResponse, GetTournamentRecapParams, GetTournamentRecapQuery, GetTournamentRecapResponse, GetTournamentStatsParams, GetTournamentStatsQuery, GetTournamentStatsResponse, GetUserStatsParams, GetUserStatsQuery, GetUserStatsResponse, HideMyRecapParams, ListMyFeedQuery, ListMyFeedResponse, ListMyNotificationsQuery, ListMyNotificationsResponse, ListMyRecapsQuery, ListMyRecapsResponse, ListMyUpdatesQuery, ListMyUpdatesResponse, ListTournamentChatMessagesParams, ListTournamentChatMessagesQuery, ListTournamentChatMessagesResponse, ListTournamentChatMutesParams, ListTournamentChatMutesQuery, ListTournamentChatMutesResponse, ListTournamentChatPinsParams, ListTournamentChatPinsResponse, ListTournamentChatUpdatesParams, ListTournamentChatUpdatesQuery, ListTournamentChatUpdatesResponse, ListTournamentRecapsParams, ListTournamentRecapsQuery, ListTournamentRecapsResponse, MarkMyNotificationReadParams, MarkMyNotificationSeenParams, MuteTournamentChatUserParams, MuteTournamentChatUserRequest, MuteTournamentChatUserResponse, PinTournamentChatMessageParams, PinTournamentChatMessageRequest, PinTournamentChatMessageResponse, ReportTournamentChatContentParams, ReportTournamentChatContentRequest, ReportTournamentChatContentResponse, RequestMyRecapRequest, RequestMyRecapResponse, SendTournamentChatMessageParams, SendTournamentChatMessageRequest, SendTournamentChatMessageResponse, StreamMyLiveUpdatesQuery, StreamMyLiveUpdatesResponse, StreamTournamentChatLiveParams, StreamTournamentChatLiveResponse, UnpinTournamentChatMessageParams, UnmuteTournamentChatUserParams, UpdateMyFeedReadCursorRequest, UpdateMyFeedReadCursorResponse, UpdateTournamentChatReadCursorParams, UpdateTournamentChatReadCursorRequest, UpdateTournamentChatReadCursorResponse, UpdateTournamentChatSettingsParams, UpdateTournamentChatSettingsRequest, UpdateTournamentChatSettingsResponse, RemoveTournamentMemberParams, RemoveTournamentMemberRequest, ResolveInvitationCodeParams, ResolveInvitationCodeResponse, SearchMatchesQuery, SearchMatchesResponse, TokenRequestBody, TokenResponse, UpdateTournamentMemberParams, UpdateTournamentMemberRequest, UpdateTournamentMemberResponse, GetRankedMetaQuery, GetRankedMetaResponse, ListRankedTracksQuery, ListRankedTracksResponse, GetRankedTrackParams, GetRankedTrackQuery, GetRankedTrackResponse, ListRankedSeasonsParams, ListRankedSeasonsQuery, ListRankedSeasonsResponse, GetRankedSeasonParams, GetRankedSeasonQuery, GetRankedSeasonResponse, GetRankedLeaderboardParams, GetRankedLeaderboardQuery, GetRankedLeaderboardResponse, GetRankedSeasonLeaderboardParams, GetRankedSeasonLeaderboardQuery, GetRankedSeasonLeaderboardResponse, GetMyRankedProfileQuery, GetMyRankedProfileResponse, GetMyRankedSettingsResponse, UpdateMyRankedSettingsRequest, UpdateMyRankedSettingsResponse, GetMyRankedTrackParams, GetMyRankedTrackQuery, GetMyRankedTrackResponse, ListMyRankedHistoryParams, ListMyRankedHistoryQuery, ListMyRankedHistoryResponse, GetUserRankedProfileParams, GetUserRankedProfileQuery, GetUserRankedProfileResponse, GetUserRankedTrackParams, GetUserRankedTrackQuery, GetUserRankedTrackResponse, GetAchievementMetaQuery, GetAchievementMetaResponse, ListAchievementDefinitionsQuery, ListAchievementDefinitionsResponse, GetAchievementDefinitionParams, GetAchievementDefinitionQuery, GetAchievementDefinitionResponse, ListMyAchievementsQuery, ListMyAchievementsResponse, ListMyUnlockedAchievementsQuery, ListMyUnlockedAchievementsResponse, GetMyAchievementParams, GetMyAchievementQuery, GetMyAchievementResponse, ListUserAchievementsParams, ListUserAchievementsQuery, ListUserAchievementsResponse, CreateUploadRequest, CreateUploadResponse, GetUploadParams, GetUploadResponse, AbortUploadParams, CompleteUploadParams, CompleteUploadRequest, CompleteUploadResponse, GetMediaParams, GetMediaQuery, GetMediaResponse, DeleteMediaParams, ListTrustPoliciesQuery, ListTrustPoliciesResponse, GetTrustPolicyParams, GetTrustPolicyResponse, GetMyEnforcementStatusResponse, ListMyAppealsQuery, ListMyAppealsResponse, CreateMyAppealRequest, CreateMyAppealResponse, GetMyAppealParams, GetMyAppealResponse, ListMyReportsQuery, ListMyReportsResponse, CreateReportRequest, CreateReportResponse, GetMyReportParams, GetMyReportResponse, ListMyTrustBlocksQuery, ListMyTrustBlocksResponse, ListPromotionsQuery, ListPromotionsResponse, GetPromotionParams, GetPromotionQuery, GetPromotionResponse, ListPromotionWinnersParams, ListPromotionWinnersQuery, ListPromotionWinnersResponse, GetMyPromotionStatusParams, GetMyPromotionStatusResponse, OptInToPromotionParams, OptInToPromotionRequest, OptInToPromotionResponse, OptOutFromPromotionParams, ListMyPromotionsQuery, ListMyPromotionsResponse, ListMyRewardsQuery, ListMyRewardsResponse, GetMyRewardParams, GetMyRewardQuery, GetMyRewardResponse, ClaimMyRewardParams, ClaimMyRewardRequest, ClaimMyRewardResponse, GetMyRewardFulfillmentProfileResponse, UpdateMyRewardFulfillmentProfileRequest, UpdateMyRewardFulfillmentProfileResponse, ListCreatorsQuery, ListCreatorsResponse, GetCreatorParams, GetCreatorQuery, GetCreatorResponse, GetCreatorHubParams, GetCreatorHubQuery, GetCreatorHubResponse, ListCreatorEventsParams, ListCreatorEventsQuery, ListCreatorEventsResponse, ListCreatorTournamentsParams, ListCreatorTournamentsQuery, ListCreatorTournamentsResponse, ListCreatorCollectionsParams, ListCreatorCollectionsQuery, ListCreatorCollectionsResponse, GetCreatorCollectionParams, GetCreatorCollectionQuery, GetCreatorCollectionResponse, RankupApiClient } from '@rankup/api';
import { operations } from '@rankup/api/generated/operations.js';
import { mapProblemToDomainError } from './problem/mapProblemToDomainError.js';

export type HttpClientOptions = {
	apiBaseUrl: string;
	authBaseUrl?: string;
	getAccessToken?: () => string | null | undefined;
	fetchFn?: typeof fetch;
};

function normalizeBaseUrl(value: string): string {
	return value.replace(/\/$/, '');
}

function createHeaders(getAccessToken?: () => string | null | undefined): HeadersInit {
	const token = getAccessToken?.();
	if (!token) {
		return {};
	}
	return { Authorization: `Bearer ${token}` };
}

function createJsonHeaders(getAccessToken?: () => string | null | undefined): HeadersInit {
	return {
		...createHeaders(getAccessToken),
		'Content-Type': 'application/json',
	};
}

function applyQuery(url: URL, query?: Record<string, unknown>): void {
	if (!query) {
		return;
	}
	Object.entries(query).forEach(([key, value]) => {
		if (value === undefined || value === null) {
			return;
		}
		if (Array.isArray(value)) {
			url.searchParams.set(key, value.map(item => String(item)).join(','));
			return;
		}
		url.searchParams.set(key, String(value));
	});
}

function normalizeContentType(value: string | null | undefined): string {
	if (!value) {
		return '';
	}
	return value.split(';')[0]?.trim().toLowerCase();
}

function buildPathFromTemplate(pathTemplate: string, params?: Record<string, unknown>): string {
	return pathTemplate.replace(/\{([^}]+)\}/g, (_match, key) => {
		const value = params?.[key];
		if (value === undefined || value === null) {
			throw new Error(`Missing path param ${key}`);
		}
		return encodeURIComponent(String(value));
	});
}

function hasPathParams(pathTemplate: string): boolean {
	return /\{[^}]+\}/.test(pathTemplate);
}

function toHttpStatusTitle(status: number, statusText: string): string {
	return statusText || `HTTP ${status}`;
}

function normalizeHttpErrorPayload(payload: unknown, response: Response): Record<string, unknown> {
	const title = toHttpStatusTitle(response.status, response.statusText);
	if (typeof payload === 'string') {
		return {
			status: response.status,
			title,
			detail: payload,
		};
	}
	if (typeof payload === 'object' && payload !== null) {
		const normalized = { ...(payload as Record<string, unknown>) };
		if (typeof normalized.status !== 'number') {
			normalized.status = response.status;
		}
		if (typeof normalized.title !== 'string') {
			normalized.title = title;
		}
		if (typeof normalized.detail !== 'string' && typeof normalized.message === 'string') {
			normalized.detail = normalized.message;
		}
		return normalized;
	}
	return {
		status: response.status,
		title,
	};
}

async function readHttpErrorPayload(response: Response): Promise<unknown> {
	const contentType = normalizeContentType(response.headers.get('content-type'));
	if (contentType.includes('json') || contentType.endsWith('+json')) {
		return response.json().catch(() => undefined);
	}
	return response.text().catch(() => '');
}

async function throwHttpProblem(response: Response): Promise<never> {
	const payload = await readHttpErrorPayload(response);
	const normalizedPayload = normalizeHttpErrorPayload(payload, response);
	throw mapProblemToDomainError(normalizedPayload);
}

export function createHttpRankupApiClient(options: HttpClientOptions): RankupApiClient {
	const apiBaseUrl = normalizeBaseUrl(options.apiBaseUrl);
	const authBaseUrl = options.authBaseUrl ? normalizeBaseUrl(options.authBaseUrl) : '';
	const fetchFn = options.fetchFn ?? fetch;

	async function getJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
		const resp = await fetchFn(input, init);
		if (!resp.ok) {
			await throwHttpProblem(resp);
		}
		return (await resp.json()) as T;
	}

	async function getText(input: RequestInfo, init?: RequestInit): Promise<string> {
		const resp = await fetchFn(input, init);
		if (!resp.ok) {
			await throwHttpProblem(resp);
		}
		return resp.text();
	}

	async function sendVoid(input: RequestInfo, init?: RequestInit): Promise<void> {
		const resp = await fetchFn(input, init);
		if (!resp.ok) {
			await throwHttpProblem(resp);
		}
	}

	const client: RankupApiClient = {
		async getUser(params: GetUserParams, query?: GetUserQuery): Promise<GetUserResponse> {
			const url = new URL(`${apiBaseUrl}/users/${encodeURIComponent(params.userId)}`);
			applyQuery(url, query);
			return getJson<GetUserResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listSports(): Promise<ListSportsResponse> {
			const url = new URL(`${apiBaseUrl}/sports`);
			return getJson<ListSportsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async registerUser(body: RegisterUserRequest): Promise<RegisterUserResponse> {
			const url = new URL(`${authBaseUrl || apiBaseUrl}/auth/registrations`);
			return getJson<RegisterUserResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(),
			});
		},
		async confirmRegistration(body: ConfirmRegistrationRequest): Promise<ConfirmRegistrationResponse> {
			const url = new URL(`${authBaseUrl || apiBaseUrl}/auth/registrations/confirm`);
			return getJson<ConfirmRegistrationResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(),
			});
		},
		async resendRegistrationConfirmation(body: ResendConfirmationRequest): Promise<void> {
			const url = new URL(`${authBaseUrl || apiBaseUrl}/auth/registrations/resend-confirmation`);
			return sendVoid(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(),
			});
		},
		async createSession(body: CreateSessionRequest): Promise<CreateSessionResponse> {
			const url = new URL(`${authBaseUrl || apiBaseUrl}/auth/sessions`);
			return getJson<CreateSessionResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(),
			});
		},
		async refreshSession(body: RefreshSessionRequest): Promise<RefreshSessionResponse> {
			const url = new URL(`${authBaseUrl || apiBaseUrl}/auth/sessions/refresh`);
			return getJson<RefreshSessionResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(),
			});
		},
		async logout(): Promise<void> {
			const url = new URL(`${authBaseUrl || apiBaseUrl}/auth/sessions/me`);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async requestPasswordReset(body: RequestPasswordResetRequest): Promise<void> {
			const url = new URL(`${authBaseUrl || apiBaseUrl}/auth/password-resets`);
			return sendVoid(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(),
			});
		},
		async confirmPasswordReset(body: ConfirmPasswordResetRequest): Promise<void> {
			const url = new URL(`${authBaseUrl || apiBaseUrl}/auth/password-resets/confirm`);
			return sendVoid(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(),
			});
		},
		async getMe(): Promise<GetMeResponse> {
			const url = new URL(`${apiBaseUrl}/me`);
			return getJson<GetMeResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async updateMe(body: UpdateMeRequest): Promise<UpdateMeResponse> {
			const url = new URL(`${apiBaseUrl}/me`);
			return getJson<UpdateMeResponse>(url.toString(), {
				method: 'PATCH',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async searchUsers(query: SearchUsersQuery): Promise<SearchUsersResponse> {
			const url = new URL(`${apiBaseUrl}/users`);
			applyQuery(url, query);
			return getJson<SearchUsersResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async resolveUserByUsername(params: ResolveUserByUsernameParams): Promise<ResolveUserByUsernameResponse> {
			const url = new URL(`${apiBaseUrl}/usernames/${encodeURIComponent(params.username)}`);
			return getJson<ResolveUserByUsernameResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyRelationship(params: GetMyRelationshipParams): Promise<GetMyRelationshipResponse> {
			const url = new URL(`${apiBaseUrl}/me/relationships/${encodeURIComponent(params.userId)}`);
			return getJson<GetMyRelationshipResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyFriends(query?: ListMyFriendsQuery): Promise<ListMyFriendsResponse> {
			const url = new URL(`${apiBaseUrl}/me/friends`);
			applyQuery(url, query);
			return getJson<ListMyFriendsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyFollowers(query?: ListMyFollowersQuery): Promise<ListMyFollowersResponse> {
			const url = new URL(`${apiBaseUrl}/me/followers`);
			applyQuery(url, query);
			return getJson<ListMyFollowersResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyFollowing(query?: ListMyFollowingQuery): Promise<ListMyFollowingResponse> {
			const url = new URL(`${apiBaseUrl}/me/following`);
			applyQuery(url, query);
			return getJson<ListMyFollowingResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async followUser(params: FollowUserParams): Promise<FollowUserResponse> {
			const url = new URL(`${apiBaseUrl}/users/${encodeURIComponent(params.userId)}/followers/me`);
			return getJson<FollowUserResponse>(url.toString(), {
				method: 'PUT',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async unfollowUser(params: UnfollowUserParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/users/${encodeURIComponent(params.userId)}/followers/me`);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listGameModes(query?: ListGameModesQuery): Promise<ListGameModesResponse> {
			const url = new URL(`${apiBaseUrl}/game-modes`);
			applyQuery(url, query);
			return getJson<ListGameModesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getGameMode(params: GetGameModeParams): Promise<GetGameModeResponse> {
			const url = new URL(`${apiBaseUrl}/game-modes/${encodeURIComponent(params.gameModeId)}`);
			return getJson<GetGameModeResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listRulesets(query?: ListRulesetsQuery): Promise<ListRulesetsResponse> {
			const url = new URL(`${apiBaseUrl}/rulesets`);
			applyQuery(url, query);
			return getJson<ListRulesetsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getRuleset(params: GetRulesetParams): Promise<GetRulesetResponse> {
			const url = new URL(`${apiBaseUrl}/rulesets/${encodeURIComponent(params.rulesetId)}`);
			return getJson<GetRulesetResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listCompetitions(query?: ListCompetitionsQuery): Promise<ListCompetitionsResponse> {
			const url = new URL(`${apiBaseUrl}/competitions`);
			applyQuery(url, query);
			return getJson<ListCompetitionsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getCompetition(params: GetCompetitionParams): Promise<GetCompetitionResponse> {
			const url = new URL(`${apiBaseUrl}/competitions/${encodeURIComponent(params.competitionId)}`);
			return getJson<GetCompetitionResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listCompetitionSeasons(params: ListCompetitionSeasonsParams): Promise<ListCompetitionSeasonsResponse> {
			const url = new URL(`${apiBaseUrl}/competitions/${encodeURIComponent(params.competitionId)}/seasons`);
			return getJson<ListCompetitionSeasonsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getCompetitionSeason(params: GetCompetitionSeasonParams): Promise<GetCompetitionSeasonResponse> {
			const url = new URL(
				`${apiBaseUrl}/competitions/${encodeURIComponent(params.competitionId)}/seasons/${encodeURIComponent(params.seasonId)}`,
			);
			return getJson<GetCompetitionSeasonResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTeam(params: GetTeamParams): Promise<GetTeamResponse> {
			const url = new URL(`${apiBaseUrl}/teams/${encodeURIComponent(params.teamId)}`);
			return getJson<GetTeamResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMatchdays(params: ListMatchdaysParams, query?: ListMatchdaysQuery): Promise<ListMatchdaysResponse> {
			const url = new URL(
				`${apiBaseUrl}/competitions/${encodeURIComponent(params.competitionId)}/seasons/${encodeURIComponent(params.seasonId)}/matchdays`,
			);
			applyQuery(url, query);
			return getJson<ListMatchdaysResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMatchdayMatches(
			params: ListMatchdayMatchesParams,
			query?: ListMatchdayMatchesQuery,
		): Promise<ListMatchdayMatchesResponse> {
			const url = new URL(
				`${apiBaseUrl}/competitions/${encodeURIComponent(params.competitionId)}/seasons/${encodeURIComponent(params.seasonId)}/matchdays/${encodeURIComponent(String(params.matchday))}/matches`,
			);
			applyQuery(url, query);
			return getJson<ListMatchdayMatchesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async searchMatches(query?: SearchMatchesQuery): Promise<SearchMatchesResponse> {
			const url = new URL(`${apiBaseUrl}/matches`);
			applyQuery(url, query);
			return getJson<SearchMatchesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMatch(params: GetMatchParams): Promise<GetMatchResponse> {
			const url = new URL(`${apiBaseUrl}/matches/${encodeURIComponent(params.matchId)}`);
			return getJson<GetMatchResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMatchEvents(params: ListMatchEventsParams, query?: ListMatchEventsQuery): Promise<ListMatchEventsResponse> {
			const url = new URL(`${apiBaseUrl}/matches/${encodeURIComponent(params.matchId)}/events`);
			applyQuery(url, query);
			return getJson<ListMatchEventsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyTournaments(query?: ListMyTournamentsQuery): Promise<ListMyTournamentsResponse> {
			const url = new URL(`${apiBaseUrl}/me/tournaments`);
			applyQuery(url, query);
			return getJson<ListMyTournamentsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyDuels(query?: ListMyDuelsQuery): Promise<ListMyDuelsResponse> {
			const url = new URL(`${apiBaseUrl}/me/duels`);
			applyQuery(url, query);
			return getJson<ListMyDuelsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async createTournament(body: CreateTournamentRequest): Promise<CreateTournamentResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments`);
			return getJson<CreateTournamentResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async createDuel(body: CreateDuelRequest): Promise<CreateDuelResponse> {
			const url = new URL(`${apiBaseUrl}/me/duels`);
			return getJson<CreateDuelResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async createDuelRematch(
			params: CreateDuelRematchParams,
			body?: CreateDuelRematchRequest,
		): Promise<CreateDuelRematchResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/rematch`);
			return getJson<CreateDuelRematchResponse>(url.toString(), {
				method: 'POST',
				body: body ? JSON.stringify(body) : undefined,
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async getTournamentPreview(params: GetTournamentPreviewParams, query?: GetTournamentPreviewQuery): Promise<GetTournamentPreviewResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/preview`);
			applyQuery(url, query);
			return getJson<GetTournamentPreviewResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getVerifiedHub(query?: GetVerifiedHubQuery): Promise<GetVerifiedHubResponse> {
			const url = new URL(`${apiBaseUrl}/verified/hub`);
			applyQuery(url, query);
			return getJson<GetVerifiedHubResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listVerifiedEvents(query?: ListVerifiedEventsQuery): Promise<ListVerifiedEventsResponse> {
			const url = new URL(`${apiBaseUrl}/verified/events`);
			applyQuery(url, query);
			return getJson<ListVerifiedEventsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getVerifiedEvent(params: GetVerifiedEventParams, query?: GetVerifiedEventQuery): Promise<GetVerifiedEventResponse> {
			const url = new URL(`${apiBaseUrl}/verified/events/${encodeURIComponent(params.eventId)}`);
			applyQuery(url, query);
			return getJson<GetVerifiedEventResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listVerifiedEventTournaments(
			params: ListVerifiedEventTournamentsParams,
			query?: ListVerifiedEventTournamentsQuery,
		): Promise<ListVerifiedEventTournamentsResponse> {
			const url = new URL(`${apiBaseUrl}/verified/events/${encodeURIComponent(params.eventId)}/tournaments`);
			applyQuery(url, query);
			return getJson<ListVerifiedEventTournamentsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listVerifiedTournaments(query?: ListVerifiedTournamentsQuery): Promise<ListVerifiedTournamentsResponse> {
			const url = new URL(`${apiBaseUrl}/verified/tournaments`);
			applyQuery(url, query);
			return getJson<ListVerifiedTournamentsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getVerifiedTournamentPreview(params: GetVerifiedTournamentPreviewParams): Promise<GetVerifiedTournamentPreviewResponse> {
			const url = new URL(`${apiBaseUrl}/verified/tournaments/${encodeURIComponent(params.tournamentId)}`);
			return getJson<GetVerifiedTournamentPreviewResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getRankedMeta(query?: GetRankedMetaQuery): Promise<GetRankedMetaResponse> {
			const url = new URL(`${apiBaseUrl}/ranked/meta`);
			applyQuery(url, query);
			return getJson<GetRankedMetaResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listRankedTracks(query?: ListRankedTracksQuery): Promise<ListRankedTracksResponse> {
			const url = new URL(`${apiBaseUrl}/ranked/tracks`);
			applyQuery(url, query);
			return getJson<ListRankedTracksResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getRankedTrack(params: GetRankedTrackParams, query?: GetRankedTrackQuery): Promise<GetRankedTrackResponse> {
			const url = new URL(`${apiBaseUrl}/ranked/tracks/${encodeURIComponent(params.rankedTrackId)}`);
			applyQuery(url, query);
			return getJson<GetRankedTrackResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listRankedSeasons(
			params: ListRankedSeasonsParams,
			query?: ListRankedSeasonsQuery,
		): Promise<ListRankedSeasonsResponse> {
			const url = new URL(`${apiBaseUrl}/ranked/tracks/${encodeURIComponent(params.rankedTrackId)}/seasons`);
			applyQuery(url, query);
			return getJson<ListRankedSeasonsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getRankedSeason(
			params: GetRankedSeasonParams,
			query?: GetRankedSeasonQuery,
		): Promise<GetRankedSeasonResponse> {
			const url = new URL(
				`${apiBaseUrl}/ranked/tracks/${encodeURIComponent(params.rankedTrackId)}/seasons/${encodeURIComponent(params.rankedSeasonId)}`,
			);
			applyQuery(url, query);
			return getJson<GetRankedSeasonResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getRankedLeaderboard(
			params: GetRankedLeaderboardParams,
			query?: GetRankedLeaderboardQuery,
		): Promise<GetRankedLeaderboardResponse> {
			const url = new URL(`${apiBaseUrl}/ranked/tracks/${encodeURIComponent(params.rankedTrackId)}/leaderboard`);
			applyQuery(url, query);
			return getJson<GetRankedLeaderboardResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getRankedSeasonLeaderboard(
			params: GetRankedSeasonLeaderboardParams,
			query?: GetRankedSeasonLeaderboardQuery,
		): Promise<GetRankedSeasonLeaderboardResponse> {
			const url = new URL(
				`${apiBaseUrl}/ranked/tracks/${encodeURIComponent(params.rankedTrackId)}/seasons/${encodeURIComponent(params.rankedSeasonId)}/leaderboard`,
			);
			applyQuery(url, query);
			return getJson<GetRankedSeasonLeaderboardResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyRankedProfile(query?: GetMyRankedProfileQuery): Promise<GetMyRankedProfileResponse> {
			const url = new URL(`${apiBaseUrl}/me/ranked`);
			applyQuery(url, query);
			return getJson<GetMyRankedProfileResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyRankedSettings(): Promise<GetMyRankedSettingsResponse> {
			const url = new URL(`${apiBaseUrl}/me/ranked/settings`);
			return getJson<GetMyRankedSettingsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async updateMyRankedSettings(body: UpdateMyRankedSettingsRequest): Promise<UpdateMyRankedSettingsResponse> {
			const url = new URL(`${apiBaseUrl}/me/ranked/settings`);
			return getJson<UpdateMyRankedSettingsResponse>(url.toString(), {
				method: 'PATCH',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async getMyRankedTrack(
			params: GetMyRankedTrackParams,
			query?: GetMyRankedTrackQuery,
		): Promise<GetMyRankedTrackResponse> {
			const url = new URL(`${apiBaseUrl}/me/ranked/tracks/${encodeURIComponent(params.rankedTrackId)}`);
			applyQuery(url, query);
			return getJson<GetMyRankedTrackResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyRankedHistory(
			params: ListMyRankedHistoryParams,
			query?: ListMyRankedHistoryQuery,
		): Promise<ListMyRankedHistoryResponse> {
			const url = new URL(`${apiBaseUrl}/me/ranked/tracks/${encodeURIComponent(params.rankedTrackId)}/history`);
			applyQuery(url, query);
			return getJson<ListMyRankedHistoryResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getUserRankedProfile(
			params: GetUserRankedProfileParams,
			query?: GetUserRankedProfileQuery,
		): Promise<GetUserRankedProfileResponse> {
			const url = new URL(`${apiBaseUrl}/users/${encodeURIComponent(params.userId)}/ranked`);
			applyQuery(url, query);
			return getJson<GetUserRankedProfileResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getUserRankedTrack(
			params: GetUserRankedTrackParams,
			query?: GetUserRankedTrackQuery,
		): Promise<GetUserRankedTrackResponse> {
			const url = new URL(
				`${apiBaseUrl}/users/${encodeURIComponent(params.userId)}/ranked/tracks/${encodeURIComponent(params.rankedTrackId)}`,
			);
			applyQuery(url, query);
			return getJson<GetUserRankedTrackResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getAchievementMeta(query?: GetAchievementMetaQuery): Promise<GetAchievementMetaResponse> {
			const url = new URL(`${apiBaseUrl}/achievements/meta`);
			applyQuery(url, query);
			return getJson<GetAchievementMetaResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listAchievementDefinitions(query?: ListAchievementDefinitionsQuery): Promise<ListAchievementDefinitionsResponse> {
			const url = new URL(`${apiBaseUrl}/achievements`);
			applyQuery(url, query);
			return getJson<ListAchievementDefinitionsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getAchievementDefinition(
			params: GetAchievementDefinitionParams,
			query?: GetAchievementDefinitionQuery,
		): Promise<GetAchievementDefinitionResponse> {
			const url = new URL(`${apiBaseUrl}/achievements/${encodeURIComponent(params.achievementId)}`);
			applyQuery(url, query);
			return getJson<GetAchievementDefinitionResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyAchievements(query?: ListMyAchievementsQuery): Promise<ListMyAchievementsResponse> {
			const url = new URL(`${apiBaseUrl}/me/achievements`);
			applyQuery(url, query);
			return getJson<ListMyAchievementsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyUnlockedAchievements(query?: ListMyUnlockedAchievementsQuery): Promise<ListMyUnlockedAchievementsResponse> {
			const url = new URL(`${apiBaseUrl}/me/achievements/unlocked`);
			applyQuery(url, query);
			return getJson<ListMyUnlockedAchievementsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyAchievement(
			params: GetMyAchievementParams,
			query?: GetMyAchievementQuery,
		): Promise<GetMyAchievementResponse> {
			const url = new URL(`${apiBaseUrl}/me/achievements/${encodeURIComponent(params.achievementId)}`);
			applyQuery(url, query);
			return getJson<GetMyAchievementResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listUserAchievements(
			params: ListUserAchievementsParams,
			query?: ListUserAchievementsQuery,
		): Promise<ListUserAchievementsResponse> {
			const url = new URL(`${apiBaseUrl}/users/${encodeURIComponent(params.userId)}/achievements`);
			applyQuery(url, query);
			return getJson<ListUserAchievementsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async createUpload(body: CreateUploadRequest): Promise<CreateUploadResponse> {
			const url = new URL(`${apiBaseUrl}/uploads`);
			return getJson<CreateUploadResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async getUpload(params: GetUploadParams): Promise<GetUploadResponse> {
			const url = new URL(`${apiBaseUrl}/uploads/${encodeURIComponent(params.uploadId)}`);
			return getJson<GetUploadResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async abortUpload(params: AbortUploadParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/uploads/${encodeURIComponent(params.uploadId)}`);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async completeUpload(params: CompleteUploadParams, body: CompleteUploadRequest): Promise<CompleteUploadResponse> {
			const url = new URL(`${apiBaseUrl}/uploads/${encodeURIComponent(params.uploadId)}/complete`);
			return getJson<CompleteUploadResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async getMedia(params: GetMediaParams, query?: GetMediaQuery): Promise<GetMediaResponse> {
			const url = new URL(`${apiBaseUrl}/media/${encodeURIComponent(params.mediaId)}`);
			applyQuery(url, query);
			return getJson<GetMediaResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async deleteMedia(params: DeleteMediaParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/media/${encodeURIComponent(params.mediaId)}`);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listTrustPolicies(query?: ListTrustPoliciesQuery): Promise<ListTrustPoliciesResponse> {
			const url = new URL(`${apiBaseUrl}/trust/policies`);
			applyQuery(url, query);
			return getJson<ListTrustPoliciesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTrustPolicy(params: GetTrustPolicyParams): Promise<GetTrustPolicyResponse> {
			const url = new URL(`${apiBaseUrl}/trust/policies/${encodeURIComponent(params.policyId)}`);
			return getJson<GetTrustPolicyResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyEnforcementStatus(): Promise<GetMyEnforcementStatusResponse> {
			const url = new URL(`${apiBaseUrl}/me/trust/enforcement`);
			return getJson<GetMyEnforcementStatusResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyAppeals(query?: ListMyAppealsQuery): Promise<ListMyAppealsResponse> {
			const url = new URL(`${apiBaseUrl}/me/trust/appeals`);
			applyQuery(url, query);
			return getJson<ListMyAppealsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async createMyAppeal(body: CreateMyAppealRequest): Promise<CreateMyAppealResponse> {
			const url = new URL(`${apiBaseUrl}/me/trust/appeals`);
			return getJson<CreateMyAppealResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async getMyAppeal(params: GetMyAppealParams): Promise<GetMyAppealResponse> {
			const url = new URL(`${apiBaseUrl}/me/trust/appeals/${encodeURIComponent(params.appealId)}`);
			return getJson<GetMyAppealResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyReports(query?: ListMyReportsQuery): Promise<ListMyReportsResponse> {
			const url = new URL(`${apiBaseUrl}/me/trust/reports`);
			applyQuery(url, query);
			return getJson<ListMyReportsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async createReport(body: CreateReportRequest): Promise<CreateReportResponse> {
			const url = new URL(`${apiBaseUrl}/me/trust/reports`);
			return getJson<CreateReportResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async getMyReport(params: GetMyReportParams): Promise<GetMyReportResponse> {
			const url = new URL(`${apiBaseUrl}/me/trust/reports/${encodeURIComponent(params.reportId)}`);
			return getJson<GetMyReportResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyTrustBlocks(query?: ListMyTrustBlocksQuery): Promise<ListMyTrustBlocksResponse> {
			const url = new URL(`${apiBaseUrl}/me/trust/blocks`);
			applyQuery(url, query);
			return getJson<ListMyTrustBlocksResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listPromotions(query?: ListPromotionsQuery): Promise<ListPromotionsResponse> {
			const url = new URL(`${apiBaseUrl}/promotions`);
			applyQuery(url, query);
			return getJson<ListPromotionsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getPromotion(params: GetPromotionParams, query?: GetPromotionQuery): Promise<GetPromotionResponse> {
			const url = new URL(`${apiBaseUrl}/promotions/${encodeURIComponent(params.promotionId)}`);
			applyQuery(url, query);
			return getJson<GetPromotionResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listPromotionWinners(
			params: ListPromotionWinnersParams,
			query?: ListPromotionWinnersQuery,
		): Promise<ListPromotionWinnersResponse> {
			const url = new URL(`${apiBaseUrl}/promotions/${encodeURIComponent(params.promotionId)}/winners`);
			applyQuery(url, query);
			return getJson<ListPromotionWinnersResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyPromotionStatus(params: GetMyPromotionStatusParams): Promise<GetMyPromotionStatusResponse> {
			const url = new URL(`${apiBaseUrl}/promotions/${encodeURIComponent(params.promotionId)}/me`);
			return getJson<GetMyPromotionStatusResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async optInToPromotion(params: OptInToPromotionParams, body: OptInToPromotionRequest): Promise<OptInToPromotionResponse> {
			const url = new URL(`${apiBaseUrl}/promotions/${encodeURIComponent(params.promotionId)}/opt-in`);
			return getJson<OptInToPromotionResponse>(url.toString(), {
				method: 'PUT',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async optOutFromPromotion(params: OptOutFromPromotionParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/promotions/${encodeURIComponent(params.promotionId)}/opt-in`);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyPromotions(query?: ListMyPromotionsQuery): Promise<ListMyPromotionsResponse> {
			const url = new URL(`${apiBaseUrl}/me/promotions`);
			applyQuery(url, query);
			return getJson<ListMyPromotionsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyRewards(query?: ListMyRewardsQuery): Promise<ListMyRewardsResponse> {
			const url = new URL(`${apiBaseUrl}/me/rewards`);
			applyQuery(url, query);
			return getJson<ListMyRewardsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyReward(params: GetMyRewardParams, query?: GetMyRewardQuery): Promise<GetMyRewardResponse> {
			const url = new URL(`${apiBaseUrl}/me/rewards/${encodeURIComponent(params.rewardGrantId)}`);
			applyQuery(url, query);
			return getJson<GetMyRewardResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async claimMyReward(params: ClaimMyRewardParams, body: ClaimMyRewardRequest): Promise<ClaimMyRewardResponse> {
			const url = new URL(`${apiBaseUrl}/me/rewards/${encodeURIComponent(params.rewardGrantId)}/claim`);
			return getJson<ClaimMyRewardResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async getMyRewardFulfillmentProfile(): Promise<GetMyRewardFulfillmentProfileResponse> {
			const url = new URL(`${apiBaseUrl}/me/rewards/fulfillment-profile`);
			return getJson<GetMyRewardFulfillmentProfileResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async updateMyRewardFulfillmentProfile(
			body: UpdateMyRewardFulfillmentProfileRequest,
		): Promise<UpdateMyRewardFulfillmentProfileResponse> {
			const url = new URL(`${apiBaseUrl}/me/rewards/fulfillment-profile`);
			return getJson<UpdateMyRewardFulfillmentProfileResponse>(url.toString(), {
				method: 'PATCH',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async listCreators(query?: ListCreatorsQuery): Promise<ListCreatorsResponse> {
			const url = new URL(`${apiBaseUrl}/creators`);
			applyQuery(url, query);
			return getJson<ListCreatorsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getCreator(params: GetCreatorParams, query?: GetCreatorQuery): Promise<GetCreatorResponse> {
			const url = new URL(`${apiBaseUrl}/creators/${encodeURIComponent(params.creatorId)}`);
			applyQuery(url, query);
			return getJson<GetCreatorResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getCreatorHub(params: GetCreatorHubParams, query?: GetCreatorHubQuery): Promise<GetCreatorHubResponse> {
			const url = new URL(`${apiBaseUrl}/creators/${encodeURIComponent(params.creatorId)}/hub`);
			applyQuery(url, query);
			return getJson<GetCreatorHubResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listCreatorEvents(params: ListCreatorEventsParams, query?: ListCreatorEventsQuery): Promise<ListCreatorEventsResponse> {
			const url = new URL(`${apiBaseUrl}/creators/${encodeURIComponent(params.creatorId)}/events`);
			applyQuery(url, query);
			return getJson<ListCreatorEventsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listCreatorTournaments(
			params: ListCreatorTournamentsParams,
			query?: ListCreatorTournamentsQuery,
		): Promise<ListCreatorTournamentsResponse> {
			const url = new URL(`${apiBaseUrl}/creators/${encodeURIComponent(params.creatorId)}/tournaments`);
			applyQuery(url, query);
			return getJson<ListCreatorTournamentsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listCreatorCollections(
			params: ListCreatorCollectionsParams,
			query?: ListCreatorCollectionsQuery,
		): Promise<ListCreatorCollectionsResponse> {
			const url = new URL(`${apiBaseUrl}/creators/${encodeURIComponent(params.creatorId)}/collections`);
			applyQuery(url, query);
			return getJson<ListCreatorCollectionsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getCreatorCollection(
			params: GetCreatorCollectionParams,
			query?: GetCreatorCollectionQuery,
		): Promise<GetCreatorCollectionResponse> {
			const url = new URL(
				`${apiBaseUrl}/creators/${encodeURIComponent(params.creatorId)}/collections/${encodeURIComponent(params.collectionId)}`,
			);
			applyQuery(url, query);
			return getJson<GetCreatorCollectionResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentRanking(params: GetTournamentRankingParams, query?: GetTournamentRankingQuery): Promise<GetTournamentRankingResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/rankings`);
			applyQuery(url, query);
			return getJson<GetTournamentRankingResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentRankingWindow(
			params: GetTournamentRankingWindowParams,
			query?: GetTournamentRankingWindowQuery,
		): Promise<GetTournamentRankingWindowResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/rankings/me`);
			applyQuery(url, query);
			return getJson<GetTournamentRankingWindowResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentMatchdayRanking(
			params: GetTournamentMatchdayRankingParams,
			query?: GetTournamentMatchdayRankingQuery,
		): Promise<GetTournamentMatchdayRankingResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${encodeURIComponent(String(params.matchday))}/rankings`,
			);
			applyQuery(url, query);
			return getJson<GetTournamentMatchdayRankingResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentMatchdayRankingWindow(
			params: GetTournamentMatchdayRankingWindowParams,
			query?: GetTournamentMatchdayRankingWindowQuery,
		): Promise<GetTournamentMatchdayRankingWindowResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${encodeURIComponent(String(params.matchday))}/rankings/me`,
			);
			applyQuery(url, query);
			return getJson<GetTournamentMatchdayRankingWindowResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listTournamentMatchdays(
			params: ListTournamentMatchdaysParams,
			query?: ListTournamentMatchdaysQuery,
		): Promise<ListTournamentMatchdaysResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays`);
			applyQuery(url, query);
			return getJson<ListTournamentMatchdaysResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentMatchday(params: GetTournamentMatchdayParams): Promise<GetTournamentMatchdayResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${encodeURIComponent(String(params.matchday))}`,
			);
			return getJson<GetTournamentMatchdayResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentMatchdayAvailability(params: GetTournamentMatchdayAvailabilityParams): Promise<GetTournamentMatchdayAvailabilityResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${encodeURIComponent(String(params.matchday))}/availability`,
			);
			return getJson<GetTournamentMatchdayAvailabilityResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMatchdayMatches(params: GetMatchdayMatchesParams, query?: GetMatchdayMatchesQuery): Promise<GetMatchdayMatchesResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${encodeURIComponent(String(params.matchday))}/matches`,
			);
			applyQuery(url, query);
			return getJson<GetMatchdayMatchesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMatchdaySubmissions(
			params: ListMatchdaySubmissionsParams,
			query?: ListMatchdaySubmissionsQuery,
		): Promise<ListMatchdaySubmissionsResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${encodeURIComponent(String(params.matchday))}/submissions`,
			);
			applyQuery(url, query);
			return getJson<ListMatchdaySubmissionsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyMatchdaySubmission(params: GetMyMatchdaySubmissionParams): Promise<GetMyMatchdaySubmissionResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${encodeURIComponent(String(params.matchday))}/submissions/me`,
			);
			return getJson<GetMyMatchdaySubmissionResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async upsertMyMatchdaySubmission(
			params: UpsertMyMatchdaySubmissionParams,
			body: UpsertMyMatchdaySubmissionRequest,
		): Promise<UpsertMyMatchdaySubmissionResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${encodeURIComponent(String(params.matchday))}/submissions/me`,
			);
			const headers = createJsonHeaders(options.getAccessToken);
			return getJson<UpsertMyMatchdaySubmissionResponse>(url.toString(), {
				method: 'PUT',
				body: JSON.stringify(body),
				headers: {
					...headers,
					...(params.idempotencyKey ? { 'X-Idempotency-Key': params.idempotencyKey } : {}),
					...(params.ifMatch ? { 'If-Match': params.ifMatch } : {}),
				},
			});
		},
		async clearMyMatchdaySubmission(params: ClearMyMatchdaySubmissionParams): Promise<void> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${encodeURIComponent(String(params.matchday))}/submissions/me`,
			);
			const headers = createHeaders(options.getAccessToken);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: params.idempotencyKey
					? {
						...headers,
						'X-Idempotency-Key': params.idempotencyKey,
					}
					: headers,
			});
		},
		async getUserMatchdaySubmission(params: GetUserMatchdaySubmissionParams): Promise<GetUserMatchdaySubmissionResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${encodeURIComponent(String(params.matchday))}/submissions/users/${encodeURIComponent(params.userId)}`,
			);
			return getJson<GetUserMatchdaySubmissionResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listTournamentMembers(params: ListTournamentMembersParams, query?: ListTournamentMembersQuery): Promise<ListTournamentMembersResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/members`);
			applyQuery(url, query);
			return getJson<ListTournamentMembersResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async joinTournament(params: JoinTournamentParams, body?: JoinTournamentRequest): Promise<JoinTournamentResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/members/me`);
			const headers = body ? createJsonHeaders(options.getAccessToken) : createHeaders(options.getAccessToken);
			return getJson<JoinTournamentResponse>(url.toString(), {
				method: 'PUT',
				body: body ? JSON.stringify(body) : undefined,
				headers: params.idempotencyKey
					? {
						...headers,
						'X-Idempotency-Key': params.idempotencyKey,
					}
					: headers,
			});
		},
		async leaveTournament(params: LeaveTournamentParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/members/me`);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async updateTournamentMember(
			params: UpdateTournamentMemberParams,
			body: UpdateTournamentMemberRequest,
		): Promise<UpdateTournamentMemberResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/members/${encodeURIComponent(params.userId)}`,
			);
			return getJson<UpdateTournamentMemberResponse>(url.toString(), {
				method: 'PATCH',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async removeTournamentMember(params: RemoveTournamentMemberParams, body?: RemoveTournamentMemberRequest): Promise<void> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/members/${encodeURIComponent(params.userId)}`,
			);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				body: body ? JSON.stringify(body) : undefined,
				headers: body ? createJsonHeaders(options.getAccessToken) : createHeaders(options.getAccessToken),
			});
		},
		async listTournamentInvitationCodes(
			params: ListTournamentInvitationCodesParams,
			query?: ListTournamentInvitationCodesQuery,
		): Promise<ListTournamentInvitationCodesResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/invitation-codes`);
			applyQuery(url, query);
			return getJson<ListTournamentInvitationCodesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async createTournamentInvitationCode(
			params: CreateTournamentInvitationCodeParams,
			body?: CreateInvitationCodeRequest,
		): Promise<CreateTournamentInvitationCodeResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/invitation-codes`);
			return getJson<CreateTournamentInvitationCodeResponse>(url.toString(), {
				method: 'POST',
				body: body ? JSON.stringify(body) : undefined,
				headers: body ? createJsonHeaders(options.getAccessToken) : createHeaders(options.getAccessToken),
			});
		},
		async resolveInvitationCode(params: ResolveInvitationCodeParams): Promise<ResolveInvitationCodeResponse> {
			const url = new URL(`${apiBaseUrl}/invitation-codes/${encodeURIComponent(params.code)}`);
			return getJson<ResolveInvitationCodeResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async joinTournamentByInvitationCode(
			params: JoinTournamentByInvitationCodeParams,
			body?: JoinTournamentByInvitationCodeRequest,
		): Promise<JoinTournamentByInvitationCodeResponse> {
			const url = new URL(`${apiBaseUrl}/invitation-codes/${encodeURIComponent(params.code)}/members/me`);
			const headers = body ? createJsonHeaders(options.getAccessToken) : createHeaders(options.getAccessToken);
			return getJson<JoinTournamentByInvitationCodeResponse>(url.toString(), {
				method: 'PUT',
				body: body ? JSON.stringify(body) : undefined,
				headers: params.idempotencyKey
					? {
						...headers,
						'X-Idempotency-Key': params.idempotencyKey,
					}
					: headers,
			});
		},
		async listTournamentInvites(params: ListTournamentInvitesParams, query?: ListTournamentInvitesQuery): Promise<ListTournamentInvitesResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/invites`);
			applyQuery(url, query);
			return getJson<ListTournamentInvitesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async createTournamentInvites(
			params: CreateTournamentInvitesParams,
			body: CreateTournamentInvitesRequest,
		): Promise<CreateTournamentInvitesResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/invites`);
			return getJson<CreateTournamentInvitesResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async cancelTournamentInvite(params: CancelTournamentInviteParams): Promise<void> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/invites/${encodeURIComponent(params.inviteId)}`,
			);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyTournamentInvites(query?: ListMyTournamentInvitesQuery): Promise<ListMyTournamentInvitesResponse> {
			const url = new URL(`${apiBaseUrl}/me/tournament-invites`);
			applyQuery(url, query);
			return getJson<ListMyTournamentInvitesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyTournamentInvite(params: GetMyTournamentInviteParams, query?: GetMyTournamentInviteQuery): Promise<GetMyTournamentInviteResponse> {
			const url = new URL(`${apiBaseUrl}/me/tournament-invites/${encodeURIComponent(params.inviteId)}`);
			applyQuery(url, query);
			return getJson<GetMyTournamentInviteResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyTournamentInviteUnreadCount(): Promise<GetMyTournamentInviteUnreadCountResponse> {
			const url = new URL(`${apiBaseUrl}/me/tournament-invites/unread-count`);
			return getJson<GetMyTournamentInviteUnreadCountResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async hideMyTournamentInvite(params: HideMyTournamentInviteParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/me/tournament-invites/${encodeURIComponent(params.inviteId)}`);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async markMyTournamentInviteSeen(params: MarkMyTournamentInviteSeenParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/me/tournament-invites/${encodeURIComponent(params.inviteId)}/seen`);
			return sendVoid(url.toString(), {
				method: 'PUT',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async acceptMyTournamentInvite(
			params: AcceptMyTournamentInviteParams,
			body?: AcceptMyTournamentInviteRequest,
		): Promise<AcceptMyTournamentInviteResponse> {
			const url = new URL(`${apiBaseUrl}/me/tournament-invites/${encodeURIComponent(params.inviteId)}/accept`);
			return getJson<AcceptMyTournamentInviteResponse>(url.toString(), {
				method: 'PUT',
				body: body ? JSON.stringify(body) : undefined,
				headers: body ? createJsonHeaders(options.getAccessToken) : createHeaders(options.getAccessToken),
			});
		},
		async declineMyTournamentInvite(
			params: DeclineMyTournamentInviteParams,
			body?: DeclineMyTournamentInviteRequest,
		): Promise<DeclineMyTournamentInviteResponse> {
			const url = new URL(`${apiBaseUrl}/me/tournament-invites/${encodeURIComponent(params.inviteId)}/decline`);
			return getJson<DeclineMyTournamentInviteResponse>(url.toString(), {
				method: 'PUT',
				body: body ? JSON.stringify(body) : undefined,
				headers: body ? createJsonHeaders(options.getAccessToken) : createHeaders(options.getAccessToken),
			});
		},
		async authorize(params: AuthorizeParams): Promise<AuthorizeResponse> {
			const query = new URLSearchParams({
				provider: params.provider,
				redirectUri: params.redirectUri,
				state: params.state,
			});
			if (params.codeChallenge) {
				query.set('codeChallenge', params.codeChallenge);
			}
			if (params.codeChallengeMethod) {
				query.set('codeChallengeMethod', params.codeChallengeMethod);
			}
			const baseUrl = authBaseUrl || apiBaseUrl;
			const url = `${baseUrl}/auth/oauth/authorize?${query.toString()}`;
			const resp = await fetchFn(url, { redirect: 'manual' });
			const location = resp.headers.get('Location');
			return { headers: { Location: location ?? '' } } as AuthorizeResponse;
		},
		async token(body: TokenRequestBody): Promise<TokenResponse> {
			const baseUrl = authBaseUrl || apiBaseUrl;
			const url = `${baseUrl}/auth/oauth/token`;
			return getJson<TokenResponse>(url, {
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json',
				},
			});
		},
		async listMyNotifications(query?: ListMyNotificationsQuery): Promise<ListMyNotificationsResponse> {
			const url = new URL(`${apiBaseUrl}/me/notifications`);
			applyQuery(url, query);
			return getJson<ListMyNotificationsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyNotification(params: GetMyNotificationParams, query?: GetMyNotificationQuery): Promise<GetMyNotificationResponse> {
			const url = new URL(`${apiBaseUrl}/me/notifications/${encodeURIComponent(params.notificationId)}`);
			applyQuery(url, query);
			return getJson<GetMyNotificationResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyNotificationUnreadCount(query?: GetMyNotificationUnreadCountQuery): Promise<GetMyNotificationUnreadCountResponse> {
			const url = new URL(`${apiBaseUrl}/me/notifications/unread-count`);
			applyQuery(url, query);
			return getJson<GetMyNotificationUnreadCountResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async markMyNotificationSeen(params: MarkMyNotificationSeenParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/me/notifications/${encodeURIComponent(params.notificationId)}/seen`);
			return sendVoid(url.toString(), {
				method: 'PUT',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async markMyNotificationRead(params: MarkMyNotificationReadParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/me/notifications/${encodeURIComponent(params.notificationId)}/read`);
			return sendVoid(url.toString(), {
				method: 'PUT',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async dismissMyNotification(params: DismissMyNotificationParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/me/notifications/${encodeURIComponent(params.notificationId)}/dismiss`);
			return sendVoid(url.toString(), {
				method: 'PUT',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async batchUpdateMyNotifications(body: BatchUpdateMyNotificationsRequest): Promise<BatchUpdateMyNotificationsResponse> {
			const url = new URL(`${apiBaseUrl}/me/notifications/batch`);
			return getJson<BatchUpdateMyNotificationsResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async listMyFeed(query?: ListMyFeedQuery): Promise<ListMyFeedResponse> {
			const url = new URL(`${apiBaseUrl}/me/feed`);
			applyQuery(url, query);
			return getJson<ListMyFeedResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyFeedItem(params: GetMyFeedItemParams): Promise<GetMyFeedItemResponse> {
			const url = new URL(`${apiBaseUrl}/me/feed/${encodeURIComponent(params.feedItemId)}`);
			return getJson<GetMyFeedItemResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyFeedReadCursor(): Promise<GetMyFeedReadCursorResponse> {
			const url = new URL(`${apiBaseUrl}/me/feed/read-cursor`);
			return getJson<GetMyFeedReadCursorResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async updateMyFeedReadCursor(body: UpdateMyFeedReadCursorRequest): Promise<UpdateMyFeedReadCursorResponse> {
			const url = new URL(`${apiBaseUrl}/me/feed/read-cursor`);
			return getJson<UpdateMyFeedReadCursorResponse>(url.toString(), {
				method: 'PUT',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async listMyUpdates(query?: ListMyUpdatesQuery): Promise<ListMyUpdatesResponse> {
			const url = new URL(`${apiBaseUrl}/me/updates`);
			applyQuery(url, query);
			return getJson<ListMyUpdatesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async streamMyLiveUpdates(query?: StreamMyLiveUpdatesQuery): Promise<StreamMyLiveUpdatesResponse> {
			const url = new URL(`${apiBaseUrl}/me/live`);
			applyQuery(url, query);
			return getText(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentChat(params: GetTournamentChatParams): Promise<GetTournamentChatResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat`);
			return getJson<GetTournamentChatResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async updateTournamentChatSettings(
			params: UpdateTournamentChatSettingsParams,
			body: UpdateTournamentChatSettingsRequest,
		): Promise<UpdateTournamentChatSettingsResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat`);
			return getJson<UpdateTournamentChatSettingsResponse>(url.toString(), {
				method: 'PATCH',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async listTournamentChatMessages(
			params: ListTournamentChatMessagesParams,
			query?: ListTournamentChatMessagesQuery,
		): Promise<ListTournamentChatMessagesResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/messages`);
			applyQuery(url, query);
			return getJson<ListTournamentChatMessagesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async sendTournamentChatMessage(
			params: SendTournamentChatMessageParams,
			body: SendTournamentChatMessageRequest,
		): Promise<SendTournamentChatMessageResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/messages`);
			return getJson<SendTournamentChatMessageResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async getTournamentChatMessage(params: GetTournamentChatMessageParams): Promise<GetTournamentChatMessageResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/messages/${encodeURIComponent(params.messageId)}`,
			);
			return getJson<GetTournamentChatMessageResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async editTournamentChatMessage(
			params: EditTournamentChatMessageParams,
			body: EditTournamentChatMessageRequest,
		): Promise<EditTournamentChatMessageResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/messages/${encodeURIComponent(params.messageId)}`,
			);
			return getJson<EditTournamentChatMessageResponse>(url.toString(), {
				method: 'PATCH',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async deleteTournamentChatMessage(params: DeleteTournamentChatMessageParams, body?: DeleteTournamentChatMessageRequest): Promise<void> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/messages/${encodeURIComponent(params.messageId)}`,
			);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				body: body ? JSON.stringify(body) : undefined,
				headers: body ? createJsonHeaders(options.getAccessToken) : createHeaders(options.getAccessToken),
			});
		},
		async getTournamentChatUnreadCount(params: GetTournamentChatUnreadCountParams): Promise<GetTournamentChatUnreadCountResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/unread-count`);
			return getJson<GetTournamentChatUnreadCountResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentChatReadCursor(params: GetTournamentChatReadCursorParams): Promise<GetTournamentChatReadCursorResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/read-cursor`);
			return getJson<GetTournamentChatReadCursorResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async updateTournamentChatReadCursor(
			params: UpdateTournamentChatReadCursorParams,
			body: UpdateTournamentChatReadCursorRequest,
		): Promise<UpdateTournamentChatReadCursorResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/read-cursor`);
			return getJson<UpdateTournamentChatReadCursorResponse>(url.toString(), {
				method: 'PUT',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async listTournamentChatPins(params: ListTournamentChatPinsParams): Promise<ListTournamentChatPinsResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/pins`);
			return getJson<ListTournamentChatPinsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async pinTournamentChatMessage(
			params: PinTournamentChatMessageParams,
			body?: PinTournamentChatMessageRequest,
		): Promise<PinTournamentChatMessageResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/messages/${encodeURIComponent(params.messageId)}/pin`,
			);
			return getJson<PinTournamentChatMessageResponse>(url.toString(), {
				method: 'PUT',
				body: body ? JSON.stringify(body) : undefined,
				headers: body ? createJsonHeaders(options.getAccessToken) : createHeaders(options.getAccessToken),
			});
		},
		async unpinTournamentChatMessage(params: UnpinTournamentChatMessageParams): Promise<void> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/messages/${encodeURIComponent(params.messageId)}/pin`,
			);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listTournamentChatMutes(
			params: ListTournamentChatMutesParams,
			query?: ListTournamentChatMutesQuery,
		): Promise<ListTournamentChatMutesResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/mutes`);
			applyQuery(url, query);
			return getJson<ListTournamentChatMutesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async muteTournamentChatUser(
			params: MuteTournamentChatUserParams,
			body: MuteTournamentChatUserRequest,
		): Promise<MuteTournamentChatUserResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/mutes/${encodeURIComponent(params.userId)}`,
			);
			return getJson<MuteTournamentChatUserResponse>(url.toString(), {
				method: 'PUT',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async unmuteTournamentChatUser(params: UnmuteTournamentChatUserParams): Promise<void> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/mutes/${encodeURIComponent(params.userId)}`,
			);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async reportTournamentChatContent(
			params: ReportTournamentChatContentParams,
			body: ReportTournamentChatContentRequest,
		): Promise<ReportTournamentChatContentResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/reports`);
			return getJson<ReportTournamentChatContentResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async listTournamentChatUpdates(
			params: ListTournamentChatUpdatesParams,
			query?: ListTournamentChatUpdatesQuery,
		): Promise<ListTournamentChatUpdatesResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/updates`);
			applyQuery(url, query);
			return getJson<ListTournamentChatUpdatesResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async streamTournamentChatLive(params: StreamTournamentChatLiveParams): Promise<StreamTournamentChatLiveResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/chat/live`);
			return getText(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyStats(query?: GetMyStatsQuery): Promise<GetMyStatsResponse> {
			const url = new URL(`${apiBaseUrl}/me/stats`);
			applyQuery(url, query);
			return getJson<GetMyStatsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getUserStats(params: GetUserStatsParams, query?: GetUserStatsQuery): Promise<GetUserStatsResponse> {
			const url = new URL(`${apiBaseUrl}/users/${encodeURIComponent(params.userId)}/stats`);
			applyQuery(url, query);
			return getJson<GetUserStatsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listMyRecaps(query?: ListMyRecapsQuery): Promise<ListMyRecapsResponse> {
			const url = new URL(`${apiBaseUrl}/me/recaps`);
			applyQuery(url, query);
			return getJson<ListMyRecapsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async requestMyRecap(body: RequestMyRecapRequest): Promise<RequestMyRecapResponse> {
			const url = new URL(`${apiBaseUrl}/me/recaps`);
			return getJson<RequestMyRecapResponse>(url.toString(), {
				method: 'POST',
				body: JSON.stringify(body),
				headers: createJsonHeaders(options.getAccessToken),
			});
		},
		async getMyRecap(params: GetMyRecapParams): Promise<GetMyRecapResponse> {
			const url = new URL(`${apiBaseUrl}/me/recaps/${encodeURIComponent(params.recapId)}`);
			return getJson<GetMyRecapResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async hideMyRecap(params: HideMyRecapParams): Promise<void> {
			const url = new URL(`${apiBaseUrl}/me/recaps/${encodeURIComponent(params.recapId)}`);
			return sendVoid(url.toString(), {
				method: 'DELETE',
				headers: createHeaders(options.getAccessToken),
			});
		},
		async listTournamentRecaps(
			params: ListTournamentRecapsParams,
			query?: ListTournamentRecapsQuery,
		): Promise<ListTournamentRecapsResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/recaps`);
			applyQuery(url, query);
			return getJson<ListTournamentRecapsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentRecap(params: GetTournamentRecapParams, query?: GetTournamentRecapQuery): Promise<GetTournamentRecapResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/recaps/${encodeURIComponent(params.recapId)}`,
			);
			applyQuery(url, query);
			return getJson<GetTournamentRecapResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentStats(params: GetTournamentStatsParams, query?: GetTournamentStatsQuery): Promise<GetTournamentStatsResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/stats`);
			applyQuery(url, query);
			return getJson<GetTournamentStatsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyTournamentStats(
			params: GetMyTournamentStatsParams,
			query?: GetMyTournamentStatsQuery,
		): Promise<GetMyTournamentStatsResponse> {
			const url = new URL(`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/stats/me`);
			applyQuery(url, query);
			return getJson<GetMyTournamentStatsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getTournamentMatchdayStats(
			params: GetTournamentMatchdayStatsParams,
			query?: GetTournamentMatchdayStatsQuery,
		): Promise<GetTournamentMatchdayStatsResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${params.matchday}/stats`,
			);
			applyQuery(url, query);
			return getJson<GetTournamentMatchdayStatsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
		async getMyTournamentMatchdayStats(
			params: GetMyTournamentMatchdayStatsParams,
			query?: GetMyTournamentMatchdayStatsQuery,
		): Promise<GetMyTournamentMatchdayStatsResponse> {
			const url = new URL(
				`${apiBaseUrl}/tournaments/${encodeURIComponent(params.tournamentId)}/matchdays/${params.matchday}/stats/me`,
			);
			applyQuery(url, query);
			return getJson<GetMyTournamentMatchdayStatsResponse>(url.toString(), {
				headers: createHeaders(options.getAccessToken),
			});
		},
	};

	const operationIdClient = client as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>;
	operationIdClient.getUserPublicProfile = (params?: unknown, query?: unknown) =>
		client.getUser(params as GetUserParams, query as GetUserQuery | undefined);
	operationIdClient.oauthAuthorize = (params?: unknown) =>
		client.authorize(params as AuthorizeParams);
	operationIdClient.oauthTokenExchange = (body?: unknown) =>
		client.token(body as TokenRequestBody);

	for (const operation of Object.values(operations)) {
		if (operation.path.startsWith('/admin') || operation.tags.some(tag => tag.startsWith('admin.'))) {
			continue;
		}
		if (typeof operationIdClient[operation.operationId] === 'function') {
			continue;
		}
		operationIdClient[operation.operationId] = async (arg1?: unknown, arg2?: unknown): Promise<unknown> => {
			const pathHasParams = hasPathParams(operation.path);
			const method = operation.method.toUpperCase();
			let params: Record<string, unknown> | undefined;
			let query: Record<string, unknown> | undefined;
			let body: unknown;

			if (method === 'GET') {
				if (pathHasParams) {
					params = (arg1 as Record<string, unknown>) ?? {};
					query = (arg2 as Record<string, unknown>) ?? undefined;
				} else {
					query = (arg1 as Record<string, unknown>) ?? undefined;
				}
			} else if (method === 'DELETE') {
				if (pathHasParams) {
					params = (arg1 as Record<string, unknown>) ?? {};
					body = arg2;
				} else {
					body = arg1;
				}
			} else if (pathHasParams) {
				params = (arg1 as Record<string, unknown>) ?? {};
				body = arg2;
			} else {
				body = arg1;
			}

			const url = new URL(`${apiBaseUrl}${buildPathFromTemplate(operation.path, params)}`);
				applyQuery(url, query);

				const headers = body === undefined ? createHeaders(options.getAccessToken) : createJsonHeaders(options.getAccessToken);
				const response = await fetchFn(url.toString(), {
					method,
					redirect: 'manual',
					headers,
					body: body === undefined ? undefined : JSON.stringify(body),
				});
				if (response.status < 200 || response.status >= 400) {
					await throwHttpProblem(response);
				}
				if (response.status === 204) {
					return undefined;
				}
			const contentType = normalizeContentType(response.headers.get('content-type'));
			if (contentType === 'text/event-stream') {
				return response.text();
			}
			if (contentType.includes('json') || contentType.endsWith('+json')) {
				return response.json();
			}
			return response.text();
		};
	}

	return client;
}
