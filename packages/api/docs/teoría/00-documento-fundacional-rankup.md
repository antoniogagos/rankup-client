# Rankup — Documento Fundacional Unificado

**Versión:** 2026-01-31 (consolidado)
**Propósito:** Única fuente de verdad para definir el negocio, el producto y las decisiones de alcance **antes** de diseñar fase a fase la OpenAPI. No es una especificación de API.

---

## 1) Identidad del producto

### Hechos

* Rankup quiere ser **la plataforma de juegos de deporte**: múltiples juegos (modes) y múltiples deportes, con foco inicial en fútbol.
* La experiencia es **tournament-centric**: todo sucede dentro de torneos (privados o públicos).
* El valor diferencial es **social + feedback en tiempo real**: lo importante ocurre fuera (goles, resultados), y la app debe “vivir” esos eventos con urgencia, notificaciones y visuales dinámicos.
* **No es betting** ni apuesta; esto es no negociable.
* Habrá **eventos oficiales** gestionados por Rankup y también ligas/torneos de **creadores/influencers** (muy importante).
* Producto global y multi-idioma.
* El equipo **no quiere** (a corto plazo) un fantasy “clásico” con mercado de fichajes como columna vertebral, porque introduce fricción y excluye a la mayoría (conocimiento/tiempo). Si existiera, sería **solo un game mode más** a futuro, no el núcleo.

### Juicio técnico (recomendación)

* El **núcleo** de Rankup debe definirse como:
  **“Competición social basada en eventos deportivos reales, con modos de juego de baja fricción, y progresión/estatus verificados a través de eventos oficiales.”**
* La “razón de volver” no es el inventario/mercado (fantasy clásico), sino el **latido del directo + ranking + conversación social**.

---

## 2) Usuario objetivo y filosofía de diseño

### Hechos

* Queréis un juego que pueda jugar “la abuela y el nieto”, sin exigir saber plantillas, fichajes o rendimiento de jugadores.
* A la vez, queréis que el usuario experto pueda obtener ventaja por conocimiento, **sin** convertir el juego en inaccesible.

### Juicio técnico

* Diseñad para **dos niveles de profundidad**:

  * **Core loop accesible**: decisiones simples, rápidas, repetibles (p. ej. “predice marcador”, “elige X picks de una lista curada”, “elige resultado 1X2 + bonus opcional”).
  * **Skill ceiling**: optimización para quien quiera (estadísticas, picks avanzados, tie-breakers, ligas ranked), pero **siempre opcional**.
* Regla de oro: **la fricción nunca debe ser requisito para competir**; la fricción solo puede ser “ventaja voluntaria”.

---

## 3) No negociables y límites (guardrails)

### Hechos

* No gambling/betting.
* Sí puede haber “premios” en ligas privadas entre amigos (bote/castigo), y en eventos oficiales premios tipo gift cards / consola / etc., pero no apuestas.
* No queréis feed global de desconocidos (lo consideráis spam).

### Juicio técnico

* Definid un marco de “recompensas” **legal y reputacionalmente sólido**:

  * Eventos oficiales: concursos/promociones con T&Cs, elegibilidad, antifraude (multi-cuenta), y claridad de que no hay apuesta.
  * Ligas privadas: la app puede permitir **declarar** “premio/castigo” como texto informativo, pero **no** gestionar dinero ni cobranzas.
* El “social” debe ser **contextual** (amigos, torneos, comunidades), no un feed abierto.

---

## 4) Primitivas del producto (dominio de alto nivel)

> Esto no es API; es el vocabulario mínimo común que debe quedar estable.

### Entidades núcleo

* **Usuario / Perfil**: identidad, país/idioma, reputación, preferencias.
* **Grafo social**: amigos (bidireccional), follow (opcional), invitaciones.
* **Torneo**: contenedor de competición; tiene visibilidad (privado/público), modalidad (jornada/temporada), reglas, estado, y participantes.
* **Game Mode**: reglas + UX + scoring (ScorePrediction, Draft, futuros).
* **Deporte**: fútbol (primero), después otros.
* **Competición / Temporada / Jornada / Partido**: estructura de calendario real.
* **Submission** (genérico): predicción/pick/elección del usuario para un partido/jornada.
* **Ranking**: clasificación dentro de un torneo y (si aplica) global/ranked.
* **Evento oficial**: torneo verificado por Rankup con reglas y premios potenciales.
* **Logros**: insignias/títulos/reconocimientos.
* **Notificación**: push + in-app para eventos del deporte y del juego.

