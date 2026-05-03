# Operation Parity Baseline (Epic 010)

Fecha: 2026-02-06

Estado: Transicional (actualizado 2026-02-08 por `WP-008-32` `PR-001`).

## Scope

La baseline de paridad por `operationId` vive en:

- `diagnostics/parity-baseline-operations.json`
- `diagnostics/parity-baseline-problem-codes.json` (perfil `status + Problem.code` por operación)

Solo ese conjunto se considera bloqueante en CI para gates de:

- `api-mock:coverage`
- `gateways:ownership`
- `api-mock:schema-validate`
- `api-http:schema-validate`

## Transition Note (2026-02-08)

La baseline parcial ya no representa el estado objetivo del repositorio.

Objetivo aprobado:

- cobertura 4-way global para todas las operaciones no-admin del manifest OpenAPI.

Plan de ejecución canónico:

- `docs/work/epics/008-operation-coverage-4way-global.md`

Inventario global reproducible:

- `diagnostics/operation-coverage-global-report.json`

Snapshot PR-001:

- non-admin operations: `226`
- baseline operations: `39`
- global 4-way pass: `0/226`
- baseline 4-way pass: `0/39`

La baseline sigue existiendo temporalmente como mecanismo de rollout histórico mientras se completa la migración global.

Nota de ejecución `PR-002` (2026-02-08):

- `yarn validate` ya usa `yarn repo:operation-coverage` como gate único global para coverage (sin filtro baseline en ese gate).
- `api-mock:schema-validate` y `api-http:schema-validate` mantienen scope baseline durante la transición hasta `WP-008-32` `PR-006`.

Nota de ejecución `PR-003` (2026-02-08):

- `operation-waivers` usa schema v2 estricto (`expiresAt` + `plan` obligatorios, `expiresOn` prohibido, TTL máximo 30 días, sin duplicados por `operationId+waiverType`).

Nota de ejecución `PR-004` (2026-02-08):

- `gatewayOperationMapping` quedó centralizado y bloqueante en `apps/rankup-spa/services/api/gateway-mapping.ts`.
- El gate global ya exige paridad 1:1 mapping-owner (`owners=226/226`, `gateway mapping=226/226`) sin deuda no-bloqueante de `missingOwner`.

## Contract checks

Para cada `operationId` de baseline, los gates exigen:

1. `status` response dentro del contrato OpenAPI.
2. `content-type` compatible con la respuesta elegida.
3. `body` válido contra el schema de respuesta del `status`.
4. Headers funcionales mínimos:
   - `x-operation-id` presente en respuestas del mock contract server.
   - `etag` cuando la operación devuelve recursos versionados y el handler lo emite.

## Baseline maintenance rule

Al añadir una operación al baseline:

1. Añadir `operationId` a `diagnostics/parity-baseline-operations.json`.
2. Añadir mapeo `operationId -> profile` en `diagnostics/parity-baseline-problem-codes.json`.
3. Si hace falta, crear/actualizar profile de errores (`status + Problem.code`) en ese mismo archivo.
4. Reflejar el cambio en `docs/quality/operation-problem-catalog-baseline.md`.
5. Asegurar owner explícito en gateway (`operationOwners`) o método `apiClient.<operationId>` detectable por AST.
6. Añadir fixture contract-valid.
7. Verificar `api-mock` y `api-http` schema validation en PASS.

No se permiten waivers en baseline (`diagnostics/operation-waivers.json` debe permanecer vacío).
