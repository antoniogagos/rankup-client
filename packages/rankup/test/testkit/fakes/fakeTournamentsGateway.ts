import type { ITournamentCoreGateway } from '../../../src/domains/tournaments/core/contracts/tournamentCoreGateway.js';
import type * as Core from '../../../src/domains/tournaments/core/contracts/types.js';
import type { ITournamentMembersGateway } from '../../../src/domains/tournaments/members/contracts/tournamentMembersGateway.js';
import type * as Members from '../../../src/domains/tournaments/members/contracts/types.js';
import { fixtures } from '@rankup/testkit/fixtures.js';

export type FakeTournamentsGatewayCall = {
	op: keyof ITournamentCoreGateway | keyof ITournamentMembersGateway;
	params?: unknown;
	query?: unknown;
	body?: unknown;
};

export class FakeTournamentsGateway implements ITournamentCoreGateway, ITournamentMembersGateway {
	public readonly calls: FakeTournamentsGatewayCall[] = [];

	public handlers: {
		listMyTournaments?: (query?: Core.ListMyTournamentsQuery) => Promise<Core.MyTournamentPage>;
		listMyDuels?: (query?: Core.ListMyDuelsQuery) => Promise<Core.DuelPage>;
		createTournament?: (body: Core.CreateTournamentRequest) => Promise<Core.Tournament>;
		createDuel?: (body: Core.CreateDuelRequest) => Promise<Core.Tournament>;
		createDuelRematch?: (params: Core.CreateDuelRematchParams, body?: Core.CreateRematchRequest) => Promise<Core.Tournament>;
		getTournamentPreview?: (params: Core.GetTournamentPreviewParams, query?: Core.GetTournamentPreviewQuery) => Promise<Core.TournamentPreview>;
		listTournamentMembers?: (
			params: Members.ListTournamentMembersParams,
			query?: Members.ListTournamentMembersQuery,
		) => Promise<Members.TournamentMemberPage>;
		joinTournament?: (
			params: Members.JoinTournamentParams,
			body?: Members.JoinTournamentRequest,
		) => Promise<Members.JoinTournamentResult>;
		leaveTournament?: (params: Members.LeaveTournamentParams) => Promise<void>;
		updateTournamentMember?: (
			params: Members.UpdateTournamentMemberParams,
			body: Members.UpdateTournamentMemberRequest,
		) => Promise<Members.TournamentMember>;
		removeTournamentMember?: (
			params: Members.RemoveTournamentMemberParams,
			body?: Members.RemoveTournamentMemberRequest,
		) => Promise<void>;
	} = {};

	public async listMyTournaments(query?: Core.ListMyTournamentsQuery): Promise<Core.MyTournamentPage> {
		this.calls.push({ op: 'listMyTournaments', query });
		if (this.handlers.listMyTournaments) {
			return this.handlers.listMyTournaments(query);
		}
		return {
			items: [
				{
					tournament: fixtures.domain.tournaments.joinByInvitationCodeResult().tournament,
					membership: fixtures.domain.tournaments.joinByInvitationCodeResult().membership,
					lastActivityAt: fixtures.builders.isoDate('2026-01-12T20:00:00.000Z'),
				},
			],
			nextCursor: undefined,
		};
	}

	public async listMyDuels(query?: Core.ListMyDuelsQuery): Promise<Core.DuelPage> {
		this.calls.push({ op: 'listMyDuels', query });
		if (this.handlers.listMyDuels) {
			return this.handlers.listMyDuels(query);
		}
		return { items: [], nextCursor: undefined };
	}

	public async createTournament(body: Core.CreateTournamentRequest): Promise<Core.Tournament> {
		this.calls.push({ op: 'createTournament', body });
		if (this.handlers.createTournament) {
			return this.handlers.createTournament(body);
		}
		return {
			...fixtures.domain.tournaments.joinByInvitationCodeResult().tournament,
			rulesetId: 'scorePrediction-v1',
		};
	}

	public async createDuel(body: Core.CreateDuelRequest): Promise<Core.Tournament> {
		this.calls.push({ op: 'createDuel', body });
		if (this.handlers.createDuel) {
			return this.handlers.createDuel(body);
		}
		return {
			...fixtures.domain.tournaments.joinByInvitationCodeResult().tournament,
			rulesetId: 'scorePrediction-v1',
		};
	}

	public async createDuelRematch(params: Core.CreateDuelRematchParams, body?: Core.CreateRematchRequest): Promise<Core.Tournament> {
		this.calls.push({ op: 'createDuelRematch', params, body });
		if (this.handlers.createDuelRematch) {
			return this.handlers.createDuelRematch(params, body);
		}
		return {
			...fixtures.domain.tournaments.joinByInvitationCodeResult().tournament,
			rulesetId: 'scorePrediction-v1',
		};
	}

	public async getTournamentPreview(params: Core.GetTournamentPreviewParams, query?: Core.GetTournamentPreviewQuery): Promise<Core.TournamentPreview> {
		this.calls.push({ op: 'getTournamentPreview', params, query });
		if (this.handlers.getTournamentPreview) {
			return this.handlers.getTournamentPreview(params, query);
		}
		return fixtures.domain.tournaments.tournamentPreview();
	}

	public async listTournamentMembers(
		params: Members.ListTournamentMembersParams,
		query?: Members.ListTournamentMembersQuery,
	): Promise<Members.TournamentMemberPage> {
		this.calls.push({ op: 'listTournamentMembers', params, query });
		if (this.handlers.listTournamentMembers) {
			return this.handlers.listTournamentMembers(params, query);
		}
		return { items: [], nextCursor: undefined };
	}

	public async joinTournament(
		params: Members.JoinTournamentParams,
		body?: Members.JoinTournamentRequest,
	): Promise<Members.JoinTournamentResult> {
		this.calls.push({ op: 'joinTournament', params, body });
		if (this.handlers.joinTournament) {
			return this.handlers.joinTournament(params, body);
		}
		return fixtures.domain.tournaments.joinByInvitationCodeResult() as Members.JoinTournamentResult;
	}

	public async leaveTournament(params: Members.LeaveTournamentParams): Promise<void> {
		this.calls.push({ op: 'leaveTournament', params });
		if (this.handlers.leaveTournament) {
			return this.handlers.leaveTournament(params);
		}
	}

	public async updateTournamentMember(
		params: Members.UpdateTournamentMemberParams,
		body: Members.UpdateTournamentMemberRequest,
	): Promise<Members.TournamentMember> {
		this.calls.push({ op: 'updateTournamentMember', params, body });
		if (this.handlers.updateTournamentMember) {
			return this.handlers.updateTournamentMember(params, body);
		}
		return {
			user: {
				userId: params.userId,
				username: 'member',
				pictureUrl: undefined,
			},
			role: body.role ?? 'player',
			status: 'active',
			joinedAt: fixtures.builders.isoDate('2026-01-12T20:00:00.000Z'),
		};
	}

	public async removeTournamentMember(
		params: Members.RemoveTournamentMemberParams,
		body?: Members.RemoveTournamentMemberRequest,
	): Promise<void> {
		this.calls.push({ op: 'removeTournamentMember', params, body });
		if (this.handlers.removeTournamentMember) {
			return this.handlers.removeTournamentMember(params, body);
		}
	}
}
