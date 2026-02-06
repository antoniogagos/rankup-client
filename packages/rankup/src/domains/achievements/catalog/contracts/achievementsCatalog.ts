import type { AchievementDefinition, AchievementDefinitionPage, AchievementMeta, GetAchievementDefinitionParams, GetAchievementDefinitionQuery, GetAchievementMetaQuery, ListAchievementDefinitionsQuery } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IAchievementsCatalogService {
	getAchievementMeta(query?: GetAchievementMetaQuery): Promise<AchievementMeta>;
	listAchievementDefinitions(query?: ListAchievementDefinitionsQuery): Promise<AchievementDefinitionPage>;
	getAchievementDefinition(params: GetAchievementDefinitionParams, query?: GetAchievementDefinitionQuery): Promise<AchievementDefinition>;
}

export const IAchievementsCatalogService = createDecorator<IAchievementsCatalogService>('achievementsCatalogService');
