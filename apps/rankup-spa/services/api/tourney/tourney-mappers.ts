import { defineSharedKeys, mapOptional, pickFields } from '../gateway-mapping.js';
import type * as Api from '@rankup/api';
import type * as Ranking from '@rankup/rankup/domains/scoring/ranking/contracts/types.js';
import type * as Codes from '@rankup/rankup/domains/tournaments/codes/contracts/types.js';
import type * as Core from '@rankup/rankup/domains/tournaments/core/contracts/types.js';
import type * as Invites from '@rankup/rankup/domains/tournaments/invites/contracts/types.js';
import type * as Matchdays from '@rankup/rankup/domains/tournaments/matchdays/contracts/types.js';
import type * as Members from '@rankup/rankup/domains/tournaments/members/contracts/types.js';
import type * as Shared from '@rankup/rankup/domains/tournaments/shared/index.js';

const userSummaryKeys = defineSharedKeys<Shared.UserSummary, Api.MeSummary>()(['userId', 'username', 'pictureUrl']);
const myMembershipSummaryKeys = defineSharedKeys<Core.MyMembershipSummary, Api.MyMembershipSummary>()(['role', 'joinedAt', 'archivedAt']);
const matchEventCountersKeys = defineSharedKeys<Matchdays.MatchEventCounters, NonNullable<Api.Match['eventCounters']>>()([
	'goals',
	'redCards',
	'yellowCards',
	'lastEventAt',
]);
const matchScoreKeys = defineSharedKeys<Matchdays.MatchScore, NonNullable<Api.Match['score']>>()(['home', 'away', 'isFinal']);
const penaltyShootoutKeys = defineSharedKeys<Matchdays.PenaltyShootout, NonNullable<Api.Match['penaltyShootout']>>()([
	'home',
	'away',
	'winner',
]);
const matchdayAvailabilityKeys = defineSharedKeys<Matchdays.MatchdayAvailability, Api.MatchdayAvailability>()([
	'tournamentId',
	'matchday',
	'serverTime',
	'state',
	'canSubmit',
	'reason',
	'opensAt',
	'locksAt',
	'closesAt',
	'message',
]);
const matchdaySummaryKeys = defineSharedKeys<Matchdays.TournamentMatchdaySummary, Api.TournamentMatchdaySummary>()([
	'matchday',
	'label',
	'status',
	'startsAt',
	'endsAt',
	'matchCount',
	'isCurrent',
	'availabilitySummary',
]);
const matchdayKeys = defineSharedKeys<Matchdays.TournamentMatchday, Api.TournamentMatchday>()([
	'matchday',
	'label',
	'status',
	'startsAt',
	'endsAt',
	'matchCount',
	'isCurrent',
	'availabilitySummary',
	'tournamentId',
	'serverTime',
	'previousMatchday',
	'nextMatchday',
]);
const invitationCodeKeys = defineSharedKeys<Codes.InvitationCode, Api.InvitationCode>()([
	'code',
	'tournamentId',
	'status',
	'createdAt',
	'createdByUserId',
	'label',
	'expiresAt',
	'revokedAt',
	'maxUses',
	'useCount',
]);
const unreadCountKeys = defineSharedKeys<Invites.UnreadCount, Api.UnreadCount>()(['count']);

export const mapUserSummary = (user: Api.MeSummary): Shared.UserSummary => pickFields(user, userSummaryKeys);

export const mapPublicUserSummary = (user: Api.PublicUserProfile): Shared.UserSummary => ({
	userId: user.userId,
	username: user.username,
	pictureUrl: user.pictureUrl,
});

export const mapMyMembershipSummary = (summary: Api.MyMembershipSummary): Core.MyMembershipSummary =>
	pickFields(summary, myMembershipSummaryKeys);

export const mapTournamentJoinPolicy = (policy: Api.TournamentSummary['joinPolicy']): Core.TournamentJoinPolicy => ({
	joinMode: policy.joinMode,
	joinMidSeasonAllowed: policy.joinMidSeasonAllowed,
	maxPlayers: policy.maxPlayers,
	locked: policy.locked,
	joinClosesAt: policy.joinClosesAt,
});

export const mapTournamentTiming = (timing: NonNullable<Api.TournamentSummary['timing']>): Core.TournamentTiming => ({
	competitionId: timing.competitionId,
	seasonId: timing.seasonId,
	startMatchday: timing.startMatchday,
	endMatchday: timing.endMatchday,
	startsAt: timing.startsAt,
	endsAt: timing.endsAt,
});

