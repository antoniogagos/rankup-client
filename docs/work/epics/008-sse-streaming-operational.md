# WP-008-35: SSE Streaming Operational Client (Product-Grade)

## Status

-   Status: In Progress (`PR-001` completed; active `PR-002`)
-   Owner: Rankup maintainers
-   Last updated: 2026-02-09
-   Depends on: ADR 0022, ADR 0068, ADR 0070

## Objective

Hacer de SSE una capacidad operativa de producto (no solo “texto stream”): reconexión explícita con cursor, dedupe determinista, ordering por agregado, y lifecycle/disposal integrado con el sistema de eventos/disposables.

## Current Snapshot (2026-02-09)

-   OpenAPI ya define `streamMyLiveUpdates`, `streamTournamentChatLive` y `streamTournamentLive` como `text/event-stream`.
-   Cliente/gateways aún no ofrecen una API de streaming operacional única para consumo app-level; el contrato histórico arrastra respuestas `string`.
-   Existía lógica de dedupe/reconnect/ordering sólo en `@rankup/testkit` (`FakeEventStreamClient`), sin ser el estándar reutilizable de runtime.
-   La disciplina de lifecycle/disposal estaba disponible (ADR 0022), pero sin un cliente SSE estándar integrado a ese sistema.

## Target State (Definition of Done)

-   Existe un único cliente SSE estándar reusable (`connect({ sinceCursor })`, `onEvent`, `dispose`).
-   Política explícita y testeada: `dedupe(eventId)`, `resume(sinceCursor)`, `ordering(aggregateVersion)`.
-   Los flujos de streaming usan el cliente estándar; no quedan implementaciones paralelas de dedupe/reconnect/ordering.
-   Cobertura P0/engine valida reconexión sin pérdida, hard-stop en dispose y leak-check (`openConnections=0` al terminar cada test).

## Workstreams / PR plan (Required Order)

### PR-001: Standard client baseline + deterministic streaming tests

Goal:

-   Introducir el cliente SSE estándar y mover la lógica de dedupe/ordering/reconnect desde fakes ad-hoc al estándar común.

Acceptance (VSCode-grade):

-   [x] Existe un cliente SSE estándar en `@rankup/base/common/sseClient.ts` con:
	-   `connect({ sinceCursor })`
	-   `onEvent`
	-   `disconnect()/dispose()`
-   [x] El cliente implementa política de:
	-   dedupe por `eventId`
	-   ordering por `aggregateId + aggregateVersion`
	-   cursor de reanudación (`sinceCursor` + cursor interno actualizado al entregar eventos)
-   [x] `@rankup/testkit` consume el cliente estándar (sin lógica duplicada de ordering/dedupe en su fake client).
-   [x] Tests engine/P0 cubren:
	-   dedupe
	-   reconnect con `sinceCursor`
	-   disposal hard-stop
	-   leak check (`openConnections=0`)
-   [x] `yarn engine:test` -> PASS
-   [x] `yarn vitest run -c vitest.p0.config.ts packages/rankup/test/__tests__/p0/streaming/eventStream.reconnect.test.ts` -> PASS
-   [x] `yarn test:p0` -> PASS
-   [x] `yarn validate` -> PASS

Verification evidence (2026-02-09):

-   `yarn engine:test` -> PASS
-   `yarn vitest run -c vitest.p0.config.ts packages/rankup/test/__tests__/p0/streaming/eventStream.reconnect.test.ts` -> PASS
-   `yarn test:p0` -> PASS
-   `yarn validate` -> PASS

### PR-002: Gateway/domain integration real (streaming contracts)

Goal:

-   Integrar el cliente SSE estándar en el flujo app/domain para los endpoints de streaming (`me/live`, `tournaments/*/chat/live`, `tournaments/*/live`) con contrato operacional explícito.

Acceptance (VSCode-grade):

-   [ ] Los gateways/servicios de streaming exponen un contrato operacional (no raw `string`).
-   [ ] Reanudación por cursor y semántica de reconexión quedan explícitas por operación.
-   [ ] No se rompe la disciplina UI -> domain service -> gateway.
-   [ ] `yarn validate` -> PASS.

### PR-003: Reliability hardening (retry/backoff/cursor persistence policy)

Goal:

-   Endurecer comportamiento ante cortes/intermitencia con política declarada de reconexión y persistencia de cursor.

Acceptance (VSCode-grade):

-   [ ] Política de retry/backoff documentada e implementada.
-   [ ] Política de persistencia de cursor (in-memory inicial, persistente opcional) documentada.
-   [ ] Tests negativos de reconnect no introducen duplicados ni huecos al reanudar.
-   [ ] `yarn validate` -> PASS.

### PR-004: Guardrails + closure

Goal:

-   Cerrar la lane con guardrails/ratchets que bloqueen regresión a clientes SSE ad-hoc o sin disposal.

Acceptance (VSCode-grade):

-   [ ] Guardrail/ratchet bloquea implementación SSE paralela fuera del estándar.
-   [ ] Verificación final completa (`engine:test`, `test:p0`, `validate`) en verde.
-   [ ] Tracking estructural completo (`AGENTS`, `CURRENT`, packet, log diario).

## Juicious Acceptance Criteria (A-E)

### A) Single implementation

-   [ ] Existe un único cliente SSE estándar usado por los consumers de streaming.

### B) Resume + dedupe determinista

-   [ ] Reconnect con `sinceCursor` no pierde eventos y no duplica `eventId`.

### C) Ordering estable

-   [ ] Eventos por agregado se entregan en orden de `aggregateVersion`.

### D) Lifecycle seguro

-   [ ] `dispose()` corta entrega de eventos y no deja listeners/conexiones vivas.

### E) Gates monotónicos

-   [ ] Los tests/guardrails sólo endurecen; no se introducen waivers para SSE.

## Verification commands (minimum)

-   `yarn engine:test`
-   `yarn test:p0`
-   `yarn validate`

## Progress Tracking

-   Active PR: `PR-002`
-   Completed PRs: `PR-001`
-   Remaining PRs: `PR-002`, `PR-003`, `PR-004`
-   Blockers: none (as of 2026-02-09)

Maintenance note (2026-05-03): Restored `packages/api/openapi.yaml` after commit `3affae1` accidentally deleted the OpenAPI SOT. This does not advance `PR-002`; it restores the contract baseline required by existing OpenAPI and generated-catalog gates.
