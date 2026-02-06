import type { PublicProfileScope, UserProfileInclude, UserSearchMatch } from '../../shared/models/enums.js';
import type { UserId } from '../../shared/models/ids.js';

export type RelationshipSummary = {
	isFriend: boolean;
	youFollow: boolean;
	followsYou: boolean;
};

export type PublicUserProfile = {
	userId: UserId;
	username: string;
	scope: PublicProfileScope;
	pictureUrl?: string;
	bio?: string;
	relationship?: RelationshipSummary;
	badges?: string[];
};

export type UserDirectoryEntry = {
	userId: UserId;
	username: string;
	pictureUrl?: string;
	relationship?: RelationshipSummary;
};

export type UserDirectoryPage = {
	items: UserDirectoryEntry[];
	nextCursor?: string;
};

export type SearchUsersQuery = {
	q: string;
	match?: UserSearchMatch;
	cursor?: string;
	pageSize?: number;
};

export type GetUserPublicProfileParams = {
	userId: UserId;
};

export type GetUserPublicProfileQuery = {
	include?: UserProfileInclude[];
};

export type ResolveUserByUsernameParams = {
	username: string;
};
