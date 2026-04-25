'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { eliminarContenido } from '@/lib/contenidos/actions'

const TIPOS = ['Todos', 'Actividad', 'Evaluación', 'Guía', 'Presentación', 'Lectura', 'Juego', 'Otro']
const MATERIAS = [
  'Todas',
  // Ciencias básicas
  'Matemáticas', 'Estadística', 'Cálculo', 'Geometría',
  // Lenguaje
  'Lenguaje y Literatura', 'Español', 'Comunicación', 'Lectura y Escritura',
  // Ciencias
  'Ciencias Naturales', 'Biología', 'Química', 'Física', 'Medio Ambiente',
  // Sociales
  'Ciencias Sociales', 'Historia', 'Geografía', 'Economía', 'Filosofía', 'Política',
  // Idiomas
  'Inglés', 'Francés', 'Portugués', 'Alemán', 'Otro idioma',
  // Artes y tecnología
  'Arte y Música', 'Educación Artística', 'Música', 'Tecnología e Informática',
  // Otras
  'Educación Física', 'Ética y Valores', 'Religión', 'Emprendimiento',
  'Otra',
]
const NIVELES = ['Todos', 'Preescolar', 'Primaria (1°-3°)', 'Primaria (4°-5°)', 'Secundaria (6°-8°)', 'Secundaria (9°-11°)', 'Universidad', 'Todos los niveles']

const ICONOS_TIPO: Record<string, string> = {
  'Actividad':    '⭐',
  'Evaluación':   '📋',
  'Guía':         '📖',
  'Presentación': '📊',
  'Lectura':      '📚',
  'Juego':        '🎮',
  'Otro':         '📁',
}

const COLORES_TIPO: Record<string, { bg: string; color: string }> = {
  'Actividad':    { bg: '#fef9c3', color: '#854d0e' },
  'Evaluación':   { bg: '#ede9fe', color: '#5b21b6' },
  'Guía':         { bg: '#d1fae5', color: '#065f46' },
  'Presentación': { bg: '#dbeafe', color: '#1e40af' },
  'Lectura':      { bg: '#fce7f3', color: '#9d174d' },
  'Juego':        { bg: '#ffedd5', color: '#9a3412' },
  'Otro':         { bg: '#f3f4f6', color: '#374151' },
}

interface Contenido {
  id:             string
  titulo:         string
  tipo:           string
  materia:        string
  nivel:          string
  descripcion:    string
  etiquetas:      string[]
  notas:          string
  url_externa:    string | null
  archivo_url:    string | null
  archivo_nombre: string | null
  archivo_tipo:   string | null
  created_at:     string
}

