import { mapOptional } from '../gateway-mapping.js';
import { mapProblemToDomainError } from '../problem/mapProblemToDomainError.js';
import type * as Api from '@rankup/api';
import type { DomainError } from '@rankup/rankup/domains/shared/errors/domainError.js';
import type * as Catalog from '@rankup/rankup/domains/achievements/catalog/contracts/types.js';
import type * as Grants from '@rankup/rankup/domains/achievements/grants/contracts/types.js';

type ApiAchievementProgressRequirement = NonNullable<Api.AchievementProgress['progressByRequirement']>[number];

type ApiUnlockedAchievementItem = Api.UnlockedAchievementList['items'][number];

export function mapAchievementReward(reward: Api.AchievementReward): Catalog.AchievementReward {
	return {
		type: reward.type,
		rewardId: reward.rewardId,
		label: reward.label,
		imageUrl: reward.imageUrl,
	};
}

export function mapAchievementEligibility(eligibility: Api.AchievementEligibility): Catalog.AchievementEligibility {
	return {
		verifiedOnly: eligibility.verifiedOnly,
		rankedOnly: eligibility.rankedOnly,
		gameModeIds: eligibility.gameModeIds,
		sportIds: eligibility.sportIds,
		formatIds: eligibility.formatIds,
		verifiedEventIds: eligibility.verifiedEventIds,
		rankedTrackIds: eligibility.rankedTrackIds,
		notes: eligibility.notes,
	};
}

export function mapAchievementRequirement(requirement: Api.AchievementRequirement): Catalog.AchievementRequirement {
	return {
		kind: requirement.kind,
		metricId: requirement.metricId,
		target: requirement.target,
		window: requirement.window,
		comparator: requirement.comparator,
	};
}

export function mapAchievementDefinition(definition: Api.AchievementDefinition): Catalog.AchievementDefinition {
	return {
		achievementId: definition.achievementId,
		name: definition.name,
		description: definition.description,
		category: definition.category,
		rarity: definition.rarity,
		iconUrl: definition.iconUrl,
		featured: definition.featured,
		hidden: definition.hidden,
		eligibility: mapAchievementEligibility(definition.eligibility),
		requirements: definition.requirements?.map(mapAchievementRequirement),
		rewards: definition.rewards?.map(mapAchievementReward),
	};
}

export function mapAchievementMeta(meta: Api.AchievementMeta): Catalog.AchievementMeta {
	return {
		serverTime: meta.serverTime,
		categories: meta.categories,
		featured: meta.featured?.map(mapAchievementDefinition),
	};
}

export function mapAchievementDefinitionPage(page: Api.AchievementDefinitionPage): Catalog.AchievementDefinitionPage {
	return {
		items: page.items.map(mapAchievementDefinition),
		nextCursor: page.nextCursor,
	};
}

export function mapAchievementUnlockContext(context: Api.AchievementUnlockContext): Grants.AchievementUnlockContext {
	return {
		verifiedEventId: context.verifiedEventId,
		tournamentId: context.tournamentId,
		matchday: context.matchday,
		rankedTrackId: context.rankedTrackId,
		rankedSeasonId: context.rankedSeasonId,
		note: context.note,
	};
}

export function mapAchievementProgressRequirement(
	requirement: ApiAchievementProgressRequirement,
): Grants.AchievementProgressRequirement {
	return {
		metricId: requirement.metricId,
		current: requirement.current,
		target: requirement.target,
		progress: requirement.progress,
	};
}

export function mapAchievementProgress(progress: Api.AchievementProgress): Grants.AchievementProgress {
	return {
		achievementId: progress.achievementId,
		definition: mapOptional(progress.definition, mapAchievementDefinition),
		status: progress.status,
		progress: progress.progress,
		progressByRequirement: progress.progressByRequirement?.map(mapAchievementProgressRequirement),
		unlockedAt: progress.unlockedAt,
		unlockContext: mapOptional(progress.unlockContext, mapAchievementUnlockContext),
		eligibilitySummary: progress.eligibilitySummary,
	};
}

export function mapAchievementProgressPage(page: Api.AchievementProgressPage): Grants.AchievementProgressPage {
	return {
		serverTime: page.serverTime,
		items: page.items.map(mapAchievementProgress),
		nextCursor: page.nextCursor,
	};
}

export function mapUnlockedAchievementItem(item: ApiUnlockedAchievementItem): Grants.UnlockedAchievementListItem {
	return {
		achievementId: item.achievementId,
		unlockedAt: item.unlockedAt,
		rewardPreview: mapOptional(item.rewardPreview, mapAchievementReward),
		rarity: item.rarity,
	};
}

export function mapUnlockedAchievementList(list: Api.UnlockedAchievementList): Grants.UnlockedAchievementList {
	return {
		items: list.items.map(mapUnlockedAchievementItem),
	};
}

export function mapUserAchievementPage(page: Api.UserAchievementPage): Grants.UserAchievementPage {
	return {
		items: page.items.map(mapAchievementProgress),
		nextCursor: page.nextCursor,
	};
}

export const mapAchievementsProblemToDomainError = (problem: unknown): DomainError => mapProblemToDomainError(problem);
