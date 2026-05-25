import type { AuthSession, GameMode, GameModeList, InvitationCode, InvitationCodePage, InvitationCodeResolution, JoinByInvitationCodeResult, DuelListItem, DuelPage, HeadsUpOverallSummary, HeadsUpRoundSummary, HeadsUpScoreboard, HeadsUpScoreboardEntry, MatchdayAvailability, MatchdaySubmission, MatchdaySubmissionSummary, MatchdaySubmissionSummaryPage, ScorePredictionMatchdaySubmission, ScorePredictionPredictionInput, ScorePredictionPredictionView, SubmissionCompletion, UpsertMatchdaySubmissionResult, UpsertScorePredictionMatchdaySubmissionRequest, Me, MeSummary, MyMembershipSummary, MyTournamentInvite, MyTournamentInvitePage, RankingEntry, RulesSection, Ruleset, RulesetPage, RulesetSummary, Registration, Tournament, TournamentInvite, TournamentInvitePage, TournamentMatch, TournamentMatchday, TournamentMatchdayPage, TournamentMatchdaySummary, TournamentMember, TournamentMemberPage, TournamentPreview, TournamentRankingPage, TournamentRankingWindow, TournamentSummary, UserDirectoryPage, RelationshipStatus, FriendPage, FollowPage, Notification, NotificationPage, NotificationUnreadCounts, NotificationBatchActionResult, FeedItem, FeedPage, FeedReadCursor, MeUpdatePage, TournamentChat, TournamentChatSettings, TournamentChatState, ChatMessage, ChatMessagePage, ChatPinnedMessages, ChatReadCursor, ChatReport, ChatUpdatePage, ChatMuteEntry, ChatMutePage, MyStatsSnapshot, PublicUserStatsSnapshot, TournamentStatsSnapshot, UserTournamentStatsSnapshot, MatchdayStatsSnapshot, UserMatchdayStatsSnapshot, RecapSummary, RecapSummaryPage, Recap, AchievementDefinition, AchievementDefinitionPage, AchievementEligibility, AchievementMeta, AchievementProgress, AchievementProgressPage, AchievementRequirement, AchievementReward, AchievementUnlockContext, UnlockedAchievementList, UserAchievementPage, VerifiedBranding, VerifiedEligibility, VerifiedEvent, VerifiedEventPage, VerifiedEventSchedule, VerifiedEventSummary, VerifiedHub, VerifiedHubSection, VerifiedJoinInfo, VerifiedTournamentPage, VerifiedTournamentPreview, VerifiedTournamentSummary, ScorePredictionAggregateCounters, ScorePredictionAggregateRates, RankedEligibilityPolicy, RankedTierRewardPreview, RankedTierDefinition, RankedTrackScope, RankedTrackSummary, RankedTrack, RankedTrackPage, RankedSeasonSummary, RankedSeason, RankedSeasonPage, RankedMeta, RankedTierProgress, RankedLeaderboardEntry, RankedLeaderboard, RankedSettings, MyRankedTrackStanding, PublicRankedTrackStanding, MyRankedProfile, PublicRankedProfile, RankedHistorySource, RankedHistoryEvent, RankedHistoryPage, Checksum, Media, MediaModeration, MediaVariant, UploadConstraints, UploadDestinationSinglePut, UploadSession, TrustPolicy, TrustPolicyList, EnforcementStatus, Appeal, AppealPage, Report, ReportPage, TrustBlockEntry, TrustBlockPage, PromotionRewardDefinition, PromotionSummary, PromotionSummaryPage, Promotion, PromotionMeState, PromotionWinnerPage, MyPromotionPage, RewardDelivery, RewardSource, RewardGrant, RewardGrantPage, RewardFulfillmentProfile, ShippingAddress, CreatorBranding, CreatorStats, CreatorSummary, CreatorCatalogItem, CreatorCatalogSummary, CreatorProfile, CreatorPage, CreatorHubSection, CreatorHub, CreatorEventPage, CreatorTournamentPage, CreatorCollectionSummary, CreatorCollection, CreatorCollectionPage, RankupApiClient } from '@rankup/api';
import type { MockApiServer, MockApiServerOptions } from './create-server.js';
import type { MockDb, MockDbOptions } from './mock-db.js';
import { createMockRegistry, executeMockHandler } from './core/index.js';
import { resolveUser, toMeSummary } from './mock-db.js';

export type MockApiOptions = {
	db?: MockDb;
	dbOptions?: MockDbOptions;
};

function createFallbackTournamentSummary(tournamentId: string): TournamentSummary {
	return {
		tournamentId,
		name: 'Mock Tournament',
		visibility: 'public',
		discoverability: 'listed',
		verificationStatus: 'community',
		sportId: 'football',
		gameModeId: 'scorePrediction',
		formatId: 'league',
		modality: 'season',
		status: 'live',
		joinPolicy: {
			joinMode: 'open',
			joinMidSeasonAllowed: true,
			locked: false,
		},
		memberCount: 1,
	};
}

function toTournamentPreview(summary: TournamentSummary): TournamentPreview {
	return {
		tournamentId: summary.tournamentId,
		name: summary.name,
		description: summary.description,
		heroImageUrl: summary.heroImageUrl,
		organizer: summary.organizer,
		visibility: summary.visibility,
		verificationStatus: summary.verificationStatus,
		isRankedEligible: summary.isRankedEligible,
		sportId: summary.sportId,
		gameModeId: summary.gameModeId,
		formatId: summary.formatId,
		modality: summary.modality,
		status: summary.status,
		timing: summary.timing,
		joinPolicy: summary.joinPolicy,
		memberCount: summary.memberCount,
		rewardSummary: summary.rewardSummary,
	};
}

