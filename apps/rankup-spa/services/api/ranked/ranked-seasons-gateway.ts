import { mapRankedMeta, mapRankedSeason, mapRankedSeasonPage, mapRankedTrack, mapRankedTrackPage } from './ranked-mappers.js';
import type * as Api from '@rankup/api';
import type { IRankedSeasonsGateway } from '@rankup/rankup/domains/ranked/seasons/contracts/rankedSeasonsGateway.js';
import type * as Domain from '@rankup/rankup/domains/ranked/seasons/contracts/types.js';

const mapGetRankedMetaQuery = (query?: Domain.GetRankedMetaQuery): Api.GetRankedMetaQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapListRankedTracksQuery = (query?: Domain.ListRankedTracksQuery): Api.ListRankedTracksQuery | undefined =>
	query
		? {
			status: query.status,
			scopeKind: query.scopeKind,
			gameModeId: query.gameModeId,
			sportId: query.sportId,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetRankedTrackQuery = (query?: Domain.GetRankedTrackQuery): Api.GetRankedTrackQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapListRankedSeasonsQuery = (query?: Domain.ListRankedSeasonsQuery): Api.ListRankedSeasonsQuery | undefined =>
	query
		? {
			status: query.status,
			include: query.include,
			sort: query.sort,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetRankedSeasonQuery = (query?: Domain.GetRankedSeasonQuery): Api.GetRankedSeasonQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

export class RankedSeasonsGateway implements IRankedSeasonsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getRankedMeta(query?: Domain.GetRankedMetaQuery): Promise<Domain.RankedMeta> {
		const response = await this.apiClient.getRankedMeta(mapGetRankedMetaQuery(query));
		return mapRankedMeta(response);
	}

	public async listRankedTracks(query?: Domain.ListRankedTracksQuery): Promise<Domain.RankedTrackPage> {
		const response = await this.apiClient.listRankedTracks(mapListRankedTracksQuery(query));
		return mapRankedTrackPage(response);
	}

	public async getRankedTrack(
		params: Domain.GetRankedTrackParams,
		query?: Domain.GetRankedTrackQuery,
	): Promise<Domain.RankedTrack> {
		const response = await this.apiClient.getRankedTrack({ rankedTrackId: params.rankedTrackId }, mapGetRankedTrackQuery(query));
		return mapRankedTrack(response);
	}

	public async listRankedSeasons(
		params: Domain.ListRankedSeasonsParams,
		query?: Domain.ListRankedSeasonsQuery,
	): Promise<Domain.RankedSeasonPage> {
		const response = await this.apiClient.listRankedSeasons({ rankedTrackId: params.rankedTrackId }, mapListRankedSeasonsQuery(query));
		return mapRankedSeasonPage(response);
	}

	public async getRankedSeason(
		params: Domain.GetRankedSeasonParams,
		query?: Domain.GetRankedSeasonQuery,
	): Promise<Domain.RankedSeason> {
		const response = await this.apiClient.getRankedSeason(
			{ rankedTrackId: params.rankedTrackId, rankedSeasonId: params.rankedSeasonId },
			mapGetRankedSeasonQuery(query),
		);
		return mapRankedSeason(response);
	}
}
