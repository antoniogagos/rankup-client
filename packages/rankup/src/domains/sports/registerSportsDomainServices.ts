import { ISportsCatalogService } from './catalog/contracts/sportsCatalog.js';
import { SportsCatalogService } from './catalog/services/sportsCatalogService.js';
import { ISportsScheduleService } from './schedule/contracts/sportsSchedule.js';
import { SportsScheduleService } from './schedule/services/sportsScheduleService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerSportsDomainServices(services: ServiceCollection): void {
	services.set(ISportsCatalogService, new SyncDescriptor(SportsCatalogService));
	services.set(ISportsScheduleService, new SyncDescriptor(SportsScheduleService));
}
