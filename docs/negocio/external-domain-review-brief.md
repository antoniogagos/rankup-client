# Rankup Engine - External Domain Review Brief

Date: 2026-02-03

## 1) Purpose and scope

Provide an external, unbiased review of the domain model for Rankup Engine. The goal is to decide:

- Which domains should exist in Rankup Engine (now and later).
- Which non-domain layers should live inside Rankup Engine.
- How to partition ownership, responsibilities, and dependencies to support the product roadmap.

This brief is self-contained and summarizes the required business and technical context. It does not prescribe a solution.

## 2) Product summary (business context)

Rankup is a tournament-centric, social competitive game. Users create or join tournaments and compete within that tournament only.
There is no real-money betting. The product emphasizes:

- Private play for fun, verified play for prestige.
- No spectator mode: pre-join access is a minimal preview only.
- ScorePrediction is the current primary mode (predict scores before lock time).
- The game must scale to multiple sports and multiple game modes over time.

## 3) Non-negotiable business constraints

These are frozen decisions and must not be violated:

- No real-money betting.
- Tournament-centric gameplay.
- No spectator mode; preview must be minimal.
- Rulesets are immutable and versioned (new version replaces old).
- Submissions, Scoring, Ranked, Achievements are separate concerns.
- Sports provider is behind an Anti-Corruption Layer (ACL).
- Backoffice is a staff-only operational layer with strict audit, not a data owner.

## 4) Roadmap (present and future)

Fase 0 (MVP social privado + ScorePrediction basico)
- Auth + profile
- Friends + invite to tournament
- Create/join private tournament
- Submissions + ranking + chat
- Basic notifications

Fase 1 (Verified Hub + ranked + achievements)
- Curated hub
- Verification + badge
- Ranked by mode + seasons
- Verified achievements
- Basic wrapped/recap per tournament

Fase 2 (Creators and communities)
- Creator catalog + branding + moderation
- Creator events in hub
- Community tooling

Fase 3 (New sports and new modes)
- Additional sports
- Mature draft mode and other game modes

## 5) Bounded contexts defined by business (full list)

Core game
1. Identity & Access (Auth)
2. Profiles, Privacy & Devices (Me)
3. Users Directory
4. Social Graph
5. Sports Catalog & Schedule (ACL)
6. Game Modes & Rules
7. Tournaments & Membership
8. Tournament Matchdays (navigation)
9. Submissions
10. Scoring & Rankings

Engagement
11. Live Feed & Notifications
12. Chat & Community
13. Stats / Recap / Wrapped

Programs (prestige)
14. Verified Hub & Events
15. Creators Platform
16. Ranked Progression
17. Achievements

Monetization and safety (no betting)
18. Promotions & Rewards
19. Trust & Safety & Anti-Fraud

Platform business services
20. Uploads & Media

Operational (staff-only)
21. Admin / Backoffice

## 6) Recommended context dependencies (context map)

- Sports Catalog publishes events to Scoring/Rankings and Live.
- Game Modes & Rules is consulted by Submissions and Scoring.
- Tournaments & Membership authorizes Submissions, Chat, Rankings.
- Verified Hub enables Ranked and Achievements.
- Scoring & Rankings publishes snapshots to Ranked, Achievements, Live, Stats.
- Trust & Safety applies restrictions to Profiles, Chat, Tournaments, Ranked.
- Promotions & Rewards consumes verified results and anti-fraud signals.
- Uploads & Media serves assets to Profiles, Tournaments, Creators, Verified, Promotions.
- Admin/Backoffice operates on all contexts with audit.

## 7) Current architecture state (technical present)

Rankup Engine is the product domain umbrella at:

- packages/rankup

Today, it contains only one domain:

- domains/tournaments

Tourney is split into capabilities:

- shared (ids/enums/user summary + shared validation)
- core (list/create/preview)
- matchdays (navigation + matches)
- ranking (ranking + windows)
- members (membership/roles)
- codes (invitation codes)
- invites (direct invites + inbox)
- analysis (pure algorithms, no IO)
- fixtures (deterministic data)

The UI lives in:

- apps/rankup-spa

The marketing site lives in:

- apps/rankup-web

## 8) Technical constraints (must not be violated)

- OpenAPI-first: HTTP contract source of truth in packages/api/openapi.yaml.
- Mock-first: the app must run locally without backend.
- UI cannot import SDK or runtime implementations; UI only consumes domain contracts/services.
- Composition root is the only place to select mock vs real implementations.
- Platform is infra-only and must not import product SDKs.
- TS-only repository sources (no tracked JS configs or sources).
- No UI/component tests (only algorithm tests where needed).

## 9) Non-domain layers planned (product-side, not UI)

The technical service catalog includes product layers that are not domains per se:

- Registry layer (e.g., game mode registry, sport catalog registry).
- Runtime layer (per-tourney context and game runtime).
- Algorithm layer (scoring engine, draft rules engine, odds calculator).

These do not yet have a defined physical location but may live inside Rankup Engine if desired.

## 10) Decision request (what you must decide)

Provide recommendations for:

1) Domain list for Rankup Engine
   - Minimum viable domains now.
   - Future domains to add based on roadmap.
2) Domain granularity and partitioning
   - Which contexts should be full domains vs capabilities under a single domain.
3) Ownership and boundaries
   - What data each domain owns.
   - What each domain can only consume.
4) Non-domain layers in Rankup Engine
   - Whether registry/runtime/algorithm layers belong in Rankup Engine.
   - Where they should live and how they are consumed.
5) Risks and trade-offs
   - Risks of many small domains vs fewer larger ones.
   - Impact on OpenAPI, mocks, and team ownership.
6) Recommended physical structure
   - Proposed folder layout under packages/rankup/src.

## 11) Expected deliverables

- A concrete domain map (table with domain, purpose, owned data, dependencies).
- A proposed future roadmap for domain rollout.
- A position on non-domain layers (registry/runtime/algorithm).
- Open questions and risks.

## 12) References (repo paths)

- docs/negocio/documento-fundacional-rankup.md
# Rankup — Documento Fundacional Unificado (Refactor)

**Versión:** 2026-02-02
**Estado:** Activo (living doc)
**Propósito:** Única fuente de verdad de **negocio + producto + decisiones estructurales**.
**No es** una especificación de API, pero **sí define** los pilares que la OpenAPI debe reflejar.

---

## 0) La tesis de Rankup (una frase)

**Rankup convierte eventos deportivos reales en un juego social “vivo” y de baja fricción, donde el prestigio (ranked/logros) solo se gana en competiciones verificadas, y lo privado existe para jugar con amigos sin presión.**

**Eje maestro (operativo):**
**Privado para diversión** + **Verificado para prestigio**.

---

## 1) North Star: qué queremos construir (y contra qué competimos)

### 1.1 North Star
Rankup quiere ser **la plataforma de juego de los deportes**: múltiples **game modes** (ScorePrediction, Draft “arena”, etc.) y múltiples **sports** (fútbol primero, luego baloncesto/esports/otros), con torneos como contenedor universal.

### 1.2 Contra quién competimos (sin copiar el modelo)
- Fantasy “clásico” con mercado/fichajes (Biwenger/Futmondo/Kickbase) — **alto conocimiento + alta fricción**.
- Apps de resultados (Sofascore/ESPN) — **información**, no juego social.
- Juegos tipo “arena/draft” (Hearthstone Arena como inspiración mecánica) — **baja fricción + loop claro**.
- Juegos live/competitivos móviles (Clash Royale como inspiración de “temporadas + ligas”) — progresión simple, visible y entendible.

**Decisión clave del producto:** Rankup no se construye alrededor de fichajes/mercado como núcleo.
Si algún día existe un “modo mercado”, será **un game mode adicional**, no la columna vertebral.

---

## 2) No negociables (guardrails)

1. **No betting / no gambling**.
   - Sin apuestas, sin probabilidades como mecánica de “wager”, sin cash-out, sin depósitos ni retiradas.
2. **Tournament-centric**: todo gameplay sucede dentro de un torneo/evento.
3. **Sin espectadores**: para ver el detalle real (chat, ranking completo, submissions), hay que ser miembro.
   - Sí permitimos **preview mínimo** (teaser) para decidir si unirse.
