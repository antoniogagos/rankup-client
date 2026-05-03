import type { EngineRuntimeContext } from '../../src/runtime/context/engineRuntimeContext.js';
import { InMemoryAuthorizationPort, InMemoryClockPort, InMemoryEventBusPort, InMemoryIdempotencyPort, InMemoryIdGeneratorPort, InMemoryMembershipRepo, InMemoryProcessedEventRepo, InMemoryScoringRepo, InMemorySportsSchedulePort, InMemorySubmissionRepo, InMemoryTournamentRepo, InMemoryTrustSafetyPort } from '../../src/runtime/index.js';
import type { EngineMatch, EngineMembership, EngineSubmission, EngineTournament } from '../../src/runtime/types.js';

export const BASE_NOW = '2026-02-06T10:00:00.000Z';

export function baseTournament(patch: Partial<EngineTournament> = {}): EngineTournament {
	return {
		tournamentId: 'tournament-1',
		sportId: 'football',
		gameModeId: 'scorePrediction',
		rulesetId: 'ruleset.scorePrediction.v1',
		status: 'live',
		joinPolicy: {
			joinMode: 'open',
			joinMidSeasonAllowed: true,
			locked: false,
		},
		version: 1,
		...patch,
	};
}

export function baseMatch(
	matchId: string,
	matchday: number,
	patch: Partial<EngineMatch> = {},
): EngineMatch {
	return {
		tournamentId: 'tournament-1',
		matchday,
		matchId,
		scheduledAt: '2026-02-06T20:00:00.000Z',
		lockState: 'open',
		status: 'pending',
		score: {
			home: null,
			away: null,
		},
		resultFingerprint: 'seed',
		...patch,
	};
}

export function baseMembership(userId: string, patch: Partial<EngineMembership> = {}): EngineMembership {
	return {
		tournamentId: 'tournament-1',
		userId,
		role: 'player',
		joinedAt: BASE_NOW,
		...patch,
	};
}

export function baseSubmission(
	userId: string,
	matchday: number,
	predictions: EngineSubmission['predictions'],
	patch: Partial<EngineSubmission> = {},
): EngineSubmission {
	return {
		tournamentId: 'tournament-1',
		matchday,
		userId,
		version: 1,
		predictions,
		completion: {
			submittedCount: Object.keys(predictions).length,
			expectedCount: 1,
			status: Object.keys(predictions).length > 0 ? 'complete' : 'missing',
		},
		submissionCompleteAt: BASE_NOW,
		createdAt: BASE_NOW,
		updatedAt: BASE_NOW,
		...patch,
	};
}

export function createRuntimeContext(seed?: {
	tournaments?: EngineTournament[];
	memberships?: EngineMembership[];
	matches?: EngineMatch[];
	submissions?: EngineSubmission[];
}): EngineRuntimeContext & {
	clockPort: InMemoryClockPort;
	eventBusPort: InMemoryEventBusPort;
	scoringRepo: InMemoryScoringRepo;
} {
	const clockPort = new InMemoryClockPort(new Date(BASE_NOW));
	const eventBusPort = new InMemoryEventBusPort();
	const scoringRepo = new InMemoryScoringRepo();
	return {
		tournamentRepo: new InMemoryTournamentRepo(seed?.tournaments ?? [baseTournament()]),
		membershipRepo: new InMemoryMembershipRepo(seed?.memberships ?? []),
		submissionRepo: new InMemorySubmissionRepo(seed?.submissions ?? []),
		sportsSchedulePort: new InMemorySportsSchedulePort(seed?.matches ?? []),
		scoringRepo,
		eventBusPort,
		idempotencyPort: new InMemoryIdempotencyPort(),
		clockPort,
		idGeneratorPort: new InMemoryIdGeneratorPort(),
		authorizationPort: new InMemoryAuthorizationPort(),
		trustSafetyPort: new InMemoryTrustSafetyPort(),
		processedEventRepo: new InMemoryProcessedEventRepo(),
	};
}
