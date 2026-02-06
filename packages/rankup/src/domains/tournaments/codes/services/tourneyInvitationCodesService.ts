import type { ITourneyInvitationCodesService } from '../contracts/tourneyInvitationCodes.js';
import type { ITourneyInvitationCodesGateway as TourneyInvitationCodesGateway } from '../contracts/tourneyInvitationCodesGateway.js';
import { ITourneyInvitationCodesGateway } from '../contracts/tourneyInvitationCodesGateway.js';
import type { CreateInvitationCodeRequest, CreateTournamentInvitationCodeParams, InvitationCode, InvitationCodePage, InvitationCodeResolution, JoinByInvitationCodeRequest, JoinByInvitationCodeResult, JoinTournamentByInvitationCodeParams, ListTournamentInvitationCodesParams, ListTournamentInvitationCodesQuery, ResolveInvitationCodeParams } from '../contracts/types.js';
import { validateInvitationCode } from '../../shared/validation/validateInvitationCode.js';

export class TourneyInvitationCodesService implements ITourneyInvitationCodesService {
	public constructor(@ITourneyInvitationCodesGateway private readonly gateway: TourneyInvitationCodesGateway) {}

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