4. **La app debe sentirse “viva”**: el usuario entra por un gol y ve impacto (ranking/puntos/feed) con urgencia, no “estático”.
5. **Producto social contextual**:
   - Social = amigos / torneos / comunidades / eventos curados.
   - No feed global abierto de desconocidos.
6. **Baja fricción** como principio absoluto: “juega la abuela y el nieto” sin requerir saber plantillas, fichajes o 300 jugadores.

---

## 3) Usuario objetivo y filosofía de diseño (anti-fricción + skill ceiling)

### 3.1 Personas útiles (para decisiones)
- **Casual social**: quiere competir con amigos y reaccionar al directo. No optimiza.
- **Fan medio**: sabe “Madrid vs Barça”, no necesariamente conoce plantillas.
- **Competitivo**: quiere progresar y ganar estatus verificable.
- **Comunidad/creador**: quiere identidad y eventos propios (branding + moderación + comunidad).

### 3.2 Regla de diseño “dos capas”
- **Core loop accesible (obligatorio):** decisión clara en 30–60 segundos.
- **Capa avanzada (opcional):** stats, comparativas, tie-breakers, progresión, etc.

> La fricción **nunca** puede ser requisito para competir; solo puede ser ventaja voluntaria.

---

## 4) Primitivas del producto (vocabulario estable)

> Esto no es API: es el vocabulario mínimo común que debe permanecer estable.

- **User / Profile / Privacy / Devices**: identidad jugable y preferencias.
- **Social Graph**: friends, follow, blocks, invitaciones directas.
- **Tournament**: contenedor de juego + participantes + reglas + estado.
- **Game Mode**: reglas + UX + scoring.
- **Sport / Competition / Season / Matchday / Match**: calendario real.
- **Submission** (modo-agnóstico): acción del usuario (predicción/pick/etc.).
- **Scoring & Ranking**: puntos (ledger) + snapshots + timeline.
- **Live**: feed + notificaciones + eventos de “impacto”.
- **Verified Hub**: catálogo curado de eventos oficiales/verificados.
- **Creators**: identidad + catálogo + comunidad.
- **Ranked**: rating competitivo (ELO-like) + temporadas + divisiones.
- **Achievements**: logros verificados + vitrina.
- **Promotions/Rewards**: campañas oficiales y premios (sin betting).
- **Trust & Safety**: reportes, moderación, enforcement, antifraude.
- **Uploads/Media**: avatars, branding, assets.

---

## 5) Torneos: tipos, verificación y preview (sin espectadores)

### 5.1 Modalidad temporal
- **Torneo por jornada/evento**: dura una jornada o ventana corta.
- **Torneo de temporada**: acumula puntos a lo largo de varias jornadas.
- **Importante:** esto es **independiente** del game mode. Cada modo puede funcionar en ambos.

### 5.2 Reglas de join
- Unirse a mitad de temporada: **configurable por torneo**.
- Límite de jugadores: configurable (y crítico para escalado + UX).

### 5.3 Tipos por “validez”
Recomendación estable (porque conecta con progresión/logros):

1) **Privado (Friends & Family)**
- Entrada: invitación/código/amigos.
- Objetivo: diversión social + chat + ranking interno + recap.
- **No** altera prestigio público (ranked/logros verificados).

2) **Público no verificado (Community Open)** *(opcional / no MVP si mete ruido)*
- Entrada abierta.
- No da prestigio real, sirve para “jugar con desconocidos”.
- Riesgo: se vuelve “listado feo” si no hay incentivos.

3) **Verificado (Official / Sponsored / Creator Verified)**
- Curado por Rankup o creadores/partners verificados.
- **Única fuente** de:
  - ranked (rating/ELO),
  - logros de prestigio,
  - acceso a torneos élite,
  - premios oficiales (si existen).

### 5.4 Preview permitido (para no romper “sin espectador”)
Antes de unirse, se puede mostrar:
- nombre, banner, sello verificado, reglas resumidas, countdown, cupo, número de jugadores
- “qué se gana”: prestigio/logros/premios (si aplica)
- CTA: unirse / empieza pronto / join cerrado

Prohibido pre-join:
- chat, submissions de otros, ranking completo, histórico detallado.

---

## 6) Descubrimiento: el Hub (no un buscador)

### 6.1 Principio
**Descubrimiento ≠ listado plano.**
Debe ser un **Hub curado de eventos** (cards visuales), con narrativa y urgencia.

### 6.2 Qué debe contener el Hub (mínimo)
- **En vivo ahora**: partidos en directo + “tu ranking cambia”.
- **Esta semana**: eventos con cuenta atrás y “join cierra en X”.
- **Para ti**: recomendado por deporte + amigos + horarios.
- **Oficiales** (siempre): sello verificado + prestigio.
- **Creadores**: identidad de influencer, comunidad, moderación.
- **Tu progreso**: “tu siguiente paso” (ranked / división / objetivos).

### 6.3 “¿Por qué unirse a un torneo público?”
Solo funciona si activa (mínimo) 2 de estos drivers:
1) Progresión competitiva (rating/divisiones/temporadas)
2) Reconocimiento (ranking público verificado, títulos, hall of fame)
3) Acceso (eventos élite desbloqueables)
4) Recompensa (premios oficiales, trofeos raros)
5) Narrativa social (comunidad/creador/evento, no solo desconocidos)

---

## 7) Game modes (principios y decisiones)

### 7.1 Principios para cualquier modo
1) Se entiende en **30–60s**
2) Decisión simple y repetible
3) Feedback en directo (impacto visible)
4) Compatible con torneo jornada y temporada
5) Reglas **versionadas** y configurables (avanzado) por torneo

### 7.2 ScorePrediction (core)
Decisiones que deben quedar cristalinas (y versionadas):
- scoring completo (incl. negativos si existen)
- lock policy: kickoff, gracia, retrasos
- partidos postpuestos/cancelados: reglas de continuidad
- tie-breakers: consistentes y explicables
- “qué se predice” (marcador exacto vs 1X2 + extras) sin reventar la simplicidad

### 7.3 Draft “arena” (por jornada)
La versión alineada con Rankup (baja fricción):
- pool curado/limitado (evitar “300 jugadores”)
- picks rápidos y claros
- scoring transparente y explicado
- el experto puede optimizar, pero el casual puede jugar sin estudiar

> Si algún día entra un modo “mercado”, que sea **modo opcional** y segmentado.

---

## 8) Progresión: Ranked + XP (y la decisión crítica)

### 8.1 Decisión de menor riesgo (recomendada)
- **Rating competitivo (ELO-like) por game mode** (y solo verificado)
- **Progreso global (XP) unificado** como capa meta/no competitiva

**Por qué:** mezclar habilidades no comparables en un “global ELO” suele sentirse injusto y rompe confianza.

### 8.2 Temporadas y divisiones (modelo tipo Clash Royale, sin ruido)
- temporadas (p.ej. mensual / 6 semanas)
- reset parcial (“compresión”), no borrado
- divisiones pocas y claras (Bronce/Plata/Oro/Platino/Élite)
- recompensas: **cosmética de perfil** + trofeos históricos + acceso a eventos

**Regla anti-pay-to-win:** progreso desbloquea estética o acceso, nunca poder.

---

## 9) Achievements (verificados) y “validez”
- logros de prestigio solo en verificado (para que importen)
- privados pueden tener recap y “trofeos casuales” opcionales, pero no deben contaminar la vitrina pública verificada

---

## 10) Promociones y recompensas (oficiales, sin betting)

### 10.1 Torneos privados
Se puede permitir un campo “premio/castigo” **informativo**, pero:
- Rankup no gestiona dinero
- Rankup no cobra ni reparte botes
- no hay mecánicas de apuesta

### 10.2 Eventos oficiales / verificados
Se permiten premios tipo gift cards / hardware / etc., pero deben existir:
- T&Cs versionadas + opt-in explícito
- elegibilidad (edad/país/antifraude)
- reclamación y fulfilment (sin fricción excesiva pero robusto)
- transparencia (ganadores públicos con consentimiento o anonimización)

