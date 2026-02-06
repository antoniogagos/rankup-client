import type { ICreatorsCatalogService } from '../contracts/creatorsCatalog.js';
import type { ICreatorsCatalogGateway as CreatorsCatalogGateway } from '../contracts/creatorsCatalogGateway.js';
import { ICreatorsCatalogGateway } from '../contracts/creatorsCatalogGateway.js';
import type { CreatorCollection, CreatorCollectionPage, CreatorEventPage, CreatorHub, CreatorTournamentPage, GetCreatorCollectionParams, GetCreatorCollectionQuery, GetCreatorHubParams, GetCreatorHubQuery, ListCreatorCollectionsParams, ListCreatorCollectionsQuery, ListCreatorEventsParams, ListCreatorEventsQuery, ListCreatorTournamentsParams, ListCreatorTournamentsQuery } from '../contracts/types.js';

export class CreatorsCatalogService implements ICreatorsCatalogService {
	public constructor(@ICreatorsCatalogGateway private readonly gateway: CreatorsCatalogGateway) {}

	public async getCreatorHub(params: GetCreatorHubParams, query?: GetCreatorHubQuery): Promise<CreatorHub> {
		return this.gateway.getCreatorHub(params, query);
	}

	public async listCreatorEvents(
		params: ListCreatorEventsParams,
		query?: ListCreatorEventsQuery,
	): Promise<CreatorEventPage> {
		return this.gateway.listCreatorEvents(params, query);
	}

	public async listCreatorTournaments(
		params: ListCreatorTournamentsParams,
		query?: ListCreatorTournamentsQuery,
	): Promise<CreatorTournamentPage> {
		return this.gateway.listCreatorTournaments(params, query);
	}

	public async listCreatorCollections(
		params: ListCreatorCollectionsParams,
		query?: ListCreatorCollectionsQuery,
	): Promise<CreatorCollectionPage> {
		return this.gateway.listCreatorCollections(params, query);
	}

	public async getCreatorCollection(
		params: GetCreatorCollectionParams,
		query?: GetCreatorCollectionQuery,
	): Promise<CreatorCollection> {
		return this.gateway.getCreatorCollection(params, query);
	}
}
