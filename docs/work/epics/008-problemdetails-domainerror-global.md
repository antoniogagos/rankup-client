# WP-008-33: ProblemDetails/Error Taxonomy Global Closure

## Status

-   Status: Completed (`PR-001`..`PR-004` completed; lane closed)
-   Owner: Rankup maintainers
-   Last updated: 2026-02-09
-   Depends on: ADR 0064, ADR 0069, Epic 008 support lane

## Objective

Cerrar el gap de consistencia de errores para que todo el runtime/app use una taxonomía canónica única:

1. `ProblemDetails -> DomainError` en runtime HTTP (sin `Error("HTTP ...")` genérico).
2. Taxonomía de `DomainErrorKind` alineada con `EngineProblemCode` sin pérdida semántica.
3. Cobertura P0 por dominio con casos canónicos + específicos.
4. Smoke negativo que falle claramente ante drift de shape de ProblemDetails.

## Current Snapshot (2026-02-09)

-   Operaciones no-admin OpenAPI: `226`
-   Gateways SPA API: `37`
-   Wrappers explícitos `map<Domain>ProblemToDomainError`: `14` dominios API con gateway (`17` exports totales contando aliases legacy por compatibilidad)
-   Suites mapper P0 actuales: `20`
-   Cobertura de status en fixtures/tests P0 de errores: `401/403/404/409/412/422/429/5xx`
-   Status faltantes para el criterio exigente: `0`
-   `http-client` tenía lanzamientos genéricos `Error("HTTP <status>")` (4 paths) antes de `PR-001`.

## Target State (Definition of Done)

-   Todo error HTTP no-2xx del API client se materializa como `DomainError`.
-   `DomainErrorKind` preserva semántica de códigos críticos del engine (`tournamentLocked`, `joinClosed`, `etagMismatch`, `idempotencyKeyReused`, etc.).
-   Ningún mapper inventa shape ad-hoc: todos delegan al mapper canónico.
-   Cada dominio API tiene cobertura P0 de error:
	-   mínimo 1 caso canónico (401/403/404/409/422/429/5xx según aplique)
	-   mínimo 1 caso específico de dominio (ej. `SubmissionLocked`, `TournamentLocked`).
-   Smoke negativo valida error canónico vía composición real.

## PR Execution Plan (Required Order)

### PR-001: Runtime canonical mapping enforcement

Goal:

-   Eliminar throw genérico en `http-client` y forzar `DomainError` canónico en non-2xx.

Files:

-   `apps/rankup-spa/services/api/http-client.ts`
-   `apps/rankup-spa/services/api/problem/mapProblemToDomainError.ts`
-   `packages/rankup/src/domains/shared/errors/domainError.ts`
-   `apps/rankup-spa/services/api/problem/__tests__/p0/*.test.ts`
-   `packages/rankup/test/__tests__/p0/smoke/problemDetails.smoke.test.ts`

Acceptance:

-   [x] No quedan `throw new Error(\`HTTP ...\`)` en `http-client`.
-   [x] `mapProblemToDomainError` soporta status `429` y `5xx`.
-   [x] Taxonomía `DomainErrorKind` preserva códigos críticos del engine sin colapsarlos a `Conflict`.
-   [x] Existe smoke negativo P0 que valida mapping canónico de error vía composición real.

Verification:

-   `yarn vitest run -c vitest.p0.config.ts apps/rankup-spa/services/api/problem/__tests__/p0/mapProblemToDomainError.mapper.test.ts apps/rankup-spa/services/api/problem/__tests__/p0/httpClient.problem-mapping.test.ts packages/rankup/test/__tests__/p0/smoke/problemDetails.smoke.test.ts`
-   `yarn test:p0`
-   `yarn validate`

Verification evidence (2026-02-08):

-   targeted vitest command -> PASS
-   `yarn test:p0` -> PASS
-   `yarn validate` -> PASS

### PR-002: Domain-wide error mapper coverage baseline

Goal:

-   Expandir wrappers + suites P0 de error al resto de dominios API.

Files:

-   `apps/rankup-spa/services/api/**/**-mappers.ts`
-   `apps/rankup-spa/services/api/**/__tests__/p0/mappers/*.test.ts`
-   `packages/testkit/src/fixtures/dto/errors.dto.ts`

Acceptance:

