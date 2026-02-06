import type { RulesetStatus } from '../../shared/models/enums.js';
import type { GameModeId, RulesetId, SportId } from '../../shared/models/ids.js';

export type RulesSection = {
	title: string;
	items: string[];
};

export type RulesetSummary = {
	rulesetId: RulesetId;
	gameModeId: GameModeId;
	sportId: SportId;
	name: string;
	status: RulesetStatus;
	isRankedEligible: boolean;
	version: string;
	description?: string;
	publishedAt?: string;
};

export type RulesetAudit = {
	createdAt?: string;
	createdBy?: string;
};

export type Ruleset = RulesetSummary & {
	defaultConfig: Record<string, unknown>;
	configSchema: Record<string, unknown>;
	sections: RulesSection[];
	scoringModel?: string;
	audit?: RulesetAudit;
};

export type RulesetPage = {
	items: RulesetSummary[];
	nextCursor?: string;
};

export type ListRulesetsQuery = {
	gameModeId?: GameModeId;
	sportId?: SportId;
	status?: RulesetStatus;
	rankedEligible?: boolean;
	cursor?: string;
	pageSize?: number;
};

export type GetRulesetParams = {
	rulesetId: RulesetId;
};
