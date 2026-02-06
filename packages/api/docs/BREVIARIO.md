# Breviario: visión y preguntas clave

## Modelo de negocio y propósito

### 1) ¿Cuál es el objetivo a largo plazo de Rankup como producto? ¿Qué problema busca resolver y para qué tipo de usuario?

A largo plazo, Rankup tiene que convertirse en **la plataforma de juego de los deportes**. Hoy, los juegos de fútbol (Biwenger, Futmondo, etc.) y los juegos de baloncesto o EA Sports son referentes con los que queremos competir.

Nuestro objetivo es ofrecer **distintos tipos de juego**: por ejemplo, un modo **draft** por jornada (estilo Hearthstone Arena o FUT Draft) y el modo **ScorePrediction**. La clave es darle énfasis al **espacio social**: estos juegos son divertidos porque compites contra amigos/familiares, aunque no se descarta la competencia en torneos globales.

Es muy importante el **feedback continuo** que haga la app “viva”. Es un juego donde lo importante ocurre fuera (goles, partidos, eventos). Cuando hay un gol u otro acontecimiento relevante, el usuario debe entrar rápido para ver la notificación y su impacto en la clasificación. Por eso, el aspecto visual y “vivo” de la app es crítico: no puede sentirse estancada en esos momentos, tiene que acompañar la urgencia y la adrenalina del usuario.

### 2) ¿Habrá monetización futura? (ej. patrocinio, ligas de marca, funciones premium, licencias B2B)

Licencias B2B no tienen sentido en este negocio. Vamos a grupos de amigos/familiares y, en última instancia, a individuos que compiten en torneos donde no se conocen.

Sobre monetización, el equipo aún no ha definido una vía sólida y robusta, pero es **fundamental** encontrar una vía real, escalable y sostenible.

### 3) ¿Está pensado como producto global o regional? ¿Qué mercados serán prioritarios?

Producto global, traducido a muchos idiomas.

## Diferenciación y visión de producto

### 4) ¿Cuál es el “motivo de uso diario” que justifica que un usuario regrese a la app varias veces por semana?

Queda explicado en el punto 1).

### 5) ¿Cuál es el valor único de Rankup comparado con otras apps sociales/deportivas (ej. Sofascore, ESPN Fantasy, FIFA Fantasy, Kickbase)?

Queda parcialmente explicado en el punto 1). Si es bloqueante, hay que profundizar.

### 6) ¿Se prevé que cada torneo sea efímero (tipo jornada/evento) o persistente (temporada completa)?

Ambas modalidades: jornada/evento y temporada completa.

### 7) ¿Habrá un feed global, comunidad, o sistema de descubrimiento más allá del código de invitación?

El equipo no comprende del todo el alcance de esta pregunta. En el punto 1) se habló de la visión general. Lo importante: un feed global de usuarios que no se conocen no tiene lógica y se considera **spam**.

Sí deberá haber sistema de descubrimiento; si no, no sería posible crear ligas y torneos donde la gente compite. Es una idea a explorar porque los fundadores han pensado primero en grupos de amigos/familiares. Para torneos globales, se pueden plantear sistemas tipo eventos (p. ej., PokerStars) o estilo mobile gaming (Clash Royale). Son ideas abiertas que requieren criterio y separar el grano de la paja.

### 8) ¿Existe una visión futura de “creadores” o ligas gestionadas por influencers, marcas o medios?

Sí, esto es muy importante.

### 9) ¿Habrá eventos oficiales gestionados por Rankup o es solo entre usuarios?

Sí, habrá eventos oficiales.

## Escalabilidad funcional

### 10) ¿Habrá ligas públicas con miles de usuarios o está orientado a grupos pequeños?

Habrá ligas públicas con miles de usuarios, aunque seguramente el porcentaje mayor sea en grupos pequeños.

### 11) ¿Los game modes tendrán reglas configurables por torneo o son fijos a nivel plataforma?

Deben ser configurables por torneo para mayor personalización, aunque será una configuración avanzada y poco común.

### 12) ¿Qué tipo de métricas o datos debe ofrecer la API para soportar analítica, rendimiento y mejoras?

