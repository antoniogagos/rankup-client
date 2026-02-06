import type { TournamentFormatId } from '../../../tournaments/shared/models/enums.js';
import type { GameModeId, SportId, TournamentId } from '../../../tournaments/shared/models/ids.js';
import type { UserSummary } from '../../../tournaments/shared/models/user.js';
import type { VerifiedEventId } from '../../../verified/shared/models/ids.js';
import type { RankedHistorySourceType, RankedTierRewardType, RankedTrackScopeKind } from './enums.js';
import type { RankedHistoryEventId, RankedSeasonId, RankedTierId, RankedTrackId } from './ids.js';

export type RankedEligibilityPolicy = {
	requiresVerified: boolean;
	requiresEloEnabled: boolean;
	allowedVerifiedEventIds?: VerifiedEventId[];
	notes?: string;
};

export type RankedTierRewardPreview = {
	rewardType?: RankedTierRewardType;
	rewardId?: string;
	label?: string;
	imageUrl?: string;
};

export type RankedTierDefinition = {
	tierId: RankedTierId;
	name: string;
	description?: string;
	iconUrl?: string;
	minRating?: number;
	maxRating?: number;
	rewards?: RankedTierRewardPreview[];
};

export type RankedTrackScope = {
	scopeKind: RankedTrackScopeKind;
	gameModeId?: GameModeId;
	sportId?: SportId;
	formatId?: TournamentFormatId;
	region?: string;
};

export type RankedTierProgress = {
	tierId: RankedTierId;
	rating?: number;
	nextTierId?: RankedTierId;
	nextTierAtRating?: number;
	progressToNextTier?: number;
};

export type RankedStandingBase = {
	rankedTrackId: RankedTrackId;
	seasonId: RankedSeasonId;
	rating: number;
	tier: RankedTierProgress;
	provisional?: boolean;
	updatedAt?: string;
};

export type RankedLeaderboardEntry = {
	position: number;
	user?: UserSummary;
	rating: number;
	tierId?: RankedTierId;
	deltaSinceYesterday?: number;
	percentile?: number;
};

export type RankedHistorySource = {
	type: RankedHistorySourceType;
	tournamentId?: TournamentId;
	matchday?: number;
	verifiedEventId?: VerifiedEventId;
	note?: string;
};

export type RankedHistoryEvent = {
	eventId: RankedHistoryEventId;
	rankedTrackId: RankedTrackId;
	seasonId: RankedSeasonId;
	occurredAt: string;
	deltaRating: number;
	newRating: number;
	oldTierId?: RankedTierId;
	newTierId?: RankedTierId;
	source: RankedHistorySource;
	provisional?: boolean;
};
