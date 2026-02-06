# Rankup — Mapa de Bounded Contexts (Refactor)

**Versión:** 2026-02-02
**Objetivo:** Definir límites de responsabilidad y propiedad de datos para diseñar OpenAPI por fases **sin acoplar dominios**.
**Nota:** No define endpoints; define *módulos de dominio*. La OpenAPI se organiza en tags jerárquicos alineados con estos contextos.

---

## 1) Principios de partición (para evitar deuda)

1) **Un contexto “posee” sus datos** (source of truth).
2) Integración preferente por **eventos de dominio** + lecturas síncronas solo para “read models”.
3) **Rulesets inmutables versionados** (evita romper histórico).
4) **Submissions ≠ Scoring ≠ Ranked/Achievements** (separación clave).
5) **Sports provider** detrás de ACL (Anti-Corruption Layer) para no contaminar el dominio.
6) **Backoffice** es una capa privilegiada (staff-only) con auditoría estricta; no “un dominio aparte” que invente datos.

---

## 2) Lista de bounded contexts (sin solapes)

### Core juego (imprescindibles)
1. **Identity & Access** (Auth)
2. **Profiles, Privacy & Devices** (Me)
3. **Users Directory** (Users)
4. **Sports Catalog & Schedule** (Sports)
5. **Tournaments & Membership** (Tournaments + invitations + membership)
6. **Game Modes & Rules** (Rules registry + effective rules)
7. **Submissions** (Gameplay user actions)
8. **Scoring & Rankings** (Results + live ranking)

### Engagement (retención “viva”)
9. **Live Feed & Notifications** (Live)
10. **Chat & Community** (Chat)
11. **Stats / Recap / Wrapped** (Stats)

### Programas (lo que da “validez”)
12. **Verified Hub & Events** (Verified)
13. **Creators Platform** (Creadores)
14. **Ranked Progression** (Ranked: rating/divisiones/temporadas)
15. **Achievements** (verificados)

### Monetización y seguridad (con guardrails)
16. **Promotions & Rewards** (sin betting)
17. **Trust & Safety & Anti-Fraud** (Trust & Safety)

### Plataforma / infraestructura (necesario para branding)
18. **Uploads & Media** (assets/avatars/branding)

### Capa operativa (staff-only)
19. **Admin / Backoffice** (overlay + auditoría)

---

## 3) Context map (dependencias recomendadas)

- **Sports Catalog & Schedule** publica eventos → **Scoring & Rankings** y **Live**
- **Game Modes & Rules** se consulta desde → **Submissions** y **Scoring**
- **Tournaments & Membership** autoriza → **Submissions**, **Chat**, **Rankings**
- **Verified Hub & Events** habilita → **Ranked** y **Achievements** (y define catálogo curado)
- **Scoring & Rankings** publica snapshots → **Ranked**, **Achievements**, **Live**, **Stats**
- **Trust & Safety** aplica restricciones a → **Profiles**, **Chat**, **Tournaments**, **Ranked**
- **Promotions & Rewards** consume → resultados verificados y señales anti-fraude
- **Uploads & Media** sirve assets a → Profiles/Tournaments/Creators/Verified/Promotions
- **Admin/Backoffice** opera sobre *todos* (pero con contratos auditables)

---

## 4) Detalle por contexto (misión, ownership, invariantes)

> Formato: **Misión** · **Posee** · **Invariantes** · **Eventos clave** · **Superficies OpenAPI**

---

### 4.1 Identity & Access
- **Misión:** autenticación, sesiones, refresh, recuperación de contraseña.
- **Posee:** identidades, sesiones, revocación.
- **Invariantes:** tokens revocables, rotación refresh, re-auth para acciones sensibles.
- **Eventos:** `identity.user_registered`, `identity.session_issued`, `identity.session_revoked`.
- **OpenAPI tags:** `auth.*`

---

### 4.2 Profiles, Privacy & Devices
- **Misión:** perfil, preferencias, privacidad, dispositivos/push tokens.
- **Posee:** username, avatar, bio, privacy flags, notification prefs, devices.
- **Invariantes:** username válido (filtro + política), privacidad coherente, quiet hours.
- **Eventos:** `profile.updated`, `privacy.updated`, `device.registered`.
- **OpenAPI tags:** `me.*`

