import { mapOptional } from '../gateway-mapping.js';
import { mapTournamentPreview } from '../tourney/tourney-mappers.js';
import type * as Api from '@rankup/api';
import type * as Events from '@rankup/rankup/domains/verified/events/contracts/types.js';
import type * as Hub from '@rankup/rankup/domains/verified/hub/contracts/types.js';

export function mapVerifiedBranding(branding: Api.VerifiedBranding): Events.VerifiedBranding {
	return {
		title: branding.title,
		subtitle: branding.subtitle,
		heroImageUrl: branding.heroImageUrl,
		themeKey: branding.themeKey,
		sponsorName: branding.sponsorName,
		sponsorLogoUrl: branding.sponsorLogoUrl,
		ctaLabel: branding.ctaLabel,
		disclaimer: branding.disclaimer,
	};
}

export function mapVerifiedEligibility(eligibility: Api.VerifiedEligibility): Events.VerifiedEligibility {
	return {
		verified: eligibility.verified,
		eloEnabled: eligibility.eloEnabled,
		achievementsEnabled: eligibility.achievementsEnabled,
		minAccountAgeDays: eligibility.minAccountAgeDays,
		minLevel: eligibility.minLevel,
		regionAllowList: eligibility.regionAllowList,
		ageGate: eligibility.ageGate
			? {
				minimumAge: eligibility.ageGate.minimumAge,
				required: eligibility.ageGate.required,
			}
			: undefined,
	};
}

export function mapVerifiedEventSchedule(schedule: Api.VerifiedEventSchedule): Events.VerifiedEventSchedule {
	return {
		startsAt: schedule.startsAt,
		endsAt: schedule.endsAt,
		joinOpensAt: schedule.joinOpensAt,
		joinClosesAt: schedule.joinClosesAt,
	};
}

export function mapVerifiedJoinInfo(info: Api.VerifiedJoinInfo): Events.VerifiedJoinInfo {
	return {
		joinOpensAt: info.joinOpensAt,
		joinClosesAt: info.joinClosesAt,
		capacity: info.capacity,
		currentPlayers: info.currentPlayers,
		joinMethod: info.joinMethod,
		requiresAccount: info.requiresAccount,
		eligibilitySummary: info.eligibilitySummary,
	};
}

export function mapVerifiedTournamentPreview(preview: Api.VerifiedTournamentPreview): Events.VerifiedTournamentPreview {
	const base = mapTournamentPreview(preview);
	return {
		tournamentId: base.tournamentId,
		name: base.name,
		description: base.description,
		heroImageUrl: base.heroImageUrl,
		organizer: base.organizer,
		visibility: base.visibility,
		verificationStatus: base.verificationStatus,
		isRankedEligible: base.isRankedEligible,
		sportId: base.sportId,
		gameModeId: base.gameModeId,
		formatId: base.formatId,
		modality: base.modality,
		status: base.status,
		timing: base.timing,
		joinPolicy: base.joinPolicy,
		memberCount: base.memberCount,
		rewardSummary: base.rewardSummary,
		verified: preview.verified,
		verifiedEventId: preview.verifiedEventId,
		branding: mapOptional(preview.branding, mapVerifiedBranding),
		eligibility: mapOptional(preview.eligibility, mapVerifiedEligibility),
		joinInfo: mapOptional(preview.joinInfo, mapVerifiedJoinInfo),
	};
}

export function mapVerifiedTournamentSummary(summary: Api.VerifiedTournamentSummary): Events.VerifiedTournamentSummary {
	return {
		tournament: mapVerifiedTournamentPreview(summary.tournament),
		status: summary.status,
	};
}

export function mapVerifiedTournamentPage(page: Api.VerifiedTournamentPage): Events.VerifiedTournamentPage {
	return {
		items: page.items.map(mapVerifiedTournamentSummary),
		nextCursor: page.nextCursor,
	};
}

export function mapVerifiedEventSummary(summary: Api.VerifiedEventSummary): Events.VerifiedEventSummary {
	return {
		eventId: summary.eventId,
		status: summary.status,
		branding: mapVerifiedBranding(summary.branding),
		schedule: mapOptional(summary.schedule, mapVerifiedEventSchedule),
		sportId: summary.sportId,
		gameModeId: summary.gameModeId,
	};
}

export function mapVerifiedEventPage(page: Api.VerifiedEventPage): Events.VerifiedEventPage {
	return {
		items: page.items.map(mapVerifiedEventSummary),
		nextCursor: page.nextCursor,
	};
}

export function mapVerifiedEvent(event: Api.VerifiedEvent): Events.VerifiedEvent {
	return {
		eventId: event.eventId,
		status: event.status,
		branding: mapVerifiedBranding(event.branding),
		eligibility: mapOptional(event.eligibility, mapVerifiedEligibility),
		schedule: mapOptional(event.schedule, mapVerifiedEventSchedule),
		sportId: event.sportId,
		gameModeId: event.gameModeId,
		description: event.description,
		tournaments: event.tournaments?.map(mapVerifiedTournamentPreview),
		tags: event.tags,
	};
}

export function mapVerifiedHubItem(item: Api.VerifiedHubItem): Hub.VerifiedHubItem {
	return {
		type: item.type,
		event: item.event ? mapVerifiedEventSummary(item.event) : undefined,
		tournament: item.tournament ? mapVerifiedTournamentPreview(item.tournament) : undefined,
	};
}

export function mapVerifiedHubSection(section: Api.VerifiedHubSection): Hub.VerifiedHubSection {
	return {
		sectionId: section.sectionId,
		type: section.type,
		title: section.title,
		subtitle: section.subtitle,
		items: section.items?.map(mapVerifiedHubItem),
	};
}

export function mapVerifiedHub(hub: Api.VerifiedHub): Hub.VerifiedHub {
	return {
		serverTime: hub.serverTime,
		sections: hub.sections.map(mapVerifiedHubSection),
	};
}
