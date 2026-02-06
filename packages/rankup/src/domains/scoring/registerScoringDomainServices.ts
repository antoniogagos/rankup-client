import { ITourneyRankingService } from './ranking/contracts/tourneyRanking.js';
import { TourneyRankingService } from './ranking/services/tourneyRankingService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerScoringDomainServices(services: ServiceCollection): void {
	services.set(ITourneyRankingService, new SyncDescriptor(TourneyRankingService));
}
