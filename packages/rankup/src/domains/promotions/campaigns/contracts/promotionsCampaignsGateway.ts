import type { GetMyPromotionStatusParams, GetPromotionParams, GetPromotionQuery, ListMyPromotionsQuery, ListPromotionWinnersParams, ListPromotionWinnersQuery, ListPromotionsQuery, MyPromotionPage, OptInToPromotionParams, OptOutFromPromotionParams, Promotion, PromotionMeState, PromotionOptInRequest, PromotionSummaryPage, PromotionWinnerPage } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IPromotionsCampaignsGateway {
	listPromotions(query?: ListPromotionsQuery): Promise<PromotionSummaryPage>;
	getPromotion(params: GetPromotionParams, query?: GetPromotionQuery): Promise<Promotion>;
	listPromotionWinners(params: ListPromotionWinnersParams, query?: ListPromotionWinnersQuery): Promise<PromotionWinnerPage>;
	getMyPromotionStatus(params: GetMyPromotionStatusParams): Promise<PromotionMeState>;
	optInToPromotion(params: OptInToPromotionParams, body: PromotionOptInRequest): Promise<PromotionMeState>;
	optOutFromPromotion(params: OptOutFromPromotionParams): Promise<void>;
	listMyPromotions(query?: ListMyPromotionsQuery): Promise<MyPromotionPage>;
}

export const IPromotionsCampaignsGateway = createDecorator<IPromotionsCampaignsGateway>('promotionsCampaignsGateway');
