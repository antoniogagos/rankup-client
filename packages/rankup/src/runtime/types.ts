import type { TournamentJoinPolicy, TournamentTiming } from '../domains/tournaments/core/models/tournament.js';
import type { RankingScope, RankingState, TournamentStatus } from '../domains/tournaments/shared/models/enums.js';
import type { MatchId, RulesetId, TournamentId, UserId } from '../domains/tournaments/shared/models/ids.js';
import type { SubmissionItemRejectionReason, SubmissionStatus } from '../domains/submissions/shared/models/enums.js';
import type { CanonicalMatchStatus } from '../registry/sports/types.js';
import type { JsonObject, JsonValue } from '../shared/models/json.js';

export type EngineRole = 'owner' | 'admin' | 'moderator' | 'player' | 'staff';

export type EngineTournament = {
	tournamentId: TournamentId;
	sportId: string;
	gameModeId: string;
	rulesetId: RulesetId;
	status: TournamentStatus;
	joinPolicy: TournamentJoinPolicy;
	timing?: TournamentTiming;
	version: number;
};

export type EngineMembership = {
	tournamentId: TournamentId;
	userId: UserId;
	role: Exclude<EngineRole, 'staff'>;
	joinedAt: string;
};

export type EnginePrediction = {
	matchId: MatchId;
	homeScore: number;
	awayScore: number;
	submittedAt: string;
	updatedAt: string;
};

export type EngineSubmission = {
	tournamentId: TournamentId;
	matchday: number;
	userId: UserId;
	version: number;
	predictions: Record<string, EnginePrediction>;
	completion: {
		submittedCount: number;
		expectedCount: number;
		status: SubmissionStatus;
	};
	submissionCompleteAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type EngineMatch = {
	tournamentId: TournamentId;
	matchday: number;
	matchId: MatchId;
	scheduledAt: string;
	lockState: 'open' | 'locked';
	status: CanonicalMatchStatus;
	finalOutcomeType?: 'regular' | 'extra_time' | 'penalty_shootout';
	score: {
		home: number | null;
		away: number | null;
	};
	resultFingerprint: string;
};

export type EngineRankingEntry = {
	position: number;
	userId: UserId;
	points: number;
	metrics: {
		exactScores: number;
		correctOutcomes: number;
		exactGoalsOneTeam: number;
		earliestSubmission: string | null;
		randomSeed: string;
	};
};

export type EngineRankingSnapshot = {
	snapshotId: string;
	parentSnapshotId: string | null;
	tournamentId: TournamentId;
	scope: RankingScope;
	matchday?: number;
	state: RankingState;
	computedAt: string;
	reason: string;
	rulesetId: RulesetId;
	entries: EngineRankingEntry[];
};

export type SubmissionItemRejection = {
	subjectType: 'match';
	subjectId: string;
	reason: SubmissionItemRejectionReason;
	message?: string;
};

export type EngineProblemCode =
	| 'idempotencyKeyReused'
	| 'idempotencyOutcomeInvalid'
	| 'etagMismatch'
	| 'tournamentLocked'
	| 'joinClosed'
	| 'tournamentFull'
	| 'tournamentArchived'
	| 'tournamentCancelled'
	| 'matchdayClosed'
	| 'submissionLocked'
	| 'notMember'
	| 'forbiddenRole'
	| 'notFound';

export type EngineProblem = {
	type: string;
	title: string;
	status: number;
	detail: string;
	code: EngineProblemCode;
	requestId?: string;
	errors?: Array<{ path: string; message: string }>;
};

export type IdempotencyScope = {
	actorId: string;
	operationId: string;
	resourceKey: string;
	idempotencyKey: string;
};

export type IdempotencyOutcome = {
	requestFingerprint: string;
	status: number;
	body: JsonValue | undefined;
	headers: Record<string, string>;
};

export type DomainEvent = {
	eventId: string;
	type: string;
	occurredAt: string;
	requestId?: string;
	correlationId?: string;
	causationId?: string;
	payload: JsonObject;
};

export type RuntimeResponse<TBody> = {
	status: number;
	body: TBody;
	headers: Record<string, string>;
};
