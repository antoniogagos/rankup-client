import type { ILiveService } from '../contracts/live.js';
import type { ILiveGateway as LiveGateway } from '../contracts/liveGateway.js';
import { ILiveGateway } from '../contracts/liveGateway.js';
import type { FeedItem, FeedPage, FeedReadCursor, GetMyFeedItemParams, GetMyNotificationParams, GetMyNotificationQuery, GetMyNotificationUnreadCountQuery, ListMyFeedQuery, ListMyNotificationsQuery, MarkMyNotificationReadParams, MarkMyNotificationSeenParams, DismissMyNotificationParams, Notification, NotificationBatchActionRequest, NotificationBatchActionResult, NotificationPage, NotificationUnreadCounts, UpdateFeedReadCursorRequest } from '../contracts/types.js';

export class LiveService implements ILiveService {
	public constructor(@ILiveGateway private readonly gateway: LiveGateway) {}

	public async listMyNotifications(query?: ListMyNotificationsQuery): Promise<NotificationPage> {
		return this.gateway.listMyNotifications(query);
	}

	public async getMyNotification(params: GetMyNotificationParams, query?: GetMyNotificationQuery): Promise<Notification> {
		return this.gateway.getMyNotification(params, query);
	}

	public async getMyNotificationUnreadCount(query?: GetMyNotificationUnreadCountQuery): Promise<NotificationUnreadCounts> {
		return this.gateway.getMyNotificationUnreadCount(query);
	}

	public async markMyNotificationSeen(params: MarkMyNotificationSeenParams): Promise<void> {
		return this.gateway.markMyNotificationSeen(params);
	}

	public async markMyNotificationRead(params: MarkMyNotificationReadParams): Promise<void> {
		return this.gateway.markMyNotificationRead(params);
	}

	public async dismissMyNotification(params: DismissMyNotificationParams): Promise<void> {
		return this.gateway.dismissMyNotification(params);
	}

	public async batchUpdateMyNotifications(request: NotificationBatchActionRequest): Promise<NotificationBatchActionResult> {
		return this.gateway.batchUpdateMyNotifications(request);
	}

	public async listMyFeed(query?: ListMyFeedQuery): Promise<FeedPage> {
		return this.gateway.listMyFeed(query);
	}

	public async getMyFeedItem(params: GetMyFeedItemParams): Promise<FeedItem> {
		return this.gateway.getMyFeedItem(params);
	}

	public async getMyFeedReadCursor(): Promise<FeedReadCursor> {
		return this.gateway.getMyFeedReadCursor();
	}

	public async updateMyFeedReadCursor(request: UpdateFeedReadCursorRequest): Promise<FeedReadCursor> {
		return this.gateway.updateMyFeedReadCursor(request);
	}
}
