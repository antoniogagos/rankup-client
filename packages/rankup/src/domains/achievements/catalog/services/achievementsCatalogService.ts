import type { IAchievementsCatalogService } from '../contracts/achievementsCatalog.js';
import type { IAchievementsCatalogGateway as AchievementsCatalogGateway } from '../contracts/achievementsCatalogGateway.js';
import { IAchievementsCatalogGateway } from '../contracts/achievementsCatalogGateway.js';
import type { AchievementDefinition, AchievementDefinitionPage, AchievementMeta, GetAchievementDefinitionParams, GetAchievementDefinitionQuery, GetAchievementMetaQuery, ListAchievementDefinitionsQuery } from '../contracts/types.js';

export class AchievementsCatalogService implements IAchievementsCatalogService {
	public constructor(@IAchievementsCatalogGateway private readonly gateway: AchievementsCatalogGateway) {}

	public async getAchievementMeta(query?: GetAchievementMetaQuery): Promise<AchievementMeta> {
		return this.gateway.getAchievementMeta(query);
	}

	public async listAchievementDefinitions(query?: ListAchievementDefinitionsQuery): Promise<AchievementDefinitionPage> {
		return this.gateway.listAchievementDefinitions(query);
	}

	public async getAchievementDefinition(
		params: GetAchievementDefinitionParams,
		query?: GetAchievementDefinitionQuery,
	): Promise<AchievementDefinition> {
		return this.gateway.getAchievementDefinition(params, query);
	}
}
