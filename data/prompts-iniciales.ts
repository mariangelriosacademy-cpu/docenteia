export const PROMPTS_INICIALES = [
  // ─── EVALUACIÓN (5) ───────────────────────────────────────────────────────
  {
    titulo: "Examen de selección múltiple",
    descripcion: "Genera un examen completo con preguntas de opción múltiple alineado al tema y nivel del estudiante.",
    prompt_texto: `Actúa como un docente experto en evaluación educativa.

Crea un examen de selección múltiple con las siguientes características:

- Materia: [MATERIA]
- Grado: [GRADO]
- Tema: [TEMA]
- Número de preguntas: [NUMERO_PREGUNTAS]
- Dificultad: [NIVEL_DIFICULTAD] (básico / intermedio / avanzado)

Formato requerido para cada pregunta:
1. Enunciado claro y preciso
2. Cuatro opciones (A, B, C, D)
3. Señala la respuesta correcta
4. Breve justificación de por qué es correcta

Al final incluye:
- Tabla de respuestas
- Criterios de calificación (escala de [ESCALA_CALIFICACION])
- Competencias que evalúa cada sección

El lenguaje debe ser apropiado para estudiantes de [GRADO].`,
    categoria: "Evaluación",
    etiquetas: ["examen", "selección múltiple", "evaluación sumativa"],
  },
  {
    titulo: "Rúbrica de evaluación detallada",
    descripcion: "Crea una rúbrica con criterios claros y niveles de desempeño para evaluar cualquier actividad o proyecto.",
    prompt_texto: `Actúa como especialista en evaluación por competencias.

Diseña una rúbrica de evaluación para:

- Actividad o producto a evaluar: [ACTIVIDAD]
- Materia: [MATERIA]
- Grado: [GRADO]
- Número de criterios: [NUMERO_CRITERIOS]

La rúbrica debe tener 4 niveles de desempeño:
1. Sobresaliente
2. Satisfactorio
3. En proceso
4. Necesita mejorar

Para cada criterio describe con precisión qué se observa en cada nivel. Usa lenguaje observable y medible, evita términos ambiguos.

Incluye:
- Ponderación de cada criterio (total 100%)
- Columna de observaciones para el docente
- Escala de calificación final: [ESCALA_CALIFICACION]

Formato: tabla clara lista para imprimir o compartir digitalmente.`,
    categoria: "Evaluación",
    etiquetas: ["rúbrica", "competencias", "evaluación formativa"],
  },
  {
    titulo: "Autoevaluación para estudiantes",
    descripcion: "Guía de autoevaluación reflexiva para que los estudiantes valoren su propio aprendizaje y desempeño.",
    prompt_texto: `Actúa como docente experto en metacognición y aprendizaje autorregulado.

Crea una guía de autoevaluación para estudiantes de [GRADO] sobre:

- Tema o unidad: [TEMA]
- Materia: [MATERIA]
- Tipo de trabajo realizado: [TIPO_TRABAJO]

La autoevaluación debe incluir:

1. SECCIÓN DE REFLEXIÓN (5 preguntas abiertas)
   - ¿Qué aprendí sobre [TEMA]?
   - ¿Qué me resultó difícil y cómo lo superé?
   - Adapta las preguntas al grado

2. SECCIÓN DE VALORACIÓN (escala del 1 al 5)
   - Lista 6 aspectos clave del trabajo realizado
   - Cada aspecto con descripción clara en lenguaje para [GRADO]

3. SECCIÓN DE METAS
   - ¿Qué haría diferente la próxima vez?
   - Mi compromiso para mejorar es...

Usa lenguaje sencillo, motivador y apropiado para [GRADO].`,
    categoria: "Evaluación",
    etiquetas: ["autoevaluación", "metacognición", "reflexión"],
  },
  {
    titulo: "Guía de evaluación oral",
    descripcion: "Estructura completa para realizar evaluaciones orales con criterios objetivos y preguntas graduadas.",
    prompt_texto: `Actúa como docente experto en evaluación oral y oralidad.

Prepara una evaluación oral completa para:

- Materia: [MATERIA]
- Tema: [TEMA]
- Grado: [GRADO]
- Duración por estudiante: [DURACION] minutos

Incluye:

1. BANCO DE PREGUNTAS (15 preguntas organizadas por nivel)
   - 5 preguntas de conocimiento (recuerda / define / menciona)
   - 5 preguntas de comprensión (explica / compara / describe)
   - 5 preguntas de análisis/aplicación (¿por qué? / ¿cómo usarías? / ¿qué pasaría si?)

2. RÚBRICA DE EVALUACIÓN ORAL
   - Claridad en la expresión
   - Dominio del contenido
   - Uso de vocabulario específico
   - Coherencia y organización de ideas
   - Seguridad y fluidez

3. HOJA DE REGISTRO para anotar desempeño de cada estudiante

Escala de calificación: [ESCALA_CALIFICACION]`,
    categoria: "Evaluación",
    etiquetas: ["evaluación oral", "oralidad", "preguntas"],
  },
  {
    titulo: "Lista de cotejo",
    descripcion: "Genera una lista de cotejo precisa con indicadores observables para verificar logros de aprendizaje.",
    prompt_texto: `Actúa como docente especialista en evaluación formativa.

Crea una lista de cotejo para evaluar:

- Actividad o desempeño: [ACTIVIDAD]
- Materia: [MATERIA]
- Grado: [GRADO]

La lista de cotejo debe:

1. Contener entre 12 y 18 indicadores observables
2. Cada indicador debe ser:
   - Redactado en positivo ("El estudiante logra...")
   - Medible y observable directamente
   - Específico, no ambiguo

3. Organizados en categorías:
   - Indicadores de proceso (cómo trabaja)
   - Indicadores de producto (qué entrega)
   - Indicadores de actitud (cómo se comporta)

4. Formato: tabla con columnas Sí / No / En proceso / Observaciones

5. Espacio para: fecha, nombre del estudiante, firma del docente

Nivel de lenguaje apropiado para [GRADO].`,
    categoria: "Evaluación",
    etiquetas: ["lista de cotejo", "indicadores", "observación"],
  },

  // ─── ACTIVIDADES (5) ──────────────────────────────────────────────────────
  {
    titulo: "Actividad de inicio motivadora",
    descripcion: "Crea una actividad de apertura dinámica que active conocimientos previos y motive a los estudiantes.",
    prompt_texto: `Actúa como docente creativo experto en motivación y enganche pedagógico.

Diseña una actividad de inicio (hook) para:

- Materia: [MATERIA]
- Tema nuevo a introducir: [TEMA]
- Grado: [GRADO]
- Tiempo disponible: [TIEMPO] minutos
- Número de estudiantes: [NUMERO_ESTUDIANTES]

La actividad debe:

1. GENERAR CURIOSIDAD e intriga sobre [TEMA]
2. ACTIVAR conocimientos previos relacionados
3. SER DINÁMICA: incluye movimiento, interacción o elemento sorpresa
4. CONECTAR con la vida cotidiana del estudiante de [GRADO]

Incluye:
- Materiales necesarios (sencillos y accesibles)
- Instrucciones paso a paso para el docente
- Preguntas detonadoras para el diálogo inicial
- Cómo hacer la transición hacia el tema central
- Variante si el grupo es tímido o poco participativo

Tono: entusiasta y práctico.`,
    categoria: "Actividades",
    etiquetas: ["inicio de clase", "motivación", "conocimientos previos"],
  },
  {
    titulo: "Juego didáctico para el tema",
    descripcion: "Diseña un juego educativo completo con reglas, materiales y objetivos de aprendizaje claros.",
    prompt_texto: `Actúa como diseñador de experiencias educativas y gamificación.

Crea un juego didáctico para:

- Materia: [MATERIA]
- Tema o contenido a reforzar: [TEMA]
- Grado: [GRADO]
- Número de jugadores: [NUMERO_ESTUDIANTES]
- Tiempo de juego: [TIEMPO] minutos
- Recursos disponibles: [RECURSOS] (ej: papel, dados, fichas, digital)

El juego debe incluir:

1. NOMBRE creativo y atractivo para el juego
2. OBJETIVO DE APRENDIZAJE claro
3. MATERIALES necesarios (fáciles de conseguir o fabricar)
4. REGLAS del juego (máximo 6, simples y claras)
5. MECÁNICA DE JUEGO paso a paso
6. ELEMENTO DE EVALUACIÓN integrado al juego
7. VARIANTES para hacerlo más fácil o más desafiante
8. PREGUNTAS DE CIERRE para reflexionar sobre lo aprendido

El juego debe ser inclusivo y funcionar para distintos ritmos de aprendizaje.`,
    categoria: "Actividades",
    etiquetas: ["juego", "gamificación", "aprendizaje lúdico"],
  },
  {
    titulo: "Actividad adaptada para estudiantes con TDAH",
    descripcion: "Diseña una actividad inclusiva con estructura clara, movimiento y estímulos apropiados para estudiantes con TDAH.",
    prompt_texto: `Actúa como docente especialista en educación inclusiva y TDAH.

Adapta o crea una actividad para un estudiante con TDAH en:

- Materia: [MATERIA]
- Tema: [TEMA]
- Grado: [GRADO]
- Nombre del estudiante (opcional): [NOMBRE_ESTUDIANTE]
- Duración: [TIEMPO] minutos

La actividad debe incorporar estrategias TDAH-friendly:

1. ESTRUCTURA CLARA
   - Instrucciones en pasos numerados (máximo 3 pasos a la vez)
   - Tiempo estimado visible para cada parte

2. MOVIMIENTO Y VARIEDAD
   - Incluye al menos un momento de movimiento físico
   - Alterna entre actividades escritas, orales y manipulativas

3. ESTIMULACIÓN ADECUADA
   - Uso de colores, imágenes o elementos visuales
   - Evita bloques largos de texto

4. REFUERZO POSITIVO
   - Mini-metas con celebración inmediata
   - Sistema de puntos o recompensa sencillo

5. MATERIALES específicos y listos para usar

Incluye nota para el docente sobre cómo acompañar al estudiante durante la actividad.`,
    categoria: "Actividades",
    etiquetas: ["TDAH", "inclusión", "adaptación", "neurodiversidad"],
  },
  {
    titulo: "Tarea creativa para casa",
    descripcion: "Genera una tarea para el hogar significativa, creativa y conectada con la vida real del estudiante.",
    prompt_texto: `Actúa como docente innovador que diseña tareas con propósito real.

Crea una tarea creativa para casa sobre:

- Materia: [MATERIA]
- Tema trabajado en clase: [TEMA]
- Grado: [GRADO]
- Tiempo estimado para realizarla: [TIEMPO]

La tarea debe:

1. TENER PROPÓSITO REAL: conectar [TEMA] con la vida cotidiana del estudiante
2. SER CREATIVA: ir más allá de copiar o repetir información
3. INVOLUCRAR A LA FAMILIA de manera opcional pero significativa
4. TENER PRODUCTO FINAL claro y tangible

Incluye:
- Instrucciones claras para el estudiante (lenguaje apropiado para [GRADO])
- Lista de materiales (económicos y accesibles)
- Criterios de evaluación simples (3 a 5 puntos)
- Opción A (versión estándar) y Opción B (versión para quien quiere un reto extra)
- Instrucción para el familiar o acudiente

La tarea debe poder completarse sin internet obligatorio.`,
    categoria: "Actividades",
    etiquetas: ["tarea", "creatividad", "familia", "aprendizaje en casa"],
  },
  {
    titulo: "Debate estructurado en el aula",
    descripcion: "Organiza un debate pedagógico con roles, reglas y preguntas detonadoras para desarrollar pensamiento crítico.",
    prompt_texto: `Actúa como docente experto en pensamiento crítico y oralidad argumentativa.

Organiza un debate estructurado para:

- Materia: [MATERIA]
- Tema o pregunta central del debate: [TEMA_DEBATE]
- Grado: [GRADO]
- Número de estudiantes: [NUMERO_ESTUDIANTES]
- Tiempo total: [TIEMPO] minutos

El debate debe incluir:

1. PREGUNTA CENTRAL provocadora y relacionada con [TEMA_DEBATE]

2. DOS POSICIONES claras para debatir
   - Posición A (a favor): argumentos sugeridos
   - Posición B (en contra): argumentos sugeridos

3. ROLES ASIGNADOS
   - Equipo A y Equipo B (debatientes)
   - Moderador/a (puede ser el docente o un estudiante)
   - Jurado evaluador (resto del grupo)

4. ESTRUCTURA DE TIEMPOS
   - Apertura, argumentación, réplica, cierre

5. RÚBRICA DE EVALUACIÓN para los debatientes

6. PREGUNTAS DE CIERRE para reflexión grupal

7. CRITERIOS para declarar ganador (opcional)

Incluye consejos para manejar el debate si se tensa.`,
    categoria: "Actividades",
    etiquetas: ["debate", "pensamiento crítico", "argumentación", "oralidad"],
  },

  // ─── COMUNICACIÓN A PADRES (4) ────────────────────────────────────────────
  {
    titulo: "Informe académico positivo para padres",
    descripcion: "Redacta un informe cálido y profesional destacando los logros y fortalezas del estudiante.",
    prompt_texto: `Actúa como docente empático y profesional redactando comunicaciones a familias.

Redacta un informe académico con enfoque positivo para:

- Nombre del estudiante: [NOMBRE_ESTUDIANTE]
- Grado: [GRADO]
- Período evaluado: [PERIODO]
- Materias destacadas: [MATERIAS]
- Logros específicos: [LOGROS]
- Fortalezas del estudiante: [FORTALEZAS]
- Áreas de interés o talentos observados: [TALENTOS]

El informe debe:

1. TENER UN SALUDO personalizado y cálido a la familia
2. DESTACAR 3 a 5 logros concretos y observables
3. DESCRIBIR las fortalezas del carácter y actitud del estudiante
4. MENCIONAR su participación y relación con compañeros
5. CERRAR con un mensaje motivador para el estudiante y la familia
6. TENER FIRMA del docente

Tono: profesional, cálido, honesto y motivador.
Extensión: máximo 1 página.
Evita lenguaje técnico o jerga pedagógica innecesaria.`,
    categoria: "Comunicación",
    etiquetas: ["informe", "padres", "logros", "comunicación positiva"],
  },
  {
    titulo: "Informe académico con áreas de mejora",
    descripcion: "Comunica situaciones de bajo rendimiento de manera constructiva, empática y orientada a soluciones.",
    prompt_texto: `Actúa como docente experto en comunicación asertiva con familias.

Redacta un informe académico que comunica áreas de mejora para:

- Nombre del estudiante: [NOMBRE_ESTUDIANTE]
- Grado: [GRADO]
- Período: [PERIODO]
- Situación académica: [SITUACION_ACADEMICA]
- Materias con dificultad: [MATERIAS_DIFICULTAD]
- Comportamiento o situación observada: [SITUACION_OBSERVADA]
- Acciones ya tomadas por el docente: [ACCIONES_TOMADAS]

El informe debe:

1. COMENZAR con un reconocimiento genuino de algo positivo del estudiante
2. PRESENTAR las dificultades de manera objetiva, sin juicios ni etiquetas
3. EXPLICAR el impacto académico de manera clara
4. PROPONER acciones concretas (3 a 5) para el hogar y la escuela
5. INVITAR a un diálogo constructivo (no culpar a la familia)
6. CERRAR con confianza en la mejora del estudiante

Tono: empático, directo, constructivo y profesional.
Evita frases como "su hijo es problemático" o lenguaje negativo.`,
    categoria: "Comunicación",
    etiquetas: ["informe", "padres", "áreas de mejora", "comunicación constructiva"],
  },
  {
    titulo: "Citación a reunión de padres",
    descripcion: "Redacta una convocatoria formal y clara para reunión individual o grupal con padres de familia.",
    prompt_texto: `Actúa como docente que redacta comunicaciones formales a familias.

Redacta una citación a reunión para:

- Nombre del estudiante (si es individual): [NOMBRE_ESTUDIANTE]
- Tipo de reunión: [TIPO_REUNION] (individual / grupal / urgente)
- Motivo general de la reunión: [MOTIVO]
- Fecha propuesta: [FECHA]
- Hora: [HORA]
- Lugar: [LUGAR]
- Docente que cita: [NOMBRE_DOCENTE]
- Institución: [NOMBRE_INSTITUCION]

La citación debe incluir:

1. ENCABEZADO formal con datos de la institución
2. SALUDO respetuoso a los padres/acudientes
3. MOTIVO de la citación (sin revelar detalles sensibles si es delicado)
4. DATOS CONCRETOS: fecha, hora, lugar
5. SOLICITUD de confirmación de asistencia
6. INSTRUCCIÓN sobre qué traer o preparar (si aplica)
7. FIRMA y datos de contacto del docente

Tono: formal, respetuoso y cordial.
Si el motivo es delicado, usa lenguaje neutro que no genere alarma innecesaria.`,
    categoria: "Comunicación",
    etiquetas: ["citación", "reunión", "padres", "comunicación formal"],
  },
  {
    titulo: "Felicitación por logro del estudiante",
    descripcion: "Envía un mensaje de reconocimiento cálido a la familia por un logro académico o personal del estudiante.",
    prompt_texto: `Actúa como docente que celebra los logros de sus estudiantes con las familias.

Redacta una felicitación para la familia de:

- Nombre del estudiante: [NOMBRE_ESTUDIANTE]
- Grado: [GRADO]
- Logro específico a celebrar: [LOGRO]
- Contexto del logro: [CONTEXTO_LOGRO]
- Esfuerzo observado: [ESFUERZO_OBSERVADO]
- Nombre del docente: [NOMBRE_DOCENTE]

El mensaje debe:

1. DIRIGIRSE calurosamente a la familia
2. DESCRIBIR el logro de manera específica y vívida
3. RECONOCER el esfuerzo del estudiante (no solo el resultado)
4. AGRADECER el apoyo de la familia en el proceso
5. EXPRESAR expectativas positivas para el futuro
6. INCLUIR una frase directa de felicitación para el estudiante

Tono: celebratorio, sincero, cálido y profesional.
Extensión: breve (máximo 15 líneas).
Puede ser enviado por escrito, WhatsApp o correo electrónico.`,
    categoria: "Comunicación",
    etiquetas: ["felicitación", "reconocimiento", "logros", "familia"],
  },

  // ─── ADAPTACIONES (3) ────────────────────────────────────────────────────
  {
    titulo: "Adaptar contenido para estudiantes con dislexia",
    descripcion: "Transforma cualquier texto o actividad para hacerlo accesible a estudiantes con dislexia.",
    prompt_texto: `Actúa como especialista en educación inclusiva y dislexia.

Adapta el siguiente contenido para un estudiante con dislexia:

- Materia: [MATERIA]
- Tema: [TEMA]
- Grado: [GRADO]
- Nombre del estudiante (opcional): [NOMBRE_ESTUDIANTE]
- Contenido o texto original a adaptar: [CONTENIDO_ORIGINAL]

Aplica estas adaptaciones específicas para dislexia:

1. FORMATO DEL TEXTO
   - Oraciones cortas (máximo 15 palabras)
   - Párrafos de máximo 3 líneas
   - Espaciado aumentado entre líneas
   - Negritas para palabras clave (no subrayado)

2. VOCABULARIO
   - Sustituye palabras complejas por sinónimos simples
   - Explica términos técnicos con ejemplos concretos

3. APOYO VISUAL
   - Sugiere íconos o imágenes para acompañar cada sección
   - Divide el contenido con subtítulos claros

4. ACTIVIDADES ALTERNATIVAS
   - Versión oral de las preguntas escritas
   - Actividad de completar en lugar de redactar desde cero

5. INSTRUCCIONES en pasos numerados, una acción por paso

Entrega el contenido adaptado listo para usar.`,
    categoria: "Adaptaciones",
    etiquetas: ["dislexia", "inclusión", "adaptación", "lectoescritura"],
  },
  {
    titulo: "Simplificar texto para bajo nivel lector",
    descripcion: "Adapta textos complejos a un lenguaje accesible para estudiantes con bajo nivel de comprensión lectora.",
    prompt_texto: `Actúa como especialista en comprensión lectora y lectura fácil.

Simplifica el siguiente texto para estudiantes con bajo nivel lector:

- Grado real del estudiante: [GRADO]
- Nivel lector aproximado: [NIVEL_LECTOR] (ej: lee como estudiante de 2° primaria)
- Materia: [MATERIA]
- Texto original: [TEXTO_ORIGINAL]

Aplica los principios de Lectura Fácil:

1. VOCABULARIO
   - Usa solo palabras de uso cotidiano
   - Cuando sea necesario un término técnico, explícalo de inmediato con ejemplo
   - Evita metáforas, dobles sentidos y expresiones idiomáticas

2. ESTRUCTURA DE FRASES
   - Máximo 10-12 palabras por oración
   - Orden directo: sujeto + verbo + complemento
   - Una idea por oración

3. ESTRUCTURA DEL TEXTO
   - Párrafos de 2-3 oraciones
   - Subtítulos simples para cada sección
   - Lista de puntos cuando hay varios elementos

4. VERIFICACIÓN FINAL
   - El texto simplificado debe mantener la información esencial
   - Un niño de [NIVEL_LECTOR] debe poder comprenderlo

Entrega: texto original vs. texto simplificado en paralelo.`,
    categoria: "Adaptaciones",
    etiquetas: ["lectura fácil", "comprensión lectora", "simplificación", "inclusión"],
  },
  {
    titulo: "Actividad para estudiante avanzado",
    descripcion: "Diseña una actividad de enriquecimiento para estudiantes que ya dominan el contenido y necesitan un mayor desafío.",
    prompt_texto: `Actúa como docente especialista en altas capacidades y enriquecimiento curricular.

Diseña una actividad de enriquecimiento para:

- Nombre del estudiante (opcional): [NOMBRE_ESTUDIANTE]
- Materia: [MATERIA]
- Tema que ya domina: [TEMA]
- Grado: [GRADO]
- Tiempo disponible: [TIEMPO]

La actividad debe:

1. IR MÁS ALLÁ del currículo estándar sin simplemente "dar más de lo mismo"
2. DESARROLLAR HABILIDADES de orden superior:
   - Análisis crítico
   - Creación o producción original
   - Resolución de problemas complejos
   - Conexiones interdisciplinarias

3. TENER AUTONOMÍA: el estudiante puede trabajar de manera independiente

4. PRODUCIR algo tangible: ensayo, proyecto, investigación, prototipo, presentación

5. INCLUIR criterios de evaluación desafiantes

Opciones de formato:
- Proyecto de investigación breve
- Creación de material para enseñar a sus compañeros
- Desafío de resolución de problemas reales
- Conexión con [MATERIA] + otra disciplina

Tono: retador, estimulante y que transmita confianza en las capacidades del estudiante.`,
    categoria: "Adaptaciones",
    etiquetas: ["altas capacidades", "enriquecimiento", "estudiante avanzado", "desafío"],
  },

  // ─── CREATIVIDAD (3) ──────────────────────────────────────────────────────
  {
    titulo: "Clase con storytelling",
    descripcion: "Transforma cualquier lección en una narrativa envolvente que captura la atención y facilita la retención.",
    prompt_texto: `Actúa como docente narrador experto en storytelling educativo.

Transforma la siguiente lección en una experiencia de storytelling:

- Materia: [MATERIA]
- Tema o concepto a enseñar: [TEMA]
- Grado: [GRADO]
- Duración de la clase: [TIEMPO] minutos
- Contexto o intereses del grupo: [INTERESES_GRUPO]

Diseña una narrativa completa que incluya:

1. PERSONAJE PRINCIPAL
   - Nombre y descripción breve
   - Problema o misión relacionada con [TEMA]
   - Conexión emocional con estudiantes de [GRADO]

2. ARCO NARRATIVO de la clase
   - Inicio: presenta el problema del personaje (gancho emocional)
   - Desarrollo: el personaje necesita aprender [TEMA] para resolver su problema
   - Clímax: momento de aplicación del conocimiento
   - Resolución: el personaje resuelve el problema gracias a lo aprendido

3. MOMENTOS DE PARTICIPACIÓN
   - 3 puntos donde los estudiantes toman decisiones del personaje
   - Preguntas para mantener la tensión narrativa

4. CONEXIÓN CON EL CONTENIDO
   - Cómo integrar los conceptos clave de [TEMA] en la historia

5. CIERRE: reflexión sobre la historia y el aprendizaje`,
    categoria: "Creatividad",
    etiquetas: ["storytelling", "narrativa", "creatividad", "motivación"],
  },
  {
    titulo: "Gamificar una lección aburrida",
    descripcion: "Convierte una lección densa o poco atractiva en una experiencia gamificada con puntos, retos y recompensas.",
    prompt_texto: `Actúa como diseñador de experiencias gamificadas para educación.

Gamifica la siguiente lección:

- Materia: [MATERIA]
- Tema (el que se percibe como "aburrido"): [TEMA]
- Grado: [GRADO]
- Duración: [TIEMPO] minutos
- Número de estudiantes: [NUMERO_ESTUDIANTES]
- Recursos disponibles: [RECURSOS]

Diseña el sistema de gamificación con:

1. NARRATIVA DEL JUEGO
   - Nombre de la misión o aventura temática
   - Contexto narrativo que justifica el aprendizaje de [TEMA]

2. MECÁNICAS DE JUEGO
   - Sistema de puntos o XP
   - Niveles a superar (mínimo 3)
   - Insignias o logros desbloqueables
   - Elemento de colaboración Y competencia sana

3. RETOS POR NIVEL
   - Nivel 1 (Novato): actividad introductoria
   - Nivel 2 (Explorador): actividad de práctica
   - Nivel 3 (Maestro): actividad de aplicación creativa

4. TABLA DE LIDERAZGO simple para la clase

5. RECOMPENSAS (no materiales, basadas en autonomía o reconocimiento)

6. CÓMO EVALUAR el aprendizaje dentro del juego

Debe funcionar con y sin tecnología.`,
    categoria: "Creatividad",
    etiquetas: ["gamificación", "motivación", "juego", "engagement"],
  },
  {
    titulo: "Usar música para enseñar un concepto",
    descripcion: "Integra la música como herramienta pedagógica para facilitar la comprensión y memorización de conceptos.",
    prompt_texto: `Actúa como docente creativo experto en artes integradas y pedagogía musical.

Diseña una actividad usando música para enseñar:

- Materia: [MATERIA]
- Concepto específico a enseñar: [CONCEPTO]
- Grado: [GRADO]
- Duración: [TIEMPO] minutos
- Acceso a tecnología: [ACCESO_TECNOLOGIA] (sí / no / limitado)

La actividad debe incluir:

1. SELECCIÓN MUSICAL
   - Sugiere 3 canciones o géneros apropiados para [GRADO]
   - Explica por qué cada una conecta con [CONCEPTO]
   - Alternativa si no hay acceso a reproductor

2. ACTIVIDAD PRINCIPAL (elige la que mejor aplique):
   - Opción A: Crear una canción/rap que explique [CONCEPTO]
   - Opción B: Analizar letra de canción y conectar con [CONCEPTO]
   - Opción C: Ritmo y movimiento para memorizar información clave
   - Opción D: Sonorizar un proceso o fenómeno de [MATERIA]

3. PROCESO PASO A PASO con tiempos

4. PRODUCTO FINAL que evidencie el aprendizaje

5. EVALUACIÓN: cómo calificar la actividad musical de manera justa

6. VARIANTE para estudiantes que se sienten incómodos con la música

Justificación breve de por qué la música mejora el aprendizaje de [CONCEPTO].`,
    categoria: "Creatividad",
    etiquetas: ["música", "artes integradas", "memorización", "creatividad"],
  },
]