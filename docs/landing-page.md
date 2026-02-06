# Rankup Landing Page — Guía de Ejecución Creativa Definitiva

**Objetivo único:** Convertir visitantes en nuevos jugadores registrados.
**Tesis:** La landing NO es un folleto corporativo. Es el **primer nivel del juego**. El visitante debe *sentir* Rankup antes de registrarse.

---

## Filosofía de diseño (alineada con Samba)

Según los principios de diseño de Rankup: "Design is gameplay. Not decoration." La landing aplica esto literalmente: **cada píxel debe contribuir a la conversión o irse**.

Del design direction:
> "Rankup es una experiencia de juego, no una herramienta."
> "Energético, no infantil. Competitivo, no agresivo. Claro, no ruidoso."

La landing tiene que vivir esa identidad: Clash Royale × Linear × deporte en vivo.

---

## Estructura de secciones (11 secciones + canvas persistente)

### Canvas global persistente: **"Campo de partículas vivo"**

Un `<canvas>` a pantalla completa debajo de todo el contenido, con partículas que representan "energía del juego":

- **Estado idle:** Partículas flotando en movimiento browniano suave, colores brand tenues (azul eléctrico `#00D1FF` + púrpura `#5B21B6`)
- **Al hacer scroll:** Las partículas reaccionan al movimiento — se aceleran, cambian de dirección, crean trails
- **Al llegar a secciones clave:** Explosión de partículas (burst) sincronizada con el reveal de contenido
- **Respeta `prefers-reduced-motion`:** Se congela en posiciones estáticas bonitas

**Implementación técnica:**
- Canvas 2D con `requestAnimationFrame`
- Pool de ~200 partículas en mobile, ~500 en desktop
- GPU-accelerated via `will-change: transform` en el canvas
- Intersection Observer para los bursts por sección

---

### SECCIÓN 0: Preloader cinematográfico (0-1.5s)

**Antes de que el usuario vea nada:**

```
[Fondo negro]
[Logo Rankup aparece letra por letra con efecto glitch sutil]
[Las letras "settle" con un flash de luz]
[Transición: el negro se "rompe" como una pantalla de cristal
 revelando el Hero debajo]
```

**Duración:** Max 1.5 segundos. No es skippable pero es rápido.
**Si es revisita:** Cookie detecta y salta directo al Hero.
**Técnica:** CSS keyframes + clip-path animations, zero JS blocking.

---

### SECCIÓN 1: Hero — "El primer contacto" (above the fold)

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│  [Logo]                           [ES ▾] [Entrar]       │
│                                                          │
│       ╔═══════════════════════════════╗                  │
│       ║                               ║                  │
│       ║   "Cada gol cambia           ║                  │
│       ║    tu ranking."              ║                  │
│       ║                               ║                  │
│       ╚═══════════════════════════════╝                  │
│                                                          │
│   "Predice. Compite con amigos. Siente el deporte       │
│    como nunca. Sin apuestas. Sin complicaciones."        │
│                                                          │
│   ┌─────────────────────┐  ┌──────────────────────┐     │
│   │  ▶ Empieza gratis   │  │ Ver cómo funciona ↓  │     │
│   └─────────────────────┘  └──────────────────────┘     │
│                                                          │
│   ✓ Sin apuestas  ·  ✓ 100% gratis  ·  ✓ Todos los     │
│                                          niveles         │
│                                                          │
│         ┌──────────────────────────┐                     │
│         │  📱 [MOCKUP INTERACTIVO] │                     │
│         │     del ranking vivo     │                     │
│         └──────────────────────────┘                     │
│                                                          │
│                     ↓ scroll hint                        │
└──────────────────────────────────────────────────────────┘
```

**Copy definitivo del headline (3 opciones para A/B):**

| Variante | Headline | Subheadline |
|----------|----------|-------------|
| A (Provocador) | "¿Crees que sabes de fútbol? Demuéstralo." | "Predice resultados, compite con amigos y sube de ranking. Toda la emoción del deporte, cero complicaciones." |
| B (Directo) | "Cada gol mueve tu ranking." | "Rankup transforma el deporte en vivo en un juego social. Predice, compite, gana — sin apuestas, sin complicaciones." |
| C (Social) | "El juego que convierte cada partido en una guerra entre amigos." | "Crea un torneo, invita a tu grupo y compite prediciendo marcadores. Tu posición se actualiza en tiempo real." |

**Recomendación:** Empezar con Variante B. Es la que mejor comunica el diferenciador (ranking en vivo) en < 3 segundos.

**Animaciones del Hero:**
1. **Headline:** Aparece con efecto de "type-reveal" — cada palabra se materializa con un flash sutil de izquierda a derecha. Duración: 800ms
2. **Subheadline:** Fade-in + translate-y (de abajo) con delay 400ms
3. **CTAs:** Scale-in con bounce elástico, delay 800ms
4. **Badges:** Fade-in secuencial, 100ms entre cada uno
5. **Mockup interactivo:** Es un `<canvas>` mini que simula un ranking con nombres ficticios moviéndose. Cada ~3 segundos, "ocurre un gol" y las posiciones se reorganizan con animación. Los nombres cambian de posición con ease-out + flash de color (verde sube, rojo baja)

**El mockup interactivo es CRUCIAL.** No es una imagen estática. Es un mini-juego visual que demuestra el producto sin explicarlo.

**Sticky CTA en mobile:** Al hacer scroll más allá del Hero, aparece una barra sticky inferior:
```
┌─────────────────────────────────────────┐
│   ▶ Empieza gratis        [X cerrar]   │
└─────────────────────────────────────────┘
```

---

### SECCIÓN 2: "La jugada" — Core loop en 3 pasos (scroll-triggered)

**Concepto visual:** Una línea de "energía" horizontal que conecta 3 nodos. Al hacer scroll, la línea se va dibujando progresivamente (SVG animado o canvas) y cada nodo se "enciende" cuando la línea llega a él.

```
Título: "Empieza a competir en 3 jugadas"

