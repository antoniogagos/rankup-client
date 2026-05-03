import type { ITournamentInvitationCodesService } from '../contracts/tournamentInvitationCodes.js';
import type { ITournamentInvitationCodesGateway as TournamentInvitationCodesGateway } from '../contracts/tournamentInvitationCodesGateway.js';
import { ITournamentInvitationCodesGateway } from '../contracts/tournamentInvitationCodesGateway.js';
import type { CreateInvitationCodeRequest, CreateTournamentInvitationCodeParams, InvitationCode, InvitationCodePage, InvitationCodeResolution, JoinByInvitationCodeRequest, JoinByInvitationCodeResult, JoinTournamentByInvitationCodeParams, ListTournamentInvitationCodesParams, ListTournamentInvitationCodesQuery, ResolveInvitationCodeParams } from '../contracts/types.js';
import { validateInvitationCode } from '../../shared/validation/validateInvitationCode.js';

export class TournamentInvitationCodesService implements ITournamentInvitationCodesService {
	public constructor(@ITournamentInvitationCodesGateway private readonly gateway: TournamentInvitationCodesGateway) {}

	public async listTournamentInvitationCodes(
		params: ListTournamentInvitationCodesParams,
		query?: ListTournamentInvitationCodesQuery,
	): Promise<InvitationCodePage> {
		return this.gateway.listTournamentInvitationCodes(params, query);
	}

	public async createTournamentInvitationCode(
		params: CreateTournamentInvitationCodeParams,
		body?: CreateInvitationCodeRequest,
	): Promise<InvitationCode> {
		return this.gateway.createTournamentInvitationCode(params, body);
	}

	public async resolveInvitationCode(params: ResolveInvitationCodeParams): Promise<InvitationCodeResolution> {
		validateInvitationCode(params.code);
		return this.gateway.resolveInvitationCode(params);
	}

	public async joinTournamentByInvitationCode(
		params: JoinTournamentByInvitationCodeParams,
		body?: JoinByInvitationCodeRequest,
	): Promise<JoinByInvitationCodeResult> {
		validateInvitationCode(params.code);
		return this.gateway.joinTournamentByInvitationCode(params, body);
	}
}
