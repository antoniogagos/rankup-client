import { IRankedLeaderboardsService } from './leaderboards/contracts/rankedLeaderboards.js';
import { RankedLeaderboardsService } from './leaderboards/services/rankedLeaderboardsService.js';
import { IRankedSeasonsService } from './seasons/contracts/rankedSeasons.js';
import { RankedSeasonsService } from './seasons/services/rankedSeasonsService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerRankedDomainServices(services: ServiceCollection): void {
	services.set(IRankedSeasonsService, new SyncDescriptor(RankedSeasonsService));
	services.set(IRankedLeaderboardsService, new SyncDescriptor(RankedLeaderboardsService));
}
