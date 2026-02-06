import type { IInstantiationService, ServicesAccessor } from '@rankup/platform/instantiation/common/instantiation.js';
import { ISessionManager } from '@rankup/platform/session/common/sessionManager.js';
import type { IAuthService as IAuthServiceContract } from '@rankup/rankup/domains/accounts/auth/contracts/auth.js';
import { IAuthService } from '@rankup/rankup/domains/accounts/auth/contracts/auth.js';
import type { IMeService as IMeServiceContract } from '@rankup/rankup/domains/accounts/me/contracts/me.js';
import { IMeService } from '@rankup/rankup/domains/accounts/me/contracts/me.js';
import type { ISocialService as ISocialServiceContract } from '@rankup/rankup/domains/accounts/social/contracts/social.js';
import { ISocialService } from '@rankup/rankup/domains/accounts/social/contracts/social.js';
import type { IUsersService as IUsersServiceContract } from '@rankup/rankup/domains/accounts/users/contracts/users.js';
import { IUsersService } from '@rankup/rankup/domains/accounts/users/contracts/users.js';
import type { IGameModesService as IGameModesServiceContract } from '@rankup/rankup/domains/rules/gameModes/contracts/gameModes.js';
import { IGameModesService } from '@rankup/rankup/domains/rules/gameModes/contracts/gameModes.js';
import type { IRulesetsService as IRulesetsServiceContract } from '@rankup/rankup/domains/rules/rulesets/contracts/rulesets.js';
import { IRulesetsService } from '@rankup/rankup/domains/rules/rulesets/contracts/rulesets.js';
import type { ITourneyRankingService as ITourneyRankingServiceContract } from '@rankup/rankup/domains/scoring/ranking/contracts/tourneyRanking.js';
import { ITourneyRankingService } from '@rankup/rankup/domains/scoring/ranking/contracts/tourneyRanking.js';
import type { ITourneyChatService as ITourneyChatServiceContract } from '@rankup/rankup/domains/engagement/chat/contracts/tourneyChat.js';
import { ITourneyChatService } from '@rankup/rankup/domains/engagement/chat/contracts/tourneyChat.js';
import type { ILiveService as ILiveServiceContract } from '@rankup/rankup/domains/engagement/live/contracts/live.js';
import { ILiveService } from '@rankup/rankup/domains/engagement/live/contracts/live.js';
import type { IRecapsService as IRecapsServiceContract } from '@rankup/rankup/domains/engagement/recaps/contracts/recaps.js';
import { IRecapsService } from '@rankup/rankup/domains/engagement/recaps/contracts/recaps.js';
import type { IStatsService as IStatsServiceContract } from '@rankup/rankup/domains/engagement/stats/contracts/stats.js';
import { IStatsService } from '@rankup/rankup/domains/engagement/stats/contracts/stats.js';
import type { IUpdatesService as IUpdatesServiceContract } from '@rankup/rankup/domains/engagement/updates/contracts/updates.js';
import { IUpdatesService } from '@rankup/rankup/domains/engagement/updates/contracts/updates.js';
import type { IAchievementsCatalogService as IAchievementsCatalogServiceContract } from '@rankup/rankup/domains/achievements/catalog/contracts/achievementsCatalog.js';
import { IAchievementsCatalogService } from '@rankup/rankup/domains/achievements/catalog/contracts/achievementsCatalog.js';
import type { IAchievementsGrantsService as IAchievementsGrantsServiceContract } from '@rankup/rankup/domains/achievements/grants/contracts/achievementsGrants.js';
import { IAchievementsGrantsService } from '@rankup/rankup/domains/achievements/grants/contracts/achievementsGrants.js';
import type { IMediaAssetsService as IMediaAssetsServiceContract } from '@rankup/rankup/domains/media/assets/contracts/mediaAssets.js';
import { IMediaAssetsService } from '@rankup/rankup/domains/media/assets/contracts/mediaAssets.js';
import type { IMediaUploadsService as IMediaUploadsServiceContract } from '@rankup/rankup/domains/media/uploads/contracts/mediaUploads.js';
import { IMediaUploadsService } from '@rankup/rankup/domains/media/uploads/contracts/mediaUploads.js';
import type { ITrustPoliciesService as ITrustPoliciesServiceContract } from '@rankup/rankup/domains/trustSafety/shared/contracts/trustPolicies.js';
import { ITrustPoliciesService } from '@rankup/rankup/domains/trustSafety/shared/contracts/trustPolicies.js';
import type { ITrustReportsService as ITrustReportsServiceContract } from '@rankup/rankup/domains/trustSafety/reports/contracts/trustReports.js';
import { ITrustReportsService } from '@rankup/rankup/domains/trustSafety/reports/contracts/trustReports.js';
import type { ITrustEnforcementService as ITrustEnforcementServiceContract } from '@rankup/rankup/domains/trustSafety/enforcement/contracts/trustEnforcement.js';
import { ITrustEnforcementService } from '@rankup/rankup/domains/trustSafety/enforcement/contracts/trustEnforcement.js';
import type { ITrustAppealsService as ITrustAppealsServiceContract } from '@rankup/rankup/domains/trustSafety/appeals/contracts/trustAppeals.js';
import { ITrustAppealsService } from '@rankup/rankup/domains/trustSafety/appeals/contracts/trustAppeals.js';
import type { IRankedLeaderboardsService as IRankedLeaderboardsServiceContract } from '@rankup/rankup/domains/ranked/leaderboards/contracts/rankedLeaderboards.js';
import { IRankedLeaderboardsService } from '@rankup/rankup/domains/ranked/leaderboards/contracts/rankedLeaderboards.js';
import type { IRankedSeasonsService as IRankedSeasonsServiceContract } from '@rankup/rankup/domains/ranked/seasons/contracts/rankedSeasons.js';
import { IRankedSeasonsService } from '@rankup/rankup/domains/ranked/seasons/contracts/rankedSeasons.js';
import type { IPromotionsCampaignsService as IPromotionsCampaignsServiceContract } from '@rankup/rankup/domains/promotions/campaigns/contracts/promotionsCampaigns.js';
import { IPromotionsCampaignsService } from '@rankup/rankup/domains/promotions/campaigns/contracts/promotionsCampaigns.js';
import type { IPromotionsRewardsService as IPromotionsRewardsServiceContract } from '@rankup/rankup/domains/promotions/rewards/contracts/promotionsRewards.js';
import { IPromotionsRewardsService } from '@rankup/rankup/domains/promotions/rewards/contracts/promotionsRewards.js';
import type { ICreatorsCatalogService as ICreatorsCatalogServiceContract } from '@rankup/rankup/domains/creators/catalog/contracts/creatorsCatalog.js';
import { ICreatorsCatalogService } from '@rankup/rankup/domains/creators/catalog/contracts/creatorsCatalog.js';
import type { ICreatorsDirectoryService as ICreatorsDirectoryServiceContract } from '@rankup/rankup/domains/creators/directory/contracts/creatorsDirectory.js';
import { ICreatorsDirectoryService } from '@rankup/rankup/domains/creators/directory/contracts/creatorsDirectory.js';
import type { IVerifiedEventsService as IVerifiedEventsServiceContract } from '@rankup/rankup/domains/verified/events/contracts/events.js';
import { IVerifiedEventsService } from '@rankup/rankup/domains/verified/events/contracts/events.js';
import type { IVerifiedHubService as IVerifiedHubServiceContract } from '@rankup/rankup/domains/verified/hub/contracts/hub.js';
import { IVerifiedHubService } from '@rankup/rankup/domains/verified/hub/contracts/hub.js';
import type { ISportsCatalogService as ISportsCatalogServiceContract } from '@rankup/rankup/domains/sports/catalog/contracts/sportsCatalog.js';
import { ISportsCatalogService } from '@rankup/rankup/domains/sports/catalog/contracts/sportsCatalog.js';
import type { ISportsScheduleService as ISportsScheduleServiceContract } from '@rankup/rankup/domains/sports/schedule/contracts/sportsSchedule.js';
import { ISportsScheduleService } from '@rankup/rankup/domains/sports/schedule/contracts/sportsSchedule.js';
import type { ITourneySubmissionsService as ITourneySubmissionsServiceContract } from '@rankup/rankup/domains/submissions/scorePrediction/contracts/tourneySubmissions.js';
import { ITourneySubmissionsService } from '@rankup/rankup/domains/submissions/scorePrediction/contracts/tourneySubmissions.js';
import type { ITourneyInvitationCodesService as ITourneyInvitationCodesServiceContract } from '@rankup/rankup/domains/tournaments/codes/contracts/tourneyInvitationCodes.js';
import { ITourneyInvitationCodesService } from '@rankup/rankup/domains/tournaments/codes/contracts/tourneyInvitationCodes.js';
import type { ITourneyCoreService as ITourneyCoreServiceContract } from '@rankup/rankup/domains/tournaments/core/contracts/tourneyCore.js';
import { ITourneyCoreService } from '@rankup/rankup/domains/tournaments/core/contracts/tourneyCore.js';
import type { ITourneyInvitesService as ITourneyInvitesServiceContract } from '@rankup/rankup/domains/tournaments/invites/contracts/tourneyInvites.js';
import { ITourneyInvitesService } from '@rankup/rankup/domains/tournaments/invites/contracts/tourneyInvites.js';
import type { ITourneyMatchdaysService as ITourneyMatchdaysServiceContract } from '@rankup/rankup/domains/tournaments/matchdays/contracts/tourneyMatchdays.js';
import { ITourneyMatchdaysService } from '@rankup/rankup/domains/tournaments/matchdays/contracts/tourneyMatchdays.js';
import type { ITourneyMembersService as ITourneyMembersServiceContract } from '@rankup/rankup/domains/tournaments/members/contracts/tourneyMembers.js';
import { ITourneyMembersService } from '@rankup/rankup/domains/tournaments/members/contracts/tourneyMembers.js';