─────────────── ⚡ ─────────────── ⚡ ─────────────── ⚡

    [ICONO ANIMADO 1]      [ICONO ANIMADO 2]      [ICONO ANIMADO 3]
    "Crea tu torneo"       "Predice marcadores"    "Sube de ranking"
    
    "Invita a amigos       "Antes de cada          "Cada acierto
     con un código.         jornada, envía          suma puntos. Tu
     30 segundos."          tus predicciones."      posición se mueve
                                                    en tiempo real."
```

**Animaciones por paso:**

1. **Paso 1:** Icono de grupo de personas — las "personas" (círculos) aparecen una a una como si se unieran a un círculo. Efecto de "invitación aceptada"
2. **Paso 2:** Icono de marcador — los números del marcador hacen un "slot machine" rápido antes de parar en "2-1"
3. **Paso 3:** Icono de ranking — una flecha sube animada con trail de partículas

**Técnica:** Lottie para iconos complejos, CSS keyframes para lo simple. IntersectionObserver para trigger al 50% del viewport.

**Micro-interacción bonus:** Al hover/tap en cada paso, el icono reproduce la animación de nuevo.

---

### SECCIÓN 3: "Siente el partido" — Demo del ranking vivo (sección estrella)

**Esta es la sección más importante después del Hero.** Según el documento fundacional: *"El corazón emocional de Rankup es el momento en que pasa algo importante fuera y el usuario siente la necesidad de entrar."*

**Concepto:** Un simulador interactivo embedded en la página.

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│   "La app que late al ritmo del partido"             │
│                                                      │
│   ┌────────────────────────────────────────────┐     │
│   │                                            │     │
│   │   REAL MADRID  1 - 0  BARCELONA            │     │
│   │   ⚽ 23' Vinicius Jr.                      │     │
│   │                                            │     │
│   │   ─── RANKING EN VIVO ───                  │     │
│   │                                            │     │
│   │   1. 🟢↑ María G.     ·····  18 pts       │     │
│   │   2. 🔴↓ Carlos R.    ·····  15 pts       │     │
│   │   3. 🟡→ Tú           ·····  14 pts       │     │
│   │   4. 🟢↑ Pablo M.     ·····  12 pts       │     │
│   │   5. 🔴↓ Laura S.     ·····  10 pts       │     │
│   │                                            │     │
│   │         [⚡ SIMULAR GOL]                   │     │
│   │                                            │     │
│   └────────────────────────────────────────────┘     │
│                                                      │
│   "Cuando hay un gol, tu ranking cambia.             │
│    Cuando tu equipo marca, tus puntos suben.         │
│    Rankup no es una app para mirar después —         │
│    es para vivir el partido de otra forma."          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Interactividad del simulador:**
1. El ranking se anima solo cada ~4 segundos (auto-play)
2. El usuario puede pulsar **"⚡ SIMULAR GOL"** para forzar un evento
3. Cuando ocurre un "gol":
   - Flash de color en la barra del marcador
   - El marcador se actualiza con animación de números (flip-clock style)
   - Las posiciones del ranking se reorganizan con animación spring (posiciones suben/bajan físicamente con overshooting)
   - La fila "Tú" tiene highlight especial (glow pulsante)
   - Notificación tipo toast: "⚽ ¡Gol! Tu posición sube a 2°"
   - Las partículas del canvas de fondo explotan brevemente

**Implementación:** Canvas 2D para el simulador completo, o Lit components con Web Animations API para DOM-based. Recomendación: **DOM + Web Animations API** para mejor accesibilidad y SEO.

---

### SECCIÓN 4: "Múltiples formas de competir" — Modos de juego

**Layout:** Cards 3D con efecto hover de perspective-shift.

```
Título: "Tu próximo juego favorito. Y el siguiente."

