import type { IRulesetsService } from '../contracts/rulesets.js';
import type { IRulesetsGateway as RulesetsGateway } from '../contracts/rulesetsGateway.js';
import { IRulesetsGateway } from '../contracts/rulesetsGateway.js';
import type { GetRulesetParams, ListRulesetsQuery, Ruleset, RulesetPage } from '../contracts/types.js';

export class RulesetsService implements IRulesetsService {
	public constructor(@IRulesetsGateway private readonly gateway: RulesetsGateway) {}

	public async listRulesets(query?: ListRulesetsQuery): Promise<RulesetPage> {
		return this.gateway.listRulesets(query);
	}

	public async getRuleset(params: GetRulesetParams): Promise<Ruleset> {
		return this.gateway.getRuleset(params);
	}
}
