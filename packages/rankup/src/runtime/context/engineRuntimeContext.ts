import type { AuthorizationPort, ClockPort, EventBusPort, IdempotencyPort, IdGeneratorPort, MembershipRepo, ProcessedEventRepo, ScoringRepo, SportsSchedulePort, SubmissionRepo, TournamentRepo, TrustSafetyPort } from '../ports/index.js';

export type EngineRuntimeContext = {
	tournamentRepo: TournamentRepo;
	membershipRepo: MembershipRepo;
	submissionRepo: SubmissionRepo;
	sportsSchedulePort: SportsSchedulePort;
	scoringRepo: ScoringRepo;
	eventBusPort: EventBusPort;
	idempotencyPort: IdempotencyPort;
	clockPort: ClockPort;
	idGeneratorPort: IdGeneratorPort;
	authorizationPort: AuthorizationPort;
	trustSafetyPort: TrustSafetyPort;
	processedEventRepo: ProcessedEventRepo;
};