┌────────────────────┐    ┌────────────────────┐
│                    │    │                    │
│  ⚽ ScorePrediction│    │  🃏 Draft          │
│                    │    │                    │
│  "Predice el       │    │  "Elige jugadores. │
│   marcador exacto. │    │   Monta tu equipo. │
│   Cuanto más       │    │   Sin fichajes     │
│   preciso, más     │    │   complicados."    │
│   puntos."         │    │                    │
│                    │    │  ┌──────────────┐  │
│  [DISPONIBLE]      │    │  │ PRÓXIMAMENTE │  │
│                    │    │  └──────────────┘  │
└────────────────────┘    └────────────────────┘

                 [+  Más modos en camino...]
```

**Animaciones:**
- Cards entran desde los laterales (izquierda y derecha) con stagger
- Al hover: la card se inclina ligeramente en 3D siguiendo la posición del cursor (`perspective` + `rotateX/Y`)
- La card de "Draft" tiene un efecto de "holográfico" en el badge de "Próximamente" — gradiente animado que se mueve

**El texto "Más modos en camino..." pulsa suavemente** para sugerir que el catálogo crece.

---

### SECCIÓN 5: "Para todo el mundo" — Eliminación de la barrera

**Concepto visual:** Split-screen con dos "arquetipos" que convergen.

```
Título: "Si sabes ver un partido, sabes jugar Rankup"

┌──────────────────────┬──────────────────────┐
│                      │                      │
│  👴 "Mi abuelo       │  📊 "Mi grupo de     │
│   nunca jugó         │   Fantasy competía   │
│   fantasy.           │   demasiado en       │
│                      │   serio.             │
│   Con Rankup,        │                      │
│   predice marcadores │   Con Rankup,        │
│   cada domingo."     │   seguimos con la    │
│                      │   adrenalina sin     │
│                      │   el estrés."        │
│                      │                      │
└──────────┬───────────┴───────────┬──────────┘
           │                       │
           └───────────────────────┘
                      ↓
           "Todos compiten. Todos disfrutan."
```

**Animación:** Al llegar a la sección, las dos mitades se "deslizan" hacia el centro y se fusionan, revelando la frase final que estaba oculta debajo.

**Técnica:** `clip-path: inset()` animado con IntersectionObserver. Las dos columnas se mueven con `transform: translateX()`.

---

### SECCIÓN 6: "Sube de nivel" — Progresión y ranked

**Concepto:** Una visualización vertical de "montaña" o "torre de divisiones" que el usuario escala con scroll.

```
Título: "Sube de división. Demuestra tu nivel."

                    🏆 ÉLITE
                   ╱        ╲
                  ╱  PLATINO  ╲
                 ╱              ╲
                ╱    ORO         ╲
               ╱                  ╲
              ╱   PLATA            ╲
             ╱                      ╲
            ╱     BRONCE             ╲
           ╱                          ╲
          ╱    ← TÚ EMPIEZAS AQUÍ     ╲
         ════════════════════════════════

