import type { EngineRuntimeContext } from '../../context/engineRuntimeContext.js';
import type { RuntimeResponse } from '../../types.js';
import { evaluateTournamentLifecycle } from '../services/evaluateTournamentLifecycle.js';

export type EvaluateTournamentLifecycleInput = {
	tournamentId: string;
	requestId?: string;
};

export type EvaluateTournamentLifecycleOutput = {
	tournamentId: string;
	status: 'upcoming' | 'live' | 'finished' | 'archived' | 'cancelled';
};

export class EvaluateTournamentLifecycleUseCase {
	public constructor(private readonly context: EngineRuntimeContext) {}

	public async execute(input: EvaluateTournamentLifecycleInput): Promise<RuntimeResponse<EvaluateTournamentLifecycleOutput>> {
		const status = await evaluateTournamentLifecycle(this.context, input.tournamentId, input.requestId);
		return {
			status: 200,
			body: {
				tournamentId: input.tournamentId,
				status,
			},
			headers: {},
		};
	}
}
