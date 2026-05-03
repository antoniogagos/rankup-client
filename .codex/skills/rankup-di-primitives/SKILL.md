---
name: "rankup-di-primitives"
description: "Implement VS Code-style DI primitives in TypeScript (createDecorator, ServiceCollection, SyncDescriptor, InstantiationService). Use when building or debugging DI foundations under packages/platform/src/instantiation."
owner: "rankup"
epic: "002"
wp: "002-01"
---

# WP-002-01: DI primitives (foundation)

## Objective

Implement minimal DI primitives under `packages/platform/src/instantiation/common/**`:

-   `createDecorator`
-   `ServiceCollection`
-   `SyncDescriptor` (lazy singleton)
-   `InstantiationService` (`createInstance`, `invokeFunction`, `createChild`)

## Constraints

-   No UI imports.
-   No service locator singleton.
-   Keep the API small and VS Code-like (constructor injection only).
-   Follow repo artifacts policy: do not hand-edit generated/dist outputs.

## Suggested file layout

-   `packages/platform/src/instantiation/common/decorators.ts`
-   `packages/platform/src/instantiation/common/serviceCollection.ts`
-   `packages/platform/src/instantiation/common/descriptors.ts`
-   `packages/platform/src/instantiation/common/instantiation.ts`
-   `packages/platform/src/instantiation/common/instantiationService.ts`

## Implementation steps

1. **Service identifier + decorator**

-   `createDecorator<T>(serviceId: string)` returns a parameter decorator and a typed identifier.
-   Store dependency metadata on the constructor (or target) using a `Symbol` key to avoid collisions.
-   Metadata should capture `{ id, index }`.

2. **ServiceCollection**

-   Map service identifiers to either:
    -   instance (already constructed), or
    -   `SyncDescriptor` (lazy)
-   Support parent chaining for scoping (`createChild`).

3. **SyncDescriptor**

-   Stores:
    -   ctor
    -   static args (optional)
-   The container can instantiate it lazily and then cache the instance.

4. **InstantiationService**

-   Resolves decorated ctor params by index.
-   Fills remaining params with caller-provided args (in-order).
-   Provides:
    -   `createInstance(ctor, ...args)`
    -   `invokeFunction(fn, ...args)` with an accessor limited to `get(id)`
    -   `createChild(services)` returning a new instantiation service with a child ServiceCollection
-   Add cycle detection:
    -   If a service is being constructed and requested again, throw an error with a readable chain.

## Minimal smoke proof (typecheck-only)

-   Add a tiny internal example under platform (not UI) that:
    -   defines 2 services (IA, IB)
    -   registers one as instance and one as descriptor
    -   creates a class with injected deps via ctor param decorator
    -   compiles under `yarn validate`

## Verification

-   `yarn validate` -> PASS

## Done criteria

-   DI primitives compile.
-   InstantiationService can create an injected class (smoke example compiles).
-   No UI imports and no service locator introduced.
