import type { IRankedSeasonsService } from '../contracts/rankedSeasons.js';
import type { IRankedSeasonsGateway as RankedSeasonsGateway } from '../contracts/rankedSeasonsGateway.js';
import { IRankedSeasonsGateway } from '../contracts/rankedSeasonsGateway.js';
import type { GetRankedMetaQuery, GetRankedSeasonParams, GetRankedSeasonQuery, GetRankedTrackParams, GetRankedTrackQuery, ListRankedSeasonsParams, ListRankedSeasonsQuery, ListRankedTracksQuery, RankedMeta, RankedSeason, RankedSeasonPage, RankedTrack, RankedTrackPage } from '../contracts/types.js';

export class RankedSeasonsService implements IRankedSeasonsService {
	public constructor(@IRankedSeasonsGateway private readonly gateway: RankedSeasonsGateway) {}

	public async getRankedMeta(query?: GetRankedMetaQuery): Promise<RankedMeta> {
		return this.gateway.getRankedMeta(query);
	}

	public async listRankedTracks(query?: ListRankedTracksQuery): Promise<RankedTrackPage> {
		return this.gateway.listRankedTracks(query);
	}

	public async getRankedTrack(params: GetRankedTrackParams, query?: GetRankedTrackQuery): Promise<RankedTrack> {
		return this.gateway.getRankedTrack(params, query);
	}

	public async listRankedSeasons(
		params: ListRankedSeasonsParams,
		query?: ListRankedSeasonsQuery,
	): Promise<RankedSeasonPage> {
		return this.gateway.listRankedSeasons(params, query);
	}

	public async getRankedSeason(params: GetRankedSeasonParams, query?: GetRankedSeasonQuery): Promise<RankedSeason> {
		return this.gateway.getRankedSeason(params, query);
	}
}
