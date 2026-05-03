import { builders } from '../builders.js';

export const matchdaysDtoFixtures = {
	matchdayAvailability() {
		return {
			tournamentId: builders.tournamentId(),
			matchday: 1,
			serverTime: builders.isoDate('2026-01-12T14:00:00.000Z'),
			state: 'open',
			canSubmit: true,
			reason: 'withinWindow',
			opensAt: builders.isoDate('2026-01-12T09:00:00.000Z'),
			locksAt: builders.isoDate('2026-01-12T19:00:00.000Z'),
			closesAt: builders.isoDate('2026-01-12T21:00:00.000Z'),
			message: 'Abierto para envios',
		};
	},
};
