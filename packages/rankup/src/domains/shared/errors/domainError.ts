export type DomainErrorKind =
	| 'Unknown'
	| 'NotFound'
	| 'SubmissionLocked'
	| 'MatchdayClosed'
	| 'TournamentLocked'
	| 'TournamentArchived'
	| 'TournamentCancelled'
	| 'TournamentFull'
	| 'JoinClosed'
	| 'NotMember'
	| 'IdempotencyKeyReused'
	| 'IdempotencyOutcomeInvalid'
	| 'EtagMismatch'
	| 'ForbiddenRole'
	| 'ValidationFailed'
	| 'RateLimited'
	| 'ServerError'
	| 'Conflict'
	| 'Unauthorized'
	| 'Forbidden';

export type DomainErrorItem = {
	path?: string;
	code?: string;
	message?: string;
};

export type DomainError = {
	kind: DomainErrorKind;
	message: string;
	status?: number;
	code?: string;
	type?: string;
	title?: string;
	detail?: string;
	requestId?: string;
	errors?: DomainErrorItem[];
	raw?: unknown;
};
