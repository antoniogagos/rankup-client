import type { TournamentFormatId, TournamentModality, TournamentStatus, TournamentVisibility, VerificationStatus } from '../../shared/models/enums.js';
import type { GameModeId, SportId, TournamentId } from '../../shared/models/ids.js';
import type { TournamentJoinPolicy, TournamentOrganizer, TournamentTiming } from './tournament.js';

export type TournamentPreview = {
	tournamentId: TournamentId;
	name: string;
	description?: string;
	heroImageUrl?: string;
	organizer?: TournamentOrganizer;
	visibility: TournamentVisibility;
	verificationStatus: VerificationStatus;
	isRankedEligible?: boolean;
	sportId: SportId;
	gameModeId: GameModeId;
	formatId: TournamentFormatId;
	modality: TournamentModality;
	status: TournamentStatus;
	timing?: TournamentTiming;
	joinPolicy: TournamentJoinPolicy;
	memberCount?: number;
	rewardSummary?: string;
};

export type GetTournamentPreviewParams = {
	tournamentId: TournamentId;
};

export type GetTournamentPreviewQuery = {
	invitationCode?: string;
};