---

### 4.3 Users Directory
- **Misión:** directorio y perfil público (según privacidad).
- **Posee:** “read model” público/semipúblico, búsqueda limitada.
- **Invariantes:** respeta blocks/privacidad; evita scraping (rate limits).
- **Eventos:** consume `profile.updated`.
- **OpenAPI tags:** `users.*`

---

### 4.4 Social Graph
- **Misión:** friends, follow, blocks, invitaciones sociales (direct-to-user).
- **Posee:** edges friend/follow/block, requests.
- **Invariantes:** block domina; anti-spam (límites de requests).
- **Eventos:** `social.friend_requested`, `social.friend_accepted`, `social.user_blocked`.
- **OpenAPI tags:** `social.*` (y parte de invites directas)

---

### 4.5 Sports Catalog & Schedule (con ACL)
- **Misión:** mundo real (competitions, seasons, matchdays, matches, events).
- **Posee:** calendario normalizado interno + correcciones.
- **Invariantes:** estados monotónicos; correcciones explícitas; dedupe por providerEventId.
- **Eventos:** `sports.match_event_recorded`, `sports.match_finished`, `sports.match_corrected`.
- **OpenAPI tags:** `sports.*`

---

### 4.6 Tournaments & Membership
- **Misión:** crear/gestionar torneos, join rules, membership, roles.
- **Posee:** tournament metadata, joinPolicy, invitation codes, membership.
- **Invariantes:** no doble membership; cambios de settings limitados por estado; sin espectador.
- **Eventos:** `tournament.created`, `tournament.member_joined`, `tournament.updated`.
- **OpenAPI tags:** `tournaments.*`, `invitationCodes.*`, `tournamentMembers.*`, `matchdays.nav.*` (navegación)

---

### 4.7 Game Modes & Rules
- **Misión:** catálogo de modos y rulesets versionados, validación y resolución de reglas efectivas.
- **Posee:** gameMode registry, rulesets inmutables, templates.
- **Invariantes:** rulesets publicados no se editan; solo nueva versión; compatibilidad histórica (sin migraciones).
- **Estados ruleset:** `active` (seleccionable), `deprecated` (visible, no seleccionable), `retired` (oculto, resoluble para histórico).
- **Mapping clave:** tournamentId → rulesetVersionId (rulesets globales por gameMode).
- **Eventos:** `ruleset.published`, `ruleset.deprecated`.
- **OpenAPI tags:** `gameModes.*`, `rules.*`

---

### 4.8 Submissions
- **Misión:** registrar acciones del usuario (modo-agnóstico) por torneo/jornada.
- **Posee:** submission sets, lock state, timestamps, idempotency.
- **Invariantes:** no editar tras lock; validación por ruleset; idempotencia fuerte.
- **Eventos:** `submission.upserted`, `submission.locked`.
- **OpenAPI tags:** `submissions.*`

---

### 4.9 Scoring & Rankings
- **Misión:** calcular puntos y publicar rankings (matchday + total) + live ranking.
- **Posee:** score ledger, snapshots versionados, timeline de posiciones.
- **Invariantes:** recomputable + auditable; correcciones crean nueva versión.
- **Eventos:** `ranking.snapshot_published`, `ranking.corrected`.
- **OpenAPI tags:** `rankings.*`, `results.*`, `liveRanking.*`

---

### 4.10 Live Feed & Notifications
- **Misión:** feed de eventos y notificaciones push/in-app (dedupe, anti-fatiga).
- **Posee:** feed items, notification deliveries, subscription preferences (o reference).
- **Invariantes:** dedupe; rate-limit; respeta preferencias.
- **Eventos:** consume sports + scoring + social.
- **OpenAPI tags:** `live.*`

---

### 4.11 Chat & Community
- **Misión:** chat por torneo/comunidad + moderación por roles.
- **Posee:** mensajes, moderación, estado de lectura.
- **Invariantes:** rate limits; borrado/moderación auditable en verificados.
- **Eventos:** `chat.message_sent`, `chat.message_deleted`, `chat.user_muted`.
- **OpenAPI tags:** `chat.*`

