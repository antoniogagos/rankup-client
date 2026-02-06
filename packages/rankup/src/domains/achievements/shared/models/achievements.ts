import type { RankedSeasonId, RankedTrackId } from '../../../ranked/shared/models/ids.js';
import type { TournamentFormatId } from '../../../tournaments/shared/models/enums.js';
import type { GameModeId, SportId, TournamentId } from '../../../tournaments/shared/models/ids.js';
import type { VerifiedEventId } from '../../../verified/shared/models/ids.js';
import type { AchievementCategory, AchievementRarity, AchievementRequirementKind,AchievementRewardType } from './enums.js';
import type { AchievementId } from './ids.js';

export type AchievementReward = {
	type: AchievementRewardType;
	rewardId: string;
	label: string;
	imageUrl?: string;
};

export type AchievementEligibility = {
	verifiedOnly?: boolean;
	rankedOnly?: boolean;
	gameModeIds?: GameModeId[];
	sportIds?: SportId[];
	formatIds?: TournamentFormatId[];
	verifiedEventIds?: VerifiedEventId[];
	rankedTrackIds?: RankedTrackId[];
	notes?: string;
};

export type AchievementRequirementComparator = 'gte' | 'lte';

export type AchievementRequirement = {
	kind: AchievementRequirementKind;
	metricId: string;
	target: number;
	window?: string;
	comparator?: AchievementRequirementComparator;
};

export type AchievementDefinition = {
	achievementId: AchievementId;
	name: string;
	description?: string;
	category: AchievementCategory;
	rarity: AchievementRarity;
	iconUrl?: string;
	featured?: boolean;
	hidden?: boolean;
	eligibility: AchievementEligibility;
	requirements?: AchievementRequirement[];
	rewards?: AchievementReward[];
};

export type AchievementUnlockContext = {
	verifiedEventId?: VerifiedEventId;
	tournamentId?: TournamentId;
	matchday?: number;
	rankedTrackId?: RankedTrackId;
	rankedSeasonId?: RankedSeasonId;
	note?: string;
};