"Solo la competición verificada mueve tu progreso.
 No hay atajos. No hay trampas. Solo mérito."

 • Temporadas competitivas con recompensas
 • Logros verificados que demuestran tu habilidad
 • Ranking global separado por modo de juego
```

**Animación:** 
- Al hacer scroll, un "escalador" (círculo con avatar placeholder) sube por la montaña
- Cada nivel se "ilumina" progresivamente
- Al llegar al top, explosión de confetti (canvas) + flash de luz
- El scroll controla directamente la posición del escalador (scroll-linked animation)

**Técnica:** CSS Scroll-Linked Animations (`animation-timeline: scroll()`) con fallback JS para browsers sin soporte.

---

### SECCIÓN 7: "Mejor con amigos" — Lo social

```
Título: "Ganar solo está bien. Ganar a tu cuñado no tiene precio."

[Animación: burbujas de chat apareciendo]

💬 "Jajaja 0-0 en el Madrid-Barça?"    — Pablo
💬 "Te quedan 3 partidos para alcanzarme" — María  
💬 "Este torneo es MÍO"                 — Carlos
💬 "🏆👀"                               — Laura

[Las burbujas se van acumulando con efecto de stack físico,
 como si cayeran con gravedad]

 • Crea torneos privados con un código
 • Chat integrado para el trash talk
 • Invita directamente desde tu lista de contactos
 • Comparte tus predicciones

[CTA] "Crea tu primer torneo"
```

**Animación:** Las burbujas de chat caen con física simulada (bouncing). Cada nueva burbuja desplaza a las anteriores. Es visually addictive.

**Técnica:** Librería de física 2D ligera (o custom con spring math). Cada burbuja es un div con posición absoluta controlada por JS.

---

### SECCIÓN 8: "Compite en grande" — Hub de eventos oficiales

```
Título: "Compite en grande"

[Carousel de cards tipo "Netflix" con eventos destacados]

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│ 🏆         │ │ ⚡         │ │ 🎯         │ │ 🌍         │
│ Champions  │ │ Desafío    │ │ La Liga    │ │ Mundial    │
│ League     │ │ de la      │ │ Challenge  │ │ 2026       │
│ Tournament │ │ Semana     │ │            │ │            │
│            │ │            │ │            │ │            │
│ 2.847      │ │ 892        │ │ 5.124      │ │ 12.000+    │
│ jugadores  │ │ jugadores  │ │ jugadores  │ │ jugadores  │
│            │ │            │ │            │ │            │
│ [UNIRSE]   │ │ [UNIRSE]   │ │ [UNIRSE]   │ │ [WAITLIST] │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
                    ← swipe →

"Tu progreso en eventos verificados cuenta para tu ranking global.
 Aquí se juega de verdad."
```

**Animación:** 
- Cards con parallax interno (la imagen de fondo se mueve más lento que el texto al hacer scroll horizontal)
- Al hover: la card se eleva con sombra más profunda + glow sutil del color de la competición
- Counter de "jugadores" hace count-up animado al entrar en viewport

---

### SECCIÓN 9: "Wrapped" — Recaps y estadísticas

```
Título: "Cada torneo se recuerda"

[Mockup de un "Wrapped" estilo Spotify]

┌─────────────────────────────────┐
│                                 │
│  📊 TU WRAPPED — Champions '26 │
│                                 │
│  🏆 3° de 24 jugadores         │
│  🎯 72% predicciones correctas │
│  ⚡ 3 veces consecutivas 1°    │
│  🔥 Mejor jornada: Jornada 4   │
│  💀 Peor rival: María G.       │
│                                 │
│  [Compartir en redes →]         │
│                                 │
└─────────────────────────────────┘

"No se trata solo de jugar.
 Se trata de haber vivido el torneo."
