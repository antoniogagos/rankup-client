import { GoogleSessionProvider } from '../../lib/data-service/session/providers/google-session-provider.js';
import type { ISessionProvider } from '../../lib/data-service/types';

export const RkSessionProviders: Map<string, ISessionProvider> = new Map([
  ['google', new GoogleSessionProvider('google-token-id')],
]);
