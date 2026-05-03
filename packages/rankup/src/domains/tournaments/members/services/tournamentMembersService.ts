import { validateInvitationCode } from '../../shared/validation/validateInvitationCode.js';
import type { ITournamentMembersService } from '../contracts/tournamentMembers.js';
import type { ITournamentMembersGateway as TournamentMembersGateway } from '../contracts/tournamentMembersGateway.js';
import { ITournamentMembersGateway } from '../contracts/tournamentMembersGateway.js';
import type { JoinTournamentParams, JoinTournamentRequest, JoinTournamentResult, LeaveTournamentParams, ListTournamentMembersParams, ListTournamentMembersQuery, RemoveTournamentMemberParams, RemoveTournamentMemberRequest, TournamentMember, TournamentMemberPage, UpdateTournamentMemberParams, UpdateTournamentMemberRequest } from '../contracts/types.js';

export class TournamentMembersService implements ITournamentMembersService {
	public constructor(@ITournamentMembersGateway private readonly gateway: TournamentMembersGateway) {}

	public async listTournamentMembers(params: ListTournamentMembersParams, query?: ListTournamentMembersQuery): Promise<TournamentMemberPage> {
		return this.gateway.listTournamentMembers(params, query);
	}

	public async joinTournament(params: JoinTournamentParams, body?: JoinTournamentRequest): Promise<JoinTournamentResult> {
		if (body?.invitationCode) {
			validateInvitationCode(body.invitationCode);
		}
		return this.gateway.joinTournament(params, body);
	}

	public async leaveTournament(params: LeaveTournamentParams): Promise<void> {
		return this.gateway.leaveTournament(params);
	}

	public async updateTournamentMember(params: UpdateTournamentMemberParams, body: UpdateTournamentMemberRequest): Promise<TournamentMember> {
		return this.gateway.updateTournamentMember(params, body);
	}

	public async removeTournamentMember(params: RemoveTournamentMemberParams, body?: RemoveTournamentMemberRequest): Promise<void> {
		return this.gateway.removeTournamentMember(params, body);
	}
}
