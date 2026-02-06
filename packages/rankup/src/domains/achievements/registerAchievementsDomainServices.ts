import { IAchievementsCatalogService } from './catalog/contracts/achievementsCatalog.js';
import { AchievementsCatalogService } from './catalog/services/achievementsCatalogService.js';
import { IAchievementsGrantsService } from './grants/contracts/achievementsGrants.js';
import { AchievementsGrantsService } from './grants/services/achievementsGrantsService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerAchievementsDomainServices(services: ServiceCollection): void {
	services.set(IAchievementsCatalogService, new SyncDescriptor(AchievementsCatalogService));
	services.set(IAchievementsGrantsService, new SyncDescriptor(AchievementsGrantsService));
}
