import type { FollowPage, FollowUserParams, FriendPage, GetMyRelationshipParams, ListMyFollowersQuery, ListMyFollowingQuery, ListMyFriendsQuery, RelationshipStatus, UnfollowUserParams } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ISocialGateway {
	getMyRelationship(params: GetMyRelationshipParams): Promise<RelationshipStatus>;
	listMyFriends(query?: ListMyFriendsQuery): Promise<FriendPage>;
	listMyFollowers(query?: ListMyFollowersQuery): Promise<FollowPage>;
	listMyFollowing(query?: ListMyFollowingQuery): Promise<FollowPage>;
	followUser(params: FollowUserParams): Promise<RelationshipStatus>;
	unfollowUser(params: UnfollowUserParams): Promise<void>;
}

export const ISocialGateway = createDecorator<ISocialGateway>('socialGateway');
