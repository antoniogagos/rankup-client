import { defineSharedKeys, mapOptional, pickFields } from '../gateway-mapping.js';
import type * as Api from '@rankup/api';
import type * as Domain from '@rankup/rankup/domains/engagement/live/contracts/types.js';

const userSummaryKeys = defineSharedKeys<Domain.UserSummary, Api.MeSummary>()(['userId', 'username', 'pictureUrl']);
const notificationActionKeys = defineSharedKeys<Domain.NotificationAction, Api.NotificationAction>()([
	'actionId',
	'label',
	'deepLinkUrl',
]);
const notificationContextKeys = defineSharedKeys<Domain.NotificationContext, Api.NotificationContext>()([
	'tournamentId',
	'matchday',
	'matchId',
	'competitionId',
	'recapId',
	'inviteId',
	'friendRequestId',
	'actorUserId',
]);
const notificationKeys = defineSharedKeys<Domain.Notification, Api.Notification>()([
	'notificationId',
	'topic',
	'notificationType',
	'priority',
	'title',
	'body',
	'deepLinkUrl',
	'createdAt',
	'seenAt',
	'readAt',
	'dismissedAt',
]);
const notificationUnreadCountKeys = defineSharedKeys<Domain.NotificationUnreadCounts, Api.NotificationUnreadCounts>()(['total', 'byTopic']);
const notificationBatchActionResultKeys = defineSharedKeys<Domain.NotificationBatchActionResult, Api.NotificationBatchActionResult>()([
	'serverTime',
	'appliedIds',
	'notFoundIds',
]);
const feedContextKeys = defineSharedKeys<Domain.FeedContext, Api.FeedContext>()([
	'tournamentId',
	'matchday',
	'matchId',
	'recapId',
	'actorUserId',
]);
const feedItemKeys = defineSharedKeys<Domain.FeedItem, Api.FeedItem>()([
	'feedItemId',
	'topic',
	'feedItemType',
	'title',
	'body',
	'deepLinkUrl',
	'createdAt',
]);
const feedReadCursorKeys = defineSharedKeys<Domain.FeedReadCursor, Api.FeedReadCursor>()([
	'serverTime',
	'lastSeenAt',
	'lastSeenFeedItemId',
	'unreadCount',
]);

export const mapUserSummary = (user: Api.MeSummary): Domain.UserSummary => pickFields(user, userSummaryKeys);

const mapNotificationActionHttp = (http?: Api.NotificationAction['http']): Domain.NotificationActionHttp | undefined =>
	http?.method && http.path
		? {
			method: http.method,
			path: http.path,
			body: http.body,
		}
		: undefined;

export const mapNotificationAction = (action: Api.NotificationAction): Domain.NotificationAction => ({
	...pickFields(action, notificationActionKeys),
	http: mapNotificationActionHttp(action.http),
});

export const mapNotificationContext = (context: Api.NotificationContext): Domain.NotificationContext =>
	pickFields(context, notificationContextKeys);

export const mapNotification = (notification: Api.Notification): Domain.Notification => ({
	...pickFields(notification, notificationKeys),
	actions: notification.actions?.map(mapNotificationAction),
	actor: mapOptional(notification.actor, mapUserSummary),
	context: mapOptional(notification.context, mapNotificationContext),
	payload: notification.payload,
});

export const mapNotificationPage = (page: Api.NotificationPage): Domain.NotificationPage => ({
	serverTime: page.serverTime,
	items: page.items.map(mapNotification),
	nextCursor: page.nextCursor,
});

export const mapNotificationUnreadCounts = (counts: Api.NotificationUnreadCounts): Domain.NotificationUnreadCounts =>
	pickFields(counts, notificationUnreadCountKeys);

export const mapNotificationBatchActionResult = (result: Api.NotificationBatchActionResult): Domain.NotificationBatchActionResult => ({
	...pickFields(result, notificationBatchActionResultKeys),
	unreadCounts: mapOptional(result.unreadCounts, mapNotificationUnreadCounts),
});

export const mapFeedContext = (context: Api.FeedContext): Domain.FeedContext => pickFields(context, feedContextKeys);

export const mapFeedItem = (item: Api.FeedItem): Domain.FeedItem => ({
	...pickFields(item, feedItemKeys),
	actor: mapOptional(item.actor, mapUserSummary),
	context: mapOptional(item.context, mapFeedContext),
	payload: item.payload,
});

export const mapFeedPage = (page: Api.FeedPage): Domain.FeedPage => ({
	serverTime: page.serverTime,
	items: page.items.map(mapFeedItem),
	nextCursor: page.nextCursor,
	prevCursor: page.prevCursor,
});

export const mapFeedReadCursor = (cursor: Api.FeedReadCursor): Domain.FeedReadCursor => pickFields(cursor, feedReadCursorKeys);
