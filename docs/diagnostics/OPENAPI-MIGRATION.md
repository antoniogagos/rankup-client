# Plan de migracion OpenAPI (single source)

**Objetivo:** migrar la fuente canonical de OpenAPI a `packages/api/openapi.yaml` y eliminar la spec legacy en root, sin compatibilidad temporal ni dual-source.

**Audiencia:** architect manager + maintainers (decisiones de toolchain y contrato).

---

## 1) Estado actual del repo (hechos)

### Especificaciones
- Spec canonical en `packages/api/openapi.yaml` (OpenAPI 3.1.2).
- Root `openapi.yaml` eliminado (sin dual-source).
- Fragmentos por dominio en `packages/api/docs/contrato/**/spec.yaml` (material de diseno; no hay bundler oficial).

### Tooling que hoy usa `packages/api/openapi.yaml`
- `package.json`: `openapi:gen`, `openapi:lint`, `openapi:check`, `openapi:verify`.
- `scripts/repo-ratchet.ts`: valida cambios en `packages/api/openapi.yaml`.
- `packages/api-mock/src/server/openapi-contract.ts`: `DEFAULT_SPEC_PATH` apunta a `packages/api/openapi.yaml`.
- Docs/ADRs/guardrails declaran `packages/api/openapi.yaml` como source of truth:
  - `docs/adr/0006-openapi-source-of-truth.md`
  - `CONSTITUTION.md`, `AGENTS.md`
  - `docs/architecture/api-request-flow.md`, `docs/architecture/mock-server.md`
  - `docs/engineering/mock-server-guide.md`
  - `docs/scope/README.md`, `docs/state/*`
  - `packages/api/docs/README.md`

### Toolchain actual (referencia)
- Codegen: `openapi-typescript@6.7.6`.
- Lint: `@stoplight/spectral-cli@6.13.1`.
- Mock server contract: `swagger-parser` + `ajv` + `openapi-sampler` (ver `@rankup/api-mock`).

---

## 2) Estado destino (decidido)

- **Canonical spec:** `packages/api/openapi.yaml`.
- **Eliminar** `openapi.yaml` en root.
- **Fragmentos** `packages/api/docs/contrato/**/spec.yaml` quedan como documentacion de diseno (no fuente).
- **Single source** sin compatibilidad temporal ni espejos.

---

## 3) Plan de migracion (cut-over directo, ejecutado)

1) **Mover / renombrar**
   - `packages/api/docs/contrato/definitive-spec.yaml` -> `packages/api/openapi.yaml` (hecho).

2) **Actualizar tooling**
   - `openapi:gen` y `openapi:lint` para leer `packages/api/openapi.yaml`.
   - `scripts/repo-ratchet.ts` para observar `packages/api/openapi.yaml`.
   - `packages/api-mock/src/server/openapi-contract.ts` para cambiar `DEFAULT_SPEC_PATH`.

3) **Actualizar docs/ADRs**
   - ADR 0006 (o ADR nueva) para declarar la nueva ruta canonical.
   - `AGENTS.md`, `CONSTITUTION.md`, `docs/architecture/*`, `docs/engineering/*`, `docs/state/*`, `packages/api/docs/README.md`.

4) **Eliminar specs legacy**
   - Borrado `openapi.yaml` en root y `spec-draft.*` fuera de `packages/api/docs/contrato`.

5) **Guardrail estricto**
   - Falla si aparece otra spec fuera de `packages/api/openapi.yaml`.
   - Permitir solo fragmentos en `packages/api/docs/contrato/**/spec.yaml`.

6) **Verificacion**
   - `yarn validate` PASS.
   - `rg` para asegurar no hay specs paralelas fuera de `packages/api/`.

---

## 4) Decisiones confirmadas

1) **OpenAPI version target**
   - Mantener **OpenAPI 3.1.2** como version canonical (tooling compatible).
   - Sin compat shims: la spec canonical y el tooling deben coincidir.

2) **Contrato de fragments**
   - `packages/api/docs/contrato/**/spec.yaml` se mantiene como documentacion de diseno (no fuente).
   - Sin bundler oficial por ahora.

3) **Guardrail**
   - El guardrail **falla** si existe cualquier spec fuera de `packages/api/openapi.yaml`.
   - Se eliminan todas las specs legacy fuera de `packages/api/`.

## 5) Propuesta de decision inmediata

- **Ruta canonical**: `packages/api/openapi.yaml`.
- **Root**: eliminado.
- **Fragmentos**: solo referencia de diseno.
- **Sin compatibilidad temporal** ni duplicados.
