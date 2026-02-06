import { mapAchievementProgress, mapAchievementProgressPage, mapUnlockedAchievementList, mapUserAchievementPage } from './achievements-mappers.js';
import type * as Api from '@rankup/api';
import type { IAchievementsGrantsGateway } from '@rankup/rankup/domains/achievements/grants/contracts/achievementsGrantsGateway.js';
import type * as Domain from '@rankup/rankup/domains/achievements/grants/contracts/types.js';

const mapListMyAchievementsQuery = (query?: Domain.ListMyAchievementsQuery): Api.ListMyAchievementsQuery | undefined =>
	query
		? {
			status: query.status,
			category: query.category,
			gameModeId: query.gameModeId,
			sportId: query.sportId,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapListMyUnlockedAchievementsQuery = (
	query?: Domain.ListMyUnlockedAchievementsQuery,
): Api.ListMyUnlockedAchievementsQuery | undefined =>
	query
		? {
			limit: query.limit,
		}
		: undefined;

const mapGetMyAchievementQuery = (query?: Domain.GetMyAchievementQuery): Api.GetMyAchievementQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapListUserAchievementsQuery = (
	query?: Domain.ListUserAchievementsQuery,
): Api.ListUserAchievementsQuery | undefined =>
	query
		? {
			includeProgress: query.includeProgress,
			category: query.category,
			gameModeId: query.gameModeId,
			sportId: query.sportId,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

export class AchievementsGrantsGateway implements IAchievementsGrantsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listMyAchievements(query?: Domain.ListMyAchievementsQuery): Promise<Domain.AchievementProgressPage> {
		const response = await this.apiClient.listMyAchievements(mapListMyAchievementsQuery(query));
		return mapAchievementProgressPage(response);
	}

	public async listMyUnlockedAchievements(
		query?: Domain.ListMyUnlockedAchievementsQuery,
	): Promise<Domain.UnlockedAchievementList> {
		const response = await this.apiClient.listMyUnlockedAchievements(mapListMyUnlockedAchievementsQuery(query));
		return mapUnlockedAchievementList(response);
	}

	public async getMyAchievement(
		params: Domain.GetMyAchievementParams,
		query?: Domain.GetMyAchievementQuery,
	): Promise<Domain.AchievementProgress> {
		const response = await this.apiClient.getMyAchievement(
			{ achievementId: params.achievementId },
			mapGetMyAchievementQuery(query),
		);
		return mapAchievementProgress(response);
	}

	public async listUserAchievements(
		params: Domain.ListUserAchievementsParams,
		query?: Domain.ListUserAchievementsQuery,
	): Promise<Domain.UserAchievementPage> {
		const response = await this.apiClient.listUserAchievements(
			{ userId: params.userId },
			mapListUserAchievementsQuery(query),
		);
		return mapUserAchievementPage(response);
	}
}
