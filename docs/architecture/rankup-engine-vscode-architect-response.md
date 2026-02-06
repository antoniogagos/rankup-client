# Rankup Engine — Respuesta al análisis de Arquitectura (VS Code‑grade)

Fecha: 2026-02-05

## Respuesta ejecutiva

Aceptamos el diagnóstico central: hoy el repo parece un engine por la cantidad de dominios y wiring, pero el core real (algorithms/registry/runtime) es todavía scaffolded. Para evitar drift entre contratos y ejecución, el foco inmediato debe ser cerrar invariantes P0 y convertirlas en reglas ejecutables, validadores y tests. Esta respuesta confirma qué adoptamos, qué permanece TBD y qué evidencias faltan.

## Confirmaciones sobre el análisis

- Confirmamos que el engine **real** debe vivir en `packages/rankup/src/{domains,algorithms,registry,runtime,shared}` y que UI/HTTP/mock son capas externas.
- Confirmamos que el objetivo es determinismo/replay con reglas versionadas y snapshots auditables.
- Confirmamos que la lógica cross‑domain debe residir en runtime y que los domain services deben ser thin wrappers.
- Confirmamos que OpenAPI es el contrato shipped y que mock‑first sin gate de paridad es un riesgo.

## Respuesta a las recomendaciones A–F (VS Code‑grade)

| Recomendación | Respuesta | Acción | Owner | Fecha objetivo |
| --- | --- | --- | --- | --- |
| A) Engine portable sin decidir backend vs client | Aceptada. El core debe ser portable, sin dependencias browser‑only. | Definir ports de IO (repos, schedule provider, event bus, clock, id generator) en runtime. | Architecture | TBD |
| B) Invariantes como reglas ejecutables | Aceptada. No basta con documentos. | Por cada invariante P0, crear validador, policy y test mínimo. | Domain owners | TBD |
| C) Scoring mínimo cerrado | Aceptada. Sin numeric/tie‑breakers no hay scoring estable. | ADR de ScorePrediction (numeric policy, tie‑breakers, pending policy, reason codes). | Rules + Scoring | TBD |
| D) Provider ACL fijo | Aceptada. Fijar contrato canónico de fixture/result antes del provider. | Definir `CanonicalMatch`/`CanonicalResult` y policy de IDs y correcciones. | Sports + Architecture | TBD |
| E) Gate de paridad mock por operación | Aceptada. | Implementar verificador en CI para mocks vs OpenAPI. | Platform + Architecture | TBD |
| F) Storage model mínimo | Aceptada (baseline). | Definir modelo mínimo: event log + snapshots o CRUD + snapshots; decisión formal en ADR. | Backend + Architecture | TBD |

## Lista P0 priorizada (respuesta por item)

| Item | Estado | Evidencia faltante | Owner | Fecha objetivo |
| --- | --- | --- | --- | --- |
| ENG-28.1 Algoritmo ScorePrediction completo | TBD | Reglas exactas + tie‑breakers + numeric policy | Rules + Scoring | TBD |
| ENG-28.2 Runtime: 3 use‑cases core | TBD | Definir ports y contratos de runtime | Architecture | TBD |
| ENG-5.1 Máquina de estados de torneo | TBD | Diagrama de estados y transiciones | Product + Architecture | TBD |
| ENG-5.4 Roles/permisos | TBD | Matriz roles x acciones | Product + Security | TBD |
| ENG-6.1 Provider sports | TBD | ADR de proveedor o interface canónica | Sports + Backend | TBD |
| ENG-6.4 Policy IDs provider | TBD | Política de mapping interno y estabilidad | Sports + Backend | TBD |
| ENG-10.3 Tie‑breakers | TBD | Lista exacta por mode + orden | Rules + Scoring | TBD |
| ENG-18.1 Storage model | TBD | Decisión backend (event log vs CRUD) | Backend + Architecture | TBD |
| ENG-24.2 Gate paridad mock | TBD | Diseño del verificador en CI | Platform + Architecture | TBD |
| ENG-19.1 Taxonomía de errores | TBD | Catálogo operativo + mapping UX | Architecture + Product | TBD |
| ENG-19.3 Timeout/retry policy | TBD | Política por endpoint (writes + SSE) | Platform | TBD |
| ENG-22.1 Política de sesión | TBD | Refresh/rotation/expiry | Security + Backend | TBD |
| ENG-21.1 Métricas mínimas | TBD | Lista de eventos/metrics obligatorios | Platform + Product | TBD |

## Paquete de ADRs recomendado (adopción)

Adoptamos el paquete sugerido con estos objetivos mínimos:

| ADR propuesto | Objetivo | Owner | Fecha objetivo |
| --- | --- | --- | --- |
| ADR — Engine execution portability | Core portable con ports de IO | Architecture | TBD |
| ADR — Tournament state machine | Estados + transiciones + guardrails | Product + Architecture | TBD |
| ADR — Roles & permissions matrix | Matriz de permisos por rol | Product + Security | TBD |
| ADR — ScorePrediction ruleset | Scoring + locks + tie‑breakers + numeric policy | Rules + Scoring | TBD |
| ADR — Sports provider interface | ACL canónico + ID strategy | Sports + Backend | TBD |
| ADR — Timeline storage strategy | Persistido vs derivado | Scoring + Backend | TBD |
| ADR — Storage model baseline | Event log + snapshots o CRUD + snapshots | Backend + Architecture | TBD |
| ADR — Error taxonomy + retry policy | Taxonomía + timeout/retry | Platform + Architecture | TBD |
| ADR — Mock parity gate | CI gate por operación | Platform + Architecture | TBD |
| ADR — Observability minimum | Eventos/metrics mínimas + correlation | Platform + Product | TBD |

## Definition of Done para “Engine Baseline” (aceptado)

Aceptamos el DoD propuesto como baseline, con una aclaración: requiere cerrar P0 antes de implementar para evitar refactors masivos.

- `algorithms/` con ScorePrediction completo + tests.
- `registry/` con sport `football` y mode `scorePrediction` + referencias de ruleset.
- `runtime/` con 3 casos de uso core basados en ports.
- State machine + roles/permisos documentados y aplicados.
- CI con gate de paridad mock, tests de mapping/gateway y runtime/use‑cases.
- Error model + retry/timeout policy mínimos.
- Observabilidad mínima con correlationId.

## Respuesta al “siguiente entregable” sugerido

Aceptamos preparar un documento **Rankup Engine — Architecture Baseline v1**, pero lo condicionamos a cerrar el bloque P0 (al menos ENG‑28.1/28.2, ENG‑5.1/5.4, ENG‑6.1/6.4, ENG‑10.3, ENG‑18.1, ENG‑24.2). Sin eso, el documento sería especulativo.

## Evidencia utilizada

- `docs/negocio/documento-contratos-dominio-rankup.md`
- `docs/architecture/rankup-engine-domain-partitioning.md`
- `docs/domain/glossary.md`
- `packages/api/openapi.yaml`
- `apps/rankup-spa/lib/composition-root.ts`
- `apps/rankup-spa/lib/app-services.ts`
- `packages/api-mock/src/index.ts`
- Guardrails en `scripts/repo-guardrails.ts` y `scripts/repo-ratchet.ts`