export const mapTournamentOrganizer = (organizer?: Api.TournamentSummary['organizer']): Core.TournamentOrganizer | undefined => {
	if (!organizer) {
		return undefined;
	}
	if (organizer.type === 'rankup') {
		return {
			type: 'rankup',
			displayName: organizer.displayName,
		};
	}
	if (organizer.type === 'user') {
		return {
			type: 'user',
			userId: organizer.userId,
			displayName: organizer.displayName,
			pictureUrl: organizer.pictureUrl,
		};
	}
	return {
		type: 'creator',
		creatorId: organizer.creatorId,
		displayName: organizer.displayName,
		logoUrl: organizer.logoUrl,
	};
};

export const mapHeadsUpTieBreakerRule = (rule: Api.HeadsUpTieBreakerRule): Core.HeadsUpTieBreakerRule => ({
	kind: rule.kind,
	metricId: rule.metricId,
	order: rule.order,
});

export const mapHeadsUpDuration = (duration: Api.HeadsUpDuration): Core.HeadsUpDuration => ({
	type: duration.type,
	roundCount: duration.roundCount,
	startMatchday: duration.startMatchday,
	endMatchday: duration.endMatchday,
});

export const mapHeadsUpFormatConfig = (config: Api.HeadsUpFormatConfig): Core.HeadsUpFormatConfig => ({
	roundUnit: config.roundUnit,
	duration: mapHeadsUpDuration(config.duration),
	victoryCondition: config.victoryCondition,
	tieBreakers: config.tieBreakers ? config.tieBreakers.map(mapHeadsUpTieBreakerRule) : undefined,
	requiresDirectInvite: config.requiresDirectInvite,
	onPlayerLeave: config.onPlayerLeave,
});

const isHeadsUpFormatConfig = (config: Api.TournamentFormatConfig): config is Api.HeadsUpFormatConfig =>
	'roundUnit' in config && 'duration' in config;

export const mapTournamentFormatConfig = (
	config?: Api.TournamentFormatConfig,
): Core.TournamentFormatConfig | undefined => {
	if (!config) {
		return undefined;
	}
	if (isHeadsUpFormatConfig(config)) {
		return mapHeadsUpFormatConfig(config);
	}
	return {};
};

export const mapHeadsUpAcceptance = (acceptance: Api.HeadsUpAcceptance): Core.HeadsUpAcceptance => ({
	status: acceptance.status,
	challengerUserId: acceptance.challengerUserId,
	opponentUserId: acceptance.opponentUserId,
	expiresAt: acceptance.expiresAt,
	respondedAt: acceptance.respondedAt,
});

export const mapTournamentSummary = (summary: Api.TournamentSummary): Core.TournamentSummary => ({
	tournamentId: summary.tournamentId,
	name: summary.name,
	visibility: summary.visibility,
	discoverability: summary.discoverability,
	verificationStatus: summary.verificationStatus,
	sportId: summary.sportId,
	gameModeId: summary.gameModeId,
	formatId: summary.formatId,
	modality: summary.modality,
	status: summary.status,
	joinPolicy: mapTournamentJoinPolicy(summary.joinPolicy),
	memberCount: summary.memberCount,
	description: summary.description,
	heroImageUrl: summary.heroImageUrl,
	organizer: mapTournamentOrganizer(summary.organizer),
	isRankedEligible: summary.isRankedEligible,
	timing: mapOptional(summary.timing, mapTournamentTiming),
	eventId: summary.eventId,
	rewardSummary: summary.rewardSummary,
	createdAt: summary.createdAt,
	updatedAt: summary.updatedAt,
});

export const mapTournamentPreview = (preview: Api.TournamentPreview): Core.TournamentPreview => ({
	tournamentId: preview.tournamentId,
	name: preview.name,
	description: preview.description,
	heroImageUrl: preview.heroImageUrl,
	organizer: mapTournamentOrganizer(preview.organizer),
	visibility: preview.visibility,
	verificationStatus: preview.verificationStatus,
	isRankedEligible: preview.isRankedEligible,
	sportId: preview.sportId,
	gameModeId: preview.gameModeId,
	formatId: preview.formatId,
	modality: preview.modality,
	status: preview.status,
	timing: mapOptional(preview.timing, mapTournamentTiming),
	joinPolicy: mapTournamentJoinPolicy(preview.joinPolicy),
	memberCount: preview.memberCount,
	rewardSummary: preview.rewardSummary,
});

