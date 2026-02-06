import { mapCreatorCollection, mapCreatorCollectionPage, mapCreatorEventPage, mapCreatorHub, mapCreatorTournamentPage } from './creators-mappers.js';
import type * as Api from '@rankup/api';
import type { ICreatorsCatalogGateway } from '@rankup/rankup/domains/creators/catalog/contracts/creatorsCatalogGateway.js';
import type * as Domain from '@rankup/rankup/domains/creators/catalog/contracts/types.js';

const mapGetCreatorHubQuery = (query?: Domain.GetCreatorHubQuery): Api.GetCreatorHubQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapListCreatorEventsQuery = (query?: Domain.ListCreatorEventsQuery): Api.ListCreatorEventsQuery | undefined =>
	query
		? {
			status: query.status,
			sportId: query.sportId,
			gameModeId: query.gameModeId,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapListCreatorTournamentsQuery = (query?: Domain.ListCreatorTournamentsQuery): Api.ListCreatorTournamentsQuery | undefined =>
	query
		? {
			status: query.status,
			sportId: query.sportId,
			gameModeId: query.gameModeId,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapListCreatorCollectionsQuery = (query?: Domain.ListCreatorCollectionsQuery): Api.ListCreatorCollectionsQuery | undefined =>
	query
		? {
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetCreatorCollectionQuery = (query?: Domain.GetCreatorCollectionQuery): Api.GetCreatorCollectionQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class CreatorsCatalogGateway implements ICreatorsCatalogGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getCreatorHub(params: Domain.GetCreatorHubParams, query?: Domain.GetCreatorHubQuery): Promise<Domain.CreatorHub> {
		const response = await this.apiClient.getCreatorHub({ creatorId: params.creatorId }, mapGetCreatorHubQuery(query));
		return mapCreatorHub(response);
	}

	public async listCreatorEvents(
		params: Domain.ListCreatorEventsParams,
		query?: Domain.ListCreatorEventsQuery,
	): Promise<Domain.CreatorEventPage> {
		const response = await this.apiClient.listCreatorEvents({ creatorId: params.creatorId }, mapListCreatorEventsQuery(query));
		return mapCreatorEventPage(response);
	}

	public async listCreatorTournaments(
		params: Domain.ListCreatorTournamentsParams,
		query?: Domain.ListCreatorTournamentsQuery,
	): Promise<Domain.CreatorTournamentPage> {
		const response = await this.apiClient.listCreatorTournaments(
			{ creatorId: params.creatorId },
			mapListCreatorTournamentsQuery(query),
		);
		return mapCreatorTournamentPage(response);
	}

	public async listCreatorCollections(
		params: Domain.ListCreatorCollectionsParams,
		query?: Domain.ListCreatorCollectionsQuery,
	): Promise<Domain.CreatorCollectionPage> {
		const response = await this.apiClient.listCreatorCollections(
			{ creatorId: params.creatorId },
			mapListCreatorCollectionsQuery(query),
		);
		return mapCreatorCollectionPage(response);
	}

	public async getCreatorCollection(
		params: Domain.GetCreatorCollectionParams,
		query?: Domain.GetCreatorCollectionQuery,
	): Promise<Domain.CreatorCollection> {
		const response = await this.apiClient.getCreatorCollection(
			{ creatorId: params.creatorId, collectionId: params.collectionId },
			mapGetCreatorCollectionQuery(query),
		);
		return mapCreatorCollection(response);
	}
}
