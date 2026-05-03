import { ITournamentRankingService } from './ranking/contracts/tournamentRanking.js';
import { TournamentRankingService } from './ranking/services/tournamentRankingService.js';
import { ITournamentResultsService } from './results/contracts/tournamentResults.js';
import { TournamentResultsService } from './results/services/tournamentResultsService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerScoringDomainServices(services: ServiceCollection): void {
	services.set(ITournamentRankingService, new SyncDescriptor(TournamentRankingService));
	services.set(ITournamentResultsService, new SyncDescriptor(TournamentResultsService));
}
