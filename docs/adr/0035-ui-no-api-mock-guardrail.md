# ADR 0035: Guardrail to forbid UI imports of @rankup/api-mock

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo, apps/rankup-spa, packages/samba

## Context

UI packages must not import runtime API implementations (ADR 0010). While we already block `@rankup/api-mock/server` leakage, imports of `@rankup/api-mock` in UI packages can still creep in and blur the platform boundary.

## Decision

Add a guardrail in `scripts/repo-guardrails.ts` that fails if `@rankup/api-mock` is imported from UI packages:

-   `apps/rankup-spa/pages/**`
-   `apps/rankup-spa/elements/**`
-   `packages/samba/**`

This guardrail only targets UI packages; platform wiring can still import `@rankup/api-mock` as needed.

## Constraints

-   OpenAPI-first (ADR 0006)
-   Mock-first (ADR 0007)
-   UI packages must not import runtime API implementations (ADR 0010)

## Consequences

### Positive

-   Prevents UI from coupling to mock runtime.
-   Reinforces composition root as the only implementation selector.

### Negative / Risks

-   UI test utilities (if ever added) cannot reference the mock runtime directly (UI tests are already forbidden).

## Alternatives considered

-   Rely on ESLint only (rejected: guardrails already enforce invariants).
-   Allowlist specific UI files (rejected: undermines the boundary).

## Implementation plan

-   [x] Add guardrail in `scripts/repo-guardrails.ts`.
-   [x] Update ADR index.
-   [x] Record evidence in work log.
-   [x] Run `yarn validate`.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   ADR 0010: UI does not import API implementations
