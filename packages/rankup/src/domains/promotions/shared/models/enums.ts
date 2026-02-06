export type PromotionStatus = 'upcoming' | 'live' | 'ended' | 'paused';
export type PromotionType = 'leaderboardPlacement' | 'participation' | 'randomDraw' | 'streak' | 'special';
export type PromotionSort = 'featured' | 'startTimeAsc' | 'startTimeDesc' | 'newest';
export type PromotionInclude = 'rewards' | 'mechanics' | 'eligibility' | 'legal' | 'winnersPreview' | 'myStatus';
export type PromotionScopeKind = 'verifiedEvent' | 'verifiedTournament' | 'rankedSeason' | 'creator';
export type PromotionMechanicKind =
	| 'joinAndPlay'
	| 'finishTopN'
	| 'finishTopPercent'
	| 'randomDrawAmongParticipants'
	| 'streak'
	| 'other';
export type PromotionRewardType = 'giftCard' | 'physicalItem' | 'digitalItem' | 'other';
export type PromotionMeEligibilityStatus = 'eligible' | 'ineligible' | 'requiresAction';
export type PromotionMeParticipationStatus = 'notOptedIn' | 'optedIn' | 'participating' | 'completed' | 'winner' | 'disqualified';
export type PromotionMeBlockReason =
	| 'notVerifiedEligible'
	| 'regionNotEligible'
	| 'ageNotEligible'
	| 'accountTooNew'
	| 'levelTooLow'
	| 'promoNotStarted'
	| 'promoEnded'
	| 'joinClosed'
	| 'termsNotAccepted'
	| 'other';
export type PromotionRequiredAction = 'provideDateOfBirth' | 'verifyEmail' | 'acceptTerms' | 'updateCountry';
export type MyPromotionStatusFilter = 'any' | 'optedIn' | 'participating' | 'winner' | 'ended';
export type MyPromotionInclude = 'myStatus' | 'rewardsPreview';
export type PromotionWinnerInclude = 'reward';
export type RewardGrantStatus = 'pending' | 'claimable' | 'claimed' | 'delivering' | 'delivered' | 'expired' | 'canceled';
export type RewardInclude = 'delivery' | 'source';
export type RewardSort = 'newest' | 'oldest' | 'status';
export type RewardFulfillmentMethod = 'email' | 'shipping' | 'inApp';
export type RewardDeliveryStatus = 'notStarted' | 'pending' | 'sent' | 'shipped' | 'delivered' | 'failed';
