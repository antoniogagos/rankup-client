import type { components, paths } from './generated/openapi.js';

export type GetUserParams = paths['/users/{userId}']['get']['parameters']['path'];
export type GetUserQuery = paths['/users/{userId}']['get']['parameters']['query'];
export type GetUserResponse = paths['/users/{userId}']['get']['responses']['200']['content']['application/json'];

export type ListSportsResponse = paths['/sports']['get']['responses']['200']['content']['application/json'];

export type RegisterUserRequest = paths['/auth/registrations']['post']['requestBody']['content']['application/json'];
export type RegisterUserResponse = paths['/auth/registrations']['post']['responses']['201']['content']['application/json'];

export type ConfirmRegistrationRequest = paths['/auth/registrations/confirm']['post']['requestBody']['content']['application/json'];
export type ConfirmRegistrationResponse = paths['/auth/registrations/confirm']['post']['responses']['200']['content']['application/json'];

export type ResendConfirmationRequest = paths['/auth/registrations/resend-confirmation']['post']['requestBody']['content']['application/json'];

export type CreateSessionRequest = paths['/auth/sessions']['post']['requestBody']['content']['application/json'];
export type CreateSessionResponse = paths['/auth/sessions']['post']['responses']['201']['content']['application/json'];

export type RefreshSessionRequest = paths['/auth/sessions/refresh']['post']['requestBody']['content']['application/json'];
export type RefreshSessionResponse = paths['/auth/sessions/refresh']['post']['responses']['200']['content']['application/json'];

export type RequestPasswordResetRequest = paths['/auth/password-resets']['post']['requestBody']['content']['application/json'];
export type ConfirmPasswordResetRequest = paths['/auth/password-resets/confirm']['post']['requestBody']['content']['application/json'];

export type GetMeResponse = paths['/me']['get']['responses']['200']['content']['application/json'];
export type UpdateMeRequest = paths['/me']['patch']['requestBody']['content']['application/json'];
export type UpdateMeResponse = paths['/me']['patch']['responses']['200']['content']['application/json'];

export type SearchUsersQuery = paths['/users']['get']['parameters']['query'];
export type SearchUsersResponse = paths['/users']['get']['responses']['200']['content']['application/json'];

export type ResolveUserByUsernameParams = paths['/usernames/{username}']['get']['parameters']['path'];
export type ResolveUserByUsernameResponse = paths['/usernames/{username}']['get']['responses']['200']['content']['application/json'];

export type GetMyRelationshipParams = paths['/me/relationships/{userId}']['get']['parameters']['path'];
export type GetMyRelationshipResponse = paths['/me/relationships/{userId}']['get']['responses']['200']['content']['application/json'];

export type ListMyFriendsQuery = paths['/me/friends']['get']['parameters']['query'];
export type ListMyFriendsResponse = paths['/me/friends']['get']['responses']['200']['content']['application/json'];

export type ListMyFollowersQuery = paths['/me/followers']['get']['parameters']['query'];
export type ListMyFollowersResponse = paths['/me/followers']['get']['responses']['200']['content']['application/json'];

export type ListMyFollowingQuery = paths['/me/following']['get']['parameters']['query'];
export type ListMyFollowingResponse = paths['/me/following']['get']['responses']['200']['content']['application/json'];

export type FollowUserParams = paths['/users/{userId}/followers/me']['put']['parameters']['path'];
export type FollowUserResponse = paths['/users/{userId}/followers/me']['put']['responses']['200']['content']['application/json'];

export type UnfollowUserParams = paths['/users/{userId}/followers/me']['delete']['parameters']['path'];

export type ListGameModesQuery = paths['/game-modes']['get']['parameters']['query'];
export type ListGameModesResponse = paths['/game-modes']['get']['responses']['200']['content']['application/json'];

export type GetGameModeParams = paths['/game-modes/{gameModeId}']['get']['parameters']['path'];
export type GetGameModeResponse = paths['/game-modes/{gameModeId}']['get']['responses']['200']['content']['application/json'];

export type ListRulesetsQuery = paths['/rulesets']['get']['parameters']['query'];
export type ListRulesetsResponse = paths['/rulesets']['get']['responses']['200']['content']['application/json'];

export type GetRulesetParams = paths['/rulesets/{rulesetId}']['get']['parameters']['path'];
export type GetRulesetResponse = paths['/rulesets/{rulesetId}']['get']['responses']['200']['content']['application/json'];

export type ListCompetitionsQuery = paths['/competitions']['get']['parameters']['query'];
export type ListCompetitionsResponse = paths['/competitions']['get']['responses']['200']['content']['application/json'];

export type GetCompetitionParams = paths['/competitions/{competitionId}']['get']['parameters']['path'];
export type GetCompetitionResponse = paths['/competitions/{competitionId}']['get']['responses']['200']['content']['application/json'];

export type ListCompetitionSeasonsParams = paths['/competitions/{competitionId}/seasons']['get']['parameters']['path'];
export type ListCompetitionSeasonsResponse = paths['/competitions/{competitionId}/seasons']['get']['responses']['200']['content']['application/json'];

export type GetCompetitionSeasonParams = paths['/competitions/{competitionId}/seasons/{seasonId}']['get']['parameters']['path'];
export type GetCompetitionSeasonResponse =
	paths['/competitions/{competitionId}/seasons/{seasonId}']['get']['responses']['200']['content']['application/json'];

export type ListMatchdaysParams = paths['/competitions/{competitionId}/seasons/{seasonId}/matchdays']['get']['parameters']['path'];
export type ListMatchdaysQuery = paths['/competitions/{competitionId}/seasons/{seasonId}/matchdays']['get']['parameters']['query'];
export type ListMatchdaysResponse =
	paths['/competitions/{competitionId}/seasons/{seasonId}/matchdays']['get']['responses']['200']['content']['application/json'];

export type ListMatchdayMatchesParams =
	paths['/competitions/{competitionId}/seasons/{seasonId}/matchdays/{matchday}/matches']['get']['parameters']['path'];
export type ListMatchdayMatchesQuery =
	paths['/competitions/{competitionId}/seasons/{seasonId}/matchdays/{matchday}/matches']['get']['parameters']['query'];
export type ListMatchdayMatchesResponse =
	paths['/competitions/{competitionId}/seasons/{seasonId}/matchdays/{matchday}/matches']['get']['responses']['200']['content']['application/json'];

export type SearchMatchesQuery = paths['/matches']['get']['parameters']['query'];
export type SearchMatchesResponse = paths['/matches']['get']['responses']['200']['content']['application/json'];

export type GetMatchParams = paths['/matches/{matchId}']['get']['parameters']['path'];
export type GetMatchResponse = paths['/matches/{matchId}']['get']['responses']['200']['content']['application/json'];

export type ListMatchEventsParams = paths['/matches/{matchId}/events']['get']['parameters']['path'];
export type ListMatchEventsQuery = paths['/matches/{matchId}/events']['get']['parameters']['query'];
export type ListMatchEventsResponse = paths['/matches/{matchId}/events']['get']['responses']['200']['content']['application/json'];

export type GetTeamParams = paths['/teams/{teamId}']['get']['parameters']['path'];
export type GetTeamResponse = paths['/teams/{teamId}']['get']['responses']['200']['content']['application/json'];

export type ListMyTournamentsQuery = paths['/me/tournaments']['get']['parameters']['query'];
export type ListMyTournamentsResponse = paths['/me/tournaments']['get']['responses']['200']['content']['application/json'];
export type ListMyDuelsQuery = paths['/me/duels']['get']['parameters']['query'];
export type ListMyDuelsResponse = paths['/me/duels']['get']['responses']['200']['content']['application/json'];

export type CreateTournamentRequest = paths['/tournaments']['post']['requestBody']['content']['application/json'];
export type CreateTournamentResponse = paths['/tournaments']['post']['responses']['201']['content']['application/json'];
export type CreateDuelRequest = paths['/me/duels']['post']['requestBody']['content']['application/json'];
export type CreateDuelResponse = paths['/me/duels']['post']['responses']['201']['content']['application/json'];

export type CreateDuelRematchParams = paths['/tournaments/{tournamentId}/rematch']['post']['parameters']['path'];
export type CreateDuelRematchRequest = components['schemas']['CreateRematchRequest'];
export type CreateDuelRematchResponse =
	paths['/tournaments/{tournamentId}/rematch']['post']['responses']['201']['content']['application/json'];

export type GetTournamentPreviewParams = paths['/tournaments/{tournamentId}/preview']['get']['parameters']['path'];
export type GetTournamentPreviewQuery = paths['/tournaments/{tournamentId}/preview']['get']['parameters']['query'];
export type GetTournamentPreviewResponse = paths['/tournaments/{tournamentId}/preview']['get']['responses']['200']['content']['application/json'];

export type GetVerifiedHubQuery = paths['/verified/hub']['get']['parameters']['query'];
export type GetVerifiedHubResponse = paths['/verified/hub']['get']['responses']['200']['content']['application/json'];

export type ListVerifiedEventsQuery = paths['/verified/events']['get']['parameters']['query'];
export type ListVerifiedEventsResponse = paths['/verified/events']['get']['responses']['200']['content']['application/json'];

