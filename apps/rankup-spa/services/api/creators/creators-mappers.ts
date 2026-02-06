import { mapOptional } from '../gateway-mapping.js';
import { mapVerifiedEventSummary, mapVerifiedTournamentPreview } from '../verified/verified-mappers.js';
import type * as Api from '@rankup/api';
import type * as Catalog from '@rankup/rankup/domains/creators/catalog/contracts/types.js';
import type * as Directory from '@rankup/rankup/domains/creators/directory/contracts/types.js';

export function mapCreatorLink(link: Api.CreatorLink): Directory.CreatorLink {
	return {
		type: link.type,
		url: link.url,
		label: link.label,
	};
}

export function mapCreatorStats(stats: Api.CreatorStats): Directory.CreatorStats {
	return {
		followerCount: stats.followerCount,
		activeEventsCount: stats.activeEventsCount,
		activeTournamentsCount: stats.activeTournamentsCount,
		joinedLast24h: stats.joinedLast24h,
	};
}

export function mapCreatorBranding(branding: Api.CreatorBranding): Directory.CreatorBranding {
	return {
		displayName: branding.displayName,
		avatarUrl: branding.avatarUrl,
		heroImageUrl: branding.heroImageUrl,
		themeKey: branding.themeKey,
		accentColor: branding.accentColor,
	};
}

export function mapCreatorSummary(summary: Api.CreatorSummary): Directory.CreatorSummary {
	return {
		creatorId: summary.creatorId,
		handle: summary.handle,
		verified: summary.verified,
		branding: mapCreatorBranding(summary.branding),
		type: summary.type,
		shortDescription: summary.shortDescription,
		supportedSportIds: summary.supportedSportIds,
		supportedGameModeIds: summary.supportedGameModeIds,
		stats: mapOptional(summary.stats, mapCreatorStats),
	};
}

export function mapCreatorCatalogItem(item: Api.CreatorCatalogItem): Catalog.CreatorCatalogItem {
	return {
		type: item.type,
		event: mapOptional(item.event, mapVerifiedEventSummary),
		tournament: mapOptional(item.tournament, mapVerifiedTournamentPreview),
	};
}

export function mapCreatorCatalogSummary(summary: Api.CreatorCatalogSummary): Catalog.CreatorCatalogSummary {
	return {
		featuredEvent: mapOptional(summary.featuredEvent, mapVerifiedEventSummary),
		featuredTournament: mapOptional(summary.featuredTournament, mapVerifiedTournamentPreview),
		upcoming: mapOptional(summary.upcoming, items => items.map(mapCreatorCatalogItem)),
	};
}

export function mapCreatorProfile(profile: Api.CreatorProfile): Directory.CreatorProfile {
	const base = mapCreatorSummary(profile);
	return {
		...base,
		longDescription: profile.longDescription,
		links: mapOptional(profile.links, links => links.map(mapCreatorLink)),
		catalogSummary: mapOptional(profile.catalogSummary, mapCreatorCatalogSummary),
		primaryUserId: profile.primaryUserId,
	};
}

export function mapCreatorPage(page: Api.CreatorPage): Directory.CreatorPage {
	return {
		items: page.items.map(mapCreatorSummary),
		nextCursor: page.nextCursor,
	};
}

export function mapCreatorCollectionSummary(summary: Api.CreatorCollectionSummary): Catalog.CreatorCollectionSummary {
	return {
		collectionId: summary.collectionId,
		title: summary.title,
		subtitle: summary.subtitle,
		heroImageUrl: summary.heroImageUrl,
		itemCount: summary.itemCount,
	};
}

export function mapCreatorCollection(collection: Api.CreatorCollection): Catalog.CreatorCollection {
	const base = mapCreatorCollectionSummary(collection);
	return {
		...base,
		description: collection.description,
		items: mapOptional(collection.items, items => items.map(mapCreatorCatalogItem)),
	};
}

export function mapCreatorCollectionPage(page: Api.CreatorCollectionPage): Catalog.CreatorCollectionPage {
	return {
		items: page.items.map(mapCreatorCollectionSummary),
		nextCursor: page.nextCursor,
	};
}

export function mapCreatorHubSection(section: Api.CreatorHubSection): Catalog.CreatorHubSection {
	return {
		sectionId: section.sectionId,
		type: section.type,
		title: section.title,
		subtitle: section.subtitle,
		items: mapOptional(section.items, items => items.map(mapCreatorCatalogItem)),
		collections: mapOptional(section.collections, collections => collections.map(mapCreatorCollectionSummary)),
	};
}

export function mapCreatorHub(hub: Api.CreatorHub): Catalog.CreatorHub {
	return {
		creator: mapCreatorSummary(hub.creator),
		serverTime: hub.serverTime,
		sections: hub.sections.map(mapCreatorHubSection),
	};
}

export function mapCreatorEventPage(page: Api.CreatorEventPage): Catalog.CreatorEventPage {
	return {
		items: page.items.map(mapVerifiedEventSummary),
		nextCursor: page.nextCursor,
	};
}

export function mapCreatorTournamentPage(page: Api.CreatorTournamentPage): Catalog.CreatorTournamentPage {
	return {
		items: page.items.map(mapVerifiedTournamentPreview),
		nextCursor: page.nextCursor,
	};
}
