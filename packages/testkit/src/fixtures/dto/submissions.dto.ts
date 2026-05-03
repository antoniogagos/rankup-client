import { builders } from '../builders.js';

const submissionBase = {
	submissionId: 'submission-1',
	tournamentId: builders.tournamentId(),
	matchday: 1,
	userId: builders.userId(),
	gameModeId: 'scorePrediction',
	serverTime: builders.isoDate('2026-01-12T15:00:00.000Z'),
	scope: 'tournament',
	visibility: 'private',
	createdAt: builders.isoDate('2026-01-12T14:00:00.000Z'),
	updatedAt: builders.isoDate('2026-01-12T15:00:00.000Z'),
	completion: {
		submittedCount: 2,
		expectedCount: 3,
		status: 'partial',
	},
};

export const submissionsDtoFixtures = {
	matchdaySubmission() {
		return {
			...submissionBase,
			predictions: [
				{
					matchId: builders.matchId('match-1'),
					visibility: 'private',
					isSubmitted: true,
					homeScore: 1,
					awayScore: 0,
					lockState: 'open',
					lockAt: builders.isoDate('2026-01-12T19:00:00.000Z'),
					submittedAt: builders.isoDate('2026-01-12T15:00:00.000Z'),
					updatedAt: builders.isoDate('2026-01-12T15:00:00.000Z'),
				},
			],
		};
	},
	upsertMatchdaySubmissionResult() {
		return {
			submission: submissionsDtoFixtures.matchdaySubmission(),
			applied: [builders.matchId('match-1')],
			rejected: [
				{
					subjectType: 'match',
					subjectId: builders.matchId('match-2'),
					reason: 'locked',
					message: 'Partido bloqueado',
				},
			],
		};
	},
};
