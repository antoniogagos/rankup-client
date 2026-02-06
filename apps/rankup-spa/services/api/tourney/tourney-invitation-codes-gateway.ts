import { mapInvitationCode, mapInvitationCodePage, mapInvitationCodeResolution, mapJoinByInvitationCodeResult } from './tourney-mappers.js';
import type * as Api from '@rankup/api';
import type { ITourneyInvitationCodesGateway } from '@rankup/rankup/domains/tournaments/codes/contracts/tourneyInvitationCodesGateway.js';
import type * as Domain from '@rankup/rankup/domains/tournaments/codes/contracts/types.js';

const mapListTournamentInvitationCodesQuery = (
	query?: Domain.ListTournamentInvitationCodesQuery,
): Api.ListTournamentInvitationCodesQuery | undefined =>
	query
		? {
				status: query.status,
				cursor: query.cursor,
				pageSize: query.pageSize,
		  }
		: undefined;

const mapCreateInvitationCodeRequest = (body: Domain.CreateInvitationCodeRequest): Api.CreateInvitationCodeRequest => ({
	revokeExisting: body.revokeExisting,
	expiresAt: body.expiresAt,
	maxUses: body.maxUses,
	label: body.label,
	reason: body.reason,
});

const mapJoinByInvitationCodeRequest = (body: Domain.JoinByInvitationCodeRequest): Api.JoinTournamentByInvitationCodeRequest => ({
	acceptTournamentRules: body.acceptTournamentRules,
	clientContext: body.clientContext,
});

export class TourneyInvitationCodesGateway implements ITourneyInvitationCodesGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async listTournamentInvitationCodes(
		params: Domain.ListTournamentInvitationCodesParams,
		query?: Domain.ListTournamentInvitationCodesQuery,
	): Promise<Domain.InvitationCodePage> {
		const response = await this.apiClient.listTournamentInvitationCodes(
			{ tournamentId: params.tournamentId },
			mapListTournamentInvitationCodesQuery(query),
		);
		return mapInvitationCodePage(response);
	}

	public async createTournamentInvitationCode(
		params: Domain.CreateTournamentInvitationCodeParams,
		body?: Domain.CreateInvitationCodeRequest,
	): Promise<Domain.InvitationCode> {
		const response = await this.apiClient.createTournamentInvitationCode(
			{ tournamentId: params.tournamentId },
			body ? mapCreateInvitationCodeRequest(body) : undefined,
		);
		return mapInvitationCode(response);
	}

	public async resolveInvitationCode(params: Domain.ResolveInvitationCodeParams): Promise<Domain.InvitationCodeResolution> {
		const response = await this.apiClient.resolveInvitationCode({ code: params.code });
		return mapInvitationCodeResolution(response);
	}

	public async joinTournamentByInvitationCode(
		params: Domain.JoinTournamentByInvitationCodeParams,
		body?: Domain.JoinByInvitationCodeRequest,
	): Promise<Domain.JoinByInvitationCodeResult> {
		const response = await this.apiClient.joinTournamentByInvitationCode(
			{ code: params.code },
			body ? mapJoinByInvitationCodeRequest(body) : undefined,
		);
		return mapJoinByInvitationCodeResult(response);
	}
}