---

## 11) Social: amigos, follow y privacidad

### 11.1 Prioridad de features
1) amigos + invitación directa a torneo
2) link/código para grupos
3) follow (útil para creadores/top players) con anti-spam

### 11.2 Privacidad (principios)
- perfil: público / solo amigos / privado
- historial: por defecto mostrar público solo lo verificado (alineado con “validez”)
- blocks dominan cualquier interacción

---

## 12) Trust & Safety y antifraude (mínimo industrial)

- filtros de nombres (usuario/torneo/comunidad) por idioma
- reportes de usuarios y mensajes
- rate limiting en chat, invitaciones y creación de torneos
- enforcement visible al usuario (evitar “desengaño”)
- antifraude extra en eventos con premios (multi-cuenta, verificación de reclamación)

---

## 13) Live: notificaciones + feed (la app “viva”)

### 13.1 Catálogo de eventos (debe existir)
- deporte: goal, kickoff, final, red card, etc.
- juego: puntos asignados, ranking actualizado, “te han superado”
- social: invitación, amigo se une, mensaje destacado

### 13.2 Objetivo UX
Cuando ocurre un gol:
- push → in-app feed → ranking impact “en movimiento”
- no debe sentirse “estancado”

*(Tecnología: websockets/SSE/polling se decide después; el contrato de eventos es lo importante.)*

---

## 14) Stats / Wrapped: memoria y retención

### 14.1 Qué debemos almacenar sí o sí (para poder “wrapped”)
Por torneo:
- ranking por jornada + final
- evolución de posiciones
- momentos clave (cambios por goles)
- MVPs (exactos, rachas, etc.)

Por usuario:
- submissions, puntos por jornada, rachas, percentiles, rivalidades

### 14.2 Wrapped mínimo irresistible
- mejor jornada / mayor subida / rivalidad / aciertos top
- compartible sin exponer datos sensibles

---

## 15) Monetización (hipótesis compatibles)
A validar con criterio “sin traicionar producto”:
1) eventos verificados patrocinados (marca aporta premio + visibilidad curada)
2) suscripción premium sin pay-to-win (wrapped extendido, stats avanzadas, cosmética de perfil)
3) revenue share con creadores en comunidades verificadas

---

## 16) Decisiones congeladas vs pendientes (bloqueantes)

### 16.1 Congeladas (no deben romperse)
- tournament-centric
- no spectator (solo preview mínimo)
- rulesets versionados e inmutables
- histórico inmutable: resultados/rankings se evalúan con el ruleset original (sin migraciones; correcciones = nuevos snapshots)
- registry interno de game modes + rulesets versionados (sin extension host/manifest externo)
- prestigio (ranked/logros) solo en verificado
- rating competitivo por game mode + XP global

### 16.2 Pendientes (definir con prioridad)
1) reglas finales ScorePrediction (lock/postpuestos/tie-breakers/versionado)
2) definición exacta de “verificado” (criterios, quién crea, qué habilita)
3) estructura de temporadas (duración, reset, recompensas)
4) reglas de visibilidad pre-join de verificados (teaser exacto)
5) draft arena: qué se elige y cómo puntúa (sin fricción)
6) políticas de premios oficiales (elegibilidad + antifraude + claim)
7) social: equilibrio amigos/follow/privacidad defaults

---

## 17) Roadmap por fases (orientativa, alineada con dominios)

**Fase 0 (MVP social privado + ScorePrediction básico)**
- auth + perfil
- friends + invitación a torneo
- crear/join torneo privado
- submissions + ranking + chat
- notificaciones mínimas

**Fase 1 (Verified Hub + ranked + achievements)**
- hub curado
- verificación + sello
- ranked por modo + temporadas
- achievements verificados
- wrapped básico por torneo

**Fase 2 (Creadores y comunidades)**
- catálogo de creadores + branding + moderación
- eventos de creadores en hub
- herramientas de comunidad

**Fase 3 (nuevos deportes + nuevos modos)**
- baloncesto/esports/otros
- draft maduro + modos adicionales

---

## Cierre

Rankup no puede parecer “un buscador de ligas” ni un fantasy de nicho.
Debe sentirse como **un juego vivo**, social y verificable:
- privado = diversión,
- verificado = prestigio real,
- el directo = motor de urgencia y retorno.

- docs/negocio/documento-contextos-rankup.md
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

- docs/negocio/documento-contratos-dominio-rankup.md
# Rankup — Mapa de Contratos de Dominio (Formato B) (Refactor)

**Versión:** 2026-02-02
**Objetivo:** Definir *contratos de dominio* (comandos, lecturas, eventos, invariantes) por bounded context para construir OpenAPI por fases sin acoplar dominios.

> Este documento describe **qué significa** cada operación a nivel de negocio/arquitectura.
> La OpenAPI define **cómo** se expresa (paths/schemas), y debe ser trazable a estos contratos.

---

## A) Convenciones globales (aplican a todos los contextos)

### A.1 Identificadores
- IDs tipados: `userId`, `tournamentId`, `matchId`, `rulesetId`, `submissionSetId`, `mediaId`, `promotionId`, `rewardGrantId`, etc.
- Recomendación técnica: **ULID o UUIDv7** (ordenables; útiles para feeds).
- IDs canónicos (ASCII) para catálogos: `sportId`, `gameModeId`, `competitionId`.

### A.2 Tiempo
- Fechas RFC3339 UTC en contratos (`createdAt`, `updatedAt`, `occurredAt`).
- Evitar mezclar epoch en contratos; si existe, es derivado.

### A.3 Versionado y concurrencia
- Mutaciones críticas deben ser seguras ante overwrites:
  - `If-Match` con ETag, o
  - `expectedVersion` (int).
- Rulesets: **inmutables**. Cambios = nueva versión.
- Históricos: resultados/rankings se evalúan con el ruleset original; no hay migraciones entre versiones (correcciones = nuevos snapshots).

### A.4 Idempotencia
- Writes que crean/actualizan recursos deben aceptar `idempotencyKey`.
- Semántica: misma key + mismo actor + misma operación ⇒ mismo resultado.

### A.5 Paginación y “views” escalables
- Cursor-based: `pageSize`, `cursor`, `nextCursor`.
- Para rankings grandes: soportar vistas `topN` + `aroundMe`.

### A.6 Localización
- Contratos usan IDs canónicos; textos son localizables.
- Recomendación API: **no localizar rutas**. Locale por `Accept-Language` o param `locale`.

### A.7 Seguridad y clasificación de datos
- Separar claramente:
  - **public** (catálogos, políticas, promos públicas),
  - **authenticated** (perfil propio),
  - **member-only** (detalle de torneo),
  - **staff-only** (admin/backoffice).
- Staff-only siempre:
  - auth separado,
  - `X-Admin-Justification`,
  - audit log inmutable.

### A.8 “No espectador” con preview mínimo
- Detalle real del torneo (chat/ranking completo/submissions/histórico) requiere membership.
- Se permite un **Tournament Preview** limitado (teaser).

### A.9 Caching (criterio)
- Respuestas personalizadas o con signed URLs: `no-store`.
- Catálogos públicos: cache corto/medio según volatilidad.

---

## B) Contrato de eventos de dominio (envelope estándar)

### B.1 Envelope mínimo recomendado
- `eventId`
- `eventType` (string estable, p.ej. `tournament.member_joined`)
- `schemaVersion` (int)
- `producer` (boundedContext)
- `occurredAt` (UTC)
- `aggregate`:
  - `aggregateType`
  - `aggregateId`
  - `aggregateVersion`
- `correlationId` (traza request/flujo)
- `causationId` (evento previo)
- `payload` (objeto por `eventType`)

### B.2 Semántica de entrega
- At-least-once: consumidores idempotentes (dedupe por `eventId`).
- Ordering solo garantizable por `aggregateId` usando `aggregateVersion`.

---

## C) Context map (quién publica/consume)

