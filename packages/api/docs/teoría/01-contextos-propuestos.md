# 1) Mapa de Bounded Contexts

> Objetivo: definir **propiedad de datos**, límites de responsabilidades y cómo se integran (eventos vs llamadas directas).
> Nota: esto NO define endpoints; define módulos/dominios.

## 1.1 Contextos propuestos (lista corta, sin solapes)

1. **Identity & Access**
2. **Profiles & Preferences**
3. **Social Graph**
4. **Sports Catalog & Schedule**
5. **Tournaments & Membership**
6. **Game Mode Registry & Rules**
7. **Gameplay Submissions**
8. **Scoring & Rankings**
9. **Live Feed & Notifications**
10. **Achievements & Progression (Ranked)**
11. **Verified & Creator Programs**
12. **Chat & Community**
13. **Trust, Safety & Anti‑Fraud**
14. **Analytics & Experimentation**
15. **Rewards & Promotions** (futuro, pero conviene reservar el contexto)

Abajo detallo cada uno con: propiedad, invariantes y eventos.

---

# 2) Contexto por contexto

## 2.1 Identity & Access

**Misión:** identidad, autenticación, sesiones, tokens.

* **Propietario de datos:** credenciales, identidades federadas, sesiones, revocaciones.
* **Invariantes:**

  * Un usuario = una identidad canónica (userId estable).
  * Sesiones revocables; refresh tokens rotables.
* **Interfaces (alto nivel):**

  * Registro / login / logout / refresh / recuperación de contraseña.
  * Enlace/desenlace de proveedores OAuth.
* **Publica eventos:**

  * `user.registered`, `user.logged_in`, `user.logged_out`, `user.deleted`.
* **Consume:** (normalmente ninguno; es raíz).

**Riesgo si se mezcla con Profile/Social:** cada cambio en login rompe perfiles, friends, etc.

---

## 2.2 Profiles & Preferences

**Misión:** perfil público/privado, idioma, país, preferencias, notificaciones.

* **Propietario de datos:** username, avatar, bio, privacy flags, locales, preferencias de notificación, intereses (deportes).
* **Invariantes:**

  * Un username debe cumplir políticas (filtro, unicidad si aplica).
  * Preferencias de notificación coherentes con quiet hours y opt‑in.
* **Interfaces:**

  * Leer/editar perfil.
  * Ajustes de privacidad (qué se muestra a amigos / público / nadie).
  * Preferencias (deportes favoritos, idioma).
* **Publica eventos:** `profile.updated`, `preferences.updated`.
* **Consume:** `user.registered` (crear perfil).

---

## 2.3 Social Graph

**Misión:** amigos, follow, bloqueos, invitaciones directas.

* **Propietario de datos:** relaciones `friend`, `follow`, `block`, invitaciones.
* **Invariantes:**

  * Amistad = relación bidireccional confirmada.
  * `block` domina: si A bloquea a B, B no puede invitar/seguir.
* **Interfaces:**

  * Solicitar/aceptar amistad.
  * Follow/unfollow.
  * Invitar a torneo (si es feature social, aquí vive el “who can invite whom”).
* **Eventos:** `friend.requested`, `friend.accepted`, `user.followed`, `user.blocked`.

**Nota:** el “descubrimiento” NO vive aquí. Aquí solo relaciones.

---

## 2.4 Sports Catalog & Schedule

**Misión:** el “mundo real”: deportes, competiciones, temporadas, jornadas, partidos, estados y resultados.

* **Propietario de datos:** catálogo de deportes/competiciones, calendario, partidos, estados, resultados oficiales.
* **Invariantes:**

  * Un partido tiene un estado único y monotónico (no puede pasar FT→LIVE).
  * Correcciones (retroactivas) deben registrarse como “correction events”.
* **Interfaces:**

  * Leer competiciones disponibles.
  * Leer jornadas/partidos por competición/fecha.
  * Leer resultado final y eventos relevantes.
* **Publica eventos (críticos):**

  * `match.kickoff`, `match.goal`, `match.status_changed`, `match.finished`, `match.corrected`.
* **Consume:** ingesta externa (ACL/anti‑corruption layer).

**Riesgo mayor:** si el proveedor cambia, no puede romper todo. Debe haber ACL sí o sí.

---

## 2.5 Tournaments & Membership

**Misión:** crear/gestionar torneos, reglas de acceso, membresía, roles.

* **Propietario de datos:** torneo (metadata), visibilidad, join policy, configuración (incl. “join mid‑season”), miembros y roles.
* **Invariantes:**

  * Un usuario no puede tener dos memberships activas en el mismo torneo.
  * Roles claros: owner/admin/player/mod (si aplica).
  * Cambios de configuración con límites (p.ej. no cambiar reglas de scoring tras empezar, salvo versión nueva y “patch” explícito).
