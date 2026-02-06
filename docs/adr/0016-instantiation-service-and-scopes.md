# ADR 0016: Instantiation service and scoped DI (VS Code-grade)

-   Status: Accepted
-   Date: 2026-01-29
-   Owners: Rankup maintainers
-   Scope: repo

## Context

Rankup is built by multiple agents that may start with zero external context. Without a strict, VS Code-like service model, UI and feature code tends to:

-   construct dependencies directly (new/factories),
-   select implementations (mock vs real) outside the composition root,
-   hide coupling via ad-hoc globals/service locators,
-   create refactor pressure when adding new game modes (ScorePrediction, Draft) and new sports.

VS Code solves this class of problems by:

-   consuming functionality through services (identifiers + interfaces),
-   obtaining instances via constructor injection,
-   creating instances through an instantiation service (`createInstance`),
-   and using scoped containers (child instantiation services) where needed.

Rankup uses Lit custom elements, which are constructed by the browser runtime. This prevents us from fully DI-constructing UI elements, but it does not prevent a VS Code-grade service model for the non-UI layer (controllers, domain services, platform services) and a controlled bridge to UI.

## Decision

### 1) Adopt a VS Code-inspired instantiation service

Rankup adopts a minimal subset of VS Code’s DI model:

-   A service identifier (ServiceIdentifier) is created via `createDecorator<T>(id)`.
-   A ServiceCollection registers service identifiers to:
    -   eager instances, or
    -   lazy descriptors (SyncDescriptor).
-   An InstantiationService creates instances with constructor injection:
    -   `createInstance(ctor, ...args)`
    -   `invokeFunction(fn)`
    -   `createChild(services)` for scoped containers.

### 2) Composition root owns implementation selection

A single composition root in `apps/rankup-spa` MUST:

-   construct the root ServiceCollection,
-   register service implementations (including mock vs real API client),
-   create and expose the root InstantiationService.

No other layer may select mock vs real or wire implementations.

### 3) Scopes are explicit

-   App-scope (now): root instantiation service and app singletons.
-   Tourney-scope (planned): a child instantiation service created per tournament context, used for:
    -   tourney-specific state,
    -   game-mode runtime resolution,
    -   future registries/runtimes without leaking state globally.

### 4) Contracts vs implementations are separated by folder convention

Normative folder rules (VS Code-like):

-   Contracts live under `packages/platform/src/**/common/`
    -   service identifiers
    -   interfaces
    -   shared types
-   Implementations live under `packages/platform/src/**/browser/`
    -   IO (fetch/storage/time)
    -   runtime behavior

UI and other consumers must not import `browser/` implementations directly.

### 5) UI integration uses controllers and does not become a service locator

Because Lit elements are created by the browser, UI MUST NOT be constructed by DI.
Instead:

-   UI talks to controllers/services that are created via `instantiationService.createInstance`.
-   UI MUST NOT fetch arbitrary services via a global accessor or direct ServiceCollection access.
-   `invokeFunction(accessor => ...)` is reserved for platform/workbench wiring, not for random UI usage.

The goal is explicit dependency graphs:

-   dependencies appear in constructors of controllers/services,
-   not hidden behind “getService()” calls scattered through UI.

## Constraints

-   No UI tests (ADR 0002).
-   OpenAPI-first and mock-first remain mandatory (ADR 0006 / ADR 0007).
-   UI packages must not import API implementations (ADR 0010).
-   TS-only repo sources (ADR 0005).

## Consequences

### Positive

-   Stable, enforceable service boundaries and explicit dependencies.
-   Mock vs real selection remains centralized.
-   Enables future tourney-scope game runtimes (Draft, new sports) without global state drift.
-   Multi-agent work becomes reproducible: the service model is documented and checkable.

### Negative / Risks

-   Requires disciplined layering and lint enforcement to prevent service locator patterns.
-   Some integration friction due to Lit element construction model.
-   If the composition root becomes a dumping ground, the model degrades; must remain minimal.

## Alternatives considered

-   Use a third-party DI container (rejected: unnecessary complexity; harder to keep VS Code-like semantics).
-   Use a global appContext/service locator everywhere (rejected: hides dependencies, creates coupling, breaks VS Code-grade model).
-   Manual wiring via props everywhere (rejected: brittle and inconsistent across agents).

## Implementation plan

-   [ ] Add normative DI spec: `docs/architecture/di.md`.
-   [ ] Implement DI primitives under `packages/platform/src/instantiation/common/`:
    -   createDecorator
    -   ServiceCollection
    -   SyncDescriptor (optional but recommended)
    -   InstantiationService (createInstance/invokeFunction/createChild)
-   [ ] Add `apps/rankup-spa/lib/composition-root.ts` to register:
    -   IEnvironmentService
    -   Domain gateways (mock-first via composition root selection)
-   [ ] Introduce the first domain service (recommended: ITourneyService) and migrate one vertical slice.
-   [ ] Add lint rules to prevent:
    -   UI importing platform implementations (`browser/`)
    -   UI importing DI primitives or composition root
    -   UI accessing ServiceCollection directly
    -   deep imports from API packages (already covered by ADR 0014 enforcement)

## Verification

-   Command(s):
    -   `yarn lint`
    -   `yarn validate`
-   Expected result:
    -   Both commands succeed.
-   Ripgrep checks (must be empty, UI packages):
    -   `rg -n "platform/.*/browser/" apps/rankup-spa/pages apps/rankup-spa/elements packages/samba`
    -   UI packages = `apps/rankup-spa/pages/**`, `apps/rankup-spa/elements/**`, `packages/samba/**` (see `docs/architecture/ui-packages.md`)
    -   `rg -n "ServiceCollection|get\\(" apps/rankup-spa/pages apps/rankup-spa/elements`

## References

-   Docs: `docs/architecture/services.md`
-   Docs: `docs/architecture/service-catalog.md`
-   Docs: `docs/architecture/di.md` (to be added)
-   Epic: `docs/work/epics/002-service-layering-di-skeleton.md`
