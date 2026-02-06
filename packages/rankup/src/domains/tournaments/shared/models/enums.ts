export type TournamentVisibility = 'private' | 'public';
export type TournamentDiscoverability = 'listed' | 'unlisted';
export type TournamentModality = 'matchday' | 'season';
export type TournamentStatus = 'upcoming' | 'live' | 'finished' | 'archived' | 'cancelled';
export type TournamentFormatId = 'league' | 'headsUp';
export type TournamentJoinMode = 'open' | 'code' | 'closed';
export type TournamentMemberRole = 'owner' | 'admin' | 'player' | 'moderator';
export type TournamentMemberStatus = 'active' | 'left' | 'removed';
export type TournamentMemberView = 'compact' | 'full';
export type TournamentInviteStatus = 'pending' | 'accepted' | 'declined' | 'revoked' | 'expired';
export type TournamentInviteKind = 'tournamentInvite' | 'headsUpChallenge';
export type MyTournamentInviteInclude = 'tournamentPreview';
export type MyTournamentInviteSort = 'newest' | 'oldest' | 'statusThenNewest';
export type DuelStatusFilter = 'any' | 'pending' | 'active' | 'finished';
export type DuelInclude = 'opponent' | 'currentRound';
export type CreateTournamentInviteFailureReason =
	| 'alreadyMember'
	| 'alreadyInvited'
	| 'cannotInviteSelf'
	| 'blockedByRecipient'
	| 'recipientNotDiscoverable'
	| 'recipientDoesNotAllowInvites'
	| 'tournamentLocked'
	| 'tournamentFull'
	| 'joinClosed'
	| 'invalidRecipient'
	| 'rateLimited';
export type VerificationStatus = 'private' | 'community' | 'verified_official' | 'verified_creator' | 'verified_sponsored';
export type MatchLockState = 'open' | 'locked';
export type MatchStatus = string;
export type MatchdayStatus = 'upcoming' | 'live' | 'finished';
export type TournamentMatchdayInclude = 'availabilitySummary';
export type MatchdayAvailabilityState = 'open' | 'locked' | 'finished' | 'notStarted';
export type MatchdayAvailabilityReason =
	| 'open'
	| 'tournamentArchived'
	| 'tournamentCancelled'
	| 'tournamentLocked'
	| 'joinClosed'
	| 'matchdayNotInTournamentWindow'
	| 'matchdayNotStarted'
	| 'matchdayFinished';
export type RankingScope = 'season' | 'matchday';
export type RankingState = 'provisional' | 'final';
export type RankingView = 'compact' | 'full';
export type RankingInclude = 'myEntry';
export type MatchInclude = 'eventCounters';
export type RankingTieBreaker = string;
export type InvitationCodeStatus = 'active' | 'revoked' | 'expired';
export type InvitationCodeJoinNotAllowedReason =
	| 'codeRevoked'
	| 'codeExpired'
	| 'tournamentLocked'
	| 'joinClosed'
	| 'tournamentFull'
	| 'tournamentArchived'
	| 'tournamentCancelled'
	| 'alreadyMember';
