---
ame: "rankup-openapi-first"
description: "OpenAPI-first workflow for Rankup. Use when adding/changing endpoints or schemas: edit packages/api/openapi.yaml as source of truth, regenerate @rankup/api artifacts, update api-mock parity, and run yarn validate."
owner: "rankup"
scope: "api-contract"
---

# Rankup: OpenAPI-first workflow

## Objective

Make API changes safely and reproducibly by treating `packages/api/openapi.yaml` as the single source of truth.

## Trigger / Use when

-   You need to add/modify an endpoint, request/response schema, error model, or auth requirements.
-   UI work is blocked because the contract is missing/incorrect.
-   Mock backend needs new routes or DTO changes.

## Hard guardrails (must hold)

-   `packages/api/openapi.yaml` is the canonical contract. Do not "invent" endpoints only in mock or UI.
-   Do not manually edit generated files (regenerate instead).
-   Keep changes minimal and reviewable (avoid unrelated refactors).
-   Follow repo ADRs: OpenAPI source-of-truth and mock-first are normative.

## Workflow

Follow `docs/engineering/openapi-change-protocol.md` for the mandatory sequence and verification.

1. **Edit `packages/api/openapi.yaml` first**

-   Add or update paths, components, schemas.
-   Prefer additive changes; breaking changes only if explicitly allowed by the current greenfield policy.
-   Ensure consistent naming and stable `operationId` if used.

2. **Lint/validate the OpenAPI**

-   Run the repo validation pipeline:
    -   `yarn validate`
-   If there is a dedicated OpenAPI lint command in `package.json`, run it too.

3. **Regenerate API artifacts**

-   Identify generation commands from `package.json` scripts (search for "openapi", "generate").
-   Regenerate `packages/api/src/generated/**` (or equivalent).
-   Ensure `@rankup/api` exports remain stable/intentional (update `packages/api/src/index.ts` only if needed).

4. **Update mock implementation to match**

-   Implement new routes/behavior in `packages/api-mock/src/**`.
-   Keep mock deterministic and aligned with the new schemas.

5. **Update consumers**

-   UI must consume `@rankup/api` (contract), not runtime implementation details.
-   Do not import `@rankup/api-mock` from UI.
-   Prefer to route UI through a domain service (Epic 002 path) when available.
-   In gateways, use `apps/rankup-spa/services/api/gateway-mapping.ts` helpers for aligned DTOs.

6. **Verify**

-   `yarn validate` must pass.
-   Optional but recommended: `yarn lint` must pass.

## Fast sanity checks (ripgrep)

```sh
rg -n "openapi\\.yaml" -S
rg -n "@rankup/api-mock" apps/rankup-spa
```

## Done criteria

-   `packages/api/openapi.yaml` updated and valid.
-   Generated API artifacts updated via generator (not hand-edited).
-   Mock backend updated to match.
-   Validation is green and evidence is recorded in the work log if the repo uses one.

## Common failure modes

-   Updating mock/UI without updating OpenAPI (contract drift).
-   Manually editing generated artifacts (future regenerations break).
-   Introducing UI imports to platform/browser implementations or mock packages.
