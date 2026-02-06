import type { VerifiedHubInclude, VerifiedHubItemType, VerifiedHubSectionType } from '../../shared/models/enums.js';
import type { VerifiedEventSummary, VerifiedTournamentPreview } from '../../events/models/events.js';

export type VerifiedHubSection = {
	sectionId: string;
	type: VerifiedHubSectionType;
	title: string;
	subtitle?: string;
	items?: VerifiedHubItem[];
};

export type VerifiedHubItem = {
	type: VerifiedHubItemType;
	event?: VerifiedEventSummary;
	tournament?: VerifiedTournamentPreview;
};

export type VerifiedHub = {
	serverTime: string;
	sections: VerifiedHubSection[];
};

export type GetVerifiedHubQuery = {
	include?: VerifiedHubInclude[];
};
