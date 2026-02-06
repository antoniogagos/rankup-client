import type { ServiceIdentifier } from './decorators.js';
import type { ServiceCollection } from './serviceCollection.js';

export interface ServicesAccessor {
	get<T>(id: ServiceIdentifier<T>): T;
}

export type AnyCtor<T = unknown> = new (...args: any[]) => T;

export interface IInstantiationService {
	createInstance<T>(ctor: AnyCtor<T>, ...args: unknown[]): T;
	invokeFunction<R>(fn: (accessor: ServicesAccessor, ...args: unknown[]) => R, ...args: unknown[]): R;
	createChild(services?: ServiceCollection): IInstantiationService;
}