- Sports → publica → Scoring, Live
- Rules → consultado por → Submissions, Scoring
- Tournaments → autoriza → Submissions, Chat, Rankings
- Verified → habilita → Ranked, Achievements, Promotions (elegibilidad)
- Scoring → publica → Ranked, Achievements, Live, Stats
- Trust & Safety → puede congelar/restringir → Chat, Ranked, Rewards
- Uploads/Media → sirve assets a → Profiles, Tournaments, Verified, Creators, Promotions
- Admin → opera sobre todo con auditoría

---

# D) Contratos por bounded context

> Formato:
> - **Agregados (propiedad)**
> - **Comandos (write contracts)**
> - **Lecturas (read contracts)**
> - **Eventos publicados**
> - **Eventos consumidos**
> - **Invariantes y fallos esperables**
> - **Autorización (policy)**

---

## D.1 Identity & Access

### Agregados
- `UserIdentity`, `Session`, `OAuthLink`, `PasswordReset`

### Comandos
- `RegisterUser(email|oauth, locale, country?)`
- `Authenticate(credentials|oauthCode)`
- `RefreshSession(refreshToken)`
- `RevokeSession(sessionId|refreshToken)`
- `RequestPasswordReset(email)`
- `ConfirmPasswordReset(token, newPassword)`
- `DeleteAccount(userId)` (requiere reauth)

### Lecturas
- `GetSessionContext(accessToken)` (interno)

### Eventos publicados
- `identity.user_registered`
- `identity.session_issued`
- `identity.session_revoked`
- `identity.user_deleted`

### Invariantes / fallos
- Rotación refresh tokens; revocación inmediata en delete.
- Registro idempotente (según política de email/identity).

### Autorización
- Público para register/login/reset.
- Autenticado para logout/delete.

---

## D.2 Profiles, Privacy & Devices

### Agregados
- `UserProfile`, `PrivacySettings`, `NotificationPreferences`, `Device`

### Comandos
- `UpdateProfile(userId, username, avatarMediaId?, bio?)`
- `UpdatePrivacy(userId, profileVisibility, historyVisibility, allowFriendRequests, allowFollows)`
- `UpsertDevice(userId, platform, pushToken, appVersion, locale)`
- `UpdateNotificationPreferences(userId, preferencesPatch)`

### Lecturas
- `GetMyProfile(userId)`
- `GetPublicProfile(viewerId, targetUserId)` (aplica privacidad + blocks)
- `ListMyDevices(userId)`

### Eventos publicados
- `profile.updated`, `privacy.updated`, `device.registered`, `preferences.updated`

### Invariantes / fallos
- Username pasa filtros + unicidad (si aplica).
- Cambios de privacidad deben reflejarse en “read models” y en feeds.

### Autorización
- Solo el propio usuario (writes).
- Reads según privacidad.

---

## D.3 Users Directory

### Agregados
- `PublicUserIndex` (read model derivado)

### Comandos
- Ninguno público; se deriva desde perfiles.

### Lecturas
- `SearchUsers(q, cursor)` (limitado, anti-scraping)
- `GetUserPublicProfile(userId)`

### Eventos consumidos
- `profile.updated`, `privacy.updated`, `trust.user_restricted`

### Invariantes / fallos
- Respeta blocks/privacidad.
- Rate limit fuerte.

---

## D.4 Social Graph

### Agregados
- `FriendRequest`, `Friendship`, `FollowEdge`, `BlockEdge`

### Comandos
- `SendFriendRequest(fromUserId, toUserId, message?)`
- `RespondFriendRequest(requestId, accept|decline)`
- `RemoveFriend(userId, friendId)`
- `FollowUser(followerId, followeeId)`
- `UnfollowUser(followerId, followeeId)`
- `BlockUser(blockerId, blockedId)`
- `UnblockUser(blockerId, blockedId)`

### Lecturas
- `ListFriends(userId)`
- `ListFollowers(userId)`
- `ListFollowing(userId)`
- `GetRelationship(viewerId, targetId)` (para UI)

### Eventos publicados
- `social.friend_requested`, `social.friend_accepted`, `social.user_followed`, `social.user_blocked`

### Invariantes / fallos
- Block domina: cancela follow + friend requests + invites.
- Anti-spam: límites diarios y por dispositivo.

---

## D.5 Sports Catalog & Schedule (ACL)

### Agregados
- `Sport`, `Competition`, `Season`, `Matchday`, `Match`, `Team`, `MatchEvent`

### Comandos (internos/ingesta)
- `UpsertMatch(...)`
- `RecordMatchEvent(matchId, providerEventId, type, minute, metadata)`
- `ChangeMatchStatus(matchId, newStatus)`
- `FinalizeMatch(matchId, result)`
- `CorrectMatch(matchId, correctedFields, reason)`

### Lecturas
- `ListCompetitions(sportId?, status?)`
- `GetCompetitionCalendar(competitionId, seasonId)`
- `GetMatchday(competitionId, seasonId, matchdayNumber)`
- `GetMatch(matchId)`

### Eventos publicados
- `sports.match_event_recorded`
- `sports.match_status_changed`
- `sports.match_finished`
- `sports.match_corrected`

### Invariantes / fallos
- Estado monotónico (LIVE no vuelve a NS).
- Corrección explícita y auditable.
- Dedupe por `providerEventId`.

---

## D.6 Game Modes & Rules

### Agregados
- `GameMode`, `RulesetSnapshot` (inmutable), `RulesetTemplate`

### Comandos (staff)
- `RegisterGameMode(gameModeId, capabilities, uiHints)`
- `PublishRulesetVersion(gameModeId, schema, scoring, tieBreakers, lockPolicy, parentVersionId?)`
- `DeprecateRulesetVersion(rulesetVersionId, sunsetAt?)`
- `RetireRulesetVersion(rulesetVersionId, reasonCode, reasonText?)`

### Lecturas
- `ListGameModes()` (resumen + latestVersionId)
- `GetGameMode(gameModeId)`
- `GetRulesetVersion(gameModeId, rulesetVersionId)`
- `GetLatestRulesetVersion(gameModeId)`
- `ResolveEffectiveRules(tournamentId)` (usa tournamentId → rulesetVersionId)

### Eventos publicados
- `ruleset.published`, `ruleset.deprecated`, `ruleset.retired`

### Invariantes / fallos
- Ruleset publicado no se edita; se versiona.
- Rulesets globales por gameMode; torneos apuntan a `rulesetVersionId`.
- Estados: `active` (seleccionable), `deprecated` (visible, no seleccionable), `retired` (oculto, resoluble histórico).
- Históricos inmutables: no migraciones entre ruleset versions; correcciones = nuevos snapshots.
- Validación de configuración por schema + hash de integridad.
- Auditoría mínima en snapshot: `createdAt`, `createdBy {id,type}`, `reasonCode`, `reasonText`, `correlationId`, `parentVersionId`, `schemaHash`, `source`.

---

## D.7 Tournaments & Membership

### Agregados
- `Tournament`, `TournamentMembership`, `JoinPolicy`, `InvitationCode`, `DirectInvite`, `TournamentSettings`

### Comandos
- `CreateTournament(ownerId, name, sportId, gameModeId, rulesetVersionId, competitionRef, seasonRef, modality, visibility, joinPolicy, settings)`
- `UpdateTournament(tournamentId, patch)` (limitado por estado)
- `RotateInvitationCode(tournamentId)`
- `JoinTournament(tournamentId, userId, invitationCode?)`
- `LeaveTournament(tournamentId, userId)`
- `KickMember(tournamentId, adminId, targetUserId, reason?)`
- `TransferOwnership(tournamentId, ownerId, newOwnerId)`
- `SetJoinPolicy(tournamentId, adminId, joinPolicyPatch)`
- `ArchiveTournament(tournamentId, adminId)`

### Lecturas
- `GetTournamentPreview(viewerId, tournamentId)` (pre-join safe)
- `GetTournament(tournamentId, memberId)` (requiere membership)
- `ListUserTournaments(userId, filters...)`
- `ListTournamentMembers(tournamentId, memberId)`

### Eventos publicados
- `tournament.created`, `tournament.updated`, `tournament.member_joined`, `tournament.member_left`, `tournament.member_kicked`, `tournament.archived`

