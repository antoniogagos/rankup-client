import type { ChatMessage, ChatMessagePage, ChatMuteEntry, ChatMutePage, ChatPinnedMessages, ChatReadCursor, ChatReport, ChatUpdatePage, CreateChatReportRequest, DeleteChatMessageRequest, DeleteTournamentChatMessageParams, EditChatMessageRequest, EditTournamentChatMessageParams, GetTournamentChatMessageParams, GetTournamentChatParams, GetTournamentChatReadCursorParams, GetTournamentChatUnreadCountParams, ListTournamentChatMessagesParams, ListTournamentChatMessagesQuery, ListTournamentChatMutesParams, ListTournamentChatMutesQuery, ListTournamentChatPinsParams, ListTournamentChatUpdatesParams, ListTournamentChatUpdatesQuery, MuteChatUserRequest, MuteTournamentChatUserParams, PinChatMessageRequest, PinTournamentChatMessageParams, ReportTournamentChatContentParams, SendChatMessageRequest, SendTournamentChatMessageParams, StreamTournamentChatLiveParams, StreamTournamentChatLiveResponse, TournamentChat, UnmuteTournamentChatUserParams, UnpinTournamentChatMessageParams, UnreadCount, UpdateChatReadCursorRequest, UpdateTournamentChatReadCursorParams, UpdateTournamentChatSettingsParams, UpdateTournamentChatSettingsRequest } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITournamentChatService {
	getTournamentChat(params: GetTournamentChatParams): Promise<TournamentChat>;
	updateTournamentChatSettings(params: UpdateTournamentChatSettingsParams, request: UpdateTournamentChatSettingsRequest): Promise<TournamentChat>;
	listTournamentChatMessages(params: ListTournamentChatMessagesParams, query?: ListTournamentChatMessagesQuery): Promise<ChatMessagePage>;
	sendTournamentChatMessage(params: SendTournamentChatMessageParams, request: SendChatMessageRequest): Promise<ChatMessage>;
	getTournamentChatMessage(params: GetTournamentChatMessageParams): Promise<ChatMessage>;
	editTournamentChatMessage(params: EditTournamentChatMessageParams, request: EditChatMessageRequest): Promise<ChatMessage>;
	deleteTournamentChatMessage(params: DeleteTournamentChatMessageParams, request?: DeleteChatMessageRequest): Promise<void>;
	getTournamentChatUnreadCount(params: GetTournamentChatUnreadCountParams): Promise<UnreadCount>;
	getTournamentChatReadCursor(params: GetTournamentChatReadCursorParams): Promise<ChatReadCursor>;
	updateTournamentChatReadCursor(params: UpdateTournamentChatReadCursorParams, request: UpdateChatReadCursorRequest): Promise<ChatReadCursor>;
	listTournamentChatPins(params: ListTournamentChatPinsParams): Promise<ChatPinnedMessages>;
	pinTournamentChatMessage(params: PinTournamentChatMessageParams, request?: PinChatMessageRequest): Promise<ChatMessage>;
	unpinTournamentChatMessage(params: UnpinTournamentChatMessageParams): Promise<void>;
	listTournamentChatMutes(params: ListTournamentChatMutesParams, query?: ListTournamentChatMutesQuery): Promise<ChatMutePage>;
	muteTournamentChatUser(params: MuteTournamentChatUserParams, request: MuteChatUserRequest): Promise<ChatMuteEntry>;
	unmuteTournamentChatUser(params: UnmuteTournamentChatUserParams): Promise<void>;
	reportTournamentChatContent(params: ReportTournamentChatContentParams, request: CreateChatReportRequest): Promise<ChatReport>;
	listTournamentChatUpdates(params: ListTournamentChatUpdatesParams, query?: ListTournamentChatUpdatesQuery): Promise<ChatUpdatePage>;
	streamTournamentChatLive(params: StreamTournamentChatLiveParams): Promise<StreamTournamentChatLiveResponse>;
}

export const ITournamentChatService = createDecorator<ITournamentChatService>('tournamentChatService');
