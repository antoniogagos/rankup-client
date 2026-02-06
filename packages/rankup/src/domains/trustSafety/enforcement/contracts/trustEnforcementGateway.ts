import type { EnforcementStatus } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITrustEnforcementGateway {
	getMyEnforcementStatus(): Promise<EnforcementStatus>;
}

export const ITrustEnforcementGateway = createDecorator<ITrustEnforcementGateway>('trustEnforcementGateway');