```

**Animación:** El Wrapped se revela "slide by slide" — como si fueras pasando stories de Instagram. Cada stat aparece con una animación única:
- La posición: counter animado
- El porcentaje: barra circular que se llena
- Los consecutivos: tres trofeos que caen con bounce

---

### SECCIÓN 10: FAQ — Resolución de objeciones

**Diseño:** Acordeón minimalista, sin decoración innecesaria. Cada pregunta se expande con animación de height + rotate del icono +.

| Pregunta | Respuesta |
|----------|-----------|
| "¿Rankup es gambling o apuestas?" | "No. Rankup es 100% gratuito y no involucra dinero real. Es un juego de competición social, no una plataforma de apuestas. Apto para todas las edades." |
| "¿Necesito saber mucho de fútbol?" | "Si puedes opinar sobre quién gana un partido, puedes jugar. Los modos están diseñados para todos los niveles." |
| "¿Puedo jugar solo con mis amigos?" | "Sí. Crea un torneo privado e invita con un código. 30 segundos." |
| "¿Hay premios?" | "En eventos oficiales puede haber premios como gift cards o merchandising. Nunca dinero real." |
| "¿En qué deportes puedo jugar?" | "Actualmente fútbol. Pronto: baloncesto, esports, tenis y más." |
| "¿Es gratis?" | "Sí. Completamente gratis." |

**La pregunta de gambling va PRIMERA.** Es la objeción #1 que hay que matar.

---

### SECCIÓN 11: Footer CTA final — "El cierre"

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│           "¿Listo para demostrar lo que sabes?"          │
│                                                          │
│          ┌───────────────────────────────────┐           │
│          │   ▶  EMPIEZA A COMPETIR GRATIS    │           │
│          └───────────────────────────────────┘           │
│                                                          │
│     [El canvas de partículas de fondo se intensifica     │
│      aquí — las partículas convergen hacia el CTA        │
│      creando un efecto de "atracción gravitacional"]     │
│                                                          │
│  ─────────────────────────────────────────────────       │
│                                                          │
│  Rankup  ·  Sobre nosotros  ·  Privacidad  ·  Términos  │
│  Contacto  ·  [Twitter] [Instagram] [TikTok]            │
│                                                          │
│  "Rankup no es una plataforma de apuestas.               │
│   No involucra dinero real. Apto para todas las edades." │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Animación del CTA final:** El botón tiene un glow pulsante permanente. Las partículas del canvas se sienten "atraídas" hacia él como un campo gravitacional.

---

## Especificaciones técnicas de animación

### Prioridades de performance (alineado con la guía estratégica)

| Métrica | Objetivo |
|---------|----------|
| LCP | < 2.0s |
| FID/INP | < 100ms |
| CLS | < 0.05 |
| Lighthouse | > 95 |

### Reglas de implementación

1. **Canvas global:** `requestAnimationFrame` con throttle a 30fps en mobile
2. **Animaciones de scroll:** CSS `animation-timeline: scroll()` con fallback IntersectionObserver
3. **Micro-interacciones:** Web Animations API (no libraries)
4. **Iconos animados complejos:** Lottie-light (< 50KB total)
5. **`prefers-reduced-motion`:** TODO se degrada a opacidad simple o ninguna animación
6. **Lazy loading:** Todas las secciones debajo del fold cargan assets on-demand
7. **Fonts:** Solo Poppins 700 + Nunito Sans 400/700 (subset + preload + `font-display: swap`)
8. **Images:** AVIF primary, WebP fallback, responsive `srcset`

### Arquitectura del canvas global

```
class RankupParticleField {
  private particles: Particle[]
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  
  // Scroll position normalizado [0, 1]
  private scrollProgress: number
  
  // Secciones registradas para bursts
  private burstZones: Map<string, { y: number, triggered: boolean }>
  
