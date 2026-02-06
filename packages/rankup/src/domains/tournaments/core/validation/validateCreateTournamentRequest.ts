import type { CreateTournamentRequest } from '../models/tournament.js';

export function validateCreateTournamentRequest(body: CreateTournamentRequest): void {
	const name = String(body.name ?? '').trim();
	if (!name) {
		throw new Error('Tournament name is required.');
	}
	if (name.length > 80) {
		throw new Error('Tournament name is too long.');
	}
	if (!body.visibility) {
		throw new Error('visibility is required.');
	}
	if (!body.modality) {
		throw new Error('modality is required.');
	}
	if (!body.sportId) {
		throw new Error('sportId is required.');
	}
	if (!body.gameModeId) {
		throw new Error('gameModeId is required.');
	}
	if (body.formatId === 'headsUp' && !body.opponentUserId) {
		throw new Error('opponentUserId is required for heads-up tournaments.');
	}
	if (!body.joinPolicy) {
		throw new Error('joinPolicy is required.');
	}
	if (!body.timing) {
		throw new Error('timing is required.');
	}
	if (!body.timing.seasonId) {
		throw new Error('timing.seasonId is required.');
	}

	if (!body.joinPolicy.joinMode) {
		throw new Error('joinPolicy.joinMode is required.');
	}
	if (body.joinPolicy.joinMidSeasonAllowed === undefined) {
		throw new Error('joinPolicy.joinMidSeasonAllowed is required.');
	}
	if (body.joinPolicy.locked === undefined) {
		throw new Error('joinPolicy.locked is required.');
	}
	if (body.joinPolicy.maxPlayers !== undefined) {
		if (!Number.isInteger(body.joinPolicy.maxPlayers) || body.joinPolicy.maxPlayers < 2) {
			throw new Error('joinPolicy.maxPlayers must be an integer >= 2.');
		}
	}
}
