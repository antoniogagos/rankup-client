# ADR 0022: VS Code-grade event + disposable system

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo

## Context

We need a consistent, VS Code-grade system for listeners, resource cleanup, and typed events.
The repo currently lacks a shared, standardized implementation for `Disposable`, `DisposableStore`, `Emitter`,
`Event` helpers, and DOM listener utilities, which leads to ad-hoc patterns and potential leaks.

## Decision

Introduce a base event + disposable system aligned with VS Code patterns:

-   `packages/base/common/lifecycle.ts` for `IDisposable`, `Disposable`, `DisposableStore`, and helpers.
-   `packages/base/common/event.ts` for `Event<T>`, `Emitter<T>`, and `Event.*` helpers.
-   `packages/base/browser/event.ts` for DOM listeners (`listen`), `DomEmitter`, and typed `EventEmitter` helpers.
-   `packages/base/browser/disposableController.ts` for `DisposableStoreController` and minimal reactive controller contracts.

These files live in `@rankup/base` under `common/` and `browser/` and serve as the canonical implementation to be used by packages.

## Constraints

-   Guardrails and tooling remain TS-only.
-   New helpers must be leak-safe and disposable-first.

## Consequences

### Positive

-   Consistent, reusable listener lifecycle across the repo.
-   Explicit disposal patterns reduce leaks and event handler drift.

### Negative / Risks

-   Base helpers are not yet adopted by every package; incremental migrations are required.
-   Extra maintenance to keep helper APIs aligned with usage.

## Alternatives considered

-   Keep local ad-hoc listener management per package.
-   Import from an external library instead of maintaining local helpers.

## Implementation plan

-   [x] Add base event/lifecycle/browser-event/disposable controller modules under `@rankup/base`.
-   [x] Document in ADR index and work tracking.
-   [ ] Migrate consumers to these helpers when needed.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/engineering/structural-change-protocol.md`
