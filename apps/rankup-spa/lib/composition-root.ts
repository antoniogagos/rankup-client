import { createRankupApiClient } from '../services/api/create-rankup-api-client.js';
import { AuthGateway } from '../services/api/accounts/auth-gateway.js';
import { MeGateway } from '../services/api/accounts/me-gateway.js';
import { SocialGateway } from '../services/api/accounts/social-gateway.js';
import { UsersGateway } from '../services/api/accounts/users-gateway.js';
import { LiveGateway } from '../services/api/engagement/live-gateway.js';
import { RecapsGateway } from '../services/api/engagement/recaps-gateway.js';
import { StatsGateway } from '../services/api/engagement/stats-gateway.js';
import { TourneyChatGateway } from '../services/api/engagement/tourney-chat-gateway.js';
import { UpdatesGateway } from '../services/api/engagement/updates-gateway.js';
import { AchievementsCatalogGateway } from '../services/api/achievements/achievements-catalog-gateway.js';
import { AchievementsGrantsGateway } from '../services/api/achievements/achievements-grants-gateway.js';
import { MediaAssetsGateway } from '../services/api/media/media-assets-gateway.js';
import { MediaUploadsGateway } from '../services/api/media/media-uploads-gateway.js';
import { PromotionsCampaignsGateway } from '../services/api/promotions/promotions-campaigns-gateway.js';
import { PromotionsRewardsGateway } from '../services/api/promotions/promotions-rewards-gateway.js';
import { CreatorsCatalogGateway } from '../services/api/creators/creators-catalog-gateway.js';
import { CreatorsDirectoryGateway } from '../services/api/creators/creators-directory-gateway.js';
import { TrustAppealsGateway } from '../services/api/trustSafety/trust-appeals-gateway.js';
import { TrustEnforcementGateway } from '../services/api/trustSafety/trust-enforcement-gateway.js';
import { TrustPoliciesGateway } from '../services/api/trustSafety/trust-policies-gateway.js';
import { TrustReportsGateway } from '../services/api/trustSafety/trust-reports-gateway.js';
import { RankedLeaderboardsGateway } from '../services/api/ranked/ranked-leaderboards-gateway.js';
import { RankedSeasonsGateway } from '../services/api/ranked/ranked-seasons-gateway.js';
import { VerifiedEventsGateway } from '../services/api/verified/verified-events-gateway.js';
import { VerifiedHubGateway } from '../services/api/verified/verified-hub-gateway.js';
import { TourneySubmissionsGateway } from '../services/api/submissions/tourney-submissions-gateway.js';
import { TourneyCoreGateway } from '../services/api/tourney/tourney-core-gateway.js';
import { TourneyInvitationCodesGateway } from '../services/api/tourney/tourney-invitation-codes-gateway.js';
import { TourneyInvitesGateway } from '../services/api/tourney/tourney-invites-gateway.js';
import { TourneyMatchdaysGateway } from '../services/api/tourney/tourney-matchdays-gateway.js';
import { TourneyMembersGateway } from '../services/api/tourney/tourney-members-gateway.js';
import { TourneyRankingGateway } from '../services/api/tourney/tourney-ranking-gateway.js';
import { GameModesGateway } from '../services/api/rules/game-modes-gateway.js';
import { RulesetsGateway } from '../services/api/rules/rulesets-gateway.js';
import { SportsCatalogGateway } from '../services/api/sports/sports-catalog-gateway.js';
import { SportsScheduleGateway } from '../services/api/sports/sports-schedule-gateway.js';
import { createMockRankupApiClient } from '@rankup/api-mock';
import { EnvironmentService } from '@rankup/platform/environment/browser/environmentService.js';
import { InstantiationService } from '@rankup/platform/instantiation/common/instantiationService.js';
import { ServiceCollection } from '@rankup/platform/instantiation/common/serviceCollection.js';
import { registerPlatformServices } from '@rankup/platform/registerPlatformServices.js';
import type { ISessionManager } from '@rankup/platform/session/common/sessionManager.js';
import { IAuthGateway } from '@rankup/rankup/domains/accounts/auth/contracts/authGateway.js';
import { IMeGateway } from '@rankup/rankup/domains/accounts/me/contracts/meGateway.js';
import { ISocialGateway } from '@rankup/rankup/domains/accounts/social/contracts/socialGateway.js';
import { IUsersGateway } from '@rankup/rankup/domains/accounts/users/contracts/usersGateway.js';
import { registerAccountsDomainServices } from '@rankup/rankup/domains/accounts/registerAccountsDomainServices.js';
import { ITourneyChatGateway } from '@rankup/rankup/domains/engagement/chat/contracts/tourneyChatGateway.js';
import { ILiveGateway } from '@rankup/rankup/domains/engagement/live/contracts/liveGateway.js';
import { IRecapsGateway } from '@rankup/rankup/domains/engagement/recaps/contracts/recapsGateway.js';
import { IStatsGateway } from '@rankup/rankup/domains/engagement/stats/contracts/statsGateway.js';
import { IUpdatesGateway } from '@rankup/rankup/domains/engagement/updates/contracts/updatesGateway.js';
import { registerEngagementDomainServices } from '@rankup/rankup/domains/engagement/registerEngagementDomainServices.js';
import { IAchievementsCatalogGateway } from '@rankup/rankup/domains/achievements/catalog/contracts/achievementsCatalogGateway.js';
import { IAchievementsGrantsGateway } from '@rankup/rankup/domains/achievements/grants/contracts/achievementsGrantsGateway.js';
import { registerAchievementsDomainServices } from '@rankup/rankup/domains/achievements/registerAchievementsDomainServices.js';
import { IMediaAssetsGateway } from '@rankup/rankup/domains/media/assets/contracts/mediaAssetsGateway.js';
import { IMediaUploadsGateway } from '@rankup/rankup/domains/media/uploads/contracts/mediaUploadsGateway.js';
import { registerMediaDomainServices } from '@rankup/rankup/domains/media/registerMediaDomainServices.js';
import { IPromotionsCampaignsGateway } from '@rankup/rankup/domains/promotions/campaigns/contracts/promotionsCampaignsGateway.js';
import { IPromotionsRewardsGateway } from '@rankup/rankup/domains/promotions/rewards/contracts/promotionsRewardsGateway.js';
import { registerPromotionsDomainServices } from '@rankup/rankup/domains/promotions/registerPromotionsDomainServices.js';
import { ICreatorsCatalogGateway } from '@rankup/rankup/domains/creators/catalog/contracts/creatorsCatalogGateway.js';
import { ICreatorsDirectoryGateway } from '@rankup/rankup/domains/creators/directory/contracts/creatorsDirectoryGateway.js';
import { registerCreatorsDomainServices } from '@rankup/rankup/domains/creators/registerCreatorsDomainServices.js';
import { ITrustAppealsGateway } from '@rankup/rankup/domains/trustSafety/appeals/contracts/trustAppealsGateway.js';
import { ITrustEnforcementGateway } from '@rankup/rankup/domains/trustSafety/enforcement/contracts/trustEnforcementGateway.js';
import { ITrustReportsGateway } from '@rankup/rankup/domains/trustSafety/reports/contracts/trustReportsGateway.js';
import { ITrustPoliciesGateway } from '@rankup/rankup/domains/trustSafety/shared/contracts/trustPoliciesGateway.js';
import { registerTrustSafetyDomainServices } from '@rankup/rankup/domains/trustSafety/registerTrustSafetyDomainServices.js';
import { IRankedLeaderboardsGateway } from '@rankup/rankup/domains/ranked/leaderboards/contracts/rankedLeaderboardsGateway.js';
import { IRankedSeasonsGateway } from '@rankup/rankup/domains/ranked/seasons/contracts/rankedSeasonsGateway.js';
import { registerRankedDomainServices } from '@rankup/rankup/domains/ranked/registerRankedDomainServices.js';
import { IVerifiedEventsGateway } from '@rankup/rankup/domains/verified/events/contracts/eventsGateway.js';
import { IVerifiedHubGateway } from '@rankup/rankup/domains/verified/hub/contracts/hubGateway.js';
import { registerVerifiedDomainServices } from '@rankup/rankup/domains/verified/registerVerifiedDomainServices.js';
import { ITourneySubmissionsGateway } from '@rankup/rankup/domains/submissions/scorePrediction/contracts/tourneySubmissionsGateway.js';
import { registerSubmissionsDomainServices } from '@rankup/rankup/domains/submissions/registerSubmissionsDomainServices.js';
import { ITourneyCoreGateway } from '@rankup/rankup/domains/tournaments/core/contracts/tourneyCoreGateway.js';
import { ITourneyInvitationCodesGateway } from '@rankup/rankup/domains/tournaments/codes/contracts/tourneyInvitationCodesGateway.js';
import { ITourneyInvitesGateway } from '@rankup/rankup/domains/tournaments/invites/contracts/tourneyInvitesGateway.js';
import { ITourneyMatchdaysGateway } from '@rankup/rankup/domains/tournaments/matchdays/contracts/tourneyMatchdaysGateway.js';
import { ITourneyMembersGateway } from '@rankup/rankup/domains/tournaments/members/contracts/tourneyMembersGateway.js';
import { ITourneyRankingGateway } from '@rankup/rankup/domains/scoring/ranking/contracts/tourneyRankingGateway.js';
import { registerScoringDomainServices } from '@rankup/rankup/domains/scoring/registerScoringDomainServices.js';
import { IGameModesGateway } from '@rankup/rankup/domains/rules/gameModes/contracts/gameModesGateway.js';
import { IRulesetsGateway } from '@rankup/rankup/domains/rules/rulesets/contracts/rulesetsGateway.js';
import { registerRulesDomainServices } from '@rankup/rankup/domains/rules/registerRulesDomainServices.js';
import { ISportsCatalogGateway } from '@rankup/rankup/domains/sports/catalog/contracts/sportsCatalogGateway.js';
import { ISportsScheduleGateway } from '@rankup/rankup/domains/sports/schedule/contracts/sportsScheduleGateway.js';
import { registerSportsDomainServices } from '@rankup/rankup/domains/sports/registerSportsDomainServices.js';
import { registerTourneyDomainServices } from '@rankup/rankup/domains/tournaments/registerTourneyDomainServices.js';

