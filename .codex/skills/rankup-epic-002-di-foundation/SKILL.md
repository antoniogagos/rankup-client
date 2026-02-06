---
name: rankup-epic-002-di-foundation
description: Epic 002 DI foundation skill: implement minimal DI primitives (createDecorator, ServiceCollection, SyncDescriptor, InstantiationService) under platform/instantiation.
metadata:
  owner: rankup
  epic: "002"
  wp: "002-01"
---

# Skill: Epic 002 DI foundation (VS Code-grade primitives)

## Purpose

Implement the minimal DI primitives required by Epic 002:

-   `createDecorator`
-   `ServiceCollection`
-   `SyncDescriptor` (recommended)
-   `InstantiationService` (createInstance/invokeFunction/createChild)

## Scope

-   Only `packages/platform/src/instantiation/common/**`
-   No UI integration in this skill.

## Preconditions

-   Epic 002 exists and WP-002-01 is the active WP.
-   Repo is green: `yarn validate` passes before changes.

## Files (expected)

-   `packages/platform/src/instantiation/common/decorators.ts`
-   `packages/platform/src/instantiation/common/serviceCollection.ts`
-   `packages/platform/src/instantiation/common/descriptors.ts`
-   `packages/platform/src/instantiation/common/instantiation.ts` (types)
-   `packages/platform/src/instantiation/common/instantiationService.ts`

## Implementation constraints

-   No service locator singleton.
-   No UI imports. No `apps/rankup-spa/pages/**` or `apps/rankup-spa/elements/**`.
-   Keep the API surface minimal and stable (avoid “nice-to-have” helpers).

## Verification checklist

-   `yarn validate` PASS
-   A tiny typecheck-only smoke usage exists in platform (no test framework).
-   No changes outside platform instantiation folder unless explicitly required by compilation.
