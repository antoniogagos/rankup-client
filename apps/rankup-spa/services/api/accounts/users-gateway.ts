import { mapPublicUserProfile, mapUserDirectoryPage } from './accounts-mappers.js';
import type * as Api from '@rankup/api';
import type { IUsersGateway } from '@rankup/rankup/domains/accounts/users/contracts/usersGateway.js';
import type * as Domain from '@rankup/rankup/domains/accounts/users/contracts/types.js';

export const operationOwners = {
	getUserPublicHistory: 'api.accounts.users.getUserPublicHistory',
	getUserPublicProfile: 'api.accounts.users.getUserPublicProfile',
	resolveUserByUsername: 'api.accounts.users.resolveUserByUsername',
	searchUsers: 'api.accounts.users.searchUsers',
} as const;

const mapSearchUsersQuery = (query: Domain.SearchUsersQuery): Api.SearchUsersQuery => ({
	q: query.q,
	match: query.match,
	cursor: query.cursor,
	pageSize: query.pageSize,
});

const mapGetUserProfileQuery = (query?: Domain.GetUserPublicProfileQuery): Api.GetUserQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class UsersGateway implements IUsersGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async searchUsers(query: Domain.SearchUsersQuery): Promise<Domain.UserDirectoryPage> {
		const response = await this.apiClient.searchUsers(mapSearchUsersQuery(query));
		return mapUserDirectoryPage(response);
	}

	public async getUserPublicProfile(
		params: Domain.GetUserPublicProfileParams,
		query?: Domain.GetUserPublicProfileQuery,
	): Promise<Domain.PublicUserProfile> {
		const response = await this.apiClient.getUser({ userId: params.userId }, mapGetUserProfileQuery(query));
		return mapPublicUserProfile(response);
	}

	public async resolveUserByUsername(params: Domain.ResolveUserByUsernameParams): Promise<Domain.PublicUserProfile> {
		const response = await this.apiClient.resolveUserByUsername({ username: params.username });
		return mapPublicUserProfile(response);
	}
}
