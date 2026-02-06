import type { GetVerifiedHubQuery, VerifiedHub } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IVerifiedHubGateway {
	getVerifiedHub(query?: GetVerifiedHubQuery): Promise<VerifiedHub>;
}

export const IVerifiedHubGateway = createDecorator<IVerifiedHubGateway>('verifiedHubGateway');