export const mapTournament = (tournament: Api.Tournament): Core.Tournament => ({
	tournamentId: tournament.tournamentId,
	name: tournament.name,
	visibility: tournament.visibility,
	discoverability: tournament.discoverability,
	verificationStatus: tournament.verificationStatus,
	sportId: tournament.sportId,
	gameModeId: tournament.gameModeId,
	formatId: tournament.formatId,
	modality: tournament.modality,
	status: tournament.status,
	joinPolicy: mapTournamentJoinPolicy(tournament.joinPolicy),
	memberCount: tournament.memberCount,
	description: tournament.description,
	heroImageUrl: tournament.heroImageUrl,
	organizer: mapTournamentOrganizer(tournament.organizer),
	isRankedEligible: tournament.isRankedEligible,
	timing: mapOptional(tournament.timing, mapTournamentTiming),
	eventId: tournament.eventId,
	rewardSummary: tournament.rewardSummary,
	createdAt: tournament.createdAt,
	updatedAt: tournament.updatedAt,
	rulesetId: tournament.rulesetId,
	formatConfig: mapTournamentFormatConfig(tournament.formatConfig),
	headsUpAcceptance: mapOptional(tournament.headsUpAcceptance, mapHeadsUpAcceptance),
	myMembership: mapOptional(tournament.myMembership, mapMyMembershipSummary),
});

export const mapMyTournamentItem = (item: Api.MyTournamentItem): Core.MyTournamentItem => ({
	tournament: mapTournamentSummary(item.tournament),
	membership: mapMyMembershipSummary(item.membership),
	lastActivityAt: item.lastActivityAt,
});

export const mapMyTournamentPage = (page: Api.ListMyTournamentsResponse): Core.MyTournamentPage => ({
	items: page.items.map(mapMyTournamentItem),
	nextCursor: page.nextCursor,
});

export const mapDuelListItem = (item: Api.DuelListItem): Core.DuelListItem => ({
	tournament: mapTournamentSummary(item.tournament),
	opponentUserId: item.opponentUserId,
	opponent: item.opponent ? mapPublicUserSummary(item.opponent) : undefined,
	currentRound: item.currentRound
		? {
			matchday: item.currentRound.matchday,
			status: item.currentRound.status,
			locked: item.currentRound.locked,
		}
		: undefined,
});

export const mapDuelPage = (page: Api.DuelPage): Core.DuelPage => ({
	items: page.items.map(mapDuelListItem),
	nextCursor: page.nextCursor,
});

export const mapMatchEventCounters = (counters: NonNullable<Api.Match['eventCounters']>): Matchdays.MatchEventCounters =>
	pickFields(counters, matchEventCountersKeys);

export const mapTeamRef = (team?: Api.Match['homeTeam']): Matchdays.TeamRef | undefined => {
	if (!team) {
		return undefined;
	}
	return {
		teamId: team.teamId,
		name: team.name,
		shortName: team.shortName,
		crestUrl: team.crestUrl,
	};
};

export const mapMatchScore = (score?: Api.Match['score']): Matchdays.MatchScore | undefined =>
	mapOptional(score, value => pickFields(value, matchScoreKeys));

export const mapPenaltyShootout = (shootout?: Api.Match['penaltyShootout']): Matchdays.PenaltyShootout | undefined =>
	mapOptional(shootout, value => pickFields(value, penaltyShootoutKeys));

export const mapTournamentMatch = (match: Api.TournamentMatch): Matchdays.TournamentMatch => ({
	matchId: match.matchId,
	sportId: match.sportId,
	competitionId: match.competitionId,
	seasonId: match.seasonId,
	matchday: match.matchday,
	status: match.status,
	scheduledAt: match.scheduledAt,
	startedAt: match.startedAt,
	endedAt: match.endedAt,
	homeTeam: mapTeamRef(match.homeTeam),
	awayTeam: mapTeamRef(match.awayTeam),
	score: mapMatchScore(match.score),
	finalOutcomeType: match.finalOutcomeType,
	penaltyShootout: mapPenaltyShootout(match.penaltyShootout),
	isDerby: match.isDerby,
	weather: match.weather,
	odds: match.odds,
	eventCounters: mapOptional(match.eventCounters, mapMatchEventCounters),
	lastUpdatedAt: match.lastUpdatedAt,
	lockState: match.lockState,
	lockAt: match.lockAt,
	lockReason: match.lockReason,
});

export const mapTournamentMatchPage = (page: Api.GetMatchdayMatchesResponse): Matchdays.TournamentMatchPage => ({
	serverTime: page.serverTime,
	items: page.items.map(mapTournamentMatch),
	nextCursor: page.nextCursor,
});

