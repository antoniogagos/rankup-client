# Dependency Injection (DI) model (normative, VS Code-grade)

This document defines how services are declared, registered, and consumed in Rankup.
It is intended to be sufficient for an agent to implement new services without external context.

## Goals

-   Explicit dependencies (constructor injection) instead of implicit globals.
-   A single composition root selects implementations (mock vs real, browser vs node).
-   Scopes are explicit (app-scope now; tournament-scope later).
-   UI packages remain implementation-agnostic.

## Definitions

-   Service ID: a stable identifier used for registration and injection.
-   Service contract: interface + service ID (no runtime IO).
-   Service implementation: concrete class (IO allowed).
-   Instantiation service: creates instances and injects required services.
-   Composition root: the only place wiring implementations is allowed.

## Non-negotiable invariants

-   UI packages must not construct dependencies or select implementations.
-   UI packages must not import platform `browser/` implementations.
-   UI packages must not import DI primitives from `platform/instantiation/common` (to prevent service locator usage).
-   UI packages may import `platform/instantiation/browser` helpers (`service`, `scopedServicesController`) per ADR 0019.
-   UI packages may consume controllers/facades created by the composition root.
-   `@rankup/api` is contract-only; runtime implementations and SDK types must not leak into UI or domain packages.
-   UI packages should consume the `AppServices` bridge (`apps/rankup-spa/lib/app-services.ts`) via host-injected properties (e.g. `rk-app` receives `appServices` from `apps/rankup-spa/main.ts`).

## Folder conventions (must follow)

-   Domain contracts:
    -   `packages/rankup/src/domains/*/contracts/*`
-   Domain implementations:
    -   `packages/rankup/src/domains/*/browser/*`
-   Platform contracts:
    -   `packages/platform/src/<area>/common/*`
-   Platform implementations:
    -   `packages/platform/src/<area>/browser/*`
-   DI primitives:
    -   `packages/platform/src/instantiation/common/*`
-   Composition root:
    -   `apps/rankup-spa/lib/composition-root.ts`

## Service identifiers (createDecorator)

Each service is declared with:

-   an interface: `IExampleService`
-   an identifier: `IExampleService = createDecorator<IExampleService>('exampleService')`

Example (contract file):

```ts
export interface IExampleService {
	doThing(): void;
}

export const IExampleService = createDecorator<IExampleService>('exampleService');
```

## Registration (ServiceCollection)

Registration happens only in the composition root.
Two primary registration styles:

-   eager instance: register an already-created instance
-   lazy descriptor: register a SyncDescriptor (instantiated on demand)

Example:

```ts
services.set(IExampleService, new ExampleService());
services.set(IExampleService, new SyncDescriptor(ExampleService));
```

## Consumption (constructor injection)

Consumers declare dependencies explicitly:

```ts
export class ExampleController {
	constructor(@IExampleService private readonly exampleService: IExampleService) {}

	run(): void {
		this.exampleService.doThing();
	}
}
```

### Prohibitions

-   No `getService('id')` style lookups from feature code.
-   No ad-hoc singletons.
-   No `globalThis.services`.

## Instantiation service (createInstance/invokeFunction/createChild)

### createInstance

`createInstance` constructs a class while injecting declared service dependencies:

```ts
const controller = instantiationService.createInstance(ExampleController);
```

### Why AnyCtor uses any[]

The DI boundary uses `AnyCtor<T> = new (...args: any[]) => T` intentionally.
TypeScript cannot express "some parameters are injected services and the rest are call-site args" without losing compatibility with typed constructors.
VS Code uses the same pattern: `any[]` is confined to the DI boundary and does not leak into service contracts or UI code.

### invokeFunction

`invokeFunction` is reserved for composition wiring and platform glue.
UI should not use it as a service locator.

### createChild (scopes)

A child instantiation service is used to model scoped state.
Planned scope:

-   tournament-scope: per tournament context and per game-mode runtime.

Pattern:

-   create child with overridden/additional bindings (e.g. ITournamentContextService)

## Lit UI integration (controllers)

Lit elements are constructed by the browser; we do NOT DI-construct UI elements.
Instead:

-   UI receives controllers/facades (or `AppServices`) that are created by the instantiation service.
-   Controllers/services encapsulate service calls and domain orchestration.

Allowed:

-   `rk-home-page` depends on a `HomeController` passed from the composition root.
-   `rk-tournament-list` calls `this.appServices.tournament.core.listMyTournaments()`.

Not allowed:

	-   `rk-home-page` imports `IEnvironmentService` and pulls services directly.
	-   `rk-tournament-list` imports SDK clients/gateways or `InstantiationService`.

## Lit UI integration (@service)

Rankup supports property-level service injection for Lit elements via a DOM provider:

-   Decorator: `service()` from `packages/platform/src/instantiation/browser/provider.ts`
-   Provider: `ProviderService` from `packages/platform/src/instantiation/browser/providerService.ts`
-   Scopes: `scopedServicesController()` from `packages/platform/src/instantiation/browser/elementScopedServices.ts`

Example:

```ts
import { service } from '@rankup/platform/instantiation/browser/provider.js';
import { ITournamentCoreService } from '@rankup/rankup/domains/tournaments/core/contracts/tournamentCore.js';

class RkExample extends LitElement {
	@service(ITournamentCoreService) tournamentCore?: ITournamentCoreService;
}
```

### Provider bootstrap (root scope)

The root element installs a provider scope:

```ts
const instantiationService = createCompositionRoot();
const providerService = new ProviderService(instantiationService);
providerService.provide(hostElement, instantiationService, {
	claimAll: true,
	handleMissingServices: true,
});
```

### Local scopes (element-scoped)

Use `scopedServicesController` to provide page-local services:

```ts
readonly #scope = scopedServicesController(this)
  .provideClass(ITournamentMatchdaysService, TournamentMatchdaysService);

get #matchdays() {
  return this.#scope.get(ITournamentMatchdaysService);
}
```

By default, provided services are claimed by the scope. To allow fallback to parent scopes when missing,
pass `{ claimed: false }`.

## Composition root rules

The composition root:

-   registers all services
-   selects mock vs real implementations
-   creates controllers and exposes them to UI via a typed surface

The composition root must remain minimal: wiring only, no domain logic.

## Adding a new service (checklist)

1. Add the contract in `packages/platform/src/<area>/common/`.
2. Add the implementation in `packages/platform/src/<area>/browser/`.
3. Register it in the composition root.
4. Consume it via constructor injection from controllers/services.
5. Add/adjust lint restrictions if the service introduces a new boundary.

## Lint enforcement expectations

-   UI cannot import:

    -   `@rankup/platform/**/browser/**`
    -   DI primitives (`@rankup/platform/instantiation/common`)
    -   API implementation packages (`@rankup/api-mock`, `openapi-fetch`, etc)

-   UI may import:
    -   `@rankup/platform/instantiation/browser/*` (`service`, `scopedServicesController`)
    -   `@rankup/platform/**/common/*` service identifiers (including `@rankup/platform/api/common/*`)
    -   controllers/facades exposed by composition root
    -   domain contracts (e.g., `@rankup/rankup/domains/*/contracts/**`)

## Verification

-   `yarn lint`
-   `yarn validate`
