import { mapProblemToDomainError } from '../problem/mapProblemToDomainError.js';
import type * as Api from '@rankup/api';
import type { DomainError } from '@rankup/rankup/domains/shared/errors/domainError.js';
import type * as GameModes from '@rankup/rankup/domains/rules/gameModes/contracts/types.js';
import type * as Rulesets from '@rankup/rankup/domains/rules/rulesets/contracts/types.js';

export function mapGameModeList(response: Api.ListGameModesResponse): GameModes.GameModeList {
	return {
		items: response.items.map(mapGameModeItem),
	};
}

export function mapGameMode(response: Api.GetGameModeResponse): GameModes.GameMode {
	return mapGameModeItem(response);
}

function mapGameModeItem(item: Api.ListGameModesResponse['items'][number]): GameModes.GameMode {
	return {
		gameModeId: item.gameModeId,
		name: item.name,
		shortName: item.shortName,
		description: item.description,
		status: item.status,
		supportedSportIds: item.supportedSportIds,
		supportedModalities: item.supportedModalities,
		supportedFormats: item.supportedFormats ? item.supportedFormats.slice() : undefined,
		defaultRulesetId: item.defaultRulesetId,
		capabilities: {
			submissionModel: item.capabilities.submissionModel,
			supportsLiveUpdates: item.capabilities.supportsLiveUpdates,
			supportsNegativePoints: item.capabilities.supportsNegativePoints,
			supportsEditsBeforeLock: item.capabilities.supportsEditsBeforeLock,
			lockGranularity: item.capabilities.lockGranularity,
		},
		tournamentRulesetConfigSchema: item.tournamentRulesetConfigSchema,
	};
}

export function mapRulesetPage(response: Api.ListRulesetsResponse): Rulesets.RulesetPage {
	return {
		items: response.items.map(mapRulesetSummary),
		nextCursor: response.nextCursor,
	};
}

export function mapRuleset(response: Api.GetRulesetResponse): Rulesets.Ruleset {
	const audit = response.audit
		? {
			createdAt: response.audit.createdAt,
			createdBy: response.audit.createdBy,
		}
		: undefined;

	return {
		rulesetId: response.rulesetId,
		gameModeId: response.gameModeId,
		sportId: response.sportId,
		name: response.name,
		status: response.status,
		isRankedEligible: response.isRankedEligible,
		version: response.version,
		description: response.description,
		publishedAt: response.publishedAt,
		defaultConfig: response.defaultConfig,
		configSchema: response.configSchema,
		sections: response.sections.map(section => ({
			title: section.title,
			items: section.items,
		})),
		scoringModel: response.scoringModel,
		audit,
	};
}

function mapRulesetSummary(item: Api.ListRulesetsResponse['items'][number]): Rulesets.RulesetSummary {
	return {
		rulesetId: item.rulesetId,
		gameModeId: item.gameModeId,
		sportId: item.sportId,
		name: item.name,
		status: item.status,
		isRankedEligible: item.isRankedEligible,
		version: item.version,
		description: item.description,
		publishedAt: item.publishedAt,
	};
}

export const mapRulesProblemToDomainError = (problem: unknown): DomainError => mapProblemToDomainError(problem);