### Eventos consumidos
- `verified.tournament_verified` (marca tournament como verified + branding)

### Invariantes / fallos
- No doble membership.
- No spectator: enforcement estricto.
- `gameModeId` + `rulesetVersionId` quedan fijados al crear el torneo.
- Cambios de rules/settings después de “start” deben ser muy limitados o versionados (nueva versión + nuevo snapshot).

---

## D.8 Tournament Matchdays (navegación)
> (Puede vivir como read model dentro de Tournaments o Sports; el contrato es lo importante.)

### Lecturas
- `ListTournamentMatchdays(tournamentId)` (qué matchdays existen / status)
- `GetTournamentMatchday(tournamentId, matchdayNumber)` (fixtures + estado)

### Invariantes
- Matchday status se deriva de matches + calendario real.
- Para torneos grandes, respuestas “ligeras” (paginación / lazy loading).

---

## D.9 Submissions (modo-agnóstico)

### Agregados
- `SubmissionSet` (userId+tournamentId+matchday), `SubmissionItem`, state `draft|submitted|locked`

### Comandos
- `UpsertSubmissionSet(userId, tournamentId, matchday, items[])`
- `SubmitSubmissionSet(userId, tournamentId, matchday)` *(si distinguís draft vs submit)*
- `LockSubmissionSet(tournamentId, matchday)` (interno por lockPolicy/kickoff)

### Lecturas
- `GetMySubmissionSet(userId, tournamentId, matchday)`
- `GetSubmissionAvailability(userId, tournamentId, matchday)` (open/closed + reason)

### Eventos publicados
- `submission.upserted`, `submission.submitted`, `submission.locked`

### Eventos consumidos
- `sports.match_status_changed` / kickoff para lock
- membership changes para permisos

### Invariantes / fallos
- No edits tras lock.
- Validación por ruleset efectivo.
- Idempotencia fuerte.

---

## D.10 Scoring & Rankings

### Agregados
- `ScoreLedger`, `RankingSnapshot`, `PositionTimeline`, `ScoreCorrection`

### Comandos (internos)
- `ApplyMatchFinished(matchId)` (deriva puntos si procede)
- `RecomputeTournament(tournamentId, reason, scope?)`
- `PublishRankingSnapshot(tournamentId, scope: matchday|total)`

### Lecturas
- `GetRanking(tournamentId, scope, view: topN|aroundMe, cursor)`
- `GetMatchdayResults(tournamentId, matchday)` (puntos por match)
- `GetUserScoreBreakdown(tournamentId, userId)`
- `GetPositionTimeline(tournamentId, userId)` (para live + wrapped)

### Eventos publicados
- `scoring.user_points_changed`
- `ranking.snapshot_published`
- `ranking.corrected`

### Eventos consumidos
- `submission.locked/submitted`
- `sports.match_finished`
- `sports.match_corrected`

### Invariantes / fallos
- Ranking snapshots incluyen `gameModeId` + `rulesetVersionId` y metadata de auditoría.
- Recomputable + auditable.
- Snapshots versionados (correcciones crean nueva versión).
- Rendimiento: precompute “aroundMe”.

---

## D.11 Live Feed & Notifications

### Agregados
- `FeedItem`, `Notification`, `DeliveryAttempt`, `Subscriptions`

### Comandos
- `UpdateSubscriptions(userId, patch)`
- `MarkFeedSeen(userId, cursor|timestamp)`
- `MarkNotificationRead(userId, notificationId)`
- `EnqueueNotification(eventRef)` (interno)

### Lecturas
- `GetLiveFeed(userId, scope, cursor)`
- `ListNotifications(userId, cursor)`
- `GetUnreadCounts(userId)`

### Invariantes / fallos
- Dedupe y anti-fatiga.
- Respeta quiet hours + preferencias.

---

## D.12 Stats / Recap / Wrapped

### Agregados
- `TournamentRecap`, `UserTournamentStats`, `WrappedArtifact`

### Comandos (internos)
- `GenerateTournamentRecap(tournamentId)`
- `GenerateUserWrapped(userId, season|period)`

### Lecturas
- `GetTournamentRecap(tournamentId, memberId)`
- `GetMyStats(userId, filters...)`
- `GetWrapped(userId, period)`

### Invariantes
- Derivado de scoring + timeline; reproducible.
- Privacidad: lo que es “público” depende de verificado.

---

## D.13 Chat & Community

### Agregados
- `ChatRoom`, `Message`, `ModerationAction`, `ReadState`

### Comandos
- `SendMessage(tournamentId, userId, text)`
- `DeleteMessage(tournamentId, moderatorId, messageId, reason)`
- `MuteUser(tournamentId, moderatorId, targetUserId, duration)`
- `PinMessage(tournamentId, moderatorId, messageId)` *(opcional)*

### Lecturas
- `ListMessages(tournamentId, userId, cursor)`
- `GetUnreadState(tournamentId, userId)`

### Invariantes / fallos
- Rate limits.
- Moderación auditada especialmente en verificados.

---

## D.14 Verified Hub & Events

### Agregados
- `VerifiedEvent`, `VerifiedHubCuration`, `VerifiedBranding`, `VerifiedEligibility`, `VerifiedTournamentAttachment`

### Comandos (staff)
- `CreateVerifiedEvent(...)`
- `UpdateVerifiedEvent(...)`
- `PublishVerifiedEvent(eventId)`
- `AttachTournament(eventId, tournamentId)`
- `DetachTournament(eventId, tournamentId)`

### Lecturas
- `GetVerifiedHub(userId?, locale, filters)` (catálogo curado)
- `GetVerifiedEvent(eventId)` (detalle pre-join safe)
- `ListVerifiedEventTournaments(eventId)`

### Invariantes
- Sin spectators: preview mínimo.
- Eligibility consistente si hay promos/premios.

---

## D.15 Creators Platform

### Agregados
- `CreatorProfile`, `CreatorBranding`, `CreatorCollections`, `CreatorLinks`

### Comandos (staff/partner)
- `CreateCreator(...)`
- `UpdateCreator(...)`
- `VerifyCreator(...)`

### Lecturas
- `ListCreators(filters...)`
- `GetCreator(creatorId)`
- `ListCreatorEvents(creatorId)`

### Invariantes
- Anti-spam (links y contenido).
- Branding assets via Uploads/Media.

---

## D.16 Ranked Progression

### Agregados
- `RankedTrack`, `RankedSeason`, `UserRating`, `Division/Tier`

### Comandos (internos + staff config)
- `ApplyVerifiedSnapshot(snapshotRef)` (actualiza rating)
- `StartSeason(trackId, config)`
- `EndSeason(trackId, seasonId)`
- `ApplySeasonReset(trackId, seasonId, policy)`
- `UpdateRankedTrack(trackId, patch)` (staff)

### Lecturas
- `GetMyRankedProfile(userId)`
- `GetRankedLeaderboard(trackId, seasonId, view)`
- `GetSeasonInfo(trackId)`

### Invariantes
- Solo torneos verificados mueven rating.
- Reset parcial, auditado.

---

## D.17 Achievements (verificados)

### Agregados
- `AchievementDefinition` (staff), `AchievementGrant`, `EvidenceRef`

### Comandos
- `PublishAchievementDefinition(...)` (staff)
- `GrantAchievement(userId, achievementId, evidenceRef)` (interno)
- `RevokeAchievement(grantId, reason)` (staff, antifraude)

### Lecturas
- `ListMyAchievements(userId, verifiedOnly=true)`
- `GetAchievementCatalog()`

### Invariantes
- Grants inmutables (con revocación auditada).
- Solo verificado “de prestigio”.

---

## D.18 Promotions & Rewards (sin betting)

### Agregados
- `Promotion`, `PromotionOptIn`, `EligibilitySnapshot`, `RewardGrant`, `FulfillmentProfile`, `WinnerPublication`

