import type { UserId } from '../../shared/models/ids.js';
import type { UserSummary } from '../../shared/models/user.js';

export type RelationshipStatus = {
	userId: UserId;
	isFriend: boolean;
	youFollow: boolean;
	followsYou: boolean;
	youBlocked: boolean;
};

export type Friend = {
	user: UserSummary;
	friendedAt: string;
};

export type FriendPage = {
	items: Friend[];
	nextCursor?: string;
};

export type FollowEdge = {
	user: UserSummary;
	followedAt: string;
};

export type FollowPage = {
	items: FollowEdge[];
	nextCursor?: string;
};

export type GetMyRelationshipParams = {
	userId: UserId;
};

export type ListMyFriendsQuery = {
	q?: string;
	cursor?: string;
	pageSize?: number;
};

export type ListMyFollowersQuery = {
	q?: string;
	cursor?: string;
	pageSize?: number;
};

export type ListMyFollowingQuery = {
	q?: string;
	cursor?: string;
	pageSize?: number;
};

export type FollowUserParams = {
	userId: UserId;
};

export type UnfollowUserParams = {
	userId: UserId;
};
