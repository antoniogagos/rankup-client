## 0) Hechos verificables extraídos del documento (solo lo que el texto afirma)

* **Arquitectura en capas declarada y trazada**: `UI → AppServices → Domain Services → Gateways → RankupApiClient → HTTP/Mock` (con “composition root” como único punto de selección mock/real).
* **OpenAPI-first**: `packages/api/openapi.yaml` es la “fuente de verdad” (OpenAPI 3.1.2); `openapi-typescript` genera `packages/api/src/generated/openapi.ts`; `packages/api/src/types.ts` re-exporta schemas; `packages/api/src/client.ts` define el `RankupApiClient`.
* **Mock-first runtime**: `@rankup/api-mock` es runtime por defecto en dev; se declara “paridad mock obligatoria para endpoints no admin”; mocks en `packages/api-mock/src/index.ts`.
* **Reglas de dependencia declaradas**:

  * UI consume **solo** contracts de dominios (`packages/rankup/src/domains/**/contracts`) o shared types, **nunca** runtime services ni `@rankup/api`.
  * Dominios no importan `@rankup/api` ni código de app.
  * Gateways mapean DTO → dominio explícitamente y se prohíbe `...api*` y `as Domain.*`.
  * Composition root es el único punto de wiring + selección mock/real.
* **DI model**: `ServiceCollection`/`InstantiationService` en `@rankup/platform`; `apps/rankup-spa/lib/composition-root.ts` registra gateways e invoca `register*DomainServices`.
* **Guardrails**: scripts en `scripts/repo-guardrails.ts` (y otros) imponen reglas (imports en una línea, sin líneas en blanco, reglas Lit, guardrail de gateways, ADR/work log, ratchet).
* **Pipeline de validación declarado**: `yarn validate` ejecuta `repo:guardrails`, `openapi:verify`, `typecheck:workspace`, `yarn workspace @rankup/app validate`, `yarn clean`.
* **Testing policy explícita**: “**No UI tests**; solo tests de algoritmos puros cuando existan.”
* **Cobertura de dominios/capabilities**: inventario amplio con muchos “Implemented”; pero hay **placeholders** (p.ej. `tournaments.preview`, `scoring.results`, `scoring.timeline`, `verified.tournaments`, `admin.*`) y capas engine **scaffolded** (`algorithms/registry/runtime`).

---

## A) Executive summary (12 bullets)

### 3 fortalezas reales

* **[Hecho]** OpenAPI-first con generación tipada (`openapi-typescript`) y comandos de verificación (`openapi:lint`, `openapi:check`, `openapi:verify`) que establecen un contrato canónico y mecánicas de cambio.
* **[Hecho]** Mock-first operacional: el producto debe correr sin backend; el mock (`@rankup/api-mock`) es runtime real en dev y hay una regla explícita de paridad para endpoints no admin.
* **[Hecho]** Layering + reglas de dependencia explícitas (UI solo contracts/shared; dominios no importan `@rankup/api`; composition root único) y guardrails automatizados para limitar acoplamientos.

### 3 riesgos críticos

* **[Hecho + Inferencia]** Se reconoce riesgo de drift OpenAPI ↔ gateways ↔ mocks, pero el documento no describe un **mecanismo determinista de cobertura/pari­dad en CI** por operación ⇒ alta probabilidad de roturas silenciosas.
* **[Hecho + Inferencia]** Superficie de dominios “Implemented” grande mientras `algorithms/registry/runtime` están scaffolded ⇒ riesgo de que “la forma del backend (DTO/HTTP)” cristalice decisiones de dominio antes de definir invariantes del engine.
* **[Hecho]** Estrategia de tests declarada excluye UI tests y limita tests a algoritmos “cuando existan” ⇒ riesgo P0 de regresiones en wiring, mapeos, permisos y flujos cross-domain.

### 3 decisiones que faltan

* **[Hecho]** No hay definición clara de **ownership de orquestación cross-domain** (qué vive en `runtime` vs domain services vs app-services) y `runtime` está scaffolded.
* **[Hecho]** No se especifica **contrato de errores/resiliencia** (retries, timeouts, cancelación, backoff SSE, “offline semantics”), por lo que la consistencia de UX/diagnóstico es incierta.
* **[Hecho]** No se define el **modelo de seguridad/permisos** end-to-end (almacenamiento/refresh de auth, gating de `admin.*`, enforcement/trustSafety en cliente).

