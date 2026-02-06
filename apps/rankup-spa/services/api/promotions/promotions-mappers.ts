import { mapOptional } from '../gateway-mapping.js';
import type * as Api from '@rankup/api';
import type * as Campaigns from '@rankup/rankup/domains/promotions/campaigns/contracts/types.js';
import type * as Rewards from '@rankup/rankup/domains/promotions/rewards/contracts/types.js';

type ApiPromotionAgeGate = NonNullable<Api.PromotionEligibility['ageGate']>;

type ApiPromotionWinnersPreview = NonNullable<Api.Promotion['winnersPreview']>;

type ApiRewardGrantLegal = NonNullable<Api.RewardGrant['legal']>;

type ApiRewardFulfillmentInput = NonNullable<Api.ClaimRewardRequest['fulfillment']>;

export function mapPromotionRewardDefinition(reward: Api.PromotionRewardDefinition): Campaigns.PromotionRewardDefinition {
	return {
		rewardId: reward.rewardId,
		type: reward.type,
		title: reward.title,
		description: reward.description,
		imageUrl: reward.imageUrl,
		quantity: reward.quantity,
		estimatedValueText: reward.estimatedValueText,
		fulfillmentMethod: reward.fulfillmentMethod,
	};
}

export function mapPromotionSchedule(schedule: Api.PromotionSchedule): Campaigns.PromotionSchedule {
	return {
		startsAt: schedule.startsAt,
		endsAt: schedule.endsAt,
		joinOpensAt: schedule.joinOpensAt,
		joinClosesAt: schedule.joinClosesAt,
	};
}

export function mapPromotionAgeGate(ageGate: ApiPromotionAgeGate): Campaigns.PromotionAgeGate {
	return {
		required: ageGate.required,
		minimumAge: ageGate.minimumAge,
	};
}

export function mapPromotionEligibility(eligibility: Api.PromotionEligibility): Campaigns.PromotionEligibility {
	return {
		verifiedOnly: eligibility.verifiedOnly,
		minAccountAgeDays: eligibility.minAccountAgeDays,
		minLevel: eligibility.minLevel,
		regionAllowList: eligibility.regionAllowList,
		ageGate: mapOptional(eligibility.ageGate, mapPromotionAgeGate),
		notes: eligibility.notes,
	};
}

export function mapPromotionLegal(legal: Api.PromotionLegal): Campaigns.PromotionLegal {
	return {
		termsVersion: legal.termsVersion,
		termsUrl: legal.termsUrl,
		disclaimer: legal.disclaimer,
		privacyNotes: legal.privacyNotes,
	};
}

export function mapPromotionMechanic(mechanic: Api.PromotionMechanic): Campaigns.PromotionMechanic {
	return {
		kind: mechanic.kind,
		summary: mechanic.summary,
		details: mechanic.details,
		parameters: mechanic.parameters,
	};
}

export function mapPromotionScope(scope: Api.PromotionScope): Campaigns.PromotionScope {
	return {
		scopeKind: scope.scopeKind,
		verifiedEventId: scope.verifiedEventId,
		tournamentId: scope.tournamentId,
		rankedTrackId: scope.rankedTrackId,
		rankedSeasonId: scope.rankedSeasonId,
		creatorId: scope.creatorId,
	};
}

export function mapPromotionWinnersPreview(preview: ApiPromotionWinnersPreview): Campaigns.PromotionWinnersPreview {
	return {
		published: preview.published,
		winnerCount: preview.winnerCount,
	};
}

export function mapPromotionMeState(state: Api.PromotionMeState): Campaigns.PromotionMeState {
	return {
		promotionId: state.promotionId,
		eligibilityStatus: state.eligibilityStatus,
		participationStatus: state.participationStatus,
		canOptIn: state.canOptIn,
		optedInAt: state.optedInAt,
		acceptedTermsVersion: state.acceptedTermsVersion,
		blockedReasons: state.blockedReasons,
		requiredActions: state.requiredActions,
		nextSteps: state.nextSteps,
	};
}

export function mapPromotionSummary(summary: Api.PromotionSummary): Campaigns.PromotionSummary {
	return {
		promotionId: summary.promotionId,
		status: summary.status,
		type: summary.type,
		title: summary.title,
		schedule: mapPromotionSchedule(summary.schedule),
		scope: mapPromotionScope(summary.scope),
		subtitle: summary.subtitle,
		heroImageUrl: summary.heroImageUrl,
		sportId: summary.sportId,
		gameModeId: summary.gameModeId,
		featured: summary.featured,
		rewardsPreview: mapOptional(summary.rewardsPreview, rewards => rewards.map(mapPromotionRewardDefinition)),
	};
}

export function mapPromotion(promotion: Api.Promotion): Campaigns.Promotion {
	return {
		promotionId: promotion.promotionId,
		status: promotion.status,
		type: promotion.type,
		title: promotion.title,
		schedule: mapPromotionSchedule(promotion.schedule),
		scope: mapPromotionScope(promotion.scope),
		subtitle: promotion.subtitle,
		heroImageUrl: promotion.heroImageUrl,
		sportId: promotion.sportId,
		gameModeId: promotion.gameModeId,
		featured: promotion.featured,
		rewardsPreview: mapOptional(promotion.rewardsPreview, rewards => rewards.map(mapPromotionRewardDefinition)),
		description: promotion.description,
		mechanics: mapOptional(promotion.mechanics, mechanics => mechanics.map(mapPromotionMechanic)),
		rewards: mapOptional(promotion.rewards, rewards => rewards.map(mapPromotionRewardDefinition)),
		eligibility: mapOptional(promotion.eligibility, mapPromotionEligibility),
		legal: mapOptional(promotion.legal, mapPromotionLegal),
		myStatus: mapOptional(promotion.myStatus, mapPromotionMeState),
		winnersPreview: mapOptional(promotion.winnersPreview, mapPromotionWinnersPreview),
	};
}