### IDs canónicos

* Mantener IDs estables y ASCII para `sportId`, `gameModeId`, `competitionId`, etc. (la lista actual sirve como borrador, pero el criterio debe ser estabilidad y extensibilidad).

---

## 5) Taxonomía de torneos y verificación

### Hechos

* Torneos pueden ser por jornada o de temporada.
* Unirse a mitad de temporada será **configurable por torneo**.
* No habrá “espectador sin jugar”.
* Queréis que **logros/progresión** tengan validez: solo en torneos **verificados/oficiales**.

### Juicio técnico (modelo recomendado)

Definid 3 clases de torneo con reglas claras:

1. **Privado (Friends & Family)**

* Entrada: código/invitación/amigos.
* Objetivo: diversión social, chat, rankings internos, recap final.
* **No** afecta al ranking competitivo global ni desbloquea logros “serios” (puede desbloquear logros “casuales” privados si queréis, pero no los de prestigio).

2. **Público no verificado (Community Open)**

* Entrada abierta, pero **sin** progresión/estatus oficial.
* Uso: “quiero jugar con desconocidos” sin que Rankup certifique la competición.
* Esto es opcional: podéis incluso omitirlo en MVP para evitar ruido.

3. **Verificado (Official / Sponsored / Creator Verified)**

* Curado por Rankup o partners/influencers verificados.
* **Única fuente** de:

  * progresión competitiva (rating/ELO),
  * logros de prestigio,
  * acceso a torneos élite,
  * premios oficiales.

### Criterios de verificación (deben decidirse)

* Quién puede crear verificados (Rankup, creadores con contrato, partners).
* Reglas: scoring fijo o “plantillas” aprobadas.
* Requisitos antifraude (ver sección 11).

---

## 6) Game modes: principios y alcance

### Hechos

* ScorePrediction está en mente como core.
* Draft está planeado (tipo arena/rápido por jornada).
* No queréis fantasy con fichajes como núcleo a corto plazo.

### Juicio técnico (principios para todos los modos)

Cada game mode debe cumplir:

1. **Accesible en 30–60 segundos** (usuario entiende qué hacer).
2. **Decisión simple, consecuencia clara** (puntos/ranking).
3. **Feedback en directo** (cuando ocurre el evento real).
4. **Jugable tanto en torneo jornada como temporada** (cambia la agregación y narrativa, no la complejidad).
5. **Configuración avanzada opcional** por torneo, sin romper compatibilidad.

#### ScorePrediction (core)

Decisiones pendientes imprescindibles:

* Scoring completo y versionado (por torneo).
* Lock de predicciones (kickoff, gracia, comportamiento en retrasos).
* Postpuestos/cancelados: reglas claras (nulo, reprogramado, o reembolso de picks).
* Tie-breakers de ranking (puntos, exactos, racha, tiempo de envío, etc.).
* Qué se predice: marcador exacto vs 1X2 + extras (goles, ambos marcan, etc.) sin complicar.

#### Draft (por jornada)

Enfoque alineado con “baja fricción”:

* Draft rápido con pool curado/limitado (para que no requiera conocer 300 jugadores).
* Mecánica pensada para “entro, elijo, listo”.
* El scoring debe ser transparente y explicado in-app.

> Si algún día entra “market/fichajes”, que sea **modo opcional** y segmentado, nunca requisito para progresar.

---

## 7) Descubrimiento: evitar el “buscador feo” y construir deseo

### Hechos

* El equipo ve muy peliaguda una sección tipo buscador/listado plano de torneos.
* Pregunta central: **¿por qué alguien jugaría un torneo público?**
* Preferís “eventos/desafíos destacados” curados (cards visuales).
* Logros/progresión solo en verificados es una palanca aceptada.

