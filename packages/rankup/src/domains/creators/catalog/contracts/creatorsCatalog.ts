import type { CreatorCollection, CreatorCollectionPage, CreatorEventPage, CreatorHub, CreatorTournamentPage, GetCreatorCollectionParams, GetCreatorCollectionQuery, GetCreatorHubParams, GetCreatorHubQuery, ListCreatorCollectionsParams, ListCreatorCollectionsQuery, ListCreatorEventsParams, ListCreatorEventsQuery, ListCreatorTournamentsParams, ListCreatorTournamentsQuery } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ICreatorsCatalogService {
	getCreatorHub(params: GetCreatorHubParams, query?: GetCreatorHubQuery): Promise<CreatorHub>;
	listCreatorEvents(params: ListCreatorEventsParams, query?: ListCreatorEventsQuery): Promise<CreatorEventPage>;
	listCreatorTournaments(params: ListCreatorTournamentsParams, query?: ListCreatorTournamentsQuery): Promise<CreatorTournamentPage>;
	listCreatorCollections(params: ListCreatorCollectionsParams, query?: ListCreatorCollectionsQuery): Promise<CreatorCollectionPage>;
	getCreatorCollection(params: GetCreatorCollectionParams, query?: GetCreatorCollectionQuery): Promise<CreatorCollection>;
}

export const ICreatorsCatalogService = createDecorator<ICreatorsCatalogService>('creatorsCatalogService');