export type GetVerifiedEventParams = paths['/verified/events/{eventId}']['get']['parameters']['path'];
export type GetVerifiedEventQuery = paths['/verified/events/{eventId}']['get']['parameters']['query'];
export type GetVerifiedEventResponse = paths['/verified/events/{eventId}']['get']['responses']['200']['content']['application/json'];

export type ListVerifiedEventTournamentsParams = paths['/verified/events/{eventId}/tournaments']['get']['parameters']['path'];
export type ListVerifiedEventTournamentsQuery = paths['/verified/events/{eventId}/tournaments']['get']['parameters']['query'];
export type ListVerifiedEventTournamentsResponse =
	paths['/verified/events/{eventId}/tournaments']['get']['responses']['200']['content']['application/json'];

export type ListVerifiedTournamentsQuery = paths['/verified/tournaments']['get']['parameters']['query'];
export type ListVerifiedTournamentsResponse = paths['/verified/tournaments']['get']['responses']['200']['content']['application/json'];

export type GetVerifiedTournamentPreviewParams = paths['/verified/tournaments/{tournamentId}']['get']['parameters']['path'];
export type GetVerifiedTournamentPreviewResponse =
	paths['/verified/tournaments/{tournamentId}']['get']['responses']['200']['content']['application/json'];

export type GetRankedMetaQuery = paths['/ranked/meta']['get']['parameters']['query'];
export type GetRankedMetaResponse = paths['/ranked/meta']['get']['responses']['200']['content']['application/json'];

export type ListRankedTracksQuery = paths['/ranked/tracks']['get']['parameters']['query'];
export type ListRankedTracksResponse = paths['/ranked/tracks']['get']['responses']['200']['content']['application/json'];

export type GetRankedTrackParams = paths['/ranked/tracks/{rankedTrackId}']['get']['parameters']['path'];
export type GetRankedTrackQuery = paths['/ranked/tracks/{rankedTrackId}']['get']['parameters']['query'];
export type GetRankedTrackResponse = paths['/ranked/tracks/{rankedTrackId}']['get']['responses']['200']['content']['application/json'];

export type ListRankedSeasonsParams = paths['/ranked/tracks/{rankedTrackId}/seasons']['get']['parameters']['path'];
export type ListRankedSeasonsQuery = paths['/ranked/tracks/{rankedTrackId}/seasons']['get']['parameters']['query'];
export type ListRankedSeasonsResponse =
	paths['/ranked/tracks/{rankedTrackId}/seasons']['get']['responses']['200']['content']['application/json'];

export type GetRankedSeasonParams = paths['/ranked/tracks/{rankedTrackId}/seasons/{rankedSeasonId}']['get']['parameters']['path'];
export type GetRankedSeasonQuery = paths['/ranked/tracks/{rankedTrackId}/seasons/{rankedSeasonId}']['get']['parameters']['query'];
export type GetRankedSeasonResponse =
	paths['/ranked/tracks/{rankedTrackId}/seasons/{rankedSeasonId}']['get']['responses']['200']['content']['application/json'];

export type GetRankedLeaderboardParams = paths['/ranked/tracks/{rankedTrackId}/leaderboard']['get']['parameters']['path'];
export type GetRankedLeaderboardQuery = paths['/ranked/tracks/{rankedTrackId}/leaderboard']['get']['parameters']['query'];
export type GetRankedLeaderboardResponse =
	paths['/ranked/tracks/{rankedTrackId}/leaderboard']['get']['responses']['200']['content']['application/json'];

export type GetRankedSeasonLeaderboardParams =
	paths['/ranked/tracks/{rankedTrackId}/seasons/{rankedSeasonId}/leaderboard']['get']['parameters']['path'];
export type GetRankedSeasonLeaderboardQuery =
	paths['/ranked/tracks/{rankedTrackId}/seasons/{rankedSeasonId}/leaderboard']['get']['parameters']['query'];
export type GetRankedSeasonLeaderboardResponse =
	paths['/ranked/tracks/{rankedTrackId}/seasons/{rankedSeasonId}/leaderboard']['get']['responses']['200']['content']['application/json'];

export type GetMyRankedProfileQuery = paths['/me/ranked']['get']['parameters']['query'];
export type GetMyRankedProfileResponse = paths['/me/ranked']['get']['responses']['200']['content']['application/json'];

export type GetMyRankedSettingsResponse = paths['/me/ranked/settings']['get']['responses']['200']['content']['application/json'];
export type UpdateMyRankedSettingsRequest = paths['/me/ranked/settings']['patch']['requestBody']['content']['application/json'];
export type UpdateMyRankedSettingsResponse =
	paths['/me/ranked/settings']['patch']['responses']['200']['content']['application/json'];

export type GetMyRankedTrackParams = paths['/me/ranked/tracks/{rankedTrackId}']['get']['parameters']['path'];
export type GetMyRankedTrackQuery = paths['/me/ranked/tracks/{rankedTrackId}']['get']['parameters']['query'];
export type GetMyRankedTrackResponse =
	paths['/me/ranked/tracks/{rankedTrackId}']['get']['responses']['200']['content']['application/json'];

export type ListMyRankedHistoryParams = paths['/me/ranked/tracks/{rankedTrackId}/history']['get']['parameters']['path'];
export type ListMyRankedHistoryQuery = paths['/me/ranked/tracks/{rankedTrackId}/history']['get']['parameters']['query'];
export type ListMyRankedHistoryResponse =
	paths['/me/ranked/tracks/{rankedTrackId}/history']['get']['responses']['200']['content']['application/json'];

export type GetUserRankedProfileParams = paths['/users/{userId}/ranked']['get']['parameters']['path'];
export type GetUserRankedProfileQuery = paths['/users/{userId}/ranked']['get']['parameters']['query'];
export type GetUserRankedProfileResponse =
	paths['/users/{userId}/ranked']['get']['responses']['200']['content']['application/json'];

export type GetUserRankedTrackParams = paths['/users/{userId}/ranked/tracks/{rankedTrackId}']['get']['parameters']['path'];
export type GetUserRankedTrackQuery = paths['/users/{userId}/ranked/tracks/{rankedTrackId}']['get']['parameters']['query'];
export type GetUserRankedTrackResponse =
	paths['/users/{userId}/ranked/tracks/{rankedTrackId}']['get']['responses']['200']['content']['application/json'];

export type GetAchievementMetaQuery = paths['/achievements/meta']['get']['parameters']['query'];
export type GetAchievementMetaResponse = paths['/achievements/meta']['get']['responses']['200']['content']['application/json'];

export type ListAchievementDefinitionsQuery = paths['/achievements']['get']['parameters']['query'];
export type ListAchievementDefinitionsResponse = paths['/achievements']['get']['responses']['200']['content']['application/json'];

export type GetAchievementDefinitionParams = paths['/achievements/{achievementId}']['get']['parameters']['path'];
export type GetAchievementDefinitionQuery = paths['/achievements/{achievementId}']['get']['parameters']['query'];
export type GetAchievementDefinitionResponse =
	paths['/achievements/{achievementId}']['get']['responses']['200']['content']['application/json'];

export type ListMyAchievementsQuery = paths['/me/achievements']['get']['parameters']['query'];
export type ListMyAchievementsResponse = paths['/me/achievements']['get']['responses']['200']['content']['application/json'];

export type ListMyUnlockedAchievementsQuery = paths['/me/achievements/unlocked']['get']['parameters']['query'];
export type ListMyUnlockedAchievementsResponse =
	paths['/me/achievements/unlocked']['get']['responses']['200']['content']['application/json'];

export type GetMyAchievementParams = paths['/me/achievements/{achievementId}']['get']['parameters']['path'];
export type GetMyAchievementQuery = paths['/me/achievements/{achievementId}']['get']['parameters']['query'];
export type GetMyAchievementResponse =
	paths['/me/achievements/{achievementId}']['get']['responses']['200']['content']['application/json'];

export type ListUserAchievementsParams = paths['/users/{userId}/achievements']['get']['parameters']['path'];
export type ListUserAchievementsQuery = paths['/users/{userId}/achievements']['get']['parameters']['query'];
export type ListUserAchievementsResponse =
	paths['/users/{userId}/achievements']['get']['responses']['200']['content']['application/json'];

export type CreateUploadRequest = paths['/uploads']['post']['requestBody']['content']['application/json'];
export type CreateUploadResponse = paths['/uploads']['post']['responses']['201']['content']['application/json'];

export type GetUploadParams = paths['/uploads/{uploadId}']['get']['parameters']['path'];
export type GetUploadResponse = paths['/uploads/{uploadId}']['get']['responses']['200']['content']['application/json'];

export type AbortUploadParams = paths['/uploads/{uploadId}']['delete']['parameters']['path'];

export type CompleteUploadParams = paths['/uploads/{uploadId}/complete']['post']['parameters']['path'];
export type CompleteUploadRequest = paths['/uploads/{uploadId}/complete']['post']['requestBody']['content']['application/json'];
export type CompleteUploadResponse =
	| paths['/uploads/{uploadId}/complete']['post']['responses']['201']['content']['application/json']
	| paths['/uploads/{uploadId}/complete']['post']['responses']['202']['content']['application/json'];

