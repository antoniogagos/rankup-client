import { validateInvitationCode } from '../../shared/validation/validateInvitationCode.js';
import type { ITourneyMembersService } from '../contracts/tourneyMembers.js';
import type { ITourneyMembersGateway as TourneyMembersGateway } from '../contracts/tourneyMembersGateway.js';
import { ITourneyMembersGateway } from '../contracts/tourneyMembersGateway.js';
import type { JoinTournamentParams, JoinTournamentRequest, JoinTournamentResult, LeaveTournamentParams, ListTournamentMembersParams, ListTournamentMembersQuery, RemoveTournamentMemberParams, RemoveTournamentMemberRequest, TournamentMember, TournamentMemberPage, UpdateTournamentMemberParams, UpdateTournamentMemberRequest } from '../contracts/types.js';

export class TourneyMembersService implements ITourneyMembersService {
	public constructor(@ITourneyMembersGateway private readonly gateway: TourneyMembersGateway) {}

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
