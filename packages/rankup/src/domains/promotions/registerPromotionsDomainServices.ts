import { IPromotionsCampaignsService } from './campaigns/contracts/promotionsCampaigns.js';
import { PromotionsCampaignsService } from './campaigns/services/promotionsCampaignsService.js';
import { IPromotionsRewardsService } from './rewards/contracts/promotionsRewards.js';
import { PromotionsRewardsService } from './rewards/services/promotionsRewardsService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerPromotionsDomainServices(services: ServiceCollection): void {
	services.set(IPromotionsCampaignsService, new SyncDescriptor(PromotionsCampaignsService));
	services.set(IPromotionsRewardsService, new SyncDescriptor(PromotionsRewardsService));
}
