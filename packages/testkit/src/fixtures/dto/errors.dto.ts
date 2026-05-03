export const errorDtoFixtures = {
	submissionLockedProblem() {
		return {
			type: 'https://rankup.dev/problems/submission-locked',
			title: 'Submission locked',
			status: 409,
			code: 'submissionLocked',
			detail: 'Matchday is locked',
		};
	},
	validationFailedProblem() {
		return {
			type: 'https://rankup.dev/problems/validation-failed',
			title: 'Validation failed',
			status: 422,
			code: 'validationFailed',
			detail: 'Payload did not pass validation',
		};
	},
	unauthorizedProblem() {
		return {
			type: 'https://rankup.dev/problems/unauthorized',
			title: 'Unauthorized',
			status: 401,
			code: 'unauthorized',
			detail: 'Authentication is required',
		};
	},
	forbiddenProblem() {
		return {
			type: 'https://rankup.dev/problems/forbidden',
			title: 'Forbidden',
			status: 403,
			code: 'forbidden',
			detail: 'You do not have access to this resource',
		};
	},
	forbiddenRoleProblem() {
		return {
			type: 'https://rankup.dev/problems/forbidden-role',
			title: 'Forbidden',
			status: 403,
			code: 'forbiddenRole',
			detail: 'Current role cannot access this operation',
		};
	},
	notFoundProblem() {
		return {
			type: 'https://rankup.dev/problems/not-found',
			title: 'Not found',
			status: 404,
			code: 'notFound',
			detail: 'Resource not found',
		};
	},
	tooManyRequestsProblem() {
		return {
			type: 'https://rankup.dev/problems/too-many-requests',
			title: 'Too Many Requests',
			status: 429,
			code: 'tooManyRequests',
			detail: 'Rate limit exceeded',
		};
	},
	internalServerErrorProblem() {
		return {
			type: 'https://rankup.dev/problems/internal',
			title: 'Internal Server Error',
			status: 500,
			code: 'internalError',
			detail: 'Unexpected server failure',
		};
	},
	tournamentLockedProblem() {
		return {
			type: 'https://rankup.dev/problems/tournament-locked',
			title: 'Conflict',
			status: 409,
			code: 'tournamentLocked',
			detail: 'Tournament is locked',
		};
	},
	tournamentArchivedProblem() {
		return {
			type: 'https://rankup.dev/problems/tournament-archived',
			title: 'Conflict',
			status: 409,
			code: 'tournamentArchived',
			detail: 'Tournament is archived',
		};
	},
	tournamentCancelledProblem() {
		return {
			type: 'https://rankup.dev/problems/tournament-cancelled',
			title: 'Conflict',
			status: 409,
			code: 'tournamentCancelled',
			detail: 'Tournament is cancelled',
		};
	},
	tournamentFullProblem() {
		return {
			type: 'https://rankup.dev/problems/tournament-full',
			title: 'Conflict',
			status: 409,
			code: 'tournamentFull',
			detail: 'Tournament is full',
		};
	},
	joinClosedProblem() {
		return {
			type: 'https://rankup.dev/problems/join-closed',
			title: 'Conflict',
			status: 409,
			code: 'joinClosed',
			detail: 'Join window is closed',
		};
	},
	notMemberProblem() {
		return {
			type: 'https://rankup.dev/problems/not-member',
			title: 'Forbidden',
			status: 403,
			code: 'notMember',
			detail: 'Membership is required',
		};
	},
	idempotencyKeyReusedProblem() {
		return {
			type: 'https://rankup.dev/problems/idempotency-key-reused',
			title: 'Conflict',
			status: 409,
			code: 'idempotencyKeyReused',
			detail: 'Idempotency key was reused with a different payload',
		};
	},
	etagMismatchProblem() {
		return {
			type: 'https://rankup.dev/problems/etag-mismatch',
			title: 'Precondition Failed',
			status: 412,
			code: 'etagMismatch',
			detail: 'If-Match precondition failed',
		};
	},
};