export type GetMediaParams = paths['/media/{mediaId}']['get']['parameters']['path'];
export type GetMediaQuery = paths['/media/{mediaId}']['get']['parameters']['query'];
export type GetMediaResponse = paths['/media/{mediaId}']['get']['responses']['200']['content']['application/json'];

export type DeleteMediaParams = paths['/media/{mediaId}']['delete']['parameters']['path'];

export type ListTrustPoliciesQuery = paths['/trust/policies']['get']['parameters']['query'];
export type ListTrustPoliciesResponse = paths['/trust/policies']['get']['responses']['200']['content']['application/json'];

export type GetTrustPolicyParams = paths['/trust/policies/{policyId}']['get']['parameters']['path'];
export type GetTrustPolicyResponse = paths['/trust/policies/{policyId}']['get']['responses']['200']['content']['application/json'];

export type GetMyEnforcementStatusResponse = paths['/me/trust/enforcement']['get']['responses']['200']['content']['application/json'];

export type ListMyAppealsQuery = paths['/me/trust/appeals']['get']['parameters']['query'];
export type ListMyAppealsResponse = paths['/me/trust/appeals']['get']['responses']['200']['content']['application/json'];

export type CreateMyAppealRequest = paths['/me/trust/appeals']['post']['requestBody']['content']['application/json'];
export type CreateMyAppealResponse = paths['/me/trust/appeals']['post']['responses']['201']['content']['application/json'];

export type GetMyAppealParams = paths['/me/trust/appeals/{appealId}']['get']['parameters']['path'];
export type GetMyAppealResponse = paths['/me/trust/appeals/{appealId}']['get']['responses']['200']['content']['application/json'];

export type ListMyReportsQuery = paths['/me/trust/reports']['get']['parameters']['query'];
export type ListMyReportsResponse = paths['/me/trust/reports']['get']['responses']['200']['content']['application/json'];

export type CreateReportRequest = paths['/me/trust/reports']['post']['requestBody']['content']['application/json'];
export type CreateReportResponse = paths['/me/trust/reports']['post']['responses']['201']['content']['application/json'];

export type GetMyReportParams = paths['/me/trust/reports/{reportId}']['get']['parameters']['path'];
export type GetMyReportResponse = paths['/me/trust/reports/{reportId}']['get']['responses']['200']['content']['application/json'];

export type ListMyTrustBlocksQuery = paths['/me/trust/blocks']['get']['parameters']['query'];
export type ListMyTrustBlocksResponse = paths['/me/trust/blocks']['get']['responses']['200']['content']['application/json'];

export type ListPromotionsQuery = paths['/promotions']['get']['parameters']['query'];
export type ListPromotionsResponse = paths['/promotions']['get']['responses']['200']['content']['application/json'];

export type GetPromotionParams = paths['/promotions/{promotionId}']['get']['parameters']['path'];
export type GetPromotionQuery = paths['/promotions/{promotionId}']['get']['parameters']['query'];
export type GetPromotionResponse = paths['/promotions/{promotionId}']['get']['responses']['200']['content']['application/json'];

export type ListPromotionWinnersParams = paths['/promotions/{promotionId}/winners']['get']['parameters']['path'];
export type ListPromotionWinnersQuery = paths['/promotions/{promotionId}/winners']['get']['parameters']['query'];
export type ListPromotionWinnersResponse =
	paths['/promotions/{promotionId}/winners']['get']['responses']['200']['content']['application/json'];

export type GetMyPromotionStatusParams = paths['/promotions/{promotionId}/me']['get']['parameters']['path'];
export type GetMyPromotionStatusResponse =
	paths['/promotions/{promotionId}/me']['get']['responses']['200']['content']['application/json'];

export type OptInToPromotionParams = paths['/promotions/{promotionId}/opt-in']['put']['parameters']['path'];
export type OptInToPromotionRequest = paths['/promotions/{promotionId}/opt-in']['put']['requestBody']['content']['application/json'];
export type OptInToPromotionResponse =
	paths['/promotions/{promotionId}/opt-in']['put']['responses']['200']['content']['application/json'];

export type OptOutFromPromotionParams = paths['/promotions/{promotionId}/opt-in']['delete']['parameters']['path'];

export type ListMyPromotionsQuery = paths['/me/promotions']['get']['parameters']['query'];
export type ListMyPromotionsResponse = paths['/me/promotions']['get']['responses']['200']['content']['application/json'];

export type ListMyRewardsQuery = paths['/me/rewards']['get']['parameters']['query'];
export type ListMyRewardsResponse = paths['/me/rewards']['get']['responses']['200']['content']['application/json'];

export type GetMyRewardParams = paths['/me/rewards/{rewardGrantId}']['get']['parameters']['path'];
export type GetMyRewardQuery = paths['/me/rewards/{rewardGrantId}']['get']['parameters']['query'];
export type GetMyRewardResponse = paths['/me/rewards/{rewardGrantId}']['get']['responses']['200']['content']['application/json'];

export type ClaimMyRewardParams = paths['/me/rewards/{rewardGrantId}/claim']['post']['parameters']['path'];
export type ClaimMyRewardRequest =
	paths['/me/rewards/{rewardGrantId}/claim']['post']['requestBody']['content']['application/json'];
export type ClaimMyRewardResponse =
	paths['/me/rewards/{rewardGrantId}/claim']['post']['responses']['200']['content']['application/json'];

export type GetMyRewardFulfillmentProfileResponse =
	paths['/me/rewards/fulfillment-profile']['get']['responses']['200']['content']['application/json'];
export type UpdateMyRewardFulfillmentProfileRequest =
	paths['/me/rewards/fulfillment-profile']['patch']['requestBody']['content']['application/json'];
export type UpdateMyRewardFulfillmentProfileResponse =
	paths['/me/rewards/fulfillment-profile']['patch']['responses']['200']['content']['application/json'];

export type ListCreatorsQuery = paths['/creators']['get']['parameters']['query'];
export type ListCreatorsResponse = paths['/creators']['get']['responses']['200']['content']['application/json'];

export type GetCreatorParams = paths['/creators/{creatorId}']['get']['parameters']['path'];
export type GetCreatorQuery = paths['/creators/{creatorId}']['get']['parameters']['query'];
export type GetCreatorResponse = paths['/creators/{creatorId}']['get']['responses']['200']['content']['application/json'];

export type GetCreatorHubParams = paths['/creators/{creatorId}/hub']['get']['parameters']['path'];
export type GetCreatorHubQuery = paths['/creators/{creatorId}/hub']['get']['parameters']['query'];
export type GetCreatorHubResponse = paths['/creators/{creatorId}/hub']['get']['responses']['200']['content']['application/json'];

export type ListCreatorEventsParams = paths['/creators/{creatorId}/events']['get']['parameters']['path'];
export type ListCreatorEventsQuery = paths['/creators/{creatorId}/events']['get']['parameters']['query'];
export type ListCreatorEventsResponse = paths['/creators/{creatorId}/events']['get']['responses']['200']['content']['application/json'];

export type ListCreatorTournamentsParams = paths['/creators/{creatorId}/tournaments']['get']['parameters']['path'];
export type ListCreatorTournamentsQuery = paths['/creators/{creatorId}/tournaments']['get']['parameters']['query'];
export type ListCreatorTournamentsResponse =
	paths['/creators/{creatorId}/tournaments']['get']['responses']['200']['content']['application/json'];

export type ListCreatorCollectionsParams = paths['/creators/{creatorId}/collections']['get']['parameters']['path'];
export type ListCreatorCollectionsQuery = paths['/creators/{creatorId}/collections']['get']['parameters']['query'];
export type ListCreatorCollectionsResponse =
	paths['/creators/{creatorId}/collections']['get']['responses']['200']['content']['application/json'];

export type GetCreatorCollectionParams = paths['/creators/{creatorId}/collections/{collectionId}']['get']['parameters']['path'];
export type GetCreatorCollectionQuery = paths['/creators/{creatorId}/collections/{collectionId}']['get']['parameters']['query'];
export type GetCreatorCollectionResponse =
	paths['/creators/{creatorId}/collections/{collectionId}']['get']['responses']['200']['content']['application/json'];

export type GetTournamentRankingParams = paths['/tournaments/{tournamentId}/rankings']['get']['parameters']['path'];
export type GetTournamentRankingQuery = paths['/tournaments/{tournamentId}/rankings']['get']['parameters']['query'];
export type GetTournamentRankingResponse = paths['/tournaments/{tournamentId}/rankings']['get']['responses']['200']['content']['application/json'];

export type GetTournamentRankingWindowParams = paths['/tournaments/{tournamentId}/rankings/me']['get']['parameters']['path'];
export type GetTournamentRankingWindowQuery = paths['/tournaments/{tournamentId}/rankings/me']['get']['parameters']['query'];
export type GetTournamentRankingWindowResponse = paths['/tournaments/{tournamentId}/rankings/me']['get']['responses']['200']['content']['application/json'];

