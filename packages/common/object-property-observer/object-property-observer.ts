type Callback = ((value: any, old: any) => void) | string;

type HasChanged = ((val: any, old: any) => boolean) | undefined;

type ObservablePropertyObject = {
	cb: Callback;
	configurable?: boolean | undefined;
	enumerable?: boolean | undefined;
	hasChanged?: HasChanged;
};

type ObservableProperty = string | ((value: any, old: any) => void) | ObservablePropertyObject;

const OBSERVED_PROPS = new WeakMap();

function createPropGetter(this: any, name: string): () => any {
	return () => OBSERVED_PROPS.get(this)?.get(name);
}

function createPropSetter(this: any, cb: Callback, name: string, hasChangedCb: HasChanged) {
	return (value: string) => {
		const old = OBSERVED_PROPS.get(this).get(name);
		const hasChanged = hasChangedCb ? hasChangedCb(value, old) : value !== old;
		if (!hasChanged) {
			return;
		}
		OBSERVED_PROPS.get(this).set(name, value);
		if (typeof cb === 'function') {
			Reflect.apply(cb, this, [value, old]);
		} else {
			Reflect.apply(this[cb], this, [value, old]);
		}
		if (typeof this.requestUpdate === 'function') {
			let inst = this.constructor;
			let mustBeUpdated = false;
			while (inst && inst?.name !== 'LitElement') {
				if (inst.properties && Object.prototype.hasOwnProperty.call(inst.properties, name) === true) {
					mustBeUpdated = true;
					break;
				}
				inst = Object.getPrototypeOf(inst);
			}
			if (mustBeUpdated) {
				this.requestUpdate(name, old);
			}
		}
	};
}

function getPropertyDescriptor({ cb, name, hasChangedCb, configurable, enumerable }: { cb: Callback; name: string; hasChangedCb: HasChanged; configurable: boolean; enumerable: boolean }) {
	return {
		enumerable: enumerable ?? true,
		configurable: configurable ?? true,
		get: createPropGetter(name),
		set: createPropSetter(cb, name, hasChangedCb),
	};
}

function observeProperty({ obj, cb, name, hasChangedCb, configurable, enumerable }: { obj: any; cb: Callback; name: string; hasChangedCb: HasChanged; configurable: boolean; enumerable: boolean }) {
	const descriptor = getPropertyDescriptor({ cb, name, hasChangedCb, configurable, enumerable });
	if (OBSERVED_PROPS.has(obj) === false) {
		OBSERVED_PROPS.set(obj, new Map());
	}
	OBSERVED_PROPS.get(obj).set(name, obj[name]);
	Object.defineProperty(obj, name, descriptor);
}

export function observeProperties(obj: object, properties: Record<string, ObservableProperty>) {
	for (const [name, params] of Object.entries(properties)) {
		const cb: Callback = (params as ObservablePropertyObject).cb ?? (params as string);
		const validObserverCb =
			cb &&
			// value is a fn
			(typeof cb === 'function' ||
				// value is the name of the fn
				typeof obj[cb as keyof typeof obj] === 'function');
		if (Reflect.getOwnPropertyDescriptor(obj, name)?.get) {
			console.log('exists-already', name, Reflect.getOwnPropertyDescriptor(obj, name), obj);
		}
		if (validObserverCb) {
			const configurable = (params as ObservablePropertyObject).configurable ?? true;
			const enumerable = (params as ObservablePropertyObject).enumerable ?? true;
			const hasChangedCb = (params as ObservablePropertyObject).hasChanged; // lit-element
			observeProperty({ obj, cb, name, hasChangedCb, configurable, enumerable });
		}
	}
}
