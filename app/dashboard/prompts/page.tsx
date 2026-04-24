'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { eliminarPrompt, actualizarEstrellas } from '@/lib/prompts/actions'

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

interface Prompt {
  id:           string
  titulo:       string
  descripcion:  string
  prompt_texto: string
  categoria:    string
  etiquetas:    string[]
  es_publico:   boolean
  estrellas:    number
  created_at:   string
}

function Estrellas({ valor, onCambiar }: { valor: number; onCambiar: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => onCambiar(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{ cursor: 'pointer', fontSize: '1rem', color: n <= (hover || valor) ? '#f59e0b' : '#d1d5db', transition: 'color 0.1s' }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function PromptsPage() {
  const [prompts, setPrompts]         = useState<Prompt[]>([])
  const [cargando, setCargando]       = useState(true)
  const [vista, setVista]             = useState<'lista' | 'grilla'>('grilla')
  const [busqueda, setBusqueda]       = useState('')
  const [categoria, setCategoria]     = useState('Todas')
  const [minEstrellas, setMinEstrellas] = useState(0)
  const [modalEliminar, setModalEliminar] = useState<string | null>(null)
  const [copiado, setCopiado]         = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    cargarPrompts()
  }, [])

  async function cargarPrompts() {
    setCargando(true)
    const { data } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })
    setPrompts(data || [])
    setCargando(false)
  }

  const promptsFiltrados = prompts.filter(p => {
    const matchBusqueda  = p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    const matchCategoria = categoria === 'Todas' || p.categoria === categoria
    const matchEstrellas = p.estrellas >= minEstrellas
    return matchBusqueda && matchCategoria && matchEstrellas
  })

  async function handleEliminar(id: string) {
    await eliminarPrompt(id)
    setPrompts(prompts.filter(p => p.id !== id))
    setModalEliminar(null)
  }

  async function handleEstrellas(id: string, valor: number) {
    await actualizarEstrellas(id, valor)
    setPrompts(prompts.map(p => p.id === id ? { ...p, estrellas: valor } : p))
  }

  async function handleCopiar(texto: string, id: string) {
    await navigator.clipboard.writeText(texto)
    setCopiado(id)
    setTimeout(() => setCopiado(null), 2000)
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .prompt-card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px; transition: all 0.2s; }
        .prompt-card:hover { box-shadow: 0 8px 24px rgba(0,163,255,0.1); border-color: #bfdbfe; transform: translateY(-2px); }
        .input-field { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; font-family: inherit; color: #1e293b; background: white; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #00A3FF; }
        .btn-icon { padding: 6px 10px; border: none; border-radius: 7px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: all 0.15s; }
        .vista-btn { padding: 7px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; cursor: pointer; background: white; font-size: 0.85rem; transition: all 0.15s; }
        .vista-btn.active { background: #1A2B56; color: white; border-color: #1A2B56; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2B56', marginBottom: 2 }}>
            💡 Biblioteca de Prompts
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
            {prompts.length} prompts guardados
          </p>
        </div>
        <Link href="/dashboard/prompts/nuevo" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '10px 20px', background: 'linear-gradient(135deg, #00A3FF, #8E2DE2)',
          color: 'white', fontWeight: 700, fontSize: '0.875rem',
          textDecoration: 'none', borderRadius: 10,
          boxShadow: '0 2px 12px rgba(0,163,255,0.25)',
        }}>
          + Nuevo prompt
        </Link>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
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
        <select className="input-field" value={minEstrellas} onChange={e => setMinEstrellas(Number(e.target.value))}>
          <option value={0}>⭐ Todas</option>
          <option value={1}>⭐ 1+</option>
          <option value={2}>⭐ 2+</option>
          <option value={3}>⭐ 3+</option>
          <option value={4}>⭐ 4+</option>
          <option value={5}>⭐ 5</option>
        </select>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className={`vista-btn ${vista === 'grilla' ? 'active' : ''}`} onClick={() => setVista('grilla')}>⊞ Grilla</button>
          <button className={`vista-btn ${vista === 'lista' ? 'active' : ''}`} onClick={() => setVista('lista')}>☰ Lista</button>
        </div>
      </div>

      {/* Contenido */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#6B7280' }}>Cargando prompts...</div>
      ) : promptsFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>💡</div>
          <h3 style={{ color: '#1A2B56', fontWeight: 700, marginBottom: 8 }}>No hay prompts aún</h3>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Crea tu primer prompt pedagógico</p>
          <Link href="/dashboard/prompts/nuevo" style={{
            padding: '10px 24px', background: 'linear-gradient(135deg, #00A3FF, #8E2DE2)',
            color: 'white', fontWeight: 700, borderRadius: 10, textDecoration: 'none',
          }}>
            + Crear mi primer prompt
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: vista === 'grilla' ? 'repeat(auto-fill, minmax(320px, 1fr))' : '1fr',
          gap: 16,
        }}>
          {promptsFiltrados.map(prompt => (
            <div key={prompt.id} className="prompt-card">

              {/* Header de la tarjeta */}
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
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A2B56', lineHeight: 1.3 }}>
                    {prompt.titulo}
                  </h3>
                </div>
                {prompt.es_publico && (
                  <span style={{ fontSize: '0.65rem', color: '#059669', fontWeight: 600, background: '#d1fae5', padding: '2px 6px', borderRadius: 999, flexShrink: 0, marginLeft: 8 }}>
                    Público
                  </span>
                )}
              </div>

              {/* Descripción */}
              {prompt.descripcion && (
                <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 10, lineHeight: 1.5 }}>
                  {prompt.descripcion}
                </p>
              )}

              {/* Preview del prompt */}
              <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontFamily: 'monospace', fontSize: '0.78rem', color: '#4B5563', lineHeight: 1.6, maxHeight: 72, overflow: 'hidden', position: 'relative' }}>
                {prompt.prompt_texto.slice(0, 150)}{prompt.prompt_texto.length > 150 ? '...' : ''}
              </div>

              {/* Etiquetas */}
              {prompt.etiquetas?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                  {prompt.etiquetas.map(tag => (
                    <span key={tag} style={{ fontSize: '0.68rem', padding: '2px 8px', background: '#eef2ff', color: '#4338ca', borderRadius: 999, fontWeight: 500 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Estrellas */}
              <div style={{ marginBottom: 14 }}>
                <Estrellas valor={prompt.estrellas} onCambiar={v => handleEstrellas(prompt.id, v)} />
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  className="btn-icon"
                  onClick={() => handleCopiar(prompt.prompt_texto, prompt.id)}
                  style={{ background: copiado === prompt.id ? '#d1fae5' : '#eef2ff', color: copiado === prompt.id ? '#059669' : '#4338ca' }}
                >
                  {copiado === prompt.id ? '✅ Copiado' : '📋 Copiar'}
                </button>
                <Link href={`/dashboard/prompts/${prompt.id}/editar`} style={{
                  padding: '6px 10px', background: '#fef3c7', color: '#92400e',
                  borderRadius: 7, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
                }}>
                  ✏️ Editar
                </Link>
                <button
                  className="btn-icon"
                  onClick={() => setModalEliminar(prompt.id)}
                  style={{ background: '#fef2f2', color: '#dc2626' }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal eliminar */}
      {modalEliminar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 400, width: '100%' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A2B56', marginBottom: 10 }}>
              ¿Eliminar prompt?
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 24 }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setModalEliminar(null)}
                style={{ flex: 1, padding: '10px', border: '1.5px solid #e5e7eb', borderRadius: 8, background: 'white', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleEliminar(modalEliminar)}
                style={{ flex: 1, padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}