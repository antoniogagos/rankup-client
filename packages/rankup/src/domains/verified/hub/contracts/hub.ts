import type { GetVerifiedHubQuery, VerifiedHub } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IVerifiedHubService {
	getVerifiedHub(query?: GetVerifiedHubQuery): Promise<VerifiedHub>;
}

export const IVerifiedHubService = createDecorator<IVerifiedHubService>('verifiedHubService');
