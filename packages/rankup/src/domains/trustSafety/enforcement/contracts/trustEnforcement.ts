import type { EnforcementStatus } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITrustEnforcementService {
	getMyEnforcementStatus(): Promise<EnforcementStatus>;
}

export const ITrustEnforcementService = createDecorator<ITrustEnforcementService>('trustEnforcementService');
