import type { ScorePredictionRulesetDefinition } from '../../registry/gameModes/types.js';
import type { CanonicalMatchStatus } from '../../registry/sports/types.js';

export type MatchOutcome = 'homeWin' | 'awayWin' | 'draw';

export type MatchPrediction = {
	homeScore: number;
	awayScore: number;
};

export type CanonicalMatchResult = {
	home: number | null;
	away: number | null;
	status: CanonicalMatchStatus;
	finalOutcomeType?: 'regular' | 'extra_time' | 'penalty_shootout';
};

export type ScorePredictionBreakdown = {
	correctOutcome: number;
	exactScore: number;
	exactGoalsOneTeam: number;
	penalties: number;
	bonuses: number;
};

export type ScorePredictionMetrics = {
	exactScores: number;
	correctOutcomes: number;
	exactGoalsOneTeam: number;
};

export type ScorePredictionEvaluation = {
	points: number | null;
	state: CanonicalMatchStatus;
	breakdown: ScorePredictionBreakdown;
	metrics: ScorePredictionMetrics;
};

function getOutcome(score: { home: number; away: number }): MatchOutcome {
	if (score.home > score.away) {
		return 'homeWin';
	}
	if (score.home < score.away) {
		return 'awayWin';
	}
	return 'draw';
}

export function evaluateScorePrediction(
	ruleset: ScorePredictionRulesetDefinition,
	prediction: MatchPrediction | null,
	result: CanonicalMatchResult,
): ScorePredictionEvaluation {
	const breakdown: ScorePredictionBreakdown = {
		correctOutcome: 0,
		exactScore: 0,
		exactGoalsOneTeam: 0,
		penalties: 0,
		bonuses: 0,
	};
	const metrics: ScorePredictionMetrics = {
		exactScores: 0,
		correctOutcomes: 0,
		exactGoalsOneTeam: 0,
	};

	if (result.status === 'pending' || result.status === 'void' || result.home == null || result.away == null || !prediction) {
		return {
			points: null,
			state: result.status,
			breakdown,
			metrics,
		};
	}

	const actualScore = { home: result.home, away: result.away };
	const predictedScore = { home: prediction.homeScore, away: prediction.awayScore };
	const actualOutcome = getOutcome(actualScore);
	const predictedOutcome = getOutcome(predictedScore);

	if (actualOutcome === predictedOutcome) {
		breakdown.correctOutcome = ruleset.scoring.correctOutcome;
		metrics.correctOutcomes = 1;
	}

	const exactHome = actualScore.home === predictedScore.home;
	const exactAway = actualScore.away === predictedScore.away;

	if (exactHome && exactAway) {
		breakdown.exactScore = ruleset.scoring.exactScore;
		metrics.exactScores = 1;
	}

	if (exactHome || exactAway) {
		breakdown.exactGoalsOneTeam = ruleset.scoring.exactGoalsOneTeam;
		metrics.exactGoalsOneTeam = 1;
	}

	if (actualOutcome !== 'draw' && !exactHome && !exactAway) {
		breakdown.penalties = ruleset.scoring.wrongGoalsBothTeamsNonDrawPenalty;
	}

	const points = breakdown.correctOutcome + breakdown.exactScore + breakdown.exactGoalsOneTeam + breakdown.penalties + breakdown.bonuses;
	return {
		points,
		state: result.status,
		breakdown,
		metrics,
	};
}
