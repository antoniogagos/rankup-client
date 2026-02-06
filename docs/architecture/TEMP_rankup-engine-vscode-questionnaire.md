# Rankup Engine — Respuestas al cuestionario VS Code‑grade (Exhaustivo)

Documento elaborado para responder **todas** las preguntas del cuestionario. Rankup Engine está en fase temprana, por lo que varias decisiones están en **TBD** y se explicita qué evidencia falta.

---

## 1) Alcance del Engine y modelo de ejecución

### ENG-1.1 (P0) ¿Dónde se ejecuta el engine final?

Decisión: **TBD**. Hoy el engine está implementado como capa de dominio en el cliente (SPA) con runtime mock, pero no existe decisión formal sobre ejecución final (backend, client o híbrido).

Racional: El repositorio actual sólo refleja ejecución client‑side y mocks. No hay ADR que declare un motor backend definitivo.

Owner: Rankup maintainers (architecture).

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: ADR que fije el modelo de ejecución (backend/client/híbrido) y su implicación en contratos.

### ENG-1.2 (P0) ¿Qué define “Rankup Engine” exactamente?

Decisión: Rankup Engine está compuesto por `packages/rankup/src/{domains,algorithms,registry,runtime,shared}`. Quedan fuera UI, HTTP, storage, auth UI y platform infra.

Racional: La estructura actual del repo separa UI y wiring en `apps/rankup-spa`, contratos OpenAPI en `packages/api`, y runtime mock en `packages/api-mock`.

Owner: Rankup maintainers (architecture).

Fecha objetivo: 2026-02-04 (estado actual en repo).

Ejemplo: `packages/rankup/src/domains/tournaments/**` pertenece al engine; `apps/rankup-spa/services/api/http-client.ts` no.

Criterio de aceptación: README del engine y estructura del repo alineados con ADR 0049.

### ENG-1.3 (P0) ¿Determinista y replayable?

Decisión: Sí, el objetivo es determinismo y replayability para scoring/ranking/recaps con inputs `{rulesetVersionId + fixtures + submissions + results}`. Excepciones: correcciones de provider y acciones staff (moderación/enforcement).

Racional: `docs/negocio/documento-contratos-dominio-rankup.md` define rulesets inmutables, snapshots auditables y recompute por correcciones.

Owner: Rankup maintainers (architecture).

Fecha objetivo: 2026-02-02 (documento de contratos).

Ejemplo: `RecomputeTournament(tournamentId, reason)` genera un nuevo snapshot con metadata de auditoría.

Criterio de aceptación: snapshots incluyen `rulesetVersionId` y metadata; recompute documented.

### ENG-1.4 (P0) ¿Stateful o stateless?

Decisión: Lógica de dominio debe ser recomputable pero con **estado persistido** en backend (snapshots, submissions). La capa client‑side actual es stateless (delegación a gateways).

Racional: Los contratos definen snapshots, ledgers y eventos; los services actuales solo delegan IO.

Owner: Rankup maintainers (architecture) + Backend.

Fecha objetivo: 2026-02-02 (contratos) / TBD para backend definitivo.

Ejemplo: Ranking snapshot persistido; recompute crea nueva versión.

Criterio de aceptación: definición explícita de storage modelo en ADR o doc de backend.

### ENG-1.5 (P0) ¿Lógica en domain services o runtime/use‑cases?

Decisión: Domain services deben ser thin wrappers; la orquestación cross‑domain pertenece a `runtime` (actualmente scaffolded).

Racional: `docs/architecture/rankup-engine-domain-partitioning.md` define runtime como application‑layer para coordinación.

Owner: Rankup maintainers (architecture).

Fecha objetivo: 2026-02-03.

Ejemplo: `ITourneyContextService` y `IGameRuntimeService` propuestos en el doc de partición.

Criterio de aceptación: runtime con casos de uso claros; domain services sin lógica cross‑domain.

### ENG-1.6 (P1) ¿Soporte offline/local‑first?

Decisión: **TBD**.

Racional: No hay ADR ni contrato que defina offline en engine. UI actual no implementa colas o reconciliación.

Owner: Product + Architecture.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: ADR o doc de sincronización offline.

### ENG-1.7 (P1) ¿Compatibilidad hacia delante?

Decisión: No romper torneos históricos; rulesets inmutables, snapshots versionados, correcciones crean nueva versión.

Racional: `docs/negocio/documento-contratos-dominio-rankup.md` establece rulesets inmutables y snapshots auditables.

Owner: Rankup maintainers (architecture).

Fecha objetivo: 2026-02-02.

Ejemplo: `rulesetVersionId` queda fijado en `Tournament`.

Criterio de aceptación: cambios de ruleset crean nueva versión; torneos históricos no migran.

---

## 2) Bounded contexts, ownership y dependencias

### ENG-2.1 (P0) Source of Truth por dominio

Decisión: SoT por dominio está definido en `docs/architecture/rankup-engine-domain-partitioning.md` y `docs/negocio/documento-contratos-dominio-rankup.md`.

Racional: Partitioning doc detalla ownership; contratos describen agregados por contexto.

Owner: Rankup maintainers (architecture).

Fecha objetivo: 2026-02-03.

Ejemplo: `tournaments` owns membership/roles; `scoring` owns RankingSnapshot; `rules` owns ruleset versions.

Criterio de aceptación: tabla de SoT documentada y respetada en contratos.

### ENG-2.2 (P0) Datos que cada dominio posee vs consume

Decisión: Cada dominio posee sus agregados; otros dominios consumen sólo read‑models o summaries. No se permite escritura cross‑domain fuera de runtime.

Racional: Evita acoplamiento y refactors costosos; está explícito en el doc de partición.

Owner: Rankup maintainers (architecture).

Fecha objetivo: 2026-02-03.

Ejemplo: engagement consume `RankingSnapshot` para recaps, pero no escribe scoring.

Criterio de aceptación: contratos no exponen writes cross‑domain.

### ENG-2.3 (P0) Invariantes cross‑domain en runtime

Decisión: Invariantes cross‑domain deben vivir en runtime: membership gating, ruleset immutability, enforcement trustSafety aplicado a chat/ranked/rewards, recompute por correcciones.

Racional: `docs/negocio/documento-contratos-dominio-rankup.md` define quién publica/consume eventos y qué dominios aplican restricciones.

Owner: Rankup maintainers (architecture).

Fecha objetivo: 2026-02-03.

Ejemplo: `sports.match_corrected` dispara recompute en scoring; UI no debe hacerlo.

Criterio de aceptación: runtime documentado con casos de uso y dependencias explícitas.

### ENG-2.4 (P0) Dependencias permitidas

Decisión: Dependencias permitidas siguen el context map: Sports → Scoring/Live; Rules → Submissions/Scoring; Tournaments → Submissions/Chat/Ranking; Verified → Ranked/Achievements/Promotions; Scoring → Ranked/Achievements/Live/Stats; TrustSafety → Chat/Ranked/Rewards; Media → Profiles/Tournaments/Verified/Creators/Promotions; Admin → todos (read/write staff).

