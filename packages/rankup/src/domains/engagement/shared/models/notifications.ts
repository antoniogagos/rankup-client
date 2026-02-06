import type { MatchId, NotificationId, RecapId, TournamentId, UserId } from './ids.js';
import type { UserSummary } from './user.js';

export type NotificationTopic = 'match' | 'ranking' | 'tournament' | 'social' | 'chat' | 'recap' | 'achievement' | 'system';

export type NotificationType = string;

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export type NotificationActionHttp = {
	method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	body?: Record<string, unknown>;
};

export type NotificationAction = {
	actionId: string;
	label: string;
	deepLinkUrl?: string;
	http?: NotificationActionHttp;
};

export type NotificationContext = {
	tournamentId?: TournamentId;
	matchday?: number;
	matchId?: MatchId;
	competitionId?: string;
	recapId?: RecapId;
	inviteId?: string;
	friendRequestId?: string;
	actorUserId?: UserId;
};

export type Notification = {
	notificationId: NotificationId;
	topic: NotificationTopic;
	notificationType: NotificationType;
	priority?: NotificationPriority;
	title?: string;
	body?: string;
	deepLinkUrl?: string;
	actions?: NotificationAction[];
	actor?: UserSummary;
	context?: NotificationContext;
	payload?: Record<string, unknown>;
	createdAt: string;
	seenAt?: string;
	readAt?: string;
	dismissedAt?: string;
};
