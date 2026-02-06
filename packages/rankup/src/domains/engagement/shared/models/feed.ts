import type { FeedItemId, MatchId, RecapId, TournamentId, UserId } from './ids.js';
import type { UserSummary } from './user.js';

export type FeedTopic = 'match' | 'ranking' | 'tournament' | 'social' | 'recap' | 'achievement' | 'system';

export type FeedItemType = string;

export type FeedContext = {
	tournamentId?: TournamentId;
	matchday?: number;
	matchId?: MatchId;
	recapId?: RecapId;
	actorUserId?: UserId;
};

export type FeedItem = {
	feedItemId: FeedItemId;
	topic: FeedTopic;
	feedItemType: FeedItemType;
	title?: string;
	body?: string;
	deepLinkUrl?: string;
	actor?: UserSummary;
	context?: FeedContext;
	payload?: Record<string, unknown>;
	createdAt: string;
};
