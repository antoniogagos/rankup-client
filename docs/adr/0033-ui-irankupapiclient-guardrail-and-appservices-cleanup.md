# ADR 0033: Enforce no UI IRankupApiClient and remove apiClient from AppServices

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo, packages/platform, apps/rankup-spa

## Context

WP-007-05 removed UI usage of `IRankupApiClient` in favor of domain services (`ITourneyService`). However, the guardrails still allowed regressions and `AppServices` exposed `apiClient`, enabling new UI coupling. A debug path in `rk-app` also exercised `apiClient` directly.

To preserve the service boundary, we need an explicit guardrail and to remove `apiClient` from the UI bridge surface.

## Decision

-   Add a guardrail that forbids any `IRankupApiClient` usage in UI packages (see `docs/architecture/ui-packages.md`).
-   Remove `apiClient` from `AppServices` and delete the debug call in `rk-app`.

## Constraints

-   UI packages must not call `fetch` directly (ADR 0010).
-   UI packages must not inject runtime API implementations (ADR 0010).
-   Composition root remains the only selector of implementations (ADR 0016).

## Consequences

### Positive

-   Prevents regressions where UI depends on `IRankupApiClient` directly.
-   Keeps AppServices aligned to domain-level APIs only.

### Negative / Risks

-   Any future UI needs for raw client access must be routed through a new domain service first.

## Alternatives considered

-   Keep `apiClient` in `AppServices` but rely on code review (rejected: guardrails must be enforceable).
-   Add a lint rule instead of a guardrail (deferred: guardrails already exist and are in use).

## Implementation plan

-   [x] Add guardrail checks in `scripts/repo-guardrails.ts` for UI `IRankupApiClient` usage.
-   [x] Remove `apiClient` from `packages/platform/src/appServices.ts`.
-   [x] Remove debug `apiClient` call from `apps/rankup-spa/rk-app.ts`.
-   [x] Update docs/state and service catalog to reflect the new boundary.
-   [x] Run `yarn validate` and record evidence.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   `docs/adr/0028-api-request-flow-standardization.md`
-   `docs/architecture/api-request-flow.md`
-   `docs/architecture/service-catalog.md`
