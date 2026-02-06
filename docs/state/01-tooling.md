# Tooling state (observed)

## Workspace and package manager

-   Yarn is pinned to 4.12.0 in root package.json.
-   .yarnrc.yml sets nodeLinker: node-modules and enableScripts: true.
-   Workspaces: apps/rankup-spa, apps/rankup-web, packages/base, packages/common, packages/rankup, packages/platform, packages/samba, packages/api, packages/api-mock.
-   Node version is pinned in .nvmrc: 24.13.0.

## Scripts (observed)

-   Root scripts:
    -   start -> yarn workspace @rankup/app start
    -   start:spa -> yarn workspace @rankup/app start
    -   start:web -> yarn workspace @rankup/web start
    -   build -> tsc -b tsconfig-build.json + rollup bundle + clean
    -   clean -> tsc -b --clean tsconfig-build.json
    -   lint -> eslint --ext .ts,.html ./packages (ignores dist and .d.ts)
    -   openapi:gen -> generate packages/api/src/generated/openapi.ts
    -   openapi:lint -> spectral lint packages/api/openapi.yaml
    -   openapi:check -> openapi:gen + git diff on generated types
    -   typecheck:api -> tsc for packages/api and packages/api-mock
    -   validate -> guardrails + openapi:verify + typecheck:api + yarn workspace @rankup/app validate
    -   OLD\_\* scripts exist (lint, format, test, build, start:build, analyze).
-   apps/rankup-spa scripts:
    -   build -> tsc -b
    -   clean -> tsc -b --clean
    -   start -> wds --watch
    -   validate -> tsc --noEmit
    -   OLD\_\* scripts exist (test, build, start:build, analyze).
-   apps/rankup-web scripts:
    -   build -> tsc -b
    -   clean -> tsc -b --clean
    -   start -> wds --watch

## Build and dev server

-   Root build pipeline: `tsc -b tsconfig-build.json` + `rollup.config.ts` + `tsc -b --clean`.
-   Rollup bundles HTML entrypoints from apps/rankup-spa + apps/rankup-web into `dist/`.
-   Dev server base config: `web-dev-server.config.mjs` (WDS + esbuild).
    -   Serves TS directly (no `dist/` dependency).
    -   Plugins: strip import assertions, CSS/JSON modules, assets fallback, esbuild TS.
    -   Middleware rewrites workspace package URLs and normalizes node_modules paths.
-   App dev configs: `apps/*/web-dev-server.config.mjs` extend the base config.
-   Web Test Runner config removed (UI tests are prohibited).

## TypeScript config relationships

-   apps/rankup-spa/tsconfig.json references packages/samba, base, platform, common, rankup, api.
-   packages/samba/tsconfig.json references ../common.
-   packages/common/tsconfig.json is composite.
-   apps/rankup-spa paths map @rankup/* to workspace sources (platform, rankup, samba, common).
-   apps/rankup-spa includes only TS sources; allowJs + checkJs removed.

## Test tooling (observed deps)

-   Root devDependencies include @web/test-runner (next), jest, ts-jest, and @types/mocha.
-   apps/rankup-spa devDependencies include @open-wc/testing and @web/dev-server.
-   No active test script is defined (only OLD\_\*).

## UNKNOWN (needs info)

-   Which scripts are actually used in CI/CD (start/build/test/validate)? Provide workflow or pipeline config.
-   What is the hosting/deploy target (S3/CloudFront, Vercel, static server, etc.)?
-   Are jest or web-test-runner used today? Provide the current test command and expected output location.
-   Any shared or root tsconfig files not present in repo? Provide paths if they exist.
