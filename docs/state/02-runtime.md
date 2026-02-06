# Runtime architecture (observed)

## App bootstrap

-   Entry point: apps/rankup-spa/index.html.
-   Loads global CSS from /samba/styles and Google Fonts.
-   Renders rk-auth-wall with rk-app (authenticated) and rk-unauthenticated-app (public) in slots.
-   Listens for "session-updated" on rk-auth-wall to lazy import /dist/rk-app.js or /dist/rk-unauthenticated-app.js.
-   Inline script sets color scheme based on localStorage theme or prefers-color-scheme.
-   Includes <overlay-container> for samba overlays.

## Routing

-   Custom element app-router (apps/rankup-spa/elements/app-router) wraps page.js and maps routes to elements.
-   Public app (rk-unauthenticated-app):
    -   / -> rk-welcome-page
    -   SIGNIN / SIGNUP / FORGOT_PASSWORD / RESET_PASSWORD / CONFIRM_REGISTRATION via path() helper in rk-url-paths.ts
    -   /oauth -> redirect to SIGNIN
    -   -   -> redirect to /
-   Authenticated app (rk-app):
    -   TOURNEYS -> rk-home-page
    -   TOURNEY/\* -> rk-tourney-page
    -   JOIN_TOURNEY -> rk-join-tourney-page
    -   CREATE_TOURNEY -> rk-create-tourney-page
    -   /404 -> rk-404-page
-   Tourney nested router (rk-tourney-page) with base getCurrentTourneyBase():
    -   MATCHDAY, RANKING, CHAT, SHARE_TOURNEY, SETTINGS_TOURNEY, RULES_TOURNEY
-   Paths are localized via @lit/localize; the path() helper prefixes /{Locale}/ and uses localized segments (see rk-url-paths.ts).

## Auth and session flow

-   SessionManager (`packages/platform/src/session/browser/session-manager.ts`) uses amazon-cognito-identity-js (minified) with Auth config from env.
-   On hostConnected (non-mock): restores Cognito session, refreshes if needed, and handles OAuth code flow for Google (query params googleAuth + code).
-   signIn/signUp with password uses CognitoUserPool; OAuth uses redirect to Auth server.
-   SessionManager dispatches "session-updated" (bubbles + composed).
-   rk-auth-wall determines initial state by checking Cognito keys in localStorage and updates on session-updated events.
-   rk-app listens to session-updated; on logout it navigates to TOURNEYS.
-   rk-unauthenticated-app sets public context and, in mock mode, auto signs in.

## Data-service flow

-   createRankupApiClient selects mock or HTTP client based on isMockMode (env Mock or URL ?mock=1/true).
-   Mock client lives in `packages/api-mock` and returns typed in-memory data.
-   HTTP client lives in `packages/platform/src/api/http-client.ts` and uses env config for fetch calls and Authorization when available.

## Localization

-   @lit/localize transform mode configured in apps/rankup-spa/lit-localize.json (sourceLocale es, targetLocales en and es-419).
-   localization.ts uses configureTransformLocalization and getLocale(); Locale is used in path().
-   updateLocale() rewrites the first path segment in the URL and reloads.

## Env config

-   env.ts reads only globalThis.__APP_ENV__ (with defaults for missing values); env.json is gitignored.
-   Dev server injects __APP_ENV__ from app-local env.json (or repo env.json.example fallback).
-   authConfig and apiURL are derived from env.
-   isMockMode is true if env.Mock or URL query param mock=1/true.

## UNKNOWN (needs info)

-   How __APP_ENV__ is injected at runtime (script tag, build-time replace, or server template). Provide bootstrapping details.
-   Actual production values for ApiURL and Auth (UserPoolId, ClientId, OAuthServerURL, RedirectURI).
-   Required auth providers and flows (Cognito, Google OAuth, others; MFA/refresh/logout requirements).
-   Any server routing rules for localized paths (reverse proxy or static host config).
