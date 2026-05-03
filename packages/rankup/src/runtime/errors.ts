import type { EngineProblem, EngineProblemCode } from './types.js';

const PROBLEM_TYPE_BY_CODE: Record<EngineProblemCode, string> = {
	idempotencyKeyReused: 'https://errors.rankup.dev/idempotency/reused-key',
	idempotencyOutcomeInvalid: 'https://errors.rankup.dev/idempotency/outcome-invalid',
	etagMismatch: 'https://errors.rankup.dev/precondition/failed',
	tournamentLocked: 'https://errors.rankup.dev/tournaments/locked',
	joinClosed: 'https://errors.rankup.dev/tournaments/join-closed',
	tournamentFull: 'https://errors.rankup.dev/tournaments/full',
	tournamentArchived: 'https://errors.rankup.dev/tournaments/archived',
	tournamentCancelled: 'https://errors.rankup.dev/tournaments/cancelled',
	matchdayClosed: 'https://errors.rankup.dev/matchdays/closed',
	submissionLocked: 'https://errors.rankup.dev/submissions/locked',
	notMember: 'https://errors.rankup.dev/tournaments/not-member',
	forbiddenRole: 'https://errors.rankup.dev/auth/forbidden',
	notFound: 'https://errors.rankup.dev/not-found',
};

const PROBLEM_TITLE_BY_STATUS: Record<number, string> = {
	403: 'Forbidden',
	404: 'Not Found',
	409: 'Conflict',
	412: 'Precondition Failed',
	500: 'Internal Server Error',
};

export class RuntimeProblem extends Error {
	public readonly problem: EngineProblem;

	public constructor(code: EngineProblemCode, status: number, detail: string, requestId?: string) {
		super(detail);
		this.name = 'RuntimeProblem';
		this.problem = {
			type: PROBLEM_TYPE_BY_CODE[code],
			title: PROBLEM_TITLE_BY_STATUS[status] ?? 'Error',
			status,
			detail,
			code,
			requestId,
		};
	}
}

export function isEngineProblem(value: unknown): value is EngineProblem {
	if (!value || typeof value !== 'object') {
		return false;
	}
	const candidate = value as Partial<EngineProblem>;
	return (
		typeof candidate.type === 'string'
		&& typeof candidate.title === 'string'
		&& typeof candidate.status === 'number'
		&& typeof candidate.detail === 'string'
		&& typeof candidate.code === 'string'
	);
}

export function toRuntimeProblem(problem: EngineProblem): RuntimeProblem {
	const runtimeProblem = new RuntimeProblem(problem.code, problem.status, problem.detail, problem.requestId);
	runtimeProblem.problem.type = problem.type;
	runtimeProblem.problem.title = problem.title;
	runtimeProblem.problem.status = problem.status;
	runtimeProblem.problem.detail = problem.detail;
	runtimeProblem.problem.code = problem.code;
	runtimeProblem.problem.requestId = problem.requestId;
	if (problem.errors) {
		runtimeProblem.problem.errors = problem.errors.map(item => ({ ...item }));
	}
	return runtimeProblem;
}

export function isRuntimeProblem(error: unknown): error is RuntimeProblem {
	return error instanceof RuntimeProblem;
}
