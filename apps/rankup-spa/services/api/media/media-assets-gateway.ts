import { mapMedia } from './media-mappers.js';
import type * as Api from '@rankup/api';
import type { IMediaAssetsGateway } from '@rankup/rankup/domains/media/assets/contracts/mediaAssetsGateway.js';
import type * as Domain from '@rankup/rankup/domains/media/assets/contracts/types.js';

const mapGetMediaQuery = (query?: Domain.GetMediaQuery): Api.GetMediaQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class MediaAssetsGateway implements IMediaAssetsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getMedia(params: Domain.GetMediaParams, query?: Domain.GetMediaQuery): Promise<Domain.Media> {
		const response = await this.apiClient.getMedia({ mediaId: params.mediaId }, mapGetMediaQuery(query));
		return mapMedia(response);
	}

	public async deleteMedia(params: Domain.DeleteMediaParams): Promise<void> {
		await this.apiClient.deleteMedia({ mediaId: params.mediaId });
	}
}
