import type { MatchdaySubmissionsInclude, MatchLockState, SubmissionItemRejectionReason, SubmissionItemSubjectType, SubmissionScope, SubmissionStatus, SubmissionStatusFilter, SubmissionVisibility } from '../../shared/models/enums.js';
import type { GameModeId, MatchId, SubmissionId, TournamentId, UserId } from '../../shared/models/ids.js';
import type { MeSummary } from '../../shared/models/user.js';

export type SubmissionCompletion = {
	submittedCount: number;
	expectedCount: number;
	status: SubmissionStatus;
};

export type SubmissionItemRejection = {
	subjectType: SubmissionItemSubjectType;
	subjectId: string;
	reason: SubmissionItemRejectionReason;
	message?: string;
};

export type MatchdaySubmissionBase = {
	submissionId: SubmissionId;
	tournamentId: TournamentId;
	matchday: number;
	userId: UserId;
	gameModeId: GameModeId;
	serverTime: string;
	scope: SubmissionScope;
	visibility: SubmissionVisibility;
	completion: SubmissionCompletion;
	createdAt?: string;
	updatedAt?: string;
};

export type ScorePredictionPredictionView = {
	matchId: MatchId;
	visibility: SubmissionVisibility;
	isSubmitted: boolean;
	homeScore?: number | null;
	awayScore?: number | null;
	lockState: MatchLockState;
	lockAt?: string;
	submittedAt?: string;
	updatedAt?: string;
};

export type ScorePredictionMatchdaySubmission = MatchdaySubmissionBase & {
	gameModeId: 'scorePrediction';
	predictions: ScorePredictionPredictionView[];
};

export type GenericMatchdaySubmission = MatchdaySubmissionBase & {
	items?: Record<string, unknown>[];
};

export type MatchdaySubmission = ScorePredictionMatchdaySubmission | GenericMatchdaySubmission;

export type ScorePredictionPredictionInput = {
	matchId: MatchId;
	homeScore: number;
	awayScore: number;
};

export type UpsertScorePredictionMatchdaySubmissionRequest = {
	gameModeId: 'scorePrediction';
	upserts?: ScorePredictionPredictionInput[];
	removes?: MatchId[];
	clientSubmittedAt?: string;
};

export type UpsertGenericMatchdaySubmissionRequest = {
	gameModeId: GameModeId;
} & Record<string, unknown>;

export type UpsertMatchdaySubmissionRequest =
	| UpsertScorePredictionMatchdaySubmissionRequest
	| UpsertGenericMatchdaySubmissionRequest;

export type UpsertMatchdaySubmissionResult = {
	submission: MatchdaySubmission;
	applied: string[];
	rejected: SubmissionItemRejection[];
};

export type MatchdaySubmissionSummary = {
	user: MeSummary;
	status: SubmissionStatus;
	completion: SubmissionCompletion;
	lastUpdatedAt?: string;
};

export type MatchdaySubmissionSummaryPage = {
	serverTime: string;
	items: MatchdaySubmissionSummary[];
	nextCursor?: string;
};

export type ListMatchdaySubmissionsParams = {
	tournamentId: TournamentId;
	matchday: number;
};

export type ListMatchdaySubmissionsQuery = {
	status?: SubmissionStatusFilter;
	q?: string;
	include?: MatchdaySubmissionsInclude[];
	cursor?: string;
	pageSize?: number;
};

export type GetMyMatchdaySubmissionParams = {
	tournamentId: TournamentId;
	matchday: number;
};

export type UpsertMyMatchdaySubmissionParams = {
	tournamentId: TournamentId;
	matchday: number;
	idempotencyKey?: string;
	ifMatch?: string;
};

export type ClearMyMatchdaySubmissionParams = {
	tournamentId: TournamentId;
	matchday: number;
	idempotencyKey?: string;
};

export type GetUserMatchdaySubmissionParams = {
	tournamentId: TournamentId;
	matchday: number;
	userId: UserId;
};
