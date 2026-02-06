# Copilot Instructions for Rankup Client (VS Code-grade)

## Truth hierarchy (must-follow)

1. ADRs in `docs/adr/` are non-negotiable.
2. `docs/work/CURRENT.md` defines the active epic and next actions.
3. `packages/api/openapi.yaml` is the single source of truth for the HTTP API contract.
4. `docs/scope/` defines intended product scope and planned features.
5. `docs/state/` is an observed snapshot of the current codebase (not the plan).

If anything conflicts, update ADRs/docs so the repo becomes internally consistent.

## Non-negotiable constraints

-   No real-money features.
-   Frontend-first: local dev must work without backend using mocks.
-   No UI tests (algorithm-only tests if strictly needed).
-   TS-only sources and tooling configs: no tracked `.js/.mjs/.cjs` (exceptions require ADR).
-   UI must not import API implementations (mock or HTTP). UI may import only types from `@rankup/api` using type-only imports.

## Toolchain (baseline)

-   Node: 24.x (see `.nvmrc`)
-   Package manager: Yarn 4.12.0 via Corepack (`packageManager` in root)
-   Install: `yarn install --immutable`

## Commands

-   `yarn start`
-   `yarn validate`
-   `yarn openapi:verify`

## Architecture rules (service model)

-   UI components consume services (interfaces) and must not construct dependencies.
-   The composition root selects implementations (mock vs real).
-   HTTP, auth token handling, and fetch wrappers are not allowed in UI and samba.

## Work tracking (inviolable)

Before making changes:

1. Read `docs/work/CURRENT.md`
2. Read the active epic file referenced there
3. Read the latest `docs/work/log/YYYY-MM-DD.md`
4. Pick the relevant skill from `.codex/skills/README.md`

For structural changes, update:

-   `docs/work/CURRENT.md`
-   the active epic checklist
-   the daily log entry

## Copilot Coding Agent Firewall Notice

Use the guidance in `.github/copilot-instructions.md` and repository docs for allowlist hosts and setup steps.
