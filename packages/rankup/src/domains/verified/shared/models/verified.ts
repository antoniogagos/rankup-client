export type VerifiedBranding = {
	title: string;
	subtitle?: string;
	heroImageUrl?: string;
	themeKey?: string;
	sponsorName?: string;
	sponsorLogoUrl?: string;
	ctaLabel?: string;
	disclaimer?: string;
};

export type VerifiedEligibilityAgeGate = {
	minimumAge?: number;
	required?: boolean;
};

export type VerifiedEligibility = {
	verified?: boolean;
	eloEnabled?: boolean;
	achievementsEnabled?: boolean;
	minAccountAgeDays?: number;
	minLevel?: number;
	regionAllowList?: string[];
	ageGate?: VerifiedEligibilityAgeGate;
};

export type VerifiedEventSchedule = {
	startsAt?: string;
	endsAt?: string;
	joinOpensAt?: string;
	joinClosesAt?: string;
};

export type VerifiedJoinInfo = {
	joinOpensAt?: string;
	joinClosesAt?: string;
	capacity?: number;
	currentPlayers?: number;
	joinMethod?: 'oneTap' | 'invitationCode' | 'directInvite';
	requiresAccount?: boolean;
	eligibilitySummary?: string;
};
