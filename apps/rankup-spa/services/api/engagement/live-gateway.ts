import { mapFeedItem, mapFeedPage, mapFeedReadCursor, mapNotification, mapNotificationBatchActionResult, mapNotificationPage, mapNotificationUnreadCounts } from './live-mappers.js';
import type * as Api from '@rankup/api';
import type { ILiveGateway } from '@rankup/rankup/domains/engagement/live/contracts/liveGateway.js';
import type * as Domain from '@rankup/rankup/domains/engagement/live/contracts/types.js';

export const operationOwners = {
	batchUpdateMyNotifications: 'api.engagement.live.batchUpdateMyNotifications',
	dismissMyNotification: 'api.engagement.live.dismissMyNotification',
	getMyFeedItem: 'api.engagement.live.getMyFeedItem',
	getMyFeedReadCursor: 'api.engagement.live.getMyFeedReadCursor',
	getMyNotification: 'api.engagement.live.getMyNotification',
	getMyNotificationUnreadCount: 'api.engagement.live.getMyNotificationUnreadCount',
	listMyFeed: 'api.engagement.live.listMyFeed',
	listMyNotifications: 'api.engagement.live.listMyNotifications',
	markMyNotificationRead: 'api.engagement.live.markMyNotificationRead',
	markMyNotificationSeen: 'api.engagement.live.markMyNotificationSeen',
	streamTournamentLive: 'api.engagement.live.streamTournamentLive',
	updateMyFeedReadCursor: 'api.engagement.live.updateMyFeedReadCursor',
} as const;

const mapListMyNotificationsQuery = (query?: Domain.ListMyNotificationsQuery): Api.ListMyNotificationsQuery | undefined =>
	query
		? {
			status: query.status,
			topics: query.topics,
			types: query.types,
			tournamentId: query.tournamentId,
			since: query.since,
			until: query.until,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetMyNotificationQuery = (query?: Domain.GetMyNotificationQuery): Api.GetMyNotificationQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapGetMyNotificationUnreadCountQuery = (
	query?: Domain.GetMyNotificationUnreadCountQuery,
): Api.GetMyNotificationUnreadCountQuery | undefined =>
	query
		? {
			topics: query.topics,
		}
		: undefined;

const mapNotificationBatchActionRequest = (
	request: Domain.NotificationBatchActionRequest,
): Api.BatchUpdateMyNotificationsRequest => ({
	action: request.action,
	notificationIds: request.notificationIds,
	untilCreatedAt: request.untilCreatedAt,
});

const mapListMyFeedQuery = (query?: Domain.ListMyFeedQuery): Api.ListMyFeedQuery | undefined =>
	query
		? {
			topics: query.topics,
			tournamentId: query.tournamentId,
			sinceCursor: query.sinceCursor,
			untilCursor: query.untilCursor,
			include: query.include,
			sort: query.sort,
			pageSize: query.pageSize,
		}
		: undefined;

const mapUpdateMyFeedReadCursorRequest = (request: Domain.UpdateFeedReadCursorRequest): Api.UpdateMyFeedReadCursorRequest => ({
	lastSeenAt: request.lastSeenAt,
	lastSeenFeedItemId: request.lastSeenFeedItemId,
});

export class LiveGateway implements ILiveGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listMyNotifications(query?: Domain.ListMyNotificationsQuery): Promise<Domain.NotificationPage> {
		const response = await this.apiClient.listMyNotifications(mapListMyNotificationsQuery(query));
		return mapNotificationPage(response);
	}

	public async getMyNotification(params: Domain.GetMyNotificationParams, query?: Domain.GetMyNotificationQuery): Promise<Domain.Notification> {
		const response = await this.apiClient.getMyNotification({ notificationId: params.notificationId }, mapGetMyNotificationQuery(query));
		return mapNotification(response);
	}

	public async getMyNotificationUnreadCount(query?: Domain.GetMyNotificationUnreadCountQuery): Promise<Domain.NotificationUnreadCounts> {
		const response = await this.apiClient.getMyNotificationUnreadCount(mapGetMyNotificationUnreadCountQuery(query));
		return mapNotificationUnreadCounts(response);
	}

	public async markMyNotificationSeen(params: Domain.MarkMyNotificationSeenParams): Promise<void> {
		await this.apiClient.markMyNotificationSeen({ notificationId: params.notificationId });
	}

	public async markMyNotificationRead(params: Domain.MarkMyNotificationReadParams): Promise<void> {
		await this.apiClient.markMyNotificationRead({ notificationId: params.notificationId });
	}

	public async dismissMyNotification(params: Domain.DismissMyNotificationParams): Promise<void> {
		await this.apiClient.dismissMyNotification({ notificationId: params.notificationId });
	}

	public async batchUpdateMyNotifications(request: Domain.NotificationBatchActionRequest): Promise<Domain.NotificationBatchActionResult> {
		const response = await this.apiClient.batchUpdateMyNotifications(mapNotificationBatchActionRequest(request));
		return mapNotificationBatchActionResult(response);
	}

	public async listMyFeed(query?: Domain.ListMyFeedQuery): Promise<Domain.FeedPage> {
		const response = await this.apiClient.listMyFeed(mapListMyFeedQuery(query));
		return mapFeedPage(response);
	}

	public async getMyFeedItem(params: Domain.GetMyFeedItemParams): Promise<Domain.FeedItem> {
		const response = await this.apiClient.getMyFeedItem({ feedItemId: params.feedItemId });
		return mapFeedItem(response);
	}

	public async getMyFeedReadCursor(): Promise<Domain.FeedReadCursor> {
		const response = await this.apiClient.getMyFeedReadCursor();
		return mapFeedReadCursor(response);
	}

	public async updateMyFeedReadCursor(request: Domain.UpdateFeedReadCursorRequest): Promise<Domain.FeedReadCursor> {
		const response = await this.apiClient.updateMyFeedReadCursor(mapUpdateMyFeedReadCursorRequest(request));
		return mapFeedReadCursor(response);
	}
}
