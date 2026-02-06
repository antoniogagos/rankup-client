import type { UserId } from '../../../tournaments/shared/models/ids.js';
import type { UserSummary } from '../../../tournaments/shared/models/user.js';
import type { MyRankedInclude, RankedLeaderboardInclude, RankedLeaderboardView, RankedVisibility, UserRankedInclude } from '../../shared/models/enums.js';
import type { RankedSeasonId, RankedTrackId } from '../../shared/models/ids.js';
import type { RankedHistoryEvent, RankedLeaderboardEntry, RankedStandingBase,RankedTierDefinition } from '../../shared/models/ranked.js';

export type RankedLeaderboard = {
	serverTime: string;
	rankedTrackId: RankedTrackId;
	seasonId: RankedSeasonId;
	view: RankedLeaderboardView;
	region?: string;
	items: RankedLeaderboardEntry[];
	nextCursor?: string;
	myEntry?: RankedLeaderboardEntry;
	tiers?: RankedTierDefinition[];
};

export type RankedSettings = {
	defaultVisibility: RankedVisibility;
	perTrackVisibility?: Record<RankedTrackId, RankedVisibility>;
	showOnPublicLeaderboards?: boolean;
	allowFriendComparisons?: boolean;
};

export type UpdateRankedSettingsRequest = {
	defaultVisibility?: RankedVisibility;
	perTrackVisibility?: Record<RankedTrackId, RankedVisibility>;
	showOnPublicLeaderboards?: boolean;
	allowFriendComparisons?: boolean;
};

export type MyRankedTrackStanding = RankedStandingBase & {
	me: UserSummary;
	position?: number;
	percentile?: number;
	lastDelta?: RankedHistoryEvent;
};

export type PublicRankedTrackStanding = RankedStandingBase & {
	user?: UserSummary;
	position?: number;
	percentile?: number;
};

export type MyRankedProfile = {
	serverTime: string;
	user: UserSummary;
	tracks: MyRankedTrackStanding[];
};

export type PublicRankedProfile = {
	user: UserSummary;
	tracks: PublicRankedTrackStanding[];
};

export type RankedHistoryPage = {
	items: RankedHistoryEvent[];
	nextCursor?: string;
};

export type GetRankedLeaderboardParams = {
	rankedTrackId: RankedTrackId;
};

export type GetRankedLeaderboardQuery = {
	seasonId?: RankedSeasonId;
	view?: RankedLeaderboardView;
	region?: string;
	include?: RankedLeaderboardInclude[];
	cursor?: string;
	pageSize?: number;
};

export type GetRankedSeasonLeaderboardParams = {
	rankedTrackId: RankedTrackId;
	rankedSeasonId: RankedSeasonId;
};

export type GetRankedSeasonLeaderboardQuery = {
	view?: RankedLeaderboardView;
	region?: string;
	include?: RankedLeaderboardInclude[];
	cursor?: string;
	pageSize?: number;
};

export type GetMyRankedProfileQuery = {
	include?: MyRankedInclude[];
};

export type GetMyRankedTrackParams = {
	rankedTrackId: RankedTrackId;
};

export type GetMyRankedTrackQuery = {
	seasonId?: RankedSeasonId;
};

export type ListMyRankedHistoryParams = {
	rankedTrackId: RankedTrackId;
};

export type ListMyRankedHistoryQuery = {
	seasonId?: RankedSeasonId;
	since?: string;
	until?: string;
	cursor?: string;
	pageSize?: number;
};

export type GetUserRankedProfileParams = {
	userId: UserId;
};

export type GetUserRankedProfileQuery = {
	include?: UserRankedInclude[];
};

export type GetUserRankedTrackParams = {
	userId: UserId;
	rankedTrackId: RankedTrackId;
};

export type GetUserRankedTrackQuery = {
	seasonId?: RankedSeasonId;
};
