import type { MyPromotionInclude, MyPromotionStatusFilter, PromotionInclude, PromotionMeBlockReason, PromotionMeEligibilityStatus, PromotionMeParticipationStatus, PromotionMechanicKind, PromotionRequiredAction, PromotionScopeKind, PromotionSort, PromotionStatus, PromotionType, PromotionWinnerInclude } from '../../shared/models/enums.js';
import type { CreatorId } from '../../../creators/shared/models/ids.js';
import type { PromotionId } from '../../shared/models/ids.js';
import type { PromotionRewardDefinition } from '../../shared/models/promotions.js';
import type { RankedSeasonId, RankedTrackId } from '../../../ranked/shared/models/ids.js';
import type { GameModeId, SportId, TournamentId, UserId } from '../../../tournaments/shared/models/ids.js';
import type { VerifiedEventId } from '../../../verified/shared/models/ids.js';

export type PromotionSchedule = {
	startsAt?: string;
	endsAt?: string;
	joinOpensAt?: string;
	joinClosesAt?: string;
};

export type PromotionAgeGate = {
	required?: boolean;
	minimumAge?: number;
};

export type PromotionEligibility = {
	verifiedOnly?: boolean;
	minAccountAgeDays?: number;
	minLevel?: number;
	regionAllowList?: string[];
	ageGate?: PromotionAgeGate;
	notes?: string;
};

export type PromotionLegal = {
	termsVersion: string;
	termsUrl: string;
	disclaimer?: string;
	privacyNotes?: string;
};

export type PromotionMechanic = {
	kind: PromotionMechanicKind;
	summary: string;
	details?: string;
	parameters?: Record<string, unknown>;
};

export type PromotionScope = {
	scopeKind: PromotionScopeKind;
	verifiedEventId?: VerifiedEventId;
	tournamentId?: TournamentId;
	rankedTrackId?: RankedTrackId;
	rankedSeasonId?: RankedSeasonId;
	creatorId?: CreatorId;
};

export type PromotionWinnersPreview = {
	published?: boolean;
	winnerCount?: number;
};

export type PromotionMeState = {
	promotionId: PromotionId;
	eligibilityStatus: PromotionMeEligibilityStatus;
	participationStatus: PromotionMeParticipationStatus;
	canOptIn: boolean;
	optedInAt?: string;
	acceptedTermsVersion?: string;
	blockedReasons?: PromotionMeBlockReason[];
	requiredActions?: PromotionRequiredAction[];
	nextSteps?: string;
};

export type PromotionOptInRequest = {
	termsVersion: string;
	consentToPublicWinnerDisplay?: boolean;
};

export type PromotionSummary = {
	promotionId: PromotionId;
	status: PromotionStatus;
	type: PromotionType;
	title: string;
	schedule: PromotionSchedule;
	scope: PromotionScope;
	subtitle?: string;
	heroImageUrl?: string;
	sportId?: SportId;
	gameModeId?: GameModeId;
	featured?: boolean;
	rewardsPreview?: PromotionRewardDefinition[];
};

export type Promotion = {
	promotionId: PromotionId;
	status: PromotionStatus;
	type: PromotionType;
	title: string;
	schedule: PromotionSchedule;
	scope: PromotionScope;
	subtitle?: string;
	heroImageUrl?: string;
	sportId?: SportId;
	gameModeId?: GameModeId;
	featured?: boolean;
	rewardsPreview?: PromotionRewardDefinition[];
	description?: string;
	mechanics?: PromotionMechanic[];
	rewards?: PromotionRewardDefinition[];
	eligibility?: PromotionEligibility;
	legal?: PromotionLegal;
	myStatus?: PromotionMeState;
	winnersPreview?: PromotionWinnersPreview;
};

export type PromotionSummaryPage = {
	items: PromotionSummary[];
	nextCursor?: string;
};

export type PromotionWinnerEntry = {
	position: number;
	displayName: string;
	userId?: UserId;
	reward?: PromotionRewardDefinition;
	announcedAt?: string;
};

export type PromotionWinnerPage = {
	published: boolean;
	items: PromotionWinnerEntry[];
	nextCursor?: string;
};

export type MyPromotionEntry = {
	promotion: PromotionSummary;
	myStatus: PromotionMeState;
};

export type MyPromotionPage = {
	items: MyPromotionEntry[];
	nextCursor?: string;
};

export type ListPromotionsQuery = {
	status?: PromotionStatus;
	type?: PromotionType;
	sportId?: SportId;
	gameModeId?: GameModeId;
	verifiedEventId?: VerifiedEventId;
	creatorId?: CreatorId;
	region?: string;
	include?: PromotionInclude[];
	sort?: PromotionSort;
	cursor?: string;
	pageSize?: number;
};

export type GetPromotionParams = {
	promotionId: PromotionId;
};

export type GetPromotionQuery = {
	include?: PromotionInclude[];
};

export type ListPromotionWinnersParams = {
	promotionId: PromotionId;
};

export type ListPromotionWinnersQuery = {
	include?: PromotionWinnerInclude[];
	cursor?: string;
	pageSize?: number;
};

export type GetMyPromotionStatusParams = {
	promotionId: PromotionId;
};

export type OptInToPromotionParams = {
	promotionId: PromotionId;
};

export type OptOutFromPromotionParams = {
	promotionId: PromotionId;
};

export type ListMyPromotionsQuery = {
	status?: MyPromotionStatusFilter;
	include?: MyPromotionInclude[];
	cursor?: string;
	pageSize?: number;
};
