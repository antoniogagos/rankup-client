import { mapFeedItem, mapNotification } from './live-mappers.js';
import type * as Api from '@rankup/api';
import type * as Domain from '@rankup/rankup/domains/engagement/updates/contracts/types.js';

const isNotificationCreatedEvent = (event: Api.MeUpdateEvent): event is Api.NotificationCreatedEvent =>
	event.type === 'notification.created';

export const mapMeUpdateEvent = (event: Api.MeUpdateEvent): Domain.MeUpdateEvent => {
	if (isNotificationCreatedEvent(event)) {
		return {
			type: event.type,
			serverTime: event.serverTime,
			notification: mapNotification(event.notification),
		};
	}
	return {
		type: event.type,
		serverTime: event.serverTime,
		item: mapFeedItem(event.item),
	};
};

export const mapMeUpdatePage = (page: Api.MeUpdatePage): Domain.MeUpdatePage => ({
	serverTime: page.serverTime,
	events: page.events.map(mapMeUpdateEvent),
	nextCursor: page.nextCursor,
});
