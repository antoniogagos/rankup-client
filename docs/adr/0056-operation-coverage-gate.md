# ADR‑0056 — Operation Coverage Gate para eliminar drift OpenAPI ↔ Mocks ↔ Gateways

* **Estado:** Aceptado
* **Fecha:** 2026‑02‑05
* **Decisores:** Architecture + Platform + owners de dominios (Rankup Engine)
* **Alcance:** Monorepo Rankup (OpenAPI, `@rankup/api`, `@rankup/api-mock`, gateways en `apps/*`)
* **P0 que resuelve:** Drift OpenAPI ↔ Gateways ↔ Mocks **no “gated” por operación**

---

## 1) Contexto y problema

Rankup opera con:

* **OpenAPI como Source of Truth (SoT)** → genera tipos y el `RankupApiClient` (`@rankup/api`).
* **Mock‑first** → `@rankup/api-mock` es runtime real en dev.
* **Gateways** en `apps/*` adaptan DTO → dominio.
* Guardrails existentes reducen algunos riesgos (casts peligrosos, imports indebidos), pero **no existe un gate determinista por operación** en CI.

### Problema P0

Hoy es posible:

* Añadir/cambiar una operación en OpenAPI y **no actualizar mock**.
* Cambiar schema en OpenAPI y dejar mock/gateway devolviendo/consumiendo shapes que **compilan** pero **no cumplen** el contrato.
* Introducir operaciones “huérfanas” sin owner (nadie responde: “¿quién adapta esto?”).

El resultado es **drift silencioso** y pérdida de confianza en OpenAPI como SoT.

---

## 2) Decisión

### 2.1 OpenAPI = shipped (Opción 1, limpia)

* **Todo endpoint en OpenAPI se considera parte del contrato shipped.**
* Por tanto, **toda operación** debe tener, como mínimo:

1. **Mock handler** en `@rankup/api-mock` (implementado o **stub explícito**).
2. **Owner** explícito en la capa de adapters/gateways (no heurístico).
3. **Fixture mínima** por operación.
4. **Validación de schema** (request y response) basada en OpenAPI.

> Si una operación existe en OpenAPI pero aún no está implementada funcionalmente, el mock debe responder de forma **determinista** con un **NotImplemented** “contract‑valid” (status coherente, payload conforme al schema de error documentado).

### 2.2 Unidad de gobernanza = `operationId`

* `operationId` es la **clave estable** para:

  * coverage,
  * ownership,
  * fixtures,
  * validación de schema,
  * y mensajes accionables en CI.

---

## 3) Principios de diseño (VS Code‑grade)

1. **SoT computable:** OpenAPI no es texto; genera un *manifest* de operaciones verificable.
2. **Gates deterministas:** el CI falla con errores accionables, no con heurísticas frágiles.
3. **No dobles fuentes de verdad:** evitar “listas manuales” que divergen de la implementación.
4. **Ratchet con disciplina:** el estándar puede crecer sin reintroducir drift (coverage no baja).
5. **Escape hatches controladas:** waivers con caducidad + presupuesto (no “apagar CI”).

---

## 4) Invariantes OpenAPI obligatorios

### 4.1 `operationId` y estabilidad

* Toda operación debe tener `operationId`.
* `operationId` debe ser **único**.
* Cambios de `operationId` son **breaking** (requieren ADR/protocolo y actualización simultánea de mock+owner+fixtures).

### 4.2 Respuesta `default` Problem contract‑valid (stubs)

Para permitir stubs sin romper la regla “OpenAPI shipped”, se adopta:

* Un **error schema canónico** (Problem Details) ya existente en el repo.
* **Regla:** toda operación debe declarar `default` con `application/problem+json` y schema `Problem`.

Los stubs `NotImplemented` pueden responder `501`, pero la validación de schema se hace **contra `default`** (no requiere `501` explícito por operación).

---

## 5) Artefacto derivado: Operations Manifest (SoT computable)

### 5.1 Qué es

Se genera desde `packages/api/openapi.yaml`:

* `packages/api/src/generated/operations.ts`
* (opcional) `packages/api/src/generated/operations.json` para tooling no‑TS

Incluye:

* `export type OperationId = ...` (union de todos los `operationId`)
* `export const operations: Record<OperationId, {...}>` con:

  * `method`, `path`
  * `tags`
  * (si se puede) info de schemas de request/response (o punteros para resolverlos)

### 5.2 Cómo se genera

Añadir un paso a la pipeline OpenAPI (junto al codegen existente):

* `yarn openapi:generate`

  * genera types OpenAPI
  * genera `operations.ts/json`

Añadir un check:

* `yarn openapi:ops:check`

  * falla si el manifest no está actualizado (como cualquier codegen serio)

**Propiedad crítica:** cualquier diff en OpenAPI produce un diff explícito por operación.

