import { type ServiceIdentifier, getServiceDependencies } from './decorators.js';
import { SyncDescriptor } from './descriptors.js';
import type { AnyCtor, IInstantiationService, ServicesAccessor } from './instantiation.js';
import { ServiceCollection } from './serviceCollection.js';

function isSyncDescriptor<T>(value: unknown): value is SyncDescriptor<T> {
	return value instanceof SyncDescriptor || (value !== null && typeof value === 'object' && 'ctor' in value);
}

export class InstantiationService implements IInstantiationService {
	private readonly constructing = new Set<ServiceIdentifier<unknown>>();

	private readonly constructionStack: ServiceIdentifier<unknown>[] = [];

	public constructor(private readonly services: ServiceCollection) {}

	public createInstance<T>(ctor: AnyCtor<T>, ...args: unknown[]): T {
		return this._createInstance(ctor, args);
	}

	public invokeFunction<R>(fn: (accessor: ServicesAccessor, ...args: unknown[]) => R, ...args: unknown[]): R {
		const accessor: ServicesAccessor = {
			get: <T>(id: ServiceIdentifier<T>): T => this._getOrCreateServiceInstance(id),
		};
		return fn(accessor, ...args);
	}

	public createChild(services?: ServiceCollection): IInstantiationService {
		const childServices = services ?? new ServiceCollection(this.services);
		return new InstantiationService(childServices);
	}

	private _createInstance<T>(ctor: AnyCtor<T>, args: readonly unknown[]): T {
		const dependencies = getServiceDependencies(ctor);
		const serviceArgs = new Map<number, unknown>();

		for (const dependency of dependencies) {
			serviceArgs.set(dependency.index, this._getOrCreateServiceInstance(dependency.id));
		}

		const maxDependencyIndex = dependencies.length > 0 ? Math.max(...dependencies.map(dep => dep.index)) : -1;
		const paramCount = Math.max(ctor.length, maxDependencyIndex + 1, args.length);
		const finalArgs: unknown[] = new Array(paramCount);

		let argIndex = 0;
		for (let i = 0; i < paramCount; i += 1) {
			if (serviceArgs.has(i)) {
				finalArgs[i] = serviceArgs.get(i);
			} else {
				finalArgs[i] = args[argIndex];
				argIndex += 1;
			}
		}

		if (argIndex < args.length) {
			finalArgs.push(...args.slice(argIndex));
		}

		const Ctor = ctor;
		return new Ctor(...finalArgs);
	}

	private _getOrCreateServiceInstance<T>(id: ServiceIdentifier<T>): T {
		const entry = this.services.getEntry(id);
		if (!entry) {
			throw new Error(`Service not found: ${id.id}`);
		}

		const { value, owner } = entry;
		if (isSyncDescriptor<T>(value)) {
			if (this.constructing.has(id)) {
				const chain = [...this.constructionStack.map(service => service.id), id.id].join(' -> ');
				throw new Error(`Cyclic dependency detected: ${chain}`);
			}

			this.constructing.add(id);
			this.constructionStack.push(id);
			try {
				const instance = this._createInstance(value.ctor, value.staticArgs);
				owner.set(id, instance);
				return instance;
			} finally {
				this.constructing.delete(id);
				this.constructionStack.pop();
			}
		}

		return value as T;
	}
}
