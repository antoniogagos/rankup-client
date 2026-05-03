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
	listMyTournaments(query?: { pageSize?: number }): Promise<unknown>;
};

type MeServiceLike = {
	getMe(): Promise<unknown>;
};

type TournamentSubmissionsServiceLike = {
	getMyMatchdaySubmission(params: { tournamentId: string; matchday: number }): Promise<unknown>;
};

type TournamentResultsServiceLike = {
	getMyMatchdayResults(params: { tournamentId: string; matchday: number }): Promise<unknown>;
};

type DomainErrorLike = {
	kind?: string;
	status?: number;
	code?: string;
	message?: string;
	raw?: unknown;
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

describe('[P0] runtime smoke error mapping', () => {
	let stop: (() => Promise<void>) | undefined;
	let previousEnv: unknown;
	let originalFetch: typeof fetch | undefined;
	let forcedStatus: number | undefined;

	beforeAll(async () => {
		(globalThis as { __allowNetworkForP0?: () => void }).__allowNetworkForP0?.();

		const mock = await startApiMock({
			scenario: {
				status: 200,
			},
		});
		stop = mock.stop;
		const globals = globalThis as { __APP_ENV__?: unknown };
		previousEnv = globals.__APP_ENV__;
		globals.__APP_ENV__ = {
			ApiURL: mock.baseUrl,
			Auth: {
				OAuthServerURL: mock.baseUrl,
			},
			Mock: false,
		};

		originalFetch = globalThis.fetch;
		globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
			if (!forcedStatus) {
				return (originalFetch as typeof fetch)(input, init);
			}
			const headers = new Headers(init?.headers);
			headers.set('x-rankup-mock-force-status', String(forcedStatus));
			return (originalFetch as typeof fetch)(input, {
				...init,
				headers,
			});
		};
	});

	afterAll(async () => {
		const globals = globalThis as { __APP_ENV__?: unknown; __disableNetworkForP0?: () => void };
		await stop?.();
		globals.__APP_ENV__ = previousEnv;
		if (originalFetch) {
			globalThis.fetch = originalFetch;
		}
		globals.__disableNetworkForP0?.();
	});

	const runScenarioCase = async <TService>(params: {
		forceStatus: number;
		serviceId: string;
		expectedKind: string;
		expectedOperationId: string;
		invoke: (service: TService) => Promise<unknown>;
	}): Promise<void> => {
		forcedStatus = params.forceStatus;
		try {
			const root = await createRoot();
			const service = getService<TService>(root, params.serviceId);
			await expect(params.invoke(service)).rejects.toMatchObject({
				kind: params.expectedKind,
				status: params.forceStatus,
				message: 'Forced response status',
				raw: expect.objectContaining({
					operationId: params.expectedOperationId,
				}),
			} satisfies Partial<DomainErrorLike>);
		} finally {
			forcedStatus = undefined;
		}
	};

	it('maps forced 401 for accounts.getMe to canonical Unauthorized', async () => {
		await runScenarioCase<MeServiceLike>({
			forceStatus: 401,
			serviceId: 'meService',
			expectedKind: 'Unauthorized',
			expectedOperationId: 'getMe',
			invoke: service => service.getMe(),
		});
	});

	it('maps forced 403 for tournaments.listMyTournaments to canonical Forbidden', async () => {
		await runScenarioCase<TournamentCoreServiceLike>({
			forceStatus: 403,
			serviceId: 'tournamentCoreService',
			expectedKind: 'Forbidden',
			expectedOperationId: 'listMyTournaments',
			invoke: service => service.listMyTournaments({ pageSize: 1 }),
		});
	});

	it('maps forced 429 for submissions.getMyMatchdaySubmission to canonical RateLimited', async () => {
		await runScenarioCase<TournamentSubmissionsServiceLike>({
			forceStatus: 429,
			serviceId: 'tournamentSubmissionsService',
			expectedKind: 'RateLimited',
			expectedOperationId: 'getMyMatchdaySubmission',
			invoke: service => service.getMyMatchdaySubmission({ tournamentId: 'tournament-1', matchday: 1 }),
		});
	});

	it('maps forced 503 for scoring.getMyMatchdayResults to canonical ServerError', async () => {
		await runScenarioCase<TournamentResultsServiceLike>({
			forceStatus: 503,
			serviceId: 'tournamentResultsService',
			expectedKind: 'ServerError',
			expectedOperationId: 'getMyMatchdayResults',
			invoke: service => service.getMyMatchdayResults({ tournamentId: 'tournament-1', matchday: 1 }),
		});
	});
});
