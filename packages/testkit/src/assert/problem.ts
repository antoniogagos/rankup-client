export type ProblemLike = {
	type: string;
	title: string;
	status: number;
	code?: string;
};

export function assertProblemLike(problem: unknown): asserts problem is ProblemLike {
	if (!problem || typeof problem !== 'object') {
		throw new Error('[P0] Problem payload must be an object.');
	}
	const candidate = problem as Record<string, unknown>;
	if (typeof candidate.type !== 'string' || candidate.type.length === 0) {
		throw new Error('[P0] Problem payload must include non-empty "type".');
	}
	if (typeof candidate.title !== 'string' || candidate.title.length === 0) {
		throw new Error('[P0] Problem payload must include non-empty "title".');
	}
	if (typeof candidate.status !== 'number') {
		throw new Error('[P0] Problem payload must include numeric "status".');
	}
	if (candidate.code !== undefined && typeof candidate.code !== 'string') {
		throw new Error('[P0] Problem payload "code" must be a string when present.');
	}
}
