import { createContext } from '@lit-labs/context';
import type { RoutesController } from '@rankup/common/router/routes';

export const routerContext = createContext<RoutesController>('router');

export { RoutesController };
