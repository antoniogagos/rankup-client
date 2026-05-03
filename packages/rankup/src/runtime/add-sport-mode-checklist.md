# Checklist: Add New Sport or Game Mode (Engine v1)

## 1. ADR + contract

1. Crear/actualizar ADR con semántica del modo/deporte.
2. Si cambia contrato HTTP, aplicar OpenAPI-first (`packages/api/openapi.yaml`) y regenerar artefactos.
3. Definir invariantes de scoring/tie-break/lock/resultScope.

## 2. Registry

1. Añadir definición en `registry/sports/**` o `registry/gameModes/**`.
2. Definir `rulesetId` como versión inmutable.
3. Registrar defaults (tie-breakers, scoring weights, resultScope, lock policy).

## 3. Algorithms

1. Implementar función pura de scoring en `algorithms/scoring/**`.
2. Implementar comparador de tie-breakers en `algorithms/tieBreakers/**`.
3. Implementar lock rules puras en `algorithms/lockRules/**`.

## 4. Runtime ports/use-cases

1. Verificar que los puertos actuales cubren el nuevo flujo.
2. Si falta IO, añadir nuevo port y adapter in-memory.
3. Integrar el modo/deporte en use-cases sin romper determinismo ni idempotencia.

## 5. Mock parity

1. Añadir fixtures por `operationId` en `packages/api-mock/src/fixtures/**`.
2. Asegurar cobertura y ownership de baseline en CI.
3. Validar `api-mock` y `api-http` schema parity en PASS.

## 6. Tests + observabilidad

1. Añadir golden tests de scoring.
2. Añadir tests de replay/idempotency/concurrency.
3. Verificar publicación de eventos con `correlationId/causationId`.

## 7. Cierre

1. `yarn validate` en PASS.
2. Actualizar `docs/work/CURRENT.md`, épica activa y log diario.
3. Ajustar baseline parity list si el nuevo alcance debe ser bloqueante en CI.
