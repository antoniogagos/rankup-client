import type { GetMyRankedProfileQuery, GetMyRankedTrackParams, GetMyRankedTrackQuery, GetRankedLeaderboardParams, GetRankedLeaderboardQuery, GetRankedSeasonLeaderboardParams, GetRankedSeasonLeaderboardQuery, GetUserRankedProfileParams, GetUserRankedProfileQuery, GetUserRankedTrackParams, GetUserRankedTrackQuery, ListMyRankedHistoryParams, ListMyRankedHistoryQuery, MyRankedProfile, MyRankedTrackStanding, PublicRankedProfile, PublicRankedTrackStanding, RankedHistoryPage, RankedLeaderboard, RankedSettings, UpdateRankedSettingsRequest } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IRankedLeaderboardsGateway {
	getRankedLeaderboard(params: GetRankedLeaderboardParams, query?: GetRankedLeaderboardQuery): Promise<RankedLeaderboard>;
	getRankedSeasonLeaderboard(
		params: GetRankedSeasonLeaderboardParams,
		query?: GetRankedSeasonLeaderboardQuery,
	): Promise<RankedLeaderboard>;
	getMyRankedProfile(query?: GetMyRankedProfileQuery): Promise<MyRankedProfile>;
	getMyRankedSettings(): Promise<RankedSettings>;
	updateMyRankedSettings(body: UpdateRankedSettingsRequest): Promise<RankedSettings>;
	getMyRankedTrack(params: GetMyRankedTrackParams, query?: GetMyRankedTrackQuery): Promise<MyRankedTrackStanding>;
	listMyRankedHistory(params: ListMyRankedHistoryParams, query?: ListMyRankedHistoryQuery): Promise<RankedHistoryPage>;
	getUserRankedProfile(params: GetUserRankedProfileParams, query?: GetUserRankedProfileQuery): Promise<PublicRankedProfile>;
	getUserRankedTrack(params: GetUserRankedTrackParams, query?: GetUserRankedTrackQuery): Promise<PublicRankedTrackStanding>;
}

export const IRankedLeaderboardsGateway = createDecorator<IRankedLeaderboardsGateway>('rankedLeaderboardsGateway');
