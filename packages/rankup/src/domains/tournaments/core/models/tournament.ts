import type { DuelInclude, DuelStatusFilter, TournamentDiscoverability, TournamentFormatId, TournamentJoinMode, TournamentMemberRole, TournamentModality, TournamentStatus, TournamentVisibility, VerificationStatus } from '../../shared/models/enums.js';
import type { CompetitionId, GameModeId, RulesetId, SeasonId, SportId, TournamentId, UserId } from '../../shared/models/ids.js';
import type { UserSummary } from '../../shared/models/user.js';

export type TournamentTiming = {
	competitionId?: CompetitionId;
	seasonId: SeasonId;
	startMatchday?: number;
	endMatchday?: number;
	startsAt?: string;
	endsAt?: string;
};

export type TournamentJoinPolicy = {
	joinMode: TournamentJoinMode;
	joinMidSeasonAllowed: boolean;
	maxPlayers?: number;
	locked: boolean;
	joinClosesAt?: string;
};

export type LeagueFormatConfig = Record<string, never>;

export type HeadsUpRoundUnit = 'matchday' | 'event';

export type HeadsUpDurationType = 'singleRound' | 'fixedRounds' | 'untilSeasonEnd';

export type HeadsUpVictoryCondition = 'mostPointsTotal' | 'mostRoundWins';

export type HeadsUpTieBreakerRule = {
	kind: 'metric' | 'draw';
	metricId?: string;
	order?: 'desc' | 'asc';
};

export type HeadsUpOnPlayerLeave = 'endNoContest' | 'forfeit';

export type HeadsUpDuration = {
	type: HeadsUpDurationType;
	roundCount?: number;
	startMatchday?: number;
	endMatchday?: number;
};

export type HeadsUpFormatConfig = {
	roundUnit: HeadsUpRoundUnit;
	duration: HeadsUpDuration;
	victoryCondition?: HeadsUpVictoryCondition;
	tieBreakers?: HeadsUpTieBreakerRule[];
	requiresDirectInvite?: boolean;
	onPlayerLeave?: HeadsUpOnPlayerLeave;
};

export type TournamentFormatConfig = LeagueFormatConfig | HeadsUpFormatConfig;

export type HeadsUpAcceptanceStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'canceled';

export type HeadsUpAcceptance = {
	status: HeadsUpAcceptanceStatus;
	challengerUserId: UserId;
	opponentUserId: UserId;
	expiresAt?: string;
	respondedAt?: string;
};

export type TournamentOrganizer =
	| {
		type: 'rankup';
		displayName: string;
	}
	| {
		type: 'user';
		userId: string;
		displayName: string;
		pictureUrl?: string;
	}
	| {
		type: 'creator';
		creatorId: string;
		displayName: string;
		logoUrl?: string;
	};

export type TournamentSummary = {
	tournamentId: TournamentId;
	name: string;
	visibility: TournamentVisibility;
	discoverability: TournamentDiscoverability;
	verificationStatus: VerificationStatus;
	sportId: SportId;
	gameModeId: GameModeId;
	formatId: TournamentFormatId;
	modality: TournamentModality;
	status: TournamentStatus;
	joinPolicy: TournamentJoinPolicy;
	memberCount: number;
	description?: string;
	heroImageUrl?: string;
	organizer?: TournamentOrganizer;
	isRankedEligible?: boolean;
	timing?: TournamentTiming;
	eventId?: string;
	rewardSummary?: string;
	createdAt?: string;
	updatedAt?: string;
};

export type Tournament = TournamentSummary & {
	rulesetId?: RulesetId;
	formatConfig?: TournamentFormatConfig;
	headsUpAcceptance?: HeadsUpAcceptance;
	myMembership?: MyMembershipSummary;
};

export type MyMembershipSummary = {
	role: TournamentMemberRole;
	joinedAt: string;
	archivedAt?: string;
};

export type MyTournamentItem = {
	tournament: TournamentSummary;
	membership: MyMembershipSummary;
	lastActivityAt?: string;
};

export type MyTournamentPage = {
	items: MyTournamentItem[];
	nextCursor?: string;
};

export type DuelRoundSummary = {
	matchday?: number;
	status?: string;
	locked?: boolean;
};

export type DuelListItem = {
	tournament: TournamentSummary;
	opponentUserId: UserId;
	opponent?: UserSummary;
	currentRound?: DuelRoundSummary;
};

export type DuelPage = {
	items: DuelListItem[];
	nextCursor?: string;
};

export type CreateTournamentRequest = {
	name: string;
	description?: string;
	visibility: TournamentVisibility;
	discoverability?: TournamentDiscoverability;
	sportId: SportId;
	gameModeId: GameModeId;
	formatId?: TournamentFormatId;
	formatConfig?: TournamentFormatConfig;
	opponentUserId?: UserId;
	modality: TournamentModality;
	timing: TournamentTiming;
	joinPolicy: TournamentJoinPolicy;
	chatEnabled?: boolean;
	rulesetId?: RulesetId;
	rulesetConfig?: Record<string, unknown>;
};

export type CreateDuelRequest = CreateTournamentRequest & {
	formatId: 'headsUp';
	opponentUserId: UserId;
	formatConfig?: HeadsUpFormatConfig;
};

export type CreateRematchRequest = {
	name?: string;
	startMatchday?: number;
	formatConfigOverrides?: HeadsUpFormatConfig;
};

export type ListMyTournamentsQuery = {
	status?: TournamentStatus;
	verificationStatus?: VerificationStatus;
	sportId?: SportId;
	gameModeId?: GameModeId;
	formatId?: TournamentFormatId;
	includeArchived?: boolean;
	cursor?: string;
	pageSize?: number;
};

export type ListMyDuelsQuery = {
	status?: DuelStatusFilter;
	include?: DuelInclude[];
	cursor?: string;
	pageSize?: number;
};

export type CreateDuelRematchParams = {
	tournamentId: TournamentId;
};
