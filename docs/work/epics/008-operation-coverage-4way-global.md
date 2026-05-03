# WP-008-32: Operation Coverage 4-Way Global (sin baseline parcial)

## Status

-   Status: In Progress (`PR-001` + `PR-002` + `PR-003` + `PR-004` + `PR-005` + `PR-006` completed; hard-ratchet continuation tracked in `WP-008-34`)
-   Owner: Rankup maintainers
-   Last updated: 2026-02-09
-   Depends on: ADR 0056, Epic 008 support lane

## Objective

Eliminar el gating parcial por baseline y pasar a cobertura 4-way global para todas las operaciones OpenAPI no-admin:

1. `operationId` -> gateway owner + mapping central
2. `operationId` -> mock handler explícito
3. `operationId` -> fixture contract-valid
4. `operationId` -> ejecución de pruebas de contrato (`api-mock` + `api-http`)

No se permite “baseline parcial” para decidir qué operaciones son bloqueantes.

## Current Snapshot (2026-02-09)

-   Operaciones OpenAPI totales: `278`
-   Operaciones no-admin: `226`
-   Baseline bloqueante actual: `39` (`17.3%` de no-admin)
-   Fixtures presentes por `operationId`: `226/226` (no-admin)
-   Owners detectados en gateways: `226/226` (faltan `0`)
-   Mapping central `operationId -> gateway`: `226/226`
-   Handlers mock explícitos/no-fallback: `226/226`
-   Handlers con fallback genérico: `0/226`
-   Global 4-way pass no-admin: `226/226`
-   Waivers activos: `0`

## Target State (Definition of Done)

Para cada `operationId` no-admin del manifest:

-   Tiene owner único y trazable en gateways.
-   Tiene entrada en mapping central de operaciones de gateway.
-   Tiene handler mock explícito (`implemented` o `notImplemented` contract-valid), sin fallback implícito.
-   Tiene fixture en ruta canónica `packages/api-mock/src/fixtures/generated/<operationId>.json`.
-   Pasa `api-mock:schema-validate` y `api-http:schema-validate`.

Si no cumple:

-   Debe existir waiver válido con metadata completa:
    -   `owner`, `reason`, `issue`, `createdAt`, `expiresAt`, `plan`, `scope`, `severity`

Estado final esperado del lane:

-   Waivers `coverage/http/schema` en `0` para no-admin.

## Global Gate Contract (exacto)

Se añade un gate único y bloqueante:

-   `yarn repo:operation-coverage`

El script reporta y falla por `operationId` para cualquiera de:

-   `missingOwner`
-   `missingGatewayMapping`
-   `missingMockHandler`
-   `fallbackMockHandlerForbidden`
-   `missingFixture`
-   `mockSchemaFail`
-   `httpSchemaFail`

Nota transicional:

-   En `PR-002`, `missingOwner` permanece como deuda no-bloqueante para permitir migración incremental.
-   Desde `PR-004`, ownership y mapping central son bloqueantes (sin deuda no-bloqueante de `missingOwner`).

Formato de error obligatorio (VSCode-grade):

-   `operationId`, `method`, `path`, tipo de fallo, archivo esperado, acción recomendada.

## Ratchet Duro (operaciones nuevas)

Regla bloqueante para PRs que agregan `operationId` nuevos:

-   Ninguna operación nueva puede entrar con waiver.
-   Debe entrar con owner + mapping + handler explícito + fixture + validación mock/http en verde.

Regla bloqueante de deuda:

-   El total de waivers no puede aumentar (solo decrecer) en el job estándar.

Override explícito (excepcional):

-   Solo mediante workflow de aprobación dedicado (separado del CI estándar), con registro de aprobación y caducidad.

## PR Execution Plan (Required Order)

### PR-001: Tracking + ADR delta + inventario global reproducible

Goal:

-   Registrar formalmente el cambio de modo (baseline parcial -> global).
-   Publicar inventario por operación y gap matrix reproducible.

Files:

-   `docs/adr/0056-operation-coverage-gate.md` (o ADR nuevo si se decide)
-   `docs/quality/operation-parity-baseline.md` (deprecación/reencuadre)
-   `diagnostics/operation-coverage-global-report.json` (nuevo)
-   `scripts/repo-operation-coverage-report.ts` (nuevo)

Acceptance:

-   [x] Existe reporte global por `operationId` con estado de los 4 ejes.
-   [x] ADR y docs explican que el gating deja de depender de baseline parcial.

Verification:

-   `yarn repo:operation-coverage:report`
-   `yarn validate`

