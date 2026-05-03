import { mapCreateTournamentInvitesResult, mapJoinByInvitationCodeResult, mapMyTournamentInvite, mapMyTournamentInvitePage, mapTournamentInvitePage, mapUnreadCount } from './tournament-mappers.js';
import type * as Api from '@rankup/api';
import type { ITournamentInvitesGateway } from '@rankup/rankup/domains/tournaments/invites/contracts/tournamentInvitesGateway.js';
import type * as Domain from '@rankup/rankup/domains/tournaments/invites/contracts/types.js';

export const operationOwners = {
	acceptMyTournamentInvite: 'api.tournament.invites.acceptMyTournamentInvite',
	cancelTournamentInvite: 'api.tournament.invites.cancelTournamentInvite',
	createTournamentInvites: 'api.tournament.invites.createTournamentInvites',
	declineMyTournamentInvite: 'api.tournament.invites.declineMyTournamentInvite',
	getMyTournamentInvite: 'api.tournament.invites.getMyTournamentInvite',
	getMyTournamentInviteUnreadCount: 'api.tournament.invites.getMyTournamentInviteUnreadCount',
	hideMyTournamentInvite: 'api.tournament.invites.hideMyTournamentInvite',
	listMyTournamentInvites: 'api.tournament.invites.listMyTournamentInvites',
	listTournamentInvites: 'api.tournament.invites.listTournamentInvites',
	markMyTournamentInviteSeen: 'api.tournament.invites.markMyTournamentInviteSeen',
} as const;

const mapListTournamentInvitesQuery = (query?: Domain.ListTournamentInvitesQuery): Api.ListTournamentInvitesQuery | undefined =>
	query
		? {
				status: query.status,
				invitedUserId: query.invitedUserId,
				cursor: query.cursor,
				pageSize: query.pageSize,
		  }
		: undefined;

const mapListMyTournamentInvitesQuery = (
	query?: Domain.ListMyTournamentInvitesQuery,
): Api.ListMyTournamentInvitesQuery | undefined =>
	query
		? {
				status: query.status,
				includeHidden: query.includeHidden,
				include: query.include ? query.include.slice() : undefined,
				sort: query.sort,
				cursor: query.cursor,
				pageSize: query.pageSize,
		  }
		: undefined;

const mapGetMyTournamentInviteQuery = (
	query?: Domain.GetMyTournamentInviteQuery,
): Api.GetMyTournamentInviteQuery | undefined =>
	query
		? {
				include: query.include ? query.include.slice() : undefined,
		  }
		: undefined;

const mapCreateTournamentInvitesRequest = (body: Domain.CreateTournamentInvitesRequest): Api.CreateTournamentInvitesRequest => ({
	recipientUserIds: body.recipientUserIds.slice(),
	message: body.message,
	expiresAt: body.expiresAt,
	sendNotification: body.sendNotification,
	clientContext: body.clientContext,
});

const mapAcceptTournamentInviteRequest = (body: Domain.AcceptTournamentInviteRequest): Api.AcceptMyTournamentInviteRequest => ({
	acceptTournamentRules: body.acceptTournamentRules,
	clientContext: body.clientContext,
});

const mapDeclineTournamentInviteRequest = (body: Domain.DeclineTournamentInviteRequest): Api.DeclineMyTournamentInviteRequest => ({
	reason: body.reason,
	clientContext: body.clientContext,
});

export class TournamentInvitesGateway implements ITournamentInvitesGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listTournamentInvites(
		params: Domain.ListTournamentInvitesParams,
		query?: Domain.ListTournamentInvitesQuery,
	): Promise<Domain.TournamentInvitePage> {
		const response = await this.apiClient.listTournamentInvites(
			{ tournamentId: params.tournamentId },
			mapListTournamentInvitesQuery(query),
		);
		return mapTournamentInvitePage(response);
	}

	public async createTournamentInvites(
		params: Domain.CreateTournamentInvitesParams,
		body: Domain.CreateTournamentInvitesRequest,
	): Promise<Domain.CreateTournamentInvitesResult> {
		const response = await this.apiClient.createTournamentInvites(
			{ tournamentId: params.tournamentId },
			mapCreateTournamentInvitesRequest(body),
		);
		return mapCreateTournamentInvitesResult(response);
	}

	public async cancelTournamentInvite(params: Domain.CancelTournamentInviteParams): Promise<void> {
		return this.apiClient.cancelTournamentInvite({ tournamentId: params.tournamentId, inviteId: params.inviteId });
	}

	public async listMyTournamentInvites(query?: Domain.ListMyTournamentInvitesQuery): Promise<Domain.MyTournamentInvitePage> {
		const response = await this.apiClient.listMyTournamentInvites(mapListMyTournamentInvitesQuery(query));
		return mapMyTournamentInvitePage(response);
	}

	public async getMyTournamentInvite(
		params: Domain.GetMyTournamentInviteParams,
		query?: Domain.GetMyTournamentInviteQuery,
	): Promise<Domain.MyTournamentInvite> {
		const response = await this.apiClient.getMyTournamentInvite({ inviteId: params.inviteId }, mapGetMyTournamentInviteQuery(query));
		return mapMyTournamentInvite(response);
	}

	public async getMyTournamentInviteUnreadCount(): Promise<Domain.UnreadCount> {
		const response = await this.apiClient.getMyTournamentInviteUnreadCount();
		return mapUnreadCount(response);
	}

	public async hideMyTournamentInvite(params: Domain.HideMyTournamentInviteParams): Promise<void> {
		return this.apiClient.hideMyTournamentInvite({ inviteId: params.inviteId });
	}

	public async markMyTournamentInviteSeen(params: Domain.MarkMyTournamentInviteSeenParams): Promise<void> {
		return this.apiClient.markMyTournamentInviteSeen({ inviteId: params.inviteId });
	}

	public async acceptMyTournamentInvite(
		params: Domain.AcceptMyTournamentInviteParams,
		body?: Domain.AcceptTournamentInviteRequest,
	): Promise<Domain.AcceptTournamentInviteResult> {
		const response = await this.apiClient.acceptMyTournamentInvite(
			{ inviteId: params.inviteId },
			body ? mapAcceptTournamentInviteRequest(body) : undefined,
		);
		return {
			invite: mapMyTournamentInvite(response.invite),
			join: mapJoinByInvitationCodeResult(response.join),
		};
	}

	public async declineMyTournamentInvite(
		params: Domain.DeclineMyTournamentInviteParams,
		body?: Domain.DeclineTournamentInviteRequest,
	): Promise<Domain.MyTournamentInvite> {
		const response = await this.apiClient.declineMyTournamentInvite(
			{ inviteId: params.inviteId },
			body ? mapDeclineTournamentInviteRequest(body) : undefined,
		);
		return mapMyTournamentInvite(response);
	}
}
