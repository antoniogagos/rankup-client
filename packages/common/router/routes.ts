import { Routes as LitRoutes } from '@lit-labs/router';

import ExtendedRoutesMixin from './extended-lit-router-mixin.js';
export type { EventsMap } from './extended-lit-router-mixin.js';
export { default as RouterStyles } from './router-pages-css.js';

export class RoutesController extends ExtendedRoutesMixin(LitRoutes) {}
