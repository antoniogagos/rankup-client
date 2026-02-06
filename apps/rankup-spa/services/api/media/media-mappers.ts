import { mapOptional } from '../gateway-mapping.js';
import type * as Api from '@rankup/api';
import type * as Assets from '@rankup/rankup/domains/media/assets/contracts/types.js';
import type * as Uploads from '@rankup/rankup/domains/media/uploads/contracts/types.js';

export function mapChecksum(checksum: Api.Checksum): Uploads.Checksum {
	return {
		algorithm: checksum.algorithm,
		value: checksum.value,
	};
}

export function mapMediaScope(scope: Api.MediaScope): Uploads.MediaScope {
	return {
		userId: scope.userId,
		tournamentId: scope.tournamentId,
		creatorId: scope.creatorId,
		verifiedEventId: scope.verifiedEventId,
		promotionId: scope.promotionId,
		reportId: scope.reportId,
	};
}

export function mapImageHints(hints: Api.ImageHints): Uploads.ImageHints {
	return {
		width: hints.width,
		height: hints.height,
	};
}

export function mapUploadConstraints(constraints: Api.UploadConstraints): Uploads.UploadConstraints {
	return {
		maxSizeBytes: constraints.maxSizeBytes,
		allowedContentTypes: constraints.allowedContentTypes,
		recommendedAspectRatio: constraints.recommendedAspectRatio,
		minWidth: constraints.minWidth,
		minHeight: constraints.minHeight,
		maxWidth: constraints.maxWidth,
		maxHeight: constraints.maxHeight,
	};
}

export function mapUploadDestinationSinglePut(destination: Api.UploadDestinationSinglePut): Uploads.UploadDestinationSinglePut {
	return {
		strategy: 'singlePut',
		method: destination.method,
		url: destination.url,
		requiredHeaders: destination.requiredHeaders,
		expiresAt: destination.expiresAt,
	};
}

export function mapUploadDestinationMultipartFormPost(
	destination: Api.UploadDestinationMultipartFormPost,
): Uploads.UploadDestinationMultipartFormPost {
	return {
		strategy: 'multipartFormPost',
		method: destination.method,
		url: destination.url,
		formFields: destination.formFields,
		expiresAt: destination.expiresAt,
	};
}

const isUploadDestinationSinglePut = (
	destination: Api.UploadDestination,
): destination is Api.UploadDestinationSinglePut => destination.method === 'PUT';

export function mapUploadDestination(destination: Api.UploadDestination): Uploads.UploadDestination {
	if (isUploadDestinationSinglePut(destination)) {
		return mapUploadDestinationSinglePut(destination);
	}
	return mapUploadDestinationMultipartFormPost(destination);
}

export function mapUploadSession(session: Api.UploadSession): Uploads.UploadSession {
	return {
		uploadId: session.uploadId,
		status: session.status,
		purpose: session.purpose,
		scope: mapOptional(session.scope, mapMediaScope),
		visibility: session.visibility,
		kind: session.kind,
		constraints: mapUploadConstraints(session.constraints),
		destination: mapOptional(session.destination, mapUploadDestination),
		createdAt: session.createdAt,
		expiresAt: session.expiresAt,
		failureReason: session.failureReason,
		mediaId: session.mediaId,
	};
}

export function mapMediaUrl(url: Api.MediaUrl): Assets.MediaUrl {
	return {
		url: url.url,
		expiresAt: url.expiresAt,
	};
}

export function mapMediaVariant(variant: Api.MediaVariant): Assets.MediaVariant {
	return {
		variantId: variant.variantId,
		contentType: variant.contentType,
		width: variant.width,
		height: variant.height,
		bytes: variant.bytes,
		url: mapMediaUrl(variant.url),
	};
}

export function mapMediaModeration(moderation: Api.MediaModeration): Assets.MediaModeration {
	return {
		status: moderation.status,
		reasonCode: moderation.reasonCode,
		message: moderation.message,
	};
}

export function mapMedia(media: Api.Media): Assets.Media {
	return {
		mediaId: media.mediaId,
		status: media.status,
		kind: media.kind,
		purpose: media.purpose,
		scope: mapOptional(media.scope, mapMediaScope),
		visibility: media.visibility,
		contentType: media.contentType,
		bytes: media.bytes,
		checksum: mapOptional(media.checksum, mapChecksum),
		width: media.width,
		height: media.height,
		moderation: mapOptional(media.moderation, mapMediaModeration),
		variants: media.variants?.map(mapMediaVariant),
		createdAt: media.createdAt,
		deletedAt: media.deletedAt,
	};
}

export function mapMediaScopeRequest(scope: Uploads.MediaScope): Api.MediaScope {
	return {
		userId: scope.userId,
		tournamentId: scope.tournamentId,
		creatorId: scope.creatorId,
		verifiedEventId: scope.verifiedEventId,
		promotionId: scope.promotionId,
		reportId: scope.reportId,
	};
}

export function mapImageHintsRequest(hints: Uploads.ImageHints): Api.ImageHints {
	return {
		width: hints.width,
		height: hints.height,
	};
}

export function mapCreateUploadRequest(body: Uploads.CreateUploadRequest): Api.CreateUploadRequest {
	return {
		purpose: body.purpose,
		scope: mapOptional(body.scope, mapMediaScopeRequest),
		visibility: body.visibility,
		kind: body.kind,
		fileName: body.fileName,
		contentType: body.contentType,
		sizeBytes: body.sizeBytes,
		checksum: mapOptional(body.checksum, mapChecksum),
		imageHints: mapOptional(body.imageHints, mapImageHintsRequest),
		clientContext: body.clientContext,
	};
}

export function mapImageCropRequest(crop: Uploads.ImageCrop): Api.ImageCrop {
	return {
		x: crop.x,
		y: crop.y,
		width: crop.width,
		height: crop.height,
	};
}

export function mapCompleteUploadRequest(body: Uploads.CompleteUploadRequest): Api.CompleteUploadRequest {
	return {
		storage: mapOptional(body.storage, storage => ({
			etag: storage.etag,
			sizeBytes: storage.sizeBytes,
			contentType: storage.contentType,
			checksum: mapOptional(storage.checksum, mapChecksum),
		})),
		imageCrop: mapOptional(body.imageCrop, mapImageCropRequest),
		makePrimary: body.makePrimary,
		notes: body.notes,
	};
}

export function mapCompleteUploadResult(result: Api.Media | Api.UploadSession): Uploads.CompleteUploadResult {
	if ('uploadId' in result) {
		return mapUploadSession(result);
	}
	return mapMedia(result);
}