export const mapRankingMetrics = (metrics?: Record<string, number>): Record<string, number> | undefined => {
	if (!metrics) {
		return undefined;
	}
	return Object.fromEntries(Object.entries(metrics).map(([key, value]) => [key, value]));
};

export const mapRankingEntry = (entry: Api.RankingEntry): Ranking.RankingEntry => ({
	position: entry.position,
	user: mapUserSummary(entry.user),
	points: entry.points,
	pointsState: entry.pointsState,
	metrics: mapRankingMetrics(entry.metrics),
	lastUpdatedAt: entry.lastUpdatedAt,
});

export const mapHeadsUpScoreboardEntry = (entry: Api.HeadsUpScoreboardEntry): Ranking.HeadsUpScoreboardEntry => ({
	position: entry.position,
	user: mapUserSummary(entry.user),
	points: entry.points,
	pointsState: entry.pointsState,
	metrics: mapRankingMetrics(entry.metrics),
	lastUpdatedAt: entry.lastUpdatedAt,
});

export const mapHeadsUpRoundSummary = (round: Api.HeadsUpRoundSummary): Ranking.HeadsUpRoundSummary => ({
	matchday: round.matchday,
	state: round.state,
	pointsA: round.pointsA,
	pointsB: round.pointsB,
	winnerUserId: round.winnerUserId,
});

export const mapHeadsUpOverallSummary = (overall: Api.HeadsUpOverallSummary): Ranking.HeadsUpOverallSummary => ({
	winnerUserId: overall.winnerUserId,
	roundWinsA: overall.roundWinsA,
	roundWinsB: overall.roundWinsB,
	totalPointsA: overall.totalPointsA,
	totalPointsB: overall.totalPointsB,
	outcome: overall.outcome,
});

export const mapHeadsUpScoreboard = (scoreboard: Api.HeadsUpScoreboard): Ranking.HeadsUpScoreboard => ({
	players: scoreboard.players.map(mapHeadsUpScoreboardEntry),
	rounds: scoreboard.rounds ? scoreboard.rounds.map(mapHeadsUpRoundSummary) : undefined,
	overall: mapOptional(scoreboard.overall, mapHeadsUpOverallSummary),
});

export const mapRankingMeta = (meta: Api.TournamentRankingPage['meta']): Ranking.TournamentRankingMeta => ({
	tournamentId: meta.tournamentId,
	scope: meta.scope,
	state: meta.state,
	serverTime: meta.serverTime,
	computedAt: meta.computedAt,
	totalPlayers: meta.totalPlayers,
	matchday: meta.matchday,
	rulesetId: meta.rulesetId,
	tieBreakers: meta.tieBreakers ? meta.tieBreakers.slice() : undefined,
});

export const mapRankingPage = (page: Api.TournamentRankingPage): Ranking.TournamentRankingPage => ({
	meta: mapRankingMeta(page.meta),
	items: page.items.map(mapRankingEntry),
	headsup: mapOptional(page.headsup, mapHeadsUpScoreboard),
	myEntry: page.myEntry ? mapRankingEntry(page.myEntry) : undefined,
	nextCursor: page.nextCursor,
});

export const mapRankingWindow = (window: Api.TournamentRankingWindow): Ranking.TournamentRankingWindow => ({
	meta: mapRankingMeta(window.meta),
	headsup: mapOptional(window.headsup, mapHeadsUpScoreboard),
	center: mapRankingEntry(window.center),
	items: window.items.map(mapRankingEntry),
});

export const mapMatchdayAvailability = (availability: Api.MatchdayAvailability): Matchdays.MatchdayAvailability =>
	pickFields(availability, matchdayAvailabilityKeys);

export const mapTournamentMatchdaySummary = (summary: Api.TournamentMatchdaySummary): Matchdays.TournamentMatchdaySummary => ({
	...pickFields(summary, matchdaySummaryKeys),
	availabilitySummary: mapOptional(summary.availabilitySummary, mapMatchdayAvailability),
});

export const mapTournamentMatchday = (matchday: Api.TournamentMatchday): Matchdays.TournamentMatchday => ({
	...pickFields(matchday, matchdayKeys),
	availabilitySummary: mapOptional(matchday.availabilitySummary, mapMatchdayAvailability),
});

export const mapTournamentMatchdayPage = (page: Api.TournamentMatchdayPage): Matchdays.TournamentMatchdayPage => ({
	serverTime: page.serverTime,
	items: page.items.map(mapTournamentMatchdaySummary),
	nextCursor: page.nextCursor,
});

