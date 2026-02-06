import type { FeedItem, Notification } from '../../shared/models/index.js';

export type MeUpdatesTopic = 'notifications' | 'feed';

export type NotificationCreatedEvent = {
	type: 'notification.created';
	serverTime: string;
	notification: Notification;
};

export type FeedItemCreatedEvent = {
	type: 'feed.item.created';
	serverTime: string;
	item: FeedItem;
};

export type MeUpdateEvent = NotificationCreatedEvent | FeedItemCreatedEvent;

export type MeUpdatePage = {
	serverTime: string;
	events: MeUpdateEvent[];
	nextCursor: string;
};

export type ListMyUpdatesQuery = {
	topics?: MeUpdatesTopic[];
	sinceCursor?: string;
	waitSeconds?: number;
	limit?: number;
};

export type StreamMyLiveUpdatesQuery = {
	topics?: MeUpdatesTopic[];
};

export type StreamMyLiveUpdatesResponse = string;
