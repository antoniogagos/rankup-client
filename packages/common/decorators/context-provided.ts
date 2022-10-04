/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { ReactiveElement } from '@lit/reactive-element';
import { decorateProperty } from '@lit/reactive-element/decorators/base.js';
import { ContextConsumer, ContextKey, ContextType } from '@lit-labs/context';

/*
 * IMPORTANT: For compatibility with tsickle and the Closure JS compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */

/**
 * A property decorator that adds a ContextConsumer controller to the component
 * which will try and retrieve a value for the property via the Context API.
 *
 * @param context A Context identifier value created via `createContext`
 * @param subscribe An optional boolean which when true allows the value to be updated
 *   multiple times.
 *
 * @example
 *
 * ```ts
 * import {loggerContext, Logger} from 'community-protocols/logger';
 *
 * class MyElement {
 *   @contextProvided({context: loggerContext})
 *   logger?: Logger;
 *
 *   doThing() {
 *     this.logger!.log('thing was done');
 *   }
 * }
 * ```
 * @category Decorator
 */
export function contextProvided<ValueType extends ContextKey<unknown, unknown>>({
	context,
	subscribe,
	changeCallback,
}: {
	context: ContextKey<unknown, ValueType>;
	subscribe?: boolean;
	changeCallback?: (value: ContextType<ValueType>) => void;
}): <K extends PropertyKey>(
	protoOrDescriptor: ReactiveElement & Record<K, ValueType>,
	name?: K,
	// Note TypeScript requires the return type to be `void|any`
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => void | any {
	return decorateProperty({
		finisher: (ctor: typeof ReactiveElement, name: PropertyKey) => {
			ctor.addInitializer((element: ReactiveElement): void => {
				// eslint-disable-next-line no-new
				new ContextConsumer(
					element,
					context,
					(value: ValueType) => {
						// eslint-disable-next-line no-param-reassign
						(element as any)[name] = value;
						changeCallback?.(value as ContextType<ValueType>);
					},
					subscribe,
				);
			});
		},
	});
}