Racional: `docs/negocio/documento-contratos-dominio-rankup.md` sección C.

Owner: Rankup maintainers (architecture).

Fecha objetivo: 2026-02-02.

Ejemplo: ranked consume `scoring` pero no lo modifica.

Criterio de aceptación: imports y contracts respetan este mapa.

### ENG-2.5 (P1) Política de Shared Kernel

Decisión: Shared kernel es mínimo (`packages/rankup/src/shared`) y sólo contiene tipos verdaderamente cross‑domain; el resto debe importarse desde el dominio owner.

Racional: Evita duplicación y deriva inconsistent; está alineado con `packages/rankup/src/shared/README.md`.

Owner: Rankup maintainers (architecture).

Fecha objetivo: 2026-02-04.

Ejemplo: `TournamentId` vive en `tournaments/shared`, no se copia en otros dominios.

Criterio de aceptación: shared permanece mínimo y sin duplicados.

### ENG-2.6 (P1) Contratos internos estables vs refactorables

Decisión: `contracts/**` son estables para consumo UI; `models/**` y `services/**` son internos y refactorables. OpenAPI es estable como contrato externo.

Racional: ADR 0048 fija contracts como boundary; UI solo consume contracts.

Owner: Rankup maintainers (architecture).

Fecha objetivo: 2026-02-03.

Ejemplo: UI importa `@rankup/rankup/domains/tournaments/core/contracts/tourneyCore.js`.

Criterio de aceptación: UI no importa runtime implementations; contracts versionados si cambian.

---

## 3) Glosario e invariantes de negocio

### ENG-3.1 (P0) Términos canónicos

Decisión: Usar el glosario de `docs/domain/glossary.md` como referencia canónica.

Racional: Define tournament, matchday, game mode, submission, ranking y draft con ejemplos.

Owner: Product + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: Tournament = contenedor competitivo de un game mode sobre un sport.

Criterio de aceptación: términos en OpenAPI y contratos alineados al glosario.

### ENG-3.2 (P0) Invariantes no rompibles

Decisión: No spectator; no doble membership; ruleset inmutable; submissions no editables tras lock; ranking recomputable; preview mínimo.

Racional: Invariantes explícitos en `docs/negocio/documento-contratos-dominio-rankup.md` (A.8, D.7, D.9, D.10).

Owner: Product + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `gameModeId + rulesetVersionId` se fija al crear torneo.

Criterio de aceptación: invariantes validados en contracts y tests de dominio.

### ENG-3.3 (P0) Multi‑sport

Decisión: multi‑sport se modela con `sportId` canónico y ACL en `sports` domain; no se embeben modelos específicos por deporte en core.

Racional: `sports` actúa como normalizador y evita acoplar a providers.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `sportId=football` se usa en tournament y ruleset.

Criterio de aceptación: contratos usan `sportId` canónico; provider details no salen del ACL.

### ENG-3.4 (P1) Multi‑mode

Decisión: Game modes definen tipos de submission, scoring, locks y tie‑breakers; rulesets son versiones inmutables por mode.

Racional: `docs/negocio/documento-contratos-dominio-rankup.md` sección D.6.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `scorePrediction` con ruleset específico y lockPolicy.

Criterio de aceptación: `rulesetVersionId` y `gameModeId` están fijados en torneo.

### ENG-3.5 (P1) Privacidad

Decisión: Clasificación de datos en public/authenticated/member‑only/staff‑only; no spectator salvo preview mínimo.

Racional: `docs/negocio/documento-contratos-dominio-rankup.md` A.7 y A.8.

Owner: Product + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `GetTournamentPreview` permite solo campos pre‑join.

Criterio de aceptación: endpoints y contracts respetan visibilidad definida.

---

## 4) Identificadores, tipos base y versionado interno

### ENG-4.1 (P0) IDs globales

Decisión: IDs tipados y estables (`userId`, `tournamentId`, `matchId`, `rulesetId`, `submissionSetId`, `mediaId`, `promotionId`, `rewardGrantId`, etc.).

Racional: Convención global A.1 en contratos de negocio.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `tournamentId` en todas las operaciones de torneo.

Criterio de aceptación: OpenAPI y domain models usan IDs tipados.

### ENG-4.2 (P0) Formato de IDs

Decisión: Recomendación técnica: ULID o UUIDv7 (ordenables); formato final TBD por backend.

Racional: `docs/negocio/documento-contratos-dominio-rankup.md` A.1.

Owner: Backend + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `01J8W0K7E2ZQZ6P0M4NQW2Y7GA`.

Criterio de aceptación: ADR definiendo formato definitivo.

### ENG-4.3 (P0) Compatibilidad de enums

Decisión: **TBD**.

Racional: No hay ADR ni contrato que fije estrategia (additive, unknown fallback).

Owner: Architecture.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: ADR con regla de compatibilidad y fallback.

### ENG-4.4 (P0) Versionado de rulesets y modos

Decisión: Rulesets son inmutables; cambios crean nueva versión. Estados `active`, `deprecated`, `retired`. Snapshots persisten `rulesetVersionId` y metadata.

Racional: `docs/negocio/documento-contratos-dominio-rankup.md` D.6.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `ResolveEffectiveRules(tournamentId)` devuelve `rulesetVersionId` fijo.

Criterio de aceptación: reglas inmutables en contratos + OpenAPI.

### ENG-4.5 (P1) Breaking changes internos

Decisión: Greenfield mode permite breaking changes hasta production readiness; deben documentarse.

Racional: ADR 0013.

Owner: Architecture.

Fecha objetivo: 2026-02-03.

Ejemplo: refactor de contracts requiere actualización de work log.

Criterio de aceptación: cambios estructurales actualizan ADR + work tracking.

---

## 5) Torneos: lifecycle, roles, membresía y transiciones

### ENG-5.1 (P0) Estados del torneo y transiciones

Decisión: **TBD**. OpenAPI expone `status` pero no existe un diagrama de transiciones formal.

Racional: No hay ADR ni doc que defina la máquina de estados.

Owner: Product + Architecture.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: diagrama de estados documentado con transiciones válidas.

### ENG-5.2 (P0) Quién ejecuta transiciones

Decisión: Owner/admin ejecutan mutaciones de torneo; el sistema ejecuta locks y recomputes; staff en admin overlay.

Racional: D.7 en contratos define comandos con `ownerId/adminId` y acciones internas.

Owner: Product + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `KickMember(tournamentId, adminId, targetUserId)`.

Criterio de aceptación: commands y policies reflejan roles y permisos.

### ENG-5.3 (P0) ¿Qué significa “join tournament”?

Decisión: Join es idempotente, requiere membership gating, respeta `joinPolicy` e invitación opcional; no hay doble membership.

Racional: D.7 invariantes de torneo.

Owner: Product + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `JoinTournament(tournamentId, userId, invitationCode?)`.