export type GetTournamentMatchdayRankingParams = paths['/tournaments/{tournamentId}/matchdays/{matchday}/rankings']['get']['parameters']['path'];
export type GetTournamentMatchdayRankingQuery = paths['/tournaments/{tournamentId}/matchdays/{matchday}/rankings']['get']['parameters']['query'];
export type GetTournamentMatchdayRankingResponse = paths['/tournaments/{tournamentId}/matchdays/{matchday}/rankings']['get']['responses']['200']['content']['application/json'];

export type GetTournamentMatchdayRankingWindowParams = paths['/tournaments/{tournamentId}/matchdays/{matchday}/rankings/me']['get']['parameters']['path'];
export type GetTournamentMatchdayRankingWindowQuery = paths['/tournaments/{tournamentId}/matchdays/{matchday}/rankings/me']['get']['parameters']['query'];
export type GetTournamentMatchdayRankingWindowResponse = paths['/tournaments/{tournamentId}/matchdays/{matchday}/rankings/me']['get']['responses']['200']['content']['application/json'];

export type ListTournamentMatchdaysParams = paths['/tournaments/{tournamentId}/matchdays']['get']['parameters']['path'];
export type ListTournamentMatchdaysQuery = paths['/tournaments/{tournamentId}/matchdays']['get']['parameters']['query'];
export type ListTournamentMatchdaysResponse = paths['/tournaments/{tournamentId}/matchdays']['get']['responses']['200']['content']['application/json'];

export type GetTournamentMatchdayParams = paths['/tournaments/{tournamentId}/matchdays/{matchday}']['get']['parameters']['path'];
export type GetTournamentMatchdayResponse = paths['/tournaments/{tournamentId}/matchdays/{matchday}']['get']['responses']['200']['content']['application/json'];

export type GetTournamentMatchdayAvailabilityParams = paths['/tournaments/{tournamentId}/matchdays/{matchday}/availability']['get']['parameters']['path'];
export type GetTournamentMatchdayAvailabilityResponse = paths['/tournaments/{tournamentId}/matchdays/{matchday}/availability']['get']['responses']['200']['content']['application/json'];

export type GetMatchdayMatchesParams = paths['/tournaments/{tournamentId}/matchdays/{matchday}/matches']['get']['parameters']['path'];
export type GetMatchdayMatchesQuery = paths['/tournaments/{tournamentId}/matchdays/{matchday}/matches']['get']['parameters']['query'];
export type GetMatchdayMatchesResponse = paths['/tournaments/{tournamentId}/matchdays/{matchday}/matches']['get']['responses']['200']['content']['application/json'];

export type ListMatchdaySubmissionsParams =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions']['get']['parameters']['path'];
export type ListMatchdaySubmissionsQuery =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions']['get']['parameters']['query'];
export type ListMatchdaySubmissionsResponse =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions']['get']['responses']['200']['content']['application/json'];

export type GetMyMatchdaySubmissionParams =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions/me']['get']['parameters']['path'];
export type GetMyMatchdaySubmissionResponse =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions/me']['get']['responses']['200']['content']['application/json'];

export type UpsertMyMatchdaySubmissionParams =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions/me']['put']['parameters']['path'] & {
		idempotencyKey?: components['parameters']['IdempotencyKey'];
		ifMatch?: components['parameters']['IfMatchOptional'];
	};
export type UpsertMyMatchdaySubmissionRequest =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions/me']['put']['requestBody']['content']['application/json'];
export type UpsertMyMatchdaySubmissionResponse =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions/me']['put']['responses']['200']['content']['application/json'];

export type ClearMyMatchdaySubmissionParams =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions/me']['delete']['parameters']['path'] & {
		idempotencyKey?: components['parameters']['IdempotencyKey'];
	};

export type GetUserMatchdaySubmissionParams =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions/users/{userId}']['get']['parameters']['path'];
export type GetUserMatchdaySubmissionResponse =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/submissions/users/{userId}']['get']['responses']['200']['content']['application/json'];

export type ListTournamentMembersParams = paths['/tournaments/{tournamentId}/members']['get']['parameters']['path'];
export type ListTournamentMembersQuery = paths['/tournaments/{tournamentId}/members']['get']['parameters']['query'];
export type ListTournamentMembersResponse = paths['/tournaments/{tournamentId}/members']['get']['responses']['200']['content']['application/json'];

export type JoinTournamentParams = paths['/tournaments/{tournamentId}/members/me']['put']['parameters']['path'] & {
	idempotencyKey?: components['parameters']['IdempotencyKey'];
};
export type JoinTournamentRequest = components['schemas']['JoinTournamentRequest'];
export type JoinTournamentResponse = components['schemas']['JoinTournamentResult'];
export type LeaveTournamentParams = paths['/tournaments/{tournamentId}/members/me']['delete']['parameters']['path'];

export type UpdateTournamentMemberParams = paths['/tournaments/{tournamentId}/members/{userId}']['patch']['parameters']['path'];
export type UpdateTournamentMemberRequest = components['schemas']['UpdateTournamentMemberRequest'];
export type UpdateTournamentMemberResponse = paths['/tournaments/{tournamentId}/members/{userId}']['patch']['responses']['200']['content']['application/json'];

export type RemoveTournamentMemberParams = paths['/tournaments/{tournamentId}/members/{userId}']['delete']['parameters']['path'];
export type RemoveTournamentMemberRequest = components['schemas']['RemoveTournamentMemberRequest'];

export type ListTournamentInvitationCodesParams = paths['/tournaments/{tournamentId}/invitation-codes']['get']['parameters']['path'];
export type ListTournamentInvitationCodesQuery = paths['/tournaments/{tournamentId}/invitation-codes']['get']['parameters']['query'];
export type ListTournamentInvitationCodesResponse = paths['/tournaments/{tournamentId}/invitation-codes']['get']['responses']['200']['content']['application/json'];

export type CreateTournamentInvitationCodeParams = paths['/tournaments/{tournamentId}/invitation-codes']['post']['parameters']['path'];
export type CreateTournamentInvitationCodeRequest = components['schemas']['CreateInvitationCodeRequest'];
export type CreateInvitationCodeRequest = CreateTournamentInvitationCodeRequest;
export type CreateTournamentInvitationCodeResponse = paths['/tournaments/{tournamentId}/invitation-codes']['post']['responses']['201']['content']['application/json'];

export type ResolveInvitationCodeParams = paths['/invitation-codes/{code}']['get']['parameters']['path'];
export type ResolveInvitationCodeResponse = paths['/invitation-codes/{code}']['get']['responses']['200']['content']['application/json'];

export type JoinTournamentByInvitationCodeParams = paths['/invitation-codes/{code}/members/me']['put']['parameters']['path'] & {
	idempotencyKey?: components['parameters']['IdempotencyKey'];
};
export type JoinTournamentByInvitationCodeRequest = components['schemas']['JoinByInvitationCodeRequest'];
export type JoinTournamentByInvitationCodeResponse = components['schemas']['JoinByInvitationCodeResult'];

export type ListTournamentInvitesParams = paths['/tournaments/{tournamentId}/invites']['get']['parameters']['path'];
export type ListTournamentInvitesQuery = paths['/tournaments/{tournamentId}/invites']['get']['parameters']['query'];
export type ListTournamentInvitesResponse = paths['/tournaments/{tournamentId}/invites']['get']['responses']['200']['content']['application/json'];

export type CreateTournamentInvitesParams = paths['/tournaments/{tournamentId}/invites']['post']['parameters']['path'];
export type CreateTournamentInvitesRequest = components['schemas']['CreateTournamentInvitesRequest'];
export type CreateTournamentInvitesResponse = paths['/tournaments/{tournamentId}/invites']['post']['responses']['201']['content']['application/json'];

export type CancelTournamentInviteParams = paths['/tournaments/{tournamentId}/invites/{inviteId}']['delete']['parameters']['path'];

export type ListMyTournamentInvitesQuery = paths['/me/tournament-invites']['get']['parameters']['query'];
export type ListMyTournamentInvitesResponse = paths['/me/tournament-invites']['get']['responses']['200']['content']['application/json'];

export type GetMyTournamentInviteParams = paths['/me/tournament-invites/{inviteId}']['get']['parameters']['path'];
export type GetMyTournamentInviteQuery = paths['/me/tournament-invites/{inviteId}']['get']['parameters']['query'];
export type GetMyTournamentInviteResponse = paths['/me/tournament-invites/{inviteId}']['get']['responses']['200']['content']['application/json'];

export type GetMyTournamentInviteUnreadCountResponse = paths['/me/tournament-invites/unread-count']['get']['responses']['200']['content']['application/json'];

export type HideMyTournamentInviteParams = paths['/me/tournament-invites/{inviteId}']['delete']['parameters']['path'];
export type MarkMyTournamentInviteSeenParams = paths['/me/tournament-invites/{inviteId}/seen']['put']['parameters']['path'];

export type AcceptMyTournamentInviteParams = paths['/me/tournament-invites/{inviteId}/accept']['put']['parameters']['path'];
export type AcceptMyTournamentInviteRequest = components['schemas']['AcceptTournamentInviteRequest'];
export type AcceptMyTournamentInviteResponse = paths['/me/tournament-invites/{inviteId}/accept']['put']['responses']['200']['content']['application/json'];

