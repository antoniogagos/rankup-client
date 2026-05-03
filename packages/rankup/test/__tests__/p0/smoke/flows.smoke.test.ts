import { startApiMock } from '@rankup/testkit/http/startApiMock.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

type Session = {
	idToken: string;
	accessToken: string;
	refreshToken: string;
	provider: 'Cognito' | 'Google';
	email: string;
	userId: string;
	expiresAt: number;
};

type SessionManagerLike = {
	isLogged: boolean;
	session: Session | null;
	signUpWithPassword(params: { email: string; password: string; username: string }): Promise<{ email: string; userId: string; userConfirmed: boolean }>;
	signUpWithOAuth(provider: 'Cognito' | 'Google'): Promise<void>;
	signInWithPassword(params: { email: string; password: string }): Promise<void>;
	signInWithOAuth(provider: 'Cognito' | 'Google'): Promise<void>;
	signOut(): void;
	forgotPassword(email: string): Promise<void>;
	confirmForgottenPassword(email: string, verificationCode: string, newPassword: string): Promise<void>;
	changePassword(email: string, oldPassword: string, newPassword: string): Promise<unknown>;
	confirmRegistration(email: string, confirmCode: string): Promise<void>;
	resendConfirmationCode(email: string): Promise<unknown>;
};

type ServiceIdentifierLike<T> = {
	id: string;
} & ((...args: never[]) => T);

type InstantiationServiceLike = {
	invokeFunction<R>(fn: (accessor: { get<T>(id: ServiceIdentifierLike<T>): T }) => R): R;
	services?: {
		services?: Map<ServiceIdentifierLike<unknown>, unknown>;
	};
};

type TournamentCoreServiceLike = {
	listMyTournaments(query?: { pageSize?: number }): Promise<{
		items: Array<{ tournament: { tournamentId: string } }>;
	}>;
	getTournamentPreview(params: { tournamentId: string }, query?: { include?: string[] }): Promise<{ tournamentId: string }>;
};

type TournamentMembersServiceLike = {
	joinTournament(params: { tournamentId: string }, body?: { acceptTournamentRules?: boolean }): Promise<{ tournamentId: string }>;
};

type TournamentMatchdaysServiceLike = {
	getTournamentMatchdayAvailability(params: { tournamentId: string; matchday: number }): Promise<{ canSubmit: boolean }>;
};

type TournamentSubmissionsServiceLike = {
	upsertMyMatchdaySubmission(
		params: { tournamentId: string; matchday: number },
		body: {
			gameModeId: 'scorePrediction';
			upserts: Array<{ matchId: string; homeScore: number; awayScore: number }>;
			removes: string[];
		},
	): Promise<unknown>;
	getMyMatchdaySubmission(params: { tournamentId: string; matchday: number }): Promise<{ tournamentId: string; matchday: number }>;
};

type TournamentRankingServiceLike = {
	getTournamentMatchdayRanking(
		params: { tournamentId: string; matchday: number },
		query?: { view?: 'compact' | 'detailed' },
	): Promise<{ meta: { tournamentId: string } }>;
};

type TournamentResultsServiceLike = {
	getMyMatchdayResults(
		params: { tournamentId: string; matchday: number },
		query?: { include?: string[] },
	): Promise<{ tournamentId: string; matchday: number }>;
};

function resolveServiceIdentifier<T>(instantiationService: InstantiationServiceLike, serviceId: string): ServiceIdentifierLike<T> {
	const serviceMap = instantiationService.services?.services;
	if (!serviceMap) {
		throw new Error('Unable to access ServiceCollection internals in smoke harness.');
	}

	for (const identifier of serviceMap.keys()) {
		if (identifier.id === serviceId) {
			return identifier as ServiceIdentifierLike<T>;
		}
	}

	throw new Error(`Service identifier not found in composition root: ${serviceId}`);
}

function getService<T>(instantiationService: InstantiationServiceLike, serviceId: string): T {
	const identifier = resolveServiceIdentifier<T>(instantiationService, serviceId);
	return instantiationService.invokeFunction(accessor => accessor.get(identifier));
}

async function createRoot(): Promise<InstantiationServiceLike> {
	const { createCompositionRoot } = await import('../../../../../../../apps/rankup-spa/lib/composition-root.ts');
	return createCompositionRoot({
		sessionManager: createSessionManagerStub(),
		getAccessToken: () => 'access-token',
	}) as InstantiationServiceLike;
}