export type TourneyServices = {
	core: ITourneyCoreServiceContract;
	matchdays: ITourneyMatchdaysServiceContract;
	ranking: ITourneyRankingServiceContract;
	members: ITourneyMembersServiceContract;
	codes: ITourneyInvitationCodesServiceContract;
	invites: ITourneyInvitesServiceContract;
};

export type SportsServices = {
	catalog: ISportsCatalogServiceContract;
	schedule: ISportsScheduleServiceContract;
};

export type RulesServices = {
	gameModes: IGameModesServiceContract;
	rulesets: IRulesetsServiceContract;
};

export type SubmissionsServices = {
	matchdays: ITourneySubmissionsServiceContract;
};

export type AccountsServices = {
	auth: IAuthServiceContract;
	me: IMeServiceContract;
	users: IUsersServiceContract;
	social: ISocialServiceContract;
};

export type EngagementServices = {
	chat: ITourneyChatServiceContract;
	live: ILiveServiceContract;
	recaps: IRecapsServiceContract;
	stats: IStatsServiceContract;
	updates: IUpdatesServiceContract;
};

export type AchievementsServices = {
	catalog: IAchievementsCatalogServiceContract;
	grants: IAchievementsGrantsServiceContract;
};

export type MediaServices = {
	uploads: IMediaUploadsServiceContract;
	assets: IMediaAssetsServiceContract;
};

