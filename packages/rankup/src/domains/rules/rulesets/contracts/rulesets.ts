import type { GetRulesetParams, ListRulesetsQuery, Ruleset, RulesetPage } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IRulesetsService {
	listRulesets(query?: ListRulesetsQuery): Promise<RulesetPage>;
	getRuleset(params: GetRulesetParams): Promise<Ruleset>;
}

export const IRulesetsService = createDecorator<IRulesetsService>('rulesetsService');
