import type { CreateInvitationCodeRequest, CreateTournamentInvitationCodeParams, InvitationCode, InvitationCodePage, InvitationCodeResolution, JoinByInvitationCodeRequest, JoinByInvitationCodeResult, JoinTournamentByInvitationCodeParams, ListTournamentInvitationCodesParams, ListTournamentInvitationCodesQuery, ResolveInvitationCodeParams } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface ITourneyInvitationCodesService {
	listTournamentInvitationCodes(params: ListTournamentInvitationCodesParams, query?: ListTournamentInvitationCodesQuery): Promise<InvitationCodePage>;
	createTournamentInvitationCode(params: CreateTournamentInvitationCodeParams, body?: CreateInvitationCodeRequest): Promise<InvitationCode>;
	resolveInvitationCode(params: ResolveInvitationCodeParams): Promise<InvitationCodeResolution>;
	joinTournamentByInvitationCode(params: JoinTournamentByInvitationCodeParams, body?: JoinByInvitationCodeRequest): Promise<JoinByInvitationCodeResult>;
}

export const ITourneyInvitationCodesService = createDecorator<ITourneyInvitationCodesService>('tourneyInvitationCodesService');
