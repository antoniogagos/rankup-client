# Implementation checklist (verifiable)

## 0) Repository baseline

-   [ ] Node version is pinned (`.nvmrc` OR `engines.node` in root package.json).
    -   Verify: `node -v` matches expected range.
-   [ ] Package manager is pinned (`packageManager` in root).
    -   Verify: `corepack --version` and `yarn -v`.
-   [ ] Single entrypoint command exists:
    -   `yarn start`
    -   `yarn validate`
    -   Verify: both commands run without manual steps.

## 1) Scripts and workspaces

-   [ ] Root scripts use ONE toolchain consistently (avoid mixing `npm --workspace` with Yarn unless justified).
    -   Verify: `yarn start` delegates correctly to `apps/rankup-spa`.
-   [ ] Every workspace exposes:
    -   `typecheck`
    -   `lint`
    -   `build` (if applicable)
    -   Verify: `yarn workspaces foreach -pt run typecheck`.

## 2) Build outputs and generated code

-   [ ] Policy for build outputs is documented (ADR required).
-   [ ] Generated code locations are explicit (e.g. OpenAPI output folder).
-   [ ] No generated artifacts are edited manually.
    -   Verify: generated folder has header comment and is git-ignored if appropriate.

## 3) TypeScript safety baseline

-   [ ] TS config defines the project boundaries (project references or equivalent).
-   [ ] Strictness profile is documented (ADR if changed).
    -   Verify: `yarn typecheck` passes.

## 4) Architecture boundaries

-   [ ] Package dependency direction is documented:
    -   platform/common -> domain -> ui -> app (or current agreed model)
-   [ ] Cross-package imports are restricted (lint rule or build rule).
    -   Verify: add a forbidden import and ensure lint fails.
-   [ ] Workspace boundaries are enforced via ESLint zones (no upstream deps).
    -   Verify: `yarn lint`

## 5) Domain extensibility (games/sports)

-   [ ] There is a registry mechanism:
    -   registerGame(gameModule)
    -   registerSport(sportModule)
-   [ ] Adding a new sport does NOT require editing unrelated game logic.
    -   Verify: implement stub sport and register without touching game internals.

## 6) API integration

-   [ ] API client strategy is documented (generated types, thin client).
-   [ ] API errors are handled in one place (not scattered).
    -   Verify: simulate 401/500 and confirm user-visible outcome is consistent.

## 7) Security/auth/session

-   [ ] Session/auth logic is behind an interface.
-   [ ] Tokens are not logged.
    -   Verify: grep for token patterns in logs.

## 8) Docs required for any new feature

-   [ ] Scope update (docs/scope)
-   [ ] ADR if architecture/tooling impacted
-   [ ] “How to add X” doc update if it changes extension points

## API contract (OpenAPI)

-   [ ] packages/api/openapi.yaml is treated as the single source of truth (ADR 0006).
-   [ ] Type generation from OpenAPI exists and is enforced.
    -   Verify: `yarn openapi:check`
-   [ ] OpenAPI lint rules are enforced.
    -   Verify: `yarn openapi:lint`
