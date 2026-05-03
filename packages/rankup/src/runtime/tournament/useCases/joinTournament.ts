import type { EngineRuntimeContext } from '../../context/engineRuntimeContext.js';
import { isEngineProblem, isRuntimeProblem, RuntimeProblem, toRuntimeProblem } from '../../errors.js';
import type { EngineProblemCode, EngineTournament, IdempotencyScope, RuntimeResponse } from '../../types.js';
import { resolveEventMetadata } from '../../utils/eventMetadata.js';
import { createRequestFingerprint } from '../../utils/idempotency.js';

export type JoinTournamentInput = {
	actorId: string;
	tournamentId: string;
	idempotencyKey?: string;
	requestId?: string;
	correlationId?: string;
	causationId?: string;
};

export type JoinTournamentOutput = {
	tournamentId: string;
	userId: string;
	joined: boolean;
	memberCount: number;
};

type JoinConflictCode = Extract<
	EngineProblemCode,
	'tournamentLocked' | 'joinClosed' | 'tournamentFull' | 'tournamentArchived' | 'tournamentCancelled'
>;

type JoinConflict = {
	code: JoinConflictCode;
	detail: string;
};

function toScope(input: JoinTournamentInput): IdempotencyScope {
	return {
		actorId: input.actorId,
		operationId: 'joinTournament',
		resourceKey: input.tournamentId,
		idempotencyKey: input.idempotencyKey ?? '',
	};
}

function resolveJoinConflict(tournament: EngineTournament, memberCount: number, nowIso: string): JoinConflict | null {
	if (tournament.status === 'archived') {
		return {
			code: 'tournamentArchived',
			detail: 'Tournament is archived and cannot accept new members.',
		};
	}

	if (tournament.status === 'cancelled') {
		return {
			code: 'tournamentCancelled',
			detail: 'Tournament is cancelled and cannot accept new members.',
		};
	}

	if (tournament.status === 'finished') {
		return {
			code: 'joinClosed',
			detail: 'Tournament is finished and no longer accepts new members.',
		};
	}

	if (tournament.joinPolicy.locked) {
		return {
			code: 'tournamentLocked',
			detail: 'Tournament is locked for joining.',
		};
	}

	if (tournament.joinPolicy.joinClosesAt && nowIso >= tournament.joinPolicy.joinClosesAt) {
		return {
			code: 'joinClosed',
			detail: 'Join window is closed for this tournament.',
		};
	}

	if (typeof tournament.joinPolicy.maxPlayers === 'number' && tournament.joinPolicy.maxPlayers > 0 && memberCount >= tournament.joinPolicy.maxPlayers) {
		return {
			code: 'tournamentFull',
			detail: 'Tournament is full.',
		};
	}

	return null;
}

export class JoinTournamentUseCase {
	public constructor(private readonly context: EngineRuntimeContext) {}