Criterio de aceptación: contrato y validadores rechazan double membership.

### ENG-5.4 (P0) Roles y permisos

Decisión: **TBD** (owner/admin/member/guest/banned no está formalizado).

Racional: No hay documento con matriz de permisos.

Owner: Product + Architecture.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: matriz de roles y permisos aprobada.

### ENG-5.5 (P0) TrustSafety enforcement en membresía

Decisión: Enforcement debe reflejarse en permisos de join, submit, chat y rewards; detalles de degradación TBD.

Racional: D.19 invariantes obligan a aplicar restricciones en dominios críticos.

Owner: TrustSafety + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `trustSafety.enforcement` puede bloquear chat o join.

Criterio de aceptación: políticas explícitas en trustSafety.

### ENG-5.6 (P1) Invitaciones y códigos

Decisión: Código rotativo y join por invitationCode definidos; expiración/reuse/rate limits TBD.

Racional: D.7 define `RotateInvitationCode` pero no políticas de expiración.

Owner: Product + Architecture.

Fecha objetivo: TBD.

Ejemplo: `RotateInvitationCode(tournamentId)`.

Criterio de aceptación: políticas documentadas y validadas.

### ENG-5.7 (P1) Core vs preview

Decisión: Preview mínimo definido en `docs/negocio/documento-contratos-dominio-rankup.md` E.1.

Racional: No spectator con preview limitado.

Owner: Product + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: preview incluye `tournamentId`, `name`, `schedule`, `participantsCount`.

Criterio de aceptación: OpenAPI y domain preview alineados con lista E.1.

### ENG-5.8 (P1) Consistencia concurrente

Decisión: Mutaciones críticas deben usar control de concurrencia (`If-Match` o `expectedVersion`).

Racional: Convención global A.3.

Owner: Backend + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `UpdateTournament` con `expectedVersion`.

Criterio de aceptación: contratos incluyen mecanismo de concurrencia.

---

## 6) Deportes, schedule y normalización (ACL)

### ENG-6.1 (P0) Fuente de fixtures/resultados

Decisión: **TBD**.

Racional: No hay decisión en docs sobre proveedor específico.

Owner: Product + Backend.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: ADR que defina provider y estrategia de cambio.

### ENG-6.2 (P0) Matchday en deportes sin jornada

Decisión: **TBD**.

Racional: No hay política para deportes sin matchday natural.

Owner: Product + Sports domain.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: definición de agrupación temporal alternativa.

### ENG-6.3 (P0) Cambios del provider

Decisión: Cambios del provider se manejan como eventos (`sports.match_corrected`) que disparan recompute y nuevos snapshots.

Racional: D.10 establece recompute y snapshots auditables.

Owner: Sports + Scoring.

Fecha objetivo: 2026-02-02.

Ejemplo: `sports.match_corrected` → `RecomputeTournament`.

Criterio de aceptación: eventos y recompute documentados.

### ENG-6.4 (P0) Estabilidad de IDs del provider

Decisión: **TBD**.

Racional: No hay política de mapping interno.

Owner: Sports domain.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: ADR con estrategia de mapping interno.

### ENG-6.5 (P1) Provider tarde o incompleto

Decisión: **TBD**.

Racional: No hay SLA definido ni política de fallback.

Owner: Sports domain.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: definición de handling de “late data”.

### ENG-6.6 (P1) Timezone policy

Decisión: Persistir timestamps en UTC RFC3339; locale sólo para presentación.

Racional: Convención global A.2.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `createdAt` en UTC.

Criterio de aceptación: contratos usan RFC3339 UTC.

### ENG-6.7 (P1) Auditoría de correcciones

Decisión: Correcciones generan nuevos snapshots con metadata auditada.

Racional: A.3 define snapshots auditables con reason code y correlationId.

Owner: Scoring + Backend.

Fecha objetivo: 2026-02-02.

Ejemplo: `ranking.corrected` con `parentVersionId`.

Criterio de aceptación: snapshots incluyen metadata de auditoría.

---

## 7) Game modes y rulesets

### ENG-7.1 (P0) GameModeDefinition

Decisión: Game mode define inputs, scoring, tie‑breakers y lock policy; se publica como definición inmutable.

Racional: D.6 define `PublishRulesetVersion` con scoring y tieBreakers.

Owner: Rules domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `scorePrediction` con scoring y lockPolicy.

Criterio de aceptación: definición en rules domain + OpenAPI.

### ENG-7.2 (P0) RulesetDefinition

Decisión: Ruleset es un conjunto de parámetros versionados por gameMode; validado por schema y hash.

Racional: D.6 y A.3.

Owner: Rules domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `rulesetVersionId` + `schemaHash`.

Criterio de aceptación: rulesets inmutables y auditables.

### ENG-7.3 (P0) ¿Mode+ruleset fijo?

Decisión: Sí, `gameModeId` + `rulesetVersionId` se fijan al crear torneo; cambios posteriores sólo con versiones nuevas.

Racional: D.7 invariantes.

Owner: Tournaments + Rules.

Fecha objetivo: 2026-02-02.

Ejemplo: `CreateTournament(... rulesetVersionId ...)`.

Criterio de aceptación: contratos no permiten cambiar ruleset activo sin versionar.

### ENG-7.4 (P0) Reglas versionadas operacionalmente

Decisión: Versionado inmutable; snapshots preservan rulesetVersionId; correcciones crean nueva versión de snapshot.

Racional: A.3 y D.10.

Owner: Rules + Scoring.

Fecha objetivo: 2026-02-02.

Ejemplo: `RankingSnapshot` incluye `rulesetVersionId`.

Criterio de aceptación: snapshots auditables y recomputables.

### ENG-7.5 (P0) Validación de ruleset

Decisión: Validación por schema + constraints cross‑field; hash de integridad.

Racional: D.6.

Owner: Rules domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `schemaHash` persistido.

Criterio de aceptación: validación documentada y aplicada en publish.

### ENG-7.6 (P1) Registry estático vs dinámico

Decisión: Registry interno estático en código por ahora; dinámico TBD.

Racional: ADR 0044 define registry interno; no hay decisión de runtime dinámico.

Owner: Architecture.

Fecha objetivo: 2026-02-03.

Ejemplo: `packages/rankup/src/registry/**`.

Criterio de aceptación: ADR si se decide registry dinámico.

### ENG-7.7 (P1) Desplegar modos nuevos sin romper

Decisión: Nuevo `gameModeId` + ruleset version; torneos existentes preservan su `rulesetVersionId`.

Racional: rulesets inmutables y no migrables.

Owner: Rules domain.

Fecha objetivo: 2026-02-02.

Ejemplo: ScorePrediction mantiene reglas históricas aunque haya nueva versión.

Criterio de aceptación: no hay migración automática de reglas.

### ENG-7.8 (P1) Capabilities derivadas del mode

Decisión: Mode determina tipo de submission, scoring pipeline y triggers de achievements; detalles por mode TBD.

