import type { FeedItemId, NotificationId, TournamentId } from '../../shared/models/ids.js';
import type { FeedItem, FeedTopic, Notification, NotificationTopic, NotificationType } from '../../shared/models/index.js';

export type NotificationStatusFilter = 'any' | 'unread' | 'read' | 'dismissed';

export type NotificationInclude = 'payload';

export type NotificationSort = 'newest' | 'oldest';

export type FeedInclude = 'payload';

export type FeedSort = 'newest' | 'oldest';
export type NotificationPage = {
	serverTime: string;
	items: Notification[];
	nextCursor?: string;
};

export type NotificationUnreadCounts = {
	total: number;
	byTopic?: Record<string, number>;
};

export type NotificationBatchAction = 'markSeen' | 'markRead' | 'dismiss';

export type NotificationBatchActionRequest = {
	action: NotificationBatchAction;
	notificationIds?: NotificationId[];
	untilCreatedAt?: string;
};

export type NotificationBatchActionResult = {
	serverTime: string;
	appliedIds: NotificationId[];
	notFoundIds: NotificationId[];
	unreadCounts?: NotificationUnreadCounts;
};

export type FeedPage = {
	serverTime: string;
	items: FeedItem[];
	nextCursor?: string;
	prevCursor?: string;
};

export type FeedReadCursor = {
	serverTime: string;
	lastSeenAt: string;
	lastSeenFeedItemId?: FeedItemId;
	unreadCount: number;
};

export type UpdateFeedReadCursorRequest = {
	lastSeenAt: string;
	lastSeenFeedItemId?: FeedItemId;
};

export type ListMyNotificationsQuery = {
	status?: NotificationStatusFilter;
	topics?: NotificationTopic[];
	types?: NotificationType[];
	tournamentId?: TournamentId;
	since?: string;
	until?: string;
	include?: NotificationInclude[];
	sort?: NotificationSort;
	cursor?: string;
	pageSize?: number;
};

export type GetMyNotificationParams = {
	notificationId: NotificationId;
};

export type GetMyNotificationQuery = {
	include?: NotificationInclude[];
};

export type GetMyNotificationUnreadCountQuery = {
	topics?: NotificationTopic[];
};

export type MarkMyNotificationSeenParams = {
	notificationId: NotificationId;
};

export type MarkMyNotificationReadParams = {
	notificationId: NotificationId;
};

export type DismissMyNotificationParams = {
	notificationId: NotificationId;
};

export type ListMyFeedQuery = {
	topics?: FeedTopic[];
	tournamentId?: TournamentId;
	sinceCursor?: string;
	untilCursor?: string;
	include?: FeedInclude[];
	sort?: FeedSort;
	pageSize?: number;
};

export type GetMyFeedItemParams = {
	feedItemId: FeedItemId;
};
