import { ITourneySubmissionsService } from './scorePrediction/contracts/tourneySubmissions.js';
import { TourneySubmissionsService } from './scorePrediction/services/tourneySubmissionsService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerSubmissionsDomainServices(services: ServiceCollection): void {
	services.set(ITourneySubmissionsService, new SyncDescriptor(TourneySubmissionsService));
}
