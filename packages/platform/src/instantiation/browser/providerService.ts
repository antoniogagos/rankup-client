import type { ServiceIdentifier } from '../common/decorators.js';
import type { IInstantiationService } from '../common/instantiation.js';
import type { ServiceCollection } from '../common/serviceCollection.js';
import { type ProviderRequestCallback, PROVIDER_REQUEST_EVENT, ProviderRequestEvent } from './provider.js';

export type ProviderScopeOptions = {
	claimAll?: boolean;
	claimedServices?: ServiceIdentifier<unknown>[];
	handleMissingServices?: boolean;
};

export type ProviderScopeHandle = {
	host: HTMLElement;
	instantiationService: IInstantiationService;
	claim: (id: ServiceIdentifier<unknown>) => void;
	unclaim: (id: ServiceIdentifier<unknown>) => void;
	refresh: () => void;
	dispose: () => void;
};

type ProviderScope = {
	host: HTMLElement;
	instantiationService: IInstantiationService;
	claimAll: boolean;
	handleMissingServices: boolean;
	claimedServices: Set<ServiceIdentifier<unknown>>;
	pending: Map<ServiceIdentifier<unknown>, Set<ProviderRequestCallback<unknown>>>;
};

type ProviderScopeRecord = {
	scope: ProviderScope;
	handler: (event: Event) => void;
};

let rootProviderService: ProviderService | null = null;

export function setRootProviderService(service: ProviderService): void {
	rootProviderService = service;
}

export function clearRootProviderService(service?: ProviderService): void {
	if (!service || rootProviderService === service) {
		rootProviderService = null;
	}
}

export function getRootProviderService(): ProviderService {
	if (!rootProviderService) {
		throw new Error('ProviderService not set. Call setRootProviderService() in the composition root.');
	}
	return rootProviderService;
}

export class ProviderService {
	private readonly scopes = new Map<HTMLElement, ProviderScopeRecord>();

	public constructor(private readonly instantiationService: IInstantiationService) {}

	public getRootInstantiationService(): IInstantiationService {
		return this.instantiationService;
	}

	public createChild(services: ServiceCollection): IInstantiationService {
		return this.instantiationService.createChild(services);
	}

	public provide(host: HTMLElement, instantiationService: IInstantiationService = this.instantiationService, options: ProviderScopeOptions = {}): ProviderScopeHandle {
		const scope: ProviderScope = {
			host,
			instantiationService,
			claimAll: options.claimAll ?? false,
			handleMissingServices: options.handleMissingServices ?? false,
			claimedServices: new Set(options.claimedServices ?? []),
			pending: new Map(),
		};

		const handler = (event: Event): void => {
			if (event.type !== PROVIDER_REQUEST_EVENT) {
				return;
			}
			this.handleRequest(scope, event as ProviderRequestEvent<unknown>);
		};

		host.addEventListener(PROVIDER_REQUEST_EVENT, handler);
		this.scopes.set(host, { scope, handler });

		return {
			host,
			instantiationService,
			claim: (id: ServiceIdentifier<unknown>) => {
				scope.claimedServices.add(id);
			},
			unclaim: (id: ServiceIdentifier<unknown>) => {
				scope.claimedServices.delete(id);
			},
			refresh: () => {
				this.flushPending(scope);
			},
			dispose: () => {
				host.removeEventListener(PROVIDER_REQUEST_EVENT, handler);
				scope.pending.clear();
				this.scopes.delete(host);
			},
		};
	}

	private handleRequest(scope: ProviderScope, event: ProviderRequestEvent<unknown>): void {
		if (event.resolved || event.claimed) {
			return;
		}

		const resolved = this.tryResolve(scope.instantiationService, event.serviceId);
		if (resolved.resolved) {
			event.resolve(resolved.value);
			return;
		}

		const shouldClaim = scope.claimAll || scope.claimedServices.has(event.serviceId);
		if (!shouldClaim) {
			return;
		}

		event.claim();
		if (scope.handleMissingServices) {
			this.queuePending(scope, event.serviceId, event.callback);
		}
	}

	private tryResolve<T>(instantiationService: IInstantiationService, id: ServiceIdentifier<T>): { resolved: true; value: T } | { resolved: false } {
		try {
			const service = instantiationService.invokeFunction(accessor => accessor.get(id));
			return { resolved: true, value: service };
		} catch (error) {
			if (error instanceof Error && error.message.startsWith('Service not found:')) {
				return { resolved: false };
			}
			throw error;
		}
	}

	private queuePending(scope: ProviderScope, id: ServiceIdentifier<unknown>, callback: ProviderRequestCallback<unknown>): void {
		const pending = scope.pending.get(id) ?? new Set<ProviderRequestCallback<unknown>>();
		pending.add(callback);
		scope.pending.set(id, pending);
	}

	private flushPending(scope: ProviderScope): void {
		for (const [id, callbacks] of scope.pending) {
			const resolved = this.tryResolve(scope.instantiationService, id);
			if (resolved.resolved) {
				for (const callback of callbacks) {
					callback(resolved.value);
				}
				scope.pending.delete(id);
			}
		}
	}
}
