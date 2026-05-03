import { defineSharedKeys, pickFields } from '../gateway-mapping.js';
import { mapProblemToDomainError } from '../problem/mapProblemToDomainError.js';
import type * as Api from '@rankup/api';
import type { DomainError } from '@rankup/rankup/domains/shared/errors/domainError.js';
import type * as Domain from '@rankup/rankup/domains/submissions/scorePrediction/contracts/types.js';

const userSummaryKeys = defineSharedKeys<Domain.UserSummary, Api.MeSummary>()(['userId', 'username', 'pictureUrl']);
const submissionCompletionKeys = defineSharedKeys<Domain.SubmissionCompletion, Api.SubmissionCompletion>()([
	'submittedCount',
	'expectedCount',
	'status',
]);
const submissionItemRejectionKeys = defineSharedKeys<Domain.SubmissionItemRejection, Api.SubmissionItemRejection>()([
	'subjectType',
	'subjectId',
	'reason',
	'message',
]);
const matchdaySubmissionBaseKeys = defineSharedKeys<Domain.MatchdaySubmissionBase, Api.MatchdaySubmissionBase>()([
	'submissionId',
	'tournamentId',
	'matchday',
	'userId',
	'gameModeId',
	'serverTime',
	'scope',
	'visibility',
	'createdAt',
	'updatedAt',
]);
const predictionViewKeys = defineSharedKeys<Domain.ScorePredictionPredictionView, Api.ScorePredictionPredictionView>()([
	'matchId',
	'visibility',
	'isSubmitted',
	'homeScore',
	'awayScore',
	'lockState',
	'lockAt',
	'submittedAt',
	'updatedAt',
]);

export const mapUserSummary = (user: Api.MeSummary): Domain.UserSummary => pickFields(user, userSummaryKeys);

export const mapSubmissionCompletion = (completion: Api.SubmissionCompletion): Domain.SubmissionCompletion =>
	pickFields(completion, submissionCompletionKeys);

export const mapSubmissionItemRejection = (rejection: Api.SubmissionItemRejection): Domain.SubmissionItemRejection =>
	pickFields(rejection, submissionItemRejectionKeys);

const mapMatchdaySubmissionBase = (submission: Api.MatchdaySubmissionBase): Domain.MatchdaySubmissionBase => ({
	...pickFields(submission, matchdaySubmissionBaseKeys),
	completion: mapSubmissionCompletion(submission.completion),
});

export const mapScorePredictionPredictionView = (
	prediction: Api.ScorePredictionPredictionView,
): Domain.ScorePredictionPredictionView => pickFields(prediction, predictionViewKeys);

export const mapScorePredictionMatchdaySubmission = (
	submission: Api.ScorePredictionMatchdaySubmission,
): Domain.ScorePredictionMatchdaySubmission => ({
	...mapMatchdaySubmissionBase(submission),
	gameModeId: 'scorePrediction',
	predictions: submission.predictions.map(mapScorePredictionPredictionView),
});

export const mapGenericMatchdaySubmission = (submission: Api.GenericMatchdaySubmission): Domain.GenericMatchdaySubmission => ({
	...mapMatchdaySubmissionBase(submission),
	items: submission.items,
});

const isScorePredictionMatchdaySubmission = (
	submission: Api.MatchdaySubmission,
): submission is Api.ScorePredictionMatchdaySubmission => submission.gameModeId === 'scorePrediction' && Array.isArray(submission.predictions);

export const mapMatchdaySubmission = (submission: Api.MatchdaySubmission): Domain.MatchdaySubmission => {
	if (isScorePredictionMatchdaySubmission(submission)) {
		return mapScorePredictionMatchdaySubmission(submission);
	}
	return mapGenericMatchdaySubmission(submission);
};

export const mapMatchdaySubmissionSummary = (
	summary: Api.MatchdaySubmissionSummary,
): Domain.MatchdaySubmissionSummary => ({
	user: mapUserSummary(summary.user),
	status: summary.status,
	completion: mapSubmissionCompletion(summary.completion),
	lastUpdatedAt: summary.lastUpdatedAt,
});

export const mapMatchdaySubmissionSummaryPage = (
	page: Api.MatchdaySubmissionSummaryPage,
): Domain.MatchdaySubmissionSummaryPage => ({
	serverTime: page.serverTime,
	items: page.items.map(mapMatchdaySubmissionSummary),
	nextCursor: page.nextCursor,
});

export const mapUpsertMatchdaySubmissionResult = (
	result: Api.UpsertMatchdaySubmissionResult,
): Domain.UpsertMatchdaySubmissionResult => ({
	submission: mapMatchdaySubmission(result.submission),
	applied: result.applied,
	rejected: result.rejected.map(mapSubmissionItemRejection),
});

export const mapSubmissionsProblemToDomainError = (problem: unknown): DomainError => mapProblemToDomainError(problem);
