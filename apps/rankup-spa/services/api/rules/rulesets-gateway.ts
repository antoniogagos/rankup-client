import { mapRuleset, mapRulesetPage } from './rules-mappers.js';
import type * as Api from '@rankup/api';
import type { IRulesetsGateway } from '@rankup/rankup/domains/rules/rulesets/contracts/rulesetsGateway.js';
import type * as Domain from '@rankup/rankup/domains/rules/rulesets/contracts/types.js';

const mapListRulesetsQuery = (query?: Domain.ListRulesetsQuery): Api.ListRulesetsQuery | undefined =>
	query
		? {
			gameModeId: query.gameModeId,
			sportId: query.sportId,
			status: query.status,
			rankedEligible: query.rankedEligible,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

export class RulesetsGateway implements IRulesetsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listRulesets(query?: Domain.ListRulesetsQuery): Promise<Domain.RulesetPage> {
		const response = await this.apiClient.listRulesets(mapListRulesetsQuery(query));
		return mapRulesetPage(response);
	}

	public async getRuleset(params: Domain.GetRulesetParams): Promise<Domain.Ruleset> {
		const response = await this.apiClient.getRuleset({ rulesetId: params.rulesetId });
		return mapRuleset(response);
	}
}