* **Interfaces:**

  * Crear torneo (privado/público/verificado, según permisos).
  * Unirse/salir.
  * Admin actions (expulsar, transferir owner, abrir/cerrar).
* **Eventos:**

  * `tournament.created`, `tournament.updated`, `tournament.joined`, `tournament.left`, `tournament.kicked`, `tournament.locked`.

---

## 2.6 Game Mode Registry & Rules

**Misión:** registro de game modes + versiones de reglas + plantillas de configuración.

* **Propietario de datos:** `gameModeId`, capacidades, parámetros configurables, versiones de scoring, validadores.
* **Invariantes:**

  * Las reglas deben ser **versionadas** (immutables una vez publicadas).
  * Un torneo referencia una versión concreta (o una “config instance” derivada).
* **Interfaces:**

  * Consultar game modes disponibles y su configuración.
  * Resolver reglas efectivas de un torneo (plantilla + overrides).
* **Eventos:** `ruleset.published`, `ruleset.deprecated`.

**Clave:** aquí se evita hardcodear reglas en múltiples sitios.

---

## 2.7 Gameplay Submissions

**Misión:** capturar las acciones del jugador en un modo: predicciones, picks, draft picks, etc.

* **Propietario de datos:** submissions por usuario/torneo/jornada/partido, estado (draft, locked, submitted), timestamps.
* **Invariantes:**

  * Idempotencia: enviar dos veces no duplica.
  * Lock: no se edita tras `lockedAt`.
  * Validación por ruleset (del contexto 2.6).
* **Interfaces:**

  * Crear/editar submissions antes del lock.
  * Leer mis submissions por jornada/torneo.
* **Eventos:**

  * `submission.created`, `submission.updated`, `submission.locked`.

**Nota:** no calcula puntos; solo registra acciones.

---

## 2.8 Scoring & Rankings

**Misión:** calcular puntos y producir rankings (torneo/jornada/temporada).

* **Propietario de datos:** score ledger (puntos por match/evento), snapshots de ranking, tie-breakers aplicados.
* **Invariantes:**

  * Reproducible: dado (submissions + resultados + rulesetVersion) el score debe poder recomputarse.
  * Correcciones: si hay `match.corrected`, se recalcula y se versiona el snapshot.
* **Interfaces:**

  * Ranking actual (global del torneo, por jornada).
  * Resultados con breakdown (por match, por usuario).
  * Timeline de posición (para “app viva” y wrapped).
* **Eventos:**

  * `score.updated` (por usuario/torneo/jornada),
  * `ranking.snapshot_published`,
  * `ranking.corrected`.

---

## 2.9 Live Feed & Notifications

**Misión:** transformar eventos deportivos + cambios de ranking en una experiencia “viva”: feed in-app + push.

* **Propietario de datos:** notificaciones generadas, entregas, dedupe, plantillas.
* **Invariantes:**

  * Anti-fatiga: rate limit por usuario/torneo.
  * Dedupe: el mismo gol no debe generar N notificaciones duplicadas.
* **Interfaces:**

  * Suscripciones del usuario (qué torneos/deportes sigo).
  * Feed de eventos (lo que pasó y su impacto).
  * Envío push (interno).
* **Consume eventos:** de Sports + Scoring + Social.
* **Publica:** `notification.sent`, `notification.failed`.

---

## 2.10 Achievements & Progression (Ranked)

**Misión:** progresión verificada: rating/ELO por modo, temporadas, divisiones, XP, logros de prestigio.

* **Propietario de datos:** rating por userId+gameMode (+sport opcional), estado de temporada, badges/títulos verificados.
* **Invariantes:**

  * Solo se actualiza por **eventos verificados** (ver 2.11).
  * Reset parcial de temporada = regla explícita (auditada).
* **Interfaces:**

  * Ver mi rating/división por modo.
  * Ver leaderboard verificado (si existe).
  * Ver mis logros verificados.
* **Consume eventos:** `ranking.snapshot_published` (pero solo de torneos verificados), `tournament.verified`.
* **Publica:** `rank.changed`, `season.ended`, `achievement.unlocked`.

**Decisión crítica (ya alineada):** rating competitivo **por game mode** + XP global.

---

## 2.11 Verified & Creator Programs

**Misión:** verificación de torneos y creadores, branding, permisos para crear “oficial”.

* **Propietario de datos:** sello verificado, tipo (official/sponsored/creator), requisitos, branding assets, roles de moderador para comunidades.
* **Invariantes:**

  * Un torneo verificado debe cumplir requisitos de reglas (p.ej. ruleset aprobado).
  * Permisos: solo entidades verificadas pueden crear verificados.
* **Interfaces:**

  * Marcar/crear verificados (solo staff/partner).
  * Gestionar branding de torneos de creator.
  * Gestión de moderadores.
* **Eventos:** `tournament.verified`, `creator.verified`, `branding.updated`.

---

## 2.12 Chat & Community

**Misión:** chat por torneo/comunidad, historial, moderación básica.

