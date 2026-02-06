# Rankup — Design Principles

**Design is gameplay. Not decoration.**

---

## 0. Principio Cero (Regla Suprema)

### **Si el diseño no mejora la experiencia competitiva del torneo, está mal diseñado.**

No importa:

* si es bonito,
* si es moderno,
* si está “de moda”.

En Rankup, **el diseño existe para servir al juego**.

---

## 1. Tournament-Centric by Design

### Principio

> **El torneo es el contenedor mental de toda la experiencia.**

### Implicaciones

* El usuario **nunca** debe dudar:

  * en qué torneo está,
  * qué jornada se está jugando,
  * qué impacto tiene una acción.
* El diseño **no puede** fragmentar el contexto del torneo.

### Reglas prácticas

* El torneo activo debe estar siempre visible o implícito.
* Cambiar de torneo debe sentirse como cambiar de “partida”, no de “página”.

🚫 Anti-patrón
UI genérica donde el torneo es solo un item de lista más.

---

## 2. Ranking Is the Main Output

### Principio

> **El ranking no es una vista. Es el resultado del juego.**

### Implicaciones

* El ranking debe:

  * ser fácil de encontrar,
  * ser fácil de entender,
  * reaccionar a eventos.
* Cambios de posición son **eventos visuales**, no solo números.

### Reglas prácticas

* Subir o bajar posiciones debe ser perceptible sin leer.
* El usuario debe entender *por qué* su posición cambió.

🚫 Anti-patrón
Ranking estático, enterrado en una tab secundaria, sin feedback visual.

---

## 3. React to Reality, Don’t Refresh Data

### Principio

> **Rankup no muestra datos: reacciona a eventos reales.**

### Implicaciones

* Goles, finales de partido, cierres de jornada **deben sentirse**.
* La UI no puede parecer igual antes y después de un evento clave.

### Reglas prácticas

* Estados como `LIVE`, `GOAL`, `FT`, `LOCKED` deben tener identidad visual clara.
* El usuario debe notar que “algo acaba de pasar”.

🚫 Anti-patrón
UI que obliga a refrescar mentalmente (“¿ha pasado algo?”).

---

## 4. Low Cognitive Load Always Wins

### Principio

> **El usuario debe poder jugar sin pensar demasiado.**

### Implicaciones

* El diseño debe:

  * reducir decisiones simultáneas,
  * guiar acciones,
  * priorizar lo importante ahora.

### Reglas prácticas

* Nunca más de una acción primaria por pantalla.
* Mostrar lo relevante *para este momento*, no todo lo posible.

🚫 Anti-patrón
Pantallas densas tipo fantasy clásico con exceso de tablas y filtros.

---

## 5. Social by Context, Not by Exposure

### Principio

> **La socialización ocurre dentro del torneo, no en un feed global.**

### Implicaciones

* El diseño social:

  * vive en torneos,
  * vive en rankings,
  * vive en chats de contexto.
* No existe “timeline global” de desconocidos.

### Reglas prácticas

* Mostrar amigos y rivales **en relación al torneo**.
* Comparación social siempre contextual.

🚫 Anti-patrón
Feed infinito tipo red social que rompe el foco del juego.

---

## 6. Verified Means Meaningful

### Principio

> **Si algo no es verificado, no debe parecer importante.**

### Implicaciones

* Logros, ranking global, progresión:

  * solo tienen peso visual si son verificados.
* Ligas privadas pueden ser divertidas, pero **no prestigiosas**.

### Reglas prácticas

* Elementos verificados deben diferenciarse claramente.
* Nunca confundir prestigio privado con prestigio oficial.

🚫 Anti-patrón
Mostrar una liga de amigos con el mismo peso visual que un evento oficial.

---

## 7. Design for Change, Not for Screens

### Principio

> **Rankup es un sistema de estados, no una colección de pantallas.**

### Implicaciones

* Diseñar estados y transiciones es más importante que layouts.
* El diseño debe contemplar:

  * antes / durante / después,
  * locked / unlocked,
  * live / finished.

### Reglas prácticas

* Cada estado debe tener:

  * propósito,
  * feedback,
  * transición clara.

🚫 Anti-patrón
Diseños estáticos que no consideran el paso del tiempo.

---

## 8. Visual Hierarchy Is a Contract

### Principio

> **La jerarquía visual comunica reglas del juego.**

### Implicaciones

* Tamaño, color y posición **no son estéticos**, son semánticos.
* El usuario debe saber qué importa con solo mirar.

### Reglas prácticas

* El elemento más importante debe dominar visualmente.
* El color solo se usa cuando significa algo.

🚫 Anti-patrón
Decoración sin semántica o uso arbitrario del color.

---

## 9. Endings Matter (Memory Is Retention)

### Principio

> **Un torneo debe sentirse cuando termina.**

### Implicaciones

* El cierre del torneo es tan importante como el inicio.
* El usuario debe:

  * entender el resultado,
  * recordar la experiencia,
  * querer repetir.

### Reglas prácticas

* Recap claro, emocional y compartible.
* Visualizar ganador, hitos y momentos clave.

🚫 Anti-patrón
Final de torneo sin cierre emocional (“simplemente desaparece”).

---

## 10. Designers Are Part of the System

### Principio

> **El diseño no puede ignorar la arquitectura.**

### Implicaciones

* El diseñador debe entender:

  * estados del dominio,
  * roles,
  * verificación,
  * restricciones reales de la API.
* No se diseñan features “porque sí”.

### Reglas prácticas

* No inventar estados inexistentes.
* No asumir datos que el sistema no garantiza.
* Colaborar con arquitectura desde el inicio.

🚫 Anti-patrón
Diseño que fuerza cambios estructurales innecesarios en el sistema.

---

## Regla Final de Evaluación (Checklist)

Un diseño de Rankup es aceptable solo si:

* ⬜ Refuerza el torneo como centro
* ⬜ Hace visible el ranking y su impacto
* ⬜ Reacciona a eventos reales
* ⬜ Reduce fricción cognitiva
* ⬜ Usa lo social con contexto
* ⬜ Respeta verificación y prestigio
* ⬜ Diseña estados, no solo pantallas
* ⬜ Tiene jerarquía visual clara
* ⬜ Cierra bien la experiencia
* ⬜ Respeta la arquitectura existente

Si falla **uno**, se itera.
Si falla **varios**, se rechaza.

---

## Frase de cierre (para todos los designers)

> *In Rankup, design is not about looking good.
> It is about making competition feel real.*

---

Si quieres, el siguiente paso natural puede ser:

* transformar esto en **slides (estructura exacta por slide)**,
* crear un **design review checklist operativo**,
* o definir un **design QA process** (cómo se valida un diseño antes de implementarse).

Dime cómo quieres continuar.
