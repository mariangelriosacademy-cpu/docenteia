import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tipo, datos } = body

    let prompt = ''

    if (tipo === 'objetivo') {
      prompt = `Eres un experto pedagogo latinoamericano. Genera UN objetivo de aprendizaje claro, medible y concreto para:
- Materia: ${datos.materia}
- Tema: ${datos.tema}
- Grado: ${datos.grado}
- País: ${datos.pais || 'Latinoamérica'}
- Marco curricular: ${datos.marcoCurricular || 'general'}

Usa el formato: "El estudiante será capaz de [verbo Bloom] [contenido] mediante [estrategia] para [finalidad]."
Responde SOLO con el objetivo, sin explicaciones ni comillas.`
    }

    if (tipo === 'competencias') {
      prompt = `Eres un experto pedagogo latinoamericano. Genera 2-3 competencias o indicadores de logro para:
- Materia: ${datos.materia}
- Tema: ${datos.tema}
- Grado: ${datos.grado}
- Marco curricular: ${datos.marcoCurricular || 'general'}

Lista cada competencia con un guion. Sé conciso y pedagógicamente preciso.
Responde SOLO con las competencias, sin título ni explicaciones.`
    }

    if (tipo === 'inicio') {
      prompt = `Eres un docente experto. Sugiere una actividad de INICIO/MOTIVACIÓN creativa para:
- Materia: ${datos.materia}
- Tema: ${datos.tema}
- Grado: ${datos.grado}
- Edad: ${datos.edadEstudiantes || 'no especificada'}
- Duración del inicio: 10-15 minutos

Describe la actividad paso a paso de forma práctica. Máximo 120 palabras.
Responde SOLO con la descripción, sin títulos.`
    }

    if (tipo === 'desarrollo') {
      prompt = `Eres un docente experto. Sugiere las actividades de DESARROLLO para:
- Materia: ${datos.materia}
- Tema: ${datos.tema}
- Grado: ${datos.grado}
- Metodología: ${datos.metodologia || 'activa'}
- Número de estudiantes: ${datos.numEstudiantes || 'no especificado'}

Describe 2-3 actividades principales paso a paso. Máximo 180 palabras.
Responde SOLO con las actividades, sin títulos adicionales.`
    }

    if (tipo === 'cierre') {
      prompt = `Eres un docente experto. Sugiere una actividad de CIERRE para:
- Materia: ${datos.materia}
- Tema: ${datos.tema}
- Grado: ${datos.grado}
- Objetivo: ${datos.objetivo || 'aprendizaje significativo'}

Describe una actividad de cierre que permita evaluar el aprendizaje. Máximo 100 palabras.
Responde SOLO con la descripción, sin títulos.`
    }

    if (tipo === 'estrategias') {
      prompt = `Eres un experto en didáctica. Sugiere 3-4 estrategias instruccionales para:
- Materia: ${datos.materia}
- Tema: ${datos.tema}
- Grado: ${datos.grado}
- Metodología preferida: ${datos.metodologia || 'activa'}
- Edad: ${datos.edadEstudiantes || 'no especificada'}

Lista cada estrategia con un guion y una breve descripción. Máximo 150 palabras.
Responde SOLO con las estrategias.`
    }

    if (tipo === 'evaluacion') {
      prompt = `Eres un experto en evaluación educativa. Sugiere instrumentos de evaluación para:
- Materia: ${datos.materia}
- Tema: ${datos.tema}
- Grado: ${datos.grado}
- Tipo de evaluación: ${datos.tipoEvaluacion || 'formativa'}
- Objetivo: ${datos.objetivo || ''}

Sugiere 2-3 instrumentos concretos con una breve descripción de cada uno. Máximo 150 palabras.
Responde SOLO con los instrumentos.`
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ text })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json({ error: 'Error al generar contenido con IA' }, { status: 500 })
  }
}