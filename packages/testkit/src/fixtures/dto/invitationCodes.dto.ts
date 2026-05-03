import { tournamentsDtoFixtures } from './tournaments.dto.js';

export const invitationCodesDtoFixtures = {
	invitationCodeResolution() {
		return {
			code: 'ABC123',
			codeStatus: 'active',
			joinable: true,
			joinNotAllowedReason: 'none',
			alreadyMember: false,
			tournament: tournamentsDtoFixtures.tournamentPreview(),
		};
	},
};
