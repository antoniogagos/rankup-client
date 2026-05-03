import type { EngineRuntimeContext } from '../../context/engineRuntimeContext.js';
import { RuntimeProblem } from '../../errors.js';
import type { EngineRole, RuntimeResponse } from '../../types.js';
import { resolveEventMetadata } from '../../utils/eventMetadata.js';

export type CancelTournamentInput = {
	actorId: string;
	actorRole: EngineRole;
	tournamentId: string;
	reason?: string;
	requestId?: string;
	correlationId?: string;
	causationId?: string;
};

export type CancelTournamentOutput = {
	tournamentId: string;
	status: 'cancelled';
	locked: boolean;
	changed: boolean;
	reason?: string;
};

export class CancelTournamentUseCase {
	public constructor(private readonly context: EngineRuntimeContext) {}

	public async execute(input: CancelTournamentInput): Promise<RuntimeResponse<CancelTournamentOutput>> {
		const tournament = await this.context.tournamentRepo.getById(input.tournamentId);
		if (!tournament) {
			throw new RuntimeProblem('notFound', 404, 'Tournament not found.', input.requestId);
		}

		const authorization = await this.context.authorizationPort.canPerform('cancelTournamentLifecycle', input.actorId, {
			tournamentId: input.tournamentId,
			actorRole: input.actorRole,
		});
		if (!authorization.allowed) {
			const detail =
				authorization.reason === 'notMember'
					? 'User is not a member of the tournament.'
					: 'Forbidden operation for current role.';
			throw new RuntimeProblem(authorization.reason ?? 'forbiddenRole', 403, detail, input.requestId);
		}

		const trustSafety = await this.context.trustSafetyPort.canProceed('cancelTournamentLifecycle', input.actorId, {
			tournamentId: input.tournamentId,
			actorRole: input.actorRole,
		});
		if (!trustSafety.allowed) {
			throw new RuntimeProblem(trustSafety.reason ?? 'forbiddenRole', 403, 'Cancellation blocked by trust and safety policy.', input.requestId);
		}

		if (tournament.status === 'cancelled' && tournament.joinPolicy.locked) {
			return {
				status: 200,
				body: {
					tournamentId: input.tournamentId,
					status: 'cancelled',
					locked: true,
					changed: false,
					reason: input.reason,
				},
				headers: {},
			};
		}

		const nextTournament = {
			...tournament,
			status: 'cancelled' as const,
			joinPolicy: {
				...tournament.joinPolicy,
				locked: true,
			},
			version: tournament.version + 1,
		};
		await this.context.tournamentRepo.save(nextTournament);

		await this.context.eventBusPort.publish({
			eventId: this.context.idGeneratorPort.nextId('evt'),
			type: 'tournament.cancelled',
			occurredAt: this.context.clockPort.nowIso(),
			...resolveEventMetadata({
				requestId: input.requestId,
				correlationId: input.correlationId,
				causationId: input.causationId,
			}),
				payload: {
					tournamentId: input.tournamentId,
					reason: input.reason ?? 'staff_override',
					actorId: input.actorId,
					actorRole: input.actorRole,
					authorization: {
						policyId: authorization.trace.policyId,
						requiredRoles: authorization.trace.requiredRoles,
						membershipRequired: authorization.trace.membershipRequired,
						membershipRole: authorization.trace.membershipRole,
					},
					trustSafety: {
						policyId: trustSafety.trace.policyId,
						blockedByActorList: trustSafety.trace.blockedByActorList,
						blockedByActionList: trustSafety.trace.blockedByActionList,
						blockedByActorActionList: trustSafety.trace.blockedByActorActionList,
					},
				},
			});

		return {
			status: 200,
			body: {
				tournamentId: input.tournamentId,
				status: 'cancelled',
				locked: true,
				changed: true,
				reason: input.reason,
			},
			headers: {},
		};
	}
}