export type DeclineMyTournamentInviteParams = paths['/me/tournament-invites/{inviteId}/decline']['put']['parameters']['path'];
export type DeclineMyTournamentInviteRequest = components['schemas']['DeclineTournamentInviteRequest'];
export type DeclineMyTournamentInviteResponse = paths['/me/tournament-invites/{inviteId}/decline']['put']['responses']['200']['content']['application/json'];

export type AuthorizeParams = paths['/auth/oauth/authorize']['get']['parameters']['query'];
export type AuthorizeResponse = paths['/auth/oauth/authorize']['get']['responses']['302'];

export type TokenRequestBody = paths['/auth/oauth/token']['post']['requestBody']['content']['application/json'];
export type TokenResponse = paths['/auth/oauth/token']['post']['responses']['200']['content']['application/json'];

export type ListMyNotificationsQuery = paths['/me/notifications']['get']['parameters']['query'];
export type ListMyNotificationsResponse = paths['/me/notifications']['get']['responses']['200']['content']['application/json'];

export type GetMyNotificationParams = paths['/me/notifications/{notificationId}']['get']['parameters']['path'];
export type GetMyNotificationQuery = paths['/me/notifications/{notificationId}']['get']['parameters']['query'];
export type GetMyNotificationResponse = paths['/me/notifications/{notificationId}']['get']['responses']['200']['content']['application/json'];

export type GetMyNotificationUnreadCountQuery = paths['/me/notifications/unread-count']['get']['parameters']['query'];
export type GetMyNotificationUnreadCountResponse = paths['/me/notifications/unread-count']['get']['responses']['200']['content']['application/json'];

export type MarkMyNotificationSeenParams = paths['/me/notifications/{notificationId}/seen']['put']['parameters']['path'];
export type MarkMyNotificationReadParams = paths['/me/notifications/{notificationId}/read']['put']['parameters']['path'];
export type DismissMyNotificationParams = paths['/me/notifications/{notificationId}/dismiss']['put']['parameters']['path'];

export type BatchUpdateMyNotificationsRequest = paths['/me/notifications/batch']['post']['requestBody']['content']['application/json'];
export type BatchUpdateMyNotificationsResponse = paths['/me/notifications/batch']['post']['responses']['200']['content']['application/json'];

export type ListMyFeedQuery = paths['/me/feed']['get']['parameters']['query'];
export type ListMyFeedResponse = paths['/me/feed']['get']['responses']['200']['content']['application/json'];

export type GetMyFeedItemParams = paths['/me/feed/{feedItemId}']['get']['parameters']['path'];
export type GetMyFeedItemResponse = paths['/me/feed/{feedItemId}']['get']['responses']['200']['content']['application/json'];

export type GetMyFeedReadCursorResponse = paths['/me/feed/read-cursor']['get']['responses']['200']['content']['application/json'];
export type UpdateMyFeedReadCursorRequest = paths['/me/feed/read-cursor']['put']['requestBody']['content']['application/json'];
export type UpdateMyFeedReadCursorResponse = paths['/me/feed/read-cursor']['put']['responses']['200']['content']['application/json'];

export type ListMyUpdatesQuery = paths['/me/updates']['get']['parameters']['query'];
export type ListMyUpdatesResponse = paths['/me/updates']['get']['responses']['200']['content']['application/json'];

export type StreamMyLiveUpdatesQuery = paths['/me/live']['get']['parameters']['query'];
export type StreamMyLiveUpdatesResponse = paths['/me/live']['get']['responses']['200']['content']['text/event-stream'];

export type GetTournamentChatParams = paths['/tournaments/{tournamentId}/chat']['get']['parameters']['path'];
export type GetTournamentChatResponse = paths['/tournaments/{tournamentId}/chat']['get']['responses']['200']['content']['application/json'];

export type UpdateTournamentChatSettingsParams = paths['/tournaments/{tournamentId}/chat']['patch']['parameters']['path'];
export type UpdateTournamentChatSettingsRequest = paths['/tournaments/{tournamentId}/chat']['patch']['requestBody']['content']['application/json'];
export type UpdateTournamentChatSettingsResponse = paths['/tournaments/{tournamentId}/chat']['patch']['responses']['200']['content']['application/json'];

export type ListTournamentChatMessagesParams = paths['/tournaments/{tournamentId}/chat/messages']['get']['parameters']['path'];
export type ListTournamentChatMessagesQuery = paths['/tournaments/{tournamentId}/chat/messages']['get']['parameters']['query'];
export type ListTournamentChatMessagesResponse = paths['/tournaments/{tournamentId}/chat/messages']['get']['responses']['200']['content']['application/json'];

export type SendTournamentChatMessageParams = paths['/tournaments/{tournamentId}/chat/messages']['post']['parameters']['path'];
export type SendTournamentChatMessageRequest = paths['/tournaments/{tournamentId}/chat/messages']['post']['requestBody']['content']['application/json'];
export type SendTournamentChatMessageResponse = paths['/tournaments/{tournamentId}/chat/messages']['post']['responses']['201']['content']['application/json'];

export type GetTournamentChatMessageParams = paths['/tournaments/{tournamentId}/chat/messages/{messageId}']['get']['parameters']['path'];
export type GetTournamentChatMessageResponse =
	paths['/tournaments/{tournamentId}/chat/messages/{messageId}']['get']['responses']['200']['content']['application/json'];

export type EditTournamentChatMessageParams = paths['/tournaments/{tournamentId}/chat/messages/{messageId}']['patch']['parameters']['path'];
export type EditTournamentChatMessageRequest = paths['/tournaments/{tournamentId}/chat/messages/{messageId}']['patch']['requestBody']['content']['application/json'];
export type EditTournamentChatMessageResponse =
	paths['/tournaments/{tournamentId}/chat/messages/{messageId}']['patch']['responses']['200']['content']['application/json'];

export type DeleteTournamentChatMessageParams = paths['/tournaments/{tournamentId}/chat/messages/{messageId}']['delete']['parameters']['path'];
export type DeleteTournamentChatMessageRequest =
	NonNullable<paths['/tournaments/{tournamentId}/chat/messages/{messageId}']['delete']['requestBody']>['content']['application/json'];

export type GetTournamentChatUnreadCountParams = paths['/tournaments/{tournamentId}/chat/unread-count']['get']['parameters']['path'];
export type GetTournamentChatUnreadCountResponse =
	paths['/tournaments/{tournamentId}/chat/unread-count']['get']['responses']['200']['content']['application/json'];

export type GetTournamentChatReadCursorParams = paths['/tournaments/{tournamentId}/chat/read-cursor']['get']['parameters']['path'];
export type GetTournamentChatReadCursorResponse =
	paths['/tournaments/{tournamentId}/chat/read-cursor']['get']['responses']['200']['content']['application/json'];

export type UpdateTournamentChatReadCursorParams = paths['/tournaments/{tournamentId}/chat/read-cursor']['put']['parameters']['path'];
export type UpdateTournamentChatReadCursorRequest = paths['/tournaments/{tournamentId}/chat/read-cursor']['put']['requestBody']['content']['application/json'];
export type UpdateTournamentChatReadCursorResponse =
	paths['/tournaments/{tournamentId}/chat/read-cursor']['put']['responses']['200']['content']['application/json'];

export type ListTournamentChatPinsParams = paths['/tournaments/{tournamentId}/chat/pins']['get']['parameters']['path'];
export type ListTournamentChatPinsResponse = paths['/tournaments/{tournamentId}/chat/pins']['get']['responses']['200']['content']['application/json'];

export type PinTournamentChatMessageParams = paths['/tournaments/{tournamentId}/chat/messages/{messageId}/pin']['put']['parameters']['path'];
export type PinTournamentChatMessageRequest =
	NonNullable<paths['/tournaments/{tournamentId}/chat/messages/{messageId}/pin']['put']['requestBody']>['content']['application/json'];
export type PinTournamentChatMessageResponse =
	paths['/tournaments/{tournamentId}/chat/messages/{messageId}/pin']['put']['responses']['200']['content']['application/json'];

export type UnpinTournamentChatMessageParams =
	paths['/tournaments/{tournamentId}/chat/messages/{messageId}/pin']['delete']['parameters']['path'];

export type ListTournamentChatMutesParams = paths['/tournaments/{tournamentId}/chat/mutes']['get']['parameters']['path'];
export type ListTournamentChatMutesQuery = paths['/tournaments/{tournamentId}/chat/mutes']['get']['parameters']['query'];
export type ListTournamentChatMutesResponse = paths['/tournaments/{tournamentId}/chat/mutes']['get']['responses']['200']['content']['application/json'];

export type MuteTournamentChatUserParams = paths['/tournaments/{tournamentId}/chat/mutes/{userId}']['put']['parameters']['path'];
export type MuteTournamentChatUserRequest = paths['/tournaments/{tournamentId}/chat/mutes/{userId}']['put']['requestBody']['content']['application/json'];
export type MuteTournamentChatUserResponse =
	paths['/tournaments/{tournamentId}/chat/mutes/{userId}']['put']['responses']['200']['content']['application/json'];

export type UnmuteTournamentChatUserParams = paths['/tournaments/{tournamentId}/chat/mutes/{userId}']['delete']['parameters']['path'];

