import type { ITournamentChatService } from '../contracts/tournamentChat.js';
import type { ITournamentChatGateway as TournamentChatGateway } from '../contracts/tournamentChatGateway.js';
import { ITournamentChatGateway } from '../contracts/tournamentChatGateway.js';
import type { ChatMessage, ChatMessagePage, ChatMuteEntry, ChatMutePage, ChatPinnedMessages, ChatReadCursor, ChatReport, ChatUpdatePage, CreateChatReportRequest, DeleteChatMessageRequest, DeleteTournamentChatMessageParams, EditChatMessageRequest, EditTournamentChatMessageParams, GetTournamentChatMessageParams, GetTournamentChatParams, GetTournamentChatReadCursorParams, GetTournamentChatUnreadCountParams, ListTournamentChatMessagesParams, ListTournamentChatMessagesQuery, ListTournamentChatMutesParams, ListTournamentChatMutesQuery, ListTournamentChatPinsParams, ListTournamentChatUpdatesParams, ListTournamentChatUpdatesQuery, MuteChatUserRequest, MuteTournamentChatUserParams, PinChatMessageRequest, PinTournamentChatMessageParams, ReportTournamentChatContentParams, SendChatMessageRequest, SendTournamentChatMessageParams, StreamTournamentChatLiveParams, StreamTournamentChatLiveResponse, TournamentChat, UnmuteTournamentChatUserParams, UnpinTournamentChatMessageParams, UnreadCount, UpdateChatReadCursorRequest, UpdateTournamentChatReadCursorParams, UpdateTournamentChatSettingsParams, UpdateTournamentChatSettingsRequest } from '../contracts/types.js';

export class TournamentChatService implements ITournamentChatService {
	public constructor(@ITournamentChatGateway private readonly gateway: TournamentChatGateway) {}

	public async getTournamentChat(params: GetTournamentChatParams): Promise<TournamentChat> {
		return this.gateway.getTournamentChat(params);
	}

	public async updateTournamentChatSettings(
		params: UpdateTournamentChatSettingsParams,
		request: UpdateTournamentChatSettingsRequest,
	): Promise<TournamentChat> {
		return this.gateway.updateTournamentChatSettings(params, request);
	}

	public async listTournamentChatMessages(
		params: ListTournamentChatMessagesParams,
		query?: ListTournamentChatMessagesQuery,
	): Promise<ChatMessagePage> {
		return this.gateway.listTournamentChatMessages(params, query);
	}

	public async sendTournamentChatMessage(params: SendTournamentChatMessageParams, request: SendChatMessageRequest): Promise<ChatMessage> {
		return this.gateway.sendTournamentChatMessage(params, request);
	}

	public async getTournamentChatMessage(params: GetTournamentChatMessageParams): Promise<ChatMessage> {
		return this.gateway.getTournamentChatMessage(params);
	}

	public async editTournamentChatMessage(params: EditTournamentChatMessageParams, request: EditChatMessageRequest): Promise<ChatMessage> {
		return this.gateway.editTournamentChatMessage(params, request);
	}

	public async deleteTournamentChatMessage(params: DeleteTournamentChatMessageParams, request?: DeleteChatMessageRequest): Promise<void> {
		return this.gateway.deleteTournamentChatMessage(params, request);
	}

	public async getTournamentChatUnreadCount(params: GetTournamentChatUnreadCountParams): Promise<UnreadCount> {
		return this.gateway.getTournamentChatUnreadCount(params);
	}

	public async getTournamentChatReadCursor(params: GetTournamentChatReadCursorParams): Promise<ChatReadCursor> {
		return this.gateway.getTournamentChatReadCursor(params);
	}

	public async updateTournamentChatReadCursor(
		params: UpdateTournamentChatReadCursorParams,
		request: UpdateChatReadCursorRequest,
	): Promise<ChatReadCursor> {
		return this.gateway.updateTournamentChatReadCursor(params, request);
	}

	public async listTournamentChatPins(params: ListTournamentChatPinsParams): Promise<ChatPinnedMessages> {
		return this.gateway.listTournamentChatPins(params);
	}

	public async pinTournamentChatMessage(params: PinTournamentChatMessageParams, request?: PinChatMessageRequest): Promise<ChatMessage> {
		return this.gateway.pinTournamentChatMessage(params, request);
	}

	public async unpinTournamentChatMessage(params: UnpinTournamentChatMessageParams): Promise<void> {
		return this.gateway.unpinTournamentChatMessage(params);
	}

	public async listTournamentChatMutes(params: ListTournamentChatMutesParams, query?: ListTournamentChatMutesQuery): Promise<ChatMutePage> {
		return this.gateway.listTournamentChatMutes(params, query);
	}

	public async muteTournamentChatUser(params: MuteTournamentChatUserParams, request: MuteChatUserRequest): Promise<ChatMuteEntry> {
		return this.gateway.muteTournamentChatUser(params, request);
	}

	public async unmuteTournamentChatUser(params: UnmuteTournamentChatUserParams): Promise<void> {
		return this.gateway.unmuteTournamentChatUser(params);
	}

	public async reportTournamentChatContent(params: ReportTournamentChatContentParams, request: CreateChatReportRequest): Promise<ChatReport> {
		return this.gateway.reportTournamentChatContent(params, request);
	}

	public async listTournamentChatUpdates(
		params: ListTournamentChatUpdatesParams,
		query?: ListTournamentChatUpdatesQuery,
	): Promise<ChatUpdatePage> {
		return this.gateway.listTournamentChatUpdates(params, query);
	}

	public async streamTournamentChatLive(params: StreamTournamentChatLiveParams): Promise<StreamTournamentChatLiveResponse> {
		return this.gateway.streamTournamentChatLive(params);
	}
}
