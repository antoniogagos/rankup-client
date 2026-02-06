import type { ServiceIdentifier } from '../common/decorators.js';

export const PROVIDER_REQUEST_EVENT = 'context-request';

export type ProviderRequestCallback<T> = (service: T) => void;

export class ProviderRequestEvent<T> extends Event {
	public readonly serviceId: ServiceIdentifier<T>;

	public readonly callback: ProviderRequestCallback<T>;

	public claimed = false;

	public resolved = false;

	public constructor(serviceId: ServiceIdentifier<T>, callback: ProviderRequestCallback<T>) {
		super(PROVIDER_REQUEST_EVENT, { bubbles: true, composed: true });
		this.serviceId = serviceId;
		this.callback = callback;
	}

	public claim(): void {
		if (this.claimed) {
			return;
		}
		this.claimed = true;
		this.stopImmediatePropagation();
	}

	public resolve(value: T): void {
		if (this.resolved) {
			return;
		}
		this.resolved = true;
		this.claimed = true;
		this.callback(value);
		this.stopImmediatePropagation();
	}
}

export function service<T>(id: ServiceIdentifier<T>): PropertyDecorator {
	return (target: object, propertyKey: string | symbol): void => {
		const storageKey = Symbol(`rankup:service:${String(propertyKey)}`);
		const pendingKey = Symbol(`rankup:service:pending:${String(propertyKey)}`);

		Object.defineProperty(target, propertyKey, {
			get(this: EventTarget): T | undefined {
				const instance = this as unknown as Record<PropertyKey, unknown>;
				if (!Object.prototype.hasOwnProperty.call(instance, storageKey)) {
					instance[storageKey] = pendingKey;
				}
				if (instance[storageKey] === pendingKey) {
					const request = new ProviderRequestEvent(id, resolved => {
						instance[storageKey] = resolved;
					});
					this.dispatchEvent(request);
				}
				const value = instance[storageKey];
				return value === pendingKey ? undefined : (value as T | undefined);
			},
			set(this: EventTarget, value: T): void {
				const instance = this as unknown as Record<PropertyKey, unknown>;
				instance[storageKey] = value;
			},
			configurable: true,
			enumerable: true,
		});
	};
}
