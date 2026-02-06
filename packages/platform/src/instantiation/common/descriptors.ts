import type { AnyCtor } from './instantiation.js';

export class SyncDescriptor<T> {
	public constructor(public readonly ctor: AnyCtor<T>, public readonly staticArgs: readonly unknown[] = []) {}
}
