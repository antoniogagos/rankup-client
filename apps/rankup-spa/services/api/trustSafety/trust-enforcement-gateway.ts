import { mapEnforcementStatus } from './trust-mappers.js';
import type * as Api from '@rankup/api';
import type { ITrustEnforcementGateway } from '@rankup/rankup/domains/trustSafety/enforcement/contracts/trustEnforcementGateway.js';
import type * as Domain from '@rankup/rankup/domains/trustSafety/enforcement/contracts/types.js';

export class TrustEnforcementGateway implements ITrustEnforcementGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getMyEnforcementStatus(): Promise<Domain.EnforcementStatus> {
		const response = await this.apiClient.getMyEnforcementStatus();
		return mapEnforcementStatus(response);
	}
}