### Comandos
- `CreatePromotion(...)` (staff)
- `UpdatePromotion(...)` (staff)
- `OptInPromotion(userId, promotionId, termsVersion)`
- `OptOutPromotion(userId, promotionId)` (si permitido)
- `GrantRewards(promotionId, winners[])` (interno/staff)
- `ClaimReward(userId, rewardGrantId, fulfillmentData, termsVersion)`
- `UpdateFulfillmentProfile(userId, patch)`

### Lecturas
- `ListPromotions(filters...)` (public)
- `GetPromotion(promotionId)` (public)
- `GetMyPromotionState(promotionId)` (auth)
- `ListMyRewards(filters...)` (auth)
- `ListPromotionWinners(promotionId)` (public, con privacidad)

### Invariantes
- T&Cs versionadas + opt-in.
- Antifraude si hay premios.
- Transparencia sin exponer datos sensibles (consent/anonymize).

---

## D.19 Trust & Safety & Anti-Fraud

### Agregados
- `Report`, `EnforcementAction`, `Appeal`, `PolicyDocument`, `FraudSignal`

### Comandos
- `SubmitReport(reporterId, target, reason, comment?)`
- `CreateAppeal(userId, actionId, message)`
- `IssueEnforcementAction(userId, type, scope, duration, reason)` (staff)
- `UpdateEnforcementAction(actionId, patch)` (staff)
- `UpdateReport(reportId, status, resolutionNote)` (staff)
- `UpdateAppeal(appealId, status, response)` (staff)

### Lecturas
- `ListTrustPolicies()` (public)
- `GetMyEnforcementStatus(userId)` (auth)
- `ListMyReports(userId)` (auth)
- `ListMyAppeals(userId)` (auth)

### Invariantes
- Auditoría obligatoria para acciones staff.
- Bloqueos/restricciones deben reflejarse en permisos de Chat/Ranked/Rewards.

---

## D.20 Uploads & Media

### Agregados
- `UploadSession`, `MediaAsset`, `MediaVariant`, `ModerationStatus`

### Comandos
- `CreateUpload(purpose, scope, contentType, size?, checksum?)`
- `CompleteUpload(uploadId, metadata, crop?)`
- `AbortUpload(uploadId)`
- `DeleteMedia(mediaId)` (policy-based)

### Lecturas
- `GetUpload(uploadId)`
- `GetMedia(mediaId)` (public/unlisted/private policy)

### Invariantes
- purpose + scope autorizado (ej. tournament cover solo admin).
- constraints (size/type) en create.
- scanning/moderation para assets expuestos.

---

## D.21 Admin / Backoffice (staff-only overlay)

### Propósito
Operar dominios sin inventar modelos paralelos.

### Reglas obligatorias
- `StaffAuth` separado
- `X-Admin-Justification` requerido en writes
- `AuditEvent` inmutable por cada write
- Rate limit fuerte + logging

### Contratos típicos
- Buscar usuarios/torneos, ver campos ampliados (staff view).
- Ejecutar recomputes, publicar/unpublish, moderar media/chat, corregir deportes, operar promos.

---

# E) Contratos transversales de preview (para Hub sin spectator)

### E.1 Tournament Preview (pre-join safe)
Campos permitidos:
- `tournamentId`, `name`, `verificationStatus`, `sportId`, `gameModeId`
- `schedule` (start/end, join close)
- `participantsCount`, `maxPlayers?`, `callToAction`
- `rewardsSummary?`, `creatorBranding?`, `officialBadge?`

Campos prohibidos:
- ranking completo, chat, submissions de otros, histórico.

---

# F) Lista de decisiones que deben congelarse antes de avanzar OpenAPI (si no, se rompe)

1) Event envelope y naming.
2) Rulesets inmutables versionados.
3) “Verified” como único origen de ranked/logros/premios oficiales.
4) “No spectator” implementado por permisos + preview mínimo.
5) IdempotencyKey + concurrency control en comandos críticos.
6) Correcciones de partidos como eventos explícitos + recompute auditable.
7) Staff-only overlay con justificación + audit log.

---

- docs/architecture/service-catalog.md
# Service catalog (normative)

This catalog defines stable services, their scope, and allowed dependencies.

## Legend

-   Layer: platform | domain | registry | runtime | algorithm
-   Scope: app (singleton) | tourney (child)
-   State: implemented | stub | planned

| Service ID                    | Responsibility                                            | Layer     | Scope   | Instantiation | Allowed deps                                     | Allowed consumers                           | State       | Verification                                        |
| ----------------------------- | --------------------------------------------------------- | --------- | ------- | ------------- | ------------------------------------------------ | ------------------------------------------- | ----------- | --------------------------------------------------- |
| IInstantiationService         | Creates instances with constructor injection; owns scopes | platform  | app     | eager         | none                                             | platform, controllers                       | implemented | lint: UI packages do not import instantiation primitives |
| IConfigurationService         | Central config and feature flags                          | platform  | app     | eager         | IEnvironmentService                              | controllers, services                       | stub        | lint: no direct env access in UI packages           |
| IEnvironmentService           | Environment values (endpoints, mock mode)                 | platform  | app     | eager         | none                                             | configuration service                       | implemented | lint: UI packages must not read env directly        |
| ILogService                   | Central logging                                           | platform  | app     | eager         | IConfigurationService                            | controllers, services                       | planned     | rg: no console.\* in UI packages                    |
| IStorageService               | Storage wrapper with namespace/version                    | platform  | app     | eager         | IConfigurationService                            | controllers, services                       | planned     | lint: UI packages must not use localStorage directly |
| IClockService                 | Time source for lock rules/timers                         | platform  | app     | eager         | none                                             | controllers, services                       | planned     | tests: deterministic clock                          |
| ILocalizationService          | Locale and localization helpers                           | platform  | app     | eager         | IConfigurationService                            | controllers, services                       | implemented | lint: UI packages do not import lit-localize directly |
| INavigationService            | Navigation and URL building                               | platform  | app     | eager         | IConfigurationService                            | controllers, services                       | planned     | lint: UI packages do not call router directly       |
| IAuthService                  | Auth state and login/logout                               | platform  | app     | eager         | Auth gateway (TBD), IStorageService, IClockService | controllers, services                       | planned     | lint: UI does not call fetch for auth               |
| ISessionManager               | Auth session lifecycle (Cognito)                          | platform  | app     | eager         | none                                             | controllers, UI                             | implemented | lint: UI uses @service                              |
| ISessionService               | Session lifecycle and refresh                             | platform  | app     | eager         | IAuthService, IStorageService                    | controllers, services                       | planned     | lint: UI does not handle tokens                     |
| ITourneyCoreGateway           | Tourney core gateway (list/create/preview)                | domain    | app     | eager         | RankupApiClient (SDK)                            | domain services                             | implemented | lint: no @rankup/api in domain                      |
| ITourneyMatchdaysGateway      | Matchdays gateway (matchdays + matches)                   | domain    | app     | eager         | RankupApiClient (SDK)                            | domain services                             | implemented | lint: no @rankup/api in domain                      |
| ITourneyRankingGateway        | Ranking gateway (ranking + windows)                       | domain    | app     | eager         | RankupApiClient (SDK)                            | domain services                             | implemented | lint: no @rankup/api in domain                      |
| ITourneyMembersGateway        | Members gateway (join/leave/roles)                        | domain    | app     | eager         | RankupApiClient (SDK)                            | domain services                             | implemented | lint: no @rankup/api in domain                      |
| ITourneyInvitationCodesGateway | Invitation codes gateway (resolve/join)                  | domain    | app     | eager         | RankupApiClient (SDK)                            | domain services                             | implemented | lint: no @rankup/api in domain                      |
| ITourneyInvitesGateway        | Direct invites gateway + inbox                            | domain    | app     | eager         | RankupApiClient (SDK)                            | domain services                             | implemented | lint: no @rankup/api in domain                      |
| ITourneyCoreService           | Tourney list/create/preview                               | domain    | app     | eager         | ITourneyCoreGateway                              | controllers, UI                             | implemented | lint: UI consumes via @service/AppServices          |
| ITourneyMatchdaysService      | Matchdays + matches                                       | domain    | app     | eager         | ITourneyMatchdaysGateway                         | controllers, UI                             | implemented | lint: UI consumes via @service/AppServices          |
| ITourneyRankingService        | Ranking + windows                                         | domain    | app     | eager         | ITourneyRankingGateway                           | controllers, UI                             | implemented | lint: UI consumes via @service/AppServices          |
| ITourneyMembersService        | Membership/roles                                          | domain    | app     | eager         | ITourneyMembersGateway                           | controllers, UI                             | implemented | lint: UI consumes via @service/AppServices          |
| ITourneyInvitationCodesService | Invitation codes                                         | domain    | app     | eager         | ITourneyInvitationCodesGateway                   | controllers, UI                             | implemented | lint: UI consumes via @service/AppServices          |
| ITourneyInvitesService        | Direct invites + inbox                                    | domain    | app     | eager         | ITourneyInvitesGateway                           | controllers, UI                             | implemented | lint: UI consumes via @service/AppServices          |
| IScorePredictionService       | ScorePrediction CRUD and validation                       | domain    | app     | eager         | ScorePrediction gateway (TBD), IAuthService, IClockService | controllers                                 | planned     | unit tests for validation                           |
| IUserService                  | User profile/preferences                                  | domain    | app     | eager         | User gateway (TBD), IStorageService              | controllers                                 | planned     | lint: UI does not access DTOs                       |
| IChatService                  | Chat fetch/send and moderation                            | domain    | app     | delayed       | Chat gateway (TBD), IAuthService                 | controllers                                 | planned     | lint: UI does not call chat APIs directly           |
| ICompetitionService           | Competition catalog                                       | domain    | app     | delayed       | Competition gateway (TBD)                        | controllers                                 | planned     | lint: UI does not use DTOs directly                 |
| ISportCatalogService          | Sport metadata and adapters                               | registry  | app     | eager         | none                                             | controllers, runtime                        | planned     | ADR required for new sport                          |
| IGameModeRegistry             | Register game modes                                       | registry  | app     | eager         | none                                             | controllers, runtime                        | planned     | ADR required for new mode                           |
| ITourneyContextService        | Tourney context (id, role, mode)                          | runtime   | tourney | delayed       | ITourneyCoreService, ITourneyMembersService      | controllers, runtime                        | planned     | scope: tourney only                                 |
| IGameRuntimeService           | Game-mode runtime for tourney                             | runtime   | tourney | delayed       | IGameModeRegistry, ITourneyContextService        | controllers, UI                             | planned     | no direct api access in UI                          |
| IScorePredictionScoringEngine | Pure scoring logic                                        | algorithm | app     | eager         | none                                             | domain services                             | planned     | tests required                                      |
| IDraftRulesEngine             | Draft rules logic                                         | algorithm | app     | eager         | none                                             | domain services                             | planned     | tests required                                      |
| IOddsCalculator               | Odds computation                                          | algorithm | app     | delayed       | none                                             | domain services                             | planned     | tests required if used                              |