-   [x] Todos los dominios API con gateway tienen wrapper `map<Domain>ProblemToDomainError`.
-   [x] Cada dominio tiene al menos un test de error canónico + específico.
-   [x] Cobertura global incluye 401/403/404/409/422/429/5xx (según aplique por dominio).

Verification:

-   `yarn test:p0`
-   `yarn test:guardrails:p0`
-   `yarn validate`

Verification evidence (2026-02-09):

-   `yarn vitest run -c vitest.p0.config.ts apps/rankup-spa/services/api/{accounts,achievements,creators,engagement,media,promotions,ranked,rules,scoring,sports,trustSafety,verified}/__tests__/p0/mappers/*.test.ts` -> PASS
-   `yarn test:guardrails:p0` -> PASS
-   `yarn test:p0` -> PASS
-   `yarn validate` -> PASS

### PR-003: Smoke + contract negative matrix

Goal:

-   Añadir rutas de error en smoke/contract para detectar drift temprano de ProblemDetails.

Files:

-   `packages/rankup/test/__tests__/p0/smoke/*.test.ts`
-   `packages/rankup/test/__tests__/p0/contracts/*.test.ts`
-   `packages/api-mock/src/fixtures/generated/*.json`

Acceptance:

-   [x] Smoke falla con error canónico claro cuando cambia shape de ProblemDetails en operaciones cubiertas.
-   [x] Contracts validan passthrough canónico de errores por dominio crítico (`accounts`, `submissions`, `tournaments`, `scoring`).

Verification:

-   `yarn test:p0`
-   `yarn validate`

Verification evidence (2026-02-09):

-   `yarn vitest run -c vitest.p0.config.ts packages/rankup/test/__tests__/p0/smoke/problemDetails.smoke.test.ts packages/rankup/test/__tests__/p0/contracts/accounts.contract.test.ts packages/rankup/test/__tests__/p0/contracts/tournaments.contract.test.ts packages/rankup/test/__tests__/p0/contracts/submissions.contract.test.ts packages/rankup/test/__tests__/p0/contracts/scoring.contract.test.ts` -> PASS
-   `yarn test:guardrails:p0` -> PASS
-   `yarn test:p0` -> PASS
-   `yarn validate` -> PASS

### PR-004: Guardrails + closure

Goal:

-   Endurecer enforcement para evitar regresión a mappers ad-hoc o errores HTTP genéricos.

Files:

-   `scripts/test-guardrails-p0.ts`
-   `scripts/repo-guardrails.ts`
-   `docs/engineering/testing-p0.md`

Acceptance:

-   [x] Guardrail bloquea `throw new Error(\`HTTP ...\`)` en `apps/rankup-spa/services/api/http-client.ts`.
-   [x] Guardrail bloquea mappers ad-hoc fuera del mapper canónico.
-   [x] Lane cerrada con evidencia completa.

Verification:

-   `yarn test:guardrails:p0`
-   `yarn test:p0`
-   `yarn validate`

Verification evidence (2026-02-09):

-   `yarn test:guardrails:p0` -> PASS
-   `yarn test:p0` -> PASS
-   `yarn validate` -> PASS

## Juicious Acceptance Criteria (A-E)

### A) Runtime canonicality

-   [x] Non-2xx HTTP del API client nunca retorna `Error("HTTP ...")`.
-   [x] Siempre retorna `DomainError` con `kind` y `status` consistentes.

### B) Taxonomy parity

-   [x] `DomainErrorKind` cubre taxonomía crítica del engine sin colapso semántico.
-   [x] `Problem.code` relevante del engine mapea a kind específico.

### C) P0 domain coverage

-   [x] Cada dominio API tiene tests de error canónico + específico.
-   [x] Cobertura agrega `403/429/5xx` donde hoy no existe.

### D) Smoke robustness

-   [x] Existe smoke negativo de composición real para ProblemDetails.
-   [x] Drift de shape de errores rompe test con mensaje accionable.

### E) CI + traceability

-   [x] `yarn validate` queda verde con el nuevo enforcement.
-   [x] `AGENTS.md`, `CURRENT.md`, epic activo y log diario reflejan estado real.

## Progress Tracking

-   Active PR: none
-   Completed PRs: `PR-001`, `PR-002`, `PR-003`, `PR-004`
-   Remaining PRs: none
-   Blockers: none (lane closed on 2026-02-09)