### 3 next actions inmediatas

* **[Recomendación]** Implementar un **“operation coverage gate”**: por cada operación OpenAPI, CI debe exigir (a) implementación en mock y (b) adaptación (gateway/mapping) o stub explícito “NotImplemented” con tracking.
* **[Recomendación]** Establecer un **mínimo de tests por capa**: mapper tests de gateways + contract tests de domain services con fake gateway + 2–3 smoke tests de AppServices con composition root (mock) para flujos críticos.
* **[Recomendación]** Escribir un ADR de **orquestación** (runtime/use-cases) y mover **un** flujo real cross-domain (p.ej. “join tournament + fetch rankings + subscribe updates”) fuera de UI hacia esa capa.

---

## B) Scorecard VSCODE-grade (0–5)

> Escala: 0 = inexistente, 3 = razonable pero incompleto, 5 = excelente y endurecido.

* **Arquitectura modular / boundaries — 4/5**
  El layering está explícito y hay reglas claras (UI→AppServices→Domain→Gateways).
  Falta evidencia de enforcement “hard” (por ejemplo, límites a nivel de packaging/exports/proyectos TS) y `runtime` aún no existe operativamente.

* **Evolvability / extensibilidad — 3/5**
  DDD-ish por bounded contexts y OpenAPI-first ayudan a crecer.
  Pero faltan invariantes del engine (`algorithms/registry/runtime` scaffolded) y decisiones de orquestación; riesgo de extensibilidad “por copia” a medida que crezcan modos/deportes.

* **Calidad de APIs y contratos — 4/5**
  OpenAPI como SoT + `RankupApiClient` tipado es buen fundamento.
  No hay contrato común de errores, paginación, caching, idempotencia y streaming; ahí suele morir la estabilidad real de APIs internas.

* **Testing strategy y testability — 1/5**
  El documento explícitamente descarta UI tests y solo contempla tests de algoritmos puros “cuando existan”.
  No se describe estrategia de integración (gateways↔mock, app-services↔domain, SSE), lo que bloquea refactors seguros.

* **Performance y escalabilidad — 2/5**
  Se mencionan SSE/streaming y múltiples dominios, pero no hay budgets, caching, batching, ni política de “N+1 calls”.
  Con mock-first es fácil ocultar problemas de latencia/overfetch.

* **Observabilidad / diagnósticos — 1/5**
  No se describe telemetría, logging estructurado, correlación de requests, profiling, ni reportes de errores.
  Sin esto, el sistema será difícil de operar cuando salgan de dev/mock.

* **Accesibilidad / UX engineering — 1/5**
  No hay mención de a11y, keyboard nav, focus management, ARIA, ni performance UX.
  Si la UI es Lit (se sugiere por guardrails), aún falta la disciplina de accesibilidad.

* **Seguridad y permisos — 2/5**
  Hay dominio `trustSafety` implementado, pero el modelo de auth/permisos no está especificado.
  `admin.*` existe en OpenAPI pero es placeholder; riesgo de “overlay” inseguro por defecto.

* **DX (contribución, tooling, CI) — 4/5**
  `yarn validate`, guardrails, ratchet y protocolo OpenAPI dan disciplina.
  Riesgo: guardrails de estilo muy específicos sin auto-fix pueden friccionar; faltan pautas de ownership y plantillas para nuevos dominios/capabilities.

* **Complejidad accidental (duplicaciones, acoplamientos) — 3/5**
  Separación por dominios reduce acoplamiento, pero hay muchas carpetas `shared` por dominio + `src/shared` global.
  Sin “shared-kernel governance” es fácil crear duplicación semántica (IDs/enums) y deuda de mapeo.

---

## C) Hallazgos (priorizados)

### 1) P0 — Drift OpenAPI ↔ Gateways ↔ Mocks no “gated” por operación

