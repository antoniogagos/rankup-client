import { mapMyRankedProfile, mapMyRankedTrackStanding, mapPublicRankedProfile, mapPublicRankedTrackStanding, mapRankedHistoryPage, mapRankedLeaderboard, mapRankedSettings } from './ranked-mappers.js';
import type * as Api from '@rankup/api';
import type { IRankedLeaderboardsGateway } from '@rankup/rankup/domains/ranked/leaderboards/contracts/rankedLeaderboardsGateway.js';
import type * as Domain from '@rankup/rankup/domains/ranked/leaderboards/contracts/types.js';

const mapGetRankedLeaderboardQuery = (query?: Domain.GetRankedLeaderboardQuery): Api.GetRankedLeaderboardQuery | undefined =>
	query
		? {
			seasonId: query.seasonId,
			view: query.view,
			region: query.region,
			include: query.include,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetRankedSeasonLeaderboardQuery = (
	query?: Domain.GetRankedSeasonLeaderboardQuery,
): Api.GetRankedSeasonLeaderboardQuery | undefined =>
	query
		? {
			view: query.view,
			region: query.region,
			include: query.include,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetMyRankedProfileQuery = (query?: Domain.GetMyRankedProfileQuery): Api.GetMyRankedProfileQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapGetMyRankedTrackQuery = (query?: Domain.GetMyRankedTrackQuery): Api.GetMyRankedTrackQuery | undefined =>
	query
		? {
			seasonId: query.seasonId,
		}
		: undefined;

const mapListMyRankedHistoryQuery = (query?: Domain.ListMyRankedHistoryQuery): Api.ListMyRankedHistoryQuery | undefined =>
	query
		? {
			seasonId: query.seasonId,
			since: query.since,
			until: query.until,
			cursor: query.cursor,
			pageSize: query.pageSize,
		}
		: undefined;

const mapGetUserRankedProfileQuery = (query?: Domain.GetUserRankedProfileQuery): Api.GetUserRankedProfileQuery | undefined =>
	query
		? {
			include: query.include,
		}
		: undefined;

const mapGetUserRankedTrackQuery = (query?: Domain.GetUserRankedTrackQuery): Api.GetUserRankedTrackQuery | undefined =>
	query
		? {
			seasonId: query.seasonId,
		}
		: undefined;

const mapUpdateRankedSettingsRequest = (body: Domain.UpdateRankedSettingsRequest): Api.UpdateMyRankedSettingsRequest => ({
	defaultVisibility: body.defaultVisibility,
	perTrackVisibility: body.perTrackVisibility,
	showOnPublicLeaderboards: body.showOnPublicLeaderboards,
	allowFriendComparisons: body.allowFriendComparisons,
});

export class RankedLeaderboardsGateway implements IRankedLeaderboardsGateway {
	public constructor(private readonly apiClient: Api.RankupApiClient) {}

	public async getRankedLeaderboard(
		params: Domain.GetRankedLeaderboardParams,
		query?: Domain.GetRankedLeaderboardQuery,
	): Promise<Domain.RankedLeaderboard> {
		const response = await this.apiClient.getRankedLeaderboard(
			{ rankedTrackId: params.rankedTrackId },
			mapGetRankedLeaderboardQuery(query),
		);
		return mapRankedLeaderboard(response);
	}

	public async getRankedSeasonLeaderboard(
		params: Domain.GetRankedSeasonLeaderboardParams,
		query?: Domain.GetRankedSeasonLeaderboardQuery,
	): Promise<Domain.RankedLeaderboard> {
		const response = await this.apiClient.getRankedSeasonLeaderboard(
			{ rankedTrackId: params.rankedTrackId, rankedSeasonId: params.rankedSeasonId },
			mapGetRankedSeasonLeaderboardQuery(query),
		);
		return mapRankedLeaderboard(response);
	}

	public async getMyRankedProfile(query?: Domain.GetMyRankedProfileQuery): Promise<Domain.MyRankedProfile> {
		const response = await this.apiClient.getMyRankedProfile(mapGetMyRankedProfileQuery(query));
		return mapMyRankedProfile(response);
	}

	public async getMyRankedSettings(): Promise<Domain.RankedSettings> {
		const response = await this.apiClient.getMyRankedSettings();
		return mapRankedSettings(response);
	}

	public async updateMyRankedSettings(body: Domain.UpdateRankedSettingsRequest): Promise<Domain.RankedSettings> {
		const response = await this.apiClient.updateMyRankedSettings(mapUpdateRankedSettingsRequest(body));
		return mapRankedSettings(response);
	}

	public async getMyRankedTrack(
		params: Domain.GetMyRankedTrackParams,
		query?: Domain.GetMyRankedTrackQuery,
	): Promise<Domain.MyRankedTrackStanding> {
		const response = await this.apiClient.getMyRankedTrack(
			{ rankedTrackId: params.rankedTrackId },
			mapGetMyRankedTrackQuery(query),
		);
		return mapMyRankedTrackStanding(response);
	}

	public async listMyRankedHistory(
		params: Domain.ListMyRankedHistoryParams,
		query?: Domain.ListMyRankedHistoryQuery,
	): Promise<Domain.RankedHistoryPage> {
		const response = await this.apiClient.listMyRankedHistory(
			{ rankedTrackId: params.rankedTrackId },
			mapListMyRankedHistoryQuery(query),
		);
		return mapRankedHistoryPage(response);
	}

	public async getUserRankedProfile(
		params: Domain.GetUserRankedProfileParams,
		query?: Domain.GetUserRankedProfileQuery,
	): Promise<Domain.PublicRankedProfile> {
		const response = await this.apiClient.getUserRankedProfile(
			{ userId: params.userId },
			mapGetUserRankedProfileQuery(query),
		);
		return mapPublicRankedProfile(response);
	}

	public async getUserRankedTrack(
		params: Domain.GetUserRankedTrackParams,
		query?: Domain.GetUserRankedTrackQuery,
	): Promise<Domain.PublicRankedTrackStanding> {
		const response = await this.apiClient.getUserRankedTrack(
			{ userId: params.userId, rankedTrackId: params.rankedTrackId },
			mapGetUserRankedTrackQuery(query),
		);
		return mapPublicRankedTrackStanding(response);
	}
}
