import type { DeleteMediaParams, GetMediaParams, GetMediaQuery, Media } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IMediaAssetsService {
	getMedia(params: GetMediaParams, query?: GetMediaQuery): Promise<Media>;
	deleteMedia(params: DeleteMediaParams): Promise<void>;
}

export const IMediaAssetsService = createDecorator<IMediaAssetsService>('mediaAssetsService');
