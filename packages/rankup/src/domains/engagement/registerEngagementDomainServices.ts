import { ITourneyChatService } from './chat/contracts/tourneyChat.js';
import { TourneyChatService } from './chat/services/tourneyChatService.js';
import { ILiveService } from './live/contracts/live.js';
import { LiveService } from './live/services/liveService.js';
import { IRecapsService } from './recaps/contracts/recaps.js';
import { RecapsService } from './recaps/services/recapsService.js';
import { IStatsService } from './stats/contracts/stats.js';
import { StatsService } from './stats/services/statsService.js';
import { IUpdatesService } from './updates/contracts/updates.js';
import { UpdatesService } from './updates/services/updatesService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerEngagementDomainServices(services: ServiceCollection): void {
	services.set(ITourneyChatService, new SyncDescriptor(TourneyChatService));
	services.set(ILiveService, new SyncDescriptor(LiveService));
	services.set(IRecapsService, new SyncDescriptor(RecapsService));
	services.set(IStatsService, new SyncDescriptor(StatsService));
	services.set(IUpdatesService, new SyncDescriptor(UpdatesService));
}
