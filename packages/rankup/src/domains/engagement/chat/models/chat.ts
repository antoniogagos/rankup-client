import type { ChatMessageId, ChatReactionId, TournamentId, UserId } from '../../shared/models/ids.js';
import type { UserSummary } from '../../shared/models/user.js';

export type ChatPageDirection = 'backward' | 'forward';

export type TournamentChatPermission =
	| 'chat.read'
	| 'chat.send'
	| 'chat.edit.own'
	| 'chat.delete.own'
	| 'chat.moderate.delete'
	| 'chat.moderate.mute'
	| 'chat.moderate.pin'
	| 'chat.moderate.settings';

export type TournamentChatSettings = {
	enabled: boolean;
	slowModeSeconds: number;
	maxMessageLength: number;
	allowLinks?: boolean;
	allowImages?: boolean;
	profanityFilterLevel?: 'off' | 'low' | 'medium' | 'high';
};

export type TournamentChatState = {
	isMuted: boolean;
	mutedUntil?: string;
	canSend: boolean;
	cannotSendReason?: string;
	nextAllowedSendAt?: string;
};

export type TournamentChat = {
	tournamentId: TournamentId;
	serverTime: string;
	settings: TournamentChatSettings;
	myState: TournamentChatState;
	myPermissions: TournamentChatPermission[];
};

export type UpdateTournamentChatSettingsRequest = {
	enabled?: boolean;
	slowModeSeconds?: number;
	maxMessageLength?: number;
	allowLinks?: boolean;
	allowImages?: boolean;
	profanityFilterLevel?: 'off' | 'low' | 'medium' | 'high';
	reason?: string;
};

export type ChatMessageType = 'text' | 'system';

export type ChatSystemEventType =
	| 'memberJoined'
	| 'memberLeft'
	| 'tournamentLocked'
	| 'tournamentUnlocked'
	| 'matchdayStarted'
	| 'matchdayFinished';

export type ChatSystemEvent = {
	type: ChatSystemEventType;
	user?: UserSummary;
	matchday?: number;
	payload?: Record<string, unknown>;
};

export type ChatReaction = {
	reactionId: ChatReactionId;
	count: number;
	meReacted: boolean;
};

export type ChatMessage = {
	messageId: ChatMessageId;
	tournamentId: TournamentId;
	type: ChatMessageType;
	sender?: UserSummary;
	text?: string | null;
	systemEvent?: ChatSystemEvent;
	replyToMessageId?: ChatMessageId;
	mentions?: UserId[];
	createdAt: string;
	editedAt?: string;
	deletedAt?: string;
	deletedBy?: UserSummary;
	deleteReason?: string;
	pinnedAt?: string;
	pinnedBy?: UserSummary;
	reactions?: ChatReaction[];
	clientMessageId?: string;
};

export type ChatMessagePage = {
	serverTime: string;
	items: ChatMessage[];
	nextCursor?: string;
};

export type SendChatMessageRequest = {
	type: 'text';
	text?: string;
	replyToMessageId?: ChatMessageId;
	mentions?: UserId[];
	clientMessageId?: string;
	clientSentAt?: string;
};

export type EditChatMessageRequest = {
	text: string;
	reason?: string;
};

export type DeleteChatMessageRequest = {
	reason?: string;
	hardDelete?: boolean;
};

export type UnreadCount = {
	count: number;
};

export type ChatReadCursor = {
	tournamentId: TournamentId;
	serverTime: string;
	lastReadMessageId?: ChatMessageId;
	lastReadAt?: string;
	unreadCount?: number;
};

export type UpdateChatReadCursorRequest = {
	lastReadMessageId: ChatMessageId;
	readAt?: string;
};

export type ChatPinnedMessages = {
	items: ChatMessage[];
};

export type PinChatMessageRequest = {
	note?: string;
};

export type ChatMuteStatus = 'active' | 'expired';

