import type { UserId } from './ids.js';

export type UserSummary = {
	userId: UserId;
	username: string;
	pictureUrl?: string;
};

export type MeSummary = UserSummary;
