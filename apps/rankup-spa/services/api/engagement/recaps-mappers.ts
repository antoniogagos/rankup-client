import { defineSharedKeys, mapOptional, pickFields } from '../gateway-mapping.js';
import type * as Api from '@rankup/api';
import type * as Domain from '@rankup/rankup/domains/engagement/recaps/contracts/types.js';

const recapContextKeys = defineSharedKeys<Domain.RecapContext, Api.RecapContext>()([
	'tournamentId',
	'matchday',
	'gameModeId',
	'sportId',
	'tournamentName',
]);
const recapShareKeys = defineSharedKeys<Domain.RecapShare, Api.RecapShare>()([
	'deepLinkUrl',
	'shareText',
	'shareImageUrl',
	'shareVideoUrl',
	'expiresAt',
]);
const recapCardKeys = defineSharedKeys<Domain.RecapCard, Api.RecapCard>()([
	'cardId',
	'type',
	'title',
	'subtitle',
	'value',
	'valueLabel',
	'imageUrl',
	'payload',
]);
const recapSummaryKeys = defineSharedKeys<Domain.RecapSummary, Api.RecapSummary>()([
	'recapId',
	'type',
	'status',
	'scope',
	'title',
	'createdAt',
	'availableAt',
	'retryAfterSeconds',
	'hiddenAt',
]);

export const mapRecapContext = (context: Api.RecapContext): Domain.RecapContext => pickFields(context, recapContextKeys);

export const mapRecapShare = (share: Api.RecapShare): Domain.RecapShare => pickFields(share, recapShareKeys);

export const mapRecapCard = (card: Api.RecapCard): Domain.RecapCard => pickFields(card, recapCardKeys);

export const mapRecapSummary = (summary: Api.RecapSummary): Domain.RecapSummary => ({
	...pickFields(summary, recapSummaryKeys),
	context: mapRecapContext(summary.context),
});

export const mapRecap = (recap: Api.Recap): Domain.Recap => ({
	...mapRecapSummary(recap),
	view: recap.view,
	cards: recap.cards.map(mapRecapCard),
	share: mapOptional(recap.share, mapRecapShare),
});

export const mapRecapSummaryPage = (page: Api.RecapSummaryPage): Domain.RecapSummaryPage => ({
	items: page.items.map(mapRecapSummary),
	nextCursor: page.nextCursor,
});
