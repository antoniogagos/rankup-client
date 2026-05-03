import { isMatchLocked } from '../../../algorithms/lockRules/index.js';
import { resolveRulesetDefinition } from '../../../registry/index.js';
import type { EngineRuntimeContext } from '../../context/engineRuntimeContext.js';
import { isEngineProblem, isRuntimeProblem, RuntimeProblem, toRuntimeProblem } from '../../errors.js';
import type { EngineSubmission, IdempotencyScope, RuntimeResponse, SubmissionItemRejection } from '../../types.js';
import { resolveEventMetadata } from '../../utils/eventMetadata.js';
import { parseEtag, toEtag } from '../../utils/etag.js';
import { createRequestFingerprint } from '../../utils/idempotency.js';

export type UpsertMatchdaySubmissionInput = {
	actorId: string;
	tournamentId: string;
	matchday: number;
	upserts?: Array<{ matchId: string; homeScore: number; awayScore: number }>;
	removes?: string[];
	ifMatch?: string;
	idempotencyKey?: string;
	requestId?: string;
	correlationId?: string;
	causationId?: string;
};

export type UpsertMatchdaySubmissionOutput = {
	submission: {
		tournamentId: string;
		matchday: number;
		userId: string;
		version: number;
		etag: string;
		completion: EngineSubmission['completion'];
		submissionCompleteAt: string | null;
		predictions: Array<{
			matchId: string;
			homeScore: number;
			awayScore: number;
			submittedAt: string;
			updatedAt: string;
		}>;
	};
	applied: string[];
	rejected: SubmissionItemRejection[];
};

function toScope(input: UpsertMatchdaySubmissionInput): IdempotencyScope {
	return {
		actorId: input.actorId,
		operationId: 'upsertMatchdaySubmission',
		resourceKey: `${input.tournamentId}:${input.matchday}`,
		idempotencyKey: input.idempotencyKey ?? '',
	};
}

function toSubmissionStatus(submittedCount: number, expectedCount: number): 'missing' | 'partial' | 'complete' {
	if (submittedCount <= 0) {
		return 'missing';
	}
	if (submittedCount >= expectedCount) {
		return 'complete';
	}
	return 'partial';
}

export class UpsertMatchdaySubmissionUseCase {
	public constructor(private readonly context: EngineRuntimeContext) {}

	public async execute(input: UpsertMatchdaySubmissionInput): Promise<RuntimeResponse<UpsertMatchdaySubmissionOutput>> {
		const requestFingerprint = createRequestFingerprint({
			tournamentId: input.tournamentId,
			matchday: input.matchday,
			upserts: input.upserts ?? [],
			removes: input.removes ?? [],
			ifMatch: input.ifMatch ?? null,
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
							'Stored idempotency outcome for upsertMatchdaySubmission is not a valid Problem Details payload.',
							input.requestId,
						);
					}
					throw toRuntimeProblem(existingOutcome.body);
				}
				return {
					status: existingOutcome.status,
					body: existingOutcome.body as UpsertMatchdaySubmissionOutput,
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
				throw new RuntimeProblem('tournamentLocked', 409, 'Tournament is locked for submissions.', input.requestId);
			}