## Notes

-   UI consumes controllers/services only, never runtime implementations.
-   Add new services via ADR and update this catalog.

- docs/architecture/services.md
# Services architecture (normative)

## Purpose

Define the service model for Rankup so UI packages never construct dependencies or select runtime implementations.
API request flow is specified in `docs/architecture/api-request-flow.md`.

## Definitions

-   Service: Stable contract plus an implementation registered in a composition root. Services are consumed by injection (directly or via controllers) and respect scopes.
-   Contract: TypeScript types and service interfaces only.
-   Implementation: Runtime code that talks to HTTP, storage, or other IO.
-   Composition root: The single place where implementations are selected and wired.

## Contract vs implementation

-   `@rankup/api` is contract-only: OpenAPI types + interfaces.
-   Domain DTOs live in `@rankup/rankup/domains/*/<capability>/contracts/types` and are the only types UI may consume.
-   Implementations live outside the contract and are never imported by UI packages.
-   UI packages consume services, not implementation factories or SDK runtimes.
-   Domain layout follows a Hadron-style capability split: `shared/` (IDs/enums), plus `<capability>/models`, `<capability>/contracts`, `<capability>/services`, and `<capability>/validation`.

## Composition root

-   The composition root chooses mock vs real implementations.
-   The composition root wires SDK clients into app-owned gateways.
-   The composition root exposes services to the UI (AppContext or registry).
-   Only the composition root may import mock or HTTP implementations.

## Service boundaries

-   Services must be cohesive by domain. Avoid a single monolithic service.
-   Examples (non-exhaustive):
    -   IAuthService
    -   ITourneyCoreService
    -   ITourneyMatchdaysService
    -   ITourneyRankingService

## Lit usage (UI consumption)

-   UI components do not construct services or clients.
-   UI components read services from context (app-scoped registry) and call interface methods.
-   No fetch calls in UI packages (see `docs/architecture/ui-packages.md`).
-   UI packages must not inject SDK clients or gateways directly.

## Scopes / lifetimes

-   app-scope (current): application-wide singletons.
-   future: tourney-scope or game-scope for per-tourney state.

## Prohibitions

-   UI packages must not import `@rankup/api-mock` or any HTTP implementation.
-   UI packages must not depend on `@rankup/api`.
-   No direct `fetch` in UI packages.

## Enforcement

-   ESLint rules enforce import restrictions.
-   `yarn validate` runs guardrails and lint.
-   Service catalog is defined in `docs/architecture/service-catalog.md`.

## Dependency injection (DI)

The DI model is defined in `docs/architecture/di.md` and is normative.
Services must be registered in the composition root and consumed via injection.

- packages/rankup/src/domains/tournaments/README.md
# Tournaments domain layout

This domain packages tournament lifecycle, matchday navigation, membership, and invitation flows under `packages/rankup/src/domains/tournaments`.
It follows a Hadron-style capability split so each surface maps cleanly to OpenAPI.

## Source of truth

- Business intent: `docs/negocio/documento-contratos-dominio-rankup.md`
- Bounded context ownership: `docs/negocio/documento-contextos-rankup.md`
- HTTP contract: `packages/api/openapi.yaml`

## Folder map

- `shared/`: cross-capability types (IDs, enums, user summary) and shared validators.
- `core/`: tournament lifecycle + preview (list/create/get preview).
- `matchdays/`: matchday navigation, matches, availability.
- `members/`: membership and roles.
- `codes/`: invitation codes (resolve + join by code).
- `invites/`: direct invites + inbox actions.
- `chat/`, `submissions/`, `results/`, `stats/`, `recaps/`, `updates/`: placeholders for future tourney capabilities.
- `analysis/`: pure algorithms (tie-breakers, lock rules) with no IO.
- `fixtures/`: deterministic sample data.

Rankings now live in `packages/rankup/src/domains/scoring/ranking`.

Each capability (`core/`, `matchdays/`, ...) contains:

- `models/`: pure data (DTOs, IDs, enums usage). No IO.
- `contracts/`: service interfaces and `contracts/types.ts` for UI consumption.
- `services/`: runtime implementations (delegate to gateways).
- `validation/`: pure validators (no IO).

## Dependency direction

`shared/models` -> `<capability>/models` -> `<capability>/contracts` -> `<capability>/services` -> app UI.
Runtime services must never be imported by UI packages.

## UI usage

UI code must import only from `<capability>/contracts/**` (or `shared/` for shared types) and must never import runtime implementations.

## Guardrails

- No `@rankup/api` inside the domain. Use app-owned gateways.
- No direct `fetch()` usage.
- No platform `browser/**` imports in UI packages.

- packages/api/openapi.yaml


### Meta / Config

* `/healthz` (get)
* `/readyz` (get)
* `/app/config` (get)
* `/app/bootstrap` (get)

### Auth

* `/auth/registrations` (post)
* `/auth/registrations/confirm` (post)
* `/auth/registrations/resend-confirmation` (post)
* `/auth/sessions` (post)
* `/auth/sessions/refresh` (post)
* `/auth/sessions/me` (delete)
* `/auth/password-resets` (post)
* `/auth/password-resets/confirm` (post)
* `/auth/oauth/authorize` (get)
* `/auth/oauth/token` (post)
* `/auth/oauth/links` (post)
* `/auth/oauth/links/{provider}` (delete)

