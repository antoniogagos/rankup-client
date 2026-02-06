import type { MediaInclude } from '../../shared/models/enums.js';
import type { MediaId } from '../../shared/models/ids.js';

export type GetMediaParams = {
	mediaId: MediaId;
};

export type GetMediaQuery = {
	include?: MediaInclude[];
};

export type DeleteMediaParams = {
	mediaId: MediaId;
};
