import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `Eres un experto pedagógico hispanohablante con más de 20 años de experiencia en educación preescolar, primaria, secundaria y bachillerato. Dominas metodologías modernas como:
- Aprendizaje Basado en Proyectos (ABP)
- Constructivismo
- Gamificación educativa
- Aula invertida (Flipped Classroom)
- Aprendizaje colaborativo
- Montessori

Tu especialidad es crear planificaciones de clase detalladas, prácticas y adaptadas al contexto latinoamericano y español. Siempre consideras:
- Los diferentes estilos de aprendizaje (visual, auditivo, kinestésico)
- La diversidad en el aula
- El tiempo disponible para cada actividad
- Los recursos reales disponibles en el aula
- Los estándares curriculares vigentes

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown, sin explicaciones. Solo el JSON.`

function buildPrompt(data: any): string {
  return `Crea una planificación de clase completa con estos datos:

MATERIA: ${data.materia}
GRADO/NIVEL: ${data.grado}
TEMA ESPECÍFICO: ${data.tema}
OBJETIVO DE APRENDIZAJE: ${data.objetivo}
DURACIÓN: ${data.duracion}
NÚMERO DE ESTUDIANTES: ${data.numEstudiantes}
METODOLOGÍA: ${data.metodologia}
TIPO DE EVALUACIÓN: ${data.tipoEvaluacion}
RECURSOS DISPONIBLES: ${data.recursos?.join(', ') || 'No especificados'}
MOMENTO DE LA UNIDAD: ${data.momento || 'No especificado'}
OBSERVACIONES: ${data.observaciones || 'Ninguna'}

Responde ÚNICAMENTE con este JSON (sin markdown, sin texto extra):
{
  "titulo": "Título descriptivo de la clase",
  "objetivo_especifico": "Objetivo redactado con verbo de acción observable",
  "competencias": ["Competencia 1", "Competencia 2", "Competencia 3"],
  "actividades_inicio": [
    {
      "titulo": "Nombre de la actividad",
      "descripcion": "Descripción detallada paso a paso",
      "duracion_min": 10,
      "tipo": "motivacion"
    }
  ],
  "actividades_desarrollo": [
    {
      "titulo": "Nombre de la actividad",
      "descripcion": "Descripción detallada paso a paso",
      "duracion_min": 25,
      "recurso": "Recurso necesario",
      "tipo": "explicacion"
    }
  ],
  "actividades_cierre": [
    {
      "titulo": "Nombre de la actividad",
      "descripcion": "Descripción detallada",
      "duracion_min": 10,
      "tipo": "evaluacion"
    }
  ],
  "recursos_necesarios": ["Recurso 1", "Recurso 2"],
  "criterios_evaluacion": [
    {
      "criterio": "Descripción del criterio",
      "indicador": "Cómo se evidencia",
      "porcentaje": 100
    }
  ],
  "tarea_para_casa": "Descripción de la tarea o null si no aplica",
  "notas_docente": "Sugerencias importantes para el docente",
  "duracion_total_min": 45
}`
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar autenticación
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Verificar API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key no configurada. Agrega ANTHROPIC_API_KEY en .env.local' },
        { status: 500 }
      )
    }

    // 3. Obtener y validar datos
    const data = await req.json()
    const camposRequeridos = ['materia', 'grado', 'tema', 'objetivo', 'duracion', 'metodologia', 'tipoEvaluacion']
    const faltantes = camposRequeridos.filter(c => !data[c])
    if (faltantes.length > 0) {
      return NextResponse.json(
        { error: `Faltan campos requeridos: ${faltantes.join(', ')}` },
        { status: 400 }
      )
    }

    // 4. Verificar créditos del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('creditos, plan')
      .eq('id', user.id)
      .single()

    const creditos = profile?.creditos ?? 0
    const plan = profile?.plan ?? 'free'
    const costoGeneracion = 5 // créditos por planificación

    if (plan === 'free' && creditos < costoGeneracion) {
      return NextResponse.json(
        { error: 'Créditos insuficientes. Mejora tu plan para continuar.' },
        { status: 402 }
      )
    }

    // 5. Streaming con Claude
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.messages.create({
            model: 'claude-opus-4-6',
            max_tokens: 2000,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: buildPrompt(data) }],
            stream: true,
          })

          let fullText = ''

          for await (const event of response) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              fullText += event.delta.text
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }

          // 6. Descontar créditos
          await supabase
            .from('profiles')
            .update({ creditos: Math.max(0, creditos - costoGeneracion) })
            .eq('id', user.id)

          // 7. Guardar en historial
          try {
            const parsed = JSON.parse(fullText)
            await supabase.from('planificaciones').insert({
              user_id: user.id,
              tipo: data.tipo || 'diaria',
              materia: data.materia,
              grado: data.grado,
              tema: data.tema,
              contenido: parsed,
              estado: 'borrador',
            })
          } catch (_) {
            // Si no se puede parsear o guardar, no es crítico
          }

          controller.close()
        } catch (err: any) {
          const errorMsg = JSON.stringify({ error: err.message || 'Error al generar' })
          controller.enqueue(encoder.encode(errorMsg))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    })

  } catch (err: any) {
    console.error('Error en generate-planificacion:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