Verification evidence (2026-02-08):

-   `yarn repo:operation-coverage:report` -> PASS
-   `diagnostics/operation-coverage-global-report.json` generated with reproducible scope/summaries/failure matrix
-   `yarn validate` -> PASS

### PR-002: Gate único `repo:operation-coverage` global

Goal:

-   Consolidar checks dispersos en un único gate 4-way global por operación.

Files:

-   `scripts/repo-operation-coverage.ts` (reemplazo/expansión)
-   `package.json` (script nuevo)
-   `scripts/repo-gateways-ownership.ts`
-   `packages/api-mock/scripts/schema-validate.ts`
-   `scripts/api-http-schema-validate.ts`

Acceptance:

-   [x] El gate recorre todas las operaciones no-admin del manifest.
-   [x] No usa `diagnostics/parity-baseline-operations.json` para decidir alcance bloqueante de coverage.
-   [x] `yarn validate` consume el gate único `repo:operation-coverage` (ya no ejecuta `api-mock:coverage` + `gateways:ownership` por separado).
-   [x] `missingOwner` queda expuesto como deuda no-bloqueante hasta `PR-004` (donde pasa a enforcement 1:1 con mapping central).

Verification:

-   `yarn repo:operation-coverage`
-   `yarn validate`

Verification evidence (2026-02-08):

-   `yarn repo:operation-coverage` -> PASS (`226` non-admin ops, `missingOwner=32` reported as non-blocking debt for `PR-004`)
-   `yarn gateways:ownership` -> PASS (global diagnostics aligned with non-blocking owner debt)
-   `yarn api-mock:schema-validate` -> PASS
-   `yarn api-http:schema-validate` -> PASS
-   `yarn validate` -> PASS (pipeline now uses `repo:operation-coverage`)

### PR-003: Waivers v2 estrictos + migración de formato

Goal:

-   Endurecer metadata de waivers y alinear campos con política de expiración/plan.

Files:

-   `scripts/repo-operation-waivers.ts`
-   `diagnostics/operation-waivers.json`
-   `packages/rankup/especificacion-allowlist-operation-waivers.md`

Acceptance:

-   [x] Waiver inválido si falta `owner|reason|issue|createdAt|expiresAt|plan|scope|severity`.
-   [x] Expiry obligatoria y acotada por política (sin permanentes).
-   [x] Formato legacy (`expiresOn`) rechazado explícitamente.
-   [x] No se permiten duplicados por `operationId + waiverType`.

Verification:

-   `yarn waivers:check`
-   `yarn validate`

Verification evidence (2026-02-08):

-   `yarn waivers:check` -> PASS
-   `yarn waivers:report` -> PASS (`waivers: total=0`)
-   expected-fail probe -> PASS (validator rejects waiver missing `plan` and legacy `expiresOn`)
-   `yarn validate` -> PASS

### PR-004: Mapping central de operaciones de gateway

Goal:

-   Crear registro central `operationId -> gateway mapping` y hacerlo bloqueante.

Files:

-   `apps/rankup-spa/services/api/gateway-mapping.ts`
-   `scripts/repo-operation-coverage.ts`
-   `apps/rankup-spa/services/api/**/*-gateway.ts`

Acceptance:

-   [x] Toda operación no-admin tiene entrada de mapping central.
-   [x] Sincronía obligatoria entre mapping central y `operationOwners`.

Verification:

-   `yarn repo:operation-coverage`
-   `yarn validate`

Verification evidence (2026-02-08):

-   `yarn gateways:ownership` -> PASS (`226` non-admin operations, owners `226/226`, mapping `226/226`)
-   `yarn repo:operation-coverage` -> PASS (`owners=226/226`, `gateway mapping=226/226`, handlers/fixtures `226/226`)
-   `yarn validate` -> PASS

### PR-005: Handlers explícitos (sin fallback implícito)

Goal:

-   Eliminar el fallback automático que “cubre” operaciones sin implementación explícita.

Files:

-   `packages/api-mock/src/core/handlers.ts`
-   `packages/api-mock/src/core/not-implemented-handler.ts` (nuevo)
-   `scripts/repo-operation-coverage.ts`

Acceptance:

-   [x] Cada `operationId` no-admin tiene entrada explícita en `defaultMockHandlers`.
-   [x] Si no está implementada funcionalmente, usa handler `notImplemented` contract-valid.
-   [x] Prohibido fallback genérico implícito.

Verification:

-   `yarn api-mock:coverage`
-   `yarn repo:operation-coverage`
-   `yarn validate`

Verification evidence (2026-02-09):