export type CompositionRootOptions = {
	getAccessToken?: () => string | null | undefined;
	sessionManager?: ISessionManager;
};

export function createCompositionRoot(options: CompositionRootOptions = {}): InstantiationService {
	if (!options.sessionManager) {
		throw new Error('SessionManager is required to create the composition root.');
	}

	const services = new ServiceCollection();
	const environmentService = new EnvironmentService();

	const apiClient = environmentService.isMockMode
		? createMockRankupApiClient()
		: createRankupApiClient({
				apiBaseUrl: environmentService.apiBaseUrl,
				authBaseUrl: environmentService.authBaseUrl,
				getAccessToken: options.getAccessToken,
			});

	registerPlatformServices(services, {
		environmentService,
		sessionManager: options.sessionManager,
	});
	services.set(ITourneyCoreGateway, new TourneyCoreGateway(apiClient));
	services.set(ITourneyMatchdaysGateway, new TourneyMatchdaysGateway(apiClient));
	services.set(ITourneyRankingGateway, new TourneyRankingGateway(apiClient));
	services.set(ITourneyMembersGateway, new TourneyMembersGateway(apiClient));
	services.set(ITourneyInvitationCodesGateway, new TourneyInvitationCodesGateway(apiClient));
	services.set(ITourneyInvitesGateway, new TourneyInvitesGateway(apiClient));
	services.set(ITourneySubmissionsGateway, new TourneySubmissionsGateway(apiClient));
	services.set(IAuthGateway, new AuthGateway(apiClient));
	services.set(IMeGateway, new MeGateway(apiClient));
	services.set(IUsersGateway, new UsersGateway(apiClient));
	services.set(ISocialGateway, new SocialGateway(apiClient));
	services.set(ITourneyChatGateway, new TourneyChatGateway(apiClient));
	services.set(ILiveGateway, new LiveGateway(apiClient));
	services.set(IRecapsGateway, new RecapsGateway(apiClient));
	services.set(IStatsGateway, new StatsGateway(apiClient));
	services.set(IUpdatesGateway, new UpdatesGateway(apiClient));
	services.set(IAchievementsCatalogGateway, new AchievementsCatalogGateway(apiClient));
	services.set(IAchievementsGrantsGateway, new AchievementsGrantsGateway(apiClient));
	services.set(IMediaUploadsGateway, new MediaUploadsGateway(apiClient));
	services.set(IMediaAssetsGateway, new MediaAssetsGateway(apiClient));
	services.set(IPromotionsCampaignsGateway, new PromotionsCampaignsGateway(apiClient));
	services.set(IPromotionsRewardsGateway, new PromotionsRewardsGateway(apiClient));
	services.set(ICreatorsDirectoryGateway, new CreatorsDirectoryGateway(apiClient));
	services.set(ICreatorsCatalogGateway, new CreatorsCatalogGateway(apiClient));
	services.set(ITrustPoliciesGateway, new TrustPoliciesGateway(apiClient));
	services.set(ITrustReportsGateway, new TrustReportsGateway(apiClient));
	services.set(ITrustEnforcementGateway, new TrustEnforcementGateway(apiClient));
	services.set(ITrustAppealsGateway, new TrustAppealsGateway(apiClient));
	services.set(IVerifiedHubGateway, new VerifiedHubGateway(apiClient));
	services.set(IVerifiedEventsGateway, new VerifiedEventsGateway(apiClient));
	services.set(IRankedSeasonsGateway, new RankedSeasonsGateway(apiClient));
	services.set(IRankedLeaderboardsGateway, new RankedLeaderboardsGateway(apiClient));
	services.set(IGameModesGateway, new GameModesGateway(apiClient));
	services.set(IRulesetsGateway, new RulesetsGateway(apiClient));
	services.set(ISportsCatalogGateway, new SportsCatalogGateway(apiClient));
	services.set(ISportsScheduleGateway, new SportsScheduleGateway(apiClient));
	registerAccountsDomainServices(services);
	registerEngagementDomainServices(services);
	registerAchievementsDomainServices(services);
	registerMediaDomainServices(services);
	registerPromotionsDomainServices(services);
	registerCreatorsDomainServices(services);
	registerTrustSafetyDomainServices(services);
	registerVerifiedDomainServices(services);
	registerRankedDomainServices(services);
	registerSubmissionsDomainServices(services);
	registerTourneyDomainServices(services);
	registerScoringDomainServices(services);
	registerRulesDomainServices(services);
	registerSportsDomainServices(services);

	return new InstantiationService(services);
}
