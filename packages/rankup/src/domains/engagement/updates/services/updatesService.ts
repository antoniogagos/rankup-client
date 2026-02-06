import type { IUpdatesService } from '../contracts/updates.js';
import type { IUpdatesGateway as UpdatesGateway } from '../contracts/updatesGateway.js';
import { IUpdatesGateway } from '../contracts/updatesGateway.js';
import type { ListMyUpdatesQuery, MeUpdatePage, StreamMyLiveUpdatesQuery, StreamMyLiveUpdatesResponse } from '../contracts/types.js';

export class UpdatesService implements IUpdatesService {
	public constructor(@IUpdatesGateway private readonly gateway: UpdatesGateway) {}

	public async listMyUpdates(query?: ListMyUpdatesQuery): Promise<MeUpdatePage> {
		return this.gateway.listMyUpdates(query);
	}

	public async streamMyLiveUpdates(query?: StreamMyLiveUpdatesQuery): Promise<StreamMyLiveUpdatesResponse> {
		return this.gateway.streamMyLiveUpdates(query);
	}
}
