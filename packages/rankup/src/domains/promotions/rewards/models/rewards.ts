import type { RewardDeliveryStatus, RewardFulfillmentMethod, RewardGrantStatus, RewardInclude, RewardSort } from '../../shared/models/enums.js';
import type { PromotionId, RewardGrantId } from '../../shared/models/ids.js';
import type { PromotionRewardDefinition } from '../../shared/models/promotions.js';
import type { RankedSeasonId, RankedTrackId } from '../../../ranked/shared/models/ids.js';
import type { TournamentId } from '../../../tournaments/shared/models/ids.js';
import type { VerifiedEventId } from '../../../verified/shared/models/ids.js';

export type RewardSource = {
	promotionId?: PromotionId;
	verifiedEventId?: VerifiedEventId;
	tournamentId?: TournamentId;
	rankedTrackId?: RankedTrackId;
	rankedSeasonId?: RankedSeasonId;
};

export type RewardDelivery = {
	method: RewardFulfillmentMethod;
	status: RewardDeliveryStatus;
	emailSentTo?: string;
	shippedToCountry?: string;
	carrier?: string;
	trackingUrl?: string;
	lastUpdatedAt?: string;
	failureReason?: string;
};

export type RewardGrantLegal = {
	termsVersion?: string;
	termsUrl?: string;
};

export type RewardGrant = {
	rewardGrantId: RewardGrantId;
	status: RewardGrantStatus;
	reward: PromotionRewardDefinition;
	source?: RewardSource;
	claimDeadlineAt?: string;
	claimedAt?: string;
	deliveredAt?: string;
	legal?: RewardGrantLegal;
	delivery?: RewardDelivery;
};

export type RewardGrantPage = {
	items: RewardGrant[];
	nextCursor?: string;
};

export type ShippingAddress = {
	fullName: string;
	line1: string;
	line2?: string;
	city: string;
	region?: string;
	postalCode: string;
	country: string;
	phone?: string;
};

export type RewardFulfillmentProfile = {
	defaultEmail?: string;
	shippingAddress?: ShippingAddress;
	updatedAt?: string;
};

export type UpdateRewardFulfillmentProfileRequest = {
	defaultEmail?: string;
	shippingAddress?: ShippingAddress;
};

export type RewardFulfillmentInput = {
	email?: string;
	shippingAddress?: ShippingAddress;
};

export type ClaimRewardRequest = {
	termsVersion: string;
	fulfillment?: RewardFulfillmentInput;
	saveToProfile?: boolean;
};

export type ListMyRewardsQuery = {
	status?: RewardGrantStatus;
	promotionId?: PromotionId;
	verifiedEventId?: VerifiedEventId;
	include?: RewardInclude[];
	sort?: RewardSort;
	cursor?: string;
	pageSize?: number;
};

export type GetMyRewardParams = {
	rewardGrantId: RewardGrantId;
};

export type GetMyRewardQuery = {
	include?: RewardInclude[];
};

export type ClaimMyRewardParams = {
	rewardGrantId: RewardGrantId;
};