---

### 4.12 Stats / Recap / Wrapped
- **Misión:** read models de historial y recaps (por torneo y por usuario).
- **Posee:** agregados derivados (position timeline, MVPs, wrapped artifacts).
- **Invariantes:** reproducible desde scoring; privacidad (solo lo permitido).
- **Eventos:** consume ranking snapshots + tournament lifecycle.
- **OpenAPI tags:** `stats.*`

---

### 4.13 Verified Hub & Events
- **Misión:** catálogo curado de eventos verificados y su composición (tournaments).
- **Posee:** verified event records, hub curation, branding, eligibility.
- **Invariantes:** no spectator → preview mínimo; reglas y policies aprobadas.
- **Eventos:** `verified.event_published`, `verified.tournament_attached`.
- **OpenAPI tags:** `verified.*`

---

### 4.14 Creators Platform
- **Misión:** identidad del creador, catálogo y branding; (potencial) comunidades.
- **Posee:** creator profiles, links, featured collections.
- **Invariantes:** anti-spam; moderación/roles si hay comunidad.
- **Eventos:** `creator.updated`, `creator.verified`.
- **OpenAPI tags:** `creators.*`

---

### 4.15 Ranked Progression
- **Misión:** rating por game mode (verificado), temporadas, divisiones, leaderboards.
- **Posee:** rating ledger, season state, tier definitions.
- **Invariantes:** solo verificado mueve rating; resets auditables.
- **Eventos:** consume ranking snapshots verificados; publica `rank.changed`, `season.ended`.
- **OpenAPI tags:** `ranked.*`

---

### 4.16 Achievements
- **Misión:** definiciones y grants de logros verificados.
- **Posee:** achievement definitions, grants, evidence references.
- **Invariantes:** solo verificado otorga prestigio; grants inmutables (con revocación auditada si hay fraude).
- **Eventos:** `achievement.unlocked`, `achievement.revoked`.
- **OpenAPI tags:** `achievements.*`

---

### 4.17 Promotions & Rewards
- **Misión:** campañas oficiales y premios (sin betting), claim/fulfillment.
- **Posee:** promotions, eligibility snapshots, reward grants, fulfillment profile.
- **Invariantes:** T&Cs versionadas + opt-in; antifraude; privacidad de ganadores.
- **Eventos:** `reward.granted`, `reward.claimed`, `reward.fulfilled`.
- **OpenAPI tags:** `promotions.*`

---

### 4.18 Trust & Safety & Anti-Fraud
- **Misión:** reportes, enforcement, appeals, políticas públicas, antifraude.
- **Posee:** reports, enforcement actions, appeals, policy docs, signals.
- **Invariantes:** auditoría obligatoria para acciones sensibles; transparencia user-facing.
- **Eventos:** `trust.report_submitted`, `trust.user_restricted`.
- **OpenAPI tags:** `trustSafety.*`

---

### 4.19 Uploads & Media
- **Misión:** uploads direct-to-storage + media registry + variants.
- **Posee:** upload sessions, media metadata, moderation status.
- **Invariantes:** purpose + scope autorizado; constraints (size/type); scanning/moderation.
- **Eventos:** `media.created`, `media.approved/rejected`.
- **OpenAPI tags:** `uploads.*`

---

### 4.20 Admin / Backoffice (staff-only)
- **Misión:** operar verificados, promos, T&S, correcciones, recomputes; con auditoría.
- **Posee:** *no debería ser source of truth*; es capa de control con audit log.
- **Invariantes:** Staff auth separado + `X-Admin-Justification` + audit inmutable.
- **OpenAPI tags:** `admin.*`

---

## 5) Decisiones estructurales congeladas (para que OpenAPI no se rompa)

- rulesets versionados inmutables
- preview mínimo (sin spectator)
- rating por game mode + XP global (si aplica)
- separación Submissions/Scoring/Ranked/Achievements
- sports ACL + correcciones como eventos explícitos
- uploads/media como servicio con purpose/scope

---
