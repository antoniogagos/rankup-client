export interface ServiceIdentifier<T> {
	(...args: unknown[]): void;
	readonly id: string;
	readonly _serviceBrand?: T;
}

export interface ServiceDependency {
	readonly id: ServiceIdentifier<unknown>;
	readonly index: number;
}

const DI_DEPENDENCIES = Symbol('rankup:di:dependencies');

type DecoratedConstructor = {
	new (...args: unknown[]): unknown;
	[DI_DEPENDENCIES]?: ServiceDependency[];
};

function storeServiceDependency(id: ServiceIdentifier<unknown>, target: object, index: number): void {
	const ctor = typeof target === 'function' ? target : target.constructor;
	const deps = ((ctor as { [DI_DEPENDENCIES]?: ServiceDependency[] })[DI_DEPENDENCIES] ?? []).slice();
	deps.push({ id, index });
	(ctor as { [DI_DEPENDENCIES]?: ServiceDependency[] })[DI_DEPENDENCIES] = deps;
}

export function getServiceDependencies(ctor: DecoratedConstructor): ServiceDependency[] {
	const deps = ctor[DI_DEPENDENCIES];
	if (!deps) {
		return [];
	}
	return deps.slice().sort((a, b) => a.index - b.index);
}

export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
	const decorator = (target: object, _key: string | symbol | undefined, index: number): void => {
		storeServiceDependency(decorator as ServiceIdentifier<unknown>, target, index);
	};

	Object.defineProperty(decorator, 'id', {
		value: serviceId,
		enumerable: true,
		configurable: false,
		writable: false,
	});

	return decorator as ServiceIdentifier<T>;
}
