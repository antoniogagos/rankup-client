import type { GameModeId, SportId } from '../../../tournaments/shared/models/ids.js';
import type { AchievementCategory, AchievementMetaInclude, AchievementSort } from '../../shared/models/enums.js';
import type { AchievementDefinition } from '../../shared/models/achievements.js';
import type { AchievementId } from '../../shared/models/ids.js';

export type AchievementMeta = {
	serverTime: string;
	categories: AchievementCategory[];
	featured?: AchievementDefinition[];
};

export type AchievementDefinitionPage = {
	items: AchievementDefinition[];
	nextCursor?: string;
};

export type GetAchievementMetaQuery = {
	gameModeId?: GameModeId;
	sportId?: SportId;
	include?: AchievementMetaInclude[];
};

export type ListAchievementDefinitionsQuery = {
	category?: AchievementCategory;
	gameModeId?: GameModeId;
	sportId?: SportId;
	verifiedOnly?: boolean;
	includeHidden?: boolean;
	include?: AchievementMetaInclude[];
	sort?: AchievementSort;
	cursor?: string;
	pageSize?: number;
};

export type GetAchievementDefinitionParams = {
	achievementId: AchievementId;
};

export type GetAchievementDefinitionQuery = {
	include?: AchievementMetaInclude[];
};