Racional: ruleset define scoring y lock policy.

Owner: Rules + Scoring + Achievements.

Fecha objetivo: TBD.

Ejemplo: `scorePrediction` define `SubmissionItem` y scoring por match.

Criterio de aceptación: documentación por mode en registry/algorithms.

---

## 8) Submissions

### ENG-8.1 (P0) Tipos de submission

Decisión: `ScorePrediction` es el modo inicial; `Draft` está planificado.

Racional: glosario y reglas actuales.

Owner: Product + Rules.

Fecha objetivo: 2026-02-02.

Ejemplo: `gameModeId=scorePrediction`.

Criterio de aceptación: OpenAPI y domain models reflejan `scorePrediction`.

### ENG-8.2 (P0) Modelo exacto y validaciones

Decisión: `SubmissionSet` = `{userId, tournamentId, matchday}` con items; estado `draft|submitted|locked`; validación por ruleset efectivo.

Racional: D.9 Submissions.

Owner: Submissions domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `UpsertSubmissionSet(userId, tournamentId, matchday, items[])`.

Criterio de aceptación: contracts y validators alineados.

### ENG-8.3 (P0) Idempotencia

Decisión: Writes críticos aceptan `idempotencyKey`; misma key + actor + operación ⇒ mismo resultado.

Racional: A.4 Idempotencia.

Owner: Backend.

Fecha objetivo: 2026-02-02.

Ejemplo: `X-Idempotency-Key` en `SubmitSubmissionSet`.

Criterio de aceptación: OpenAPI + mock soportan idempotency.

### ENG-8.4 (P0) Edición de submissions

Decisión: Se permite upsert hasta lock; no hay ediciones post‑lock.

Racional: D.9 invariantes.

Owner: Submissions domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `submission.locked` bloquea ediciones.

Criterio de aceptación: validación rechaza edits tras lock.

### ENG-8.5 (P0) Locking

Decisión: Lock se determina por `lockPolicy` del ruleset y eventos de kickoff (`sports.match_status_changed`).

Racional: D.9.

Owner: Submissions + Sports.

Fecha objetivo: 2026-02-02.

Ejemplo: lock automático cuando inicia el match.

Criterio de aceptación: lock basado en sports events.

### ENG-8.6 (P1) Auditoría de cambios

Decisión: **TBD**.

Racional: No se define audit trail para submissions.

Owner: Backend.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: definición de historial de submissions.

### ENG-8.7 (P1) Cambios de fixtures después de submissions

Decisión: Correcciones de fixtures disparan recompute de scoring; submissions permanecen pero se recalcula.

Racional: D.10 menciona `sports.match_corrected`.

Owner: Scoring + Sports.

Fecha objetivo: 2026-02-02.

Ejemplo: cambio de resultado genera nuevo ranking snapshot.

Criterio de aceptación: recompute documentado y auditado.

### ENG-8.8 (P1) Privacidad de submissions

Decisión: **TBD**.

Racional: No hay política explícita sobre visibilidad antes/después del lock.

Owner: Product.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: política de visibilidad documentada.

---

## 9) Scoring (puro) e integración

### ENG-9.1 (P0) Inputs exactos de scoring

Decisión: Scoring consume submissions + resultados de fixtures + parameters del ruleset efectivo.

Racional: D.10 (ApplyMatchFinished, RecomputeTournament).

Owner: Scoring domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `submissionSet` + `matchResult` + `rulesetVersionId`.

Criterio de aceptación: scoring algorithms usan inputs definidos.

### ENG-9.2 (P0) Reason codes

Decisión: **TBD**.

Racional: No hay definición explícita de reason codes en scoring.

Owner: Scoring domain.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: contrato de explicabilidad definido.

### ENG-9.3 (P0) Determinismo y floats

Decisión: **TBD** (preferencia técnica: scoring con enteros para evitar drift).

Racional: No hay regla explícita sobre floats.

Owner: Scoring domain.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: ADR de determinismo y numeric policy.

### ENG-9.4 (P0) Sin resultado final

Decisión: **TBD**.

Racional: No hay contrato explícito para scoring parcial.

Owner: Scoring domain.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: policy de scoring pending definida.

### ENG-9.5 (P1) Incremental vs recompute

Decisión: Ambos; incremental por `ApplyMatchFinished`, recompute global por correcciones.

Racional: D.10 define `ApplyMatchFinished` y `RecomputeTournament`.

Owner: Scoring domain.

Fecha objetivo: 2026-02-02.

Ejemplo: recompute tras `sports.match_corrected`.

Criterio de aceptación: endpoints y eventos soportan ambos flows.

### ENG-9.6 (P1) Replay tool

Decisión: **TBD**.

Racional: No hay tool explicitada, aunque recompute está definido.

Owner: Backend.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: herramienta definida o especificación de replay.

---

## 10) Ranking: snapshots, ventanas y desempates

### ENG-10.1 (P0) Snapshot

Decisión: Snapshot incluye `gameModeId`, `rulesetVersionId`, metadata de auditoría y view (`topN`, `aroundMe`).

Racional: D.10 define snapshots auditables.

Owner: Scoring domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `RankingSnapshot` con `createdAt` y `schemaHash`.

Criterio de aceptación: snapshot contract completo.

### ENG-10.2 (P0) Ventanas

Decisión: Window mínimo: `matchday` y `total`.

Racional: D.10 menciona scope por matchday/total.

Owner: Scoring domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `GetRanking(tournamentId, scope: matchday)`.

Criterio de aceptación: OpenAPI soporta scopes.

### ENG-10.3 (P0) Tie‑breakers

Decisión: **TBD**.

Racional: No hay orden de desempates documentado.

Owner: Rules + Scoring.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: lista de tie‑breakers por mode.

### ENG-10.4 (P0) Explainability

Decisión: Debe existir breakdown de puntos; hay contrato `GetUserScoreBreakdown`.

Racional: D.10 incluye lectura de breakdown.

Owner: Scoring domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `GetUserScoreBreakdown(tournamentId, userId)`.

Criterio de aceptación: endpoint implementado y expuesto.

### ENG-10.5 (P0) Nuevos participantes

Decisión: **TBD**.

Racional: No hay política sobre join tardío y seed.

Owner: Product + Scoring.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: policy documentada.

### ENG-10.6 (P1) Deltas

Decisión: Placeholder; `PositionTimeline` es el modelo esperado, pendiente de implementación.

Racional: D.10 menciona timeline como agregado.

Owner: Scoring domain.

Fecha objetivo: TBD.

Ejemplo: `GetPositionTimeline(tournamentId, userId)`.

Criterio de aceptación: capability `scoring/timeline` implementada.

### ENG-10.7 (P1) Persistido vs on‑demand

Decisión: Ranking snapshots deben persistirse como read model; recompute produce nuevas versiones.

Racional: D.10 define snapshots y recompute auditable.

Owner: Scoring domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `PublishRankingSnapshot`.