-   `yarn api-mock:coverage` -> PASS
-   `yarn repo:operation-coverage` -> PASS (`owners=226/226`, `gateway mapping=226/226`, `defaultMockHandlers=226/226`, `fixtures=226/226`)
-   `yarn api-mock:schema-validate` -> PASS
-   `yarn api-http:schema-validate` -> PASS
-   `yarn repo:operation-coverage:report` -> PASS (`nonCanonicalFixturePath=32` queued for `PR-006`)
-   `yarn validate` -> PASS

### PR-006: Ruta canónica de fixtures + enforcement

Goal:

-   Unificar fixtures en `packages/api-mock/src/fixtures/generated/<operationId>.json`.

Files:

-   `packages/api-mock/src/fixtures/generated/*.json`
-   `scripts/repo-operation-coverage.ts`
-   `packages/api-mock/scripts/schema-validate.ts`
-   `scripts/api-http-schema-validate.ts`

Acceptance:

-   [x] Naming/path canónico obligatorio.
-   [x] Cada `operationId` no-admin con fixture canónico único.

Verification:

-   `yarn api-mock:schema-validate`
-   `yarn api-http:schema-validate`
-   `yarn validate`

Verification evidence (2026-02-09):

-   `yarn repo:operation-coverage` -> PASS (`with canonical fixtures: 226/226`)
-   `yarn repo:operation-coverage:report` -> PASS (`fourWayGlobalPass=226/226`, `failureCounts.nonCanonicalFixturePath=0`)
-   `yarn api-mock:schema-validate` -> PASS
-   `yarn api-http:schema-validate` -> PASS
-   `yarn validate` -> PASS

### PR-007: Ratchet duro de operaciones nuevas + no crecimiento de waivers

Goal:

-   Bloquear deuda nueva por operación y bloquear crecimiento de waivers en CI estándar.

Files:

-   `scripts/repo-operation-ratchet.ts` (nuevo)
-   `.github/workflows/ci.yml`
-   `.github/workflows/waiver-override.yml` (nuevo)
-   `package.json`

Acceptance:

-   Nueva operación sin 4-way completo falla CI.
-   Incremento de waivers falla CI estándar.
-   Override solo por flujo explícito de aprobación.

Verification:

-   `yarn repo:operation-ratchet`
-   `yarn validate`

### PR-008: Burn-down final + cierre de lane

Goal:

-   Cerrar gaps globales restantes hasta cobertura 4-way completa no-admin.

Files:

-   Gateways con owners faltantes.
-   Handlers/fixtures faltantes o no explícitos.
-   `diagnostics/operation-waivers.json` (vacío al cierre).
-   Work tracking docs de cierre.

Acceptance:

-   `missingOwner=0`
-   `missingGatewayMapping=0`
-   `missingMockHandler=0`
-   `fallbackMockHandlerForbidden=0`
-   `missingFixture=0`
-   Waivers `0`

Verification:

-   `yarn waivers:check`
-   `yarn repo:operation-coverage`
-   `yarn api-mock:schema-validate`
-   `yarn api-http:schema-validate`
-   `yarn validate`

## Juicious Acceptance Criteria (A-E)

### A) Cobertura global por operación

-   [x] El gate cubre `100%` de no-admin operations del manifest.
-   [x] No existe filtro de baseline parcial en checks bloqueantes.

### B) Integridad de mapping/ownership

-   [x] Mapping central y ownership están 1:1 por `operationId`.
-   [x] No hay owners duplicados o huérfanos.

### C) Mock-first contract-valid real

-   [x] No hay handlers implícitos por fallback.
-   [x] Toda operación tiene fixture canónico y validación mock/http passing.

### D) Waiver governance

-   [x] Waivers con metadata completa + expiración.
-   [ ] Waivers no crecen en CI estándar.
-   [ ] Operaciones nuevas no admiten waivers.

### E) CI + trazabilidad

-   [x] `yarn validate` bloquea regresiones de cobertura global.
-   [x] Reporte de cobertura global se actualiza y se mantiene reproducible.

## Progress Tracking

-   Active PR: `Handoff to WP-008-34 / PR-002`
-   Completed PRs: `PR-001`, `PR-002`, `PR-003`, `PR-004`, `PR-005`, `PR-006`
-   Remaining PRs: `PR-007..PR-008` (tracked as hard-ratchet closure in `WP-008-34`)
-   Blockers: none (as of 2026-02-09)
-   Next lane after `PR-006`: `WP-008-34` (`docs/work/epics/008-engine-production-readiness-hardening.md`)
