import { GoogleSessionProvider } from '../data-service/session/providers/google-session-provider.js';
import type { ISessionProvider } from '../data-service/types';

const GOOGLE_CLIENT_ID = '228957344162-vegph85ps9mu1qofqa1i02q59ls1vnb5.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URL = `${window.location.origin}/oauth?googleAuth=1`;

type AVAILABLE_PROVIDERS = 'google';

export const RkSessionProviders: Map<AVAILABLE_PROVIDERS, ISessionProvider> = new Map([
  ['google', new GoogleSessionProvider(GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URL)],
]);