	public async execute(input: JoinTournamentInput): Promise<RuntimeResponse<JoinTournamentOutput>> {
		const requestFingerprint = createRequestFingerprint({
			tournamentId: input.tournamentId,
			actorId: input.actorId,
		});
		const scope = input.idempotencyKey ? toScope(input) : null;

		if (scope) {
			const existingOutcome = await this.context.idempotencyPort.get(scope);
			if (existingOutcome) {
				if (existingOutcome.requestFingerprint !== requestFingerprint) {
					throw new RuntimeProblem('idempotencyKeyReused', 409, 'Idempotency key was already used with a different request payload.', input.requestId);
				}
				if (existingOutcome.status >= 400) {
					if (!isEngineProblem(existingOutcome.body)) {
						throw new RuntimeProblem(
							'idempotencyOutcomeInvalid',
							500,
							'Stored idempotency outcome for joinTournament is not a valid Problem Details payload.',
							input.requestId,
						);
					}
					throw toRuntimeProblem(existingOutcome.body);
				}
				return {
					status: existingOutcome.status,
					body: existingOutcome.body as JoinTournamentOutput,
					headers: { ...existingOutcome.headers },
				};
			}
		}

		try {
			const tournament = await this.context.tournamentRepo.getById(input.tournamentId);
			if (!tournament) {
				throw new RuntimeProblem('notFound', 404, 'Tournament not found.', input.requestId);
			}

			const existingMembership = await this.context.membershipRepo.getByTournamentAndUser(input.tournamentId, input.actorId);
			const authorization = await this.context.authorizationPort.canPerform('joinTournament', input.actorId, {
				tournamentId: input.tournamentId,
				membershipRole: existingMembership?.role,
			});
			if (!authorization.allowed) {
				const detail =
					authorization.reason === 'notMember'
						? 'User is not a member of the tournament.'
						: 'Forbidden operation for current role.';
				throw new RuntimeProblem(authorization.reason ?? 'forbiddenRole', 403, detail, input.requestId);
			}

			const trustSafety = await this.context.trustSafetyPort.canProceed('joinTournament', input.actorId, {
				tournamentId: input.tournamentId,
				membershipRole: existingMembership?.role,
			});
			if (!trustSafety.allowed) {
				throw new RuntimeProblem(trustSafety.reason ?? 'forbiddenRole', 403, 'Join blocked by trust and safety policy.', input.requestId);
			}

			const memberCount = await this.context.membershipRepo.countByTournament(input.tournamentId);
			if (existingMembership) {
				const outcome: RuntimeResponse<JoinTournamentOutput> = {
					status: 200,
					body: {
						tournamentId: input.tournamentId,
						userId: input.actorId,
						joined: false,
						memberCount,
					},
					headers: {},
				};
				if (scope) {
					await this.context.idempotencyPort.set(scope, {
						requestFingerprint,
						status: outcome.status,
						body: outcome.body,
						headers: outcome.headers,
					});
				}
				return outcome;
			}

			const joinConflict = resolveJoinConflict(tournament, memberCount, this.context.clockPort.nowIso());
			if (joinConflict) {
				throw new RuntimeProblem(joinConflict.code, 409, joinConflict.detail, input.requestId);
			}

			const membershipCreated = await this.context.membershipRepo.add({
				tournamentId: input.tournamentId,
				userId: input.actorId,
				role: 'player',
				joinedAt: this.context.clockPort.nowIso(),
			});
			if (!membershipCreated) {
				const latestMemberCount = await this.context.membershipRepo.countByTournament(input.tournamentId);
				const duplicateOutcome: RuntimeResponse<JoinTournamentOutput> = {
					status: 200,
					body: {
						tournamentId: input.tournamentId,
						userId: input.actorId,
						joined: false,
						memberCount: latestMemberCount,
					},
					headers: {},
				};
				if (scope) {
					await this.context.idempotencyPort.set(scope, {
						requestFingerprint,
						status: duplicateOutcome.status,
						body: duplicateOutcome.body,
						headers: duplicateOutcome.headers,
					});
				}
				return duplicateOutcome;
			}

			const nextMemberCount = await this.context.membershipRepo.countByTournament(input.tournamentId);
			const outcome: RuntimeResponse<JoinTournamentOutput> = {
				status: 201,
				body: {
					tournamentId: input.tournamentId,
					userId: input.actorId,
					joined: true,
					memberCount: nextMemberCount,
				},
				headers: {},
			};

			if (scope) {
				await this.context.idempotencyPort.set(scope, {
					requestFingerprint,
					status: outcome.status,
					body: outcome.body,
					headers: outcome.headers,
				});
			}

			await this.context.eventBusPort.publish({
				eventId: this.context.idGeneratorPort.nextId('evt'),
				type: 'tournament.member_joined',
				occurredAt: this.context.clockPort.nowIso(),
				...resolveEventMetadata({
					requestId: input.requestId,
					correlationId: input.correlationId,
					causationId: input.causationId,
				}),
				payload: {
					tournamentId: input.tournamentId,
					userId: input.actorId,
					actorId: input.actorId,
					actorRole: authorization.trace.actorRole,
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

			return outcome;
		} catch (error) {
			if (
				scope
				&& isRuntimeProblem(error)
				&& error.problem.status >= 400
				&& error.problem.status < 500
				&& error.problem.code !== 'idempotencyKeyReused'
			) {
				await this.context.idempotencyPort.set(scope, {
					requestFingerprint,
					status: error.problem.status,
					body: { ...error.problem },
					headers: {},
				});
			}
			throw error;
		}
	}
}
