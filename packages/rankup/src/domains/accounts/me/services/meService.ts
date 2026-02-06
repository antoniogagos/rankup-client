import type { IMeService } from '../contracts/me.js';
import type { IMeGateway as MeGateway } from '../contracts/meGateway.js';
import { IMeGateway } from '../contracts/meGateway.js';
import type { Me, UpdateMeRequest } from '../contracts/types.js';

export class MeService implements IMeService {
	public constructor(@IMeGateway private readonly gateway: MeGateway) {}

	public async getMe(): Promise<Me> {
		return this.gateway.getMe();
	}

	public async updateMe(request: UpdateMeRequest): Promise<Me> {
		return this.gateway.updateMe(request);
	}
}
