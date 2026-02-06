import { mapClaimRewardRequest, mapRewardFulfillmentProfile, mapRewardGrant, mapRewardGrantPage, mapUpdateRewardFulfillmentProfileRequest } from './promotions-mappers.js';
import type * as Api from '@rankup/api';
import type { IPromotionsRewardsGateway } from '@rankup/rankup/domains/promotions/rewards/contracts/promotionsRewardsGateway.js';
import type * as Domain from '@rankup/rankup/domains/promotions/rewards/contracts/types.js';

const mapListMyRewardsQuery = (query?: Domain.ListMyRewardsQuery): Api.ListMyRewardsQuery | undefined =>
	query
		? {
			status: query.status,
			promotionId: query.promotionId,
			verifiedEventId: query.verifiedEventId,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetMyRewardQuery = (query?: Domain.GetMyRewardQuery): Api.GetMyRewardQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class PromotionsRewardsGateway implements IPromotionsRewardsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listMyRewards(query?: Domain.ListMyRewardsQuery): Promise<Domain.RewardGrantPage> {
		const response = await this.apiClient.listMyRewards(mapListMyRewardsQuery(query));
		return mapRewardGrantPage(response);
	}

	public async getMyReward(params: Domain.GetMyRewardParams, query?: Domain.GetMyRewardQuery): Promise<Domain.RewardGrant> {
		const response = await this.apiClient.getMyReward({ rewardGrantId: params.rewardGrantId }, mapGetMyRewardQuery(query));
		return mapRewardGrant(response);
	}

	public async claimMyReward(params: Domain.ClaimMyRewardParams, body: Domain.ClaimRewardRequest): Promise<Domain.RewardGrant> {
		const response = await this.apiClient.claimMyReward({ rewardGrantId: params.rewardGrantId }, mapClaimRewardRequest(body));
		return mapRewardGrant(response);
	}

	public async getMyRewardFulfillmentProfile(): Promise<Domain.RewardFulfillmentProfile> {
		const response = await this.apiClient.getMyRewardFulfillmentProfile();
		return mapRewardFulfillmentProfile(response);
	}

	public async updateMyRewardFulfillmentProfile(
		body: Domain.UpdateRewardFulfillmentProfileRequest,
	): Promise<Domain.RewardFulfillmentProfile> {
		const response = await this.apiClient.updateMyRewardFulfillmentProfile(mapUpdateRewardFulfillmentProfileRequest(body));
		return mapRewardFulfillmentProfile(response);
	}
}