* **Severidad:** P0
* **Síntoma (hecho):** El documento identifica “alto riesgo de drift” y declara paridad mock obligatoria, pero no especifica un **mecanismo automatizado de cobertura por operación** que falle CI si falta implementación/mapping.
* **Impacto (inferencia):** Features “funcionan en mock” pero rompen con backend real; mapeos incompletos pasan code review; coste alto de estabilización.
* **Causa raíz (inferencia):** Tres artefactos separados (OpenAPI, gateways, mock) evolucionan en paralelo con enforcement parcial (proceso/guardrails).
* **Recomendación (concreta):**

  1. Generar desde OpenAPI un **manifest de operaciones** (por `operationId` o método+path).
  2. En CI, verificar:

     * `@rankup/api-mock` implementa todas las operaciones no-admin declaradas.
     * Existe un gateway adapter “owner” por operación (o un stub explícito).
  3. Añadir tests que validen **schema con datos reales**: responses del mock deben validar contra OpenAPI (runtime validation en test).
* **Trade-offs:**

  * (+) Elimina drift silencioso; reduce regresiones.
  * (–) Más codegen/CI; requiere disciplina en `operationId`.
* **Criterio de aceptación:**

  * CI falla si una operación nueva en OpenAPI no tiene mock + mapping/stub.
  * Suite de tests valida que cada response del mock es schema-valid (al menos en rutas críticas).

---

### 2) P0 — Estrategia de tests insuficiente para un sistema con mappers + DI + streaming

* **Severidad:** P0
* **Síntoma (hecho):** “No UI tests; solo tests de algoritmos puros cuando existan.”
* **Impacto (inferencia):**

  * Refactors de boundaries/DI/mappers se vuelven peligrosos.
  * Bugs de integración (DTO↔domain, auth, SSE reconnection) se descubren tarde y de forma no determinista.
* **Causa raíz (inferencia):** Política de tests prioriza velocidad inicial, pero el sistema ya tiene suficiente infraestructura (OpenAPI, gateways, DI) como para necesitar “safety net”.
* **Recomendación:** Introducir una pirámide mínima y rápida:

  * **Gateway mapper tests** (sin DOM): dado DTO fixture → domain model expected.
  * **Domain service contract tests**: domain service + fake gateway (in-memory) verificando invariantes (paginación, filtros, errores).
  * **AppServices smoke tests**: instanciar composition root con mock y ejecutar 2–3 flujos críticos.
  * (Opcional, cuando haya UI estable) 1–2 E2E tests “de humo” (Playwright) para wiring de rutas principales.
* **Trade-offs:**

  * (+) Permite evolucionar arquitectura sin miedo; reduce coste de bugfix.
  * (–) Coste inicial de test harness y fixtures.
* **Criterio de aceptación:**

  * Cada gateway tiene al menos 1 test de mapping con fixtures.
  * Cada dominio “core” tiene contract tests básicos.
  * Un workflow CI corre estos tests en <N minutos y bloquea merges en fallos.

---

### 3) P0 — OpenAPI declara superficies sin dominio/mocks (SoT inconsistente)

* **Severidad:** P0
* **Síntoma (hecho):** Existen tags/endpoints para `tournaments.results`, `scoring.timeline`, `tournaments.preview`, `verified.tournaments`, `admin.*` pero aparecen como Placeholder/No mock parity o incluso “N/A (no capability folder)”.
* **Impacto (inferencia):**

  * Se rompe la promesa “OpenAPI-first como fuente de verdad” porque el repositorio no refleja ese truth en runtime mock ni en dominios.
  * Clientes internos consumen endpoints “fantasma” o divergen en expectativas.
* **Causa raíz (inferencia):** OpenAPI está actuando parcialmente como roadmap, sin mecanismo para distinguir “contract shipped” vs “contract planned”.
* **Recomendación (dos opciones, elegir una):**

  * **Opción A (strict SoT):** No añadir endpoints a OpenAPI hasta tener al menos stub compilable + mock con respuesta mínima schema-valid.
  * **Opción B (OpenAPI como roadmap, pero explícito):** Mantener endpoints, pero marcarlos como `x-rankup-status: planned` y hacer que el tooling/CI exija stubs “NotImplemented” + tracking (y que la UI no los use).
* **Trade-offs:**

  * A: (+) contrato = realidad; (–) menos capacidad de planificar vía OpenAPI.
  * B: (+) OpenAPI como planificación; (–) más complejidad de tooling y riesgo si se usa por error.
* **Criterio de aceptación:**

  * No existen operaciones “sin owner” (dominio+gateway+mock/stub).
  * El estado (implemented/planned) es visible y verificado en CI.

---

### 4) P1 — Ownership de orquestación cross-domain está indefinido (runtime scaffolded)

