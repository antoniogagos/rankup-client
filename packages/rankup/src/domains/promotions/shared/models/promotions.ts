import type { PromotionRewardType, RewardFulfillmentMethod } from './enums.js';

export type PromotionRewardDefinition = {
	rewardId: string;
	type: PromotionRewardType;
	title: string;
	description?: string;
	imageUrl?: string;
	quantity: number;
	estimatedValueText?: string;
	fulfillmentMethod?: RewardFulfillmentMethod;
};
