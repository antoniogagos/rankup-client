# ADR 0025: Introduce @rankup/base and remove IEventBus

-   Status: Accepted
-   Date: 2026-01-31
-   Owners: Rankup maintainers
-   Scope: repo, packages/base, apps/rankup-spa

## Context

We want the workspace archetype to mirror the Hadron/VS Code layering (base/platform/app).
Event + disposable helpers must live in a shared base layer with a `common/` vs `browser/` split.
The current global IEventBus service duplicates the typed event system, is unused, and encourages
ambient coupling between UI and services.

## Decision

-   Add `@rankup/base` as a workspace package with `common/` and `browser/` folders.
-   Move the VS Code-grade event/disposable helpers into `@rankup/base`:
    -   `common/lifecycle.ts`
    -   `common/event.ts`
    -   `browser/event.ts`
    -   `browser/disposableController.ts`
-   Remove `IEventBus` from the service catalog, composition root wiring, and UI injection.
-   If cross-service events are needed, expose typed `Event<T>` from domain/platform services instead of a global bus.

## Constraints

-   TS-only repo sources (ADR 0005).
-   UI boundaries remain enforced (ADR 0010, ADR 0019).
-   Composition root remains the only wiring location (ADR 0016).

## Consequences

### Positive

-   Base layer becomes explicit and aligned with the Hadron/VS Code archetype.
-   Typed events replace global ambient event buses.

### Negative / Risks

-   Future migrations may be needed to adopt `@rankup/base` helpers in all packages.
-   Removal of IEventBus requires any future broadcast use cases to be modeled explicitly.

## Alternatives considered

-   Keep helpers at the repo root and leave IEventBus in place.
-   Replace IEventBus with another global EventTarget in app context.

## Implementation plan

-   [x] Create `packages/base` and move event/disposable helpers into common/browser folders.
-   [x] Remove IEventBus wiring and UI injection.
-   [x] Update docs and ADR index.

## Verification

-   Command(s):
    -   `yarn validate`
-   Expected result:
    -   PASS

## References

-   Docs: `docs/engineering/structural-change-protocol.md`
