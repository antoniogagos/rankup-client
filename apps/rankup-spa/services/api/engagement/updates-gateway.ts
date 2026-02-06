import { mapMeUpdatePage } from './updates-mappers.js';
import type * as Api from '@rankup/api';
import type { IUpdatesGateway } from '@rankup/rankup/domains/engagement/updates/contracts/updatesGateway.js';
import type * as Domain from '@rankup/rankup/domains/engagement/updates/contracts/types.js';

export const operationOwners = {
	listMyUpdates: 'api.engagement.updates.listMyUpdates',
	listTournamentUpdates: 'api.engagement.updates.listTournamentUpdates',
	streamMyLiveUpdates: 'api.engagement.updates.streamMyLiveUpdates',
} as const;

const mapListMyUpdatesQuery = (query?: Domain.ListMyUpdatesQuery): Api.ListMyUpdatesQuery | undefined =>
	query
		? {
			topics: query.topics,
			sinceCursor: query.sinceCursor,
			waitSeconds: query.waitSeconds,
			limit: query.limit,
		}
		: undefined;

const mapStreamMyLiveUpdatesQuery = (query?: Domain.StreamMyLiveUpdatesQuery): Api.StreamMyLiveUpdatesQuery | undefined =>
	query
		? {
			topics: query.topics,
		}
		: undefined;

export class UpdatesGateway implements IUpdatesGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listMyUpdates(query?: Domain.ListMyUpdatesQuery): Promise<Domain.MeUpdatePage> {
		const response = await this.apiClient.listMyUpdates(mapListMyUpdatesQuery(query));
		return mapMeUpdatePage(response);
	}

	public async streamMyLiveUpdates(query?: Domain.StreamMyLiveUpdatesQuery): Promise<Domain.StreamMyLiveUpdatesResponse> {
		return this.apiClient.streamMyLiveUpdates(mapStreamMyLiveUpdatesQuery(query));
	}
}
