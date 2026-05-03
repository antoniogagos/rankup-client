import { builders } from '../builders.js';

export const resultsDtoFixtures = {
	scorePredictionMatchResultLine() {
		return {
			matchId: builders.matchId('match-1'),
			match: {
				matchId: builders.matchId('match-1'),
				homeTeamName: 'Real Madrid',
				awayTeamName: 'Barcelona',
			},
			prediction: {
				homeScore: 1,
				awayScore: 0,
				visibility: 'private',
			},
			actualScore: {
				home: 1,
				away: 0,
			},
			points: 14,
			state: 'final',
			breakdown: {
				correctOutcome: 8,
				exactScore: 6,
				exactGoalsOneTeam: 0,
				penalties: 0,
				bonuses: 0,
			},
		};
	},
};
