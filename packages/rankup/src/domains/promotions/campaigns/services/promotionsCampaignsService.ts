import type { IPromotionsCampaignsService } from '../contracts/promotionsCampaigns.js';
import type { IPromotionsCampaignsGateway as PromotionsCampaignsGateway } from '../contracts/promotionsCampaignsGateway.js';
import { IPromotionsCampaignsGateway } from '../contracts/promotionsCampaignsGateway.js';
import type { GetMyPromotionStatusParams, GetPromotionParams, GetPromotionQuery, ListMyPromotionsQuery, ListPromotionWinnersParams, ListPromotionWinnersQuery, ListPromotionsQuery, MyPromotionPage, OptInToPromotionParams, OptOutFromPromotionParams, Promotion, PromotionMeState, PromotionOptInRequest, PromotionSummaryPage, PromotionWinnerPage } from '../contracts/types.js';

export class PromotionsCampaignsService implements IPromotionsCampaignsService {
	public constructor(@IPromotionsCampaignsGateway private readonly gateway: PromotionsCampaignsGateway) {}

	public async listPromotions(query?: ListPromotionsQuery): Promise<PromotionSummaryPage> {
		return this.gateway.listPromotions(query);
	}

	public async getPromotion(params: GetPromotionParams, query?: GetPromotionQuery): Promise<Promotion> {
		return this.gateway.getPromotion(params, query);
	}

	public async listPromotionWinners(
		params: ListPromotionWinnersParams,
		query?: ListPromotionWinnersQuery,
	): Promise<PromotionWinnerPage> {
		return this.gateway.listPromotionWinners(params, query);
	}

	public async getMyPromotionStatus(params: GetMyPromotionStatusParams): Promise<PromotionMeState> {
		return this.gateway.getMyPromotionStatus(params);
	}

	public async optInToPromotion(params: OptInToPromotionParams, body: PromotionOptInRequest): Promise<PromotionMeState> {
		return this.gateway.optInToPromotion(params, body);
	}

	public async optOutFromPromotion(params: OptOutFromPromotionParams): Promise<void> {
		return this.gateway.optOutFromPromotion(params);
	}

	public async listMyPromotions(query?: ListMyPromotionsQuery): Promise<MyPromotionPage> {
		return this.gateway.listMyPromotions(query);
	}
}
