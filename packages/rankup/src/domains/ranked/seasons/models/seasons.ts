import type { RankedMetaInclude, RankedRatingModel, RankedSeasonCadence, RankedSeasonInclude, RankedSeasonSort, RankedSeasonStatus, RankedTrackInclude, RankedTrackScopeKind, RankedTrackSort, RankedTrackStatus } from '../../shared/models/enums.js';
import type { RankedSeasonId, RankedTrackId } from '../../shared/models/ids.js';
import type { RankedEligibilityPolicy, RankedTierDefinition, RankedTrackScope } from '../../shared/models/ranked.js';
import type { GameModeId, SportId } from '../../../tournaments/shared/models/ids.js';

export type RankedMeta = {
	serverTime: string;
	defaultTrackId: RankedTrackId;
	tracks?: RankedTrackSummary[];
	notes?: string;
};

export type RankedTrackSummary = {
	rankedTrackId: RankedTrackId;
	status: RankedTrackStatus;
	name: string;
	description?: string;
	ratingModel: RankedRatingModel;
	cadence?: RankedSeasonCadence;
	scope: RankedTrackScope;
	activeSeasonId?: RankedSeasonId;
	featured?: boolean;
	heroImageUrl?: string;
};

export type RankedTrack = {
	rankedTrackId: RankedTrackId;
	status: RankedTrackStatus;
	name: string;
	description?: string;
	ratingModel: RankedRatingModel;
	cadence?: RankedSeasonCadence;
	scope: RankedTrackScope;
	activeSeasonId?: RankedSeasonId;
	featured?: boolean;
	heroImageUrl?: string;
	eligibility?: RankedEligibilityPolicy;
	tiers?: RankedTierDefinition[];
	activeSeason?: RankedSeason;
};

export type RankedTrackPage = {
	items: RankedTrackSummary[];
	nextCursor?: string;
};

export type RankedSeasonSummary = {
	rankedSeasonId: RankedSeasonId;
	status: RankedSeasonStatus;
	title?: string;
	startsAt: string;
	endsAt: string;
	joinOpensAt?: string;
	joinClosesAt?: string;
};

export type RankedSeason = {
	rankedSeasonId: RankedSeasonId;
	status: RankedSeasonStatus;
	title?: string;
	startsAt: string;
	endsAt: string;
	joinOpensAt?: string;
	joinClosesAt?: string;
	eligibility?: RankedEligibilityPolicy;
	recapRecapType?: string;
};

export type RankedSeasonPage = {
	items: RankedSeasonSummary[];
	nextCursor?: string;
};

export type GetRankedMetaQuery = {
	include?: RankedMetaInclude[];
};

export type ListRankedTracksQuery = {
	status?: RankedTrackStatus;
	scopeKind?: RankedTrackScopeKind;
	gameModeId?: GameModeId;
	sportId?: SportId;
	include?: RankedTrackInclude[];
	sort?: RankedTrackSort;
	cursor?: string;
	pageSize?: number;
};

export type GetRankedTrackParams = {
	rankedTrackId: RankedTrackId;
};

export type GetRankedTrackQuery = {
	include?: RankedTrackInclude[];
};

export type ListRankedSeasonsParams = {
	rankedTrackId: RankedTrackId;
};

export type ListRankedSeasonsQuery = {
	status?: RankedSeasonStatus;
	include?: RankedSeasonInclude[];
	sort?: RankedSeasonSort;
	cursor?: string;
	pageSize?: number;
};

export type GetRankedSeasonParams = {
	rankedTrackId: RankedTrackId;
	rankedSeasonId: RankedSeasonId;
};

export type GetRankedSeasonQuery = {
	include?: RankedSeasonInclude[];
};
