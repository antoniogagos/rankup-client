import { OverlayController } from './overlay-controller.js';

/**
 * @template {import('./types').CustomElementClass} T
 * @template [Params=any | null]
 * @template [HostEventsMap = import('./events.types').EventsMap<OverlayController<T>>]
 *
 * @param {string} elementName
 * @param {Params} [params] params to be passed to the new element instance
 * @param {import('./types').Options<T, HostEventsMap>} [overlayOptions]
 * @returns {OverlayController<T, HostEventsMap>} an OverlayController instance for the new elemnt
 */
export function openOverlay(elementName, params, overlayOptions) {
  if (!customElements.get(elementName)) {
    throw new Error(`Open overlay: element ${elementName} is not registered`);
  }
  const view = /** @type {T} */ (document.createElement(elementName));
  if (params) {
    Object.entries(params).forEach(([paramName, paramValue]) => {
      /** @type {any} */ (view)[paramName] = paramValue;
    });
  }
  /** @type {OverlayController<T, HostEventsMap>} */
  const overlayController = new OverlayController(view, overlayOptions);
  view.overlayController = overlayController;
  return overlayController;
}
