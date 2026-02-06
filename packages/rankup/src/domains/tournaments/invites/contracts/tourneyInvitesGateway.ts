import type { AcceptMyTournamentInviteParams, AcceptTournamentInviteRequest, AcceptTournamentInviteResult, CancelTournamentInviteParams, CreateTournamentInvitesParams, CreateTournamentInvitesRequest, CreateTournamentInvitesResult, DeclineMyTournamentInviteParams, DeclineTournamentInviteRequest, GetMyTournamentInviteParams, GetMyTournamentInviteQuery, HideMyTournamentInviteParams, ListMyTournamentInvitesQuery, ListTournamentInvitesParams, ListTournamentInvitesQuery, MarkMyTournamentInviteSeenParams, MyTournamentInvite, MyTournamentInvitePage, TournamentInvitePage, UnreadCount } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITourneyInvitesGateway {
	listTournamentInvites(params: ListTournamentInvitesParams, query?: ListTournamentInvitesQuery): Promise<TournamentInvitePage>;
	createTournamentInvites(params: CreateTournamentInvitesParams, body: CreateTournamentInvitesRequest): Promise<CreateTournamentInvitesResult>;
	cancelTournamentInvite(params: CancelTournamentInviteParams): Promise<void>;
	listMyTournamentInvites(query?: ListMyTournamentInvitesQuery): Promise<MyTournamentInvitePage>;
	getMyTournamentInvite(params: GetMyTournamentInviteParams, query?: GetMyTournamentInviteQuery): Promise<MyTournamentInvite>;
	getMyTournamentInviteUnreadCount(): Promise<UnreadCount>;
	hideMyTournamentInvite(params: HideMyTournamentInviteParams): Promise<void>;
	markMyTournamentInviteSeen(params: MarkMyTournamentInviteSeenParams): Promise<void>;
	acceptMyTournamentInvite(params: AcceptMyTournamentInviteParams, body?: AcceptTournamentInviteRequest): Promise<AcceptTournamentInviteResult>;
	declineMyTournamentInvite(params: DeclineMyTournamentInviteParams, body?: DeclineTournamentInviteRequest): Promise<MyTournamentInvite>;
}

export const ITourneyInvitesGateway = createDecorator<ITourneyInvitesGateway>('tourneyInvitesGateway');
