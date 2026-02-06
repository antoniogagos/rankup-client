import type { MediaId, UploadId } from '../../shared/models/ids.js';
import type { MediaKind, MediaVisibility, UploadStatus } from '../../shared/models/enums.js';
import type { Checksum, ImageHints, Media, MediaPurpose, MediaScope, UploadConstraints, UploadDestination } from '../../shared/models/media.js';

export type CreateUploadRequest = {
	purpose: MediaPurpose;
	scope?: MediaScope;
	visibility?: MediaVisibility;
	kind?: MediaKind;
	fileName?: string;
	contentType: string;
	sizeBytes?: number;
	checksum?: Checksum;
	imageHints?: ImageHints;
	clientContext?: Record<string, unknown>;
};

export type UploadSession = {
	uploadId: UploadId;
	status: UploadStatus;
	purpose: MediaPurpose;
	scope?: MediaScope;
	visibility?: MediaVisibility;
	kind?: MediaKind;
	constraints: UploadConstraints;
	destination?: UploadDestination;
	createdAt: string;
	expiresAt?: string;
	failureReason?: string;
	mediaId?: MediaId;
};

export type ImageCrop = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type CompleteUploadRequest = {
	storage?: {
		etag?: string;
		sizeBytes?: number;
		contentType?: string;
		checksum?: Checksum;
	};
	imageCrop?: ImageCrop;
	makePrimary?: boolean;
	notes?: string;
};

export type GetUploadParams = {
	uploadId: UploadId;
};

export type AbortUploadParams = {
	uploadId: UploadId;
};

export type CompleteUploadParams = {
	uploadId: UploadId;
};

export type CompleteUploadResult = Media | UploadSession;