export default function ContenidosPage() {
  const [contenidos, setContenidos]       = useState<Contenido[]>([])
  const [cargando, setCargando]           = useState(true)
  const [busqueda, setBusqueda]           = useState('')
  const [tipoFiltro, setTipoFiltro]       = useState('Todos')
  const [materiaFiltro, setMateriaFiltro] = useState('Todas')
  const [nivelFiltro, setNivelFiltro]     = useState('Todos')
  const [modalEliminar, setModalEliminar] = useState<string | null>(null)
  const [eliminando, setEliminando]       = useState(false)

  const supabase = createClient()

  useEffect(() => { cargar() }, [])

  async function cargar() {
    setCargando(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('contenidos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setContenidos(data || [])
    setCargando(false)
  }

  async function handleEliminar(id: string) {
    setEliminando(true)
    await eliminarContenido(id)
    setContenidos(contenidos.filter(c => c.id !== id))
    setModalEliminar(null)
    setEliminando(false)
  }

  const filtrados = contenidos.filter(c => {
    const matchBusqueda = c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          c.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    const matchTipo     = tipoFiltro === 'Todos' || c.tipo === tipoFiltro
    const matchMateria  = materiaFiltro === 'Todas' || c.materia === materiaFiltro
    const matchNivel    = nivelFiltro === 'Todos' || c.nivel === nivelFiltro
    return matchBusqueda && matchTipo && matchMateria && matchNivel
  })

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .content-card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px; transition: all 0.2s; display: flex; flex-direction: column; gap: 10px; }
        .content-card:hover { box-shadow: 0 8px 24px rgba(5,150,105,0.1); border-color: #a7f3d0; transform: translateY(-2px); }
        .input-field { padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.82rem; font-family: inherit; color: #1e293b; background: white; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #059669; }
        .btn-action { padding: 6px 10px; border: none; border-radius: 7px; cursor: pointer; font-size: 0.78rem; font-weight: 600; transition: all 0.15s; font-family: inherit; }
        .tipo-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2B56', marginBottom: 2 }}>
            🗂️ Repositorio de Contenidos
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
            {contenidos.length} recursos guardados
          </p>
        </div>
        <Link href="/dashboard/contenidos/nuevo" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '10px 20px', background: 'linear-gradient(135deg, #059669, #0d9488)',
          color: 'white', fontWeight: 700, fontSize: '0.875rem',
          textDecoration: 'none', borderRadius: 10,
          boxShadow: '0 2px 12px rgba(5,150,105,0.25)',
        }}>
          + Nuevo contenido
        </Link>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input-field"
          placeholder="🔍 Buscar contenidos..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select className="input-field" value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}>
          {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="input-field" value={materiaFiltro} onChange={e => setMateriaFiltro(e.target.value)}>
          {MATERIAS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className="input-field" value={nivelFiltro} onChange={e => setNivelFiltro(e.target.value)}>
          {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* Contenido */}
      {cargando ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#6B7280' }}>Cargando repositorio...</div>
      ) : filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 64 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🗂️</div>
          <h3 style={{ color: '#1A2B56', fontWeight: 700, marginBottom: 8, fontSize: '1.1rem' }}>
            {contenidos.length === 0 ? 'Tu repositorio está vacío' : 'No hay resultados'}
          </h3>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 24 }}>
            {contenidos.length === 0
              ? 'Empieza agregando tu primer recurso pedagógico'
              : 'Intenta con otros filtros de búsqueda'}
          </p>
          {contenidos.length === 0 && (
            <Link href="/dashboard/contenidos/nuevo" style={{
              padding: '10px 24px', background: 'linear-gradient(135deg, #059669, #0d9488)',
              color: 'white', fontWeight: 700, borderRadius: 10, textDecoration: 'none',
            }}>
              + Agregar primer contenido
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtrados.map(c => {
            const colores = COLORES_TIPO[c.tipo] || COLORES_TIPO['Otro']
            return (
              <div key={c.id} className="content-card">

                {/* Header tarjeta */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div className="tipo-icon" style={{ background: colores.bg }}>
                    {ICONOS_TIPO[c.tipo] || '📁'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px',
                        borderRadius: 999, background: colores.bg, color: colores.color,
                      }}>
                        {c.tipo}
                      </span>
                      {c.archivo_url && (
                        <span style={{ fontSize: '0.65rem', background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: 999, fontWeight: 600 }}>
                          📎 Archivo
                        </span>
                      )}
                      {c.url_externa && (
                        <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 999, fontWeight: 600 }}>
                          🔗 URL
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1A2B56', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.titulo}
                    </h3>
                  </div>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: 999 }}>
                    {c.materia}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: 999 }}>
                    {c.nivel}
                  </span>
                </div>

                {/* Descripción */}
                {c.descripcion && (
                  <p style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {c.descripcion}
                  </p>
                )}

                {/* Etiquetas */}
                {c.etiquetas?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {c.etiquetas.slice(0, 3).map(tag => (
                      <span key={tag} style={{ fontSize: '0.65rem', padding: '2px 7px', background: '#d1fae5', color: '#065f46', borderRadius: 999, fontWeight: 500 }}>
                        {tag}
                      </span>
                    ))}
                    {c.etiquetas.length > 3 && (
                      <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>+{c.etiquetas.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Fecha */}
                <p style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{formatFecha(c.created_at)}</p>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 4, borderTop: '1px solid #f3f4f6' }}>
                  {(c.archivo_url || c.url_externa) && (
                    <a
                      href={c.archivo_url || c.url_externa || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-action"
                      style={{ background: '#d1fae5', color: '#065f46', textDecoration: 'none' }}
                    >
                      {c.archivo_url ? '⬇️ Descargar' : '🔗 Abrir'}
                    </a>
                  )}
                  <Link href={`/dashboard/contenidos/${c.id}/editar`}
                    className="btn-action"
                    style={{ background: '#fef3c7', color: '#92400e', textDecoration: 'none' }}>
                    ✏️ Editar
                  </Link>
                  <button
                    className="btn-action"
                    onClick={() => setModalEliminar(c.id)}
                    style={{ background: '#fef2f2', color: '#dc2626' }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal eliminar */}
      {modalEliminar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, maxWidth: 400, width: '100%' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A2B56', marginBottom: 10 }}>
              ¿Eliminar contenido?
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 24 }}>
              Se eliminará el contenido y el archivo asociado. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setModalEliminar(null)}
                style={{ flex: 1, padding: '10px', border: '1.5px solid #e5e7eb', borderRadius: 8, background: 'white', cursor: 'pointer', fontWeight: 600 }}>
                Cancelar
              </button>
              <button onClick={() => handleEliminar(modalEliminar)} disabled={eliminando}
                style={{ flex: 1, padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, opacity: eliminando ? 0.7 : 1 }}>
                {eliminando ? '⏳ Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}