---

## 6) Gate 1 — Mock coverage por operación (sin doble SoT)

### 6.1 Modelo del mock (handlers only)

En `@rankup/api-mock`, la **fuente de verdad** del coverage es el mapa real de handlers:

* `packages/api-mock/src/core/handlers.ts`

  * `export const defaultMockHandlers = { ... }`

Esto implica:

* **coverage = keys(defaultMockHandlers)** (sin registro duplicado).
* No existe una “lista paralela”; el gate inspecciona directamente los handlers.
* Durante transición, la ausencia de handler se permite **solo** vía waiver `missingMockHandler`.

### 6.2 Contrato mínimo de handler

Definir un contrato común:

* `MockHandler<Request, Response>` (interno del mock) que:

  * recibe request “normalizada” desde el fixture/harness
  * devuelve `{ status, body, headers? }`

**No** se permite `as any` para “cuadrar” tipos.

### 6.3 Script: `api-mock:coverage`

Entrada:

* manifest `OperationId[]`
* `defaultMockHandlers`

Reglas (como OpenAPI = shipped):

* Para **toda** operación del manifest:

  * debe existir handler en `defaultMockHandlers`.
* Handler puede ser:

  * `implemented` (retorna success contract‑valid)
  * `notImplemented` (retorna 501 ProblemDetails contract‑valid)

Salida (errores accionables):

* lista de operationIds faltantes + method/path
* sugerencia de comando `yarn api-mock:scaffold --op <operationId>`

---

## 7) Gate 2 — Ownership de gateways/adapters por operación (sin contaminar dominio)

### 7.1 Decisión de boundary (ajuste clave)

**No** se introducen `operationId` en `packages/rankup/src/domains/**/contracts/**`.

Ownership se declara **en la capa de adapters**, porque `operationId` es un artefacto de transporte/HTTP.

### 7.2 Patrón de ownership (híbrido, colocalizado con el gateway)

**Primario:** si existe `operationOwners`, se usa como fuente explícita.  
**Fallback:** si no existe, el gate **infiera** ownership por AST detectando llamadas `this.apiClient.<operationId>(...)` o `<ident>.apiClient.<operationId>(...)`.

Ejemplo (conceptual):

* `apps/rankup-spa/services/api/sports/sports-catalog-gateway.ts`
	* `export const operationOwners = { listSports: 'sports.catalog.listSports', ... } as const;`

Requisitos:

* `operationOwners` debe ser **data estática** (object literal con string literals) para parseo determinista.
* El gate asocia ownership al **archivo del gateway**; no introduce `operationId` en contratos de dominio.
* Si un gateway implementa múltiples operaciones, el mapping debe cubrirlas.

### 7.3 Script: `gateways:ownership`

Implementación (VS Code‑grade):

* Parseo TS AST (TypeScript compiler API) para extraer `operationOwners` de cada gateway.
* Si `operationOwners` no existe en un archivo, inferencia por AST (`this.apiClient.<operationId>`).
* Construir mapa `OperationId → owner[]`.

Reglas:

* Para **toda** operación del manifest:

  * debe existir **exactamente 1 owner** (por defecto).
* Duplicados (más de 1 owner para el mismo `operationId`) = error (salvo excepción explícita; ver waivers).
* Si un gateway referencia un operationId inexistente = error.

Salida:

* Por cada operación sin owner: method/path + sugerencia “añadir entry a operationOwners en gateway X”.
* Por cada operación duplicada: lista de owners conflictivos.

---

## 8) Gate 3 — Fixtures mínimas por operación + validación de schema (request + response)

### 8.1 Requisito: 1 fixture por operación

Estructura recomendada:

* `packages/api-mock/src/fixtures/<operationId>.json` (o `.ts` si necesitáis funciones)
  Contenido mínimo:

```json
{
  "operationId": "listSports",
  "params": {},
  "query": {},
  "headers": {},
  "body": null,
  "expect": { "status": 200 }
}
```

**Regla:** la ausencia de fixture es **error** salvo waiver explícito `missingFixture`.

Para stubs NotImplemented:

* `expect.status = 501`
* body conforme al ProblemDetails schema (fixture puede incluir ejemplo de body o dejar que el test lo capture, pero para schema validation es mejor incluir un body esperado si validáis exactitud; mínimo, validáis que la respuesta mock cumple schema).

### 8.2 Validación de request

El harness debe validar contra OpenAPI:

* path params (tipos, required)
* query params (tipos, required, enums)
* request body (schema + required)
* content-type si aplica

> Esto cierra el gap típico: “mock responde bien pero el cliente/gateway construye mal la request”.

### 8.3 Validación de response

Para el `status` retornado por el handler:

* validar `body` contra el schema de ese response en OpenAPI (o `default` si lo usáis)
* validar headers si están definidos como contract

