import type { GameModeId, SportId, UserId } from '../../../tournaments/shared/models/ids.js';
import type { AchievementCategory, AchievementProgressStatus, AchievementProgressStatusFilter, AchievementRarity, MyAchievementInclude, MyAchievementSort, UserAchievementSort } from '../../shared/models/enums.js';
import type { AchievementDefinition, AchievementReward, AchievementUnlockContext } from '../../shared/models/achievements.js';
import type { AchievementId } from '../../shared/models/ids.js';

export type AchievementProgressRequirement = {
	metricId: string;
	current: number;
	target: number;
	progress?: number;
};

export type AchievementProgress = {
	achievementId: AchievementId;
	definition?: AchievementDefinition;
	status: AchievementProgressStatus;
	progress?: number;
	progressByRequirement?: AchievementProgressRequirement[];
	unlockedAt?: string;
	unlockContext?: AchievementUnlockContext;
	eligibilitySummary?: string;
};

export type AchievementProgressPage = {
	serverTime: string;
	items: AchievementProgress[];
	nextCursor?: string;
};

export type UnlockedAchievementListItem = {
	achievementId: AchievementId;
	unlockedAt: string;
	rewardPreview?: AchievementReward;
	rarity?: AchievementRarity;
};

export type UnlockedAchievementList = {
	items: UnlockedAchievementListItem[];
};

export type UserAchievementPage = {
	items: AchievementProgress[];
	nextCursor?: string;
};

export type ListMyAchievementsQuery = {
	status?: AchievementProgressStatusFilter;
	category?: AchievementCategory;
	gameModeId?: GameModeId;
	sportId?: SportId;
	include?: MyAchievementInclude[];
	sort?: MyAchievementSort;
	cursor?: string;
	pageSize?: number;
};

export type ListMyUnlockedAchievementsQuery = {
	limit?: number;
};

export type GetMyAchievementParams = {
	achievementId: AchievementId;
};

export type GetMyAchievementQuery = {
	include?: MyAchievementInclude[];
};

export type ListUserAchievementsParams = {
	userId: UserId;
};

export type ListUserAchievementsQuery = {
	includeProgress?: boolean;
	category?: AchievementCategory;
	gameModeId?: GameModeId;
	sportId?: SportId;
	sort?: UserAchievementSort;
	cursor?: string;
	pageSize?: number;
};
