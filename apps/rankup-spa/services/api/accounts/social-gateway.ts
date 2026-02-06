import { mapFollowRelationship, mapFollowersPage, mapFollowingPage, mapFriendPage, mapRelationshipStatus } from './accounts-mappers.js';
import type * as Api from '@rankup/api';
import type { ISocialGateway } from '@rankup/rankup/domains/accounts/social/contracts/socialGateway.js';
import type * as Domain from '@rankup/rankup/domains/accounts/social/contracts/types.js';

const mapFriendsQuery = (query?: Domain.ListMyFriendsQuery): Api.ListMyFriendsQuery | undefined =>
	query
		? {
			q: query.q,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapFollowQuery = (query?: Domain.ListMyFollowersQuery | Domain.ListMyFollowingQuery): Api.ListMyFollowersQuery | undefined =>
	query
		? {
			q: query.q,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

export class SocialGateway implements ISocialGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getMyRelationship(params: Domain.GetMyRelationshipParams): Promise<Domain.RelationshipStatus> {
		const response = await this.apiClient.getMyRelationship({ userId: params.userId });
		return mapRelationshipStatus(response);
	}

	public async listMyFriends(query?: Domain.ListMyFriendsQuery): Promise<Domain.FriendPage> {
		const response = await this.apiClient.listMyFriends(mapFriendsQuery(query));
		return mapFriendPage(response);
	}

	public async listMyFollowers(query?: Domain.ListMyFollowersQuery): Promise<Domain.FollowPage> {
		const response = await this.apiClient.listMyFollowers(mapFollowQuery(query));
		return mapFollowersPage(response);
	}

	public async listMyFollowing(query?: Domain.ListMyFollowingQuery): Promise<Domain.FollowPage> {
		const response = await this.apiClient.listMyFollowing(mapFollowQuery(query));
		return mapFollowingPage(response);
	}

	public async followUser(params: Domain.FollowUserParams): Promise<Domain.RelationshipStatus> {
		const response = await this.apiClient.followUser({ userId: params.userId });
		return mapFollowRelationship(response);
	}

	public async unfollowUser(params: Domain.UnfollowUserParams): Promise<void> {
		await this.apiClient.unfollowUser({ userId: params.userId });
	}
}
