import type { ServiceIdentifier } from '../common/decorators.js';
import { SyncDescriptor } from '../common/descriptors.js';
import type { AnyCtor, IInstantiationService } from '../common/instantiation.js';
import { ServiceCollection } from '../common/serviceCollection.js';
import type { ProviderScopeHandle, ProviderService } from './providerService.js';
import { getRootProviderService } from './providerService.js';
import type { ReactiveController, ReactiveControllerHost } from 'lit';

export type ScopedServicesControllerOptions = {
	providerService?: ProviderService;
	parentInstantiationService?: IInstantiationService;
	claimed?: boolean;
	handleMissingServices?: boolean;
};

type ReactiveHost = ReactiveControllerHost & HTMLElement;

export class ScopedServicesController implements ReactiveController {
	public readonly services = new ServiceCollection();

	public readonly instantiationService: IInstantiationService;

	private readonly scope: ProviderScopeHandle;

	private readonly claimProvided: boolean;

	private readonly providerService: ProviderService;

	public constructor(public readonly host: ReactiveHost, options: ScopedServicesControllerOptions = {}) {
		this.providerService = options.providerService ?? getRootProviderService();
		const parent = options.parentInstantiationService ?? this.providerService.getRootInstantiationService();
		this.instantiationService = parent.createChild(this.services);
		this.claimProvided = options.claimed ?? true;
		this.scope = this.providerService.provide(host, this.instantiationService, {
			handleMissingServices: options.handleMissingServices ?? true,
		});

		host.addController(this);
	}

	public provideClass<T>(id: ServiceIdentifier<T>, ctor: AnyCtor<T>, ...staticArgs: readonly unknown[]): this {
		this.services.set(id, new SyncDescriptor(ctor, staticArgs));
		if (this.claimProvided) {
			this.scope.claim(id);
		}
		this.scope.refresh();
		return this;
	}

	public provideInstance<T>(id: ServiceIdentifier<T>, instance: T): this {
		this.services.set(id, instance);
		if (this.claimProvided) {
			this.scope.claim(id);
		}
		this.scope.refresh();
		return this;
	}

	public get<T>(id: ServiceIdentifier<T>): T {
		return this.instantiationService.invokeFunction(accessor => accessor.get(id));
	}

	public hostDisconnected(): void {
		this.scope.dispose();
	}
}

export function scopedServicesController(host: ReactiveHost, options: ScopedServicesControllerOptions = {}): ScopedServicesController {
	return new ScopedServicesController(host, options);
}
