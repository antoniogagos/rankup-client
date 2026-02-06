export type SubmissionStatusFilter = 'any' | 'missing' | 'partial' | 'complete';
export type MatchdaySubmissionsInclude = 'counts';
export type SubmissionVisibility = 'visible' | 'redacted';
export type SubmissionStatus = 'missing' | 'partial' | 'complete';
export type SubmissionScope = 'me' | 'other';
export type SubmissionItemSubjectType = string;
export type SubmissionItemRejectionReason =
	| 'locked'
	| 'invalid'
	| 'notInMatchday'
	| 'notInTournament'
	| 'tournamentLocked'
	| 'matchdayUnavailable'
	| 'notMember';
export type MatchLockState = 'open' | 'locked';