export const mapTournamentMember = (member: Api.TournamentMember): Members.TournamentMember => ({
	user: mapUserSummary(member.user),
	role: member.role,
	status: member.status,
	joinedAt: member.joinedAt,
	leftAt: member.leftAt,
	removedAt: member.removedAt,
});

export const mapTournamentMemberPage = (page: Api.TournamentMemberPage): Members.TournamentMemberPage => ({
	items: page.items.map(mapTournamentMember),
	nextCursor: page.nextCursor,
});

export const mapInvitationCode = (code: Api.InvitationCode): Codes.InvitationCode => pickFields(code, invitationCodeKeys);

export const mapInvitationCodePage = (page: Api.InvitationCodePage): Codes.InvitationCodePage => ({
	items: page.items.map(mapInvitationCode),
	nextCursor: page.nextCursor,
});

export const mapInvitationCodeResolution = (resolution: Api.InvitationCodeResolution): Codes.InvitationCodeResolution => ({
	code: resolution.code,
	codeStatus: resolution.codeStatus,
	joinable: resolution.joinable,
	joinNotAllowedReason: resolution.joinNotAllowedReason,
	alreadyMember: resolution.alreadyMember,
	tournament: mapTournamentPreview(resolution.tournament),
});

export const mapJoinByInvitationCodeResult = (result: Api.JoinByInvitationCodeResult): Codes.JoinByInvitationCodeResult => ({
	tournamentId: result.tournamentId,
	joined: result.joined,
	membership: mapMyMembershipSummary(result.membership),
	tournament: mapTournamentSummary(result.tournament),
});

export const mapHeadsUpInvitePayload = (payload: Api.HeadsUpInvitePayload): Invites.HeadsUpInvitePayload => ({
	challengerUserId: payload.challengerUserId,
	opponentUserId: payload.opponentUserId,
	formatConfigSummary: mapOptional(payload.formatConfigSummary, mapHeadsUpFormatConfig),
});

export const mapTournamentInvite = (invite: Api.TournamentInvite): Invites.TournamentInvite => ({
	inviteId: invite.inviteId,
	tournamentId: invite.tournamentId,
	kind: invite.kind,
	status: invite.status,
	invitedUser: mapUserSummary(invite.invitedUser),
	invitedBy: mapUserSummary(invite.invitedBy),
	message: invite.message,
	headsUpPayload: mapOptional(invite.headsUpPayload, mapHeadsUpInvitePayload),
	createdAt: invite.createdAt,
	expiresAt: invite.expiresAt,
	respondedAt: invite.respondedAt,
});

export const mapTournamentInvitePage = (page: Api.TournamentInvitePage): Invites.TournamentInvitePage => ({
	items: page.items.map(mapTournamentInvite),
	nextCursor: page.nextCursor,
});

export const mapCreateTournamentInviteFailure = (
	failure: Api.CreateTournamentInviteFailure,
): Invites.CreateTournamentInviteFailure => ({
	recipientUserId: failure.recipientUserId,
	reason: failure.reason,
});

export const mapCreateTournamentInvitesResult = (result: Api.CreateTournamentInvitesResult): Invites.CreateTournamentInvitesResult => ({
	created: result.created.map(mapTournamentInvite),
	failures: result.failures.map(mapCreateTournamentInviteFailure),
});

export const mapMyTournamentInvite = (invite: Api.MyTournamentInvite): Invites.MyTournamentInvite => ({
	inviteId: invite.inviteId,
	tournamentId: invite.tournamentId,
	kind: invite.kind,
	status: invite.status,
	invitedUser: mapUserSummary(invite.invitedUser),
	invitedBy: mapUserSummary(invite.invitedBy),
	message: invite.message,
	headsUpPayload: mapOptional(invite.headsUpPayload, mapHeadsUpInvitePayload),
	createdAt: invite.createdAt,
	expiresAt: invite.expiresAt,
	respondedAt: invite.respondedAt,
	seenAt: invite.seenAt,
	hiddenAt: invite.hiddenAt,
	tournamentPreview: invite.tournamentPreview ? mapTournamentPreview(invite.tournamentPreview) : undefined,
});

export const mapMyTournamentInvitePage = (page: Api.MyTournamentInvitePage): Invites.MyTournamentInvitePage => ({
	items: page.items.map(mapMyTournamentInvite),
	nextCursor: page.nextCursor,
});

export const mapUnreadCount = (count: Api.UnreadCount): Invites.UnreadCount => pickFields(count, unreadCountKeys);