export type TrustSafetyServices = {
	policies: ITrustPoliciesServiceContract;
	reports: ITrustReportsServiceContract;
	enforcement: ITrustEnforcementServiceContract;
	appeals: ITrustAppealsServiceContract;
};

export type VerifiedServices = {
	hub: IVerifiedHubServiceContract;
	events: IVerifiedEventsServiceContract;
};

export type RankedServices = {
	seasons: IRankedSeasonsServiceContract;
	leaderboards: IRankedLeaderboardsServiceContract;
};

export type PromotionsServices = {
	campaigns: IPromotionsCampaignsServiceContract;
	rewards: IPromotionsRewardsServiceContract;
};

export type CreatorsServices = {
	directory: ICreatorsDirectoryServiceContract;
	catalog: ICreatorsCatalogServiceContract;
};

export type AppServices = {
	tourney: TourneyServices;
	sports: SportsServices;
	rules: RulesServices;
	submissions: SubmissionsServices;
	accounts: AccountsServices;
	engagement: EngagementServices;
	achievements: AchievementsServices;
	media: MediaServices;
	trustSafety: TrustSafetyServices;
	verified: VerifiedServices;
	ranked: RankedServices;
	promotions: PromotionsServices;
	creators: CreatorsServices;
	sessionManager: ISessionManager;
};

