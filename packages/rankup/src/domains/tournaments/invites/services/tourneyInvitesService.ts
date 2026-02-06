import type { ITourneyInvitesService } from '../contracts/tourneyInvites.js';
import type { ITourneyInvitesGateway as TourneyInvitesGateway } from '../contracts/tourneyInvitesGateway.js';
import { ITourneyInvitesGateway } from '../contracts/tourneyInvitesGateway.js';
import type { AcceptMyTournamentInviteParams, AcceptTournamentInviteRequest, AcceptTournamentInviteResult, CancelTournamentInviteParams, CreateTournamentInvitesParams, CreateTournamentInvitesRequest, CreateTournamentInvitesResult, DeclineMyTournamentInviteParams, DeclineTournamentInviteRequest, GetMyTournamentInviteParams, GetMyTournamentInviteQuery, HideMyTournamentInviteParams, ListMyTournamentInvitesQuery, ListTournamentInvitesParams, ListTournamentInvitesQuery, MarkMyTournamentInviteSeenParams, MyTournamentInvite, MyTournamentInvitePage, TournamentInvitePage, UnreadCount } from '../contracts/types.js';

export class TourneyInvitesService implements ITourneyInvitesService {
	public constructor(@ITourneyInvitesGateway private readonly gateway: TourneyInvitesGateway) {}

	public async listTournamentInvites(params: ListTournamentInvitesParams, query?: ListTournamentInvitesQuery): Promise<TournamentInvitePage> {
		return this.gateway.listTournamentInvites(params, query);
	}

	public async createTournamentInvites(
		params: CreateTournamentInvitesParams,
		body: CreateTournamentInvitesRequest,
	): Promise<CreateTournamentInvitesResult> {
		return this.gateway.createTournamentInvites(params, body);
	}

	public async cancelTournamentInvite(params: CancelTournamentInviteParams): Promise<void> {
		return this.gateway.cancelTournamentInvite(params);
	}

	public async listMyTournamentInvites(query?: ListMyTournamentInvitesQuery): Promise<MyTournamentInvitePage> {
		return this.gateway.listMyTournamentInvites(query);
	}

	public async getMyTournamentInvite(params: GetMyTournamentInviteParams, query?: GetMyTournamentInviteQuery): Promise<MyTournamentInvite> {
		return this.gateway.getMyTournamentInvite(params, query);
	}

	public async getMyTournamentInviteUnreadCount(): Promise<UnreadCount> {
		return this.gateway.getMyTournamentInviteUnreadCount();
	}

	public async hideMyTournamentInvite(params: HideMyTournamentInviteParams): Promise<void> {
		return this.gateway.hideMyTournamentInvite(params);
	}

	public async markMyTournamentInviteSeen(params: MarkMyTournamentInviteSeenParams): Promise<void> {
		return this.gateway.markMyTournamentInviteSeen(params);
	}

	public async acceptMyTournamentInvite(
		params: AcceptMyTournamentInviteParams,
		body?: AcceptTournamentInviteRequest,
	): Promise<AcceptTournamentInviteResult> {
		return this.gateway.acceptMyTournamentInvite(params, body);
	}

	public async declineMyTournamentInvite(
		params: DeclineMyTournamentInviteParams,
		body?: DeclineTournamentInviteRequest,
	): Promise<MyTournamentInvite> {
		return this.gateway.declineMyTournamentInvite(params, body);
	}
}