* **Severidad:** P1
* **Síntoma (hecho):** `packages/rankup/src/runtime` está scaffolded; el documento no define qué lógica cross-domain vivirá ahí vs en domain services o en AppServices/UI.
* **Impacto (inferencia):** La lógica de negocio que cruza dominios (p.ej. tournament lifecycle + invites + ranking + live updates) tenderá a filtrarse a UI/AppServices, reduciendo testabilidad y reusabilidad.
* **Causa raíz (inferencia):** Falta una “application layer” explícita (use-cases) y ADR de responsabilidades.
* **Recomendación:**

  * Definir una capa **UseCases** (runtime) con contratos explícitos (“ports” hacia dominios).
  * Mantener domain services como lógica intra-dominio; runtime orquesta.
  * AppServices se limita a exponer use-cases a UI (sin lógica).
* **Trade-offs:**

  * (+) Reduce lógica en UI; aumenta reusabilidad.
  * (–) Puede parecer “extra” en fases tempranas si solo hay una UI.
* **Criterio de aceptación:**

  * ADR: “Dónde vive la orquestación” + ejemplos.
  * Al menos un flujo real implementado como use-case consumido por AppServices.

---

### 5) P1 — Contrato común de errores/resiliencia no está definido

* **Severidad:** P1
* **Síntoma (hecho):** No se describe un error model estándar para `RankupApiClient`/gateways/domain services (tipos de error, retries, timeouts, cancelación).
* **Impacto (inferencia):**

  * Inconsistencia en UX (“a veces toast, a veces silencio”).
  * Retrys ad-hoc pueden duplicar submissions o romper idempotencia.
  * SSE/streaming puede quedar “colgado” sin estrategia de reconexión.
* **Causa raíz (inferencia):** Foco en contratos de datos (schemas) sin contratos de comportamiento.
* **Recomendación:**

  * Introducir tipos de error compartidos (`NetworkError`, `AuthError`, `RateLimitError`, `ValidationError`, `NotImplementedError`, etc.).
  * Definir políticas: retry/backoff por clase de error, timeouts por endpoint, cancelación (AbortController), y reconexión SSE.
  * Exigir que mocks simulen estas clases (incluyendo latencia y errores controlados).
* **Trade-offs:**

  * (+) Consistencia y diagnósticos mejores.
  * (–) Mayor “ceremony” y necesidad de documentación.
* **Criterio de aceptación:**

  * Un `errors.ts` compartido con contract estable.
  * Gateways convierten errores HTTP/mock a estos tipos.
  * Tests verifican mapping y políticas (sin red real).

---

### 6) P1 — Observabilidad/telemetría no está especificada (operabilidad baja)

* **Severidad:** P1
* **Síntoma (hecho):** El documento no define logging/telemetría/perf markers/correlation IDs.
* **Impacto (inferencia):** Debugging de issues reales (ranking incorrecto, drift, SSE) será lento; no habrá señales para priorizar rendimiento o fiabilidad.
* **Causa raíz (inferencia):** Early-stage y enfoque en wiring/contratos.
* **Recomendación:**

  * Definir un **TelemetryService** (en `@rankup/platform` o `packages/rankup/src/shared`) con eventos y propiedades permitidas (privacy).
  * Correlation IDs por request/stream y propagación a logs.
  * Añadir “performance spans” para llamadas críticas (rankings, submissions, live updates).
* **Trade-offs:**

  * (+) Operabilidad y decisiones basadas en datos.
  * (–) Trabajo adicional; cuidado con privacidad.
* **Criterio de aceptación:**

  * Lista de eventos mínimos (login, fetch tournament, submit prediction, receive live update, fetch rankings).
  * En code: emisión de eventos + tests que no rompan el contrato de telemetría.

---

### 7) P1 — Modelo de seguridad/permisos no está endurecido (especialmente `admin.*`)

