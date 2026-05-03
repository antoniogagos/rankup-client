import { scorePredictionRegistry } from './scorePredictionRegistry.js';
import type { GameModeDefinition, ScorePredictionRulesetDefinition } from './types.js';

const gameModeRegistry: Record<string, GameModeDefinition> = {
	[scorePredictionRegistry.gameModeId]: scorePredictionRegistry,
};

export function resolveGameModeDefinition(gameModeId: string): GameModeDefinition {
	const definition = gameModeRegistry[gameModeId];
	if (!definition) {
		throw new Error(`Unsupported gameModeId: ${gameModeId}`);
	}
	return definition;
}

export function resolveRulesetDefinition(gameModeId: string, rulesetId?: string): ScorePredictionRulesetDefinition {
	const definition = resolveGameModeDefinition(gameModeId);
	const resolvedRulesetId = rulesetId ?? definition.defaultRulesetId;
	const ruleset = definition.rulesets[resolvedRulesetId];
	if (!ruleset) {
		throw new Error(`Unsupported rulesetId "${resolvedRulesetId}" for gameModeId "${gameModeId}".`);
	}
	return ruleset;
}

export { scorePredictionRegistry };
export type { GameModeDefinition, ScorePredictionLockPolicy, ScorePredictionResultScope, ScorePredictionRulesetDefinition, ScorePredictionScoringWeights } from './types.js';
