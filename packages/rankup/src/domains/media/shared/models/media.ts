import type { TournamentId, UserId } from '../../../tournaments/shared/models/ids.js';
import type { VerifiedEventId } from '../../../verified/shared/models/ids.js';
import type { ChecksumAlgorithm, MediaKind, MediaModerationStatus, MediaStatus, MediaVisibility } from './enums.js';
import type { MediaId, MediaVariantId } from './ids.js';

export type MediaPurpose = string;

export type Checksum = {
	algorithm: ChecksumAlgorithm;
	value: string;
};

export type MediaScope = {
	userId?: UserId;
	tournamentId?: TournamentId;
	creatorId?: string;
	verifiedEventId?: VerifiedEventId;
	promotionId?: string;
	reportId?: string;
};

export type ImageHints = {
	width?: number;
	height?: number;
};

export type UploadConstraints = {
	maxSizeBytes: number;
	allowedContentTypes: string[];
	recommendedAspectRatio?: string;
	minWidth?: number;
	minHeight?: number;
	maxWidth?: number;
	maxHeight?: number;
};

export type UploadDestinationSinglePut = {
	strategy: 'singlePut';
	method: 'PUT';
	url: string;
	requiredHeaders?: Record<string, string>;
	expiresAt: string;
};

export type UploadDestinationMultipartFormPost = {
	strategy: 'multipartFormPost';
	method: 'POST';
	url: string;
	formFields: Record<string, string>;
	expiresAt: string;
};

export type UploadDestination = UploadDestinationSinglePut | UploadDestinationMultipartFormPost;

export type MediaUrl = {
	url: string;
	expiresAt?: string;
};

export type MediaVariant = {
	variantId: MediaVariantId;
	contentType: string;
	width?: number;
	height?: number;
	bytes?: number;
	url: MediaUrl;
};

export type MediaModeration = {
	status: MediaModerationStatus;
	reasonCode?: string;
	message?: string;
};

export type Media = {
	mediaId: MediaId;
	status: MediaStatus;
	kind: MediaKind;
	purpose: MediaPurpose;
	scope?: MediaScope;
	visibility: MediaVisibility;
	contentType: string;
	bytes?: number;
	checksum?: Checksum;
	width?: number;
	height?: number;
	moderation?: MediaModeration;
	variants?: MediaVariant[];
	createdAt: string;
	deletedAt?: string;
};
