'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const CATEGORIAS = ['Todas', 'Planificación', 'Evaluación', 'Actividades', 'Comunicación', 'Creatividad', 'Adaptaciones', 'Otro']

const COLORES_CATEGORIA: Record<string, string> = {
  'Planificación': '#0369a1',
  'Evaluación':    '#7c3aed',
  'Actividades':   '#0891b2',
  'Comunicación':  '#059669',
  'Creatividad':   '#d97706',
  'Adaptaciones':  '#dc2626',
  'Otro':          '#6b7280',
}

interface PromptPublico {
  id:              string
  titulo:          string
  descripcion:     string
  prompt_texto:    string
  categoria:       string
  etiquetas:       string[]
  estrellas:       number
  veces_guardado:  number
  veces_usado:     number
  created_at:      string
  user_id:         string
  autor:           string
}

function Estrellas({ valor }: { valor: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} style={{ fontSize: '0.9rem', color: n <= valor ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </div>
  )
}

export default function ComunidadPromptsPage() {
  const [prompts, setPrompts]           = useState<PromptPublico[]>([])
  const [cargando, setCargando]         = useState(true)
  const [busqueda, setBusqueda]         = useState('')
  const [categoria, setCategoria]       = useState('Todas')
  const [ordenar, setOrdenar]           = useState<'valorados' | 'recientes' | 'guardados'>('recientes')
  const [guardados, setGuardados]       = useState<Set<string>>(new Set())
  const [guardando, setGuardando]       = useState<string | null>(null)
  const [copiado, setCopiado]           = useState<string | null>(null)
  const [userId, setUserId]             = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    inicializar()
  }, [])

  async function inicializar() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
      await cargarPrompts(user.id)
    } else {
      await cargarPrompts(null)
    }
  }

  async function cargarPrompts(uid: string | null) {
    setCargando(true)

    // Cargar prompts públicos
    const { data: promptsData } = await supabase
      .from('prompts')
      .select('*, profiles(nombre)')
      .eq('es_publico', true)
      .is('prompt_original_id', null)
      .order('created_at', { ascending: false })

    console.log('prompts cargados:', promptsData?.length, promptsData)
      if (promptsData) {
      const formateados = promptsData.map((p: any) => ({
        ...p,
        autor: (p.profiles as any)?.nombre || 'Docente anónimo',
      }))
      setPrompts(formateados)
    }

    // Cargar prompts ya guardados por el usuario
    if (uid) {
      const { data: misPrompts } = await supabase
        .from('prompts')
        .select('prompt_original_id')
        .eq('user_id', uid)
        .not('prompt_original_id', 'is', null)

      if (misPrompts) {
        const ids = new Set(misPrompts.map((p: any) => p.prompt_original_id))
        setGuardados(ids)
      }
    }

    setCargando(false)
  }

  async function guardarEnBiblioteca(prompt: PromptPublico) {
    if (!userId) return
    setGuardando(prompt.id)

    // Crear copia en la biblioteca del usuario
    const { error } = await supabase.from('prompts').insert({
      user_id:            userId,
      titulo:             prompt.titulo,
      descripcion:        prompt.descripcion,
      prompt_texto:       prompt.prompt_texto,
      categoria:          prompt.categoria,
      etiquetas:          prompt.etiquetas,
      es_publico:         false,
      estrellas:          0,
      prompt_original_id: prompt.id,
    })

    if (!error) {
      // Incrementar contador
      await supabase.from('prompts')
        .update({ veces_guardado: (prompt.veces_guardado || 0) + 1 })
        .eq('id', prompt.id)

      setGuardados(prev => new Set([...prev, prompt.id]))
      setPrompts(prev => prev.map(p =>
        p.id === prompt.id
          ? { ...p, veces_guardado: p.veces_guardado + 1 }
          : p
      ))
    }

    setGuardando(null)
  }

  async function usarPrompt(prompt: PromptPublico) {
    await navigator.clipboard.writeText(prompt.prompt_texto)
    setCopiado(prompt.id)
    setTimeout(() => setCopiado(null), 2000)

    // Incrementar contador de usos
    await supabase.from('prompts')
      .update({ veces_usado: (prompt.veces_usado || 0) + 1 })
      .eq('id', prompt.id)

    setPrompts(prev => prev.map(p =>
      p.id === prompt.id
        ? { ...p, veces_usado: p.veces_usado + 1 }
        : p
    ))
  }

  const promptsFiltrados = prompts
    .filter(p => {
      const matchBusqueda  = p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                             p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      const matchCategoria = categoria === 'Todas' || p.categoria === categoria
      return matchBusqueda && matchCategoria
    })
    .sort((a, b) => {
      if (ordenar === 'valorados')  return b.estrellas - a.estrellas
      if (ordenar === 'guardados')  return b.veces_guardado - a.veces_guardado
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .prompt-card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 22px; transition: all 0.2s; }
        .prompt-card:hover { box-shadow: 0 8px 24px rgba(0,163,255,0.1); border-color: #bfdbfe; transform: translateY(-2px); }
        .input-field { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; font-family: inherit; color: #1e293b; background: white; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #00A3FF; }
        .btn-guardar { padding: 8px 16px; border: none; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .btn-usar { padding: 8px 14px; border: none; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; background: #eef2ff; color: #4338ca; transition: all 0.2s; font-family: inherit; }
        .btn-usar:hover { background: #e0e7ff; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2B56' }}>
            🌐 Comunidad de Prompts
          </h1>
          <span style={{ fontSize: '0.82rem', color: '#6B7280', background: '#f3f4f6', padding: '4px 12px', borderRadius: 999 }}>
            {prompts.length} prompts públicos
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>
          Descubre y guarda prompts pedagógicos compartidos por docentes de todo el mundo
        </p>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input-field"
          placeholder="🔍 Buscar prompts..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select className="input-field" value={categoria} onChange={e => setCategoria(e.target.value)}>
          {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-field" value={ordenar} onChange={e => setOrdenar(e.target.value as any)}>
          <option value="recientes">🕐 Más recientes</option>
          <option value="valorados">⭐ Mejor valorados</option>
          <option value="guardados">📥 Más guardados</option>
        </select>
      </div>

      {/* Contenido */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#6B7280' }}>
          Cargando prompts de la comunidad...
        </div>
      ) : promptsFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🌐</div>
          <h3 style={{ color: '#1A2B56', fontWeight: 700, marginBottom: 8 }}>
            Aún no hay prompts públicos
          </h3>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
            ¡Sé el primero en compartir un prompt con la comunidad!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {promptsFiltrados.map(prompt => (
            <div key={prompt.id} className="prompt-card">

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px',
                    borderRadius: 999, marginBottom: 6, display: 'inline-block',
                    background: (COLORES_CATEGORIA[prompt.categoria] || '#6b7280') + '18',
                    color: COLORES_CATEGORIA[prompt.categoria] || '#6b7280',
                  }}>
                    {prompt.categoria}
                  </span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A2B56', lineHeight: 1.3, marginBottom: 4 }}>
                    {prompt.titulo}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                    por <span style={{ fontWeight: 600, color: '#6B7280' }}>{prompt.autor}</span>
                  </p>
                </div>
              </div>

              {/* Descripción */}
              {prompt.descripcion && (
                <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 10, lineHeight: 1.5 }}>
                  {prompt.descripcion}
                </p>
              )}

              {/* Preview */}
              <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontFamily: 'monospace', fontSize: '0.75rem', color: '#4B5563', lineHeight: 1.6, maxHeight: 80, overflow: 'hidden' }}>
                {prompt.prompt_texto.slice(0, 180)}{prompt.prompt_texto.length > 180 ? '...' : ''}
              </div>

              {/* Etiquetas */}
              {prompt.etiquetas?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                  {prompt.etiquetas.slice(0, 4).map(tag => (
                    <span key={tag} style={{ fontSize: '0.65rem', padding: '2px 8px', background: '#eef2ff', color: '#4338ca', borderRadius: 999, fontWeight: 500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                <Estrellas valor={prompt.estrellas} />
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  📥 {prompt.veces_guardado} guardados
                </span>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  ▶ {prompt.veces_usado} usos
                </span>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn-usar"
                  onClick={() => usarPrompt(prompt)}
                >
                  {copiado === prompt.id ? '✅ Copiado' : '📋 Copiar prompt'}
                </button>
                <button
                  className="btn-guardar"
                  disabled={guardados.has(prompt.id) || guardando === prompt.id || prompt.user_id === userId}
                  onClick={() => guardarEnBiblioteca(prompt)}
                  style={{
                    background: guardados.has(prompt.id) || prompt.user_id === userId
                      ? '#d1fae5'
                      : 'linear-gradient(135deg, #00A3FF, #8E2DE2)',
                    color: guardados.has(prompt.id) || prompt.user_id === userId
                      ? '#059669'
                      : 'white',
                    opacity: guardando === prompt.id ? 0.7 : 1,
                  }}
                >
                  {prompt.user_id === userId
                    ? '👤 Tu prompt'
                    : guardados.has(prompt.id)
                    ? '✅ Ya guardado'
                    : guardando === prompt.id
                    ? '⏳ Guardando...'
                    : '📥 Guardar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}