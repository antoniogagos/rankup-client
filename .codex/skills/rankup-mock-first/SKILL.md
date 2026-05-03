---
name: "rankup-mock-first"
description: "Mock-first workflow for Rankup. Use when implementing features end-to-end before real backend: update api-mock deterministically, keep OpenAPI parity, wire app to mock via composition root, and validate."
owner: "rankup"
scope: "mock-backend"
---

# Rankup: Mock-first workflow

## Objective

Deliver UI + contract progress without waiting for a real backend by using `packages/api-mock` as the first implementation target.

## Trigger / Use when

-   You need working data/behavior for UI development.
-   The real backend is unavailable or not in scope yet.
-   You are adding an endpoint and want a fast vertical slice.

## Hard guardrails (must hold)

-   Mock must match `packages/api/openapi.yaml`. If contract changes are needed, run **rankup-openapi-first** first.
-   Mock must be deterministic (stable IDs, stable ordering, no time-dependent randomness unless controlled).
-   UI must not import `@rankup/api-mock` directly.
-   Mock/real selection must happen only in the app composition root (Epic 002).

## Workflow

1. **Confirm contract exists**

-   If endpoint/schema is missing or wrong, activate **rankup-openapi-first** and fix the contract first.

2. **Implement behavior in `packages/api-mock`**

-   Add route handlers aligned with the generated API types.
-   Use `mock-db.ts` (or equivalent) as the single source for mock state.
-   Prefer explicit fixtures (JSON-like objects) over ad-hoc inline construction.

3. **Keep types aligned**

-   Compile-time alignment is mandatory: mock should implement the same client surface as `@rankup/api`.

4. **Wire app to mock (via composition root only)**

-   Only platform wiring/composition root selects mock vs real.
-   UI layer must remain agnostic.

5. **Verify**

-   `yarn validate` must pass.
-   Ensure `@rankup/api-mock` appears only in allowlisted platform wiring files.

## Fast sanity checks (ripgrep)

```sh
rg -n "@rankup/api-mock" apps/rankup-spa
rg -n "fetch\\(|openapi-fetch" apps/rankup-spa/pages apps/rankup-spa/elements packages/samba
```

## Done criteria

-   Mock implements the required behavior with deterministic fixtures.
-   App can exercise the behavior without UI importing mock directly.
-   Validation is green; evidence logged if required by repo workflow.

## Common failure modes

-   Mock diverges from OpenAPI schemas (DTO drift).
-   UI imports mock directly "just to ship it".
-   Mock selection spread across multiple files instead of composition root.
