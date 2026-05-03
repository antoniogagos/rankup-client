import { mapJoinByInvitationCodeResult, mapTournamentMember, mapTournamentMemberPage } from './tournament-mappers.js';
import type * as Api from '@rankup/api';
import type { ITournamentMembersGateway } from '@rankup/rankup/domains/tournaments/members/contracts/tournamentMembersGateway.js';
import type * as Domain from '@rankup/rankup/domains/tournaments/members/contracts/types.js';

export const operationOwners = {
	joinTournament: 'api.tournament.members.joinTournament',
	leaveTournament: 'api.tournament.members.leaveTournament',
	listTournamentMembers: 'api.tournament.members.listTournamentMembers',
	removeTournamentMember: 'api.tournament.members.removeTournamentMember',
	updateTournamentMember: 'api.tournament.members.updateTournamentMember',
} as const;

const mapListTournamentMembersQuery = (
	query?: Domain.ListTournamentMembersQuery,
): Api.ListTournamentMembersQuery | undefined =>
	query
		? {
				role: query.role,
				status: query.status,
				q: query.q,
				view: query.view,
				cursor: query.cursor,
				pageSize: query.pageSize,
		  }
		: undefined;

const mapJoinTournamentRequest = (body: Domain.JoinTournamentRequest): Api.JoinTournamentRequest => ({
	invitationCode: body.invitationCode,
	acceptTournamentRules: body.acceptTournamentRules,
	clientContext: body.clientContext,
});

const mapUpdateTournamentMemberRequest = (body: Domain.UpdateTournamentMemberRequest): Api.UpdateTournamentMemberRequest => ({
	role: body.role,
	note: body.note,
});

const mapRemoveTournamentMemberRequest = (body: Domain.RemoveTournamentMemberRequest): Api.RemoveTournamentMemberRequest => ({
	reason: body.reason,
});

export class TournamentMembersGateway implements ITournamentMembersGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listTournamentMembers(
		params: Domain.ListTournamentMembersParams,
		query?: Domain.ListTournamentMembersQuery,
	): Promise<Domain.TournamentMemberPage> {
		const response = await this.apiClient.listTournamentMembers(
			{ tournamentId: params.tournamentId },
			mapListTournamentMembersQuery(query),
		);
		return mapTournamentMemberPage(response);
	}

	public async joinTournament(params: Domain.JoinTournamentParams, body?: Domain.JoinTournamentRequest): Promise<Domain.JoinTournamentResult> {
		const response = await this.apiClient.joinTournament(
			{
				tournamentId: params.tournamentId,
				idempotencyKey: params.idempotencyKey,
			},
			body ? mapJoinTournamentRequest(body) : undefined,
		);
		return mapJoinByInvitationCodeResult(response);
	}

	public async leaveTournament(params: Domain.LeaveTournamentParams): Promise<void> {
		return this.apiClient.leaveTournament({ tournamentId: params.tournamentId });
	}

	public async updateTournamentMember(
		params: Domain.UpdateTournamentMemberParams,
		body: Domain.UpdateTournamentMemberRequest,
	): Promise<Domain.TournamentMember> {
		const response = await this.apiClient.updateTournamentMember(
			{ tournamentId: params.tournamentId, userId: params.userId },
			mapUpdateTournamentMemberRequest(body),
		);
		return mapTournamentMember(response);
	}

	public async removeTournamentMember(params: Domain.RemoveTournamentMemberParams, body?: Domain.RemoveTournamentMemberRequest): Promise<void> {
		return this.apiClient.removeTournamentMember(
			{ tournamentId: params.tournamentId, userId: params.userId },
			body ? mapRemoveTournamentMemberRequest(body) : undefined,
		);
	}
}
