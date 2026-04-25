import { createClient }  from '@/lib/supabase/server'
import Anthropic         from '@anthropic-ai/sdk'
import { NextResponse }  from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { prompt } = await request.json()
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'El prompt está vacío' }, { status: 400 })
    }

    // Verificar límites del plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (profile?.plan === 'free') {
      const hoy = new Date().toISOString().split('T')[0]
      const { count } = await supabase
        .from('creditos_uso')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('accion', 'prompt_ia')
        .gte('created_at', hoy)

      if ((count || 0) >= 5) {
        return NextResponse.json(
          { error: 'Límite diario alcanzado. Actualiza a Pro para uso ilimitado.' },
          { status: 429 }
        )
      }
    }

    // Llamar a Claude
    const message = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system:     'Eres un asistente pedagógico experto llamado Docenly. Ayudas a docentes hispanohablantes a crear contenido educativo de alta calidad. Tus respuestas son prácticas, claras, bien estructuradas y listas para usar en el aula. Usa formato markdown para organizar tu respuesta.',
      messages:   [{ role: 'user', content: prompt }],
    })

    const respuesta = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('\n')

    // Registrar uso
    await supabase.from('creditos_uso').insert({
      user_id:   user.id,
      accion:    'prompt_ia',
      creditos:  5,
      tokens_ia: message.usage.input_tokens + message.usage.output_tokens,
    })

    return NextResponse.json({ respuesta })

  } catch (error) {
    console.error('Error en /api/usar-prompt:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}