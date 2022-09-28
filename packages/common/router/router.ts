import { Router as LitRouter } from '@lit-labs/router';

import ExtendedRoutesMixin from './extended-lit-router-mixin.js';
export type { EventsMap } from './extended-lit-router-mixin.js';
export { default as RouterStyles } from './router-pages-css.js';

/**
 * There should only be one RouterController instance on a page, since the Router
 * installs global event listeners on `window` and `document`.
 *
 * Nested routes should be configured with the `RoutesController` class.
 */
export class RouterController extends ExtendedRoutesMixin(LitRouter) {
	protected isMainRouter = true;
}
