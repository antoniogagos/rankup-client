import { builders } from '../builders.js';
import { tournamentsDtoFixtures } from './tournaments.dto.js';

const summaryUser = {
	userId: builders.userId(),
	username: 'cr7',
	pictureUrl: 'https://img.rankup.dev/users/cr7.png',
};

export const invitesDtoFixtures = {
	myTournamentInvite() {
		return {
			inviteId: 'invite-1',
			tournamentId: builders.tournamentId(),
			kind: 'direct',
			status: 'pending',
			invitedUser: summaryUser,
			invitedBy: {
				userId: 'user-messi',
				username: 'messi',
				pictureUrl: 'https://img.rankup.dev/users/messi.png',
			},
			message: 'Entra al torneo',
			headsUpPayload: {
				challengerUserId: 'user-messi',
				opponentUserId: summaryUser.userId,
				formatConfigSummary: {
					roundUnit: 'matchday',
					duration: {
						type: 'fixedRounds',
						roundCount: 2,
						startMatchday: 1,
						endMatchday: 2,
					},
					victoryCondition: 'bestOfRounds',
					tieBreakers: [],
					requiresDirectInvite: true,
					onPlayerLeave: 'forfeit',
				},
			},
			createdAt: builders.isoDate('2026-01-11T10:00:00.000Z'),
			expiresAt: builders.isoDate('2026-01-15T10:00:00.000Z'),
			respondedAt: builders.isoDate('2026-01-12T10:00:00.000Z'),
			seenAt: builders.isoDate('2026-01-11T11:00:00.000Z'),
			hiddenAt: builders.isoDate('2026-01-13T08:00:00.000Z'),
			tournamentPreview: tournamentsDtoFixtures.tournamentPreview(),
		};
	},
};
