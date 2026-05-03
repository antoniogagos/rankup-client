import { ITournamentCoreService } from './core/contracts/tournamentCore.js';
import { TournamentCoreService } from './core/services/tournamentCoreService.js';
import { ITournamentMatchdaysService } from './matchdays/contracts/tournamentMatchdays.js';
import { TournamentMatchdaysService } from './matchdays/services/tournamentMatchdaysService.js';
import { ITournamentMembersService } from './members/contracts/tournamentMembers.js';
import { TournamentMembersService } from './members/services/tournamentMembersService.js';
import { ITournamentInvitationCodesService } from './codes/contracts/tournamentInvitationCodes.js';
import { TournamentInvitationCodesService } from './codes/services/tournamentInvitationCodesService.js';
import { ITournamentInvitesService } from './invites/contracts/tournamentInvites.js';
import { TournamentInvitesService } from './invites/services/tournamentInvitesService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerTournamentDomainServices(services: ServiceCollection): void {
	services.set(ITournamentCoreService, new SyncDescriptor(TournamentCoreService));
	services.set(ITournamentMatchdaysService, new SyncDescriptor(TournamentMatchdaysService));
	services.set(ITournamentMembersService, new SyncDescriptor(TournamentMembersService));
	services.set(ITournamentInvitationCodesService, new SyncDescriptor(TournamentInvitationCodesService));
	services.set(ITournamentInvitesService, new SyncDescriptor(TournamentInvitesService));
}
