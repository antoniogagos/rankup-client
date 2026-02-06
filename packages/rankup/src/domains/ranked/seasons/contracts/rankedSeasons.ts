import type { GetRankedMetaQuery, GetRankedSeasonParams, GetRankedSeasonQuery, GetRankedTrackParams, GetRankedTrackQuery, ListRankedSeasonsParams, ListRankedSeasonsQuery, ListRankedTracksQuery, RankedMeta, RankedSeason, RankedSeasonPage, RankedTrack, RankedTrackPage } from './types.js';
import { createDecorator } from '@rankup/platform/instantiation/common/decorators.js';

export interface IRankedSeasonsService {
	getRankedMeta(query?: GetRankedMetaQuery): Promise<RankedMeta>;
	listRankedTracks(query?: ListRankedTracksQuery): Promise<RankedTrackPage>;
	getRankedTrack(params: GetRankedTrackParams, query?: GetRankedTrackQuery): Promise<RankedTrack>;
	listRankedSeasons(params: ListRankedSeasonsParams, query?: ListRankedSeasonsQuery): Promise<RankedSeasonPage>;
	getRankedSeason(params: GetRankedSeasonParams, query?: GetRankedSeasonQuery): Promise<RankedSeason>;
}

export const IRankedSeasonsService = createDecorator<IRankedSeasonsService>('rankedSeasonsService');