### Juicio técnico (diseño recomendado)

El descubrimiento debe ser un **Hub de Eventos**, no un buscador.

#### El Hub de Eventos (estructura)

* **Ahora (en vivo)**: torneos con partidos en directo + cambios de ranking en tiempo real.
* **Esta semana**: desafíos próximos con countdown (“cierra inscripciones en X horas”).
* **Para ti**: recomendado por deporte favorito, horarios, amigos participando.
* **Oficiales**: siempre visibles, verificados, con sello.
* **Creadores**: torneos de influencers con branding.
* **Ruta de progreso**: “tu siguiente paso” (p. ej., “estás a 120 puntos de subir de división”).

#### Respuesta a “¿por qué jugar un público?”

Solo hay 5 motivos reales (si no, no funciona):

1. **Progresión competitiva** (rating/divisiones/temporadas).
2. **Reconocimiento** (ranking público, títulos, hall of fame).
3. **Acceso** (torneos élite desbloqueables).
4. **Recompensa** (premios oficiales o trofeos raros).
5. **Narrativa social** (juego con comunidad/influencer, no solo desconocidos).

Si el torneo público no activa al menos 2 de esos motivos, será “0 apetecible”.

#### Implicación fuerte

* Si **logros/ranking** solo existen en verificados, entonces el Hub debe empujar a verificados como “la competición real”, y lo privado queda como “modo social”.

---

## 8) Progresión competitiva tipo Clash Royale (sin ruido)

### Hechos

* El equipo quiere una estructura tipo Clash Royale (ligas, temporadas, niveles).
* Quieren hacerlo “desde el desengaño”: sin sistemas que suenen a humo o que no aporten.

### Juicio técnico (modelo recomendado, mínimo viable y escalable)

#### 8.1 Doble sistema: Rating competitivo + Progreso de cuenta

* **Rating competitivo (ELO-like)**: mide habilidad; afecta divisiones y emparejamientos si hay matchmaking.
* **Nivel de cuenta (XP)**: mide actividad/participación; da títulos “de veteranía”, pero no define habilidad.

#### 8.2 Rating: ¿único o por game mode?

**Decisión crítica.** Mi recomendación para minimizar error:

* **Rating por game mode** (y opcionalmente por deporte si lo necesitáis)

  * Ventaja: justicia; el usuario entiende “soy bueno en ScorePrediction”.
  * Evita mezclar habilidades no comparables.

* **Un ranking global unificado** solo como capa “meta” (no competitiva):

  * “Reputación Rankup” basada en participación verificada y consistencia (XP, trofeos, hitos).
  * Esto da un número global sin contaminar la competición.

**Recomendación final:**
➡️ **ELO competitivo por game mode + Progreso global (XP) unificado.**
Es el equilibrio con menor riesgo de “fallar” por injusticia percibida.

#### 8.3 Temporadas y divisiones

* Temporadas (p. ej. mensuales o cada 6 semanas).
* **Reset parcial** al final: no “borrar”, sino comprimir.
* Recompensas de temporada (cosmética de perfil + trofeo histórico).
* Divisiones claras (pocas): Bronce/Plata/Oro/Platino/Élite.

#### 8.4 Qué desbloquea el progreso

* **Solo** elementos visuales y acceso a eventos (no power-ups).
* Ejemplos válidos en Rankup:

  * Marcos de perfil, títulos, insignias, trofeos en vitrina, emblemas de temporada.
  * Acceso a “Torneos Élite” o “Clasificatorios” (sin pay-to-win).

#### 8.5 Regla de validez

* El rating/logros **solo se mueven** en torneos verificados.
* Privados: diversión social + recaps, pero no afectan el “estatus público”.

---

## 9) Capa social: amigos, follow e invitaciones

### Hechos

* Queréis amigos, invitaciones directas y posibilidad de seguir a otros usuarios.

### Juicio técnico (prioridades)

