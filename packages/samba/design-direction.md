
# Rankup — Design Direction & Product Style Brief

**Audience:** Senior Product Designer / Senior UI Designer
**Purpose:** Alinear expectativas, criterio y responsabilidades desde el día 1.

---

## 1. Qué ES Rankup (desde diseño)

### Hechos

* Rankup **no es una app informativa** (tipo SofaScore).
* Rankup **no es un fantasy clásico** (Biwenger, Futmondo).
* Rankup **no es una red social abierta** (no feed global, no scroll infinito).
* Rankup **no es betting**.

### Definición clara

**Rankup es una app de juego social competitivo, basada en eventos deportivos reales, donde el núcleo es el torneo y el ranking.**

Desde diseño, Rankup debe sentirse como:

* una **experiencia de juego**, no como una herramienta,
* **viva y reactiva** a lo que ocurre en el mundo real,
* **social por contexto** (torneos), no por exposición pública.

---

## 2. Qué tipo de app es (clasificación de diseño)

Rankup pertenece a esta intersección:

> **🎮 Competitive Game × 📊 Live Sports × 👥 Social Groups**

No es UI de “producto SaaS”.
No es UI de “app de resultados”.
No es UI de “red social clásica”.

El referente mental correcto para el diseñador es:

* **Clash Royale / FIFA Ultimate Team / juegos competitivos móviles**
* mezclado con
* **apps deportivas en tiempo real**
* **sin** caer en fantasys complejos ni dashboards densos.

---

## 3. Principios de diseño NO negociables

### 3.1. El torneo es el centro del universo

* Todo ocurre **dentro de un torneo**.
* No debe existir sensación de “perderse” entre pantallas.
* El usuario siempre debe saber:

  * en qué torneo está,
  * qué jornada,
  * qué posición ocupa,
  * qué está ocurriendo ahora.

**Anti-patrón:** navegación genérica tipo tabs sin jerarquía clara.

---

### 3.2. El ranking manda

* El ranking **no es una pantalla secundaria**.
* Es el **output principal del juego**.
* Cambios de posición deben sentirse:

  * visualmente,
  * emocionalmente,
  * temporalmente (animaciones, highlights).

**Regla:**

> Si hay un gol y el usuario entra en la app, **tiene que “ver” el impacto sin buscarlo**.

---

### 3.3. Diseño “reactivo”, no estático

Rankup es una app donde **lo importante ocurre fuera** (goles, partidos).

Por tanto:

* La UI debe **reaccionar**, no solo mostrar datos.
* Estados como:

  * “gol ahora”,
  * “posición sube/baja”,
  * “matchday cerrada”
    deben ser **explícitos**.

**Anti-patrón:** pantallas que parecen iguales antes y después de un evento.

---

### 3.4. Baja fricción cognitiva

* El usuario medio **no quiere pensar demasiado**.
* El diseño debe permitir jugar:

  * rápido,
  * sin leer manuales,
  * sin conocer plantillas completas.

El diseño debe:

* guiar decisiones,
* reducir opciones simultáneas,
* priorizar acciones recomendadas.

**Anti-patrón:** interfaces tipo fantasy clásico llenas de tablas, filtros y estadísticas desde el inicio.

---

## 4. Qué tipo de diseñador buscamos (muy importante)

### NO buscamos

* Diseñador de marketing/branding puro.
* Diseñador de landing pages.
* Diseñador centrado en ilustración.
* Diseñador “Dribbble-first”.

### SÍ buscamos

Un **Senior Product / Game-aware Designer** que:

* entienda **loops de juego**,
* entienda **estados y transiciones**,
* piense en **tiempo, ritmo y feedback**,
* sepa diseñar **para eventos en vivo**,
* sepa trabajar con **datos cambiantes** (ranking, estados, locks).

Idealmente con experiencia en:

* juegos móviles competitivos,
* productos con ranking/leaderboards,
* apps en tiempo real,
* o productos donde el estado cambia constantemente.

---

## 5. Estilo visual deseado (sin imponer estética cerrada)

### Tono general

* **Energético**, no infantil.
* **Competitivo**, no agresivo.
* **Claro**, no ruidoso.
* **Moderno**, no “gaming hardcore”.

### Inspiración (conceptual, no para copiar)

* Juegos competitivos móviles (claridad + impacto).
* UI que sabe **cuándo animar y cuándo callar**.
* Uso intencional del color para:

  * estados,
  * cambios,
  * urgencia.

### Reglas implícitas

* El color debe **significar algo**, no decorar.
* Animaciones deben **explicar cambios**, no distraer.
* Tipografía legible bajo estrés (usuario entra rápido tras un gol).

---

## 6. Relación con la arquitectura (clave)

El diseñador debe entender que:

* Rankup es **API-first**.
* Los estados existen (draft / locked / live / finished).
* Hay **roles**, **permisos**, **verificación**, **ranked vs no ranked**.

Por tanto:

* El diseño **no puede inventar estados** que no existan.
* Debe colaborar estrechamente con arquitectura.
* Debe saber leer OpenAPI / modelos de dominio a alto nivel.

**Esto no es diseño aislado del sistema.**

---

## 7. Qué problemas de diseño tendrá que resolver

Un Senior Designer en Rankup deberá:

* Diseñar cómo se **siente** subir o bajar posiciones.
* Diseñar cómo se **entiende** un torneo sin leer reglas largas.
* Diseñar cómo se **descubre** un evento sin que parezca spam.
* Diseñar cómo se **termina** un torneo (recap, cierre emocional).
* Diseñar cómo conviven:

  * torneos privados,
  * torneos oficiales,
  * progresión ranked,
    sin confundir al usuario.

---

## 8. Qué le pediremos como prueba / primer entregable

En entrevistas o onboarding, **NO pedir**:

* landing pages,
* icon sets,
* branding.

**Pedir:**

1. Propuesta de **Home / Torneo activo**.
2. Propuesta de **Ranking vivo**.
3. Propuesta de **Momento gol → impacto visual**.
4. Propuesta de **Fin de torneo / recap**.

Esto revela inmediatamente si el diseñador:

* entiende el producto,
* entiende el juego,
* entiende el ritmo.

---

## 9. Frase de cierre (para el job description)

> *Rankup is not a sports app with social features.
> It is a competitive social game that happens to use real sports as its engine.*

Si el diseñador **no conecta** con esta frase, **no es el perfil correcto**.

---

Si quieres, el siguiente paso lógico puede ser:

* convertir esto en un **job description listo para publicar**, o
* definir un **design principles deck (10 slides)** para entrevistas, o
* preparar un **design challenge concreto** alineado con Rankup.

Dime cómo quieres continuar.
