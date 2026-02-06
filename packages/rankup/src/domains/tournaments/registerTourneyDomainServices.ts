import { ITourneyCoreService } from './core/contracts/tourneyCore.js';
import { TourneyCoreService } from './core/services/tourneyCoreService.js';
import { ITourneyMatchdaysService } from './matchdays/contracts/tourneyMatchdays.js';
import { TourneyMatchdaysService } from './matchdays/services/tourneyMatchdaysService.js';
import { ITourneyMembersService } from './members/contracts/tourneyMembers.js';
import { TourneyMembersService } from './members/services/tourneyMembersService.js';
import { ITourneyInvitationCodesService } from './codes/contracts/tourneyInvitationCodes.js';
import { TourneyInvitationCodesService } from './codes/services/tourneyInvitationCodesService.js';
import { ITourneyInvitesService } from './invites/contracts/tourneyInvites.js';
import { TourneyInvitesService } from './invites/services/tourneyInvitesService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerTourneyDomainServices(services: ServiceCollection): void {
	services.set(ITourneyCoreService, new SyncDescriptor(TourneyCoreService));
	services.set(ITourneyMatchdaysService, new SyncDescriptor(TourneyMatchdaysService));
	services.set(ITourneyMembersService, new SyncDescriptor(TourneyMembersService));
	services.set(ITourneyInvitationCodesService, new SyncDescriptor(TourneyInvitationCodesService));
	services.set(ITourneyInvitesService, new SyncDescriptor(TourneyInvitesService));
}
