import type { ClaimMyRewardParams, ClaimRewardRequest, GetMyRewardParams, GetMyRewardQuery, ListMyRewardsQuery, RewardFulfillmentProfile, RewardGrant, RewardGrantPage, UpdateRewardFulfillmentProfileRequest } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IPromotionsRewardsService {
	listMyRewards(query?: ListMyRewardsQuery): Promise<RewardGrantPage>;
	getMyReward(params: GetMyRewardParams, query?: GetMyRewardQuery): Promise<RewardGrant>;
	claimMyReward(params: ClaimMyRewardParams, body: ClaimRewardRequest): Promise<RewardGrant>;
	getMyRewardFulfillmentProfile(): Promise<RewardFulfillmentProfile>;
	updateMyRewardFulfillmentProfile(body: UpdateRewardFulfillmentProfileRequest): Promise<RewardFulfillmentProfile>;
}

export const IPromotionsRewardsService = createDecorator<IPromotionsRewardsService>('promotionsRewardsService');
