import { defineSharedKeys, mapOptional, pickFields } from '../gateway-mapping.js';
import type * as Api from '@rankup/api';
import type * as Domain from '@rankup/rankup/domains/engagement/chat/contracts/types.js';

const userSummaryKeys = defineSharedKeys<Domain.UserSummary, Api.MeSummary>()(['userId', 'username', 'pictureUrl']);
const chatSettingsKeys = defineSharedKeys<Domain.TournamentChatSettings, Api.TournamentChatSettings>()([
	'enabled',
	'slowModeSeconds',
	'maxMessageLength',
	'allowLinks',
	'allowImages',
	'profanityFilterLevel',
]);
const chatStateKeys = defineSharedKeys<Domain.TournamentChatState, Api.TournamentChatState>()([
	'isMuted',
	'mutedUntil',
	'canSend',
	'cannotSendReason',
	'nextAllowedSendAt',
]);
const chatReactionKeys = defineSharedKeys<Domain.ChatReaction, Api.ChatReaction>()(['reactionId', 'count', 'meReacted']);
const chatReadCursorKeys = defineSharedKeys<Domain.ChatReadCursor, Api.ChatReadCursor>()([
	'tournamentId',
	'serverTime',
	'lastReadMessageId',
	'lastReadAt',
	'unreadCount',
]);
const chatMuteEntryKeys = defineSharedKeys<Domain.ChatMuteEntry, Api.ChatMuteEntry>()([
	'tournamentId',
	'mutedUntil',
	'status',
	'reason',
	'createdAt',
]);
const chatReportKeys = defineSharedKeys<Domain.ChatReport, Api.ChatReport>()([
	'reportId',
	'tournamentId',
	'reporterUserId',
	'messageId',
	'reportedUserId',
	'reason',
	'comment',
	'createdAt',
]);

export const mapUserSummary = (user: Api.MeSummary): Domain.UserSummary => pickFields(user, userSummaryKeys);

export const mapTournamentChatSettings = (settings: Api.TournamentChatSettings): Domain.TournamentChatSettings =>
	pickFields(settings, chatSettingsKeys);

export const mapTournamentChatState = (state: Api.TournamentChatState): Domain.TournamentChatState =>
	pickFields(state, chatStateKeys);

export const mapTournamentChat = (chat: Api.TournamentChat): Domain.TournamentChat => ({
	tournamentId: chat.tournamentId,
	serverTime: chat.serverTime,
	settings: mapTournamentChatSettings(chat.settings),
	myState: mapTournamentChatState(chat.myState),
	myPermissions: chat.myPermissions,
});

export const mapChatSystemEvent = (event: Api.ChatSystemEvent): Domain.ChatSystemEvent => ({
	type: event.type,
	user: mapOptional(event.user, mapUserSummary),
	matchday: event.matchday,
	payload: event.payload,
});

export const mapChatReaction = (reaction: Api.ChatReaction): Domain.ChatReaction => pickFields(reaction, chatReactionKeys);

export const mapChatMessage = (message: Api.ChatMessage): Domain.ChatMessage => ({
	messageId: message.messageId,
	tournamentId: message.tournamentId,
	type: message.type,
	sender: mapOptional(message.sender, mapUserSummary),
	text: message.text,
	systemEvent: mapOptional(message.systemEvent, mapChatSystemEvent),
	replyToMessageId: message.replyToMessageId,
	mentions: message.mentions,
	createdAt: message.createdAt,
	editedAt: message.editedAt,
	deletedAt: message.deletedAt,
	deletedBy: mapOptional(message.deletedBy, mapUserSummary),
	deleteReason: message.deleteReason,
	pinnedAt: message.pinnedAt,
	pinnedBy: mapOptional(message.pinnedBy, mapUserSummary),
	reactions: message.reactions?.map(mapChatReaction),
	clientMessageId: message.clientMessageId,
});

export const mapChatMessagePage = (page: Api.ChatMessagePage): Domain.ChatMessagePage => ({
	serverTime: page.serverTime,
	items: page.items.map(mapChatMessage),
	nextCursor: page.nextCursor,
});

export const mapChatReadCursor = (cursor: Api.ChatReadCursor): Domain.ChatReadCursor => pickFields(cursor, chatReadCursorKeys);

export const mapChatPinnedMessages = (pins: Api.ChatPinnedMessages): Domain.ChatPinnedMessages => ({
	items: pins.items.map(mapChatMessage),
});

export const mapChatMuteEntry = (entry: Api.ChatMuteEntry): Domain.ChatMuteEntry => ({
	...pickFields(entry, chatMuteEntryKeys),
	user: mapUserSummary(entry.user),
	createdBy: mapUserSummary(entry.createdBy),
});

export const mapChatMutePage = (page: Api.ChatMutePage): Domain.ChatMutePage => ({
	items: page.items.map(mapChatMuteEntry),
	nextCursor: page.nextCursor,
});

export const mapChatReport = (report: Api.ChatReport): Domain.ChatReport => pickFields(report, chatReportKeys);

export const mapChatEvent = (event: Api.ChatEvent): Domain.ChatEvent => ({
	eventId: event.eventId,
	type: event.type,
	serverTime: event.serverTime,
	message: mapOptional(event.message, mapChatMessage),
	mute: mapOptional(event.mute, mapChatMuteEntry),
	settings: mapOptional(event.settings, mapTournamentChatSettings),
});

export const mapChatUpdatePage = (page: Api.ChatUpdatePage): Domain.ChatUpdatePage => ({
	serverTime: page.serverTime,
	events: page.events.map(mapChatEvent),
	nextCursor: page.nextCursor,
});

export const mapUnreadCount = (count: Api.UnreadCount): Domain.UnreadCount => ({
	count: count.count,
});
