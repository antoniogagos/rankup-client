import { ITournamentSubmissionsService } from './scorePrediction/contracts/tournamentSubmissions.js';
import { TournamentSubmissionsService } from './scorePrediction/services/tournamentSubmissionsService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerSubmissionsDomainServices(services: ServiceCollection): void {
	services.set(ITournamentSubmissionsService, new SyncDescriptor(TournamentSubmissionsService));
}
