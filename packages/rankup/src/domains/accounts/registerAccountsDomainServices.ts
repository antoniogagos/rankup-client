import { IAuthService } from './auth/contracts/auth.js';
import { AuthService } from './auth/services/authService.js';
import { IMeService } from './me/contracts/me.js';
import { MeService } from './me/services/meService.js';
import { ISocialService } from './social/contracts/social.js';
import { SocialService } from './social/services/socialService.js';
import { IUsersService } from './users/contracts/users.js';
import { UsersService } from './users/services/usersService.js';
import { SyncDescriptor } from '@rankup/platform/instantiation/common/descriptors.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';

export function registerAccountsDomainServices(services: ServiceCollection): void {
	services.set(IAuthService, new SyncDescriptor(AuthService));
	services.set(IMeService, new SyncDescriptor(MeService));
	services.set(IUsersService, new SyncDescriptor(UsersService));
	services.set(ISocialService, new SyncDescriptor(SocialService));
}
