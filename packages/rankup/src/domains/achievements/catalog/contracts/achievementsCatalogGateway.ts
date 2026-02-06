import type { AchievementDefinition, AchievementDefinitionPage, AchievementMeta, GetAchievementDefinitionParams, GetAchievementDefinitionQuery, GetAchievementMetaQuery, ListAchievementDefinitionsQuery } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IAchievementsCatalogGateway {
	getAchievementMeta(query?: GetAchievementMetaQuery): Promise<AchievementMeta>;
	listAchievementDefinitions(query?: ListAchievementDefinitionsQuery): Promise<AchievementDefinitionPage>;
	getAchievementDefinition(params: GetAchievementDefinitionParams, query?: GetAchievementDefinitionQuery): Promise<AchievementDefinition>;
}

export const IAchievementsCatalogGateway = createDecorator<IAchievementsCatalogGateway>('achievementsCatalogGateway');
