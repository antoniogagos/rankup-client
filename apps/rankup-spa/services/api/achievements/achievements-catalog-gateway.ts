import { mapAchievementDefinition, mapAchievementDefinitionPage, mapAchievementMeta } from './achievements-mappers.js';
import type * as Api from '@rankup/api';
import type { IAchievementsCatalogGateway } from '@rankup/rankup/domains/achievements/catalog/contracts/achievementsCatalogGateway.js';
import type * as Domain from '@rankup/rankup/domains/achievements/catalog/contracts/types.js';

const mapGetAchievementMetaQuery = (query?: Domain.GetAchievementMetaQuery): Api.GetAchievementMetaQuery | undefined =>
	query
		? {
			gameModeId: query.gameModeId,
			sportId: query.sportId,
			include: query.include,
		}
		: undefined;

const mapListAchievementDefinitionsQuery = (
	query?: Domain.ListAchievementDefinitionsQuery,
): Api.ListAchievementDefinitionsQuery | undefined =>
	query
		? {
			category: query.category,
			gameModeId: query.gameModeId,
			sportId: query.sportId,
			verifiedOnly: query.verifiedOnly,
			includeHidden: query.includeHidden,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetAchievementDefinitionQuery = (
	query?: Domain.GetAchievementDefinitionQuery,
): Api.GetAchievementDefinitionQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class AchievementsCatalogGateway implements IAchievementsCatalogGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getAchievementMeta(query?: Domain.GetAchievementMetaQuery): Promise<Domain.AchievementMeta> {
		const response = await this.apiClient.getAchievementMeta(mapGetAchievementMetaQuery(query));
		return mapAchievementMeta(response);
	}

	public async listAchievementDefinitions(
		query?: Domain.ListAchievementDefinitionsQuery,
	): Promise<Domain.AchievementDefinitionPage> {
		const response = await this.apiClient.listAchievementDefinitions(mapListAchievementDefinitionsQuery(query));
		return mapAchievementDefinitionPage(response);
	}

	public async getAchievementDefinition(
		params: Domain.GetAchievementDefinitionParams,
		query?: Domain.GetAchievementDefinitionQuery,
	): Promise<Domain.AchievementDefinition> {
		const response = await this.apiClient.getAchievementDefinition(
			{ achievementId: params.achievementId },
			mapGetAchievementDefinitionQuery(query),
		);
		return mapAchievementDefinition(response);
	}
}