Es muy importante tener estadísticas por torneo en el flujo del usuario y guardar mucha información sobre ello. Por ejemplo, al final del torneo se puede generar un “wrapped” o cada X jornadas. Este tipo de datos gusta al usuario medio: en ScorePrediction, ver quién ha conseguido más puntos acertando a X equipo, etc. Hay mucho que pensar y ofrecer; requiere un análisis y escrutinio profundo.

Para otras métricas, el equipo reconoce que necesita guía; como architect manager, deberás orientarlos.



Torneos Globales y Privacidad:

1) Torneos Globales y Privacidad:

1.1) ¿Qué información de un torneo público será visible antes de unirse? (ej. ranking parcial, número de jugadores, nombres) El equipo no tiene una decisión fuerte respecto a ésto. Hacer escrutinio para establecer lo mejor para el negocio y lo mas atractivo para el usuario

1.2) ¿Se permitirá seguir torneos como espectador sin jugar? -> no


2) Eventos Oficiales y Descubrimiento:

2.1) ¿Qué diferencias funcionales tendrán los torneos oficiales respecto a los creados por usuarios? (moderación, premios, acceso anticipado...) Rankup no es una plataforma de betting, esto está totalmente prohibido por lo que 'premios' en el sentido de pokerstars o bet365 no se puede ni es para nada lo que es Rankup.
Lo que sí se puede, por ejemplo, es en torneos de familaries y amigos poner Premios ya que es muy tipico que entre amigos/familiares haya un bote, o algun tipo de premio o de castigo por jornada por quedar ultimo o quedar ultimo en liga etc... por lo que esto si se tiene que poder hacer.
Luego por otro lado, Rankup en torneos oficiales si podrá dar premios pero estilo tarjetas amazon, o ps5, y un largo etc, pero nunca betting ni se puede considerar legalmente una plataforma betting. Los torneos oficiales serán publicos... y el equipo no tiene más información que comentar, ten en cuenta que el equipo tiene la idea en fase de desarrollo debes ayudar y guiar.

2.2) ¿Quién curará o destacará eventos globales? ¿Habrá roles internos de Rankup para eso?
El equipo de Rankup. Considera a Rankup como un único rol interno ya que no habrá distintos roles internos. Sólo uno.

3) Retención y Engagement:

3.1) ¿Está previsto un sistema de niveles, insignias o logros para usuarios? Sí, esto es esencial hacerlo de manera correcta y que realmente incentive al usuario y no sea otro recuros mas pesado y que realemnte no consigue retención. Es importante hacer escrutinio profundo ya que esto gusta mucho a los jugadores, pero de hacerlo mal, se vuelve una losa muy pesasda.

3.2) ¿Qué ocurre cuando termina un torneo? ¿Existe historial público o privado? Sí, cuando termina un torneo, tiene que ocurrir lo descrito en algunas respuestas, estadisticas, datos como en un 'wrapped', visualización del ganador de manera contundente, es un juego finalmente hablando, y la finalización de un torneo se tiene que sentir y ver de ésta manera, por supuesto que los jugadores tienen que poder ver los torneos que han jugado y revivir los detalles etc

4) Creadores e Influencers:

4.1) ¿Tendrán herramientas distintas? (moderación, branding, gestión de comunidades) El equipo no conoce mucho sobre este tema, pero es clave que haya todo lo necesario para que la comunidad, el torneo etc se sienta como propio del influencer con su identidad. El equipo de Rankup considera un punto a investigar, el hecho de crear comunidades y personalizarlas ya que puede ser muy buen punto social. Por supuesto de haber comunidades es esencial su moderación, branding y gestión

4.2) ¿Cómo se protegerá a los usuarios frente a spam o contenido abusivo? Qué tipo de spam puede haber en este negocio? y qué tipo de contenido abusivo? Lo único que se le ocurre al equipo, que desconoce de estos temas, es que por ejemplo el nombre no se puede poner palabrotas o palabras no permitidas para un juego que puede jugar niños? El equipo no sabe lo que se hace en estos temas pero hacer lo pertinente y estándar.

5) Datos para Analítica:

5.1) ¿Queréis ver engagement por usuario (ej. días activos, predicciones acertadas, tiempo en app)?
Sí, para ver el éxito de la app será importante ver las features que funcionan, las que no, y por usuario ver su reteneción, etc.

5.2) ¿Queréis poder segmentar por cohortes (edad estimada, país, deporte favorito)? Sí, para llevar adelante un negocio exitoso es importante conocer sobre el usuario y su uso en la app
