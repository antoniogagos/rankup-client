import type { GameModeDefinition } from './types.js';

export const scorePredictionRegistry: GameModeDefinition = {
	gameModeId: 'scorePrediction',
	defaultRulesetId: 'ruleset.scorePrediction.v1',
	rulesets: {
		'ruleset.scorePrediction.v1': {
			rulesetId: 'ruleset.scorePrediction.v1',
			resultScope: 'extra_time',
			scoring: {
				correctOutcome: 8,
				exactScore: 6,
				exactGoalsOneTeam: 2,
				wrongGoalsBothTeamsNonDrawPenalty: -2,
			},
			tieBreakers: [
				'mostExactScores',
				'mostCorrectOutcomes',
				'mostExactGoalsOneTeam',
				'earliestSubmission',
				'random',
			],
			lockPolicy: {
				type: 'kickoff',
			},
		},
	},
};
