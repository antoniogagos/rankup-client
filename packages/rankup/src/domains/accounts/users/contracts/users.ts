import type { GetUserPublicProfileParams, GetUserPublicProfileQuery, PublicUserProfile, ResolveUserByUsernameParams, SearchUsersQuery, UserDirectoryPage } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IUsersService {
	searchUsers(query: SearchUsersQuery): Promise<UserDirectoryPage>;
	getUserPublicProfile(params: GetUserPublicProfileParams, query?: GetUserPublicProfileQuery): Promise<PublicUserProfile>;
	resolveUserByUsername(params: ResolveUserByUsernameParams): Promise<PublicUserProfile>;
}

export const IUsersService = createDecorator<IUsersService>('usersService');
