import type { IMediaUploadsService } from '../contracts/mediaUploads.js';
import type { IMediaUploadsGateway as MediaUploadsGateway } from '../contracts/mediaUploadsGateway.js';
import { IMediaUploadsGateway } from '../contracts/mediaUploadsGateway.js';
import type { AbortUploadParams, CompleteUploadParams, CompleteUploadRequest, CompleteUploadResult, CreateUploadRequest, GetUploadParams, UploadSession } from '../contracts/types.js';

export class MediaUploadsService implements IMediaUploadsService {
	public constructor(@IMediaUploadsGateway private readonly gateway: MediaUploadsGateway) {}

	public async createUpload(body: CreateUploadRequest): Promise<UploadSession> {
		return this.gateway.createUpload(body);
	}

	public async getUpload(params: GetUploadParams): Promise<UploadSession> {
		return this.gateway.getUpload(params);
	}

	public async abortUpload(params: AbortUploadParams): Promise<void> {
		return this.gateway.abortUpload(params);
	}

	public async completeUpload(params: CompleteUploadParams, body: CompleteUploadRequest): Promise<CompleteUploadResult> {
		return this.gateway.completeUpload(params, body);
	}
}
