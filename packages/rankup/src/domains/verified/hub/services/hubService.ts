import type { IVerifiedHubService } from '../contracts/hub.js';
import type { IVerifiedHubGateway as VerifiedHubGateway } from '../contracts/hubGateway.js';
import { IVerifiedHubGateway } from '../contracts/hubGateway.js';
import type { GetVerifiedHubQuery, VerifiedHub } from '../contracts/types.js';

export class VerifiedHubService implements IVerifiedHubService {
	public constructor(@IVerifiedHubGateway private readonly gateway: VerifiedHubGateway) {}

	public async getVerifiedHub(query?: GetVerifiedHubQuery): Promise<VerifiedHub> {
		return this.gateway.getVerifiedHub(query);
	}
}
