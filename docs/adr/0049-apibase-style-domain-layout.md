# ADR 0049: Apibase-style domain layout inside @rankup/rankup

-   Status: Accepted
-   Date: 2026-02-03
-   Owners: Rankup maintainers
-   Scope: domain layering, package layout, guardrails

## Context

Rankup currently isolates the tournament domain in a dedicated package (`packages/domain-tournament`). Apibase keeps domains inside a larger product package (`packages/apibase/domains/*`) and uses import guardrails to enforce boundaries. To align Rankup with the Apibase layout and reduce package sprawl while keeping platform infra-only, we need to move domain modules under an app-level package with `domains/*` submodules.

## Decision

-   Introduce a product package: `packages/rankup` (workspace package `@rankup/rankup`).
-   Move tournament domain modules to `packages/rankup/src/domains/tournaments/**`.
-   Update imports to use `@rankup/rankup/domains/tournaments/**`.
-   Update guardrails and docs to enforce domain boundaries in the new layout.
-   Retire `packages/domain-tournament`.
-   Supersede ADR 0043.

## Constraints

-   OpenAPI-first (ADR 0006) and mock-first (ADR 0007) remain mandatory.
-   UI packages must not import domain implementations (browser/mock).
-   Platform must remain infra-only and not depend on domain modules.
-   No UI tests (ADR 0002).

## Consequences

### Positive

-   Aligns with Apibase’s domain layout for consistency across repos.
-   Keeps domain ownership within a single app-level package without extra workspaces.
-   Simplifies future domain expansion under `packages/rankup/domains/*`.

### Negative / Risks

-   Large import path change across UI/services/docs.
-   Larger umbrella package may grow until domain ownership splits.
-   Requires guardrail updates to avoid regressions.

## Alternatives considered

-   Keep `packages/domain-tournament` (rejected: diverges from Apibase layout).
-   Split into multiple `packages/domain-*` packages (rejected: premature fragmentation).
-   Keep domain wiring in platform (rejected: violates platform infra-only rule).

## Implementation plan

-   [ ] Create `packages/rankup` with `src/domains/tournaments/**`.
-   [ ] Move tournament contracts/impl/register into the new domain path.
-   [ ] Update imports, workspace config, and guardrails.
-   [ ] Update docs/work tracking.
-   [ ] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0043 (superseded)
-   `docs/diagnostics/APIBASE-ALIGNMENT.md`
-   `docs/architecture/di.md`