			const membership = await this.context.membershipRepo.getByTournamentAndUser(input.tournamentId, input.actorId);
			const authorization = await this.context.authorizationPort.canPerform('upsertMatchdaySubmission', input.actorId, {
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

			const trustSafety = await this.context.trustSafetyPort.canProceed('upsertMatchdaySubmission', input.actorId, {
				tournamentId: input.tournamentId,
				matchday: input.matchday,
				membershipRole: membership?.role,
			});
			if (!trustSafety.allowed) {
				throw new RuntimeProblem(trustSafety.reason ?? 'forbiddenRole', 403, 'Submission blocked by trust and safety policy.', input.requestId);
			}

			const ruleset = resolveRulesetDefinition(tournament.gameModeId, tournament.rulesetId);
			const matches = await this.context.sportsSchedulePort.listMatchdayMatches(input.tournamentId, input.matchday);
			if (matches.length === 0) {
				throw new RuntimeProblem('matchdayClosed', 409, 'Matchday is unavailable for submissions.', input.requestId);
			}
			const matchById = new Map(matches.map(match => [match.matchId, match]));

			const nowIso = this.context.clockPort.nowIso();
			const persistedSubmission = await this.context.submissionRepo.getByTournamentMatchdayUser(
				input.tournamentId,
				input.matchday,
				input.actorId,
			);
			const existingSubmission = persistedSubmission ?? {
					tournamentId: input.tournamentId,
					matchday: input.matchday,
					userId: input.actorId,
					version: 1,
					predictions: {},
					completion: {
						submittedCount: 0,
						expectedCount: matches.length,
						status: 'missing' as const,
					},
					submissionCompleteAt: null,
					createdAt: nowIso,
					updatedAt: nowIso,
				};

			if (input.ifMatch) {
				const requestedVersion = parseEtag(input.ifMatch);
				if (requestedVersion == null || requestedVersion !== existingSubmission.version) {
					throw new RuntimeProblem('etagMismatch', 412, 'If-Match does not match the current submission version.', input.requestId);
				}
			}
			const expectedVersionForSave = existingSubmission.version;

			const applied: string[] = [];
			const rejected: SubmissionItemRejection[] = [];

			for (const matchId of input.removes ?? []) {
				const match = matchById.get(matchId);
				if (!match) {
					rejected.push({ subjectType: 'match', subjectId: matchId, reason: 'notInMatchday' });
					continue;
				}
				if (isMatchLocked(match, ruleset.lockPolicy, nowIso)) {
					rejected.push({ subjectType: 'match', subjectId: matchId, reason: 'locked' });
					continue;
				}
				delete existingSubmission.predictions[matchId];
				applied.push(matchId);
			}

			for (const upsert of input.upserts ?? []) {
				const match = matchById.get(upsert.matchId);
				if (!match) {
					rejected.push({ subjectType: 'match', subjectId: upsert.matchId, reason: 'notInMatchday' });
					continue;
				}
				if (isMatchLocked(match, ruleset.lockPolicy, nowIso)) {
					rejected.push({ subjectType: 'match', subjectId: upsert.matchId, reason: 'locked' });
					continue;
				}
				const previous = existingSubmission.predictions[upsert.matchId];
				existingSubmission.predictions[upsert.matchId] = {
					matchId: upsert.matchId,
					homeScore: upsert.homeScore,
					awayScore: upsert.awayScore,
					submittedAt: previous?.submittedAt ?? nowIso,
					updatedAt: nowIso,
				};
				applied.push(upsert.matchId);
			}

			const submittedCount = Object.keys(existingSubmission.predictions).length;
			const expectedCount = matches.length;
			existingSubmission.completion = {
				submittedCount,
				expectedCount,
				status: toSubmissionStatus(submittedCount, expectedCount),
			};
			if (!existingSubmission.submissionCompleteAt && existingSubmission.completion.status === 'complete') {
				existingSubmission.submissionCompleteAt = nowIso;
			}
			existingSubmission.version = expectedVersionForSave + 1;
			existingSubmission.updatedAt = nowIso;

			if (input.ifMatch) {
				const saveSucceeded = await this.context.submissionRepo.saveIfVersion(existingSubmission, expectedVersionForSave);
				if (!saveSucceeded) {
					throw new RuntimeProblem('etagMismatch', 412, 'If-Match does not match the current submission version.', input.requestId);
				}
			} else {
				await this.context.submissionRepo.save(existingSubmission);
			}

			const response: RuntimeResponse<UpsertMatchdaySubmissionOutput> = {
				status: 200,
				body: {
					submission: {
						tournamentId: existingSubmission.tournamentId,
						matchday: existingSubmission.matchday,
						userId: existingSubmission.userId,
						version: existingSubmission.version,
						etag: toEtag(existingSubmission.version),
						completion: existingSubmission.completion,
						submissionCompleteAt: existingSubmission.submissionCompleteAt,
						predictions: Object.values(existingSubmission.predictions),
					},
					applied,
					rejected,
				},
				headers: {
					ETag: toEtag(existingSubmission.version),
				},
			};

			if (scope) {
				await this.context.idempotencyPort.set(scope, {
					requestFingerprint,
					status: response.status,
					body: response.body,
					headers: response.headers,
				});
			}

			await this.context.eventBusPort.publish({
				eventId: this.context.idGeneratorPort.nextId('evt'),
				type: 'submission.upserted',
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
					applied,
					rejectedCount: rejected.length,
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

			return response;
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
