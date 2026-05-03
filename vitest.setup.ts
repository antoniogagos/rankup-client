process.env.TZ = 'UTC';

const originalFetch = globalThis.fetch;

type InternalGlobal = typeof globalThis & {
	__restoreFetchForP0?: () => void;
	__allowNetworkForP0?: () => void;
	__disableNetworkForP0?: () => void;
};

const globals = globalThis as InternalGlobal;

const disableNetwork = (): void => {
	globals.fetch = (async (...args: unknown[]) => {
		throw new Error(`[P0] Network is disabled by default. Attempted fetch(${JSON.stringify(args[0])}).`);
	}) as typeof fetch;
};

const restoreNetwork = (): void => {
	globals.fetch = originalFetch;
};

globals.__restoreFetchForP0 = restoreNetwork;
globals.__allowNetworkForP0 = restoreNetwork;
globals.__disableNetworkForP0 = disableNetwork;

disableNetwork();