* **Severidad:** P1
* **Síntoma (hecho):** Existen dominios de identidad (`accounts/auth`) y trustSafety, y endpoints `admin.*`, pero no hay especificación de: storage/refresh tokens, permisos, gating de UI, ni separación staff-only.
* **Impacto (inferencia):** Riesgo de implementar defaults inseguros (tokens en storage incorrecto, endpoints admin accesibles, enforcement inconsistente).
* **Causa raíz (inferencia):** El doc es arquitectura/wiring; seguridad no se trató como “first-class”.
* **Recomendación:**

  * ADR de seguridad: modelo de sesión, refresh, almacenamiento, CSRF/CORS (si aplica), y “capability gating”.
  * Introducir `PermissionService`/`FeatureGateService` consumible por UI y AppServices.
  * Asegurar que `admin.*` está físicamente separado (paquete/entrypoint) y no llega al build “no-staff” si existe esa distribución.
* **Trade-offs:**

  * (+) Evita rework y vulnerabilidades.
  * (–) Diseño adicional y cambios en wiring.
* **Criterio de aceptación:**

  * Documentación + implementación mínima (guards) + tests que verifiquen que UI no consume `admin.*` en builds no autorizados.

---

### 8) P1 — Proliferación de `shared` por dominio sin “shared-kernel policy”

* **Severidad:** P1
* **Síntoma (hecho):** Hay `shared/models` en múltiples dominios (IDs, enums, user summaries) y también un `src/shared`.
* **Impacto (inferencia):** Duplicación semántica, conversiones redundantes, y tipos “casi iguales” que rompen boundaries con el tiempo.
* **Causa raíz (inferencia):** Intención correcta de evitar acoplamiento, pero sin gobernanza de qué es “kernel” vs “local shared”.
* **Recomendación:**

  * Definir explícitamente un **Shared Kernel mínimo** (IDs base, tipos “summary” canónicos, utilidades de validación).
  * Prohibir que “shared kernel” crezca sin ADR.
  * Mantener `domains/*/shared` solo para tipos estrictamente del dominio (no re-export de conceptos globales).
* **Trade-offs:**

  * (+) Reduce duplicación y fricción de imports.
  * (–) Riesgo de crear un “god shared”; requiere disciplina.
* **Criterio de aceptación:**

  * Documento “Shared Kernel policy”.
  * Lint/enforcement: los dominios no duplican IDs globales; se detectan duplicaciones.

---

### 9) P1 — Guardrails mezclan invariantes semánticos con reglas de estilo (fricción DX)

* **Severidad:** P1
* **Síntoma (hecho):** Guardrails incluyen reglas de estilo muy específicas (imports en una línea, sin líneas en blanco) además de invariantes más valiosos (mapeo gateways).
* **Impacto (inferencia):** Aumenta fricción, reduce contribución, y se invierte tiempo en “forma” en vez de “invariante”; además, scripts custom tienden a ser menos integrables en editor.
* **Causa raíz (inferencia):** Preferencia por enforcement custom vs tooling estándar auto-fix.
* **Recomendación:**

  * Migrar estilo a ESLint/formatter con **auto-fix**.
  * Mantener scripts solo para invariantes no expresables (p.ej. “no `as Domain.*` en gateways”).
  * Añadir `yarn lint --fix` y pre-commit opcional.
* **Trade-offs:**

  * (+) Mejor DX y consistencia; menos “CI ping-pong”.
  * (–) Trabajo de migración y calibración de reglas.
* **Criterio de aceptación:**

  * > 80–90% de fallos de guardrails son auto-fixables localmente.
  * CI se centra en invariantes y correctness, no en micro-formato.

---

### 10) P2 — Ubicación de gateways en `apps/*` sin decisión explícita de multi-cliente

* **Severidad:** P2
* **Síntoma (hecho):** Gateways y mappers están en `apps/rankup-spa/services/api/**`.
* **Impacto (inferencia):** Si aparece otro cliente (otra app, SSR, móvil), se duplicarán adapters/mappers o se forzará una migración grande.
* **Causa raíz (inferencia):** Optimización por la SPA actual sin ADR de futuro.
* **Recomendación:** Decidir explícitamente (ADR):

  * **Si SPA-only**: mantener como está (simple).
  * **Si multi-client probable**: extraer adapters a `packages/adapters-http` y `packages/adapters-mock` y compartir.
* **Trade-offs:**

  * (+) Claridad y evita refactor sorpresa.
  * (–) Extraer demasiado pronto puede ser sobre-ingeniería.
* **Criterio de aceptación:**

  * ADR con decisión y criterios.
  * Si se extrae: migrar 1–2 gateways “piloto” para validar el modelo.

---

### 11) P2 — Versioning/deprecation policy para OpenAPI + paquetes no está descrita