export type ChatMuteEntry = {
	tournamentId: TournamentId;
	user: UserSummary;
	mutedUntil: string;
	status?: ChatMuteStatus;
	reason?: string;
	createdAt: string;
	createdBy: UserSummary;
};

export type ChatMutePage = {
	items: ChatMuteEntry[];
	nextCursor?: string;
};

export type MuteChatUserRequest = {
	mutedUntil: string;
	reason?: string;
};

export type ChatReportReason = 'spam' | 'harassment' | 'hate' | 'violence' | 'sexualContent' | 'childSafety' | 'selfHarm' | 'other';

export type CreateChatReportRequest = {
	messageId?: ChatMessageId;
	reportedUserId?: UserId;
	reason: ChatReportReason;
	comment?: string;
	context?: Record<string, unknown>;
};

export type ChatReport = {
	reportId: string;
	tournamentId: TournamentId;
	reporterUserId: UserId;
	messageId?: ChatMessageId;
	reportedUserId?: UserId;
	reason: ChatReportReason;
	comment?: string;
	createdAt: string;
};

export type ChatEventType =
	| 'chat.message.created'
	| 'chat.message.updated'
	| 'chat.message.deleted'
	| 'chat.message.pinned'
	| 'chat.message.unpinned'
	| 'chat.mute.created'
	| 'chat.mute.deleted'
	| 'chat.settings.updated';

export type ChatEvent = {
	eventId: string;
	type: ChatEventType;
	serverTime: string;
	message?: ChatMessage;
	mute?: ChatMuteEntry;
	settings?: TournamentChatSettings;
};

export type ChatUpdatePage = {
	serverTime: string;
	events: ChatEvent[];
	nextCursor: string;
};

export type GetTournamentChatParams = {
	tournamentId: TournamentId;
};

export type UpdateTournamentChatSettingsParams = {
	tournamentId: TournamentId;
};

export type ListTournamentChatMessagesParams = {
	tournamentId: TournamentId;
};

export type ListTournamentChatMessagesQuery = {
	direction?: ChatPageDirection;
	cursor?: string;
	pageSize?: number;
};

export type SendTournamentChatMessageParams = {
	tournamentId: TournamentId;
};

export type GetTournamentChatMessageParams = {
	tournamentId: TournamentId;
	messageId: ChatMessageId;
};

export type EditTournamentChatMessageParams = {
	tournamentId: TournamentId;
	messageId: ChatMessageId;
};

export type DeleteTournamentChatMessageParams = {
	tournamentId: TournamentId;
	messageId: ChatMessageId;
};

export type GetTournamentChatUnreadCountParams = {
	tournamentId: TournamentId;
};

export type GetTournamentChatReadCursorParams = {
	tournamentId: TournamentId;
};

export type UpdateTournamentChatReadCursorParams = {
	tournamentId: TournamentId;
};

export type ListTournamentChatPinsParams = {
	tournamentId: TournamentId;
};

export type PinTournamentChatMessageParams = {
	tournamentId: TournamentId;
	messageId: ChatMessageId;
};

export type UnpinTournamentChatMessageParams = {
	tournamentId: TournamentId;
	messageId: ChatMessageId;
};

export type ListTournamentChatMutesParams = {
	tournamentId: TournamentId;
};

export type ListTournamentChatMutesQuery = {
	status?: ChatMuteStatus;
	cursor?: string;
	pageSize?: number;
};

export type MuteTournamentChatUserParams = {
	tournamentId: TournamentId;
	userId: UserId;
};

export type UnmuteTournamentChatUserParams = {
	tournamentId: TournamentId;
	userId: UserId;
};

export type ReportTournamentChatContentParams = {
	tournamentId: TournamentId;
};

export type ListTournamentChatUpdatesParams = {
	tournamentId: TournamentId;
};

export type ListTournamentChatUpdatesQuery = {
	sinceCursor?: string;
	waitSeconds?: number;
	limit?: number;
};

export type StreamTournamentChatLiveParams = {
	tournamentId: TournamentId;
};

export type StreamTournamentChatLiveResponse = string;
