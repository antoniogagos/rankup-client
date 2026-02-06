import type { JoinTournamentParams, JoinTournamentRequest, JoinTournamentResult, LeaveTournamentParams, ListTournamentMembersParams, ListTournamentMembersQuery, RemoveTournamentMemberParams, RemoveTournamentMemberRequest, TournamentMember, TournamentMemberPage, UpdateTournamentMemberParams, UpdateTournamentMemberRequest } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITourneyMembersService {
	listTournamentMembers(params: ListTournamentMembersParams, query?: ListTournamentMembersQuery): Promise<TournamentMemberPage>;
	joinTournament(params: JoinTournamentParams, body?: JoinTournamentRequest): Promise<JoinTournamentResult>;
	leaveTournament(params: LeaveTournamentParams): Promise<void>;
	updateTournamentMember(params: UpdateTournamentMemberParams, body: UpdateTournamentMemberRequest): Promise<TournamentMember>;
	removeTournamentMember(params: RemoveTournamentMemberParams, body?: RemoveTournamentMemberRequest): Promise<void>;
}

export const ITourneyMembersService = createDecorator<ITourneyMembersService>('tourneyMembersService');
