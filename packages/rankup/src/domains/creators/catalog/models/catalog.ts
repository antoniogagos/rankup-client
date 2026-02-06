import type { GameModeId, SportId } from '../../../tournaments/shared/models/ids.js';
import type { VerifiedEventInclude, VerifiedEventStatus, VerifiedTournamentStatus } from '../../../verified/shared/models/enums.js';
import type { VerifiedEventSummary, VerifiedTournamentPreview } from '../../../verified/events/models/events.js';
import type { CreatorCatalogItem, CreatorSummary } from '../../shared/models/creators.js';
import type { CreatorCatalogSort, CreatorCollectionInclude, CreatorCollectionSort, CreatorHubInclude, CreatorHubSectionType, CreatorTournamentInclude } from '../../shared/models/enums.js';
import type { CreatorCollectionId, CreatorId } from '../../shared/models/ids.js';

export type CreatorHubSection = {
	sectionId: string;
	type: CreatorHubSectionType;
	title: string;
	subtitle?: string;
	items?: CreatorCatalogItem[];
	collections?: CreatorCollectionSummary[];
};

export type CreatorHub = {
	creator: CreatorSummary;
	serverTime: string;
	sections: CreatorHubSection[];
};

export type CreatorEventPage = {
	items: VerifiedEventSummary[];
	nextCursor?: string;
};

export type CreatorTournamentPage = {
	items: VerifiedTournamentPreview[];
	nextCursor?: string;
};

export type CreatorCollectionSummary = {
	collectionId: CreatorCollectionId;
	title: string;
	subtitle?: string;
	heroImageUrl?: string;
	itemCount?: number;
};

export type CreatorCollection = CreatorCollectionSummary & {
	description?: string;
	items?: CreatorCatalogItem[];
};

export type CreatorCollectionPage = {
	items: CreatorCollectionSummary[];
	nextCursor?: string;
};

export type GetCreatorHubParams = {
	creatorId: CreatorId;
};

export type GetCreatorHubQuery = {
	include?: CreatorHubInclude[];
};

export type ListCreatorEventsParams = {
	creatorId: CreatorId;
};

export type ListCreatorEventsQuery = {
	status?: VerifiedEventStatus;
	sportId?: SportId;
	gameModeId?: GameModeId;
	include?: VerifiedEventInclude[];
	sort?: CreatorCatalogSort;
	cursor?: string;
	pageSize?: number;
};

export type ListCreatorTournamentsParams = {
	creatorId: CreatorId;
};

export type ListCreatorTournamentsQuery = {
	status?: VerifiedTournamentStatus;
	sportId?: SportId;
	gameModeId?: GameModeId;
	include?: CreatorTournamentInclude[];
	sort?: CreatorCatalogSort;
	cursor?: string;
	pageSize?: number;
};

export type ListCreatorCollectionsParams = {
	creatorId: CreatorId;
};

export type ListCreatorCollectionsQuery = {
	include?: CreatorCollectionInclude[];
	sort?: CreatorCollectionSort;
	cursor?: string;
	pageSize?: number;
};

export type GetCreatorCollectionParams = {
	creatorId: CreatorId;
	collectionId: CreatorCollectionId;
};

export type GetCreatorCollectionQuery = {
	include?: CreatorCollectionInclude[];
};
