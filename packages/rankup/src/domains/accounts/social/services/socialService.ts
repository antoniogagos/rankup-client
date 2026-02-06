import type { ISocialService } from '../contracts/social.js';
import type { ISocialGateway as SocialGateway } from '../contracts/socialGateway.js';
import { ISocialGateway } from '../contracts/socialGateway.js';
import type { FollowPage, FollowUserParams, FriendPage, GetMyRelationshipParams, ListMyFollowersQuery, ListMyFollowingQuery, ListMyFriendsQuery, RelationshipStatus, UnfollowUserParams } from '../contracts/types.js';

export class SocialService implements ISocialService {
	public constructor(@ISocialGateway private readonly gateway: SocialGateway) {}

	public async getMyRelationship(params: GetMyRelationshipParams): Promise<RelationshipStatus> {
		return this.gateway.getMyRelationship(params);
	}

	public async listMyFriends(query?: ListMyFriendsQuery): Promise<FriendPage> {
		return this.gateway.listMyFriends(query);
	}

	public async listMyFollowers(query?: ListMyFollowersQuery): Promise<FollowPage> {
		return this.gateway.listMyFollowers(query);
	}

	public async listMyFollowing(query?: ListMyFollowingQuery): Promise<FollowPage> {
		return this.gateway.listMyFollowing(query);
	}

	public async followUser(params: FollowUserParams): Promise<RelationshipStatus> {
		return this.gateway.followUser(params);
	}

	public async unfollowUser(params: UnfollowUserParams): Promise<void> {
		return this.gateway.unfollowUser(params);
	}
}
