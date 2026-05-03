import { ApplyMatchFinishedUseCase, RecomputeTournamentUseCase } from '../src/runtime/index.js';
import { BASE_NOW, baseMatch, baseMembership, baseSubmission, createRuntimeContext } from './testkit/runtime-fixtures.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type ReplayPayload = {
	snapshots: unknown[];
	eventTypes: string[];
};

async function runReplayScenario(): Promise<string> {
	const context = createRuntimeContext({
		memberships: [baseMembership('user-a')],
		matches: [baseMatch('match-1', 1)],
		submissions: [
			baseSubmission('user-a', 1, {
				'match-1': { matchId: 'match-1', homeScore: 1, awayScore: 0, submittedAt: BASE_NOW, updatedAt: BASE_NOW },
			}),
		],
	});

	const apply = new ApplyMatchFinishedUseCase(context);
	await apply.execute({
		eventId: 'evt-md1-m1',
		tournamentId: 'tournament-1',
		matchday: 1,
		matchId: 'match-1',
		status: 'final',
		home: 1,
		away: 0,
		finalOutcomeType: 'extra_time',
	});

	const recompute = new RecomputeTournamentUseCase(context);
	await recompute.execute({
		tournamentId: 'tournament-1',
		reason: 'test.replay.byte_golden',
	});

	const payload: ReplayPayload = {
		snapshots: await context.scoringRepo.listSnapshots('tournament-1'),
		eventTypes: context.eventBusPort.listEvents().map(event => event.type),
	};

	return `${JSON.stringify(payload)}\n`;
}

describe('engine replay determinism', () => {
	it('produces byte-identical payload across two deterministic replays', async () => {
		const firstReplay = await runReplayScenario();
		const secondReplay = await runReplayScenario();
		expect(firstReplay).toBe(secondReplay);
		expect(Buffer.from(firstReplay, 'utf8').equals(Buffer.from(secondReplay, 'utf8'))).toBe(true);
	});

	it('matches golden replay payload bytes exactly', async () => {
		const goldenPath = resolve(process.cwd(), 'packages/rankup/test/golden/replay-scoreprediction-v1.json');
		const expectedBytes = readFileSync(goldenPath);
		const actualBytes = Buffer.from(await runReplayScenario(), 'utf8');

		expect(actualBytes.equals(expectedBytes)).toBe(true);
		expect(actualBytes.toString('utf8')).toBe(expectedBytes.toString('utf8'));
	});
});
