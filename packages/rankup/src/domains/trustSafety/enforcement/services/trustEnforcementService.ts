import type { ITrustEnforcementService } from '../contracts/trustEnforcement.js';
import type { ITrustEnforcementGateway as TrustEnforcementGateway } from '../contracts/trustEnforcementGateway.js';
import { ITrustEnforcementGateway } from '../contracts/trustEnforcementGateway.js';
import type { EnforcementStatus } from '../contracts/types.js';

export class TrustEnforcementService implements ITrustEnforcementService {
	public constructor(@ITrustEnforcementGateway private readonly gateway: TrustEnforcementGateway) {}

	public async getMyEnforcementStatus(): Promise<EnforcementStatus> {
		return this.gateway.getMyEnforcementStatus();
	}
}
