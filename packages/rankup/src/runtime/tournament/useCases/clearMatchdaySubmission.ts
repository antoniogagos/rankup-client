import { isMatchLocked } from '../../../algorithms/lockRules/index.js';
import { resolveRulesetDefinition } from '../../../registry/index.js';
import type { EngineRuntimeContext } from '../../context/engineRuntimeContext.js';
import { isEngineProblem, isRuntimeProblem, RuntimeProblem, toRuntimeProblem } from '../../errors.js';
import type { IdempotencyScope, RuntimeResponse } from '../../types.js';
import { resolveEventMetadata } from '../../utils/eventMetadata.js';
import { createRequestFingerprint } from '../../utils/idempotency.js';

export type ClearMatchdaySubmissionInput = {
	actorId: string;
	tournamentId: string;
	matchday: number;
	idempotencyKey?: string;
	requestId?: string;
	correlationId?: string;
	causationId?: string;
};

function toScope(input: ClearMatchdaySubmissionInput): IdempotencyScope {
	return {
		actorId: input.actorId,
		operationId: 'clearMatchdaySubmission',
		resourceKey: `${input.tournamentId}:${input.matchday}`,
		idempotencyKey: input.idempotencyKey ?? '',
	};
}

export class ClearMatchdaySubmissionUseCase {
	public constructor(private readonly context: EngineRuntimeContext) {}

	public async execute(input: ClearMatchdaySubmissionInput): Promise<RuntimeResponse<undefined>> {
		const requestFingerprint = createRequestFingerprint({
			tournamentId: input.tournamentId,
			matchday: input.matchday,
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
							'Stored idempotency outcome for clearMatchdaySubmission is not a valid Problem Details payload.',
							input.requestId,
						);
					}
					throw toRuntimeProblem(existingOutcome.body);
				}
				return {
					status: existingOutcome.status,
					body: undefined,
					headers: { ...existingOutcome.headers },
				};
			}
		}

		try {
			const tournament = await this.context.tournamentRepo.getById(input.tournamentId);
			if (!tournament) {
				throw new RuntimeProblem('notFound', 404, 'Tournament not found.', input.requestId);
			}
			if (tournament.joinPolicy.locked || tournament.status === 'archived' || tournament.status === 'cancelled' || tournament.status === 'finished') {
				throw new RuntimeProblem('matchdayClosed', 409, 'Matchday is closed for submissions.', input.requestId);
			}

			const membership = await this.context.membershipRepo.getByTournamentAndUser(input.tournamentId, input.actorId);
			const authorization = await this.context.authorizationPort.canPerform('clearMatchdaySubmission', input.actorId, {
				tournamentId: input.tournamentId,
				matchday: input.matchday,
				membershipRole: membership?.role,
			});
			if (!authorization.allowed) {
				const detail =
					authorization.reason === 'notMember'
						? 'User is not a member of the tournament.'
						: 'Forbidden operation for current role.';
				throw new RuntimeProblem(authorization.reason ?? 'forbiddenRole', 403, detail, input.requestId);
			}

			const trustSafety = await this.context.trustSafetyPort.canProceed('clearMatchdaySubmission', input.actorId, {
				tournamentId: input.tournamentId,
				matchday: input.matchday,
				membershipRole: membership?.role,
			});
			if (!trustSafety.allowed) {
				throw new RuntimeProblem(trustSafety.reason ?? 'forbiddenRole', 403, 'Submission blocked by trust and safety policy.', input.requestId);
			}

			const submission = await this.context.submissionRepo.getByTournamentMatchdayUser(input.tournamentId, input.matchday, input.actorId);
			if (!submission) {
				const emptyOutcome: RuntimeResponse<undefined> = { status: 204, body: undefined, headers: {} };
				if (scope) {
					await this.context.idempotencyPort.set(scope, {
						requestFingerprint,
						status: emptyOutcome.status,
						body: emptyOutcome.body,
						headers: emptyOutcome.headers,
					});
				}
				return emptyOutcome;
			}

			const ruleset = resolveRulesetDefinition(tournament.gameModeId, tournament.rulesetId);
			const matches = await this.context.sportsSchedulePort.listMatchdayMatches(input.tournamentId, input.matchday);
			const nowIso = this.context.clockPort.nowIso();
			for (const prediction of Object.values(submission.predictions)) {
				const match = matches.find(item => item.matchId === prediction.matchId);
				if (!match || isMatchLocked(match, ruleset.lockPolicy, nowIso)) {
					throw new RuntimeProblem('matchdayClosed', 409, 'Matchday is closed for submissions.', input.requestId);
				}
			}

			submission.predictions = {};
			submission.completion = {
				submittedCount: 0,
				expectedCount: matches.length,
				status: 'missing',
			};
			submission.version += 1;
			submission.updatedAt = nowIso;
			await this.context.submissionRepo.save(submission);

			await this.context.eventBusPort.publish({
				eventId: this.context.idGeneratorPort.nextId('evt'),
				type: 'submission.cleared',
				occurredAt: nowIso,
				...resolveEventMetadata({
					requestId: input.requestId,
					correlationId: input.correlationId,
					causationId: input.causationId,
				}),
				payload: {
					tournamentId: input.tournamentId,
					matchday: input.matchday,
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

			const outcome: RuntimeResponse<undefined> = { status: 204, body: undefined, headers: {} };
			if (scope) {
				await this.context.idempotencyPort.set(scope, {
					requestFingerprint,
					status: outcome.status,
					body: outcome.body,
					headers: outcome.headers,
				});
			}
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