  animate() {
    // 1. Update particle positions (brownian + scroll-reactive)
    // 2. Check burst zones (IntersectionObserver)
    // 3. Apply gravity towards CTA button in footer zone
    // 4. Render
    requestAnimationFrame(() => this.animate())
  }
}
```

---

## Copy bank completo (para traducción a EN/PT/FR/DE/IT)

| Sección | Clave i18n | ES | EN |
|---------|-----------|-----|-----|
| Hero headline | `hero.headline` | "Cada gol mueve tu ranking." | "Every goal moves your ranking." |
| Hero sub | `hero.sub` | "Predice, compite, gana — sin apuestas." | "Predict, compete, win — no betting." |
| CTA primary | `cta.primary` | "Empieza gratis" | "Start free" |
| CTA secondary | `cta.secondary` | "Ver cómo funciona" | "See how it works" |
| Steps title | `steps.title` | "Empieza a competir en 3 jugadas" | "Start competing in 3 moves" |
| Step 1 | `step.1.title` | "Crea tu torneo" | "Create your tournament" |
| Step 2 | `step.2.title` | "Predice marcadores" | "Predict scores" |
| Step 3 | `step.3.title` | "Sube de ranking" | "Climb the rankings" |
| Live title | `live.title` | "La app que late al ritmo del partido" | "The app that beats with the match" |
| Sim button | `live.sim` | "⚡ Simular gol" | "⚡ Simulate goal" |
| Social title | `social.title` | "Ganar a tu cuñado no tiene precio." | "Beating your brother-in-law is priceless." |
| Footer CTA | `footer.cta` | "¿Listo para demostrar lo que sabes?" | "Ready to prove what you know?" |
| Badge 1 | `badge.noBetting` | "Sin apuestas" | "No betting" |
| Badge 2 | `badge.free` | "100% gratis" | "100% free" |
| Badge 3 | `badge.allLevels` | "Todos los niveles" | "All levels" |

---

## Flujo de conversión (funnel detallado)

```
Visitante llega
       │
       ▼
[HERO] ← 60% de conversiones ocurren aquí
       │    CTA "Empieza gratis" → /signup
       │    CTA "Ver cómo funciona" → scroll smooth a §2
       │
       ▼
[CORE LOOP] → Entiende qué es
       │
       ▼
[DEMO VIVA] ← 25% de conversiones aquí (después de "sentirlo")
       │    El simulador tiene CTA contextual:
       │    "¿Te imaginas esto con tus amigos? →"
       │
       ▼
[SOCIAL/PROGRESSION] → Motivación emocional
       │
       ▼
[FAQ] → Resuelve última duda
       │
       ▼
[FOOTER CTA] ← 15% restante (los más escépticos)
```

**Regla de conversión:** En ningún viewport visible puede faltar un CTA o un path claro hacia el registro.

---

## Checklist de ejecución

- [ ] Canvas de partículas global implementado con `prefers-reduced-motion`
- [ ] Hero con mockup interactivo de ranking en canvas/DOM
- [ ] Simulador de gol interactivo en §3 (la pieza estrella)
- [ ] Scroll-linked animations en §6 (montaña de divisiones)
- [ ] Burbujas de chat con física en §7
- [ ] Carousel de eventos con parallax interno en §8
- [ ] Sticky CTA mobile activo después del Hero
- [ ] A/B testing de 3 variantes de headline
- [ ] Copy traducido a ES + EN (mínimo para launch)
- [ ] Lighthouse > 95 en mobile
- [ ] `prefers-reduced-motion` cubre TODAS las animaciones
- [ ] Cookie para skip preloader en revisitas
- [ ] Schema.org `SoftwareApplication` implementado
- [ ] Open Graph + Twitter Cards validados
- [ ] Disclaimer "sin gambling" visible sin scroll

---

## Referencia cruzada con repositorio

| Concepto | Fuente en el repo |
|----------|-------------------|
| Separación landing/SPA | [ADR 0042](docs/adr/0042-apps-layer-and-spa-split.md) |
| App destino del deploy | [apps/rankup-web](apps/rankup-web/index.html) (placeholder actual) |
| Design system base | [Samba](packages/samba/definitions.d.ts) (styles, overlays, components) |
| Fonts | Poppins + Nunito Sans (ver [index.html SPA](apps/rankup-spa/index.html#L12)) |
| CSS vars | `--color-canvas-default`, `--color-fg-default`, `--color-header-bg` etc. |
| Principios de diseño | [Design Principles](packages/samba/design-principles-deck.md) |
| Dirección visual | [Design Direction](packages/samba/design-direction.md) |
| Documento fundacional | [Rankup Humano](docs/negocio/rankup-humano.md) |
| Guía estratégica previa | [Landing Strategy Guide](docs/landing-page-strategy-guide.md) |
| Scope del producto | [Scope README](docs/scope/README.md) |

La landing se despliega desde `apps/rankup-web` (actualmente un placeholder vacío) con su propio pipeline de build, separado completamente de `apps/rankup-spa`. No comparte runtime ni bundle con la SPA. Puede reusar design tokens de Samba vía CSS custom properties pero no importa componentes Lit del SPA.
