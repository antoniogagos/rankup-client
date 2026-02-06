---
name: rankup-mock-http-server
description: HTTP mock server (contract-first, stateful) for Rankup. Use for Epic 006 work packets.
metadata:
    owner: rankup
    scope: mock-server
---

# Rankup Skill: HTTP Mock Server (contract-first, VSCode-grade)

## Purpose

Implement and evolve a local HTTP mock server that:

-   Uses `packages/api/openapi.yaml` as the source of truth
-   Enforces request validation
-   Supports stateful behavior via a shared mock core
-   Prevents Node-only leakage into browser bundles

This skill is designed for agents executing Epic 006 work packets.

## Required reading (repo-local)

-   `docs/adr/0006-openapi-source-of-truth.md`
-   `docs/adr/0007-mock-first-development.md`
-   `docs/adr/0009-api-layering-and-mock-implementation.md`
-   `docs/adr/0018-mock-http-server-mode.md`
-   `docs/architecture/mock-server.md`
-   `docs/engineering/structural-change-protocol.md`

## Invariants (hard rules)

-   UI packages MUST NOT import `@rankup/api-mock/server`
-   `@rankup/api-mock/core` MUST remain isomorphic (no `node:*` imports)
-   OpenAPI is the source of truth: do not hand-maintain "shadow contracts"
-   TS-only: do not add `.mjs/.cjs`; server runs via `node --import tsx`

## Implementation strategy (golden path)

### 1) Establish public surfaces (exports)

-   Add `exports` for:
    -   `@rankup/api-mock` (client adapter)
    -   `@rankup/api-mock/core` (shared core)
    -   `@rankup/api-mock/server` (Node-only adapter)

Keep exports pointing to TS sources and run with tsx.

### 2) Enforce anti-leakage early

Before writing server code, ensure validate fails if app imports server:

-   `rg -n "@rankup/api-mock/server" apps/rankup-spa packages/samba` must yield 0 matches

### 3) Extract mock core

Create a registry keyed by `operationId`:

-   `Record<string, Handler>`
-   handler signature takes:
    -   request context (params/query/body/headers)
    -   store
    -   scenario config
-   returns:
    -   `{ status, body, headers? }`

Refactor in-memory client adapter to dispatch to the registry.

### 4) Spike OpenAPI routing/validation/mocking

The spike is blocking. Validate the fallback stack:

-   `@apidevtools/swagger-parser` for loading/dereferencing
-   `ajv` for request validation
-   `openapi-sampler` for default mock responses
-   Runs with `node --import tsx`

### 5) Implement server adapter

-   Use the validated fallback stack (no openapi-backend)
-   For each request:
    -   match operationId via path templates
    -   validate request (body + params + query)
    -   apply scenario engine (delay/force status)
    -   if handler exists -> execute against store
    -   else -> return OpenAPI-generated mock response

## PR hygiene (VSCode-grade)

-   Prefer small, composable modules:
    -   `src/core/*`
    -   `src/server/*`
-   Avoid "magic globals":
    -   store must be explicit
    -   scenario config must be explicit
-   Every WP must include:
    -   DoR satisfied
    -   DoD satisfied
    -   verification evidence in work log

## Verification checklist

-   `yarn validate` PASS
-   `yarn workspace @rankup/api-mock spike:openapi-contract` PASS
-   `yarn workspace @rankup/api-mock smoke:scenario` PASS
-   `rg -n "@rankup/api-mock/server" apps/rankup-spa packages/samba` -> 0 matches
-   Manual smoke:
    -   start server
    -   call at least one endpoint with curl
    -   confirm 400 on invalid request
    -   confirm default mock for unhandled endpoint

## Common failure modes

-   Import leakage: UI imports server subpath -> must fail validate
-   Core accidentally imports Node builtins -> must fail guardrail
-   Mock responses diverge from spec -> treat as contract bug, fix OpenAPI or handler

## Done means

-   Server is usable by humans
-   It blocks invalid usage by automation
-   It scales by adding handlers incrementally without breaking the contract-first baseline
