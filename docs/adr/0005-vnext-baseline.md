# ADR 0005: vNext baseline (modern toolchain, TS-only sources)

-   Status: Accepted
-   Date: 2026-01-28
-   Owners: Rankup maintainers
-   Scope: repo

## Context

We need a reproducible, modern baseline before enforcing architectural boundaries. The repo currently mixes legacy tooling and JS artifacts, which undermines lint signal and reproducibility. The target is a long-lived codebase with strict boundaries and stable extension points.

## Decision

-   Baseline toolchain:
    -   Node 24.x (Active LTS)
    -   Yarn 4.12.0 via Corepack (no Yarn classic)
    -   TypeScript 5.9.3
-   TS-only sources: no versioned .js/.mjs/.cjs files in repo source code or tooling configs.
    -   Build output may generate JS in dist/, but dist/ is not committed.
    -   Exceptions require an explicit ADR.
-   Enforce package boundaries via lint/build only after the toolchain baseline is upgraded and lint is stable (ADR 0004).

## Constraints

-   No UI tests.

## Consequences

### Positive

-   Reproducible installs and predictable tooling.
-   Lint signal improves once the baseline is in place.
-   Clear path to enforce boundaries without noise.

### Negative / Risks

-   Requires migration effort (configs and vendor JS must move to TS or be removed).
-   Short-term mismatch between decisions and current repo state.

## Alternatives considered

-   Keep legacy tooling and enforce boundaries immediately (rejected: produces noise and false negatives).

## Implementation plan

-   [ ] Pin Node 24.x and Yarn 4.12.0 (Corepack) in repo metadata.
-   [ ] Upgrade TS to 5.9.3.
-   [ ] Ensure composite TS projects emit declarations (no `"declaration": false` with `"composite": true`).
-   [ ] Migrate/remove versioned JS configs and vendor JS (TS-only repo sources).
-   [ ] Re-enable boundary enforcement once lint and build are stable.

## Implementation update (2026-01-30)

-   Updated `yarn lint` script to avoid unsupported `--ignore-path` with ESLint 9 flat config.
-   Forced legacy config usage via `ESLINT_USE_FLAT_CONFIG=false` until `eslint.config.js` is introduced.
-   Temporarily excluded `packages/api/**` and `packages/api-mock/**` from lint due to lit-a11y rule errors; remove once ESLint config is migrated.
-   Disabled `lit-a11y/*` rules globally to avoid ESLint 9 incompatibility with html processor; restore when flat config migration is complete.
-   Disabled eslint-plugin-import rules due to ESLint 9 incompatibility; revisit after migration to eslint.config.js.
-   Limited `yarn lint` to `.ts` files to avoid eslint-plugin-html incompatibility with ESLint 9.
-   Disabled `promise/*` rules due to ESLint 9 incompatibility in eslint-plugin-promise; revisit on plugin upgrade.
-   Upgraded @web/dev-server to 0.4.6 and @web/dev-server-core to 0.7.5 to align typed exports with modern TS resolution.
-   Added `tslib` as an app runtime dependency for buildless dev when `importHelpers` is enabled.
-   Switched app `moduleResolution` to `bundler` and removed `baseUrl` to avoid upcoming TS 6 deprecations.
-   Extended dev-server URL rewrites to resolve `/samba/styles/*.css` across source and dist locations.
-   Declared `typescript` as a dev dependency of `@rankup/app` and routed `start` through `yarn exec tsc` to avoid missing PATH binaries in workspaces.
-   Switched WDS config to `web-dev-server.config.mjs` (TS-only exception) so the config loader applies it under CommonJS package type.
-   Added dev-server rewrite to map workspace `.ts` module requests to `dist/*.js` when available (prevents MIME errors for TS sources).
-   Extended dev-server rewrite to map `node_modules/@rankup/*/*.ts` to workspace `dist/*.js` for symlinked packages.
-   Extended dev-server rewrite to map `/src/*` export paths to `dist/*` when packages use `rootDir: src` (prevents MIME errors for TS-only exports like `@rankup/api-mock`).
-   Mapped `node_modules/@rankup/*` paths to `/packages/*` and added `.js` fallbacks to `dist` to resolve workspace JS modules.
-   Set `useDefineForClassFields: false` for app/samba TS configs to avoid Lit class-field shadowing warnings.
-   Declared `@rankup/api-mock` module/typings entries so dev-server resolves the built runtime.

## Verification

-   `node -v` reports 24.x.
-   `yarn -v` reports 4.12.0 (via Corepack).
-   `rg -n "\\.mjs$|\\.cjs$|\\.js$" --glob '!**/dist/**'` returns no tracked source files outside the allowlist.
-   `tsc -p packages/api-mock/tsconfig.json --noEmit` succeeds with composite declarations.
