import type { GameModeId, SportId } from '../../../tournaments/shared/models/ids.js';
import type { CreatorCatalogSummary, CreatorLink, CreatorSummary } from '../../shared/models/creators.js';
import type { CreatorInclude, CreatorSort, CreatorType } from '../../shared/models/enums.js';
import type { CreatorId } from '../../shared/models/ids.js';

export type CreatorProfile = CreatorSummary & {
	longDescription?: string;
	links?: CreatorLink[];
	catalogSummary?: CreatorCatalogSummary;
	primaryUserId?: string;
};

export type CreatorPage = {
	items: CreatorSummary[];
	nextCursor?: string;
};

export type ListCreatorsQuery = {
	q?: string;
	featuredOnly?: boolean;
	type?: CreatorType;
	sportId?: SportId;
	gameModeId?: GameModeId;
	locale?: string;
	include?: CreatorInclude[];
	sort?: CreatorSort;
	cursor?: string;
	pageSize?: number;
};

export type GetCreatorParams = {
	creatorId: CreatorId;
};

export type GetCreatorQuery = {
	include?: CreatorInclude[];
};
