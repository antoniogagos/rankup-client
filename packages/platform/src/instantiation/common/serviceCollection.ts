import type { ServiceIdentifier } from './decorators.js';
import type { SyncDescriptor } from './descriptors.js';

export type ServiceValue<T> = T | SyncDescriptor<T>;

export class ServiceCollection {
	private readonly services = new Map<ServiceIdentifier<unknown>, ServiceValue<unknown>>();

	public constructor(private readonly parent?: ServiceCollection) {}

	public set<T>(id: ServiceIdentifier<T>, value: ServiceValue<T>): this {
		this.services.set(id, value as ServiceValue<unknown>);
		return this;
	}

	public has<T>(id: ServiceIdentifier<T>): boolean {
		return this.services.has(id) || Boolean(this.parent?.has(id));
	}

	public get<T>(id: ServiceIdentifier<T>): ServiceValue<T> | undefined {
		if (this.services.has(id)) {
			return this.services.get(id) as ServiceValue<T>;
		}
		return this.parent?.get(id);
	}

	public getEntry<T>(id: ServiceIdentifier<T>): { value: ServiceValue<T>; owner: ServiceCollection } | undefined {
		if (this.services.has(id)) {
			return { value: this.services.get(id) as ServiceValue<T>, owner: this };
		}
		return this.parent?.getEntry(id);
	}
}
