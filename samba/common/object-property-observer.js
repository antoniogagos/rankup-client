const OBSERVED_PROPS = new WeakMap();
/** @typedef {string | function | ObservablePropertyObject} ObservableProperty */
/**
 * @typedef {Object} ObservablePropertyObject
 * @property {function | string} cb
 * @property {boolean} [configurable=true]
 * @property {boolean} [enumerable=true]
 * @property {(val: any, old: any) => boolean} [hasChanged]
 */

/**
 * @this any
 * @param {string} name
 * @returns
 */
function createPropGetter(name) {
  return () => OBSERVED_PROPS.get(this)?.get(name);
}

/**
 * @this any
 * @param {ObservablePropertyObject['cb']} cb
 * @param {string} name
 * @param {ObservablePropertyObject['hasChanged']} hasChangedCb
 * @returns
 */
function createPropSetter(cb, name, hasChangedCb) {
  /** @param {string} value */
  return value => {
    const old = OBSERVED_PROPS.get(this).get(name);
    const hasChanged = hasChangedCb ? hasChangedCb(value, old) : value !== old;
    if (!hasChanged) {
      return;
    }
    OBSERVED_PROPS.get(this).set(name, value);
    if (typeof cb === 'function') {
      cb.apply(this, [value, old]);
    } else {
      this[cb].apply(this, [value, old]);
    }
    if (typeof this.requestUpdate === 'function') {
      let inst = this.constructor;
      let mustBeUpdated = false;
      while (inst && inst?.name !== 'LitElement') {
        if (
          inst.properties &&
          Object.prototype.hasOwnProperty.call(inst.properties, name) === true
        ) {
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

/**
 * @param {{
 *   cb: ObservablePropertyObject['cb']
 *   name: string
 *   hasChangedCb: ObservablePropertyObject['hasChanged']
 *   configurable: boolean
 *   enumerable: boolean
 * }} param0
 */
function getPropertyDescriptor({ cb, name, hasChangedCb, configurable, enumerable }) {
  return {
    enumerable: enumerable ?? true,
    configurable: configurable ?? true,
    get: createPropGetter(name),
    set: createPropSetter(cb, name, hasChangedCb),
  };
}

/**
 * @param {{
 *   obj: any
 *   cb: ObservablePropertyObject['cb']
 *   name: string
 *   hasChangedCb: ObservablePropertyObject['hasChanged']
 *   configurable: boolean
 *   enumerable: boolean
 * }} param0
 */
function observeProperty({ obj, cb, name, hasChangedCb, configurable, enumerable }) {
  const descriptor = getPropertyDescriptor({ cb, name, hasChangedCb, configurable, enumerable });
  if (OBSERVED_PROPS.has(obj) === false) {
    OBSERVED_PROPS.set(obj, new Map());
  }
  OBSERVED_PROPS.get(obj).set(name, obj[name]);
  Object.defineProperty(obj, name, descriptor);
}

/**
 * @param {any} obj
 * @param {Object<string, ObservableProperty>} properties
 */
export function observeProperties(obj, properties) {
  for (const [name, params] of Object.entries(properties)) {
    /** @type {ObservablePropertyObject['cb']} */
    let cb = null;
    if (/** @type {ObservablePropertyObject} */ (params).cb) {
      cb = /** @type {ObservablePropertyObject} */ (params).cb;
    } else {
      cb = /** @type {string} */ (params);
    }
    const validObserverCb =
      cb &&
      // value is a fn
      (typeof cb === 'function' ||
        // value is the name of the fn
        typeof obj[/** @type {string} */ (cb)] === 'function');
    if (Reflect.getOwnPropertyDescriptor(obj, name)?.get) {
      console.log('exists-already', name, Reflect.getOwnPropertyDescriptor(obj, name), obj);
    }
    if (validObserverCb) {
      const configurable = /** @type {ObservablePropertyObject} */ (params).configurable ?? true;
      const enumerable = /** @type {ObservablePropertyObject} */ (params).enumerable ?? true;
      const hasChangedCb = /** @type {ObservablePropertyObject} */ (params).hasChanged; // lit-element
      observeProperty({ obj, cb, name, hasChangedCb, configurable, enumerable });
    }
  }
}