### 8.4 Implementación técnica recomendada

* AJV (JSON Schema 2020‑12) + resolver de `$ref` para OpenAPI 3.1
* Compilar validators una vez por suite (cache por operationId/status)

Script/test:

* `yarn api-mock:schema-validate`

  * recorre todas las operaciones del manifest
  * carga fixture por operationId (falla si falta)
  * valida request fixture
  * invoca handler
  * valida response

Salida de errores (debe ser accionable):

* operationId
* method/path
* qué parte falla (`request.query.foo`, `response.body.bar`)
* mensaje AJV + snippet truncado del payload

---

## 9) Gate 3b — HTTP‑fidelity (ratchet, pero con regla para endpoints nuevos)

### 9.1 Por qué existe

Aunque el mock directo valide schema, todavía puede fallar:

* serialización de query params en el `http-client.ts`
* construcción de path params
* headers, content types, etc.

### 9.2 Qué se valida

Para un subconjunto (ratcheted):

* ejecutar la operación pasando por:

  * servidor HTTP mock (in-memory) **o** interceptor HTTP
  * `createRankupApiClient` real (HTTP client)
* validar request/response schema igual que en Gate 3

### 9.3 Ratchet propuesto

* **Regla para nuevas operaciones:** deben incluir **HTTP‑fidelity test** salvo waiver explícito.
* Operaciones existentes: se incorporan progresivamente.
* **Sin fixture** → requiere waiver `httpFidelityMissing` (SSE excluido por defecto).

Comando:

* `yarn api-http:schema-validate` (puede correr solo en CI nightly al principio si es caro, pero el ratchet debe impedir deuda nueva).

---

## 10) Guardrails anti‑escape‑hatch (obligatorio)

### 10.1 Qué se prohíbe

En estos paths:

* `packages/api-mock/**`
* `apps/**/services/api/**` (gateways)

Prohibir:

* `as any`
* `as unknown as ...`
* `as RankupApiClient` (y similares)
* `// @ts-ignore` (salvo whitelist muy controlada)

### 10.2 Enforcement

Añadir a `scripts/repo-guardrails.ts` (o script dedicado):

* chequeo AST (preferible) o regex fuerte con allowlist mínima
* CI falla con:

  * archivo + línea
  * patrón detectado
  * recomendación (usar `satisfies`, ajustar tipos, añadir fixture)

---

## 11) Scaffolding (para reducir fricción y asegurar cumplimiento)

### 11.1 `api-mock:scaffold --op <operationId>`

Genera o actualiza:

* handler stub NotImplemented en `defaultMockHandlers`
* fixture mínima en `fixtures/<operationId>.json`
* valida que la operación tenga `default` con Problem Details (si falta, falla con instrucción)

### 11.2 `gateways:scaffold --op <operationId> --target <gatewayFile>`

No puede auto‑mapear DTO→dominio, pero sí:

* añade entry en `operationOwners`
* crea un método stub en gateway que devuelve NotImplemented
* deja TODOs claros

> El objetivo no es “generar lógica”, sino evitar endpoints huérfanos y drift organizativo.

---

## 12) Waivers (escape hatch controlado, con presupuesto)

### 12.1 Archivo de waivers

* `diagnostics/operation-waivers.json` (spec canonical: `packages/rankup/especificacion-allowlist-operation-waivers.md`)

Entrada:

* `operationId`
* `waiverType`: `missingMockHandler | missingFixture | missingOwner | httpFidelityMissing | schemaValidationFlaky`
* `reason` (obligatorio, 1–3 frases)
* `owner` (persona/equipo responsable)
* `issue` (ID interno/GitHub, obligatorio salvo migración inicial)
* `createdAt` (YYYY‑MM‑DD)
* `expiresOn` (YYYY‑MM‑DD, obligatorio)
* `scope`: `coverage | schema | http`
* `severity`: `P0 | P1 | P2`

Reglas duras:

* **No wildcards**: solo `operationId` exacto (nunca por tag/dominio).
* **Expiry obligatoria**: waiver expirado = CI falla.
* **Budget**: límites por tipo (ver spec; `coverage` debe tender a 0 post‑migración).

### 12.2 Presupuesto (“waiver budget”)

* `maxWaiversTotal = 0` por defecto (recomendado para P0 una vez migrado).
* Durante rollout, permitir temporalmente `maxWaiversTotal = N`, con fecha de reducción.
* Rollout actual: `WAIVERS_MAX_TOTAL=700` en `waivers:check` (se reduce al cerrar la migración).
* CI falla si:

  * waiver expirado
  * waiver sin expiry/reason/owner
  * waivers > presupuesto

---

## 13) Integración en `yarn validate` (orden recomendado)

Insertar en el pipeline (en el punto donde ya se valida OpenAPI):

