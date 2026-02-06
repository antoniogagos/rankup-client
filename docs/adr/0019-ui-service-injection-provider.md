# ADR 0019: UI service injection via ProviderService (@service)

-   Status: Accepted
-   Date: 2026-01-30
-   Owners: Rankup maintainers
-   Scope: apps/rankup-spa (instantiation + UI guardrails)

## Context

Rankup uses a VS Code-grade DI model for non-UI code, but Lit elements are constructed by the browser and
cannot be instantiated by the DI container. The current guardrails prohibit UI imports from
`platform/**/browser/**` and `platform/instantiation/**`, which blocks property-level service injection patterns
used in VS Code-like architectures.

We need a safe, explicit way for UI to request services without exposing a service locator or DI primitives,
while still supporting scoped services and keeping mock/real selection in the composition root.

## Decision

Introduce a DOM provider bridge for UI service injection:

-   Add `ProviderService` + `@service` decorator + `scopedServicesController` under
    `packages/platform/src/instantiation/browser/`.
-   UI may import **only** instantiation browser helpers (`service`, `scopedServicesController`).
-   UI may import service identifiers from `platform/**/common` and domain contracts (no SDK identifiers).
-   UI packages must continue to avoid DI primitives (`platform/instantiation/common`) and all other
    platform `browser/**` implementations.
-   Bootstrap a root provider scope in `rk-app` (and `rk-unauthenticated-app`), anchored to the root
    instantiation service created by the composition root.

This preserves the no-service-locator rule while enabling VS Code-like property injection and page-local scopes.

## Constraints

-   No UI tests (ADR 0002).
-   Mock-first (ADR 0007) and OpenAPI-first (ADR 0006) remain unchanged.
-   Composition root is still the only place that selects implementations (ADR 0016).

## Consequences

### Positive

-   UI can obtain services via `@service` without constructing dependencies.
-   Supports element-scoped services with explicit lifetime and optional fallback.
-   Keeps DI primitives out of UI and preserves composition-root wiring.

### Negative / Risks

-   Adds a DOM-level provider mechanism that must be bootstrapped correctly.
-   Guardrail exceptions must be precise to avoid UI importing other platform implementations.

## Alternatives considered

-   Keep UI strictly on `AppServices` only (rejected: blocks VS Code-grade property injection and scopes).
-   Expose DI locator in UI (rejected: violates explicit dependency and layering rules).

## Implementation plan

-   [x] Add provider modules under `platform/instantiation/browser`.
-   [x] Bootstrap ProviderService in root apps.
-   [x] Update ESLint guardrails + AGENTS UI boundaries.
-   [x] Update DI documentation and Epic 002 tracking.

## Verification

-   Command(s):
    -   `yarn validate`
    -   `yarn lint`
-   Expected result:
    -   Both commands succeed.

## References

-   Docs: `docs/architecture/di.md`
-   Epic: `docs/work/epics/002-service-layering-di-skeleton.md`
