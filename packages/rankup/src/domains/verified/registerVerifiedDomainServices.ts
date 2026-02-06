import { IVerifiedEventsService } from './events/contracts/events.js';
import { VerifiedEventsService } from './events/services/eventsService.js';
import { IVerifiedHubService } from './hub/contracts/hub.js';
import { VerifiedHubService } from './hub/services/hubService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerVerifiedDomainServices(services: ServiceCollection): void {
	services.set(IVerifiedHubService, new SyncDescriptor(VerifiedHubService));
	services.set(IVerifiedEventsService, new SyncDescriptor(VerifiedEventsService));
}