* **Severidad:** P2
* **Síntoma (hecho):** Hay protocolo de cambio OpenAPI, pero no se describe estrategia de compatibilidad, deprecaciones o versionado semántico de paquetes/contratos internos.
* **Impacto (inferencia):** Cambios “pequeños” rompen consumidores; el monorepo puede ocultar roturas hasta que exista un release pipeline real.
* **Causa raíz (inferencia):** Falta de “contract lifecycle management”.
* **Recomendación:**

  * Definir política de breaking changes (deprecation window, `@deprecated`, version bumps).
  * Añadir detección de breaking changes (diff de OpenAPI) en CI.
* **Trade-offs:**

  * (+) Contratos estables y previsibles.
  * (–) Overhead de proceso.
* **Criterio de aceptación:**

  * Pipeline detecta breaking changes y exige aprobación explícita.
  * Política documentada aplicada en 1–2 cambios reales.

---

### 12) P2 — Fidelidad del mock: paridad de forma ≠ paridad de comportamiento

* **Severidad:** P2
* **Síntoma (hecho):** Mock-first es default; se exige paridad para endpoints no admin, pero no se define paridad de **semántica** (latencia, errores, validación, paginación, ordering).
* **Impacto (inferencia):** La UI “funciona” con mocks pero falla al primer contacto con un backend real; resiliencia y UX se diseñan con supuestos falsos.
* **Causa raíz (inferencia):** Mocks manuales tienden a ser “happy-path engines”.
* **Recomendación:**

  * Fixtures deterministas + validación contra schemas en tests.
  * Inyección controlada de latencia/errores (feature flags) para probar resiliencia.
  * Definir “semantics checklist” por endpoint (paginación, sorting, constraints).
* **Trade-offs:**

  * (+) Menos sorpresas y mejor calidad.
  * (–) Mocks se vuelven más “caros” de mantener.
* **Criterio de aceptación:**

  * Cada operación crítica tiene fixtures + tests de schema + al menos un caso de error simulado.
  * Existe un checklist de semántica aplicado en PRs.

---

## D) Propuesta de reestructuración (aplica: sí, pero acotada y con guardrails “de VS Code”)

### 1) Estructura sugerida (mínimo cambio, máximo enforcement)

**Objetivo:** reforzar boundaries **por construcción** (exports/TS project refs) y clarificar ownership de orquestación.

**Opción base (mantener gateways en app, pero endurecer contracts):**

```
packages/
  rankup/
    src/
      domains/
        <domain>/
          <capability>/
            contracts/   # public: ports + request/response types + domain-facing contracts
            models/      # internal domain model
            services/    # internal domain logic
            validation/  # internal validators
          shared/        # domain-only shared
      runtime/           # application/use-cases cross-domain (dejar de ser scaffold)
      shared/            # shared-kernel mínimo (IDs base, Result/Error, telemetry contracts)
  api/
  api-mock/
apps/
  rankup-spa/
    lib/
      composition-root.ts
      app-services.ts
    services/
      api/
        <domain>/
          *-gateway.ts
          mappers/
```

**Endurecimiento VS Code-grade (sin reestructurar todo):**

* **`packages/rankup/package.json` con `exports`**: exportar solo `domains/**/contracts` y `shared` (y quizá `runtime` cuando exista). **No exportar** `services` ni `models`.
  Esto reduce “deep imports” desde UI aunque estén en monorepo.
* **TypeScript project references** por capa (o al menos por `rankup`, `api`, `api-mock`, `app`).
* **ESLint boundaries**: reglas declarativas (“UI no importa `packages/rankup/src/domains/**/services`”, etc.) como enforcement estable.

> **Cuándo NO usar este endurecimiento:** si el repositorio todavía está en exploración extrema y el coste de mover exports/refs bloquea iteración diaria. En ese caso, posponer 2–3 semanas, pero fijar fecha.

### 2) Contratos entre módulos (interfaces/ports)

Ya existe el patrón `contracts/*Gateway.ts`. Endurecerlo:

* Unificar naming: `XGateway` = **port** que domain service consume.
* Definir contratos comunes en `packages/rankup/src/shared`:

  * `Result<T, E>` o `Either` (si el equipo lo tolera).
  * `DomainError` con subtipos.
  * `Pagination`/`Cursor` contract.
  * `Cancellation` (AbortSignal) como primer parámetro de todas las operaciones IO.

