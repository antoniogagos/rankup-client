## Especificación operativa del allowlist (VSCode-grade)

### Archivo

`diagnostics/operation-waivers.json`

### Esquema de entrada (por waiver)

* `operationId`: string (debe existir en el manifest)
* `waiverType`: enum

  * `missingMockHandler`
  * `missingFixture`
  * `missingOwner`
  * `httpFidelityMissing`
  * `schemaValidationFlaky` *(solo si hay bug en harness; requiere issue link)*
* `reason`: string (obligatorio, 1–3 frases)
* `owner`: string (equipo o persona responsable)
* `issue`: string (ID interno/GitHub, obligatorio)
* `createdAt`: `YYYY-MM-DD`
* `expiresAt`: `YYYY-MM-DD` (obligatorio)
* `plan`: string (obligatorio; acción concreta para remover waiver)
* `scope`: enum

  * `coverage` (handler/owner/fixture)
  * `schema` (schema validate)
  * `http` (http fidelity)
* `severity`: enum `P0|P1|P2` (para reporting)

### Reglas duras en CI

1. **Expiry obligatoria**: waiver expirado = CI falla.
2. **Metadata obligatoria**: `owner|reason|issue|createdAt|expiresAt|plan|scope|severity`.
3. **Budget**: máximo `N` waivers totales (y/o por tipo). Recomendación:

   * `coverage` budget = 0 (una vez migrado)
   * `http` budget = bajo (p.ej. 10) durante transición
4. **No “wildcards”**: solo se permite waiver por `operationId` exacto (nunca por tag/dominio).
5. **No “infinite waivers”**: `expiresAt` máximo 30 días desde `createdAt`.
6. **No formato legacy**: `expiresOn` está prohibido; usar `expiresAt`.
7. **No duplicados**: no se permite repetir `operationId + waiverType`.
8. **Reporting**: el CI imprime:

   * conteo total
   * waivers que expiran en ≤7 días
   * top owners por waivers

### Workflow esperado

* Si algo falla por el gate, el dev:

  1. intenta `scaffold` (handler/fixture/owner),
  2. si no es posible, añade waiver con expiry + issue,
  3. el PR reviewer exige plan de eliminación.

---

## Recomendación adicional (para que no se pudra)

Añadid un comando:

* `yarn waivers:check` (validación de schema del JSON + expiries + existencia de operationId)
* `yarn waivers:report` (tabla por owner/expiry)

Esto evita que la allowlist se convierta en “basurero”.

Si me dices dónde guardáis hoy los diagnostics/ratchet artifacts, puedo adaptar nombres/rutas exactas al repo.