export function createAppServices(instantiationService: IInstantiationService): AppServices {
	const core = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITourneyCoreService));
	const matchdays = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITourneyMatchdaysService));
	const ranking = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITourneyRankingService));
	const members = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITourneyMembersService));
	const codes = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITourneyInvitationCodesService));
	const invites = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITourneyInvitesService));
	const catalog = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ISportsCatalogService));
	const schedule = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ISportsScheduleService));
	const gameModes = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IGameModesService));
	const rulesets = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IRulesetsService));
	const submissions = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITourneySubmissionsService));
	const auth = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IAuthService));
	const me = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IMeService));
	const users = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IUsersService));
	const social = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ISocialService));
	const chat = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITourneyChatService));
	const live = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ILiveService));
	const recaps = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IRecapsService));
	const stats = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IStatsService));
	const updates = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IUpdatesService));
	const achievementsCatalog = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IAchievementsCatalogService));
	const achievementsGrants = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IAchievementsGrantsService));
	const mediaUploads = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IMediaUploadsService));
	const mediaAssets = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IMediaAssetsService));
	const trustPolicies = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITrustPoliciesService));
	const trustReports = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITrustReportsService));
	const trustEnforcement = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITrustEnforcementService));
	const trustAppeals = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ITrustAppealsService));
	const verifiedHub = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IVerifiedHubService));
	const verifiedEvents = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IVerifiedEventsService));
	const rankedSeasons = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IRankedSeasonsService));
	const rankedLeaderboards = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IRankedLeaderboardsService));
	const promotionsCampaigns = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IPromotionsCampaignsService));
	const promotionsRewards = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(IPromotionsRewardsService));
	const creatorsDirectory = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ICreatorsDirectoryService));
	const creatorsCatalog = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ICreatorsCatalogService));
	const sessionManager = instantiationService.invokeFunction((accessor: ServicesAccessor) => accessor.get(ISessionManager));

	return {
		tourney: {
			core,
			matchdays,
			ranking,
			members,
			codes,
			invites,
		},
		sports: {
			catalog,
			schedule,
		},
		rules: {
			gameModes,
			rulesets,
		},
		submissions: {
			matchdays: submissions,
		},
		accounts: {
			auth,
			me,
			users,
			social,
		},
		engagement: {
			chat,
			live,
			recaps,
			stats,
			updates,
		},
		achievements: {
			catalog: achievementsCatalog,
			grants: achievementsGrants,
		},
		media: {
			uploads: mediaUploads,
			assets: mediaAssets,
		},
		trustSafety: {
			policies: trustPolicies,
			reports: trustReports,
			enforcement: trustEnforcement,
			appeals: trustAppeals,
		},
		verified: {
			hub: verifiedHub,
			events: verifiedEvents,
		},
		ranked: {
			seasons: rankedSeasons,
			leaderboards: rankedLeaderboards,
		},
		promotions: {
			campaigns: promotionsCampaigns,
			rewards: promotionsRewards,
		},
		creators: {
			directory: creatorsDirectory,
			catalog: creatorsCatalog,
		},
		sessionManager,
	};
}
