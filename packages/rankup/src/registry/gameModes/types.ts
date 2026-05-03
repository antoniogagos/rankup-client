import type { RankingTieBreaker } from '../../domains/tournaments/shared/models/enums.js';
import type { GameModeId, RulesetId } from '../../domains/tournaments/shared/models/ids.js';

export type ScorePredictionResultScope = 'regular' | 'extra_time';

export type ScorePredictionScoringWeights = {
	correctOutcome: number;
	exactScore: number;
	exactGoalsOneTeam: number;
	wrongGoalsBothTeamsNonDrawPenalty: number;
};

export type ScorePredictionLockPolicy = {
	type: 'kickoff' | 'kickoffWithGrace' | 'manual';
	graceSeconds?: number;
};

export type ScorePredictionRulesetDefinition = {
	rulesetId: RulesetId;
	resultScope: ScorePredictionResultScope;
	scoring: ScorePredictionScoringWeights;
	tieBreakers: RankingTieBreaker[];
	lockPolicy: ScorePredictionLockPolicy;
};

export type GameModeDefinition = {
	gameModeId: GameModeId;
	defaultRulesetId: RulesetId;
	rulesets: Record<string, ScorePredictionRulesetDefinition>;
};
