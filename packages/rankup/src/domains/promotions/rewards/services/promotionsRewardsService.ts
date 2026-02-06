import type { IPromotionsRewardsService } from '../contracts/promotionsRewards.js';
import type { IPromotionsRewardsGateway as PromotionsRewardsGateway } from '../contracts/promotionsRewardsGateway.js';
import { IPromotionsRewardsGateway } from '../contracts/promotionsRewardsGateway.js';
import type { ClaimMyRewardParams, ClaimRewardRequest, GetMyRewardParams, GetMyRewardQuery, ListMyRewardsQuery, RewardFulfillmentProfile, RewardGrant, RewardGrantPage, UpdateRewardFulfillmentProfileRequest } from '../contracts/types.js';

export class PromotionsRewardsService implements IPromotionsRewardsService {
	public constructor(@IPromotionsRewardsGateway private readonly gateway: PromotionsRewardsGateway) {}

	public async listMyRewards(query?: ListMyRewardsQuery): Promise<RewardGrantPage> {
		return this.gateway.listMyRewards(query);
	}

	public async getMyReward(params: GetMyRewardParams, query?: GetMyRewardQuery): Promise<RewardGrant> {
		return this.gateway.getMyReward(params, query);
	}

	public async claimMyReward(params: ClaimMyRewardParams, body: ClaimRewardRequest): Promise<RewardGrant> {
		return this.gateway.claimMyReward(params, body);
	}

	public async getMyRewardFulfillmentProfile(): Promise<RewardFulfillmentProfile> {
		return this.gateway.getMyRewardFulfillmentProfile();
	}

	public async updateMyRewardFulfillmentProfile(
		body: UpdateRewardFulfillmentProfileRequest,
	): Promise<RewardFulfillmentProfile> {
		return this.gateway.updateMyRewardFulfillmentProfile(body);
	}
}
