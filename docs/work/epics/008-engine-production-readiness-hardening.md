# WP-008-34: Engine Production Readiness Hardening

## Status

-   Status: Completed (`PR-001` + `PR-002` + `PR-003` + `PR-004` + `PR-005` + `PR-006` completed; `WP-008-34` closed)
-   Owner: Rankup maintainers
-   Last updated: 2026-02-09
-   Depends on: `WP-008-32`, ADR 0060/0061/0062/0064/0065/0067/0068

## Objective

Cerrar brechas P0/P1 para dejar el Rankup Engine listo para producción con enforcement VSCode-grade (sin “parches” implícitos, sin debt invisible, con gates bloqueantes y trazables).

## Current Snapshot (2026-02-09)

-   `yarn validate` -> PASS
-   `yarn engine:test` -> PASS
-   `yarn test:p0` -> PASS
-   Cobertura 4-way global no-admin:
    -   `226` operaciones totales
    -   `226` con pass 4-way estricto
    -   `0` con `nonCanonicalFixturePath`
-   `defaultMockHandlers` mantiene catálogo explícito pero con `notImplemented` para una porción amplia de operaciones no-admin.
-   Runtime mantiene adapters `inMemory` como baseline portable y ahora incorpora adapters persistentes file-backed de producción en `packages/rankup/src/adapters/persistent/**`.
-   Runtime no usa throws genéricos en paths de dominio/contrato: error surface canónica vía `RuntimeProblem` + guardrail dedicado (`repo-engine-runtime-error-surface`).
-   Taxonomía engine/client alineada para corrupción de outcome idempotente (`idempotencyOutcomeInvalid` -> `IdempotencyOutcomeInvalid`).
-   Catálogo release-critical versionado en `diagnostics/release-critical-operations.json` con gate bloqueante en verde (`releaseCriticalNotImplemented=0/39`).
-   Cobertura negativa para fallback no crítico cerrada con fixture `expect.status=501` (`getMyPreferences`) y contrato P0 `notImplementedFallback.contract.test.ts`.
-   `MatchStatus` provider->canónico ahora deriva de OpenAPI SOT (`x-rankup-canonical-statuses`) mediante artefacto generado (`packages/api/src/generated/match-status-catalog.{ts,json}`) y guardrail bloqueante (`repo:openapi-sot-drift`).

## Target State (Definition of Done)

-   4-way global estricto no-admin en `226/226` con fixture canónico único por `operationId`.
-   Cero rutas runtime con `throw new Error(...)` genérico para errores de dominio/contrato.
-   Adapters persistentes de producción para repos críticos (`tournament`, `submission`, `idempotency`, `processed events`, snapshots) con semántica determinista.
-   Política de autorización/trust-safety alineada al ADR matrix en paths críticos de mutación.
-   Cero operaciones “release-critical” devolviendo `501 mockHandlerNotImplemented`.

## Workstreams / PR plan (Required Order)

### PR-001: Cierre 4-way canónico global (`WP-008-32` `PR-006` continuidad)

Goal:

-   Cerrar `nonCanonicalFixturePath` y hacerlo bloqueante en gate principal.

Acceptance (VSCode-grade):

-   [x] `yarn repo:operation-coverage:report` reporta:
    -   `withCanonicalFixture=226`
    -   `fourWayGlobalPass=226`
    -   `failureCounts.nonCanonicalFixturePath=0`
-   [x] `yarn repo:operation-coverage` falla si una operación no-admin no usa `packages/api-mock/src/fixtures/generated/<operationId>.json`.
-   [x] Error output obligatorio por operación: `operationId`, `method`, `path`, expected canonical path, actual path(s), acción.
-   [x] `yarn validate` PASS.

Verification evidence (2026-02-09):

-   `yarn repo:operation-coverage` -> PASS
-   `yarn repo:operation-coverage:report` -> PASS
-   `yarn api-mock:schema-validate` -> PASS
-   `yarn api-http:schema-validate` -> PASS
-   `yarn validate` -> PASS

### PR-002: Error surface runtime 100% canónica (sin throws genéricos)

Goal:

-   Reemplazar throws genéricos por `RuntimeProblem`/codes canónicos y blindar regresión.

Acceptance (VSCode-grade):

-   [x] No existen `throw new Error(` en `packages/rankup/src/runtime/**` para paths de dominio/contrato.
-   [x] Guardrail dedicado falla con mensaje accionable y ubicación exacta (`file:line:column`) si reaparece throw genérico.
-   [x] Engine problems relevantes mapean sin pérdida semántica a taxonomía cliente (`DomainErrorKind`) en rutas críticas.
-   [x] Tests P0/engine cubren al menos un caso negativo por cada path migrado.
-   [x] `yarn validate` PASS.

Verification evidence (2026-02-09):

-   `yarn repo:engine-runtime-error-surface` -> PASS
-   `yarn engine:test` -> PASS
-   `yarn vitest run -c vitest.p0.config.ts apps/rankup-spa/services/api/problem/__tests__/p0/mapProblemToDomainError.mapper.test.ts` -> PASS
-   `yarn repo:guardrails` -> PASS
-   `yarn validate` -> PASS

### PR-003: Adapters persistentes + semántica de concurrencia de producción

Goal:

-   Introducir adapters persistentes para estado crítico del engine (más allá de in-memory baseline).

Acceptance (VSCode-grade):