Criterio de aceptación: snapshots almacenados y versionados.

### ENG-10.8 (P1) Correcciones históricas

Decisión: Correcciones generan nuevas versiones de snapshot; no se reescribe historial.

Racional: A.3 y D.10.

Owner: Scoring domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `ranking.corrected` event.

Criterio de aceptación: snapshots versionados con parentVersionId.

---

## 11) Results y Timeline (placeholders)

### ENG-11.1 (P0) ¿Qué es “result”?

Decisión: Resultado = snapshot por matchday con puntos por match; definido en D.10 (`GetMatchdayResults`).

Racional: Contratos de scoring describen resultados por matchday.

Owner: Scoring domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `GetMatchdayResults(tournamentId, matchday)`.

Criterio de aceptación: capability `scoring/results` implementada.

### ENG-11.2 (P0) ¿Qué es timeline?

Decisión: Timeline = cambios de posición/puntos por usuario; modelo `PositionTimeline`.

Racional: D.10 define `PositionTimeline` como agregado.

Owner: Scoring domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `GetPositionTimeline(tournamentId, userId)`.

Criterio de aceptación: capability `scoring/timeline` implementada.

### ENG-11.3 (P0) Timeline derivado vs persistido

Decisión: **TBD**.

Racional: No hay decisión sobre event‑log vs materialized view.

Owner: Scoring + Backend.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: ADR con estrategia de timeline.

### ENG-11.4 (P1) API para engagement/live

Decisión: **TBD**.

Racional: No hay contrato explícito entre live/engagement y scoring timeline.

Owner: Engagement + Scoring.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: endpoints de live basados en timeline definidos.

### ENG-11.5 (P1) Backfill para recaps

Decisión: Recaps se derivan de scoring + timeline; requieren backfill si se introduce timeline tardíamente.

Racional: D.12 define recaps como derivados de scoring/timeline.

Owner: Engagement + Scoring.

Fecha objetivo: 2026-02-02.

Ejemplo: `GenerateTournamentRecap(tournamentId)`.

Criterio de aceptación: pipeline de backfill documentado.

---

## 12) Live updates y modelo de eventos

### ENG-12.1 (P0) Domain events mínimos

Decisión: Eventos mínimos siguen el envelope de B.1; tipos recomendados incluyen `tournament.member_joined`, `submission.locked`, `scoring.user_points_changed`, `ranking.snapshot_published`.

Racional: B.1 y D.* definen eventos publicados.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `eventType: tournament.member_joined`.

Criterio de aceptación: catálogo de eventos documentado.

### ENG-12.2 (P0) Semántica de entrega

Decisión: At‑least‑once; dedupe por `eventId`.

Racional: B.2.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: consumidor idempotente por `eventId`.

Criterio de aceptación: contrato de eventos define semantics.

### ENG-12.3 (P0) Orden

Decisión: Orden garantizado por `aggregateId` y `aggregateVersion`.

Racional: B.2.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: ordering por `tournamentId`.

Criterio de aceptación: envelope incluye `aggregateVersion`.

### ENG-12.4 (P0) Reconnect y replay

Decisión: Cursor‑based en SSE; TTL y replay policy **TBD**.

Racional: OpenAPI incluye cursors pero no define TTL.

Owner: Engagement + Platform.

Fecha objetivo: TBD.

Ejemplo: `sinceCursor` + `waitSeconds`.

Criterio de aceptación: policy documentada.

### ENG-12.5 (P1) Public vs private payloads

Decisión: Se aplica clasificación public/auth/member‑only/staff‑only; detalles de filtros en live TBD.

Racional: A.7 clasificación global.

Owner: Product + Engagement.

Fecha objetivo: 2026-02-02.

Ejemplo: live feed personalizable por `userId`.

Criterio de aceptación: reglas de visibilidad definidas.

### ENG-12.6 (P1) Live como proyección

Decisión: Live debe ser proyección de eventos del engine, no API paralelo.

Racional: D.11 define feed y notifs como derivados.

Owner: Engagement + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `EnqueueNotification(eventRef)`.

Criterio de aceptación: live endpoints consumen eventos oficiales.

---

## 13) Ranked, Seasons y Leaderboards

### ENG-13.1 (P0) Relación scoring vs ranked

Decisión: Ranked consume snapshots verificados; scoring sigue siendo tournament‑centric.

Racional: D.16 invariantes: solo torneos verificados mueven rating.

Owner: Ranked + Scoring.

Fecha objetivo: 2026-02-02.

Ejemplo: `ApplyVerifiedSnapshot(snapshotRef)`.

Criterio de aceptación: ranked sólo acepta snapshots verificados.

### ENG-13.2 (P0) Snapshots vs eventos

Decisión: Ranked consume snapshots (no eventos crudos).

Racional: D.16.

Owner: Ranked domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `ApplyVerifiedSnapshot`.

Criterio de aceptación: ranked contracts no consumen eventos raw.

### ENG-13.3 (P0) Verified leaderboards

Decisión: “Verified” significa gating por Verified domain; staff controla verificación; evidencia es VerifiedEvent/Attachment.

Racional: D.14 + D.16.

Owner: Verified + Ranked.

Fecha objetivo: 2026-02-02.

Ejemplo: `verified.tournament_verified` marca elegibilidad.

Criterio de aceptación: ranked valida verificación.

### ENG-13.4 (P1) Reset policy

Decisión: Reset parcial auditado; detalles de carry‑over TBD.

Racional: D.16 menciona reset parcial, sin política detallada.

Owner: Ranked domain.

Fecha objetivo: TBD.

Ejemplo: `ApplySeasonReset(trackId, seasonId, policy)`.

Criterio de aceptación: policy documentada.

### ENG-13.5 (P1) Bans/enforcement

Decisión: Enforcement aplica en ranked; retroactividad TBD.

Racional: D.19 establece restricciones para ranked.

Owner: TrustSafety + Ranked.

Fecha objetivo: TBD.

Ejemplo: ban puede remover usuario de leaderboard.

Criterio de aceptación: policy documentada.

---

## 14) Achievements

### ENG-14.1 (P0) Online vs batch

Decisión: **TBD**.

Racional: No hay definición si grants se calculan online o batch.

Owner: Achievements domain.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: pipeline definido.

### ENG-14.2 (P0) Idempotencia de grants

Decisión: Grants deben ser idempotentes; clave TBD (probable `userId+achievementId+evidenceRef`).

Racional: D.17 define grants inmutables con revocación auditada.

Owner: Achievements domain.

Fecha objetivo: TBD.

Ejemplo: `GrantAchievement(userId, achievementId, evidenceRef)`.

Criterio de aceptación: idempotency rule documentada.

### ENG-14.3 (P1) Eventos que disparan achievements

Decisión: **TBD**.

Racional: No hay lista de eventos disparadores.

Owner: Achievements domain.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: contrato de triggers definido.

### ENG-14.4 (P1) Versionado de definitions