**Ejemplo de invariantes:**

* Gateways **nunca** exponen DTOs de OpenAPI hacia dominios.
* Domain services **no** retornan DTOs ni tipos de `@rankup/api`.
* AppServices **no** contiene lógica de negocio: solo composición, autorización, y mapping UI-friendly (si aplica).

### 3) Reglas de dependencia (más explícitas)

* `domains/**/services` puede importar:

  * `domains/**/contracts` (local)
  * `rankup/shared` (kernel)
  * **No** puede importar `apps/*`, `@rankup/api`, ni otros dominios salvo tipos “summary” expuestos por contracts/shared-kernel.
* `apps/*/services/api/**` (gateways) puede importar:

  * `@rankup/api` (types/client)
  * `domains/**/contracts` (port interfaces)
  * `rankup/shared` (errors/pagination)
  * **No** puede importar `domains/**/models` (si se quiere pure mapping) *o* si se permite, que sea explícito y testeado (decisión de equipo).
* `apps/*/pages|elements` (UI) puede importar:

  * `app-services`
  * `domains/**/contracts` y `rankup/shared`
  * **No** puede importar `gateways` ni `@rankup/api`.

### 4) Plan de test mínimo por capa (rápido + defensivo)

* **Gateways (apps)**

  * 1 test por endpoint: DTO fixture → domain type (y caso error).
  * Validación de respuesta contra schema (en test, no en runtime).
* **Domain services (packages/rankup)**

  * Contract tests con fake gateway: invariantes (idempotencia lógica, validaciones, ordering).
* **Runtime/use-cases (packages/rankup/runtime)**

  * Tests de orquestación con fakes: “join tournament” produce side effects correctos y maneja errores.
* **AppServices (apps)**

  * 2–3 smoke tests instanciando composition root con mock para asegurar wiring.

---

## E) Preguntas bloqueantes (máx. 10)

1. **¿Habrá más de un cliente** además de `rankup-spa` (p.ej. app móvil, SSR, CLI, backend worker)? Esta respuesta decide si gateways/mappers deben extraerse a paquetes compartidos o pueden vivir en `apps/`.
2. **¿Cuál es el contrato de sesión/auth** (tokens vs cookies, refresh, caducidad, storage permitido, multi-device)? Sin esto, cualquier implementación de auth y `admin.*` queda en terreno inseguro.
3. **¿Qué garantías exige `live.stream` (SSE/streaming)**: ordering, replay, at-least-once, at-most-once, reconexión con cursor? Esto impacta `scoring.timeline` y la UX de live.
4. **¿Cuál es el modelo de consistencia/idempotencia** para submissions y scoring (especialmente en jornadas): ¿se permite re-submit? ¿cómo se evita duplicación en retries?
5. **¿OpenAPI es contrato “shipped” o también roadmap?** Si es roadmap, ¿cómo se marca y se evita consumo prematuro? (Necesario para resolver placeholders vs tags existentes.)
6. **¿Dónde vive la orquestación cross-domain** por definición (runtime/use-cases vs domain services vs app-services)? Si no se decide, la UI acabará siendo “orquestador” por defecto.
7. **¿Cuál es el budget de performance** (latencia target, tamaño de payload, frecuencia de updates, número de torneos/usuarios concurrentes)? Sin esto no se pueden decidir caching/batching y límites de API.
8. **¿Qué telemetría está permitida** (privacy): eventos, propiedades, retención, opt-in/out? Bloquea instrumentación y diagnóstico.
9. **¿Qué significa “staff-only” para `admin.*`** en términos de distribución (mismo build con feature flags vs build separado)? Esto afecta estructura de paquetes y seguridad.
10. **¿Cuál es la estrategia de versionado/deprecación** para rulesets y game modes (versionado semántico, compatibilidad hacia atrás)? Bloquea diseño de `registry/algorithms` y reproducibilidad de scoring.

---

Si quieres que esto sea aún más “VS Code-grade”, el siguiente paso útil sería pegar **1–2 ejemplos reales** de un gateway + service + contract (uno simple y uno con SSE/streaming), porque ahí se ve si los límites declarados se sostienen en código o solo en README. Pero con lo que hay en el documento, los P0 anteriores ya están justificados.
