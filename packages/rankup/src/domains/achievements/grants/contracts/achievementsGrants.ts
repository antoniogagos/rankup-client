import type { AchievementProgress, AchievementProgressPage, GetMyAchievementParams, GetMyAchievementQuery, ListMyAchievementsQuery, ListMyUnlockedAchievementsQuery, ListUserAchievementsParams, ListUserAchievementsQuery, UnlockedAchievementList, UserAchievementPage } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IAchievementsGrantsService {
	listMyAchievements(query?: ListMyAchievementsQuery): Promise<AchievementProgressPage>;
	listMyUnlockedAchievements(query?: ListMyUnlockedAchievementsQuery): Promise<UnlockedAchievementList>;
	getMyAchievement(params: GetMyAchievementParams, query?: GetMyAchievementQuery): Promise<AchievementProgress>;
	listUserAchievements(params: ListUserAchievementsParams, query?: ListUserAchievementsQuery): Promise<UserAchievementPage>;
}

export const IAchievementsGrantsService = createDecorator<IAchievementsGrantsService>('achievementsGrantsService');
