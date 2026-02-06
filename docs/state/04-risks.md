# Risks and gaps (observed)

## Code generation and API drift

-   packages/api/openapi.yaml is the source of truth and codegen/lint are defined, but drift is still possible if openapi:check/openapi:lint are not run or if legacy, hand-written clients remain in use.

## Build outputs and deployment

-   dist/ is gitignored. Active build uses tsc -b plus asset copy, while rollup config (with service worker) exists but is only referenced by OLD\_\* scripts. Risk: unclear production build path and stale bundling config.

## Duplicate assets and missing files

-   assets/ and apps/rankup-spa/assets both exist and are kept in sync via copy scripts (prestart/build). Risk: divergence and unclear source of truth.
-   UI references assets that are not present in repo (e.g., /assets/images/ball-bg.webp, lightning.svg, rk-sb-live-match-card.png). Risk: broken UI in production.
-   apps/rankup-spa/assets/avatars/bulbasur.svg appears unused and likely a typo vs bulbasaur.svg.

## Tight coupling and boundaries

-   Global appContext is accessed directly from many components (getAppContext), tying UI to sessionManager/services and making dependency boundaries implicit.
-   Domain services now map SDK DTOs to domain types via gateways; ensure guardrails stay enforced to prevent `@rankup/api` leakage back into UI/domain.

## Localization and routing

-   lit-localize targetLocales includes es-419, but localization.ts AllLocales lists only es and en. Risk: unsupported locale path handling.
-   path() uses localized segments for URLs. Production host must handle /{Locale}/... rewrites.

## Auth/session correctness

-   rk-auth-wall infers logged state from localStorage keys, while SessionManager keeps session in memory. Risk: mismatch between UI state and actual session validity.
-   SessionManager \_getSesssionFromCode sets expiresAt to expiresIn (seconds) rather than an absolute timestamp. Risk: refresh scheduling bug.

## Tests and tooling

-   web-test-runner config targets dist/test/\*_/_.test.js, but tests live in apps/rankup-spa/test and no active test script builds to dist.
-   Tooling includes jest, ts-jest, @web/test-runner, and @types/mocha; risk of conflicting or stale test setup.

## UNKNOWN (needs info)

-   Expected deployment artifact and hosting stack (static host, server, CDN, etc).
-   Intended source of truth for assets (repo root only vs app package).
-   How localization routing is handled in production (rewrites for /{Locale}/...).
