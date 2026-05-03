import { submissionsDtoFixtures } from '../dto/submissions.dto.js';

export const submissionsDomainFixtures = {
	matchdaySubmission() {
		return submissionsDtoFixtures.matchdaySubmission();
	},
	upsertMatchdaySubmissionResult() {
		return submissionsDtoFixtures.upsertMatchdaySubmissionResult();
	},
};