1. **Amigos + invitación directa a torneo** (MVP social real).
2. **Compartir por link/código** (fricción mínima para grupos).
3. **Follow** (útil para creadores/top players), pero con controles anti-spam.

### Reglas sociales recomendadas

* No feed global abierto.
* Feed “social” solo:

  * actividad de amigos,
  * actividad de torneos donde participas,
  * contenido oficial/curado.

### Privacidad (decisiones)

* Perfiles: público / solo amigos / privado.
* Mostrar historial: solo verificados visibles públicamente por defecto (alineado con “validez”).

---

## 10) Creadores, comunidades y branding

### Hechos

* Es “muy importante” y queréis identidad propia del influencer.
* El equipo no domina moderación/gestión: quiere estándar.

### Juicio técnico (qué es imprescindible)

**Creator Verified Tournament** debe incluir:

* Branding: nombre, logo, portada, descripción, enlaces (según política).
* Herramientas de comunidad:

  * moderadores delegados,
  * expulsar/silenciar,
  * mensajes fijados,
  * reglas de comunidad visibles.
* Métricas básicas para el creador (participantes, actividad).
* Sello verificado + criterios públicos (para que la gente confíe).

**Riesgo si no se hace:** torneos de creadores degeneran en caos o spam, y el canal se vuelve tóxico y poco fiable.

---

## 11) Moderación, antifraude y seguridad

### Hechos

* Os preocupa spam/abuso (nombres ofensivos, etc.).
* Habrá niños potencialmente.
* Torneos oficiales con premios implican riesgo de multi-cuentas.

### Juicio técnico (estándar mínimo)

* Filtro de lenguaje en nombres (usuario, torneo, comunidad) + lista por idioma.
* Reporte de usuario y mensajes.
* Rate limits en chat y creación de torneos.
* Para eventos con premios:

  * detección multi-cuenta (dispositivo, patrón, email/phone opcional),
  * verificación adicional para reclamar premio (KYC ligero o verificación de identidad según legalidad).

**Separación clave:**

* Moderación de privados: más laxa (sin perder seguridad básica).
* Moderación de verificados/oficiales: estricta + visible.

---

## 12) Ciclo de vida del torneo y “Wrapped” (retención por memoria)

### Hechos

* Queréis estadísticas profundas por torneo y “wrapped” final.
* Los usuarios deben poder revivir torneos y ver historial.

### Juicio técnico (qué debéis almacenar sí o sí)

#### Por torneo

* Clasificación por jornada y final.
* Evolución de posiciones (línea temporal).
* “Momentos clave” (subidas por gol, etc.).
* MVPs: quién más puntos aportó, quién acertó más exactos, etc.

#### Por usuario (dentro del torneo)

* picks realizados, tasa de acierto, puntos por jornada, rachas.
* comparativas (percentil dentro del torneo).

#### Wrapped (mínimo irresistible)

* “Tu mejor jornada”, “tu mayor subida”, “tu rivalidad”, “tus aciertos top”.
* Compartible (imagen/resumen) sin exponer datos sensibles.

---

## 13) Tiempo real y notificaciones (la app “viva”)

### Hechos

* Queréis que ante un gol el usuario entre a ver impacto en ranking.
* Visual “no estancado”.

### Juicio técnico (principios sin decidir tecnología aún)

* Debéis definir un **catálogo de eventos**:

  * deporte (gol, final, tarjeta, etc.),
  * juego (puntos asignados, ranking actualizado),
  * social (amigo te supera, te invita, etc.).
* Preferencias: notificaciones por torneo/deporte, ventanas horarias, anti-fatiga.
* UX en vivo: “puntuación en directo” y “ranking que se mueve” (aunque sea con refresh rápido).

---

## 14) Analítica: producto y negocio (y valor para el usuario)

### Hechos

* Queréis métricas por usuario y segmentación por cohortes.
* Queréis stats por torneo para wrapped.

### Juicio técnico (arquitectura de medición)

#### Métricas internas (empresa)

