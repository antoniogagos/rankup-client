export type CreatorType = 'influencer' | 'brand' | 'media' | 'club' | 'league' | 'community';

export type CreatorInclude = 'stats' | 'links' | 'catalogSummary' | 'branding';

export type CreatorSort = 'featured' | 'popular' | 'newest' | 'nameAsc';

export type CreatorCatalogSort = 'featured' | 'newest' | 'startTimeAsc' | 'startTimeDesc' | 'popular';

export type CreatorTournamentInclude = 'branding' | 'eligibility' | 'joinInfo';

export type CreatorHubInclude = 'sections' | 'previews';

export type CreatorLinkType = 'youtube' | 'twitch' | 'tiktok' | 'instagram' | 'x' | 'discord' | 'website';

export type CreatorCatalogItemType = 'event' | 'tournament';

export type CreatorHubSectionType = 'hero' | 'featured' | 'recommended' | 'upcoming' | 'collections';

export type CreatorCollectionInclude = 'items';

export type CreatorCollectionSort = 'featured' | 'newest' | 'nameAsc';
