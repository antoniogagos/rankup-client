# ADR 0042: Introduce apps/ layer and split landing vs SPA

-   Status: Accepted
-   Date: 2026-02-02
-   Owners: Rankup maintainers
-   Scope: repo structure, workspaces, UI entrypoints, guardrails

## Context

Rankup is expanding in scope and requires VSCode-grade scalability. The current UI lives entirely under `packages/app`, which mixes app shell, routing, pages, and shared UI. This makes it harder to:

-   Isolate landing/marketing concerns from the main app (SEO, deploy cadence).
-   Scale the monorepo with clear ownership boundaries.
-   Align with Apibase’s proven `apps/` + `packages/` archetype.

We are frontend-first and mock-first; there is no backend implementation dependency, so restructuring should focus on clean layering and minimal friction.

## Decision

-   Introduce an `apps/` layer with:
    -   `apps/rankup-web` for landing/marketing.
    -   `apps/rankup-spa` for the main application shell.
-   Move the existing app entrypoints from `packages/app` to `apps/rankup-spa`.
-   Keep shared UI in packages **only when it is truly reusable** (design system, shared components).
-   Update guardrails and UI package definitions to target the new apps paths.

## Constraints

-   TS-only sources policy remains enforced.
-   Mock-first development remains mandatory.
-   No UI tests.
-   Composition root remains the single wiring point for service selection.

## Consequences

### Positive

-   Clear separation of landing vs SPA and cleaner deploy targets.
-   Better alignment with VSCode-grade monorepo patterns (apps vs packages).
-   Easier evolution of app shell without polluting shared packages.

### Negative / Risks

-   Structural churn: many path updates and guardrail changes.
-   Requires updates to docs and tooling to avoid drift.
-   Potential temporary duplication if shared UI is not extracted carefully.

## Alternatives considered

-   Keep everything under `packages/app` and add a landing page inside it (rejected: insufficient separation).
-   Create `apps/` but keep `packages/app` as the full app shell (rejected: still blurs ownership).

## Implementation plan

-   [x] Create `apps/rankup-web` skeleton for landing.
-   [x] Move `packages/app` into `apps/rankup-spa` (app shell + pages).
-   [x] Update workspaces, scripts, guardrails, and UI package definitions.
-   [x] Update docs (repo map, CURRENT, epic note, AGENTS).

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/diagnostics/APIBASE-ALIGNMENT.md`