export function mapPromotionSummaryPage(page: Api.PromotionSummaryPage): Campaigns.PromotionSummaryPage {
	return {
		items: page.items.map(mapPromotionSummary),
		nextCursor: page.nextCursor,
	};
}

export function mapPromotionWinnerEntry(entry: Api.PromotionWinnerEntry): Campaigns.PromotionWinnerEntry {
	return {
		position: entry.position,
		displayName: entry.displayName,
		userId: entry.userId,
		reward: mapOptional(entry.reward, mapPromotionRewardDefinition),
		announcedAt: entry.announcedAt,
	};
}

export function mapPromotionWinnerPage(page: Api.PromotionWinnerPage): Campaigns.PromotionWinnerPage {
	return {
		published: page.published,
		items: page.items.map(mapPromotionWinnerEntry),
		nextCursor: page.nextCursor,
	};
}

export function mapMyPromotionEntry(entry: Api.MyPromotionEntry): Campaigns.MyPromotionEntry {
	return {
		promotion: mapPromotionSummary(entry.promotion),
		myStatus: mapPromotionMeState(entry.myStatus),
	};
}

export function mapMyPromotionPage(page: Api.MyPromotionPage): Campaigns.MyPromotionPage {
	return {
		items: page.items.map(mapMyPromotionEntry),
		nextCursor: page.nextCursor,
	};
}

export function mapRewardSource(source: Api.RewardSource): Rewards.RewardSource {
	return {
		promotionId: source.promotionId,
		verifiedEventId: source.verifiedEventId,
		tournamentId: source.tournamentId,
		rankedTrackId: source.rankedTrackId,
		rankedSeasonId: source.rankedSeasonId,
	};
}

export function mapRewardDelivery(delivery: Api.RewardDelivery): Rewards.RewardDelivery {
	return {
		method: delivery.method,
		status: delivery.status,
		emailSentTo: delivery.emailSentTo,
		shippedToCountry: delivery.shippedToCountry,
		carrier: delivery.carrier,
		trackingUrl: delivery.trackingUrl,
		lastUpdatedAt: delivery.lastUpdatedAt,
		failureReason: delivery.failureReason,
	};
}

export function mapRewardGrantLegal(legal: ApiRewardGrantLegal): Rewards.RewardGrantLegal {
	return {
		termsVersion: legal.termsVersion,
		termsUrl: legal.termsUrl,
	};
}

export function mapRewardGrant(grant: Api.RewardGrant): Rewards.RewardGrant {
	return {
		rewardGrantId: grant.rewardGrantId,
		status: grant.status,
		reward: mapPromotionRewardDefinition(grant.reward),
		source: mapOptional(grant.source, mapRewardSource),
		claimDeadlineAt: grant.claimDeadlineAt,
		claimedAt: grant.claimedAt,
		deliveredAt: grant.deliveredAt,
		legal: mapOptional(grant.legal, mapRewardGrantLegal),
		delivery: mapOptional(grant.delivery, mapRewardDelivery),
	};
}

export function mapRewardGrantPage(page: Api.RewardGrantPage): Rewards.RewardGrantPage {
	return {
		items: page.items.map(mapRewardGrant),
		nextCursor: page.nextCursor,
	};
}

export function mapShippingAddress(address: Api.ShippingAddress): Rewards.ShippingAddress {
	return {
		fullName: address.fullName,
		line1: address.line1,
		line2: address.line2,
		city: address.city,
		region: address.region,
		postalCode: address.postalCode,
		country: address.country,
		phone: address.phone,
	};
}

export function mapRewardFulfillmentProfile(profile: Api.RewardFulfillmentProfile): Rewards.RewardFulfillmentProfile {
	return {
		defaultEmail: profile.defaultEmail,
		shippingAddress: mapOptional(profile.shippingAddress, mapShippingAddress),
		updatedAt: profile.updatedAt,
	};
}

export function mapPromotionOptInRequest(body: Campaigns.PromotionOptInRequest): Api.PromotionOptInRequest {
	return {
		termsVersion: body.termsVersion,
		consentToPublicWinnerDisplay: body.consentToPublicWinnerDisplay,
	};
}

export function mapShippingAddressRequest(address: Rewards.ShippingAddress): Api.ShippingAddress {
	return {
		fullName: address.fullName,
		line1: address.line1,
		line2: address.line2,
		city: address.city,
		region: address.region,
		postalCode: address.postalCode,
		country: address.country,
		phone: address.phone,
	};
}

export function mapRewardFulfillmentInput(fulfillment: Rewards.RewardFulfillmentInput): ApiRewardFulfillmentInput {
	return {
		email: fulfillment.email,
		shippingAddress: mapOptional(fulfillment.shippingAddress, mapShippingAddressRequest),
	};
}

export function mapClaimRewardRequest(body: Rewards.ClaimRewardRequest): Api.ClaimRewardRequest {
	return {
		termsVersion: body.termsVersion,
		fulfillment: mapOptional(body.fulfillment, mapRewardFulfillmentInput),
		saveToProfile: body.saveToProfile,
	};
}

export function mapUpdateRewardFulfillmentProfileRequest(
	body: Rewards.UpdateRewardFulfillmentProfileRequest,
): Api.UpdateRewardFulfillmentProfileRequest {
	return {
		defaultEmail: body.defaultEmail,
		shippingAddress: mapOptional(body.shippingAddress, mapShippingAddressRequest),
	};
}