Decisión: Definitions publicadas por staff y tratadas como inmutables; cambios crean nuevas definiciones.

Racional: D.17 y paralelismo con ruleset versioning.

Owner: Achievements domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `PublishAchievementDefinition`.

Criterio de aceptación: definitions no se editan, se versionan.

---

## 15) Promotions y Rewards

### ENG-15.1 (P0) Rewards vs ranking/scoring

Decisión: Promotions consumen scoring snapshots/verificación, no acoplamiento directo a scoring interno; detalles TBD.

Racional: D.18 define promociones y rewards como dominio separado.

Owner: Promotions + Scoring.

Fecha objetivo: TBD.

Ejemplo: `GrantRewards(promotionId, winners[])` basado en snapshots.

Criterio de aceptación: integración formal documentada.

### ENG-15.2 (P0) Correcciones de resultados

Decisión: **TBD**.

Racional: No hay política sobre recalcular ganadores tras correcciones.

Owner: Promotions + Scoring.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: policy de corrección documentada.

### ENG-15.3 (P1) Fulfillment síncrono vs asíncrono

Decisión: **TBD**.

Racional: D.18 define fulfillment profile pero no timing.

Owner: Promotions + Backend.

Fecha objetivo: TBD.

Ejemplo: `UpdateFulfillmentProfile`.

Criterio de aceptación: pipeline de fulfillment documentado.

---

## 16) Verified

### ENG-16.1 (P0) `verified.tournaments` gap

Decisión: Entidad mínima = `VerifiedTournamentAttachment` con list/get por `eventId` y relación con `tournamentId`.

Racional: D.14 define `VerifiedTournamentAttachment` y `ListVerifiedEventTournaments`.

Owner: Verified domain.

Fecha objetivo: 2026-02-02.

Ejemplo: `ListVerifiedEventTournaments(eventId)`.

Criterio de aceptación: capability creada y endpoints mapeados.

### ENG-16.2 (P0) Significado de verificado

Decisión: Verified es curación staff con branding/elegibilidad; estados y expiración TBD.

Racional: D.14 define staff commands para crear/publicar eventos.

Owner: Verified + Product.

Fecha objetivo: TBD.

Ejemplo: `PublishVerifiedEvent(eventId)`.

Criterio de aceptación: criterios de verificación documentados.

### ENG-16.3 (P1) Relación con ranked/achievements/promotions

Decisión: Verified actúa como gating; solo eventos/torneos verificados alimentan ranked/achievements/promotions.

Racional: Context map C y D.16/D.17.

Owner: Verified + Ranked + Achievements + Promotions.

Fecha objetivo: 2026-02-02.

Ejemplo: `ApplyVerifiedSnapshot`.

Criterio de aceptación: validaciones de verificación en dominios dependientes.

---

## 17) Trust & Safety

### ENG-17.1 (P0) Acciones que respetan enforcement

Decisión: Enforcement aplica a join, submit, chat, ranked y rewards.

Racional: D.19 invariantes obligan reflejar restricciones en esos dominios.

Owner: TrustSafety + Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: usuario bloqueado no puede enviar chat.

Criterio de aceptación: policies aplicadas en runtime.

### ENG-17.2 (P0) Hard block vs degradación

Decisión: **TBD**.

Racional: No hay política explícita de shadow‑ban o rate‑limit.

Owner: TrustSafety.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: taxonomía de enforcement definida.

### ENG-17.3 (P0) Auditoría

Decisión: Acciones staff requieren audit log inmutable y justificación.

Racional: A.7 y D.21.

Owner: TrustSafety + Admin.

Fecha objetivo: 2026-02-02.

Ejemplo: `X-Admin-Justification` requerido.

Criterio de aceptación: audit log en endpoints admin.

### ENG-17.4 (P1) Apelaciones retroactivas

Decisión: **TBD**.

Racional: No hay política explícita.

Owner: TrustSafety.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: policy documentada.

---

## 18) Persistencia, consistencia y transacciones

### ENG-18.1 (P0) Modelo de storage

Decisión: **TBD** (CRUD/CQRS/event‑sourcing no definido).

Racional: Contratos describen snapshots y eventos, pero no arquitectura de storage.

Owner: Backend + Architecture.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: ADR de storage model.

### ENG-18.2 (P0) Entidades con transacciones atómicas

Decisión: Join+membership, submit+lock y grants/rewards requieren atomicidad.

Racional: A.3 y D.9/D.18.

Owner: Backend.

Fecha objetivo: 2026-02-02.

Ejemplo: `JoinTournament` debe evitar doble membership.

Criterio de aceptación: invariantes protegidas con concurrency control.

### ENG-18.3 (P0) Concurrencia

Decisión: Optimistic locking con `If-Match` o `expectedVersion`.

Racional: A.3.

Owner: Backend.

Fecha objetivo: 2026-02-02.

Ejemplo: `UpdateTournament` con version.

Criterio de aceptación: contratos incluyen versioning.

### ENG-18.4 (P0) Qué se calcula vs persiste

Decisión: Submissions, snapshots y results deben persistirse; recaps y timeline pueden derivarse (policy TBD).

Racional: D.9/D.10/D.12 describen snapshots y recaps como derivados.

Owner: Architecture + Backend.

Fecha objetivo: TBD.

Ejemplo: `RankingSnapshot` persistido.

Criterio de aceptación: política de persistencia documentada.

### ENG-18.5 (P1) Retención y purga

Decisión: **TBD**.

Racional: No hay política GDPR‑like definida.

Owner: Product + Legal.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: política de retención definida.

### ENG-18.6 (P1) Backfill/rebuild

Decisión: Recompute de scoring y snapshots debe existir; detalles de reconstitution TBD.

Racional: D.10 define `RecomputeTournament`.

Owner: Scoring + Backend.

Fecha objetivo: 2026-02-02.

Ejemplo: recompute por correcciones históricas.

Criterio de aceptación: job de recompute documentado.

---

## 19) Modelo de errores y resiliencia

### ENG-19.1 (P0) Taxonomía de errores

Decisión: Usar Problem Details como formato canónico; catálogo en `packages/api/docs/errors/README.md`. Taxonomía específica TBD.

Racional: OpenAPI y docs de errores existen, pero no hay lista completa de clases.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `application/problem+json`.

Criterio de aceptación: catálogo de errores completo y consistente.

### ENG-19.2 (P0) Errores esperados

Decisión: **TBD**.

Racional: No hay mapping UX consistente documentado.

Owner: Product + Architecture.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: guía de UX errors.

### ENG-19.3 (P0) Timeout/retry

Decisión: **TBD**.

Racional: No hay policy por operación.

Owner: Platform.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: policy definida.

### ENG-19.4 (P1) Cancelación

Decisión: **TBD**.

Racional: No hay política de AbortSignal end‑to‑end.

Owner: Platform.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: soporte documentado.

### ENG-19.5 (P1) Invariantes ante fallos parciales