export type ReportTournamentChatContentParams = paths['/tournaments/{tournamentId}/chat/reports']['post']['parameters']['path'];
export type ReportTournamentChatContentRequest = paths['/tournaments/{tournamentId}/chat/reports']['post']['requestBody']['content']['application/json'];
export type ReportTournamentChatContentResponse =
	paths['/tournaments/{tournamentId}/chat/reports']['post']['responses']['201']['content']['application/json'];

export type ListTournamentChatUpdatesParams = paths['/tournaments/{tournamentId}/chat/updates']['get']['parameters']['path'];
export type ListTournamentChatUpdatesQuery = paths['/tournaments/{tournamentId}/chat/updates']['get']['parameters']['query'];
export type ListTournamentChatUpdatesResponse =
	paths['/tournaments/{tournamentId}/chat/updates']['get']['responses']['200']['content']['application/json'];

export type StreamTournamentChatLiveParams = paths['/tournaments/{tournamentId}/chat/live']['get']['parameters']['path'];
export type StreamTournamentChatLiveResponse = paths['/tournaments/{tournamentId}/chat/live']['get']['responses']['200']['content']['text/event-stream'];

export type GetMyStatsQuery = paths['/me/stats']['get']['parameters']['query'];
export type GetMyStatsResponse = paths['/me/stats']['get']['responses']['200']['content']['application/json'];

export type GetUserStatsParams = paths['/users/{userId}/stats']['get']['parameters']['path'];
export type GetUserStatsQuery = paths['/users/{userId}/stats']['get']['parameters']['query'];
export type GetUserStatsResponse = paths['/users/{userId}/stats']['get']['responses']['200']['content']['application/json'];

export type ListMyRecapsQuery = paths['/me/recaps']['get']['parameters']['query'];
export type ListMyRecapsResponse = paths['/me/recaps']['get']['responses']['200']['content']['application/json'];

export type RequestMyRecapRequest = paths['/me/recaps']['post']['requestBody']['content']['application/json'];
export type RequestMyRecapResponse = paths['/me/recaps']['post']['responses']['202']['content']['application/json'];

export type GetMyRecapParams = paths['/me/recaps/{recapId}']['get']['parameters']['path'];
export type GetMyRecapResponse = paths['/me/recaps/{recapId}']['get']['responses']['200']['content']['application/json'];

export type HideMyRecapParams = paths['/me/recaps/{recapId}']['delete']['parameters']['path'];

export type ListTournamentRecapsParams = paths['/tournaments/{tournamentId}/recaps']['get']['parameters']['path'];
export type ListTournamentRecapsQuery = paths['/tournaments/{tournamentId}/recaps']['get']['parameters']['query'];
export type ListTournamentRecapsResponse = paths['/tournaments/{tournamentId}/recaps']['get']['responses']['200']['content']['application/json'];

export type GetTournamentRecapParams = paths['/tournaments/{tournamentId}/recaps/{recapId}']['get']['parameters']['path'];
export type GetTournamentRecapQuery = paths['/tournaments/{tournamentId}/recaps/{recapId}']['get']['parameters']['query'];
export type GetTournamentRecapResponse = paths['/tournaments/{tournamentId}/recaps/{recapId}']['get']['responses']['200']['content']['application/json'];

export type GetTournamentStatsParams = paths['/tournaments/{tournamentId}/stats']['get']['parameters']['path'];
export type GetTournamentStatsQuery = paths['/tournaments/{tournamentId}/stats']['get']['parameters']['query'];
export type GetTournamentStatsResponse = paths['/tournaments/{tournamentId}/stats']['get']['responses']['200']['content']['application/json'];

export type GetMyTournamentStatsParams = paths['/tournaments/{tournamentId}/stats/me']['get']['parameters']['path'];
export type GetMyTournamentStatsQuery = paths['/tournaments/{tournamentId}/stats/me']['get']['parameters']['query'];
export type GetMyTournamentStatsResponse = paths['/tournaments/{tournamentId}/stats/me']['get']['responses']['200']['content']['application/json'];

export type GetTournamentMatchdayStatsParams =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/stats']['get']['parameters']['path'];
export type GetTournamentMatchdayStatsQuery =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/stats']['get']['parameters']['query'];
export type GetTournamentMatchdayStatsResponse =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/stats']['get']['responses']['200']['content']['application/json'];

export type GetMyTournamentMatchdayStatsParams =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/stats/me']['get']['parameters']['path'];
export type GetMyTournamentMatchdayStatsQuery =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/stats/me']['get']['parameters']['query'];
export type GetMyTournamentMatchdayStatsResponse =
	paths['/tournaments/{tournamentId}/matchdays/{matchday}/stats/me']['get']['responses']['200']['content']['application/json'];

