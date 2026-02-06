import type { DismissMyNotificationParams, FeedItem, FeedPage, FeedReadCursor, GetMyFeedItemParams, GetMyNotificationParams, GetMyNotificationQuery, GetMyNotificationUnreadCountQuery, ListMyFeedQuery, ListMyNotificationsQuery, MarkMyNotificationReadParams, MarkMyNotificationSeenParams, Notification, NotificationBatchActionRequest, NotificationBatchActionResult, NotificationPage, NotificationUnreadCounts, UpdateFeedReadCursorRequest } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ILiveGateway {
	listMyNotifications(query?: ListMyNotificationsQuery): Promise<NotificationPage>;
	getMyNotification(params: GetMyNotificationParams, query?: GetMyNotificationQuery): Promise<Notification>;
	getMyNotificationUnreadCount(query?: GetMyNotificationUnreadCountQuery): Promise<NotificationUnreadCounts>;
	markMyNotificationSeen(params: MarkMyNotificationSeenParams): Promise<void>;
	markMyNotificationRead(params: MarkMyNotificationReadParams): Promise<void>;
	dismissMyNotification(params: DismissMyNotificationParams): Promise<void>;
	batchUpdateMyNotifications(request: NotificationBatchActionRequest): Promise<NotificationBatchActionResult>;
	listMyFeed(query?: ListMyFeedQuery): Promise<FeedPage>;
	getMyFeedItem(params: GetMyFeedItemParams): Promise<FeedItem>;
	getMyFeedReadCursor(): Promise<FeedReadCursor>;
	updateMyFeedReadCursor(request: UpdateFeedReadCursorRequest): Promise<FeedReadCursor>;
}

export const ILiveGateway = createDecorator<ILiveGateway>('liveGateway');
