import { builders } from './builders.js';
import { errorDtoFixtures } from './dto/errors.dto.js';
import { invitationCodesDtoFixtures } from './dto/invitationCodes.dto.js';
import { invitesDtoFixtures } from './dto/invites.dto.js';
import { matchdaysDtoFixtures } from './dto/matchdays.dto.js';
import { rankingsDtoFixtures } from './dto/rankings.dto.js';
import { resultsDtoFixtures } from './dto/results.dto.js';
import { submissionsDtoFixtures } from './dto/submissions.dto.js';
import { tournamentsDtoFixtures } from './dto/tournaments.dto.js';
import { rankingsDomainFixtures } from './domain/rankings.domain.js';
import { resultsDomainFixtures } from './domain/results.domain.js';
import { submissionsDomainFixtures } from './domain/submissions.domain.js';
import { tournamentsDomainFixtures } from './domain/tournaments.domain.js';

export const fixtures = {
	builders,
	dto: {
		tournaments: tournamentsDtoFixtures,
		invitationCodes: invitationCodesDtoFixtures,
		invites: invitesDtoFixtures,
		matchdays: matchdaysDtoFixtures,
		submissions: submissionsDtoFixtures,
		rankings: rankingsDtoFixtures,
		results: resultsDtoFixtures,
		errors: errorDtoFixtures,
	},
	domain: {
		tournaments: tournamentsDomainFixtures,
		submissions: submissionsDomainFixtures,
		rankings: rankingsDomainFixtures,
		results: resultsDomainFixtures,
	},
};
