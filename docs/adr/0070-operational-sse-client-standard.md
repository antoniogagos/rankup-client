# ADR 0070: Operational SSE client standard (resume, dedupe, ordering, disposal)

-   Status: Accepted
-   Date: 2026-02-09
-   Owners: Rankup maintainers
-   Scope: `@rankup/base`, `@rankup/testkit`, `packages/rankup/test`, streaming lane

## Context

Rankup expone endpoints SSE críticos (`streamMyLiveUpdates`, `streamTournamentChatLive`, `streamTournamentLive`), pero no tenía un cliente SSE estándar reutilizable a nivel runtime.

La lógica de reconnect/dedupe/ordering estaba localizada en fakes de test, lo que dejaba tres riesgos:

-   flakiness por comportamiento no uniforme entre consumidores
-   memory leaks por lifecycle/disposal no centralizado
-   regresiones silenciosas al duplicar lógica de streaming en cada consumer

ADR 0022 ya define un sistema de `Event` + `Disposable` tipo VS Code; faltaba aterrizar SSE sobre esa base.

## Decision

-   Se introduce un cliente SSE operacional único en `@rankup/base/common/sseClient.ts`.
-   El cliente estándar define interfaz mínima obligatoria:
	-   `connect({ sinceCursor })`
	-   `onEvent`
	-   `disconnect()` y `dispose()`
-   El cliente implementa política determinista por defecto:
	-   dedupe por `eventId`
	-   ordering por `aggregateId + aggregateVersion`
	-   resume por `sinceCursor` y cursor interno actualizado al entregar eventos
-   La implementación se integra al sistema de `Event`/`Disposable` de ADR 0022 (no lifecycle ad-hoc).
-   `@rankup/testkit` debe consumir este cliente estándar para evitar duplicación de política en fakes.

## Constraints

-   Se mantienen invariantes de repo: mock-first (ADR 0007), no UI tests (ADR 0002), TS-only (ADR 0005).
-   No se introducen importaciones de SDK/API en platform/base fuera de sus límites establecidos.
-   La integración app/domain para todos los gateways de streaming se ejecuta en la lane `WP-008-35` por PRs incrementales.

## Consequences

### Positive

-   Comportamiento SSE consistente en reconnect/dedupe/ordering.
-   Lifecycle de streams alineado a `Disposable` (menos riesgo de leaks).
-   Menor deuda al eliminar lógica paralela de streaming en clientes fake.

### Negative / Risks

-   La política estricta por `aggregateVersion` puede retener eventos si faltan versiones previas; requiere contratos de cursor/version coherentes por backend.
-   Se añade responsabilidad de mantenimiento para el cliente SSE compartido.

## Alternatives considered

-   Mantener lógica SSE por-consumer (rechazado: drift y flakiness).
-   Resolver sólo en tests sin cliente runtime compartido (rechazado: no cubre integración real).
-   Usar únicamente `EventSource` nativo por endpoint (rechazado por necesidades de control y política unificada).

## Implementation plan

-   [x] Crear cliente SSE estándar en `@rankup/base/common/sseClient.ts`.
-   [x] Migrar `@rankup/testkit` streaming fake client para consumir el estándar.
-   [x] Añadir cobertura engine/P0 para dedupe/reconnect/dispose/leak-check.
-   [ ] Integrar contratos/gateways app/domain para streaming operacional end-to-end.
-   [ ] Añadir ratchets/guardrails de no-regresión para implementaciones SSE paralelas.

## Verification

-   `yarn engine:test`
-   `yarn vitest run -c vitest.p0.config.ts packages/rankup/test/__tests__/p0/streaming/eventStream.reconnect.test.ts`
-   `yarn validate`