export function createMockRankupApiClient(options: MockApiOptions = {}): RankupApiClient {
	const registry = createMockRegistry({ db: options.db, dbOptions: options.dbOptions });
	const now = () => new Date().toISOString();
	const currentSeasonFallback = () => new Date().getUTCFullYear().toString();
	const baseUser = resolveUser(registry.db);

	const gameModes: GameMode[] = [
		{
			gameModeId: 'scorePrediction',
			name: 'ScorePrediction',
			shortName: 'Predictions',
			description: 'Predict the final score for each match.',
			status: 'implemented',
			supportedSportIds: ['football'],
			supportedModalities: ['matchday', 'season'],
			supportedFormats: ['league', 'headsUp'],
			defaultRulesetId: 'scorePrediction-v1',
			capabilities: {
				submissionModel: 'perMatchPrediction',
				supportsLiveUpdates: true,
				supportsNegativePoints: true,
				supportsEditsBeforeLock: true,
				lockGranularity: 'match',
			},
			tournamentRulesetConfigSchema: {
				type: 'object',
				additionalProperties: true,
			},
		},
	];

	const rulesetSections: RulesSection[] = [
		{
			title: 'Predictions',
			items: ['Predict the final score for each match.', 'Points are awarded based on accuracy.'],
		},
		{
			title: 'Locking',
			items: ['Predictions lock at kickoff.'],
		},
	];

	const rulesets: Ruleset[] = [
		{
			rulesetId: 'scorePrediction-v1',
			gameModeId: 'scorePrediction',
			sportId: 'football',
			name: 'ScorePrediction v1',
			status: 'active',
			isRankedEligible: true,
			version: '1.0.0',
			description: 'Default score prediction rules.',
			publishedAt: now(),
			defaultConfig: {
				resultScope: 'extra_time',
				lockPolicy: { type: 'kickoff' },
				scoring: {
					correctOutcome: 8,
					exactScore: 6,
					exactGoalsOneTeam: 2,
					wrongGoalsBothTeamsNonDrawPenalty: -2,
					bonusRules: [],
				},
				tieBreakers: ['mostExactScores'],
				allowNegativePoints: true,
				maxGoalsPerTeam: 20,
			},
			configSchema: {
				type: 'object',
				additionalProperties: true,
			},
			sections: rulesetSections,
			scoringModel: 'scorePrediction_v1',
			audit: {
				createdAt: now(),
				createdBy: 'system',
			},
		},
	];

	const buildGameModeList = (query?: Parameters<RankupApiClient['listGameModes']>[0]): GameModeList => {
		let items = gameModes;
		if (query?.status) {
			items = items.filter(item => item.status === query.status);
		}
		const sportId = query?.sportId;
		if (sportId) {
			items = items.filter(item => item.supportedSportIds.includes(sportId));
		}
		const modality = query?.modality;
		if (modality) {
			items = items.filter(item => item.supportedModalities.includes(modality));
		}
		return { items };
	};

	const pickGameMode = (gameModeId: string): GameMode => gameModes.find(item => item.gameModeId === gameModeId) ?? gameModes[0];

	const toRulesetSummary = (ruleset: Ruleset): RulesetSummary => ({
		rulesetId: ruleset.rulesetId,
		gameModeId: ruleset.gameModeId,
		sportId: ruleset.sportId,
		name: ruleset.name,
		status: ruleset.status,
		isRankedEligible: ruleset.isRankedEligible,
		version: ruleset.version,
		description: ruleset.description,
		publishedAt: ruleset.publishedAt,
	});

	const buildRulesetPage = (query?: Parameters<RankupApiClient['listRulesets']>[0]): RulesetPage => {
		let items = rulesets;
		if (query?.gameModeId) {
			items = items.filter(item => item.gameModeId === query.gameModeId);
		}
		if (query?.sportId) {
			items = items.filter(item => item.sportId === query.sportId);
		}
		if (query?.status) {
			items = items.filter(item => item.status === query.status);
		}
		if (query?.rankedEligible !== undefined) {
			items = items.filter(item => item.isRankedEligible === query.rankedEligible);
		}
		return { items: items.map(toRulesetSummary) };
	};

	const pickRuleset = (rulesetId: string): Ruleset => rulesets.find(item => item.rulesetId === rulesetId) ?? rulesets[0];

	const buildMe = (): Me => ({
		userId: baseUser.userId,
		username: baseUser.username,
		email: 'mock@rankup.dev',
		emailVerified: true,
		createdAt: now(),
		updatedAt: now(),
		pictureUrl: baseUser.pictureUrl,
	});

	const buildAuthSession = (): AuthSession => ({
		accessToken: `mock-access-${Date.now()}`,
		refreshToken: `mock-refresh-${Date.now()}`,
		idToken: `mock-id-${Date.now()}`,
		tokenType: 'Bearer',
		expiresAt: new Date(Date.now() + 3600_000).toISOString(),
		user: toMeSummary(baseUser),
	});

	const buildRegistration = (email: string): Registration => ({
		registrationId: `reg_${Date.now()}`,
		email,
		status: 'pendingConfirmation',
		createdAt: now(),
	});

	const buildUserDirectoryPage = (query: Parameters<RankupApiClient['searchUsers']>[0]): UserDirectoryPage => {
		const q = query.q.toLowerCase();
		const items = registry.db.users
			.list()
			.filter(user => user.username.toLowerCase().includes(q))
			.map(user => ({
				userId: user.userId,
				username: user.username,
				pictureUrl: user.pictureUrl,
				relationship: {
					isFriend: false,
					youFollow: false,
					followsYou: false,
				},
			}));
		return { items };
	};

	const buildRelationshipStatus = (userId: string): RelationshipStatus => ({
		userId,
		isFriend: false,
		youFollow: false,
		followsYou: false,
		youBlocked: false,
	});

	const buildFriendPage = (): FriendPage => ({
		items: registry.db.users.list().slice(0, 2).map(user => ({
			user: toMeSummary(user),
			friendedAt: now(),
		})),
	});

	const buildFollowPage = (): FollowPage => ({
		items: registry.db.users.list().slice(0, 3).map(user => ({
			user: toMeSummary(user),
			followedAt: now(),
		})),
	});

	const buildSubmissionCompletion = (submittedCount: number, expectedCount: number): SubmissionCompletion => ({
		submittedCount,
		expectedCount,
		status: submittedCount === 0 ? 'missing' : submittedCount < expectedCount ? 'partial' : 'complete',
	});

	const pickMatchdayMatches = (matchday: number): TournamentMatch[] => {
		const matches = registry.db.matches.list().filter(match => match.matchday === matchday);
		if (matches.length > 0) {
			return matches;
		}
		return registry.db.matches.list().slice(0, 3);
	};

	const buildScorePredictionPredictionViews = (
		matchday: number,
		visibility: ScorePredictionPredictionView['visibility'],
	): ScorePredictionPredictionView[] =>
		pickMatchdayMatches(matchday).map((match, index) => {
			const isSubmitted = index % 2 === 0;
			return {
				matchId: match.matchId,
				visibility,
				isSubmitted,
				homeScore: isSubmitted ? 1 : null,
				awayScore: isSubmitted ? 0 : null,
				lockState: match.lockState ?? 'open',
				lockAt: match.scheduledAt,
				submittedAt: isSubmitted ? now() : undefined,
				updatedAt: isSubmitted ? now() : undefined,
			};
		});

	const buildScorePredictionSubmission = (
		tournamentId: string,
		matchday: number,
		user: MeSummary,
		scope: ScorePredictionMatchdaySubmission['scope'],
		visibility: ScorePredictionMatchdaySubmission['visibility'],
	): ScorePredictionMatchdaySubmission => {
		const predictions = buildScorePredictionPredictionViews(matchday, visibility);
		const submittedCount = predictions.filter(prediction => prediction.isSubmitted).length;
		return {
			submissionId: `subm_${tournamentId}_${matchday}_${user.userId}`,
			tournamentId,
			matchday,
			userId: user.userId,
			gameModeId: 'scorePrediction',
			serverTime: now(),
			scope,
			visibility,
			completion: buildSubmissionCompletion(submittedCount, predictions.length),
			createdAt: now(),
			updatedAt: now(),
			predictions,
		};
	};

	const buildScorePredictionSubmissionFromUpsert = (
		tournamentId: string,
		matchday: number,
		user: MeSummary,
		upserts: ScorePredictionPredictionInput[] | undefined,
		removes: string[] | undefined,
	): ScorePredictionMatchdaySubmission => {
		const upserted = new Map((upserts ?? []).map(item => [item.matchId, item]));
		const removed = new Set(removes ?? []);
		const predictions: ScorePredictionPredictionView[] = pickMatchdayMatches(matchday).map(match => {
			const input = upserted.get(match.matchId);
			const isSubmitted = Boolean(input) && !removed.has(match.matchId);
			return {
				matchId: match.matchId,
				visibility: 'visible',
				isSubmitted,
				homeScore: isSubmitted ? input?.homeScore ?? 0 : null,
				awayScore: isSubmitted ? input?.awayScore ?? 0 : null,
				lockState: match.lockState ?? 'open',
				lockAt: match.scheduledAt,
				submittedAt: isSubmitted ? now() : undefined,
				updatedAt: isSubmitted ? now() : undefined,
			};
		});
		const submittedCount = predictions.filter(prediction => prediction.isSubmitted).length;
		return {
			submissionId: `subm_${tournamentId}_${matchday}_${user.userId}`,
			tournamentId,
			matchday,
			userId: user.userId,
			gameModeId: 'scorePrediction',
			serverTime: now(),
			scope: 'me',
			visibility: 'visible',
			completion: buildSubmissionCompletion(submittedCount, predictions.length),
			createdAt: now(),
			updatedAt: now(),
			predictions,
		};
	};

	const buildMatchdaySubmissionSummary = (user: MeSummary, submittedCount: number, expectedCount: number): MatchdaySubmissionSummary => {
		const completion = buildSubmissionCompletion(submittedCount, expectedCount);
		return {
			user,
			status: completion.status,
			completion,
			lastUpdatedAt: now(),
		};
	};

	const buildMatchdaySubmissionSummaryPage = (matchday: number): MatchdaySubmissionSummaryPage => {
		const matches = pickMatchdayMatches(matchday);
		const expectedCount = matches.length;
		const users = registry.db.users.list().slice(0, 4);
		const items = users.map((user, index) => buildMatchdaySubmissionSummary(toMeSummary(user), index % 2 === 0 ? expectedCount : 0, expectedCount));
		return { serverTime: now(), items };
	};

	const pickTournamentSummary = (tournamentId?: string): TournamentSummary => {
		if (tournamentId) {
			const record = registry.db.tournaments.get(tournamentId);
			if (record) {
				return record.tournament;
			}
		}
		const fallback = registry.db.tournaments.list()[0]?.tournament;
		return fallback ?? createFallbackTournamentSummary(tournamentId ?? 'tournament-mock');
	};

	const pickMembership = (): MyMembershipSummary => {
		const record = registry.db.tournaments.list()[0];
		if (record?.membership) {
			return record.membership;
		}
		return { role: 'player', joinedAt: now() };
	};

	const buildDuelListItem = (record: ReturnType<MockDb['tournaments']['list']>[number]): DuelListItem => {
		const opponent = registry.db.users.list().find(user => user.userId !== baseUser.userId) ?? registry.db.users.list()[0];
		return {
			tournament: record.tournament,
			opponentUserId: opponent.userId,
			opponent,
			currentRound: {
				matchday: 1,
				status: 'live',
				locked: false,
			},
		};
	};

	const buildDuelPage = (): DuelPage => {
		const items = registry.db.tournaments
			.list()
			.filter(record => record.tournament.formatId === 'headsUp')
			.map(buildDuelListItem);
		return { items, nextCursor: undefined };
	};

	const buildInvitationCode = (tournamentId: string): InvitationCode => ({
		code: `CODE-${tournamentId}`,
		tournamentId,
		status: 'active',
		createdAt: now(),
		createdByUserId: resolveUser(registry.db).userId,
		label: 'Default',
		maxUses: 50,
		useCount: 0,
	});

	const buildTournamentInvite = (tournamentId: string): TournamentInvite => {
		const summary = pickTournamentSummary(tournamentId);
		const invitedUser = toMeSummary(resolveUser(registry.db));
		const invitedBy = toMeSummary(resolveUser(registry.db, 'user-cr7'));
		const kind = summary.formatId === 'headsUp' ? 'headsUpChallenge' : 'tournamentInvite';

		return {
			inviteId: `inv_${Date.now()}`,
			tournamentId,
			kind,
			status: 'pending',
			invitedUser,
			invitedBy,
			message: 'Mock invite',
			headsUpPayload:
				kind === 'headsUpChallenge'
					? {
						challengerUserId: invitedBy.userId,
						opponentUserId: invitedUser.userId,
					}
					: undefined,
			createdAt: now(),
		};
	};

	const buildMyTournamentInvite = (invite: TournamentInvite, preview?: TournamentPreview): MyTournamentInvite => ({
		inviteId: invite.inviteId,
		tournamentId: invite.tournamentId,
		kind: invite.kind,
		status: invite.status,
		invitedUser: invite.invitedUser,
		invitedBy: invite.invitedBy,
		message: invite.message,
		headsUpPayload: invite.headsUpPayload,
		createdAt: invite.createdAt,
		expiresAt: invite.expiresAt,
		respondedAt: invite.respondedAt,
		seenAt: now(),
		hiddenAt: undefined,
		tournamentPreview: preview,
	});

	const buildMatchdaySummary = (matchday: number): TournamentMatchdaySummary => ({
		matchday,
		label: `Jornada ${matchday}`,
		status: 'upcoming',
		startsAt: now(),
		endsAt: now(),
		matchCount: registry.db.matches.list().length,
		isCurrent: matchday === 1,
	});

	const buildMatchday = (tournamentId: string, matchday: number): TournamentMatchday => ({
		...buildMatchdaySummary(matchday),
		tournamentId,
		serverTime: now(),
		previousMatchday: matchday > 1 ? matchday - 1 : undefined,
		nextMatchday: matchday + 1,
	});

	const buildMatchdayAvailability = (tournamentId: string, matchday: number): MatchdayAvailability => ({
		tournamentId,
		matchday,
		serverTime: now(),
		state: 'open',
		canSubmit: true,
		reason: 'open',
		opensAt: now(),
		locksAt: now(),
		closesAt: now(),
		message: 'Open',
	});

	const buildRankingMeta = (tournamentId: string, scope: 'season' | 'matchday', matchday?: number) => ({
		tournamentId,
		scope,
		state: 'final' as const,
		serverTime: now(),
		computedAt: now(),
		totalPlayers: registry.db.ranking.list().length,
		matchday,
	});

	const buildHeadsUpPlayers = (): HeadsUpScoreboardEntry[] => {
		const entries = registry.db.ranking.list().slice(0, 2);
		const fallbackUsers = [toMeSummary(resolveUser(registry.db)), toMeSummary(resolveUser(registry.db, 'user-cr7'))];
		return [0, 1].map(index => {
			const entry = entries[index];
			if (entry) {
				return {
					position: index + 1,
					user: entry.user,
					points: entry.points,
					pointsState: entry.pointsState,
					metrics: entry.metrics,
					lastUpdatedAt: entry.lastUpdatedAt,
				};
			}
			return {
				position: index + 1,
				user: fallbackUsers[index],
				points: 0,
			};
		});
	};

	const buildHeadsUpRoundSummary = (players: HeadsUpScoreboardEntry[], matchday?: number): HeadsUpRoundSummary => {
		const pointsA = players[0]?.points ?? 0;
		const pointsB = players[1]?.points ?? 0;
		const winnerUserId = pointsA === pointsB ? undefined : pointsA > pointsB ? players[0]?.user.userId : players[1]?.user.userId;
		return {
			matchday,
			state: 'final',
			pointsA,
			pointsB,
			winnerUserId,
		};
	};

	const buildHeadsUpOverallSummary = (players: HeadsUpScoreboardEntry[]): HeadsUpOverallSummary => {
		const pointsA = players[0]?.points ?? 0;
		const pointsB = players[1]?.points ?? 0;
		const winnerUserId = pointsA === pointsB ? undefined : pointsA > pointsB ? players[0]?.user.userId : players[1]?.user.userId;
		return {
			winnerUserId,
			roundWinsA: winnerUserId ? (winnerUserId === players[0]?.user.userId ? 1 : 0) : 0,
			roundWinsB: winnerUserId ? (winnerUserId === players[1]?.user.userId ? 1 : 0) : 0,
			totalPointsA: pointsA,
			totalPointsB: pointsB,
			outcome: pointsA === pointsB ? 'draw' : pointsA > pointsB ? 'win' : 'loss',
		};
	};

	const buildHeadsUpScoreboard = (tournamentId: string, matchday?: number): HeadsUpScoreboard => {
		const players = buildHeadsUpPlayers();
		return {
			players,
			rounds: [buildHeadsUpRoundSummary(players, matchday)],
			overall: buildHeadsUpOverallSummary(players),
		};
	};

	const buildRankingPage = (tournamentId: string, scope: 'season' | 'matchday', matchday?: number): TournamentRankingPage => {
		const summary = pickTournamentSummary(tournamentId);
		const headsup = summary.formatId === 'headsUp' ? buildHeadsUpScoreboard(tournamentId, matchday) : undefined;
		return {
			meta: buildRankingMeta(tournamentId, scope, matchday),
			items: registry.db.ranking.list(),
			headsup,
		};
	};

	const buildRankingWindow = (tournamentId: string, scope: 'season' | 'matchday', matchday?: number): TournamentRankingWindow => {
		const items = registry.db.ranking.list();
		const center = items[0] ?? ({ position: 1, points: 0, user: toMeSummary(resolveUser(registry.db)) } as RankingEntry);
		const summary = pickTournamentSummary(tournamentId);
		const headsup = summary.formatId === 'headsUp' ? buildHeadsUpScoreboard(tournamentId, matchday) : undefined;
		return {
			meta: buildRankingMeta(tournamentId, scope, matchday),
			center,
			items,
			headsup,
		};
	};

	const buildSportList = () => ({
		items: [
			{
				sportId: 'football',
				name: 'Football',
				status: 'active' as const,
			},
		],
	});

	const pickCompetition = (competitionId?: string) => {
		if (competitionId) {
			const record = registry.db.competitions.get(competitionId);
			if (record) {
				return record;
			}
		}
		return registry.db.competitions.list()[0] ?? {
			competitionId: 'FOOTBALL_SPAIN_LEAGUE_1',
			name: 'La Liga',
			shortName: 'LaLiga',
			sportId: 'football',
			type: 'domestic',
			status: 'live',
			countryCode: 'ES',
			activeSeasonId: currentSeasonFallback(),
		};
	};

	const buildSeasonList = (competitionId: string) => {
		const competition = pickCompetition(competitionId);
		const seasonId = competition.activeSeasonId?.trim() || currentSeasonFallback();
		return {
			items: [
				{
					seasonId,
					competitionId: competition.competitionId,
					label: seasonId,
					status: 'live' as const,
					startsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
					endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString(),
					totalMatchdays: 38,
					currentMatchday: 20,
					currentMatchdayStatus: 'live' as const,
					lastUpdatedAt: now(),
				},
			],
		};
	};

	const toMatch = (match: TournamentMatch) => ({
		matchId: match.matchId,
		sportId: match.sportId,
		competitionId: match.competitionId,
		seasonId: match.seasonId,
		matchday: match.matchday,
		status: match.status,
		scheduledAt: match.scheduledAt,
		startedAt: match.startedAt,
		endedAt: match.endedAt,
		homeTeam: match.homeTeam,
		awayTeam: match.awayTeam,
		score: match.score,
		finalOutcomeType: match.finalOutcomeType,
		penaltyShootout: match.penaltyShootout,
		isDerby: match.isDerby,
		weather: match.weather,
		odds: match.odds,
		eventCounters: match.eventCounters,
		lastUpdatedAt: match.lastUpdatedAt,
	});

	const filterMatches = (query?: Parameters<RankupApiClient['searchMatches']>[0]) => {
		const matches = registry.db.matches.list();
		return matches.filter(match => {
			if (query?.sportId && match.sportId !== query.sportId) {
				return false;
			}
			if (query?.competitionId && match.competitionId !== query.competitionId) {
				return false;
			}
			if (query?.seasonId && match.seasonId !== query.seasonId) {
				return false;
			}
			if (query?.matchday !== undefined && match.matchday !== query.matchday) {
				return false;
			}
			if (query?.status && match.status !== query.status) {
				return false;
			}
			if (query?.teamId) {
				const home = match.homeTeam?.teamId;
				const away = match.awayTeam?.teamId;
				if (home !== query.teamId && away !== query.teamId) {
					return false;
				}
			}
			if (query?.from && match.scheduledAt < query.from) {
				return false;
			}
			if (query?.to && match.scheduledAt > query.to) {
				return false;
			}
			return true;
		});
	};

	const baseUserSummary = toMeSummary(baseUser);
	const defaultTournament = pickTournamentSummary();
	const defaultTournamentId = defaultTournament.tournamentId;
	const mockTime = now();

	const notification: Notification = {
		notificationId: 'notif_01',
		topic: 'tournament',
		notificationType: 'tournament.invite',
		priority: 'normal',
		title: 'Nueva invitación',
		body: 'Te han invitado a un torneo.',
		actor: baseUserSummary,
		context: { tournamentId: defaultTournamentId },
		createdAt: mockTime,
	};

	const feedItem: FeedItem = {
		feedItemId: 'feed_01',
		topic: 'tournament',
		feedItemType: 'tournament.update',
		title: 'Nuevo torneo',
		body: 'Se ha creado un torneo.',
		actor: baseUserSummary,
		context: { tournamentId: defaultTournamentId },
		createdAt: mockTime,
	};

	const notificationPage: NotificationPage = { serverTime: mockTime, items: [notification], nextCursor: undefined };
	const feedPage: FeedPage = { serverTime: mockTime, items: [feedItem], nextCursor: undefined, prevCursor: undefined };
	const feedReadCursor: FeedReadCursor = {
		serverTime: mockTime,
		lastSeenAt: mockTime,
		lastSeenFeedItemId: feedItem.feedItemId,
		unreadCount: 0,
	};

	const notificationUnreadCounts: NotificationUnreadCounts = {
		total: 1,
		byTopic: {
			tournament: 1,
		},
	};

	const notificationBatchResult: NotificationBatchActionResult = {
		serverTime: mockTime,
		appliedIds: [notification.notificationId],
		notFoundIds: [],
		unreadCounts: notificationUnreadCounts,
	};

	const meUpdatePage: MeUpdatePage = {
		serverTime: mockTime,
		events: [
			{
				type: 'notification.created',
				serverTime: mockTime,
				notification,
			},
		],
		nextCursor: 'cursor_01',
	};

	const verifiedBranding: VerifiedBranding = {
		title: 'Copa verificada',
		subtitle: 'Evento oficial',
		ctaLabel: 'Unirse',
	};

	const verifiedEligibility: VerifiedEligibility = {
		verified: true,
		eloEnabled: true,
		achievementsEnabled: true,
		minAccountAgeDays: 7,
		minLevel: 1,
		regionAllowList: ['global'],
		ageGate: {
			minimumAge: 13,
			required: false,
		},
	};

	const verifiedEventSchedule: VerifiedEventSchedule = {
		startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
		endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
		joinOpensAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
		joinClosesAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
	};

	const verifiedJoinInfo: VerifiedJoinInfo = {
		joinOpensAt: verifiedEventSchedule.joinOpensAt,
		joinClosesAt: verifiedEventSchedule.joinClosesAt,
		capacity: 128,
		currentPlayers: 42,
		joinMethod: 'oneTap',
		requiresAccount: true,
		eligibilitySummary: 'Cuenta verificada y +7 días.',
	};

	const verifiedTournamentPreview: VerifiedTournamentPreview = {
		...toTournamentPreview(defaultTournament),
		verificationStatus: 'verified_official',
		verified: true,
		verifiedEventId: 'vev_01',
		branding: verifiedBranding,
		eligibility: verifiedEligibility,
		joinInfo: verifiedJoinInfo,
	};

	const verifiedTournamentSummary: VerifiedTournamentSummary = {
		tournament: verifiedTournamentPreview,
		status: 'joinable',
	};

	const verifiedTournamentPage: VerifiedTournamentPage = {
		items: [verifiedTournamentSummary],
		nextCursor: undefined,
	};

	const verifiedEventSummary: VerifiedEventSummary = {
		eventId: 'vev_01',
		status: 'upcoming',
		branding: verifiedBranding,
		schedule: verifiedEventSchedule,
		sportId: defaultTournament.sportId,
		gameModeId: defaultTournament.gameModeId,
	};

	const verifiedEventPage: VerifiedEventPage = {
		items: [verifiedEventSummary],
		nextCursor: undefined,
	};

	const verifiedEvent: VerifiedEvent = {
		eventId: verifiedEventSummary.eventId,
		status: verifiedEventSummary.status,
		branding: verifiedBranding,
		eligibility: verifiedEligibility,
		schedule: verifiedEventSchedule,
		sportId: verifiedEventSummary.sportId,
		gameModeId: verifiedEventSummary.gameModeId,
		description: 'Evento verificado de ejemplo.',
		tournaments: [verifiedTournamentPreview],
		tags: ['oficial', 'temporada'],
	};

	const verifiedHubSection: VerifiedHubSection = {
		sectionId: 'sec_hero',
		type: 'hero',
		title: 'Destacado',
		subtitle: 'Eventos verificados',
		items: [
			{
				type: 'event',
				event: verifiedEventSummary,
			},
			{
				type: 'tournament',
				tournament: verifiedTournamentPreview,
			},
		],
	};

	const verifiedHub: VerifiedHub = {
		serverTime: mockTime,
		sections: [verifiedHubSection],
	};

	const rankedEligibilityPolicy: RankedEligibilityPolicy = {
		requiresVerified: true,
		requiresEloEnabled: true,
		allowedVerifiedEventIds: [verifiedEvent.eventId],
		notes: 'Solo eventos verificados.',
	};

	const rankedTierReward: RankedTierRewardPreview = {
		rewardType: 'badge',
		rewardId: 'ranked_badge_gold',
		label: 'Oro',
	};

	const rankedTierDefinition: RankedTierDefinition = {
		tierId: 'tier_gold',
		name: 'Gold',
		description: 'Nivel oro.',
		minRating: 1000,
		maxRating: 2000,
		rewards: [rankedTierReward],
	};

	const rankedTrackScope: RankedTrackScope = {
		scopeKind: 'gameModeSport',
		gameModeId: defaultTournament.gameModeId,
		sportId: defaultTournament.sportId,
		formatId: defaultTournament.formatId,
		region: 'global',
	};

	const rankedSeasonSummary: RankedSeasonSummary = {
		rankedSeasonId: 'rsn_2026_02',
		status: 'live',
		title: 'Febrero 2026',
		startsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
		endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
		joinOpensAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
		joinClosesAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
	};

	const rankedSeason: RankedSeason = {
		...rankedSeasonSummary,
		eligibility: rankedEligibilityPolicy,
		recapRecapType: 'monthly',
	};

	const rankedTrackSummary: RankedTrackSummary = {
		rankedTrackId: 'rtk_scoreprediction_global',
		status: 'active',
		name: 'ScorePrediction Global',
		description: 'Ladder global para ScorePrediction.',
		ratingModel: 'elo',
		cadence: 'monthly',
		scope: rankedTrackScope,
		activeSeasonId: rankedSeasonSummary.rankedSeasonId,
		featured: true,
		heroImageUrl: defaultTournament.heroImageUrl,
	};

	const rankedTrack: RankedTrack = {
		...rankedTrackSummary,
		eligibility: rankedEligibilityPolicy,
		tiers: [rankedTierDefinition],
		activeSeason: rankedSeason,
	};

	const rankedTrackPage: RankedTrackPage = {
		items: [rankedTrackSummary],
		nextCursor: undefined,
	};

	const rankedSeasonPage: RankedSeasonPage = {
		items: [rankedSeasonSummary],
		nextCursor: undefined,
	};

	const rankedMeta: RankedMeta = {
		serverTime: mockTime,
		defaultTrackId: rankedTrackSummary.rankedTrackId,
		tracks: [rankedTrackSummary],
		notes: 'Sistema ranked en fase beta.',
	};

	const rankedTierProgress: RankedTierProgress = {
		tierId: rankedTierDefinition.tierId,
		rating: 1200,
		nextTierId: rankedTierDefinition.tierId,
		nextTierAtRating: 1300,
		progressToNextTier: 0.4,
	};

	const rankedLeaderboardEntry: RankedLeaderboardEntry = {
		position: 1,
		user: baseUserSummary,
		rating: 1200,
		tierId: rankedTierDefinition.tierId,
		deltaSinceYesterday: 10,
		percentile: 0.01,
	};

	const rankedLeaderboard: RankedLeaderboard = {
		serverTime: mockTime,
		rankedTrackId: rankedTrackSummary.rankedTrackId,
		seasonId: rankedSeasonSummary.rankedSeasonId,
		view: 'top',
		region: 'global',
		items: [rankedLeaderboardEntry],
		nextCursor: undefined,
		myEntry: rankedLeaderboardEntry,
		tiers: [rankedTierDefinition],
	};

	const rankedSettings: RankedSettings = {
		defaultVisibility: 'public',
		perTrackVisibility: {
			[rankedTrackSummary.rankedTrackId]: 'public',
		},
		showOnPublicLeaderboards: true,
		allowFriendComparisons: true,
	};

	const rankedHistorySource: RankedHistorySource = {
		type: 'tournament',
		tournamentId: defaultTournamentId,
	};

	const rankedHistoryEvent: RankedHistoryEvent = {
		eventId: 'rhe_01',
		rankedTrackId: rankedTrackSummary.rankedTrackId,
		seasonId: rankedSeasonSummary.rankedSeasonId,
		occurredAt: mockTime,
		deltaRating: 25,
		newRating: 1200,
		oldTierId: rankedTierDefinition.tierId,
		newTierId: rankedTierDefinition.tierId,
		source: rankedHistorySource,
		provisional: false,
	};

	const rankedHistoryPage: RankedHistoryPage = {
		items: [rankedHistoryEvent],
		nextCursor: undefined,
	};

	const myRankedTrackStanding: MyRankedTrackStanding = {
		rankedTrackId: rankedTrackSummary.rankedTrackId,
		seasonId: rankedSeasonSummary.rankedSeasonId,
		rating: 1200,
		tier: rankedTierProgress,
		provisional: false,
		updatedAt: mockTime,
		me: baseUserSummary,
		position: 1,
		percentile: 0.01,
		lastDelta: rankedHistoryEvent,
	};

	const publicRankedTrackStanding: PublicRankedTrackStanding = {
		rankedTrackId: rankedTrackSummary.rankedTrackId,
		seasonId: rankedSeasonSummary.rankedSeasonId,
		rating: 1180,
		tier: rankedTierProgress,
		provisional: false,
		updatedAt: mockTime,
		user: baseUserSummary,
		position: 2,
		percentile: 0.05,
	};

	const myRankedProfile: MyRankedProfile = {
		serverTime: mockTime,
		user: baseUserSummary,
		tracks: [myRankedTrackStanding],
	};

	const publicRankedProfile: PublicRankedProfile = {
		user: baseUserSummary,
		tracks: [publicRankedTrackStanding],
	};

	const achievementReward: AchievementReward = {
		type: 'badge',
		rewardId: 'badge_exact_scorer_bronze',
		label: 'Goleador exacto',
		imageUrl: 'https://cdn.rankup.example.com/achievements/badges/exact_scorer_bronze.png',
	};

	const achievementRequirement: AchievementRequirement = {
		kind: 'counter',
		metricId: 'scorePrediction.exactScore.count',
		target: 10,
		window: 'allTime',
		comparator: 'gte',
	};

	const achievementEligibility: AchievementEligibility = {
		verifiedOnly: true,
		rankedOnly: false,
		gameModeIds: [defaultTournament.gameModeId],
		sportIds: [defaultTournament.sportId],
		formatIds: [defaultTournament.formatId],
		verifiedEventIds: [verifiedEvent.eventId],
		rankedTrackIds: [rankedTrackSummary.rankedTrackId],
		notes: 'Solo contextos verificados.',
	};

	const achievementDefinition: AchievementDefinition = {
		achievementId: 'ach_scorePrediction_exact10',
		name: 'Exacto x10',
		description: 'Acertar 10 marcadores exactos.',
		category: 'mastery',
		rarity: 'rare',
		iconUrl: 'https://cdn.rankup.example.com/achievements/icons/exact_10.png',
		featured: true,
		hidden: false,
		eligibility: achievementEligibility,
		requirements: [achievementRequirement],
		rewards: [achievementReward],
	};

	const achievementDefinitionPage: AchievementDefinitionPage = {
		items: [achievementDefinition],
		nextCursor: undefined,
	};

	const achievementMeta: AchievementMeta = {
		serverTime: mockTime,
		categories: ['mastery', 'ranked'],
		featured: [achievementDefinition],
	};

	const achievementUnlockContext: AchievementUnlockContext = {
		verifiedEventId: verifiedEvent.eventId,
		tournamentId: defaultTournamentId,
		matchday: 1,
		rankedTrackId: rankedTrackSummary.rankedTrackId,
		rankedSeasonId: rankedSeasonSummary.rankedSeasonId,
		note: 'Logro desbloqueado en torneo verificado.',
	};

	const achievementProgress: AchievementProgress = {
		achievementId: achievementDefinition.achievementId,
		definition: achievementDefinition,
		status: 'inProgress',
		progress: 0.6,
		progressByRequirement: [
			{
				metricId: achievementRequirement.metricId,
				current: 6,
				target: achievementRequirement.target,
				progress: 0.6,
			},
		],
		eligibilitySummary: 'Cuenta verificada requerida.',
		unlockContext: achievementUnlockContext,
	};

	const achievementProgressPage: AchievementProgressPage = {
		serverTime: mockTime,
		items: [achievementProgress],
		nextCursor: undefined,
	};

	const unlockedAchievementList: UnlockedAchievementList = {
		items: [
			{
				achievementId: achievementDefinition.achievementId,
				unlockedAt: mockTime,
				rewardPreview: achievementReward,
				rarity: achievementDefinition.rarity,
			},
		],
	};

	const userAchievementPage: UserAchievementPage = {
		items: [achievementProgress],
		nextCursor: undefined,
	};

	const uploadConstraints: UploadConstraints = {
		maxSizeBytes: 5242880,
		allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
		recommendedAspectRatio: '1:1',
		minWidth: 128,
		minHeight: 128,
		maxWidth: 2048,
		maxHeight: 2048,
	};

	const uploadDestination: UploadDestinationSinglePut = {
		strategy: 'singlePut',
		method: 'PUT',
		url: 'https://uploads.rankup.example.com/mock/upl_01',
		requiredHeaders: {
			'Content-Type': 'image/png',
		},
		expiresAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
	};

	const uploadChecksum: Checksum = {
		algorithm: 'sha256',
		value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
	};

	const uploadSession: UploadSession = {
		uploadId: 'upl_01J8W0K7E2ZQZ6P0M4NQW2Y7JA',
		status: 'created',
		purpose: 'user.avatar',
		scope: {
			userId: baseUser.userId,
		},
		visibility: 'public',
		kind: 'image',
		constraints: uploadConstraints,
		destination: uploadDestination,
		createdAt: mockTime,
		expiresAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
	};

	const mediaVariant: MediaVariant = {
		variantId: 'avatar_256',
		contentType: 'image/png',
		width: 256,
		height: 256,
		bytes: 102400,
		url: {
			url: 'https://cdn.rankup.example.com/media/avatar_256.png',
		},
	};

	const mediaModeration: MediaModeration = {
		status: 'approved',
	};

	const mediaAsset: Media = {
		mediaId: 'med_01J8W0K7E2ZQZ6P0M4NQW2Y7JB',
		status: 'ready',
		kind: 'image',
		purpose: 'user.avatar',
		scope: {
			userId: baseUser.userId,
		},
		visibility: 'public',
		contentType: 'image/png',
		bytes: 102400,
		checksum: uploadChecksum,
		width: 256,
		height: 256,
		moderation: mediaModeration,
		variants: [mediaVariant],
		createdAt: mockTime,
	};

	const trustPolicy: TrustPolicy = {
		policyId: 'pol_community_guidelines',
		title: 'Community Guidelines',
		version: '2026-02-01',
		updatedAt: mockTime,
		url: 'https://rankup.example.com/policies/community',
		summary: 'Resumen breve de las normas comunitarias.',
		content: 'Contenido completo de la política.',
	};

	const trustPolicyList: TrustPolicyList = {
		items: [trustPolicy],
	};

	const enforcementStatus: EnforcementStatus = {
		serverTime: mockTime,
		isRestricted: false,
		actions: [
			{
				actionId: 'enf_01J8W0K7E2ZQZ6P0M4NQW2Y7IA',
				type: 'chatMuteGlobal',
				createdAt: mockTime,
				reasonCode: 'spam',
				reasonText: 'Actividad sospechosa detectada.',
				appealable: true,
				policyId: trustPolicy.policyId,
			},
		],
	};

	const appeal: Appeal = {
		appealId: 'apl_01J8W0K7E2ZQZ6P0M4NQW2Y7GA',
		actionId: enforcementStatus.actions[0].actionId,
		status: 'underReview',
		message: 'Creo que la restricción es un error.',
		createdAt: mockTime,
		updatedAt: mockTime,
	};

	const appealPage: AppealPage = {
		items: [appeal],
		nextCursor: undefined,
	};

	const report: Report = {
		reportId: 'rpt_01J8W0K7E2ZQZ6P0M4NQW2Y7HA',
		target: {
			type: 'chatMessage',
			tournamentId: defaultTournamentId,
			messageId: 'chat_msg_01',
		},
		reason: 'spam',
		status: 'submitted',
		comment: 'Contenido no deseado.',
		createdAt: mockTime,
		updatedAt: mockTime,
	};

	const reportPage: ReportPage = {
		items: [report],
		nextCursor: undefined,
	};

	const trustBlockEntry: TrustBlockEntry = {
		user: baseUserSummary,
		blockedAt: mockTime,
		reason: 'spam',
	};

	const trustBlockPage: TrustBlockPage = {
		items: [trustBlockEntry],
		nextCursor: undefined,
	};

	const promotionRewardDefinition: PromotionRewardDefinition = {
		rewardId: 'rw_giftcard_50',
		type: 'giftCard',
		title: 'Gift Card 50€',
		description: 'Tarjeta regalo digital.',
		imageUrl: 'https://cdn.rankup.example.com/rewards/giftcard.png',
		quantity: 50,
		estimatedValueText: 'Valor estimado: 50€',
		fulfillmentMethod: 'email',
	};

	const promotionSummaryLive: PromotionSummary = {
		promotionId: 'pr_01J8W0K7E2ZQZ6P0M4NQW2Y7FA',
		status: 'live',
		type: 'leaderboardPlacement',
		title: 'Desafío Verificado',
		subtitle: 'Consigue puntos y gana premios',
		heroImageUrl: 'https://cdn.rankup.example.com/promotions/hero.png',
		schedule: {
			startsAt: mockTime,
			endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
			joinOpensAt: mockTime,
			joinClosesAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
		},
		scope: {
			scopeKind: 'verifiedEvent',
			verifiedEventId: 'vev_01J8W0K7E2ZQZ6P0M4NQW2Y7FC',
		},
		sportId: 'football',
		gameModeId: 'scorePrediction',
		featured: true,
		rewardsPreview: [promotionRewardDefinition],
	};

	const promotionSummaryEnded: PromotionSummary = {
		promotionId: 'pr_01J8W0K7E2ZQZ6P0M4NQW2Y7FB',
		status: 'ended',
		type: 'randomDraw',
		title: 'Sorteo de Temporada',
		schedule: {
			startsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
			endsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
		},
		scope: {
			scopeKind: 'verifiedEvent',
			verifiedEventId: 'vev_01J8W0K7E2ZQZ6P0M4NQW2Y7FC',
		},
		rewardsPreview: [promotionRewardDefinition],
	};

	const promotionSummaryPage: PromotionSummaryPage = {
		items: [promotionSummaryLive, promotionSummaryEnded],
		nextCursor: undefined,
	};

	const promotionMeState: PromotionMeState = {
		promotionId: promotionSummaryLive.promotionId,
		eligibilityStatus: 'eligible',
		participationStatus: 'participating',
		canOptIn: true,
		optedInAt: mockTime,
		acceptedTermsVersion: '2026-02-01',
		blockedReasons: [],
		requiredActions: [],
		nextSteps: 'Sigue participando para optar a los premios.',
	};

	const promotion: Promotion = {
		...promotionSummaryLive,
		description: 'Participa en el evento verificado y gana recompensas.',
		mechanics: [
			{
				kind: 'joinAndPlay',
				summary: 'Únete y juega para optar al sorteo.',
				details: 'Participa en el evento y suma puntos.',
				parameters: {
					minMatches: 3,
				},
			},
		],
		rewards: [promotionRewardDefinition],
		eligibility: {
			verifiedOnly: true,
			minAccountAgeDays: 7,
			minLevel: 1,
			regionAllowList: ['ES'],
			ageGate: {
				required: true,
				minimumAge: 18,
			},
			notes: 'Solo para mayores de 18.',
		},
		legal: {
			termsVersion: '2026-02-01',
			termsUrl: 'https://rankup.example.com/promotions/terms/2026-02-01',
			disclaimer: 'No hay apuestas ni compras necesarias.',
			privacyNotes: 'Los ganadores pueden aparecer de forma anónima.',
		},
		myStatus: promotionMeState,
		winnersPreview: {
			published: false,
			winnerCount: 0,
		},
	};

	const promotionWinnerPage: PromotionWinnerPage = {
		published: true,
		items: [
			{
				position: 1,
				displayName: 'Jugador Top',
				reward: promotionRewardDefinition,
				announcedAt: mockTime,
			},
		],
		nextCursor: undefined,
	};

	const myPromotionPage: MyPromotionPage = {
		items: [
			{
				promotion: promotionSummaryLive,
				myStatus: promotionMeState,
			},
		],
		nextCursor: undefined,
	};

	const rewardSource: RewardSource = {
		promotionId: promotionSummaryLive.promotionId,
		verifiedEventId: promotionSummaryLive.scope.verifiedEventId,
	};

	const rewardDelivery: RewardDelivery = {
		method: 'email',
		status: 'pending',
		emailSentTo: 'm***@rankup.dev',
		lastUpdatedAt: mockTime,
	};

	const rewardGrant: RewardGrant = {
		rewardGrantId: 'rgr_01J8W0K7E2ZQZ6P0M4NQW2Y7FB',
		status: 'claimable',
		reward: promotionRewardDefinition,
		source: rewardSource,
		claimDeadlineAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
		legal: {
			termsVersion: '2026-02-01',
			termsUrl: 'https://rankup.example.com/promotions/terms/2026-02-01',
		},
		delivery: rewardDelivery,
	};

	const rewardGrantPage: RewardGrantPage = {
		items: [rewardGrant],
		nextCursor: undefined,
	};

	const shippingAddress: ShippingAddress = {
		fullName: 'Mock User',
		line1: 'Calle Falsa 123',
		city: 'Madrid',
		postalCode: '28001',
		country: 'ES',
	};

	const rewardFulfillmentProfile: RewardFulfillmentProfile = {
		defaultEmail: 'mock@rankup.dev',
		shippingAddress,
		updatedAt: mockTime,
	};

	const creatorBranding: CreatorBranding = {
		displayName: 'Sky Sports ES',
		avatarUrl: 'https://cdn.rankup.example.com/creators/sky/avatar.png',
		heroImageUrl: 'https://cdn.rankup.example.com/creators/sky/hero.png',
		themeKey: 'sky_sports',
		accentColor: '#FFCC00',
	};

	const creatorStats: CreatorStats = {
		followerCount: 120000,
		activeEventsCount: 2,
		activeTournamentsCount: 1,
		joinedLast24h: 450,
	};

	const creatorSummary: CreatorSummary = {
		creatorId: 'cr_01J8W0K7E2ZQZ6P0M4NQW2Y7CA',
		handle: 'sky_sports_es',
		type: 'media',
		verified: true,
		branding: creatorBranding,
		shortDescription: 'Cobertura en vivo de futbol.',
		supportedSportIds: [defaultTournament.sportId],
		supportedGameModeIds: [defaultTournament.gameModeId],
		stats: creatorStats,
	};

	const creatorCatalogItemEvent: CreatorCatalogItem = {
		type: 'event',
		event: verifiedEventSummary,
	};

	const creatorCatalogItemTournament: CreatorCatalogItem = {
		type: 'tournament',
		tournament: verifiedTournamentPreview,
	};

	const creatorCatalogSummary: CreatorCatalogSummary = {
		featuredEvent: verifiedEventSummary,
		featuredTournament: verifiedTournamentPreview,
		upcoming: [creatorCatalogItemEvent, creatorCatalogItemTournament],
	};

	const creatorProfile: CreatorProfile = {
		...creatorSummary,
		longDescription: 'Perfil oficial del creador con eventos verificados.',
		links: [
			{
				type: 'x',
				url: 'https://x.com/sky_sports_es',
				label: 'X',
			},
		],
		catalogSummary: creatorCatalogSummary,
		primaryUserId: baseUser.userId,
	};

	const creatorPage: CreatorPage = {
		items: [creatorSummary],
		nextCursor: undefined,
	};

	const creatorCollectionSummary: CreatorCollectionSummary = {
		collectionId: 'col_01J8W0K7E2ZQZ6P0M4NQW2Y7CB',
		title: 'Liga del finde',
		subtitle: 'Eventos destacados',
		heroImageUrl: 'https://cdn.rankup.example.com/creators/collections/hero.png',
		itemCount: 2,
	};

	const creatorCollection: CreatorCollection = {
		...creatorCollectionSummary,
		description: 'Selección curada de torneos recomendados.',
		items: [creatorCatalogItemEvent, creatorCatalogItemTournament],
	};

	const creatorCollectionPage: CreatorCollectionPage = {
		items: [creatorCollectionSummary],
		nextCursor: undefined,
	};

	const creatorHubSection: CreatorHubSection = {
		sectionId: 'sec_featured',
		type: 'featured',
		title: 'Destacados',
		subtitle: 'Lo mejor del creador',
		items: [creatorCatalogItemEvent, creatorCatalogItemTournament],
		collections: [creatorCollectionSummary],
	};

	const creatorHub: CreatorHub = {
		creator: creatorSummary,
		serverTime: mockTime,
		sections: [creatorHubSection],
	};

	const creatorEventPage: CreatorEventPage = {
		items: [verifiedEventSummary],
		nextCursor: undefined,
	};

	const creatorTournamentPage: CreatorTournamentPage = {
		items: [verifiedTournamentPreview],
		nextCursor: undefined,
	};

	const chatSettings: TournamentChatSettings = {
		enabled: true,
		slowModeSeconds: 0,
		maxMessageLength: 280,
		allowLinks: true,
		allowImages: false,
		profanityFilterLevel: 'medium',
	};

	const chatState: TournamentChatState = {
		isMuted: false,
		canSend: true,
	};

	const tournamentChat: TournamentChat = {
		tournamentId: defaultTournamentId,
		serverTime: mockTime,
		settings: chatSettings,
		myState: chatState,
		myPermissions: ['chat.read', 'chat.send', 'chat.edit.own'],
	};

	const chatMessageBase: ChatMessage = {
		messageId: 'chat_msg_01',
		tournamentId: defaultTournamentId,
		type: 'text',
		sender: baseUserSummary,
		text: 'Bienvenido al chat del torneo.',
		createdAt: mockTime,
	};

	const buildChatMessage = (patch: Partial<ChatMessage> = {}): ChatMessage => ({
		...chatMessageBase,
		...patch,
	});

	const chatMessage = buildChatMessage();

	const chatMessagePage: ChatMessagePage = {
		serverTime: mockTime,
		items: [chatMessage],
		nextCursor: undefined,
	};

	const chatReadCursor: ChatReadCursor = {
		tournamentId: defaultTournamentId,
		serverTime: mockTime,
		lastReadMessageId: chatMessage.messageId,
		lastReadAt: mockTime,
		unreadCount: 0,
	};

	const chatPinnedMessages: ChatPinnedMessages = {
		items: [],
	};

	const chatMuteEntry: ChatMuteEntry = {
		tournamentId: defaultTournamentId,
		user: baseUserSummary,
		mutedUntil: mockTime,
		status: 'active',
		reason: 'spam',
		createdAt: mockTime,
		createdBy: baseUserSummary,
	};

	const chatMutePage: ChatMutePage = {
		items: [chatMuteEntry],
		nextCursor: undefined,
	};

	const chatReport: ChatReport = {
		reportId: 'report_01',
		tournamentId: defaultTournamentId,
		reporterUserId: baseUserSummary.userId,
		messageId: chatMessage.messageId,
		reason: 'spam',
		comment: 'Contenido no deseado.',
		createdAt: mockTime,
	};

	const chatUpdatePage: ChatUpdatePage = {
		serverTime: mockTime,
		events: [
			{
				eventId: 'evt_01',
				type: 'chat.message.created',
				serverTime: mockTime,
				message: chatMessage,
			},
		],
		nextCursor: 'cursor_01',
	};

	const scorePredictionTotals: ScorePredictionAggregateCounters = {
		matchesInScope: 10,
		predictionsSubmitted: 10,
		exactScores: 2,
		correctOutcomes: 6,
		exactGoalsOneTeam: 3,
		penalties: 0,
		bonuses: 0,
	};

	const scorePredictionRates: ScorePredictionAggregateRates = {
		predictionCompletionRate: 1,
		exactScoreRate: 0.2,
		correctOutcomeRate: 0.6,
	};

	const statsBase = {
		gameModeId: 'scorePrediction',
		sportId: 'football',
		serverTime: mockTime,
		computedAt: mockTime,
		verifiedOnly: false,
	};

	const myStatsSnapshot: MyStatsSnapshot = {
		...statsBase,
		gameModeId: 'scorePrediction',
		user: baseUserSummary,
		totals: scorePredictionTotals,
		rates: scorePredictionRates,
	};

	const publicUserStatsSnapshot: PublicUserStatsSnapshot = {
		...statsBase,
		gameModeId: 'scorePrediction',
		user: baseUserSummary,
		totals: scorePredictionTotals,
		rates: scorePredictionRates,
	};

	const tournamentStatsSnapshot: TournamentStatsSnapshot = {
		...statsBase,
		gameModeId: 'scorePrediction',
		tournamentId: defaultTournamentId,
		totals: scorePredictionTotals,
	};

	const userTournamentStatsSnapshot: UserTournamentStatsSnapshot = {
		...statsBase,
		gameModeId: 'scorePrediction',
		tournamentId: defaultTournamentId,
		user: baseUserSummary,
		totals: scorePredictionTotals,
		rates: scorePredictionRates,
	};

	const matchdayStatsSnapshot: MatchdayStatsSnapshot = {
		...statsBase,
		gameModeId: 'scorePrediction',
		tournamentId: defaultTournamentId,
		matchday: 1,
		totals: scorePredictionTotals,
	};

	const userMatchdayStatsSnapshot: UserMatchdayStatsSnapshot = {
		...statsBase,
		gameModeId: 'scorePrediction',
		tournamentId: defaultTournamentId,
		matchday: 1,
		user: baseUserSummary,
		totals: scorePredictionTotals,
		rates: scorePredictionRates,
	};

	const recapSummary: RecapSummary = {
		recapId: 'recap_01',
		type: 'tournamentFinal',
		status: 'available',
		scope: 'tournament',
		title: 'Resumen de temporada',
		context: {
			tournamentId: defaultTournamentId,
			gameModeId: 'scorePrediction',
			sportId: 'football',
			tournamentName: defaultTournament.name,
		},
		createdAt: mockTime,
		availableAt: mockTime,
	};

	const recapSummaryPage: RecapSummaryPage = {
		items: [recapSummary],
		nextCursor: undefined,
	};

	const recap: Recap = {
		...recapSummary,
		view: 'me',
		cards: [
			{
				cardId: 'card_01',
				type: 'summary',
				title: 'Puntos totales',
				value: 1200,
				valueLabel: 'pts',
			},
		],
	};

	return {
		async getUser(params: Parameters<RankupApiClient['getUser']>[0]) {
			return (await executeMockHandler(registry, 'getUserPublicProfile', { params })).response;
		},
		async listSports() {
			return buildSportList();
		},
		async registerUser(body: Parameters<RankupApiClient['registerUser']>[0]) {
			return buildRegistration(body.email);
		},
		async confirmRegistration(_body: Parameters<RankupApiClient['confirmRegistration']>[0]) {
			return buildAuthSession();
		},
		async resendRegistrationConfirmation(_body: Parameters<RankupApiClient['resendRegistrationConfirmation']>[0]) {
			return;
		},
		async createSession(_body: Parameters<RankupApiClient['createSession']>[0]) {
			return buildAuthSession();
		},
		async refreshSession(_body: Parameters<RankupApiClient['refreshSession']>[0]) {
			return buildAuthSession();
		},
		async logout() {
			return;
		},
		async requestPasswordReset(_body: Parameters<RankupApiClient['requestPasswordReset']>[0]) {
			return;
		},
		async confirmPasswordReset(_body: Parameters<RankupApiClient['confirmPasswordReset']>[0]) {
			return;
		},
		async getMe() {
			return buildMe();
		},
		async updateMe(body: Parameters<RankupApiClient['updateMe']>[0]) {
			const current = buildMe();
			return { ...current, ...body, updatedAt: now() };
		},
		async searchUsers(query: Parameters<RankupApiClient['searchUsers']>[0]) {
			return buildUserDirectoryPage(query);
		},
		async resolveUserByUsername(params: Parameters<RankupApiClient['resolveUserByUsername']>[0]) {
			const match = registry.db.users.list().find(user => user.username.toLowerCase() === params.username.toLowerCase());
			return match ?? resolveUser(registry.db);
		},
		async getMyRelationship(params: Parameters<RankupApiClient['getMyRelationship']>[0]) {
			return buildRelationshipStatus(params.userId);
		},
		async listMyFriends(_query: Parameters<RankupApiClient['listMyFriends']>[0]) {
			return buildFriendPage();
		},
		async listMyFollowers(_query: Parameters<RankupApiClient['listMyFollowers']>[0]) {
			return buildFollowPage();
		},
		async listMyFollowing(_query: Parameters<RankupApiClient['listMyFollowing']>[0]) {
			return buildFollowPage();
		},
		async followUser(params: Parameters<RankupApiClient['followUser']>[0]) {
			return { ...buildRelationshipStatus(params.userId), youFollow: true };
		},
		async unfollowUser(_params: Parameters<RankupApiClient['unfollowUser']>[0]) {
			return;
		},
		async listGameModes(query: Parameters<RankupApiClient['listGameModes']>[0]) {
			return buildGameModeList(query);
		},
		async getGameMode(params: Parameters<RankupApiClient['getGameMode']>[0]) {
			return pickGameMode(params.gameModeId);
		},
		async listRulesets(query: Parameters<RankupApiClient['listRulesets']>[0]) {
			return buildRulesetPage(query);
		},
		async getRuleset(params: Parameters<RankupApiClient['getRuleset']>[0]) {
			return pickRuleset(params.rulesetId);
		},
		async listCompetitions(query: Parameters<RankupApiClient['listCompetitions']>[0]) {
			return (await executeMockHandler(registry, 'listCompetitions', { query })).response;
		},
		async getCompetition(params: Parameters<RankupApiClient['getCompetition']>[0]) {
			return pickCompetition(params.competitionId);
		},
		async listCompetitionSeasons(params: Parameters<RankupApiClient['listCompetitionSeasons']>[0]) {
			return buildSeasonList(params.competitionId);
		},
		async getCompetitionSeason(params: Parameters<RankupApiClient['getCompetitionSeason']>[0]) {
			const seasons = buildSeasonList(params.competitionId).items;
			const season = seasons.find(item => item.seasonId === params.seasonId) ?? seasons[0];
			return season ?? buildSeasonList(params.competitionId).items[0];
		},
		async getTeam(params: Parameters<RankupApiClient['getTeam']>[0]) {
			const matches = registry.db.matches.list();
			const match = matches.find(item => item.homeTeam?.teamId === params.teamId || item.awayTeam?.teamId === params.teamId);
			const team = match?.homeTeam?.teamId === params.teamId ? match.homeTeam : match?.awayTeam;
			return {
				teamId: params.teamId,
				name: team?.name ?? 'Team',
				shortName: team?.shortName,
				countryCode: 'ES',
				crestUrl: team?.crestUrl,
				primaryColor: '#FFFFFF',
			};
		},
		async listMatchdays(params: Parameters<RankupApiClient['listMatchdays']>[0]) {
			const matches = registry.db.matches.list().filter(match => match.competitionId === params.competitionId && match.seasonId === params.seasonId);
			const matchdays = [...new Set(matches.map(match => match.matchday).filter((value): value is number => value !== undefined))];
			const items = (matchdays.length ? matchdays : [1]).map(matchday => {
				const dayMatches = matches.filter(match => match.matchday === matchday);
				const startsAt = dayMatches[0]?.scheduledAt ?? now();
				const endsAt = dayMatches[dayMatches.length - 1]?.scheduledAt ?? now();
				return {
					matchday,
					status: 'upcoming' as const,
					startsAt,
					endsAt,
					matchCount: dayMatches.length,
				};
			});
			return { items };
		},
		async listMatchdayMatches(params: Parameters<RankupApiClient['listMatchdayMatches']>[0]) {
			const matches = registry.db.matches
				.list()
				.filter(match => match.competitionId === params.competitionId && match.seasonId === params.seasonId && match.matchday === params.matchday)
				.map(toMatch);
			return { items: matches };
		},
		async searchMatches(query: Parameters<RankupApiClient['searchMatches']>[0]) {
			const matches = filterMatches(query).map(toMatch);
			return { items: matches };
		},
		async getMatch(params: Parameters<RankupApiClient['getMatch']>[0]) {
			const match = registry.db.matches.get(params.matchId) ?? registry.db.matches.list()[0];
			return match ? toMatch(match) : toMatch(registry.db.matches.list()[0]);
		},
		async listMatchEvents(params: Parameters<RankupApiClient['listMatchEvents']>[0]) {
			return { items: [], nextCursor: undefined };
		},
		async listMyTournaments(query: Parameters<RankupApiClient['listMyTournaments']>[0]) {
			return (await executeMockHandler(registry, 'listMyTournaments', { query })).response;
		},
		async listMyDuels(_query: Parameters<RankupApiClient['listMyDuels']>[0]) {
			return buildDuelPage();
		},
		async createTournament(body: Parameters<RankupApiClient['createTournament']>[0]) {
			return (await executeMockHandler(registry, 'createTournament', { body })).response;
		},
		async createDuel(body: Parameters<RankupApiClient['createDuel']>[0]) {
			const tournamentId = `duel_${Date.now()}`;
			const tournament: Tournament = {
				...createFallbackTournamentSummary(tournamentId),
				name: body.name,
				description: body.description,
				visibility: body.visibility,
				discoverability: body.discoverability ?? 'unlisted',
				sportId: body.sportId,
				gameModeId: body.gameModeId,
				formatId: 'headsUp',
				modality: body.modality,
				status: 'upcoming',
				joinPolicy: body.joinPolicy,
				timing: body.timing,
				rulesetId: body.rulesetId,
				formatConfig: body.formatConfig,
				headsUpAcceptance: {
					status: 'pending',
					challengerUserId: baseUser.userId,
					opponentUserId: body.opponentUserId,
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
				},
				myMembership: pickMembership(),
			};
			registry.db.tournaments.create({
				tournamentId,
				tournament,
				membership: pickMembership(),
			});
			return tournament;
		},
		async createDuelRematch(
			params: Parameters<RankupApiClient['createDuelRematch']>[0],
			body?: Parameters<RankupApiClient['createDuelRematch']>[1],
		) {
			const source = pickTournamentSummary(params.tournamentId);
			const tournamentId = `duel_${Date.now()}`;
			const tournament: Tournament = {
				...source,
				tournamentId,
				name: body?.name ?? `${source.name} Rematch`,
				formatId: 'headsUp',
				formatConfig: body?.formatConfigOverrides ?? undefined,
				headsUpAcceptance: {
					status: 'pending',
					challengerUserId: baseUser.userId,
					opponentUserId: resolveUser(registry.db, 'user-cr7').userId,
					expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
				},
				myMembership: pickMembership(),
			};
			registry.db.tournaments.create({
				tournamentId,
				tournament,
				membership: pickMembership(),
			});
			return tournament;
		},
		async getTournamentPreview(params: Parameters<RankupApiClient['getTournamentPreview']>[0]) {
			const summary = pickTournamentSummary(params.tournamentId);
			return toTournamentPreview(summary);
		},
		async getVerifiedHub(_query: Parameters<RankupApiClient['getVerifiedHub']>[0]) {
			return verifiedHub;
		},
		async listVerifiedEvents(_query: Parameters<RankupApiClient['listVerifiedEvents']>[0]) {
			return verifiedEventPage;
		},
		async getVerifiedEvent(params: Parameters<RankupApiClient['getVerifiedEvent']>[0]) {
			return {
				...verifiedEvent,
				eventId: params.eventId,
			};
		},
		async listVerifiedEventTournaments(params: Parameters<RankupApiClient['listVerifiedEventTournaments']>[0]) {
			return {
				...verifiedTournamentPage,
				items: verifiedTournamentPage.items.map(item => ({
					...item,
					tournament: {
						...item.tournament,
						verifiedEventId: params.eventId,
					},
				})),
			};
		},
		async listVerifiedTournaments(_query: Parameters<RankupApiClient['listVerifiedTournaments']>[0]) {
			return verifiedTournamentPage;
		},
		async getVerifiedTournamentPreview(params: Parameters<RankupApiClient['getVerifiedTournamentPreview']>[0]) {
			return {
				...verifiedTournamentPreview,
				tournamentId: params.tournamentId,
			};
		},
		async getRankedMeta(_query: Parameters<RankupApiClient['getRankedMeta']>[0]) {
			return rankedMeta;
		},
		async listRankedTracks(_query: Parameters<RankupApiClient['listRankedTracks']>[0]) {
			return rankedTrackPage;
		},
		async getRankedTrack(params: Parameters<RankupApiClient['getRankedTrack']>[0]) {
			return {
				...rankedTrack,
				rankedTrackId: params.rankedTrackId,
			};
		},
		async listRankedSeasons(_params: Parameters<RankupApiClient['listRankedSeasons']>[0]) {
			return rankedSeasonPage;
		},
		async getRankedSeason(params: Parameters<RankupApiClient['getRankedSeason']>[0]) {
			return {
				...rankedSeason,
				rankedSeasonId: params.rankedSeasonId,
			};
		},
		async getRankedLeaderboard(
			params: Parameters<RankupApiClient['getRankedLeaderboard']>[0],
			query: Parameters<RankupApiClient['getRankedLeaderboard']>[1],
		) {
			return {
				...rankedLeaderboard,
				rankedTrackId: params.rankedTrackId,
				seasonId: query?.seasonId ?? rankedLeaderboard.seasonId,
			};
		},
		async getRankedSeasonLeaderboard(
			params: Parameters<RankupApiClient['getRankedSeasonLeaderboard']>[0],
			_query: Parameters<RankupApiClient['getRankedSeasonLeaderboard']>[1],
		) {
			return {
				...rankedLeaderboard,
				rankedTrackId: params.rankedTrackId,
				seasonId: params.rankedSeasonId,
			};
		},
		async getMyRankedProfile(_query: Parameters<RankupApiClient['getMyRankedProfile']>[0]) {
			return myRankedProfile;
		},
		async getMyRankedSettings() {
			return rankedSettings;
		},
		async updateMyRankedSettings(body: Parameters<RankupApiClient['updateMyRankedSettings']>[0]) {
			return {
				...rankedSettings,
				defaultVisibility: body.defaultVisibility ?? rankedSettings.defaultVisibility,
				perTrackVisibility: body.perTrackVisibility ?? rankedSettings.perTrackVisibility,
				showOnPublicLeaderboards: body.showOnPublicLeaderboards ?? rankedSettings.showOnPublicLeaderboards,
				allowFriendComparisons: body.allowFriendComparisons ?? rankedSettings.allowFriendComparisons,
			};
		},
		async getMyRankedTrack(
			params: Parameters<RankupApiClient['getMyRankedTrack']>[0],
			query: Parameters<RankupApiClient['getMyRankedTrack']>[1],
		) {
			return {
				...myRankedTrackStanding,
				rankedTrackId: params.rankedTrackId,
				seasonId: query?.seasonId ?? myRankedTrackStanding.seasonId,
			};
		},
		async listMyRankedHistory(
			params: Parameters<RankupApiClient['listMyRankedHistory']>[0],
			query: Parameters<RankupApiClient['listMyRankedHistory']>[1],
		) {
			const seasonId = query?.seasonId ?? rankedHistoryEvent.seasonId;
			return {
				...rankedHistoryPage,
				items: rankedHistoryPage.items.map(item => ({
					...item,
					rankedTrackId: params.rankedTrackId,
					seasonId,
				})),
			};
		},
		async getUserRankedProfile(
			params: Parameters<RankupApiClient['getUserRankedProfile']>[0],
			_query: Parameters<RankupApiClient['getUserRankedProfile']>[1],
		) {
			const user = toMeSummary(resolveUser(registry.db, params.userId));
			return {
				...publicRankedProfile,
				user,
				tracks: publicRankedProfile.tracks.map(track => ({
					...track,
					user,
				})),
			};
		},
		async getUserRankedTrack(
			params: Parameters<RankupApiClient['getUserRankedTrack']>[0],
			query: Parameters<RankupApiClient['getUserRankedTrack']>[1],
		) {
			const user = toMeSummary(resolveUser(registry.db, params.userId));
			return {
				...publicRankedTrackStanding,
				user,
				rankedTrackId: params.rankedTrackId,
				seasonId: query?.seasonId ?? publicRankedTrackStanding.seasonId,
			};
		},
		async getAchievementMeta(_query: Parameters<RankupApiClient['getAchievementMeta']>[0]) {
			return achievementMeta;
		},
		async listAchievementDefinitions(_query: Parameters<RankupApiClient['listAchievementDefinitions']>[0]) {
			return achievementDefinitionPage;
		},
		async getAchievementDefinition(params: Parameters<RankupApiClient['getAchievementDefinition']>[0]) {
			return {
				...achievementDefinition,
				achievementId: params.achievementId,
			};
		},
		async listMyAchievements(_query: Parameters<RankupApiClient['listMyAchievements']>[0]) {
			return achievementProgressPage;
		},
		async listMyUnlockedAchievements(_query: Parameters<RankupApiClient['listMyUnlockedAchievements']>[0]) {
			return unlockedAchievementList;
		},
		async getMyAchievement(params: Parameters<RankupApiClient['getMyAchievement']>[0]) {
			return {
				...achievementProgress,
				achievementId: params.achievementId,
			};
		},
		async listUserAchievements(_params: Parameters<RankupApiClient['listUserAchievements']>[0]) {
			return userAchievementPage;
		},
		async createUpload(body: Parameters<RankupApiClient['createUpload']>[0]) {
			return {
				...uploadSession,
				purpose: body.purpose,
				scope: body.scope ?? uploadSession.scope,
				visibility: body.visibility ?? uploadSession.visibility,
				kind: body.kind ?? uploadSession.kind,
				constraints: uploadConstraints,
				destination: uploadDestination,
			};
		},
		async getUpload(params: Parameters<RankupApiClient['getUpload']>[0]) {
			return {
				...uploadSession,
				uploadId: params.uploadId,
			};
		},
		async abortUpload(_params: Parameters<RankupApiClient['abortUpload']>[0]) {
			return undefined;
		},
		async completeUpload(_params: Parameters<RankupApiClient['completeUpload']>[0]) {
			return mediaAsset;
		},
		async getMedia(params: Parameters<RankupApiClient['getMedia']>[0]) {
			return {
				...mediaAsset,
				mediaId: params.mediaId,
			};
		},
		async deleteMedia(_params: Parameters<RankupApiClient['deleteMedia']>[0]) {
			return undefined;
		},
		async listTrustPolicies(_query: Parameters<RankupApiClient['listTrustPolicies']>[0]) {
			return trustPolicyList;
		},
		async getTrustPolicy(params: Parameters<RankupApiClient['getTrustPolicy']>[0]) {
			return {
				...trustPolicy,
				policyId: params.policyId,
			};
		},
		async getMyEnforcementStatus() {
			return enforcementStatus;
		},
		async listMyAppeals(_query: Parameters<RankupApiClient['listMyAppeals']>[0]) {
			return appealPage;
		},
		async createMyAppeal(_body: Parameters<RankupApiClient['createMyAppeal']>[0]) {
			return appeal;
		},
		async getMyAppeal(params: Parameters<RankupApiClient['getMyAppeal']>[0]) {
			return {
				...appeal,
				appealId: params.appealId,
			};
		},
		async listMyReports(_query: Parameters<RankupApiClient['listMyReports']>[0]) {
			return reportPage;
		},
		async createReport(body: Parameters<RankupApiClient['createReport']>[0]) {
			return {
				...report,
				target: body.target,
				reason: body.reason,
				comment: body.comment,
			};
		},
		async getMyReport(params: Parameters<RankupApiClient['getMyReport']>[0]) {
			return {
				...report,
				reportId: params.reportId,
			};
		},
		async listMyTrustBlocks(_query: Parameters<RankupApiClient['listMyTrustBlocks']>[0]) {
			return trustBlockPage;
		},
		async listPromotions(_query: Parameters<RankupApiClient['listPromotions']>[0]) {
			return promotionSummaryPage;
		},
		async getPromotion(params: Parameters<RankupApiClient['getPromotion']>[0]) {
			return {
				...promotion,
				promotionId: params.promotionId,
			};
		},
		async listPromotionWinners(_params: Parameters<RankupApiClient['listPromotionWinners']>[0]) {
			return promotionWinnerPage;
		},
		async getMyPromotionStatus(params: Parameters<RankupApiClient['getMyPromotionStatus']>[0]) {
			return {
				...promotionMeState,
				promotionId: params.promotionId,
			};
		},
		async optInToPromotion(
			params: Parameters<RankupApiClient['optInToPromotion']>[0],
			body: Parameters<RankupApiClient['optInToPromotion']>[1],
		) {
			return {
				...promotionMeState,
				promotionId: params.promotionId,
				participationStatus: 'optedIn',
				acceptedTermsVersion: body.termsVersion,
			};
		},
		async optOutFromPromotion(_params: Parameters<RankupApiClient['optOutFromPromotion']>[0]) {
			return undefined;
		},
		async listMyPromotions(_query: Parameters<RankupApiClient['listMyPromotions']>[0]) {
			return myPromotionPage;
		},
		async listMyRewards(_query: Parameters<RankupApiClient['listMyRewards']>[0]) {
			return rewardGrantPage;
		},
		async getMyReward(params: Parameters<RankupApiClient['getMyReward']>[0]) {
			return {
				...rewardGrant,
				rewardGrantId: params.rewardGrantId,
			};
		},
		async claimMyReward(
			params: Parameters<RankupApiClient['claimMyReward']>[0],
			body: Parameters<RankupApiClient['claimMyReward']>[1],
		) {
			return {
				...rewardGrant,
				rewardGrantId: params.rewardGrantId,
				status: 'claimed',
				legal: {
					termsVersion: body.termsVersion,
					termsUrl: rewardGrant.legal?.termsUrl ?? '',
				},
			};
		},
		async getMyRewardFulfillmentProfile() {
			return rewardFulfillmentProfile;
		},
		async updateMyRewardFulfillmentProfile(body: Parameters<RankupApiClient['updateMyRewardFulfillmentProfile']>[0]) {
			return {
				...rewardFulfillmentProfile,
				defaultEmail: body.defaultEmail ?? rewardFulfillmentProfile.defaultEmail,
				shippingAddress: body.shippingAddress ?? rewardFulfillmentProfile.shippingAddress,
				updatedAt: now(),
			};
		},
		async listCreators(_query: Parameters<RankupApiClient['listCreators']>[0]) {
			return creatorPage;
		},
		async getCreator(params: Parameters<RankupApiClient['getCreator']>[0]) {
			return {
				...creatorProfile,
				creatorId: params.creatorId,
			};
		},
		async getCreatorHub(params: Parameters<RankupApiClient['getCreatorHub']>[0]) {
			return {
				...creatorHub,
				creator: {
					...creatorHub.creator,
					creatorId: params.creatorId,
				},
			};
		},
		async listCreatorEvents(_params: Parameters<RankupApiClient['listCreatorEvents']>[0]) {
			return creatorEventPage;
		},
		async listCreatorTournaments(_params: Parameters<RankupApiClient['listCreatorTournaments']>[0]) {
			return creatorTournamentPage;
		},
		async listCreatorCollections(_params: Parameters<RankupApiClient['listCreatorCollections']>[0]) {
			return creatorCollectionPage;
		},
		async getCreatorCollection(params: Parameters<RankupApiClient['getCreatorCollection']>[0]) {
			return {
				...creatorCollection,
				collectionId: params.collectionId,
			};
		},
		async getTournamentRanking(params: Parameters<RankupApiClient['getTournamentRanking']>[0]) {
			return buildRankingPage(params.tournamentId, 'season');
		},
		async getTournamentRankingWindow(params: Parameters<RankupApiClient['getTournamentRankingWindow']>[0]) {
			return buildRankingWindow(params.tournamentId, 'season');
		},
		async getTournamentMatchdayRanking(params: Parameters<RankupApiClient['getTournamentMatchdayRanking']>[0]) {
			return buildRankingPage(params.tournamentId, 'matchday', params.matchday);
		},
		async getTournamentMatchdayRankingWindow(params: Parameters<RankupApiClient['getTournamentMatchdayRankingWindow']>[0]) {
			return buildRankingWindow(params.tournamentId, 'matchday', params.matchday);
		},
		async listTournamentMatchdays(_params: Parameters<RankupApiClient['listTournamentMatchdays']>[0]) {
			const items = [buildMatchdaySummary(1)];
			return { serverTime: now(), items, nextCursor: undefined } as TournamentMatchdayPage;
		},
		async getTournamentMatchday(params: Parameters<RankupApiClient['getTournamentMatchday']>[0]) {
			return buildMatchday(params.tournamentId, params.matchday);
		},
		async getTournamentMatchdayAvailability(params: Parameters<RankupApiClient['getTournamentMatchdayAvailability']>[0]) {
			return buildMatchdayAvailability(params.tournamentId, params.matchday);
		},
		async getMatchdayMatches(
			params: Parameters<RankupApiClient['getMatchdayMatches']>[0],
			query: Parameters<RankupApiClient['getMatchdayMatches']>[1],
		) {
			return (await executeMockHandler(registry, 'listTournamentMatchdayMatches', { params, query })).response;
		},
		async listMatchdaySubmissions(
			params: Parameters<RankupApiClient['listMatchdaySubmissions']>[0],
			_query: Parameters<RankupApiClient['listMatchdaySubmissions']>[1],
		) {
			return buildMatchdaySubmissionSummaryPage(params.matchday);
		},
		async getMyMatchdaySubmission(params: Parameters<RankupApiClient['getMyMatchdaySubmission']>[0]) {
			const user = toMeSummary(resolveUser(registry.db));
			return buildScorePredictionSubmission(params.tournamentId, params.matchday, user, 'me', 'visible');
		},
		async upsertMyMatchdaySubmission(
			params: Parameters<RankupApiClient['upsertMyMatchdaySubmission']>[0],
			body: Parameters<RankupApiClient['upsertMyMatchdaySubmission']>[1],
		) {
			if (body.gameModeId === 'scorePrediction') {
				const scorePredictionBody = body as UpsertScorePredictionMatchdaySubmissionRequest;
				const user = toMeSummary(resolveUser(registry.db));
				const submission = buildScorePredictionSubmissionFromUpsert(
					params.tournamentId,
					params.matchday,
					user,
					scorePredictionBody.upserts,
					scorePredictionBody.removes,
				);
				const applied = [
					...(scorePredictionBody.upserts ?? []).map(item => item.matchId),
					...(scorePredictionBody.removes ?? []),
				];
				const result: UpsertMatchdaySubmissionResult = { submission, applied, rejected: [] };
				return result;
			}
			const user = toMeSummary(resolveUser(registry.db));
			const submission: MatchdaySubmission = {
				submissionId: `subm_${params.tournamentId}_${params.matchday}_${user.userId}`,
				tournamentId: params.tournamentId,
				matchday: params.matchday,
				userId: user.userId,
				gameModeId: body.gameModeId,
				serverTime: now(),
				scope: 'me',
				visibility: 'visible',
				completion: buildSubmissionCompletion(0, 0),
				createdAt: now(),
				updatedAt: now(),
				items: [],
			};
			const result: UpsertMatchdaySubmissionResult = { submission, applied: [], rejected: [] };
			return result;
		},
		async clearMyMatchdaySubmission(_params: Parameters<RankupApiClient['clearMyMatchdaySubmission']>[0]) {
			return undefined;
		},
		async getUserMatchdaySubmission(params: Parameters<RankupApiClient['getUserMatchdaySubmission']>[0]) {
			const user = toMeSummary(registry.db.users.get(params.userId) ?? resolveUser(registry.db));
			return buildScorePredictionSubmission(params.tournamentId, params.matchday, user, 'other', 'redacted');
		},
		async listTournamentMembers(params: Parameters<RankupApiClient['listTournamentMembers']>[0]) {
			const member: TournamentMember = {
				user: toMeSummary(resolveUser(registry.db)),
				role: 'player',
				status: 'active',
				joinedAt: now(),
			};
			return { items: [member], nextCursor: undefined } as TournamentMemberPage;
		},
		async joinTournament(params: Parameters<RankupApiClient['joinTournament']>[0]) {
			const summary = pickTournamentSummary(params.tournamentId);
			const result: JoinByInvitationCodeResult = {
				tournamentId: summary.tournamentId,
				joined: true,
				membership: pickMembership(),
				tournament: summary,
			};
			return result;
		},
		async leaveTournament(_params: Parameters<RankupApiClient['leaveTournament']>[0]) {
			return undefined;
		},
		async updateTournamentMember(
			params: Parameters<RankupApiClient['updateTournamentMember']>[0],
			body: Parameters<RankupApiClient['updateTournamentMember']>[1],
		) {
			return {
				user: toMeSummary(resolveUser(registry.db, params.userId)),
				role: body.role ?? 'player',
				status: 'active',
				joinedAt: now(),
			} as TournamentMember;
		},
		async removeTournamentMember(_params: Parameters<RankupApiClient['removeTournamentMember']>[0]) {
			return undefined;
		},
		async listTournamentInvitationCodes(params: Parameters<RankupApiClient['listTournamentInvitationCodes']>[0]) {
			const code = buildInvitationCode(params.tournamentId);
			return { items: [code], nextCursor: undefined } as InvitationCodePage;
		},
		async createTournamentInvitationCode(params: Parameters<RankupApiClient['createTournamentInvitationCode']>[0]) {
			return buildInvitationCode(params.tournamentId);
		},
		async resolveInvitationCode(params: Parameters<RankupApiClient['resolveInvitationCode']>[0]) {
			const summary = pickTournamentSummary();
			const preview = toTournamentPreview(summary);
			const resolution: InvitationCodeResolution = {
				code: params.code,
				codeStatus: 'active',
				joinable: true,
				tournament: preview,
			};
			return resolution;
		},
		async joinTournamentByInvitationCode(_params: Parameters<RankupApiClient['joinTournamentByInvitationCode']>[0]) {
			const summary = pickTournamentSummary();
			const result: JoinByInvitationCodeResult = {
				tournamentId: summary.tournamentId,
				joined: true,
				membership: pickMembership(),
				tournament: summary,
			};
			return result;
		},
		async listTournamentInvites(params: Parameters<RankupApiClient['listTournamentInvites']>[0]) {
			const invite = buildTournamentInvite(params.tournamentId);
			return { items: [invite], nextCursor: undefined } as TournamentInvitePage;
		},
		async createTournamentInvites(params: Parameters<RankupApiClient['createTournamentInvites']>[0]) {
			const invite = buildTournamentInvite(params.tournamentId);
			return { created: [invite], failures: [] };
		},
		async cancelTournamentInvite(_params: Parameters<RankupApiClient['cancelTournamentInvite']>[0]) {
			return undefined;
		},
		async listMyTournamentInvites() {
			const summary = pickTournamentSummary();
			const preview = toTournamentPreview(summary);
			const invite = buildTournamentInvite(summary.tournamentId);
			const myInvite = buildMyTournamentInvite(invite, preview);
			return { items: [myInvite], nextCursor: undefined } as MyTournamentInvitePage;
		},
		async getMyTournamentInvite(params: Parameters<RankupApiClient['getMyTournamentInvite']>[0]) {
			const summary = pickTournamentSummary();
			const preview = toTournamentPreview(summary);
			const invite = buildTournamentInvite(summary.tournamentId);
			return buildMyTournamentInvite({ ...invite, inviteId: params.inviteId }, preview);
		},
		async getMyTournamentInviteUnreadCount() {
			return { count: 0 };
		},
		async hideMyTournamentInvite(_params: Parameters<RankupApiClient['hideMyTournamentInvite']>[0]) {
			return undefined;
		},
		async markMyTournamentInviteSeen(_params: Parameters<RankupApiClient['markMyTournamentInviteSeen']>[0]) {
			return undefined;
		},
		async acceptMyTournamentInvite(params: Parameters<RankupApiClient['acceptMyTournamentInvite']>[0]) {
			const summary = pickTournamentSummary();
			const preview = toTournamentPreview(summary);
			const invite = buildTournamentInvite(summary.tournamentId);
			const myInvite = buildMyTournamentInvite({ ...invite, inviteId: params.inviteId, status: 'accepted' }, preview);
			return {
				invite: myInvite,
				join: {
					tournamentId: summary.tournamentId,
					joined: true,
					membership: pickMembership(),
					tournament: summary,
				},
			};
		},
		async declineMyTournamentInvite(params: Parameters<RankupApiClient['declineMyTournamentInvite']>[0]) {
			const summary = pickTournamentSummary();
			const preview = toTournamentPreview(summary);
			const invite = buildTournamentInvite(summary.tournamentId);
			return buildMyTournamentInvite({ ...invite, inviteId: params.inviteId, status: 'declined' }, preview);
		},
		async listMyNotifications(query: Parameters<RankupApiClient['listMyNotifications']>[0]) {
			let items = notificationPage.items;
			if (query?.topics?.length) {
				items = items.filter(item => query.topics?.includes(item.topic));
			}
			if (query?.status === 'read') {
				items = items.filter(item => item.readAt);
			}
			if (query?.status === 'unread') {
				items = items.filter(item => !item.readAt && !item.dismissedAt);
			}
			if (query?.status === 'dismissed') {
				items = items.filter(item => item.dismissedAt);
			}
			return { ...notificationPage, items };
		},
		async getMyNotification(
			params: Parameters<RankupApiClient['getMyNotification']>[0],
			_query: Parameters<RankupApiClient['getMyNotification']>[1],
		) {
			return { ...notification, notificationId: params.notificationId };
		},
		async getMyNotificationUnreadCount(query: Parameters<RankupApiClient['getMyNotificationUnreadCount']>[0]) {
			const items = query?.topics?.length
				? notificationPage.items.filter(item => query.topics?.includes(item.topic))
				: notificationPage.items;
			return {
				total: items.length,
				byTopic: query?.topics?.length ? { [query.topics[0]]: items.length } : notificationUnreadCounts.byTopic,
			};
		},
		async markMyNotificationSeen(_params: Parameters<RankupApiClient['markMyNotificationSeen']>[0]) {
			return;
		},
		async markMyNotificationRead(_params: Parameters<RankupApiClient['markMyNotificationRead']>[0]) {
			return;
		},
		async dismissMyNotification(_params: Parameters<RankupApiClient['dismissMyNotification']>[0]) {
			return;
		},
		async batchUpdateMyNotifications(body: Parameters<RankupApiClient['batchUpdateMyNotifications']>[0]) {
			const appliedIds = body.notificationIds?.length ? body.notificationIds : notificationBatchResult.appliedIds;
			return { ...notificationBatchResult, appliedIds };
		},
		async listMyFeed(query: Parameters<RankupApiClient['listMyFeed']>[0]) {
			let items = feedPage.items;
			if (query?.topics?.length) {
				items = items.filter(item => query.topics?.includes(item.topic));
			}
			return { ...feedPage, items };
		},
		async getMyFeedItem(params: Parameters<RankupApiClient['getMyFeedItem']>[0]) {
			return { ...feedItem, feedItemId: params.feedItemId };
		},
		async getMyFeedReadCursor() {
			return feedReadCursor;
		},
		async updateMyFeedReadCursor(body: Parameters<RankupApiClient['updateMyFeedReadCursor']>[0]) {
			return {
				...feedReadCursor,
				lastSeenAt: body.lastSeenAt,
				lastSeenFeedItemId: body.lastSeenFeedItemId ?? feedReadCursor.lastSeenFeedItemId,
			};
		},
		async listMyUpdates(_query: Parameters<RankupApiClient['listMyUpdates']>[0]) {
			return meUpdatePage;
		},
		async streamMyLiveUpdates(_query: Parameters<RankupApiClient['streamMyLiveUpdates']>[0]) {
			return `event: ping\ndata: {"ts":"${mockTime}"}\n\n`;
		},
		async getTournamentChat(params: Parameters<RankupApiClient['getTournamentChat']>[0]) {
			return { ...tournamentChat, tournamentId: params.tournamentId };
		},
		async updateTournamentChatSettings(
			params: Parameters<RankupApiClient['updateTournamentChatSettings']>[0],
			body: Parameters<RankupApiClient['updateTournamentChatSettings']>[1],
		) {
			const { reason: _reason, ...settingsPatch } = body;
			return {
				...tournamentChat,
				tournamentId: params.tournamentId,
				settings: {
					...chatSettings,
					...settingsPatch,
				},
			};
		},
		async listTournamentChatMessages(
			params: Parameters<RankupApiClient['listTournamentChatMessages']>[0],
			_query: Parameters<RankupApiClient['listTournamentChatMessages']>[1],
		) {
			return {
				...chatMessagePage,
				items: [buildChatMessage({ tournamentId: params.tournamentId })],
			};
		},
		async sendTournamentChatMessage(
			params: Parameters<RankupApiClient['sendTournamentChatMessage']>[0],
			body: Parameters<RankupApiClient['sendTournamentChatMessage']>[1],
		) {
			return buildChatMessage({
				tournamentId: params.tournamentId,
				text: body.text ?? chatMessageBase.text,
				clientMessageId: body.clientMessageId,
			});
		},
		async getTournamentChatMessage(params: Parameters<RankupApiClient['getTournamentChatMessage']>[0]) {
			return buildChatMessage({ tournamentId: params.tournamentId, messageId: params.messageId });
		},
		async editTournamentChatMessage(
			params: Parameters<RankupApiClient['editTournamentChatMessage']>[0],
			body: Parameters<RankupApiClient['editTournamentChatMessage']>[1],
		) {
			return buildChatMessage({
				tournamentId: params.tournamentId,
				messageId: params.messageId,
				text: body.text,
				editedAt: mockTime,
			});
		},
		async deleteTournamentChatMessage(
			_params: Parameters<RankupApiClient['deleteTournamentChatMessage']>[0],
			_body?: Parameters<RankupApiClient['deleteTournamentChatMessage']>[1],
		) {
			return;
		},
		async getTournamentChatUnreadCount(_params: Parameters<RankupApiClient['getTournamentChatUnreadCount']>[0]) {
			return { count: 0 };
		},
		async getTournamentChatReadCursor(params: Parameters<RankupApiClient['getTournamentChatReadCursor']>[0]) {
			return { ...chatReadCursor, tournamentId: params.tournamentId };
		},
		async updateTournamentChatReadCursor(
			params: Parameters<RankupApiClient['updateTournamentChatReadCursor']>[0],
			body: Parameters<RankupApiClient['updateTournamentChatReadCursor']>[1],
		) {
			return {
				...chatReadCursor,
				tournamentId: params.tournamentId,
				lastReadMessageId: body.lastReadMessageId,
				lastReadAt: body.readAt ?? chatReadCursor.lastReadAt,
			};
		},
		async listTournamentChatPins(params: Parameters<RankupApiClient['listTournamentChatPins']>[0]) {
			return { ...chatPinnedMessages, items: [] };
		},
		async pinTournamentChatMessage(
			params: Parameters<RankupApiClient['pinTournamentChatMessage']>[0],
			_body?: Parameters<RankupApiClient['pinTournamentChatMessage']>[1],
		) {
			return buildChatMessage({
				tournamentId: params.tournamentId,
				messageId: params.messageId,
				pinnedAt: mockTime,
				pinnedBy: baseUserSummary,
			});
		},
		async unpinTournamentChatMessage(_params: Parameters<RankupApiClient['unpinTournamentChatMessage']>[0]) {
			return;
		},
		async listTournamentChatMutes(
			_params: Parameters<RankupApiClient['listTournamentChatMutes']>[0],
			query: Parameters<RankupApiClient['listTournamentChatMutes']>[1],
		) {
			let items = chatMutePage.items;
			if (query?.status) {
				items = items.filter(item => item.status === query.status);
			}
			return { ...chatMutePage, items };
		},
		async muteTournamentChatUser(
			params: Parameters<RankupApiClient['muteTournamentChatUser']>[0],
			body: Parameters<RankupApiClient['muteTournamentChatUser']>[1],
		) {
			const user = toMeSummary(resolveUser(registry.db, params.userId));
			return {
				...chatMuteEntry,
				tournamentId: params.tournamentId,
				user,
				mutedUntil: body.mutedUntil,
				reason: body.reason,
			};
		},
		async unmuteTournamentChatUser(_params: Parameters<RankupApiClient['unmuteTournamentChatUser']>[0]) {
			return;
		},
		async reportTournamentChatContent(
			params: Parameters<RankupApiClient['reportTournamentChatContent']>[0],
			body: Parameters<RankupApiClient['reportTournamentChatContent']>[1],
		) {
			return {
				...chatReport,
				tournamentId: params.tournamentId,
				messageId: body.messageId,
				reportedUserId: body.reportedUserId,
				reason: body.reason,
				comment: body.comment,
			};
		},
		async listTournamentChatUpdates(
			params: Parameters<RankupApiClient['listTournamentChatUpdates']>[0],
			_query: Parameters<RankupApiClient['listTournamentChatUpdates']>[1],
		) {
			return {
				...chatUpdatePage,
				events: [
					{
						...chatUpdatePage.events[0],
						message: buildChatMessage({ tournamentId: params.tournamentId }),
					},
				],
			};
		},
		async streamTournamentChatLive(_params: Parameters<RankupApiClient['streamTournamentChatLive']>[0]) {
			return `event: ping\ndata: {"ts":"${mockTime}"}\n\n`;
		},
		async getMyStats(_query: Parameters<RankupApiClient['getMyStats']>[0]) {
			return myStatsSnapshot;
		},
		async getUserStats(params: Parameters<RankupApiClient['getUserStats']>[0]) {
			const user = toMeSummary(resolveUser(registry.db, params.userId));
			return { ...publicUserStatsSnapshot, user };
		},
		async listMyRecaps(_query: Parameters<RankupApiClient['listMyRecaps']>[0]) {
			return recapSummaryPage;
		},
		async requestMyRecap(body: Parameters<RankupApiClient['requestMyRecap']>[0]) {
			return {
				...recapSummary,
				type: body.type,
				scope: body.context?.tournamentId ? 'tournament' : 'me',
				context: {
					...recapSummary.context,
					...body.context,
				},
			};
		},
		async getMyRecap(params: Parameters<RankupApiClient['getMyRecap']>[0]) {
			return { ...recap, recapId: params.recapId };
		},
		async hideMyRecap(_params: Parameters<RankupApiClient['hideMyRecap']>[0]) {
			return;
		},
		async listTournamentRecaps(params: Parameters<RankupApiClient['listTournamentRecaps']>[0]) {
			return {
				...recapSummaryPage,
				items: recapSummaryPage.items.map(item => ({
					...item,
					context: {
						...item.context,
						tournamentId: params.tournamentId,
						tournamentName: pickTournamentSummary(params.tournamentId).name,
					},
				})),
			};
		},
		async getTournamentRecap(params: Parameters<RankupApiClient['getTournamentRecap']>[0]) {
			return {
				...recap,
				recapId: params.recapId,
				context: {
					...recap.context,
					tournamentId: params.tournamentId,
					tournamentName: pickTournamentSummary(params.tournamentId).name,
				},
			};
		},
		async getTournamentStats(params: Parameters<RankupApiClient['getTournamentStats']>[0]) {
			return { ...tournamentStatsSnapshot, tournamentId: params.tournamentId };
		},
		async getMyTournamentStats(params: Parameters<RankupApiClient['getMyTournamentStats']>[0]) {
			return { ...userTournamentStatsSnapshot, tournamentId: params.tournamentId };
		},
		async getTournamentMatchdayStats(params: Parameters<RankupApiClient['getTournamentMatchdayStats']>[0]) {
			return { ...matchdayStatsSnapshot, tournamentId: params.tournamentId, matchday: params.matchday };
		},
		async getMyTournamentMatchdayStats(params: Parameters<RankupApiClient['getMyTournamentMatchdayStats']>[0]) {
			return { ...userMatchdayStatsSnapshot, tournamentId: params.tournamentId, matchday: params.matchday };
		},
		async authorize(params: Parameters<RankupApiClient['authorize']>[0]) {
			return (await executeMockHandler(registry, 'oauthAuthorize', { params })).response;
		},
		async token(body: Parameters<RankupApiClient['token']>[0]) {
			return (await executeMockHandler(registry, 'oauthTokenExchange', { body })).response;
		},
	};
}

export type { MockDb } from './mock-db.js';
export type { MockApiServer, MockApiServerOptions } from './create-server.js';

export async function createMockApiServer(options: MockApiServerOptions = {}): Promise<MockApiServer> {
	const serverModulePath = './create-server.js';
	const serverModule = (await import(serverModulePath)) as typeof import('./create-server.js');
	return serverModule.createMockApiServer(options);
}
