import type { IMediaAssetsService } from '../contracts/mediaAssets.js';
import type { IMediaAssetsGateway as MediaAssetsGateway } from '../contracts/mediaAssetsGateway.js';
import { IMediaAssetsGateway } from '../contracts/mediaAssetsGateway.js';
import type { DeleteMediaParams, GetMediaParams, GetMediaQuery, Media } from '../contracts/types.js';

export class MediaAssetsService implements IMediaAssetsService {
	public constructor(@IMediaAssetsGateway private readonly gateway: MediaAssetsGateway) {}

	public async getMedia(params: GetMediaParams, query?: GetMediaQuery): Promise<Media> {
		return this.gateway.getMedia(params, query);
	}

	public async deleteMedia(params: DeleteMediaParams): Promise<void> {
		return this.gateway.deleteMedia(params);
	}
}