Decisión: Idempotencia y control de concurrencia protegen contra duplicados (submissions, membership, grants).

Racional: A.3 y A.4.

Owner: Backend.

Fecha objetivo: 2026-02-02.

Ejemplo: `idempotencyKey` en writes.

Criterio de aceptación: invariantes aplicadas en contratos.

---

## 20) Performance y escalabilidad

### ENG-20.1 (P0) Targets de latencia

Decisión: **TBD**.

Racional: No hay SLOs definidos.

Owner: Product + Backend.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: SLOs documentados.

### ENG-20.2 (P0) Tamaños máximos

Decisión: **TBD**.

Racional: No hay límites de capacidad definidos.

Owner: Product + Backend.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: límites definidos por torneo/matchday.

### ENG-20.3 (P0) Live updates concurrency

Decisión: **TBD**.

Racional: No hay policy de límites de conexiones.

Owner: Platform.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: límites definidos y probados.

### ENG-20.4 (P1) Evitar N+1 calls

Decisión: **TBD**.

Racional: No hay guideline para batching/caching.

Owner: Platform.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: guideline definida.

### ENG-20.5 (P1) Compute incremental

Decisión: Incremental por eventos y recompute por correcciones.

Racional: D.10 define `ApplyMatchFinished` y `RecomputeTournament`.

Owner: Scoring.

Fecha objetivo: 2026-02-02.

Ejemplo: recompute tras match_corrected.

Criterio de aceptación: scoring implementa ambos flows.

---

## 21) Observabilidad y telemetría

### ENG-21.1 (P0) Eventos/metrics obligatorios

Decisión: **TBD**.

Racional: No hay lista de métricas mínimas.

Owner: Platform + Product.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: catálogo de métricas.

### ENG-21.2 (P0) Correlación

Decisión: `correlationId` y `causationId` en event envelope.

Racional: B.1 define envelope con correlationId.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: `correlationId` en eventos de scoring.

Criterio de aceptación: eventos incluyen correlationId.

### ENG-21.3 (P1) Logs permitidos

Decisión: **TBD**.

Racional: No hay política explícita de PII logs.

Owner: Security + Legal.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: política de logging.

### ENG-21.4 (P1) Drift detection

Decisión: **TBD**.

Racional: No hay alerting definido.

Owner: Platform.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: strategy documentada.

---

## 22) Seguridad y privacidad

### ENG-22.1 (P0) Modelo de auth

Decisión: OpenAPI usa BearerAuth; refresh/rotation policy **TBD**.

Racional: Auth flows definidos en OpenAPI pero sin política detallada.

Owner: Security + Backend.

Fecha objetivo: TBD.

Ejemplo: `BearerAuth` en endpoints protegidos.

Criterio de aceptación: política de tokens documentada.

### ENG-22.2 (P0) Autorización

Decisión: Roles por torneo + scopes globales; staff separado para admin overlay.

Racional: D.7 y D.21; clasificación A.7.

Owner: Security + Product.

Fecha objetivo: 2026-02-02.

Ejemplo: `GetTournament` requiere membership.

Criterio de aceptación: policies explícitas por endpoint.

### ENG-22.3 (P0) Admin isolation

Decisión: `admin.*` requiere staff auth separado y `X-Admin-Justification`.

Racional: D.21.

Owner: Security + Admin.

Fecha objetivo: 2026-02-02.

Ejemplo: `X-Admin-Justification` obligatorio.

Criterio de aceptación: endpoints admin con guardrails.

### ENG-22.4 (P1) Threat model mínimo

Decisión: **TBD**.

Racional: No hay threat model documentado.

Owner: Security.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: threat model aprobado.

### ENG-22.5 (P1) Rate limiting

Decisión: Rate limits fuertes en social/chat/directory; límites exactos TBD.

Racional: D.13 menciona rate limits y anti‑spam.

Owner: Security + Platform.

Fecha objetivo: TBD.

Ejemplo: rate limit en `ListMessages`.

Criterio de aceptación: límites definidos por endpoint.

---

## 23) OpenAPI como contrato

### ENG-23.1 (P0) OpenAPI como shipped contract vs roadmap

Decisión: OpenAPI es la fuente de verdad del contrato shipped; cambios siguen protocolo formal.

Racional: ADR 0006 y openapi-change-protocol.

Owner: Architecture.

Fecha objetivo: 2026-02-03.

Ejemplo: cambios comienzan en `packages/api/openapi.yaml`.

Criterio de aceptación: no hay specs paralelas.

### ENG-23.2 (P0) operationId estables

Decisión: operationId deben ser estables para tooling y gateways; cambios requieren protocolo.

Racional: OpenAPI actual usa operationId en todos los endpoints.

Owner: Architecture.

Fecha objetivo: 2026-02-03.

Ejemplo: `operationId: listMyAppeals`.

Criterio de aceptación: operationId no se renombra sin ADR.

### ENG-23.3 (P0) Breaking changes

Decisión: Breaking changes requieren protocolo de OpenAPI + ADR; greenfield permite cambios pero documentados.

Racional: openapi-change-protocol + ADR 0013.

Owner: Architecture.

Fecha objetivo: 2026-02-03.

Ejemplo: cambios en schema deben pasar `openapi:verify`.

Criterio de aceptación: protocolo seguido.

### ENG-23.4 (P1) Versionado de endpoints vs payloads

Decisión: **TBD**.

Racional: No hay política de versionado de endpoints.

Owner: Architecture.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: policy documentada.

### ENG-23.5 (P1) Endpoints agregados

Decisión: **TBD**.

Racional: No hay budget de llamadas ni endpoints agregados definidos.

Owner: Architecture + Product.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: catálogo de endpoints agregados.

---

## 24) Mock-first

### ENG-24.1 (P0) Definición de paridad

Decisión: Paridad = mismo shape + status codes + errores básicos; latencia/ordering adverso TBD.

Racional: Mocks implementan shape pero no hay definición formal de latencia.

Owner: Architecture.

Fecha objetivo: TBD.

Ejemplo: mock devuelve mismas schemas que OpenAPI.

Criterio de aceptación: spec de paridad documentada.

### ENG-24.2 (P0) Garantía de paridad en CI

Decisión: `openapi:verify` asegura código generado; no hay gate formal de paridad mock por operación (TBD).

Racional: CI actual valida OpenAPI y typecheck, pero no coverage de mocks.

Owner: Architecture + Platform.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: cobertura mock automatizada por operación.

### ENG-24.3 (P1) Datos del mock

Decisión: Fixtures deterministas; random controlado si se usa scenario engine.

Racional: api-mock incluye scenario engine y fixtures en repo.

Owner: Platform.

Fecha objetivo: 2026-02-03.

Ejemplo: `packages/api-mock/src/mock-db.ts`.

Criterio de aceptación: mocks deterministas reproducibles.

### ENG-24.4 (P1) Casos adversos

Decisión: Scenario engine soporta delays/status; políticas específicas TBD.