1. `yarn openapi:verify` (existente)
2. `yarn openapi:generate` (existente + manifest operations)
3. `yarn openapi:ops:check`
4. `yarn waivers:check`
5. `yarn api-mock:coverage`
6. `yarn gateways:ownership`
7. `yarn api-mock:schema-validate`
8. `yarn api-http:schema-validate` (ratcheted; al menos para nuevas ops)
9. `yarn typecheck:workspace` + resto de validate

---

## 14) Workflow de desarrollo (cómo debe verse un PR)

### Añadir o cambiar un endpoint (regla de oro)

Un PR que toca OpenAPI **debe** incluir en el mismo PR:

1. OpenAPI actualizado (`operationId` estable) + `openapi:generate` ejecutado
2. `api-mock:scaffold` (o implementación real en defaultMockHandlers)
3. Fixture mínima creada/actualizada
4. Ownership declarado/actualizado en gateway
5. Gate 3 pasando (request+response schema)
6. Si es endpoint nuevo: Gate 3b (HTTP‑fidelity) pasando o waiver con caducidad

**Si falta cualquiera**, CI falla.

---

## 15) Plan de adopción (rollout) para no bloquear eternamente

> Objetivo: llegar a “coverage total sin waivers” lo antes posible.

### Fase 0 — Preparación

* Asegurar `default` Problem Details en todas las operaciones (regla de lint).
* Implementar generación del manifest.

### Fase 1 — Bootstrap de mock + fixtures

* Ejecutar `api-mock:scaffold` para **todas** las operaciones existentes:

  * crea stubs NotImplemented + fixtures mínimas
* Resultado: coverage completa aunque muchas operaciones respondan 501.

### Fase 2 — Activar gates duros

* Activar `api-mock:coverage`, `gateways:ownership`, `api-mock:schema-validate` como bloqueantes.
* Activar guardrails anti‑escape‑hatch.

### Fase 3 — HTTP‑fidelity ratchet

* Requerir HTTP‑fidelity para operaciones nuevas.
* Migrar progresivamente operaciones críticas (rankings, submissions, auth, live).

### Fase 4 — Reducir stubs NotImplemented

* Por dominio/capability, ir sustituyendo 501 por implementaciones reales + fixtures más ricas.
* Reducir waiver budget a 0.

---

## 16) Consecuencias

### Positivas

* Drift se vuelve **imposible** sin romper CI.
* Ownership explícito por operación → menos “nadie sabe dónde tocar”.
* Mock-first gana credibilidad (datos contract‑valid).
* OpenAPI recupera su rol de SoT real y verificable.
* Se habilita escalado a 100s de endpoints sin degradación.

### Negativas / costes

* Inversión en tooling (manifest, harness AJV, scripts).
* Disciplina: cada cambio OpenAPI arrastra cambios en mock/fixtures/owners.
* Curva de aprendizaje para fixtures y schema validation.
* Si el harness de schema se implementa mal, puede generar fricción (por eso hay ratchet y mensajes accionables).

---

## 17) Definition of Done (P0 cerrado)

Se considera P0 resuelto cuando:

1. **Manifest** existe y se verifica en CI (`openapi:ops:check`).
2. Para **toda** operación en OpenAPI:

   * existe handler en `defaultMockHandlers` ✅
   * existe fixture mínima ✅
   * existe owner único ✅
3. `api-mock:schema-validate` valida **request + response** para 100% de operaciones ✅
4. Para operaciones nuevas: existe test **HTTP‑fidelity** o waiver temporal ✅
5. Guardrails bloquean `any`/casts/ts-ignore en `api-mock` y gateways ✅
6. Waivers (si existen) están bajo presupuesto y con expiry; objetivo final = 0 ✅

---

## Apéndice A — Errores de CI esperados (formato recomendado)

* **Missing mock handler**

  * `Missing mock handler for operationId "tournaments.core.createTournament" (POST /tournaments)`
  * `Fix: yarn api-mock:scaffold --op tournaments.core.createTournament`

* **Missing fixture**

  * `Missing fixture: packages/api-mock/src/fixtures/tournaments.core.createTournament.json`
  * `Fix: yarn api-mock:scaffold --op ...`

* **Schema mismatch**

  * `Schema validation failed (response 200) for operationId "...": missing required property "tournamentId" at /body/...`

* **Missing owner**

  * `No owner declared for operationId "..." (GET /...)`
  * `Fix: add to operationOwners export in gateway file ...`

---

## Apéndice B — Nota de coherencia con “OpenAPI shipped”

Bajo esta ADR, OpenAPI no contiene endpoints “roadmap”. Si un endpoint devuelve 501, eso **es comportamiento shipped** explícito (documentado), no un endpoint “imaginario”. Si un endpoint es realmente futuro (no existe), no debe entrar en OpenAPI.