* Activación: % que crea o se une a torneo en 24h.
* Retención D1/D7/D30 por cohortes (país, idioma, deporte, canal).
* Engagement: sesiones en directo vs fuera de directo.
* Conversión a eventos verificados: % usuarios privados → verificados.
* Salud: latencia en momentos de gol, tasa entrega push.

#### Métricas para usuario (producto)

* Perfil: historial de torneos verificados, trofeos, rangos, mejores logros.
* Estadísticas comparativas simples (no abrumar).

**Regla:** la analítica que no alimenta decisiones o wrapped es ruido. Medid menos, pero bien.

---

## 15) Monetización (sin traicionar el producto)

### Hechos

* No hay plan cerrado; necesitáis vía real y robusta.
* B2B licensing no encaja con la visión principal.

### Juicio técnico (opciones compatibles con vuestra identidad)

1. **Eventos verificados patrocinados** (marca pone premios + visibilidad curada).
2. **Suscripción premium** (sin pay-to-win):

   * analítica avanzada y wrapped extendido,
   * marcos/títulos exclusivos (cosmético),
   * acceso anticipado a eventos (no ventaja competitiva directa).
3. **Patrocinios con creadores** (revenue share) en comunidades verificadas.

**Riesgo:** meter ads agresivos o monetización opaca destruye confianza. Si monetizáis, que sea “beneficio claro”.

---

## 16) Decisiones pendientes (bloqueantes antes de OpenAPI por fases)

1. **ELO por modo** (recomendado) vs ELO global único (alto riesgo de injusticia).
2. Definición formal de **“verificado”**: quién, cómo, criterios, y qué desbloquea.
3. Política de **premios** oficiales: elegibilidad, antifraude, reclamación.
4. Visibilidad pre-join en torneos públicos verificados (teaser mínimo sin “espectador”).
5. Reglas finales ScorePrediction (lock, postpuestos, tie-breakers, versionado).
6. Diseño del Draft “baja fricción” (qué se elige, cuántas decisiones, scoring).
7. Temporadas: duración, reset parcial, recompensas, divisiones.
8. Social: amigos vs follow; privacidad de perfil e historial por defecto.
9. Moderación: políticas de nombres, chat, reportes, sanciones.
10. Localización: idiomas iniciales, y cómo se gestionan traducciones (contenido, no URLs).

---

## 17) Hoja de ruta de producto (orientativa, por fases)

### Fase 0 — Core loop social + torneo privado

* Registro/login, perfil básico, amigos/invitación.
* Crear/join torneo privado.
* ScorePrediction mínimo viable.
* Ranking + chat básico.
* Notificaciones mínimas (inicio de jornada, cierre de predicciones, resultados).

### Fase 1 — Verificados + Hub de Eventos + Progresión

* Hub de Eventos curado (oficiales).
* Verificación + sello.
* Rating por modo + divisiones + temporada.
* Logros de prestigio solo en verificados.
* Wrapped básico por torneo.

### Fase 2 — Creadores y comunidades

* Creator verified tournaments + branding.
* Moderación avanzada + roles de moderador.
* Eventos de creadores en Hub.

### Fase 3 — Nuevos deportes y nuevos modos

* Extensión a baloncesto/esports/otros con registries.
* Draft maduro + otros modos.
* Reforzar personalización avanzada de torneos (sin romper simplicidad).

---

## Cierre: la tesis operativa de Rankup

Rankup no debe parecer “un buscador de ligas” ni “un fantasy de nicho”. Debe sentirse como **un juego vivo** que transforma el deporte real en competición social inmediata.
El eje maestro es: **Privado para diversión + Verificado para prestigio**.
Si esto se ejecuta con un Hub curado, progresión tipo temporadas, y feedback en directo, entonces la razón para jugar público deja de ser abstracta: es **progresar, ganar estatus y vivir eventos oficiales** sin perder el núcleo social con amigos.

Si quieres, el siguiente paso lógico (sin diseñar endpoints) es traducir este documento en:

* **bounded contexts** (Auth, Social Graph, Tournaments, Live Events, Rankings, Achievements, Creator Platform, Analytics),
* y una lista de **decisiones congeladas** (no reversibles) vs **decisiones flexibles** (iterables).