Racional: api-mock scenario engine documentado en CURRENT.

Owner: Platform.

Fecha objetivo: 2026-02-03.

Ejemplo: scenario con delay y status.

Criterio de aceptación: escenarios adversos documentados.

---

## 25) Testing (engine-first)

### ENG-25.1 (P0) Test pyramid

Decisión: No UI tests (ADR 0002); tests de algoritmos puros y smoke de mock server.

Racional: Política de testing del repo.

Owner: Architecture.

Fecha objetivo: 2026-02-03.

Ejemplo: `smoke:scenario` en api-mock.

Criterio de aceptación: UI tests inexistentes, algoritmos con unit tests.

### ENG-25.2 (P0) Cobertura mínima por módulo

Decisión: **TBD**.

Racional: No hay definición de cobertura por módulo.

Owner: Architecture.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: policy de cobertura por módulo.

### ENG-25.3 (P0) Fixtures

Decisión: Fixtures viven en dominios (`tournaments/fixtures`) y en api-mock; versionado manual.

Racional: estructura actual del repo.

Owner: Domain owners.

Fecha objetivo: 2026-02-04.

Ejemplo: `packages/rankup/src/domains/tournaments/fixtures`.

Criterio de aceptación: fixtures actualizados junto con OpenAPI.

### ENG-25.4 (P1) Determinismo/replay tests

Decisión: **TBD**.

Racional: No hay tests definidos para replay.

Owner: Scoring.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: golden tests para scoring.

### ENG-25.5 (P1) Performance tests

Decisión: **TBD**.

Racional: No hay benchmarks definidos.

Owner: Scoring + Platform.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: benchmarks documentados.

---

## 26) DX, guardrails y mantenibilidad

### ENG-26.1 (P0) Enforcement de boundaries

Decisión: boundaries se enforce con guardrails (`scripts/repo-guardrails.ts`) y export maps; no ESLint boundaries formales.

Racional: repo guardrails activos en `yarn validate`.

Owner: Architecture.

Fecha objetivo: 2026-02-03.

Ejemplo: guardrail de gateways sin `...api*`.

Criterio de aceptación: guardrails pasan en CI.

### ENG-26.2 (P0) Correctness vs formatting

Decisión: guardrails son correctness invariants; Prettier/TSLint manejan formato.

Racional: scripts separan reglas de formato y de arquitectura.

Owner: Architecture.

Fecha objetivo: 2026-02-03.

Ejemplo: multi‑line imports prohibidos (correctness guardrail).

Criterio de aceptación: lint/guardrails diferencian ambos tipos.

### ENG-26.3 (P1) Code owners

Decisión: **TBD**.

Racional: No hay CODEOWNERS.

Owner: Engineering leadership.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: CODEOWNERS o policy definida.

### ENG-26.4 (P1) Política de ADR

Decisión: Cambios estructurales requieren ADR + protocol (`docs/engineering/structural-change-protocol.md`).

Racional: docs de ingeniería definen el proceso.

Owner: Architecture.

Fecha objetivo: 2026-02-03.

Ejemplo: ADR 0044 para registry.

Criterio de aceptación: cambios estructurales con ADR y log.

### ENG-26.5 (P1) Release discipline

Decisión: **TBD**.

Racional: No hay política de release/versionado de paquetes.

Owner: Release management.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: policy documentada.

---

## 27) Evolución: nuevo deporte / modo / capability

### ENG-27.1 (P0) Checklist “Add new sport”

Decisión: **TBD**.

Racional: No hay checklist formal; se infiere de sports ACL y schedule.

Owner: Sports domain.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: checklist publicado.

### ENG-27.2 (P0) Checklist “Add new mode”

Decisión: **TBD**.

Racional: No hay checklist formal; se infiere de rulesets y scoring.

Owner: Rules + Scoring.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: checklist publicado.

### ENG-27.3 (P1) Garantías

Decisión: No romper torneos existentes; rulesets inmutables; replay determinista.

Racional: A.3 y D.6.

Owner: Architecture.

Fecha objetivo: 2026-02-02.

Ejemplo: reglas nuevas no alteran rankings históricos.

Criterio de aceptación: snapshots mantienen ruleset original.

### ENG-27.4 (P1) Pruebas para modo nuevo

Decisión: **TBD**.

Racional: No hay policy de golden tests por modo.

Owner: Scoring + Rules.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: policy definida.

---

## 28) Preguntas específicas sobre placeholders

### ENG-28.1 (P0) algorithms/* scoring exacto

Decisión: **TBD**; ScorePrediction es el primer modo, pero no hay algoritmo codificado en `algorithms/`.

Racional: algorithms está scaffolded y sin reglas completas.

Owner: Scoring + Rules.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: algoritmo ScorePrediction documentado y testeado.

### ENG-28.2 (P0) runtime/* use‑cases core

Decisión: **TBD**; el doc de partición propone `ITourneyContextService` y `IGameRuntimeService` como base.

Racional: `docs/architecture/rankup-engine-domain-partitioning.md` sección runtime.

Owner: Architecture.

Fecha objetivo: TBD.

Ejemplo: `ResolveEffectiveRules(tournamentId)` como caso de uso.

Criterio de aceptación: runtime con 3 casos de uso definidos.

### ENG-28.3 (P0) registry/* defaults

Decisión: **TBD**; registry aún placeholder.

Racional: `packages/rankup/src/registry/**` solo contiene README.

Owner: Architecture.

Fecha objetivo: TBD.

Ejemplo: N/A.

Criterio de aceptación: registry con entries de gameModeId/sportId.

### ENG-28.4 (P0) Mínimo viable para placeholders

Decisión: Usar los contratos mínimos definidos en `docs/negocio/documento-contratos-dominio-rankup.md`:

- `tournaments.preview`: campos listados en sección E.1 (id, name, schedule, participantsCount, etc.).
- `scoring/results`: `GetMatchdayResults` por matchday.
- `scoring/timeline`: `GetPositionTimeline` con deltas por usuario.
- `verified.tournaments`: `VerifiedTournamentAttachment` + `ListVerifiedEventTournaments`.

Racional: Los contratos de negocio ya definen mínimo viable aunque no esté implementado.

Owner: Domain owners (Tournaments, Scoring, Verified).

Fecha objetivo: TBD.

Ejemplo: preview fields `{tournamentId, name, verificationStatus, schedule}`.

Criterio de aceptación: capabilities creadas con contracts + gateways + mocks.

---

# Apéndice — Evidencia utilizada

- `docs/negocio/documento-contratos-dominio-rankup.md`
- `docs/architecture/rankup-engine-domain-partitioning.md`
- `docs/domain/glossary.md`
- `packages/api/openapi.yaml`
- `apps/rankup-spa/lib/composition-root.ts`
- `apps/rankup-spa/lib/app-services.ts`
- `packages/api-mock/src/index.ts`
- Guardrails en `scripts/repo-guardrails.ts` y `scripts/repo-ratchet.ts`