export interface RankupApiClient {
	getUser(params: GetUserParams, query?: GetUserQuery): Promise<GetUserResponse>;
	listSports(): Promise<ListSportsResponse>;
	registerUser(body: RegisterUserRequest): Promise<RegisterUserResponse>;
	confirmRegistration(body: ConfirmRegistrationRequest): Promise<ConfirmRegistrationResponse>;
	resendRegistrationConfirmation(body: ResendConfirmationRequest): Promise<void>;
	createSession(body: CreateSessionRequest): Promise<CreateSessionResponse>;
	refreshSession(body: RefreshSessionRequest): Promise<RefreshSessionResponse>;
	logout(): Promise<void>;
	requestPasswordReset(body: RequestPasswordResetRequest): Promise<void>;
	confirmPasswordReset(body: ConfirmPasswordResetRequest): Promise<void>;
	getMe(): Promise<GetMeResponse>;
	updateMe(body: UpdateMeRequest): Promise<UpdateMeResponse>;
	searchUsers(query: SearchUsersQuery): Promise<SearchUsersResponse>;
	resolveUserByUsername(params: ResolveUserByUsernameParams): Promise<ResolveUserByUsernameResponse>;
	getMyRelationship(params: GetMyRelationshipParams): Promise<GetMyRelationshipResponse>;
	listMyFriends(query?: ListMyFriendsQuery): Promise<ListMyFriendsResponse>;
	listMyFollowers(query?: ListMyFollowersQuery): Promise<ListMyFollowersResponse>;
	listMyFollowing(query?: ListMyFollowingQuery): Promise<ListMyFollowingResponse>;
	followUser(params: FollowUserParams): Promise<FollowUserResponse>;
	unfollowUser(params: UnfollowUserParams): Promise<void>;
	listGameModes(query?: ListGameModesQuery): Promise<ListGameModesResponse>;
	getGameMode(params: GetGameModeParams): Promise<GetGameModeResponse>;
	listRulesets(query?: ListRulesetsQuery): Promise<ListRulesetsResponse>;
	getRuleset(params: GetRulesetParams): Promise<GetRulesetResponse>;
	listCompetitions(query?: ListCompetitionsQuery): Promise<ListCompetitionsResponse>;
	getCompetition(params: GetCompetitionParams): Promise<GetCompetitionResponse>;
	listCompetitionSeasons(params: ListCompetitionSeasonsParams): Promise<ListCompetitionSeasonsResponse>;
	getCompetitionSeason(params: GetCompetitionSeasonParams): Promise<GetCompetitionSeasonResponse>;
	getTeam(params: GetTeamParams): Promise<GetTeamResponse>;
	listMatchdays(params: ListMatchdaysParams, query?: ListMatchdaysQuery): Promise<ListMatchdaysResponse>;
	listMatchdayMatches(params: ListMatchdayMatchesParams, query?: ListMatchdayMatchesQuery): Promise<ListMatchdayMatchesResponse>;
	searchMatches(query?: SearchMatchesQuery): Promise<SearchMatchesResponse>;
	getMatch(params: GetMatchParams): Promise<GetMatchResponse>;
	listMatchEvents(params: ListMatchEventsParams, query?: ListMatchEventsQuery): Promise<ListMatchEventsResponse>;
	listMyTournaments(query?: ListMyTournamentsQuery): Promise<ListMyTournamentsResponse>;
	listMyDuels(query?: ListMyDuelsQuery): Promise<ListMyDuelsResponse>;
	createTournament(body: CreateTournamentRequest): Promise<CreateTournamentResponse>;
	createDuel(body: CreateDuelRequest): Promise<CreateDuelResponse>;
	createDuelRematch(params: CreateDuelRematchParams, body?: CreateDuelRematchRequest): Promise<CreateDuelRematchResponse>;
	getTournamentPreview(params: GetTournamentPreviewParams, query?: GetTournamentPreviewQuery): Promise<GetTournamentPreviewResponse>;
	getVerifiedHub(query?: GetVerifiedHubQuery): Promise<GetVerifiedHubResponse>;
	listVerifiedEvents(query?: ListVerifiedEventsQuery): Promise<ListVerifiedEventsResponse>;
	getVerifiedEvent(params: GetVerifiedEventParams, query?: GetVerifiedEventQuery): Promise<GetVerifiedEventResponse>;
	listVerifiedEventTournaments(
		params: ListVerifiedEventTournamentsParams,
		query?: ListVerifiedEventTournamentsQuery,
	): Promise<ListVerifiedEventTournamentsResponse>;
	listVerifiedTournaments(query?: ListVerifiedTournamentsQuery): Promise<ListVerifiedTournamentsResponse>;
	getVerifiedTournamentPreview(params: GetVerifiedTournamentPreviewParams): Promise<GetVerifiedTournamentPreviewResponse>;
	getRankedMeta(query?: GetRankedMetaQuery): Promise<GetRankedMetaResponse>;
	listRankedTracks(query?: ListRankedTracksQuery): Promise<ListRankedTracksResponse>;
	getRankedTrack(params: GetRankedTrackParams, query?: GetRankedTrackQuery): Promise<GetRankedTrackResponse>;
	listRankedSeasons(params: ListRankedSeasonsParams, query?: ListRankedSeasonsQuery): Promise<ListRankedSeasonsResponse>;
	getRankedSeason(params: GetRankedSeasonParams, query?: GetRankedSeasonQuery): Promise<GetRankedSeasonResponse>;
	getRankedLeaderboard(params: GetRankedLeaderboardParams, query?: GetRankedLeaderboardQuery): Promise<GetRankedLeaderboardResponse>;
	getRankedSeasonLeaderboard(
		params: GetRankedSeasonLeaderboardParams,
		query?: GetRankedSeasonLeaderboardQuery,
	): Promise<GetRankedSeasonLeaderboardResponse>;
	getMyRankedProfile(query?: GetMyRankedProfileQuery): Promise<GetMyRankedProfileResponse>;
	getMyRankedSettings(): Promise<GetMyRankedSettingsResponse>;
	updateMyRankedSettings(body: UpdateMyRankedSettingsRequest): Promise<UpdateMyRankedSettingsResponse>;
	getMyRankedTrack(params: GetMyRankedTrackParams, query?: GetMyRankedTrackQuery): Promise<GetMyRankedTrackResponse>;
	listMyRankedHistory(params: ListMyRankedHistoryParams, query?: ListMyRankedHistoryQuery): Promise<ListMyRankedHistoryResponse>;
	getUserRankedProfile(params: GetUserRankedProfileParams, query?: GetUserRankedProfileQuery): Promise<GetUserRankedProfileResponse>;
	getUserRankedTrack(params: GetUserRankedTrackParams, query?: GetUserRankedTrackQuery): Promise<GetUserRankedTrackResponse>;
	getAchievementMeta(query?: GetAchievementMetaQuery): Promise<GetAchievementMetaResponse>;
	listAchievementDefinitions(query?: ListAchievementDefinitionsQuery): Promise<ListAchievementDefinitionsResponse>;
	getAchievementDefinition(
		params: GetAchievementDefinitionParams,
		query?: GetAchievementDefinitionQuery,
	): Promise<GetAchievementDefinitionResponse>;
	listMyAchievements(query?: ListMyAchievementsQuery): Promise<ListMyAchievementsResponse>;
	listMyUnlockedAchievements(query?: ListMyUnlockedAchievementsQuery): Promise<ListMyUnlockedAchievementsResponse>;
	getMyAchievement(params: GetMyAchievementParams, query?: GetMyAchievementQuery): Promise<GetMyAchievementResponse>;
	listUserAchievements(params: ListUserAchievementsParams, query?: ListUserAchievementsQuery): Promise<ListUserAchievementsResponse>;
	createUpload(body: CreateUploadRequest): Promise<CreateUploadResponse>;
	getUpload(params: GetUploadParams): Promise<GetUploadResponse>;
	abortUpload(params: AbortUploadParams): Promise<void>;
	completeUpload(params: CompleteUploadParams, body: CompleteUploadRequest): Promise<CompleteUploadResponse>;
	getMedia(params: GetMediaParams, query?: GetMediaQuery): Promise<GetMediaResponse>;
	deleteMedia(params: DeleteMediaParams): Promise<void>;
	listTrustPolicies(query?: ListTrustPoliciesQuery): Promise<ListTrustPoliciesResponse>;
	getTrustPolicy(params: GetTrustPolicyParams): Promise<GetTrustPolicyResponse>;
	getMyEnforcementStatus(): Promise<GetMyEnforcementStatusResponse>;
	listMyAppeals(query?: ListMyAppealsQuery): Promise<ListMyAppealsResponse>;
	createMyAppeal(body: CreateMyAppealRequest): Promise<CreateMyAppealResponse>;
	getMyAppeal(params: GetMyAppealParams): Promise<GetMyAppealResponse>;
	listMyReports(query?: ListMyReportsQuery): Promise<ListMyReportsResponse>;
	createReport(body: CreateReportRequest): Promise<CreateReportResponse>;
	getMyReport(params: GetMyReportParams): Promise<GetMyReportResponse>;
	listMyTrustBlocks(query?: ListMyTrustBlocksQuery): Promise<ListMyTrustBlocksResponse>;
	listPromotions(query?: ListPromotionsQuery): Promise<ListPromotionsResponse>;
	getPromotion(params: GetPromotionParams, query?: GetPromotionQuery): Promise<GetPromotionResponse>;
	listPromotionWinners(params: ListPromotionWinnersParams, query?: ListPromotionWinnersQuery): Promise<ListPromotionWinnersResponse>;
	getMyPromotionStatus(params: GetMyPromotionStatusParams): Promise<GetMyPromotionStatusResponse>;
	optInToPromotion(params: OptInToPromotionParams, body: OptInToPromotionRequest): Promise<OptInToPromotionResponse>;
	optOutFromPromotion(params: OptOutFromPromotionParams): Promise<void>;
	listMyPromotions(query?: ListMyPromotionsQuery): Promise<ListMyPromotionsResponse>;
	listMyRewards(query?: ListMyRewardsQuery): Promise<ListMyRewardsResponse>;
	getMyReward(params: GetMyRewardParams, query?: GetMyRewardQuery): Promise<GetMyRewardResponse>;
	claimMyReward(params: ClaimMyRewardParams, body: ClaimMyRewardRequest): Promise<ClaimMyRewardResponse>;
	getMyRewardFulfillmentProfile(): Promise<GetMyRewardFulfillmentProfileResponse>;
	updateMyRewardFulfillmentProfile(body: UpdateMyRewardFulfillmentProfileRequest): Promise<UpdateMyRewardFulfillmentProfileResponse>;
	listCreators(query?: ListCreatorsQuery): Promise<ListCreatorsResponse>;
	getCreator(params: GetCreatorParams, query?: GetCreatorQuery): Promise<GetCreatorResponse>;
	getCreatorHub(params: GetCreatorHubParams, query?: GetCreatorHubQuery): Promise<GetCreatorHubResponse>;
	listCreatorEvents(params: ListCreatorEventsParams, query?: ListCreatorEventsQuery): Promise<ListCreatorEventsResponse>;
	listCreatorTournaments(
		params: ListCreatorTournamentsParams,
		query?: ListCreatorTournamentsQuery,
	): Promise<ListCreatorTournamentsResponse>;
	listCreatorCollections(
		params: ListCreatorCollectionsParams,
		query?: ListCreatorCollectionsQuery,
	): Promise<ListCreatorCollectionsResponse>;
	getCreatorCollection(
		params: GetCreatorCollectionParams,
		query?: GetCreatorCollectionQuery,
	): Promise<GetCreatorCollectionResponse>;
	getTournamentRanking(params: GetTournamentRankingParams, query?: GetTournamentRankingQuery): Promise<GetTournamentRankingResponse>;
	getTournamentRankingWindow(params: GetTournamentRankingWindowParams, query?: GetTournamentRankingWindowQuery): Promise<GetTournamentRankingWindowResponse>;
	getTournamentMatchdayRanking(params: GetTournamentMatchdayRankingParams, query?: GetTournamentMatchdayRankingQuery): Promise<GetTournamentMatchdayRankingResponse>;
	getTournamentMatchdayRankingWindow(
		params: GetTournamentMatchdayRankingWindowParams,
		query?: GetTournamentMatchdayRankingWindowQuery,
	): Promise<GetTournamentMatchdayRankingWindowResponse>;
	listTournamentMatchdays(params: ListTournamentMatchdaysParams, query?: ListTournamentMatchdaysQuery): Promise<ListTournamentMatchdaysResponse>;
	getTournamentMatchday(params: GetTournamentMatchdayParams): Promise<GetTournamentMatchdayResponse>;
	getTournamentMatchdayAvailability(params: GetTournamentMatchdayAvailabilityParams): Promise<GetTournamentMatchdayAvailabilityResponse>;
	getMatchdayMatches(params: GetMatchdayMatchesParams, query?: GetMatchdayMatchesQuery): Promise<GetMatchdayMatchesResponse>;
	listMatchdaySubmissions(params: ListMatchdaySubmissionsParams, query?: ListMatchdaySubmissionsQuery): Promise<ListMatchdaySubmissionsResponse>;
	getMyMatchdaySubmission(params: GetMyMatchdaySubmissionParams): Promise<GetMyMatchdaySubmissionResponse>;
	upsertMyMatchdaySubmission(
		params: UpsertMyMatchdaySubmissionParams,
		body: UpsertMyMatchdaySubmissionRequest,
	): Promise<UpsertMyMatchdaySubmissionResponse>;
	clearMyMatchdaySubmission(params: ClearMyMatchdaySubmissionParams): Promise<void>;
	getUserMatchdaySubmission(params: GetUserMatchdaySubmissionParams): Promise<GetUserMatchdaySubmissionResponse>;
	listTournamentMembers(params: ListTournamentMembersParams, query?: ListTournamentMembersQuery): Promise<ListTournamentMembersResponse>;
	joinTournament(params: JoinTournamentParams, body?: JoinTournamentRequest): Promise<JoinTournamentResponse>;
	leaveTournament(params: LeaveTournamentParams): Promise<void>;
	updateTournamentMember(params: UpdateTournamentMemberParams, body: UpdateTournamentMemberRequest): Promise<UpdateTournamentMemberResponse>;
	removeTournamentMember(params: RemoveTournamentMemberParams, body?: RemoveTournamentMemberRequest): Promise<void>;
	listTournamentInvitationCodes(params: ListTournamentInvitationCodesParams, query?: ListTournamentInvitationCodesQuery): Promise<ListTournamentInvitationCodesResponse>;
	createTournamentInvitationCode(
		params: CreateTournamentInvitationCodeParams,
		body?: CreateTournamentInvitationCodeRequest,
	): Promise<CreateTournamentInvitationCodeResponse>;
	resolveInvitationCode(params: ResolveInvitationCodeParams): Promise<ResolveInvitationCodeResponse>;
	joinTournamentByInvitationCode(
		params: JoinTournamentByInvitationCodeParams,
		body?: JoinTournamentByInvitationCodeRequest,
	): Promise<JoinTournamentByInvitationCodeResponse>;
	listTournamentInvites(params: ListTournamentInvitesParams, query?: ListTournamentInvitesQuery): Promise<ListTournamentInvitesResponse>;
	createTournamentInvites(params: CreateTournamentInvitesParams, body: CreateTournamentInvitesRequest): Promise<CreateTournamentInvitesResponse>;
	cancelTournamentInvite(params: CancelTournamentInviteParams): Promise<void>;
	listMyTournamentInvites(query?: ListMyTournamentInvitesQuery): Promise<ListMyTournamentInvitesResponse>;
	getMyTournamentInvite(params: GetMyTournamentInviteParams, query?: GetMyTournamentInviteQuery): Promise<GetMyTournamentInviteResponse>;
	getMyTournamentInviteUnreadCount(): Promise<GetMyTournamentInviteUnreadCountResponse>;
	hideMyTournamentInvite(params: HideMyTournamentInviteParams): Promise<void>;
	markMyTournamentInviteSeen(params: MarkMyTournamentInviteSeenParams): Promise<void>;
	acceptMyTournamentInvite(params: AcceptMyTournamentInviteParams, body?: AcceptMyTournamentInviteRequest): Promise<AcceptMyTournamentInviteResponse>;
	declineMyTournamentInvite(params: DeclineMyTournamentInviteParams, body?: DeclineMyTournamentInviteRequest): Promise<DeclineMyTournamentInviteResponse>;
	authorize(params: AuthorizeParams): Promise<AuthorizeResponse>;
	token(body: TokenRequestBody): Promise<TokenResponse>;
	listMyNotifications(query?: ListMyNotificationsQuery): Promise<ListMyNotificationsResponse>;
	getMyNotification(params: GetMyNotificationParams, query?: GetMyNotificationQuery): Promise<GetMyNotificationResponse>;
	getMyNotificationUnreadCount(query?: GetMyNotificationUnreadCountQuery): Promise<GetMyNotificationUnreadCountResponse>;
	markMyNotificationSeen(params: MarkMyNotificationSeenParams): Promise<void>;
	markMyNotificationRead(params: MarkMyNotificationReadParams): Promise<void>;
	dismissMyNotification(params: DismissMyNotificationParams): Promise<void>;
	batchUpdateMyNotifications(body: BatchUpdateMyNotificationsRequest): Promise<BatchUpdateMyNotificationsResponse>;
	listMyFeed(query?: ListMyFeedQuery): Promise<ListMyFeedResponse>;
	getMyFeedItem(params: GetMyFeedItemParams): Promise<GetMyFeedItemResponse>;
	getMyFeedReadCursor(): Promise<GetMyFeedReadCursorResponse>;
	updateMyFeedReadCursor(body: UpdateMyFeedReadCursorRequest): Promise<UpdateMyFeedReadCursorResponse>;
	listMyUpdates(query?: ListMyUpdatesQuery): Promise<ListMyUpdatesResponse>;
	streamMyLiveUpdates(query?: StreamMyLiveUpdatesQuery): Promise<StreamMyLiveUpdatesResponse>;
	getTournamentChat(params: GetTournamentChatParams): Promise<GetTournamentChatResponse>;
	updateTournamentChatSettings(
		params: UpdateTournamentChatSettingsParams,
		body: UpdateTournamentChatSettingsRequest,
	): Promise<UpdateTournamentChatSettingsResponse>;
	listTournamentChatMessages(
		params: ListTournamentChatMessagesParams,
		query?: ListTournamentChatMessagesQuery,
	): Promise<ListTournamentChatMessagesResponse>;
	sendTournamentChatMessage(
		params: SendTournamentChatMessageParams,
		body: SendTournamentChatMessageRequest,
	): Promise<SendTournamentChatMessageResponse>;
	getTournamentChatMessage(params: GetTournamentChatMessageParams): Promise<GetTournamentChatMessageResponse>;
	editTournamentChatMessage(
		params: EditTournamentChatMessageParams,
		body: EditTournamentChatMessageRequest,
	): Promise<EditTournamentChatMessageResponse>;
	deleteTournamentChatMessage(params: DeleteTournamentChatMessageParams, body?: DeleteTournamentChatMessageRequest): Promise<void>;
	getTournamentChatUnreadCount(params: GetTournamentChatUnreadCountParams): Promise<GetTournamentChatUnreadCountResponse>;
	getTournamentChatReadCursor(params: GetTournamentChatReadCursorParams): Promise<GetTournamentChatReadCursorResponse>;
	updateTournamentChatReadCursor(
		params: UpdateTournamentChatReadCursorParams,
		body: UpdateTournamentChatReadCursorRequest,
	): Promise<UpdateTournamentChatReadCursorResponse>;
	listTournamentChatPins(params: ListTournamentChatPinsParams): Promise<ListTournamentChatPinsResponse>;
	pinTournamentChatMessage(
		params: PinTournamentChatMessageParams,
		body?: PinTournamentChatMessageRequest,
	): Promise<PinTournamentChatMessageResponse>;
	unpinTournamentChatMessage(params: UnpinTournamentChatMessageParams): Promise<void>;
	listTournamentChatMutes(
		params: ListTournamentChatMutesParams,
		query?: ListTournamentChatMutesQuery,
	): Promise<ListTournamentChatMutesResponse>;
	muteTournamentChatUser(params: MuteTournamentChatUserParams, body: MuteTournamentChatUserRequest): Promise<MuteTournamentChatUserResponse>;
	unmuteTournamentChatUser(params: UnmuteTournamentChatUserParams): Promise<void>;
	reportTournamentChatContent(params: ReportTournamentChatContentParams, body: ReportTournamentChatContentRequest): Promise<ReportTournamentChatContentResponse>;
	listTournamentChatUpdates(
		params: ListTournamentChatUpdatesParams,
		query?: ListTournamentChatUpdatesQuery,
	): Promise<ListTournamentChatUpdatesResponse>;
	streamTournamentChatLive(params: StreamTournamentChatLiveParams): Promise<StreamTournamentChatLiveResponse>;
	getMyStats(query?: GetMyStatsQuery): Promise<GetMyStatsResponse>;
	getUserStats(params: GetUserStatsParams, query?: GetUserStatsQuery): Promise<GetUserStatsResponse>;
	listMyRecaps(query?: ListMyRecapsQuery): Promise<ListMyRecapsResponse>;
	requestMyRecap(body: RequestMyRecapRequest): Promise<RequestMyRecapResponse>;
	getMyRecap(params: GetMyRecapParams): Promise<GetMyRecapResponse>;
	hideMyRecap(params: HideMyRecapParams): Promise<void>;
	listTournamentRecaps(params: ListTournamentRecapsParams, query?: ListTournamentRecapsQuery): Promise<ListTournamentRecapsResponse>;
	getTournamentRecap(params: GetTournamentRecapParams, query?: GetTournamentRecapQuery): Promise<GetTournamentRecapResponse>;
	getTournamentStats(params: GetTournamentStatsParams, query?: GetTournamentStatsQuery): Promise<GetTournamentStatsResponse>;
	getMyTournamentStats(params: GetMyTournamentStatsParams, query?: GetMyTournamentStatsQuery): Promise<GetMyTournamentStatsResponse>;
	getTournamentMatchdayStats(
		params: GetTournamentMatchdayStatsParams,
		query?: GetTournamentMatchdayStatsQuery,
	): Promise<GetTournamentMatchdayStatsResponse>;
	getMyTournamentMatchdayStats(
		params: GetMyTournamentMatchdayStatsParams,
		query?: GetMyTournamentMatchdayStatsQuery,
	): Promise<GetMyTournamentMatchdayStatsResponse>;
}
