# Diagnostico - estado actual de la especificacion API

## TL;DR

- `packages/api/openapi.yaml` es la **spec canonical** (OpenAPI 3.1.2).
- `openapi.yaml` en root fue eliminado (sin dual-source).
- Fragmentos en `packages/api/docs/contrato/**/spec.yaml` quedan como documentacion de diseno (no fuente).
- Ver el tree completo del monorepo: `docs/diagnostics/REPO-TREE.md`.

## Lo que existe hoy (archivos)

- `packages/api/openapi.yaml`
  - OpenAPI 3.1.2.
  - Cobertura completa por dominios (auth, tournaments, submissions, social, chat, live, ranked, achievements, admin, etc).
  - Usa `application/problem+json` y el modelo de errores actualizado.
- `packages/api/docs/contrato/**/spec.yaml`
  - Shards por dominio.
  - Base en `packages/api/docs/contrato/meta-config/spec.yaml`.

Nota: no hay un script versionado que reconstruya la definitiva a partir de shards; hoy el merge es manual.

## Tooling y guardrails que hoy apuntan a `packages/api/openapi.yaml`

- `package.json`: `openapi:gen`, `openapi:lint`, `openapi:check`, `openapi:verify`.
- `scripts/repo-ratchet.ts`: valida cambios en `packages/api/openapi.yaml`.
- `packages/api-mock/src/server/openapi-contract.ts`: default spec path es `packages/api/openapi.yaml`.
- Docs y ADRs que declaran `packages/api/openapi.yaml` como source of truth:
  - `docs/adr/0006-openapi-source-of-truth.md`
  - `CONSTITUTION.md`, `AGENTS.md`
  - `docs/architecture/api-request-flow.md`
  - `docs/architecture/mock-server.md`
  - `docs/engineering/mock-server-guide.md`
  - `docs/scope/README.md`, `docs/state/*`
  - `packages/api/docs/README.md`
- `packages/api/docs/SPEC-CONTEXT.md`

## Mock server (estado actual y propuesta)

Lo que hay hoy (implementado):

- Paquete: `@rankup/api-mock` con subpaths `./core` y `./server` (ADR 0018).
- Servidor HTTP: `@rankup/api-mock/server` (Node-only), usa:
  - `@apidevtools/swagger-parser` + `ajv` + `openapi-sampler`.
  - Routing por `operationId` desde la spec.
  - Scenario engine (delay/status/auth/reset) via headers/query.
- Entrada CLI: `yarn workspace @rankup/api-mock dev:server`.
- Smoke: `yarn workspace @rankup/api-mock smoke:scenario`.
- **Spec usada por defecto**: `packages/api/openapi.yaml` (ruta hardcodeada en `packages/api-mock/src/server/openapi-contract.ts`).

Propuesta original (docs/ADR):

- La arquitectura es **contract-first** con `packages/api/openapi.yaml` como fuente unica (ver `docs/architecture/mock-server.md` y ADR 0018).
- El contrato canonical es `packages/api/openapi.yaml`, de modo que server + mocks + types quedan alineados.

Implicacion en el contexto actual:

- El mock server valida y genera contra la spec canonical (`packages/api/openapi.yaml`).

## Implicaciones actuales

- `packages/api/src/generated/openapi.ts` se genera desde `packages/api/openapi.yaml`.
- El mock server y la validacion por schema se apoyan en el contrato canonical.
- Se cumple el principio OpenAPI-first (una sola fuente).

## Decisiones tomadas

1. **Ubicacion canonical de la spec**
   - Canonica en `packages/api/openapi.yaml` (sin root).
2. **Single source of truth**
   - Fragmentos existen solo como documentacion de diseno (no bundler oficial).
3. **Version OpenAPI**
   - OpenAPI 3.1.2 como canonical (tooling compatible; sin compat shims).
4. **Modelo de errores**
   - Problem Details (`application/problem+json`) como modelo canonical.

## Migracion (ejecutada)

1. Canonica en `packages/api/openapi.yaml` (root eliminado).
2. Tooling, docs y guardrails apuntan a la nueva ruta.
3. Specs legacy fuera de `packages/api/` eliminadas.

## Apuntes operativos

- La spec canonical no debe duplicarse en root (sin espejos ni dual-source).
- La canonical vive en `packages/api/openapi.yaml` y debe reflejarse en todos los docs y guardrails.

## Paths de referencia

- `packages/api/openapi.yaml`
- `packages/api/docs/contrato/meta-config/spec.yaml`
- `packages/api-mock/src/server/openapi-contract.ts`
- `package.json` (openapi scripts)
