import { mapCompleteUploadRequest, mapCompleteUploadResult, mapCreateUploadRequest, mapUploadSession } from './media-mappers.js';
import type * as Api from '@rankup/api';
import type { IMediaUploadsGateway } from '@rankup/rankup/domains/media/uploads/contracts/mediaUploadsGateway.js';
import type * as Domain from '@rankup/rankup/domains/media/uploads/contracts/types.js';

export class MediaUploadsGateway implements IMediaUploadsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async createUpload(body: Domain.CreateUploadRequest): Promise<Domain.UploadSession> {
		const response = await this.apiClient.createUpload(mapCreateUploadRequest(body));
		return mapUploadSession(response);
	}

	public async getUpload(params: Domain.GetUploadParams): Promise<Domain.UploadSession> {
		const response = await this.apiClient.getUpload({ uploadId: params.uploadId });
		return mapUploadSession(response);
	}

	public async abortUpload(params: Domain.AbortUploadParams): Promise<void> {
		await this.apiClient.abortUpload({ uploadId: params.uploadId });
	}

	public async completeUpload(
		params: Domain.CompleteUploadParams,
		body: Domain.CompleteUploadRequest,
	): Promise<Domain.CompleteUploadResult> {
		const response = await this.apiClient.completeUpload({ uploadId: params.uploadId }, mapCompleteUploadRequest(body));
		return mapCompleteUploadResult(response);
	}
}
