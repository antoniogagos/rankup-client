import { tournamentsDtoFixtures } from '../dto/tournaments.dto.js';
import { invitationCodesDtoFixtures } from '../dto/invitationCodes.dto.js';
import { invitesDtoFixtures } from '../dto/invites.dto.js';

export const tournamentsDomainFixtures = {
	tournamentPreview() {
		return tournamentsDtoFixtures.tournamentPreview();
	},
	joinByInvitationCodeResult() {
		return tournamentsDtoFixtures.joinByInvitationCodeResult();
	},
	invitationCodeResolution() {
		return invitationCodesDtoFixtures.invitationCodeResolution();
	},
	myTournamentInvite() {
		return invitesDtoFixtures.myTournamentInvite();
	},
};
