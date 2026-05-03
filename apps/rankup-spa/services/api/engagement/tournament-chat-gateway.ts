import { mapChatMessage, mapChatMessagePage, mapChatMuteEntry, mapChatMutePage, mapChatPinnedMessages, mapChatReadCursor, mapChatReport, mapChatUpdatePage, mapTournamentChat, mapUnreadCount } from './chat-mappers.js';
import type * as Api from '@rankup/api';
import type { ITournamentChatGateway } from '@rankup/rankup/domains/engagement/chat/contracts/tournamentChatGateway.js';
import type * as Domain from '@rankup/rankup/domains/engagement/chat/contracts/types.js';

const mapListTournamentChatMessagesQuery = (
	query?: Domain.ListTournamentChatMessagesQuery,
): Api.ListTournamentChatMessagesQuery | undefined =>
	query
		? {
			direction: query.direction,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapListTournamentChatMutesQuery = (
	query?: Domain.ListTournamentChatMutesQuery,
): Api.ListTournamentChatMutesQuery | undefined =>
	query
		? {
			status: query.status,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapListTournamentChatUpdatesQuery = (
	query?: Domain.ListTournamentChatUpdatesQuery,
): Api.ListTournamentChatUpdatesQuery | undefined =>
	query
		? {
			sinceCursor: query.sinceCursor,
			waitSeconds: query.waitSeconds,
			limit: query.limit,
		}
		: undefined;

const mapUpdateTournamentChatSettingsRequest = (
	request: Domain.UpdateTournamentChatSettingsRequest,
): Api.UpdateTournamentChatSettingsRequest => ({
	enabled: request.enabled,
	slowModeSeconds: request.slowModeSeconds,
	maxMessageLength: request.maxMessageLength,
	allowLinks: request.allowLinks,
	allowImages: request.allowImages,
	profanityFilterLevel: request.profanityFilterLevel,
	reason: request.reason,
});

const mapSendChatMessageRequest = (request: Domain.SendChatMessageRequest): Api.SendChatMessageRequest => ({
	type: request.type,
	text: request.text,
	replyToMessageId: request.replyToMessageId,
	mentions: request.mentions,
	clientMessageId: request.clientMessageId,
	clientSentAt: request.clientSentAt,
});

const mapEditChatMessageRequest = (request: Domain.EditChatMessageRequest): Api.EditChatMessageRequest => ({
	text: request.text,
	reason: request.reason,
});

const mapDeleteChatMessageRequest = (request: Domain.DeleteChatMessageRequest): Api.DeleteChatMessageRequest => ({
	reason: request.reason,
	hardDelete: request.hardDelete,
});

const mapUpdateChatReadCursorRequest = (request: Domain.UpdateChatReadCursorRequest): Api.UpdateChatReadCursorRequest => ({
	lastReadMessageId: request.lastReadMessageId,
	readAt: request.readAt,
});

const mapPinChatMessageRequest = (request: Domain.PinChatMessageRequest): Api.PinChatMessageRequest => ({
	note: request.note,
});

const mapMuteChatUserRequest = (request: Domain.MuteChatUserRequest): Api.MuteChatUserRequest => ({
	mutedUntil: request.mutedUntil,
	reason: request.reason,
});

const mapCreateChatReportRequest = (request: Domain.CreateChatReportRequest): Api.CreateChatReportRequest => ({
	messageId: request.messageId,
	reportedUserId: request.reportedUserId,
	reason: request.reason,
	comment: request.comment,
	context: request.context,
});

export class TournamentChatGateway implements ITournamentChatGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getTournamentChat(params: Domain.GetTournamentChatParams): Promise<Domain.TournamentChat> {
		const response = await this.apiClient.getTournamentChat({ tournamentId: params.tournamentId });
		return mapTournamentChat(response);
	}

	public async updateTournamentChatSettings(
		params: Domain.UpdateTournamentChatSettingsParams,
		request: Domain.UpdateTournamentChatSettingsRequest,
	): Promise<Domain.TournamentChat> {
		const response = await this.apiClient.updateTournamentChatSettings(
			{ tournamentId: params.tournamentId },
			mapUpdateTournamentChatSettingsRequest(request),
		);
		return mapTournamentChat(response);
	}

	public async listTournamentChatMessages(
		params: Domain.ListTournamentChatMessagesParams,
		query?: Domain.ListTournamentChatMessagesQuery,
	): Promise<Domain.ChatMessagePage> {
		const response = await this.apiClient.listTournamentChatMessages(
			{ tournamentId: params.tournamentId },
			mapListTournamentChatMessagesQuery(query),
		);
		return mapChatMessagePage(response);
	}

	public async sendTournamentChatMessage(
		params: Domain.SendTournamentChatMessageParams,
		request: Domain.SendChatMessageRequest,
	): Promise<Domain.ChatMessage> {
		const response = await this.apiClient.sendTournamentChatMessage(
			{ tournamentId: params.tournamentId },
			mapSendChatMessageRequest(request),
		);
		return mapChatMessage(response);
	}

	public async getTournamentChatMessage(params: Domain.GetTournamentChatMessageParams): Promise<Domain.ChatMessage> {
		const response = await this.apiClient.getTournamentChatMessage({
			tournamentId: params.tournamentId,
			messageId: params.messageId,
		});
		return mapChatMessage(response);
	}

	public async editTournamentChatMessage(
		params: Domain.EditTournamentChatMessageParams,
		request: Domain.EditChatMessageRequest,
	): Promise<Domain.ChatMessage> {
		const response = await this.apiClient.editTournamentChatMessage(
			{ tournamentId: params.tournamentId, messageId: params.messageId },
			mapEditChatMessageRequest(request),
		);
		return mapChatMessage(response);
	}

	public async deleteTournamentChatMessage(
		params: Domain.DeleteTournamentChatMessageParams,
		request?: Domain.DeleteChatMessageRequest,
	): Promise<void> {
		await this.apiClient.deleteTournamentChatMessage(
			{ tournamentId: params.tournamentId, messageId: params.messageId },
			request ? mapDeleteChatMessageRequest(request) : undefined,
		);
	}

	public async getTournamentChatUnreadCount(params: Domain.GetTournamentChatUnreadCountParams): Promise<Domain.UnreadCount> {
		const response = await this.apiClient.getTournamentChatUnreadCount({ tournamentId: params.tournamentId });
		return mapUnreadCount(response);
	}

	public async getTournamentChatReadCursor(params: Domain.GetTournamentChatReadCursorParams): Promise<Domain.ChatReadCursor> {
		const response = await this.apiClient.getTournamentChatReadCursor({ tournamentId: params.tournamentId });
		return mapChatReadCursor(response);
	}

	public async updateTournamentChatReadCursor(
		params: Domain.UpdateTournamentChatReadCursorParams,
		request: Domain.UpdateChatReadCursorRequest,
	): Promise<Domain.ChatReadCursor> {
		const response = await this.apiClient.updateTournamentChatReadCursor(
			{ tournamentId: params.tournamentId },
			mapUpdateChatReadCursorRequest(request),
		);
		return mapChatReadCursor(response);
	}

	public async listTournamentChatPins(params: Domain.ListTournamentChatPinsParams): Promise<Domain.ChatPinnedMessages> {
		const response = await this.apiClient.listTournamentChatPins({ tournamentId: params.tournamentId });
		return mapChatPinnedMessages(response);
	}

	public async pinTournamentChatMessage(
		params: Domain.PinTournamentChatMessageParams,
		request?: Domain.PinChatMessageRequest,
	): Promise<Domain.ChatMessage> {
		const response = await this.apiClient.pinTournamentChatMessage(
			{ tournamentId: params.tournamentId, messageId: params.messageId },
			request ? mapPinChatMessageRequest(request) : undefined,
		);
		return mapChatMessage(response);
	}

	public async unpinTournamentChatMessage(params: Domain.UnpinTournamentChatMessageParams): Promise<void> {
		await this.apiClient.unpinTournamentChatMessage({ tournamentId: params.tournamentId, messageId: params.messageId });
	}

	public async listTournamentChatMutes(
		params: Domain.ListTournamentChatMutesParams,
		query?: Domain.ListTournamentChatMutesQuery,
	): Promise<Domain.ChatMutePage> {
		const response = await this.apiClient.listTournamentChatMutes(
			{ tournamentId: params.tournamentId },
			mapListTournamentChatMutesQuery(query),
		);
		return mapChatMutePage(response);
	}

	public async muteTournamentChatUser(
		params: Domain.MuteTournamentChatUserParams,
		request: Domain.MuteChatUserRequest,
	): Promise<Domain.ChatMuteEntry> {
		const response = await this.apiClient.muteTournamentChatUser(
			{ tournamentId: params.tournamentId, userId: params.userId },
			mapMuteChatUserRequest(request),
		);
		return mapChatMuteEntry(response);
	}

	public async unmuteTournamentChatUser(params: Domain.UnmuteTournamentChatUserParams): Promise<void> {
		await this.apiClient.unmuteTournamentChatUser({ tournamentId: params.tournamentId, userId: params.userId });
	}

	public async reportTournamentChatContent(
		params: Domain.ReportTournamentChatContentParams,
		request: Domain.CreateChatReportRequest,
	): Promise<Domain.ChatReport> {
		const response = await this.apiClient.reportTournamentChatContent(
			{ tournamentId: params.tournamentId },
			mapCreateChatReportRequest(request),
		);
		return mapChatReport(response);
	}

	public async listTournamentChatUpdates(
		params: Domain.ListTournamentChatUpdatesParams,
		query?: Domain.ListTournamentChatUpdatesQuery,
	): Promise<Domain.ChatUpdatePage> {
		const response = await this.apiClient.listTournamentChatUpdates(
			{ tournamentId: params.tournamentId },
			mapListTournamentChatUpdatesQuery(query),
		);
		return mapChatUpdatePage(response);
	}

	public async streamTournamentChatLive(params: Domain.StreamTournamentChatLiveParams): Promise<Domain.StreamTournamentChatLiveResponse> {
		return this.apiClient.streamTournamentChatLive({ tournamentId: params.tournamentId });
	}
}
