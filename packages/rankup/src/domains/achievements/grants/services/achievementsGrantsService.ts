import type { IAchievementsGrantsService } from '../contracts/achievementsGrants.js';
import type { IAchievementsGrantsGateway as AchievementsGrantsGateway } from '../contracts/achievementsGrantsGateway.js';
import { IAchievementsGrantsGateway } from '../contracts/achievementsGrantsGateway.js';
import type { AchievementProgress, AchievementProgressPage, GetMyAchievementParams, GetMyAchievementQuery, ListMyAchievementsQuery, ListMyUnlockedAchievementsQuery, ListUserAchievementsParams, ListUserAchievementsQuery, UnlockedAchievementList, UserAchievementPage } from '../contracts/types.js';

export class AchievementsGrantsService implements IAchievementsGrantsService {
	public constructor(@IAchievementsGrantsGateway private readonly gateway: AchievementsGrantsGateway) {}

	public async listMyAchievements(query?: ListMyAchievementsQuery): Promise<AchievementProgressPage> {
		return this.gateway.listMyAchievements(query);
	}

	public async listMyUnlockedAchievements(query?: ListMyUnlockedAchievementsQuery): Promise<UnlockedAchievementList> {
		return this.gateway.listMyUnlockedAchievements(query);
	}

	public async getMyAchievement(
		params: GetMyAchievementParams,
		query?: GetMyAchievementQuery,
	): Promise<AchievementProgress> {
		return this.gateway.getMyAchievement(params, query);
	}

	public async listUserAchievements(
		params: ListUserAchievementsParams,
		query?: ListUserAchievementsQuery,
	): Promise<UserAchievementPage> {
		return this.gateway.listUserAchievements(params, query);
	}
}
