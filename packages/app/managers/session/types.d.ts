export type Providers = 'Google' | 'Cognito';

export interface Session {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  provider: Providers;
  email: string;
  userId: string;
  expiresAt: number;
  userConfirmationNecessary?: boolean;
}

export interface EventsMap {
  'session-updated': CustomEvent<{
    session: Session | null;
    old: Session | null;
  }>;
}