-   [x] Existen adapters de producción para:
    -   `TournamentRepo`
    -   `SubmissionRepo` (incluyendo compare-and-set `If-Match`)
    -   `IdempotencyPort`
    -   `ProcessedEventRepo`
    -   `ScoringRepo`
-   [x] Semántica idempotency + dedupe + ETag se conserva byte-equivalent con baseline (tests de replay/concurrency en verde).
-   [x] Guardrails de boundary/portability/type-safety permanecen verdes sin excepciones nuevas.
-   [x] `yarn engine:test`, `yarn test:p0`, `yarn validate` -> PASS.

Verification evidence (2026-02-09):

-   `yarn engine:test` -> PASS
-   `yarn test:p0` -> PASS
-   `yarn validate` -> PASS

### PR-004: Authorization/TrustSafety hardening (policy real + auditabilidad)

Goal:

-   Sustituir stubs allow/deny por policy adapters con decisiones trazables y cobertura negativa.

Acceptance (VSCode-grade):

-   [x] Paths críticos (`join`, `upsert`, `clear`, `cancel`, ownership/lifecycle mutation) evalúan policy real y devuelven Problem code estable.
-   [x] Cobertura negativa explícita para `403` (`forbiddenRole`/`notMember`) y bloqueos trust-safety.
-   [x] Eventos críticos incluyen metadata (`requestId`, `correlationId`, `causationId`) y actor/audit fields requeridos.
-   [x] `yarn engine:test`, `yarn test:p0`, `yarn validate` -> PASS.

Verification evidence (2026-02-09):

-   `yarn engine:test` -> PASS
-   `yarn test:p0` -> PASS
-   `yarn validate` -> PASS

### PR-005: `notImplemented` burn-down release-critical + ratchet

Goal:

-   Eliminar `501` en operaciones release-critical y bloquear regresión en nuevas operaciones críticas.

Acceptance (VSCode-grade):

-   [x] Catálogo release-critical definido en diagnostics versionado.
-   [x] `releaseCriticalNotImplemented=0` en gate bloqueante.
-   [x] Ratchet: operación nueva release-critical no puede entrar como `notImplemented`.
-   [x] Smoke/contract negativos verifican shape canónica de errores cuando aplique fallback no crítico.
-   [x] `yarn validate` PASS.

Verification evidence (2026-02-09):

-   `yarn repo:operation-coverage` -> PASS (`releaseCriticalNotImplemented: 0/39`)
-   `yarn repo:operation-coverage:report` -> PASS (`releaseCriticalNotImplemented: 0/39`)
-   `yarn vitest run -c vitest.p0.config.ts packages/rankup/test/__tests__/p0/contracts/notImplementedFallback.contract.test.ts` -> PASS
-   `yarn validate` -> PASS

### PR-006: OpenAPI SOT anti-drift para status mapping + operation ids tipados

Goal:

-   Eliminar catálogos/manual patches de status y operation ids en rutas críticas de `api-mock`, garantizando derivación desde OpenAPI + gate bloqueante.

Acceptance (VSCode-grade):

-   [x] `MatchStatus` define catálogo canónico en OpenAPI (`x-rankup-canonical-statuses`) y genera artefacto versionado en `packages/api/src/generated/match-status-catalog.{ts,json}`.
-   [x] `packages/api-mock/src/core/match-status.ts` no contiene literales provider hardcodeados; consume `@rankup/api/generated/match-status-catalog`.
-   [x] `packages/api-mock/src/core/types.ts` elimina unión manual `OperationId` y valida consistencia context/response ids contra `@rankup/api/generated/operations`.
-   [x] Guardrail dedicado (`repo:openapi-sot-drift`) bloquea regresiones (literals provider fuera de módulo canónico, falta de import de catálogo generado, unión manual `OperationId`).
-   [x] `yarn openapi:verify` y `yarn validate` -> PASS.

Verification evidence (2026-02-09):

-   `yarn openapi:ops:gen` -> PASS
-   `yarn repo:openapi-sot-drift` -> PASS
-   `yarn typecheck:api` -> PASS
-   `yarn repo:guardrails` -> PASS
-   `yarn openapi:verify` -> PASS
-   `yarn validate` -> PASS

## Juicious Acceptance Criteria (A-E)

### A) 4-way global real

-   [x] No-admin `operationId` en `226/226` con owner + mapping + handler explícito + fixture canónico.

### B) Taxonomía consistente end-to-end

-   [x] Runtime/HTTP/client preservan `Problem.code` semántico sin colapsarlo a errores genéricos.

### C) Determinismo y concurrencia de producción

-   [x] Idempotency, `If-Match`, dedupe y replay mantienen comportamiento determinista bajo carga/concurrencia.

### D) Seguridad operativa

-   [x] Authorization/trust-safety aplican matrix real, no stubs, con auditabilidad.

### E) Gates monotónicos

-   [x] Guardrails y ratchets sólo endurecen; no se aceptan excepciones permanentes ni waivers sin expiry.

## Verification commands (minimum)

-   `yarn repo:operation-coverage:report`
-   `yarn repo:operation-coverage`
-   `yarn waivers:check`
-   `yarn engine:test`
-   `yarn test:p0`
-   `yarn validate`

## Progress Tracking

-   Active PR: none (`WP-008-34` closed)
-   Completed PRs: `PR-001`, `PR-002`, `PR-003`, `PR-004`, `PR-005`, `PR-006`
-   Remaining PRs: none
-   Blockers: none (as of 2026-02-09)
