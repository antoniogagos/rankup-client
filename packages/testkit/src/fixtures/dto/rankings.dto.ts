import { builders } from '../builders.js';

const rankingEntry = {
	position: 1,
	user: {
		userId: builders.userId(),
		username: 'cr7',
		pictureUrl: 'https://img.rankup.dev/users/cr7.png',
	},
	points: 120,
	pointsState: 'final',
	metrics: {
		mostExactScores: 12,
		mostCorrectOutcomes: 20,
	},
	lastUpdatedAt: builders.isoDate('2026-01-12T20:00:00.000Z'),
};

export const rankingsDtoFixtures = {
	tournamentRankingPage() {
		return {
			meta: {
				tournamentId: builders.tournamentId(),
				scope: 'matchday',
				state: 'provisional',
				serverTime: builders.isoDate('2026-01-12T20:00:00.000Z'),
				computedAt: builders.isoDate('2026-01-12T20:00:00.000Z'),
				totalPlayers: 42,
				matchday: 1,
				rulesetId: 'scorePrediction-v1',
				tieBreakers: ['mostExactScores', 'mostCorrectOutcomes', 'random'],
			},
			items: [rankingEntry],
			headsup: {
				players: [
					{
						position: 1,
						user: rankingEntry.user,
						points: rankingEntry.points,
						pointsState: rankingEntry.pointsState,
						metrics: rankingEntry.metrics,
						lastUpdatedAt: rankingEntry.lastUpdatedAt,
					},
				],
				rounds: [],
				overall: {
					winnerUserId: rankingEntry.user.userId,
					roundWinsA: 1,
					roundWinsB: 0,
					totalPointsA: rankingEntry.points,
					totalPointsB: 80,
					outcome: 'decided',
				},
			},
			myEntry: rankingEntry,
			nextCursor: 'ranking-next-cursor',
		};
	},
};
