import { builders } from '../builders.js';

const tournamentTiming = {
	competitionId: builders.competitionId(),
	seasonId: builders.seasonId(),
	startMatchday: 1,
	endMatchday: 38,
	startsAt: builders.isoDate('2026-01-10T10:00:00.000Z'),
	endsAt: builders.isoDate('2026-05-20T22:00:00.000Z'),
};

const tournamentJoinPolicy = {
	joinMode: 'open',
	joinMidSeasonAllowed: true,
	maxPlayers: 128,
	locked: false,
	joinClosesAt: builders.isoDate('2026-05-01T10:00:00.000Z'),
};

const tournamentOrganizer = {
	type: 'rankup',
	displayName: 'Rankup',
};

export const tournamentsDtoFixtures = {
	tournamentPreview() {
		return {
			tournamentId: builders.tournamentId(),
			name: 'Liga Rankup',
			description: 'Torneo competitivo',
			heroImageUrl: 'https://img.rankup.dev/tournaments/tournament-1.png',
			organizer: tournamentOrganizer,
			visibility: 'public',
			verificationStatus: 'community',
			isRankedEligible: true,
			sportId: 'football',
			gameModeId: 'scorePrediction',
			formatId: 'league',
			modality: 'season',
			status: 'live',
			timing: tournamentTiming,
			joinPolicy: tournamentJoinPolicy,
			memberCount: 42,
			rewardSummary: 'Gloria competitiva',
		};
	},
	joinByInvitationCodeResult() {
		return {
			joined: true,
			tournamentId: builders.tournamentId(),
			membership: {
				role: 'player',
				joinedAt: builders.isoDate('2026-01-11T11:00:00.000Z'),
				archivedAt: builders.isoDate('2026-12-31T00:00:00.000Z'),
			},
			tournament: {
				tournamentId: builders.tournamentId(),
				name: 'Liga Rankup',
				visibility: 'public',
				discoverability: 'listed',
				verificationStatus: 'community',
				sportId: 'football',
				gameModeId: 'scorePrediction',
				formatId: 'league',
				modality: 'season',
				status: 'live',
				joinPolicy: tournamentJoinPolicy,
				memberCount: 42,
				description: 'Torneo competitivo',
				heroImageUrl: 'https://img.rankup.dev/tournaments/tournament-1.png',
				organizer: tournamentOrganizer,
				isRankedEligible: true,
				timing: tournamentTiming,
				eventId: 'event-supercup',
				rewardSummary: 'Gloria competitiva',
				createdAt: builders.isoDate('2026-01-10T10:00:00.000Z'),
				updatedAt: builders.isoDate('2026-01-12T10:00:00.000Z'),
			},
		};
	},
};
