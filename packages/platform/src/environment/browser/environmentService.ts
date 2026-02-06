import type { IEnvironmentService } from '../common/environment.js';
import { apiURL, authConfig, isMockMode } from './env.js';

export class EnvironmentService implements IEnvironmentService {
	public readonly isMockMode = isMockMode;

	public readonly apiBaseUrl = apiURL ?? '';

	public readonly authBaseUrl = authConfig?.OAuthServerURL ?? '';
}
