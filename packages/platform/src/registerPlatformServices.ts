import type { IEnvironmentService } from './environment/common/environment.js';
import { IEnvironmentService as IEnvironmentServiceId } from './environment/common/environment.js';
import { ServiceCollection } from './instantiation/common/serviceCollection.js';
import type { ISessionManager } from './session/common/sessionManager.js';
import { ISessionManager as ISessionManagerId } from './session/common/sessionManager.js';

export type PlatformServiceInputs = {
	environmentService: IEnvironmentService;
	sessionManager: ISessionManager;
};

export function registerPlatformServices(services: ServiceCollection, inputs: PlatformServiceInputs): void {
	services.set(IEnvironmentServiceId, inputs.environmentService);
	services.set(ISessionManagerId, inputs.sessionManager);
}
