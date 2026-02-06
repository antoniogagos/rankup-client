# Rankup — Docs “teoría” (cómo usar esta carpeta)

**Objetivo de la carpeta:** mantener una fuente de verdad clara y no ambigua de **negocio → dominio → contratos** para que la OpenAPI se pueda construir por fases sin deuda ni solapes.

Esta carpeta **no** contiene la OpenAPI en sí. Contiene el “por qué” y el “qué significa” de cada capability.

---

## 1) Qué documento es para qué

### `00-documento-fundacional-rankup.md`
**Qué es:** la tesis del producto y las decisiones estructurales.
**Para qué sirve:** alinear equipo (founders/product/engineering) antes de diseñar endpoints.

Incluye:
- North Star y “no negociables” (no betting, tournament-centric, sin espectadores, app viva, baja fricción).
- Modelo de validez: **Privado para diversión** + **Verificado para prestigio**.
- Hipótesis de descubrimiento (Hub curado vs buscador).
- Progresión recomendada (rating por game mode + XP global).
- Decisiones **congeladas** vs **pendientes** y roadmap por fases.

**Regla práctica:** si algo cambia el propósito del producto o su “mental model”, se actualiza aquí primero.

---

### `01-contextos-propuestos.md`
**Qué es:** mapa de bounded contexts y ownership.
**Para qué sirve:** evitar que la OpenAPI cree endpoints que escriben/leen de “todos lados” sin un dueño claro.

Incluye:
- Contextos (Auth, Me, Social, Sports, Tournaments, Rules, Submissions, Rankings, Live, Chat, Stats, Verified, Creators, Ranked, Achievements, Promotions/Rewards, Trust & Safety, Uploads/Media, Admin).
- Qué contexto **posee** qué datos.
- Invariantes y dependencias recomendadas.
- Superficies OpenAPI (tags) para mantener una estructura consistente.

**Regla práctica:** antes de inventar un endpoint nuevo, decide primero **en qué contexto vive**.

---

### `02-mapa-de-contratos-de-dominio.md`
**Qué es:** contratos de dominio en “Formato B” (comandos, lecturas, eventos, invariantes, autorización).
**Para qué sirve:** traducir el negocio a contratos implementables y trazables a OpenAPI.

Incluye:
- Convenciones globales: IDs, tiempo, idempotencia, concurrencia, paginación, caching, privacidad.
- Event envelope y semántica de entrega (at-least-once, ordering por aggregate).
- Contratos por contexto (qué comandos/lecturas existen y qué garantizan).
- Contratos transversales (p. ej., **preview mínimo** para Hub sin violar “no spectator”).

**Regla práctica:** si un endpoint no se puede explicar como un contrato (write/read + invariantes), no debería existir.

---

## 2) Flujo de trabajo recomendado (de idea → OpenAPI)

Cuando aparezca una feature nueva o se cambie una existente:

1) **Actualizar 00 (Fundacional)**
   - ¿Encaja con la tesis? ¿Rompe un no-negociable?
   - ¿Afecta “Privado vs Verificado”?
   - ¿Es decisión congelada o pendiente?

2) **Validar en 01 (Bounded contexts)**
   - ¿Qué contexto posee los datos?
   - ¿Qué contextos consumen/publican eventos?
   - ¿Hay read models necesarios (Stats, Verified Hub)?

3) **Formalizar en 02 (Contratos)**
   - Definir el comando/read: inputs/outputs, invariantes, errores esperables.
   - Añadir idempotencia, concurrencia y policies de autorización.
   - Si hay cross-context, definir el evento y su payload mínimo estable.

4) **Implementar en OpenAPI (fuera de esta carpeta)**
   - Crear/actualizar endpoints alineados con contratos.
   - Reutilizar schemas y componentes existentes (no duplicar).
   - Mantener la jerarquía de tags y la coherencia de naming.

---

## 3) Trazabilidad: cómo se conecta todo

### 00 → 01
- 00 define *qué es Rankup* y sus guardrails.
- 01 define *dónde vive cada responsabilidad* (ownership).

Ejemplo:
- **“Sin espectadores”** (00)
  → obliga a separar **preview mínimo** vs **detalle member-only** (01: Verified/Tournaments)

### 01 → 02
- 01 define “quién manda” sobre un dato.
- 02 define “qué contratos expone el dueño” (writes/reads/events).

Ejemplo:
- **Tournaments & Membership** (01)
  → contratos: `JoinTournament`, `LeaveTournament`, `RotateInvitationCode`, `GetTournamentPreview`, etc. (02)

### 02 → OpenAPI
- Cada contrato se convierte en:
  - un endpoint de escritura (command) o lectura (read),
  - con sus schemas, errores y policies.
- Si un contrato emite/consume eventos, OpenAPI **no** los implementa como endpoints salvo que haya un “event stream” explícito; OpenAPI documenta la parte HTTP, y el event envelope queda como contrato interno.

---

## 4) Convenciones de organización OpenAPI (para no desordenar)

### 4.1 Tags jerárquicos (“folder tags”)
- El árbol de la API debe reflejar 01 (bounded contexts).
- Convención de tags: `context.subarea` (dot-separated), p. ej.:
  - `tournaments.lifecycle`
  - `tournaments.members`
  - `ranked.profile`
  - `verified.hub`
- La jerarquía se define en los **Tag Objects** (`tags[].parent`).
  Las operaciones solo usan `tags: ["..."]`.

> Nota: el renderizado depende del tooling; la semántica se mantiene estable.

### 4.2 Nombres de endpoints
- RESTful, recursos en plural, paths estables (sin localización en URL).
- Actions explícitas solo cuando no encajan como recurso (p. ej., `/publish`, `/unpublish` en staff).

### 4.3 Políticas transversales (obligatorias)
- Writes: `Idempotency-Key` donde aplique.
- Concurrencia: `If-Match`/ETag o `expectedVersion` en recursos “sensibles”.
- Member-only: enforcement estricto (sin spectator).
- Staff-only: auth separado + `X-Admin-Justification` + audit log.

---

## 5) Qué NO debe ocurrir (antipatrones)

- Añadir endpoints “por UI” sin contrato de dominio en 02.
- Duplicar la verdad (ej. rankings calculados en Submissions).
- Permitir lectura completa de torneos sin membership (“espectador accidental”).
- Mezclar “verificado” y “privado” en el mismo sistema de prestigio (rompe validez).
- Crear un “search de torneos” plano sin drivers de motivación (se vuelve ruido).

---

## 6) Cómo mantener esto actualizado (sin desengaño)

- **Si hay conflicto** entre documentos:
  1) 00 manda en visión/guardrails.
  2) 01 manda en ownership/límites.
  3) 02 manda en semántica de contrato.
  4) OpenAPI manda en forma final del HTTP contract.

- Cada cambio importante debe:
  - actualizar la sección de “decisiones congeladas vs pendientes” (00),
  - y dejar claro el impacto en contratos (02).

---

## 7) Checklist rápida antes de abrir PR de OpenAPI

- [ ] ¿Existe la necesidad en 00 (o al menos no la contradice)?
- [ ] ¿Está asignado el contexto dueño en 01?
- [ ] ¿Está definido el contrato (write/read/invariantes) en 02?
- [ ] ¿El endpoint respeta “no spectator” y el modelo “Privado vs Verificado”?
- [ ] ¿Tiene idempotencia/concurrencia si aplica?
- [ ] ¿Reutiliza componentes/schemas existentes (no duplicación)?

---