* **Propietario de datos:** mensajes, threads (si existen), read receipts (opcional), attachments policy (probablemente no al inicio).
* **Invariantes:**

  * Rate limits.
  * Borrado/moderación auditable (especialmente en verificados).
* **Interfaces:** enviar/leer mensajes, mute, borrar (según rol).
* **Consume:** membership/roles, blocks.
* **Eventos:** `chat.message_sent`, `chat.message_deleted`.

---

## 2.13 Trust, Safety & Anti‑Fraud

**Misión:** reportes, sanciones, antifraude (multi-cuenta), filtros de lenguaje.

* **Propietario de datos:** reports, strikes, bans, device/linkage signals, policy decisions.
* **Invariantes:**

  * Política consistente: sanciones trazables.
  * En eventos con premios: verificación adicional al reclamar.
* **Interfaces:** reportar, revisar (interno), ban/unban, apelaciones (futuro).
* **Consume:** eventos de chat, profile, tournaments, rewards.
* **Publica:** `user.banned`, `content.removed`, `fraud.flagged`.

---

## 2.14 Analytics & Experimentation

**Misión:** telemetría de producto, cohortes, funnels, A/B testing.

* **Propietario de datos:** event stream analítico, experiment assignments.
* **Invariantes:** privacidad y minimización de datos.
* **Interfaces:** no expuesto al usuario normalmente (solo dashboards internos).
* **Consume:** eventos de todos los contextos.

---

## 2.15 Rewards & Promotions (futuro)

**Misión:** premios oficiales, elegibilidad, reclamación.

* **Propietario de datos:** catálogo de premios, reglas de distribución, winners, estados de envío.
* **Invariantes:** antifraude, elegibilidad por país/edad si aplica.
* **Consume:** resultados de torneos verificados.
* **Publica:** `reward.granted`, `reward.claimed`.

---

# 3) Context Map (dependencias recomendadas)

* **Sports Catalog & Schedule** → publica eventos a → **Scoring & Rankings** y **Live Feed**
* **Game Mode Registry & Rules** → usado por → **Gameplay Submissions** y **Scoring**
* **Tournaments & Membership** → autoriza → **Submissions**, **Chat**, **Scoring**
* **Verified & Creator Programs** → habilita → **Achievements & Progression** y define sello en **Tournaments**
* **Scoring & Rankings** → alimenta → **Achievements** y **Live Feed**
* **Trust & Safety** → aplica sobre → **Profiles**, **Chat**, **Tournaments**
* **Analytics** observa todo (solo lectura)

**Integración recomendada:** eventos de dominio + lecturas síncronas para vistas (evitar acoplar cálculo con UX).

---

# 4) Decisiones Congeladas vs Iterables

## 4.1 Decisiones congeladas (difíciles de revertir sin retrabajo masivo)

1. **No betting/gambling** (legal/posicionamiento).
2. **Tournament-centric** como primitiva: todo juego ocurre “dentro de un torneo”.
3. **Verificado = única fuente de estatus/progresión pública** (rating/logros).
4. **Sin espectadores**: acceso a detalle del torneo requiere membresía.
5. **Separación de dominios**: Submissions ≠ Scoring ≠ Achievements (evita deuda).
6. **Rulesets versionados e inmutables** (sin esto, el histórico se rompe).
7. **Eventos deportivos como verdad** (Sports context + ACL), con soporte a correcciones.
8. **Modelo de progresión**:

   * rating competitivo **por game mode**,
   * XP global separado,
   * temporadas con reset parcial.
9. **Privacidad por defecto**: perfiles/historial público limitado a verificados (alineado con “validez”).
10. **Moderación y antifraude como first‑class** (sobre todo si hay premios).

## 4.2 Decisiones iterables (podéis experimentar)

1. Valores exactos de scoring, tie-breakers, bonus rules (siempre versionado).
2. Duración de temporadas, nombres de divisiones, umbrales.
3. Qué torneos no verificados existen (podéis omitir “community open” en MVP).
4. UI exacta del Hub de Eventos (cards, carruseles, personalización).
5. Follow vs solo amigos (podéis iniciar con amigos y añadir follow después).
6. Chat: polling vs realtime; threads vs plano.
7. Qué deportes entran y en qué orden.
8. Estructura de creator communities (comunidad persistente vs solo torneos).
9. Tipo y escala de premios (siempre bajo contexto Rewards y T&Cs).

---

# 5) Qué queda listo para empezar OpenAPI por fases (sin ambigüedad)

Con lo anterior, ya podéis diseñar la API en fases porque:

* Sabéis **qué módulo “posee” qué datos** (evita endpoints que escriben en 5 sitios).
* Tenéis un contrato claro de **eventos** (lo que conecta “deporte en vivo” con “ranking” y “notificaciones”).
* Tenéis congeladas las decisiones que afectan persistencia y mental model.

---
