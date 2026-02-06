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
