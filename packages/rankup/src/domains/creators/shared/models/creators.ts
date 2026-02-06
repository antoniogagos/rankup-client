import type { GameModeId, SportId } from '../../../tournaments/shared/models/ids.js';
import type { VerifiedEventSummary, VerifiedTournamentPreview } from '../../../verified/events/models/events.js';
import type { CreatorCatalogItemType, CreatorLinkType, CreatorType } from './enums.js';
import type { CreatorHandle, CreatorId } from './ids.js';

export type CreatorLink = {
	type: CreatorLinkType;
	url: string;
	label?: string;
};

export type CreatorStats = {
	followerCount?: number;
	activeEventsCount?: number;
	activeTournamentsCount?: number;
	joinedLast24h?: number;
};

export type CreatorBranding = {
	displayName?: string;
	avatarUrl?: string;
	heroImageUrl?: string;
	themeKey?: string;
	accentColor?: string;
};

export type CreatorSummary = {
	creatorId: CreatorId;
	handle: CreatorHandle;
	verified: boolean;
	branding: CreatorBranding;
	type?: CreatorType;
	shortDescription?: string;
	supportedSportIds?: SportId[];
	supportedGameModeIds?: GameModeId[];
	stats?: CreatorStats;
};

export type CreatorCatalogItem = {
	type: CreatorCatalogItemType;
	event?: VerifiedEventSummary;
	tournament?: VerifiedTournamentPreview;
};

export type CreatorCatalogSummary = {
	featuredEvent?: VerifiedEventSummary;
	featuredTournament?: VerifiedTournamentPreview;
	upcoming?: CreatorCatalogItem[];
};
