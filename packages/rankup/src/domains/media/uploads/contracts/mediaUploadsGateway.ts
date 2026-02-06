import type { AbortUploadParams, CompleteUploadParams, CompleteUploadRequest, CompleteUploadResult, CreateUploadRequest, GetUploadParams, UploadSession } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IMediaUploadsGateway {
	createUpload(body: CreateUploadRequest): Promise<UploadSession>;
	getUpload(params: GetUploadParams): Promise<UploadSession>;
	abortUpload(params: AbortUploadParams): Promise<void>;
	completeUpload(params: CompleteUploadParams, body: CompleteUploadRequest): Promise<CompleteUploadResult>;
}

export const IMediaUploadsGateway = createDecorator<IMediaUploadsGateway>('mediaUploadsGateway');
