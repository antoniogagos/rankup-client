import { describe, expect, it } from 'vitest';
import { FixedClock } from '../../../clock.js';
import { DeterministicIdGenerator } from '../../../id.js';

describe('[P0] testkit sanity', () => {
	it('provides deterministic clock/id helpers', () => {
		const clock = new FixedClock(new Date('2026-01-01T00:00:00.000Z'));
		const ids = new DeterministicIdGenerator('p0');

		expect(clock.now().toISOString()).toBe('2026-01-01T00:00:00.000Z');
		expect(ids.next('evt')).toBe('evt-p0-0001');
		expect(ids.next('evt')).toBe('evt-p0-0002');
	});
});
