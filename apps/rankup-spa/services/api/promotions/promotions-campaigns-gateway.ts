import { mapMyPromotionPage, mapPromotion, mapPromotionMeState, mapPromotionOptInRequest, mapPromotionSummaryPage, mapPromotionWinnerPage } from './promotions-mappers.js';
import type * as Api from '@rankup/api';
import type { IPromotionsCampaignsGateway } from '@rankup/rankup/domains/promotions/campaigns/contracts/promotionsCampaignsGateway.js';
import type * as Domain from '@rankup/rankup/domains/promotions/campaigns/contracts/types.js';

const mapListPromotionsQuery = (query?: Domain.ListPromotionsQuery): Api.ListPromotionsQuery | undefined =>
	query
		? {
			status: query.status,
			type: query.type,
			sportId: query.sportId,
			gameModeId: query.gameModeId,
			verifiedEventId: query.verifiedEventId,
			creatorId: query.creatorId,
			region: query.region,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetPromotionQuery = (query?: Domain.GetPromotionQuery): Api.GetPromotionQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapListPromotionWinnersQuery = (query?: Domain.ListPromotionWinnersQuery): Api.ListPromotionWinnersQuery | undefined =>
	query
		? {
			include: query.include,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapListMyPromotionsQuery = (query?: Domain.ListMyPromotionsQuery): Api.ListMyPromotionsQuery | undefined =>
	query
		? {
			status: query.status,
			include: query.include,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

export class PromotionsCampaignsGateway implements IPromotionsCampaignsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listPromotions(query?: Domain.ListPromotionsQuery): Promise<Domain.PromotionSummaryPage> {
		const response = await this.apiClient.listPromotions(mapListPromotionsQuery(query));
		return mapPromotionSummaryPage(response);
	}

	public async getPromotion(params: Domain.GetPromotionParams, query?: Domain.GetPromotionQuery): Promise<Domain.Promotion> {
		const response = await this.apiClient.getPromotion({ promotionId: params.promotionId }, mapGetPromotionQuery(query));
		return mapPromotion(response);
	}

	public async listPromotionWinners(
		params: Domain.ListPromotionWinnersParams,
		query?: Domain.ListPromotionWinnersQuery,
	): Promise<Domain.PromotionWinnerPage> {
		const response = await this.apiClient.listPromotionWinners(
			{ promotionId: params.promotionId },
			mapListPromotionWinnersQuery(query),
		);
		return mapPromotionWinnerPage(response);
	}

	public async getMyPromotionStatus(params: Domain.GetMyPromotionStatusParams): Promise<Domain.PromotionMeState> {
		const response = await this.apiClient.getMyPromotionStatus({ promotionId: params.promotionId });
		return mapPromotionMeState(response);
	}

	public async optInToPromotion(
		params: Domain.OptInToPromotionParams,
		body: Domain.PromotionOptInRequest,
	): Promise<Domain.PromotionMeState> {
		const response = await this.apiClient.optInToPromotion({ promotionId: params.promotionId }, mapPromotionOptInRequest(body));
		return mapPromotionMeState(response);
	}

	public async optOutFromPromotion(params: Domain.OptOutFromPromotionParams): Promise<void> {
		await this.apiClient.optOutFromPromotion({ promotionId: params.promotionId });
	}

	public async listMyPromotions(query?: Domain.ListMyPromotionsQuery): Promise<Domain.MyPromotionPage> {
		const response = await this.apiClient.listMyPromotions(mapListMyPromotionsQuery(query));
		return mapMyPromotionPage(response);
	}
}
