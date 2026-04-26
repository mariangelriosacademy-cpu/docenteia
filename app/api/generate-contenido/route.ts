import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SYSTEM_PROMPTS: Record<string, string> = {
  actividad: 'Eres un docente creativo y experto en pedagogía activa. Crea actividades didácticas dinámicas y participativas, con instrucciones claras, materiales necesarios y criterios de evaluación. Usa formato markdown bien estructurado.',
  evaluacion: 'Eres un experto en evaluación educativa. Crea instrumentos de evaluación claros, justos y bien estructurados, con preguntas variadas y criterios de calificación. Usa formato markdown bien estructurado.',
  guia: 'Eres un experto en materiales didácticos. Crea guías de trabajo paso a paso, claras y visualmente organizadas, con objetivos, desarrollo y actividades de cierre. Usa formato markdown bien estructurado.',
  rubrica: 'Eres un experto en evaluación por competencias. Crea rúbricas detalladas con criterios claros y niveles de desempeño (Excelente, Bueno, Regular, Insuficiente). Usa formato markdown con tablas.',
  lista_cotejo: 'Eres un experto en evaluación formativa. Crea listas de cotejo detalladas con indicadores observables claros y precisos. Usa formato markdown con checkboxes.',
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { tipo_contenido, materia, grado, tema, instrucciones_adicionales } = body

    if (!tipo_contenido || !tema) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        error: 'API key no configurada. Agrega ANTHROPIC_API_KEY en .env.local'
      }, { status: 503 })
    }

    const systemPrompt = SYSTEM_PROMPTS[tipo_contenido] || SYSTEM_PROMPTS.actividad

    const userPrompt = `Crea ${tipo_contenido === 'actividad' ? 'una actividad didáctica' :
      tipo_contenido === 'evaluacion' ? 'una evaluación' :
      tipo_contenido === 'guia' ? 'una guía de trabajo' :
      tipo_contenido === 'rubrica' ? 'una rúbrica de evaluación' :
      'una lista de cotejo'} con las siguientes características:

**Materia/Área:** ${materia || 'No especificada'}
**Grado/Nivel:** ${grado || 'No especificado'}
**Tema:** ${tema}
${instrucciones_adicionales ? `**Instrucciones adicionales:** ${instrucciones_adicionales}` : ''}

Genera el contenido completo, bien estructurado y listo para usar en el aula.`

    // Llamada a la API de Anthropic con streaming
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 2000,
        stream:     true,
        system:     systemPrompt,
        messages:   [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.error?.message || 'Error de IA' }, { status: 500 })
    }

    // Retornar streaming
    return new NextResponse(response.body, {
      headers: {
        'Content-Type':  'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection':    'keep-alive',
      },
    })

  } catch (error) {
    console.error('Error generate-contenido:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}