### Me (perfil, ajustes, privacidad, dispositivos)

* `/me` (get, patch, delete)
* `/me/password` (post)
* `/me/preferences` (get, patch)
* `/me/privacy` (get, patch)
* `/me/notification-preferences` (get, patch)
* `/me/devices` (get, post)
* `/me/devices/{deviceId}` (delete)

### Users (directorio y perfil público)

* `/users` (get)
* `/users/{userId}` (get)
* `/users/{userId}/history` (get)
* `/users/{userId}/achievements` (get)
* `/usernames/{username}` (get)

### Social (friends, follow, blocks)

* `/me/friend-requests` (get, post)
* `/me/friend-requests/{requestId}` (patch, delete)
* `/me/friends` (get)
* `/me/friends/{userId}` (delete)
* `/me/following` (get)
* `/me/followers` (get)
* `/me/following/{userId}` (put, delete)
* `/me/blocks` (get)
* `/me/blocks/{userId}` (put, delete)

### Invitaciones a torneos (direct-to-user)

* `/me/tournament-invites` (get)
* `/me/tournament-invites/{inviteId}` (patch, delete)

### Sports (catálogo y calendario)

* `/sports` (get)
* `/competitions` (get)
* `/competitions/{competitionId}` (get)
* `/competitions/{competitionId}/seasons` (get)
* `/competitions/{competitionId}/seasons/{seasonId}` (get)
* `/competitions/{competitionId}/seasons/{seasonId}/matchdays` (get)
* `/competitions/{competitionId}/seasons/{seasonId}/matchdays/{matchday}/matches` (get)
* `/matches` (get)
* `/matches/{matchId}` (get)
* `/matches/{matchId}/events` (get)
* `/teams/{teamId}` (get)

### Game Modes & Rules
* `/game-modes` (get)
* `/game-modes/{gameModeId}` (get)
* `/rulesets` (get)
* `/rulesets/{rulesetId}` (get)

### Tournaments (listado, preview, lifecycle)

* `/me/tournaments` (get)
* `/tournaments` (get, post)
* `/tournaments/{tournamentId}/preview` (get)
* `/tournaments/{tournamentId}` (get, patch, delete)
* `/tournaments/{tournamentId}/lock` (put, delete)
* `/tournaments/{tournamentId}/archive` (put, delete)
* `/tournaments/{tournamentId}/owner` (put)
* `/tournaments/{tournamentId}/rules` (get)

### Invitation Codes (join por código sin “espectador”)

* `/tournaments/{tournamentId}/invitation-codes` (get, post)
* `/invitation-codes/{code}` (get)
* `/invitation-codes/{code}/members/me` (put)

### Tournaments (invites y membership)

* `/tournaments/{tournamentId}/invites` (get, post)
* `/tournaments/{tournamentId}/invites/{inviteId}` (delete)
* `/tournaments/{tournamentId}/members/me` (put, delete)
* `/tournaments/{tournamentId}/members` (get)
* `/tournaments/{tournamentId}/members/{userId}` (patch, delete)

### Tournament Matchdays (navegación)

* `/tournaments/{tournamentId}/matchdays` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/matches` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/availability` (get)

### Submissions (modo-agnóstico, p. ej. ScorePrediction)

* `/tournaments/{tournamentId}/matchdays/{matchday}/submissions/me` (get, put, delete)
* `/tournaments/{tournamentId}/matchdays/{matchday}/submissions` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/submissions/{userId}` (get)

### Draft (por jornada) -> Pendiente

* `/tournaments/{tournamentId}/matchdays/{matchday}/draft` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/pool` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/picks` (get, post)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/picks/{pickId}` (get, delete)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/rosters` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/rosters/me` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/lineups/me` (get, put)
* `/tournaments/{tournamentId}/matchdays/{matchday}/draft/standings` (get)

### Rankings / Results / Live ranking

* `/tournaments/{tournamentId}/ranking` (get)
* `/tournaments/{tournamentId}/ranking/stream` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/ranking` (get)
* `/tournaments/{tournamentId}/matchdays/{matchday}/results` (get)
* `/tournaments/{tournamentId}/timeline/me` (get)
* `/tournaments/{tournamentId}/timeline/{userId}` (get)

### Stats / Recap / Wrapped (retención + historial)

* `/tournaments/{tournamentId}/stats` (get)
* `/tournaments/{tournamentId}/stats/me` (get)
* `/tournaments/{tournamentId}/recap` (get)
* `/tournaments/{tournamentId}/wrapped/me` (get)

### Chat (incluye moderación por roles)

* `/tournaments/{tournamentId}/chat/messages` (get, post)
* `/tournaments/{tournamentId}/chat/messages/{messageId}` (delete)
* `/tournaments/{tournamentId}/chat/mutes/{userId}` (put, delete)
* `/tournaments/{tournamentId}/chat/pins/{messageId}` (put, delete)
* `/tournaments/{tournamentId}/chat/read-state/me` (get, put)
* `/tournaments/{tournamentId}/chat/stream` (get)

### Live (notificaciones + feed)

* `/me/notifications` (get)
* `/me/notifications/{notificationId}` (patch)
* `/me/notifications/mark-read` (post)
* `/me/feed` (get)
* `/me/feed/stream` (get)
* `/tournaments/{tournamentId}/feed` (get)
* `/tournaments/{tournamentId}/feed/stream` (get)
* `/tournaments/{tournamentId}/subscriptions/me` (get, patch)

### Verified (Hub de eventos curado)

* `/events` (get)
* `/events/{eventId}` (get)
* `/events/{eventId}/members/me` (put, delete)

### Creadores (descubrimiento + catálogo)

* `/creators` (get)
* `/creators/{creatorId}` (get)
* `/creators/{creatorId}/egetvents` ()

### Ranked (progresión verificada)

* `/me/ranked` (get)
* `/ranked/seasons` (get)
* `/ranked/seasons/{seasonId}` (get)
* `/ranked/divisions/{gameModeId}` (get)
* `/ranked/leaderboards/{gameModeId}` (get)

### Achievements (verificados)

* `/me/achievements` (get)
* `/achievements` (get)
* `/achievements/{achievementId}` (get)

### Promotions / Rewards (oficiales, sin betting)

* `/promotions` (get)
* `/promotions/{promotionId}` (get)
* `/me/rewards` (get)
* `/me/rewards/{rewardGrantId}` (get)
* `/me/rewards/{rewardGrantId}/claim` (post)


### Trust & Safety

* `/reports` (post)
* `/me/reports` (get)
* `/appeals` (post)
* `/me/appeals` (get)
* `/me/safety-status` (get)

### Uploads / Media (branding, avatars, assets)

* `/uploads` (post)
* `/uploads/{uploadId}` (get, delete)
* `/uploads/{uploadId}/complete` (post)
* `/media/{mediaId}` (get)

---



## Admin / Backoffice (staff-only)

* `/admin/reports` (get)
* `/admin/reports/{reportId}` (patch)
* `/admin/users/{userId}/bans` (post)
* `/admin/users/{userId}/bans/{banId}` (delete)
* `/admin/creators/{creatorId}/verify` (post)
* `/admin/creators/{creatorId}/branding` (patch)
* `/admin/tournaments/{tournamentId}/verify` (post)
* `/admin/tournaments/{tournamentId}/revoke-verification` (post)
* `/admin/tournaments/{tournamentId}/moderators` (post)
* `/admin/tournaments/{tournamentId}/moderators/{userId}` (delete)
* `/admin/events` (post)
* `/admin/events/{eventId}` (patch, delete)
* `/admin/rulesets` (post)
* `/admin/rulesets/{rulesetId}` (patch)
* `/admin/achievements` (post)
* `/admin/achievements/{achievementId}` (patch)
* `/admin/promotions` (post)
* `/admin/promotions/{promotionId}` (patch)
* `/admin/tournaments/{tournamentId}/recompute` (post)
* `/admin/sports/matches/{matchId}/correct` (post)
* `/admin/notifications/templates` (post)
* `/admin/notifications/templates/{templateId}` (patch)
* `/admin/feature-flags` (get, patch)
