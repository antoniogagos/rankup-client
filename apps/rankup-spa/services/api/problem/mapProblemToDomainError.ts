import type { DomainError, DomainErrorItem, DomainErrorKind } from '@rankup/rankup/domains/shared/errors/domainError.js';

type ProblemLike = {
	type?: unknown;
	title?: unknown;
	status?: unknown;
	code?: unknown;
	detail?: unknown;
	message?: unknown;
	requestId?: unknown;
	errors?: unknown;
};

const problemCodeKinds: Record<string, DomainErrorKind> = {
	notFound: 'NotFound',
	submissionLocked: 'SubmissionLocked',
	matchdayClosed: 'MatchdayClosed',
	validationFailed: 'ValidationFailed',
	invalidRequest: 'ValidationFailed',
	tournamentArchived: 'TournamentArchived',
	tournamentCancelled: 'TournamentCancelled',
	tournamentFull: 'TournamentFull',
	tournamentLocked: 'TournamentLocked',
	joinClosed: 'JoinClosed',
	etagMismatch: 'EtagMismatch',
	idempotencyKeyReused: 'IdempotencyKeyReused',
	idempotencyOutcomeInvalid: 'IdempotencyOutcomeInvalid',
	notMember: 'NotMember',
	forbiddenRole: 'ForbiddenRole',
	forbidden: 'Forbidden',
	unauthorized: 'Unauthorized',
	unauthenticated: 'Unauthorized',
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const mapProblemStatusToKind = (status?: number): DomainErrorKind => {
	if (status === 401) {
		return 'Unauthorized';
	}
	if (status === 403) {
		return 'Forbidden';
	}
	if (status === 404) {
		return 'NotFound';
	}
	if (status === 422) {
		return 'ValidationFailed';
	}
	if (status === 429) {
		return 'RateLimited';
	}
	if (status === 409 || status === 412) {
		return 'Conflict';
	}
	if (status !== undefined && status >= 500) {
		return 'ServerError';
	}
	return 'Unknown';
};

const toDomainErrorItems = (errors: unknown): DomainErrorItem[] | undefined => {
	if (!Array.isArray(errors)) {
		return undefined;
	}
	const items: DomainErrorItem[] = [];
	for (const error of errors) {
		if (!isRecord(error)) {
			continue;
		}
		items.push({
			path: typeof error.path === 'string' ? error.path : undefined,
			code: typeof error.code === 'string' ? error.code : undefined,
			message: typeof error.message === 'string' ? error.message : undefined,
		});
	}
	return items.length > 0 ? items : undefined;
};

export const mapProblemToDomainError = (problem: unknown): DomainError => {
	if (!isRecord(problem)) {
		const message = problem instanceof Error ? problem.message : 'Unknown error';
		return {
			kind: 'Unknown',
			message,
			raw: problem,
		};
	}

	const problemLike = problem as ProblemLike;
	const status = typeof problemLike.status === 'number' ? problemLike.status : undefined;
	const code = typeof problemLike.code === 'string' ? problemLike.code : undefined;
	const kind = code ? (problemCodeKinds[code] ?? mapProblemStatusToKind(status)) : mapProblemStatusToKind(status);
	const detail = typeof problemLike.detail === 'string' ? problemLike.detail : undefined;
	const messageField = typeof problemLike.message === 'string' ? problemLike.message : undefined;
	const title = typeof problemLike.title === 'string' ? problemLike.title : undefined;
	const message = detail ?? messageField ?? title ?? 'Request failed';

	return {
		kind,
		message,
		status,
		code,
		type: typeof problemLike.type === 'string' ? problemLike.type : undefined,
		title,
		detail,
		requestId: typeof problemLike.requestId === 'string' ? problemLike.requestId : undefined,
		errors: toDomainErrorItems(problemLike.errors),
		raw: problem,
	};
};
