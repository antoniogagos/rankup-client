import type { GameModeId, RecapId, SportId, TournamentId } from '../../shared/models/ids.js';
import type { RecapCard } from '../../shared/models/recap.js';

export type RecapType = 'tournamentFinal' | 'tournamentPeriodic' | 'matchday' | 'monthly' | 'seasonal';

export type RecapStatus = 'available' | 'generating' | 'failed';

export type RecapView = 'me' | 'global';

export type RecapSort = 'newest' | 'oldest' | 'typeThenNewest';

export type RecapScope = 'me' | 'tournament';

export type RecapContext = {
	tournamentId?: TournamentId;
	matchday?: number;
	gameModeId?: GameModeId;
	sportId?: SportId;
	tournamentName?: string;
};

export type RecapShare = {
	deepLinkUrl?: string;
	shareText?: string;
	shareImageUrl?: string;
	shareVideoUrl?: string;
	expiresAt?: string;
};

export type RecapSummary = {
	recapId: RecapId;
	type: RecapType;
	status: RecapStatus;
	scope: RecapScope;
	title?: string;
	context: RecapContext;
	createdAt: string;
	availableAt?: string;
	retryAfterSeconds?: number;
	hiddenAt?: string;
};

export type Recap = RecapSummary & {
	view?: RecapView;
	cards: RecapCard[];
	share?: RecapShare;
};

export type RecapSummaryPage = {
	items: RecapSummary[];
	nextCursor?: string;
};

export type CreateRecapRequest = {
	type: RecapType;
	context?: RecapContext;
	view?: RecapView;
	clientContext?: Record<string, unknown>;
};

export type ListMyRecapsQuery = {
	type?: RecapType;
	status?: RecapStatus;
	tournamentId?: TournamentId;
	includeHidden?: boolean;
	sort?: RecapSort;
	cursor?: string;
	pageSize?: number;
};

export type GetMyRecapParams = {
	recapId: RecapId;
};

export type HideMyRecapParams = {
	recapId: RecapId;
};

export type ListTournamentRecapsParams = {
	tournamentId: TournamentId;
};

export type ListTournamentRecapsQuery = {
	type?: RecapType;
	status?: RecapStatus;
	matchday?: number;
	cursor?: string;
	pageSize?: number;
};

export type GetTournamentRecapParams = {
	tournamentId: TournamentId;
	recapId: RecapId;
};

export type GetTournamentRecapQuery = {
	view?: RecapView;
};
