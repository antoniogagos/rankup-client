import type { UserId } from '../../shared/models/ids.js';

export type Me = {
	userId: UserId;
	username: string;
	email: string;
	emailVerified: boolean;
	createdAt: string;
	updatedAt?: string;
	pictureUrl?: string;
};

export type UpdateMeRequest = {
	username?: string;
	pictureUrl?: string;
	bio?: string;
};