const createSession = (): Session => ({
	idToken: 'id-token',
	accessToken: 'access-token',
	refreshToken: 'refresh-token',
	provider: 'Cognito',
	email: 'mock@rankup.dev',
	userId: 'user-cr7',
	expiresAt: 1_767_250_000_000,
});

const createSessionManagerStub = (): SessionManagerLike => ({
	isLogged: true,
	session: createSession(),
	async signUpWithPassword() {
		return {
			email: 'mock@rankup.dev',
			userId: 'user-cr7',
			userConfirmed: true,
		};
	},
	async signUpWithOAuth() {},
	async signInWithPassword() {},
	async signInWithOAuth() {},
	signOut() {
		this.session = null;
	},
	async forgotPassword() {},
	async confirmForgottenPassword() {},
	async changePassword() {
		return undefined;
	},
	async confirmRegistration() {},
	async resendConfirmationCode() {
		return undefined;
	},
});

describe('[P0] runtime smoke flows', () => {
	let stop: (() => Promise<void>) | undefined;
	let baseUrl = '';
	let previousEnv: unknown;

	beforeAll(async () => {
		(globalThis as { __allowNetworkForP0?: () => void }).__allowNetworkForP0?.();
		const mock = await startApiMock({
			scenario: {
				status: 200,
			},
		});
		baseUrl = mock.baseUrl;
		stop = mock.stop;
		const globals = globalThis as { __APP_ENV__?: unknown };
		previousEnv = globals.__APP_ENV__;
		globals.__APP_ENV__ = {
			ApiURL: baseUrl,
			Auth: {
				OAuthServerURL: baseUrl,
			},
			Mock: false,
		};
	});

	afterAll(async () => {
		await stop?.();
		const globals = globalThis as { __APP_ENV__?: unknown; __disableNetworkForP0?: () => void };
		globals.__APP_ENV__ = previousEnv;
		globals.__disableNetworkForP0?.();
	});

	it('flow 1: list my tournaments -> preview -> join', async () => {
		const root = await createRoot();
		const core = getService<TournamentCoreServiceLike>(root, 'tournamentCoreService');
		const members = getService<TournamentMembersServiceLike>(root, 'tournamentMembersService');

		const my = await core.listMyTournaments({ pageSize: 10 });
		expect(my.items.length).toBeGreaterThan(0);

		const tournamentId = my.items[0].tournament.tournamentId;
		const preview = await core.getTournamentPreview({ tournamentId }, { include: ['rules'] });
		expect(preview.tournamentId.length).toBeGreaterThan(0);

		const join = await members.joinTournament({ tournamentId }, { acceptTournamentRules: true });
		expect(join.tournamentId.length).toBeGreaterThan(0);
	});

	it('flow 2: availability -> upsert -> get my submission', async () => {
		const root = await createRoot();
		const matchdays = getService<TournamentMatchdaysServiceLike>(root, 'tournamentMatchdaysService');
		const submissions = getService<TournamentSubmissionsServiceLike>(root, 'tournamentSubmissionsService');

		const tournamentId = 'tournament-1';
		const matchday = 1;

		const availability = await matchdays.getTournamentMatchdayAvailability({ tournamentId, matchday });
		expect(typeof availability.canSubmit).toBe('boolean');

		await submissions.upsertMyMatchdaySubmission(
			{ tournamentId, matchday },
			{
				gameModeId: 'scorePrediction',
				upserts: [{ matchId: 'match-1', homeScore: 1, awayScore: 0 }],
				removes: [],
			},
		);

		const submission = await submissions.getMyMatchdaySubmission({ tournamentId, matchday });
		expect(submission.tournamentId).toBe(tournamentId);
		expect(submission.matchday).toBe(matchday);
	});

	it('flow 3: matchday ranking -> my matchday results', async () => {
		const root = await createRoot();
		const rankingService = getService<TournamentRankingServiceLike>(root, 'tournamentRankingService');
		const resultsService = getService<TournamentResultsServiceLike>(root, 'tournamentResultsService');

		const tournamentId = 'tournament-1';
		const matchday = 1;

		const ranking = await rankingService.getTournamentMatchdayRanking(
			{ tournamentId, matchday },
			{ view: 'compact' },
		);
		expect(ranking.meta.tournamentId).toBe(tournamentId);

		const results = await resultsService.getMyMatchdayResults({ tournamentId, matchday }, { include: ['breakdown'] });
		expect(results.tournamentId).toBe(tournamentId);
		expect(results.matchday).toBe(matchday);
	});
});
