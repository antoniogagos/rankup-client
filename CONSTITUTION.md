# Rankup Client Constitution

## Truth hierarchy

1. ADRs in `docs/adr/` define non-negotiable engineering decisions and constraints.
2. `packages/api/openapi.yaml` is the single source of truth for the HTTP API contract.
3. `docs/scope/` defines intended scope and planned features.
4. `docs/state/` is an observed snapshot of the current codebase (not the plan).
   If anything conflicts, update docs/ADR to restore consistency.

## Structural change definition

A change is structural if it affects architecture, tooling, build, packaging, API integration, auth/session, workspace boundaries, or cross-package dependency rules. Examples include:

-   workspace layout or dependency direction
-   build/dev tool changes
-   TypeScript or ESLint configuration changes
-   new or removed workspaces
-   changes to root or package-level scripts that affect how the repo builds/validates

## Structural change protocol (mandatory)

-   Every structural change must have an ADR in `docs/adr/`.
-   The ADR index (`docs/adr/README.md`) must be updated.
-   The change must be verifiable via `yarn validate`.

## Non-negotiable constraints

-   OpenAPI-first: all API changes start in `packages/api/openapi.yaml`.
-   Mock-first: frontend must run locally without backend services.
-   No real-money features.
-   No UI tests (tests only for critical algorithms/invariants).
-   TS-only sources: no versioned `.js/.mjs/.cjs` files in repo sources or tooling configs (exceptions require an ADR).

## Gates are monotonic

Quality gates only tighten over time. Do not weaken or bypass checks without an explicit ADR that states why and how it is temporary.

## Enforcement

`yarn validate` is the authoritative local check. CI must run `yarn validate` on every PR.
