import type * as Api from '@rankup/api';
import type * as Auth from '@rankup/rankup/domains/accounts/auth/contracts/types.js';
import type * as Me from '@rankup/rankup/domains/accounts/me/contracts/types.js';
import type * as Social from '@rankup/rankup/domains/accounts/social/contracts/types.js';
import type * as Users from '@rankup/rankup/domains/accounts/users/contracts/types.js';

export function mapAuthSession(response: Api.AuthSession): Auth.AuthSession {
	return {
		accessToken: response.accessToken,
		expiresAt: response.expiresAt,
		tokenType: response.tokenType,
		refreshToken: response.refreshToken,
		idToken: response.idToken,
		user: mapUserSummary(response.user),
	};
}

export function mapRegistration(response: Api.RegisterUserResponse): Auth.Registration {
	return {
		registrationId: response.registrationId,
		email: response.email,
		status: response.status,
		createdAt: response.createdAt,
		expiresAt: response.expiresAt,
	};
}

export function mapMe(response: Api.GetMeResponse): Me.Me {
	return {
		userId: response.userId,
		username: response.username,
		email: response.email,
		emailVerified: response.emailVerified,
		createdAt: response.createdAt,
		updatedAt: response.updatedAt,
		pictureUrl: response.pictureUrl,
	};
}

export function mapUserDirectoryPage(response: Api.SearchUsersResponse): Users.UserDirectoryPage {
	return {
		items: response.items.map(mapUserDirectoryEntry),
		nextCursor: response.nextCursor,
	};
}

export function mapPublicUserProfile(response: Api.GetUserResponse): Users.PublicUserProfile {
	return {
		userId: response.userId,
		username: response.username,
		scope: response.scope,
		pictureUrl: response.pictureUrl,
		bio: response.bio,
		relationship: response.relationship
			? {
				isFriend: response.relationship.isFriend,
				youFollow: response.relationship.youFollow,
				followsYou: response.relationship.followsYou,
			}
			: undefined,
		badges: response.badges,
	};
}

export function mapRelationshipStatus(response: Api.GetMyRelationshipResponse): Social.RelationshipStatus {
	return {
		userId: response.userId,
		isFriend: response.isFriend,
		youFollow: response.youFollow,
		followsYou: response.followsYou,
		youBlocked: response.youBlocked,
	};
}

export function mapFriendPage(response: Api.ListMyFriendsResponse): Social.FriendPage {
	return {
		items: response.items.map(item => ({
			user: mapUserSummary(item.user),
			friendedAt: item.friendedAt,
		})),
		nextCursor: response.nextCursor,
	};
}

export function mapFollowersPage(response: Api.ListMyFollowersResponse): Social.FollowPage {
	return {
		items: response.items.map(item => ({
			user: mapUserSummary(item.user),
			followedAt: item.followedAt,
		})),
		nextCursor: response.nextCursor,
	};
}

export function mapFollowingPage(response: Api.ListMyFollowingResponse): Social.FollowPage {
	return {
		items: response.items.map(item => ({
			user: mapUserSummary(item.user),
			followedAt: item.followedAt,
		})),
		nextCursor: response.nextCursor,
	};
}

export function mapFollowRelationship(response: Api.FollowUserResponse): Social.RelationshipStatus {
	return {
		userId: response.userId,
		isFriend: response.isFriend,
		youFollow: response.youFollow,
		followsYou: response.followsYou,
		youBlocked: response.youBlocked,
	};
}

function mapUserDirectoryEntry(entry: Api.SearchUsersResponse['items'][number]): Users.UserDirectoryEntry {
	return {
		userId: entry.userId,
		username: entry.username,
		pictureUrl: entry.pictureUrl,
		relationship: entry.relationship
			? {
				isFriend: entry.relationship.isFriend,
				youFollow: entry.relationship.youFollow,
				followsYou: entry.relationship.followsYou,
			}
			: undefined,
	};
}

function mapUserSummary(summary: Api.MeSummary): Users.UserSummary {
	return {
		userId: summary.userId,
		username: summary.username,
		pictureUrl: summary.pictureUrl,
	};
}
