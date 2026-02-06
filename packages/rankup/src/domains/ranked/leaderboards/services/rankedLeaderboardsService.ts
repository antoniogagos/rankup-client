import type { IRankedLeaderboardsService } from '../contracts/rankedLeaderboards.js';
import type { IRankedLeaderboardsGateway as RankedLeaderboardsGateway } from '../contracts/rankedLeaderboardsGateway.js';
import { IRankedLeaderboardsGateway } from '../contracts/rankedLeaderboardsGateway.js';
import type { GetMyRankedProfileQuery, GetMyRankedTrackParams, GetMyRankedTrackQuery, GetRankedLeaderboardParams, GetRankedLeaderboardQuery, GetRankedSeasonLeaderboardParams, GetRankedSeasonLeaderboardQuery, GetUserRankedProfileParams, GetUserRankedProfileQuery, GetUserRankedTrackParams, GetUserRankedTrackQuery, ListMyRankedHistoryParams, ListMyRankedHistoryQuery, MyRankedProfile, MyRankedTrackStanding, PublicRankedProfile, PublicRankedTrackStanding, RankedHistoryPage, RankedLeaderboard, RankedSettings, UpdateRankedSettingsRequest } from '../contracts/types.js';

export class RankedLeaderboardsService implements IRankedLeaderboardsService {
	public constructor(@IRankedLeaderboardsGateway private readonly gateway: RankedLeaderboardsGateway) {}

	public async getRankedLeaderboard(
		params: GetRankedLeaderboardParams,
		query?: GetRankedLeaderboardQuery,
	): Promise<RankedLeaderboard> {
		return this.gateway.getRankedLeaderboard(params, query);
	}

	public async getRankedSeasonLeaderboard(
		params: GetRankedSeasonLeaderboardParams,
		query?: GetRankedSeasonLeaderboardQuery,
	): Promise<RankedLeaderboard> {
		return this.gateway.getRankedSeasonLeaderboard(params, query);
	}

	public async getMyRankedProfile(query?: GetMyRankedProfileQuery): Promise<MyRankedProfile> {
		return this.gateway.getMyRankedProfile(query);
	}

	public async getMyRankedSettings(): Promise<RankedSettings> {
		return this.gateway.getMyRankedSettings();
	}

	public async updateMyRankedSettings(body: UpdateRankedSettingsRequest): Promise<RankedSettings> {
		return this.gateway.updateMyRankedSettings(body);
	}

	public async getMyRankedTrack(
		params: GetMyRankedTrackParams,
		query?: GetMyRankedTrackQuery,
	): Promise<MyRankedTrackStanding> {
		return this.gateway.getMyRankedTrack(params, query);
	}

	public async listMyRankedHistory(
		params: ListMyRankedHistoryParams,
		query?: ListMyRankedHistoryQuery,
	): Promise<RankedHistoryPage> {
		return this.gateway.listMyRankedHistory(params, query);
	}

	public async getUserRankedProfile(
		params: GetUserRankedProfileParams,
		query?: GetUserRankedProfileQuery,
	): Promise<PublicRankedProfile> {
		return this.gateway.getUserRankedProfile(params, query);
	}

	public async getUserRankedTrack(
		params: GetUserRankedTrackParams,
		query?: GetUserRankedTrackQuery,
	): Promise<PublicRankedTrackStanding> {
		return this.gateway.getUserRankedTrack(params, query);
	}
}
