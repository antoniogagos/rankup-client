import type { AppealId, EnforcementActionId } from '../../shared/models/ids.js';

export type AppealStatus = 'submitted' | 'underReview' | 'resolved' | 'rejected' | 'accepted';

export type CreateAppealRequest = {
	actionId: EnforcementActionId;
	message: string;
	attachments?: string[];
};

export type Appeal = {
	appealId: AppealId;
	actionId: EnforcementActionId;
	status: AppealStatus;
	message?: string;
	responseMessage?: string;
	createdAt: string;
	updatedAt?: string;
};

export type AppealPage = {
	items: Appeal[];
	nextCursor?: string;
};

export type ListMyAppealsQuery = {
	status?: AppealStatus;
	cursor?: string;
	pageSize?: number;
};

export type GetMyAppealParams = {
	appealId: AppealId;
};
