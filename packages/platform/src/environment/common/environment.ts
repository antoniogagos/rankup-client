import { createDecorator } from '../../instantiation/common/decorators.js';

export interface IEnvironmentService {
	readonly isMockMode: boolean;
	readonly apiBaseUrl: string;
	readonly authBaseUrl: string;
}

export const IEnvironmentService = createDecorator<IEnvironmentService>('environmentService');
