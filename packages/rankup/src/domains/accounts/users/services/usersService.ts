import type { IUsersService } from '../contracts/users.js';
import type { IUsersGateway as UsersGateway } from '../contracts/usersGateway.js';
import { IUsersGateway } from '../contracts/usersGateway.js';
import type { GetUserPublicProfileParams, GetUserPublicProfileQuery, PublicUserProfile, ResolveUserByUsernameParams, SearchUsersQuery, UserDirectoryPage } from '../contracts/types.js';

export class UsersService implements IUsersService {
	public constructor(@IUsersGateway private readonly gateway: UsersGateway) {}

	public async searchUsers(query: SearchUsersQuery): Promise<UserDirectoryPage> {
		return this.gateway.searchUsers(query);
	}

	public async getUserPublicProfile(params: GetUserPublicProfileParams, query?: GetUserPublicProfileQuery): Promise<PublicUserProfile> {
		return this.gateway.getUserPublicProfile(params, query);
	}

	public async resolveUserByUsername(params: ResolveUserByUsernameParams): Promise<PublicUserProfile> {
		return this.gateway.resolveUserByUsername(params);
	}
}
