'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useContenidosFiltrados, type Contenido, type Filtros } from '@/hooks/useContenidosFiltrados'

const TIPOS = ['actividad', 'evaluacion', 'guia', 'presentacion', 'lectura', 'juego', 'rubrica', 'otro']
const MATERIAS = ['Matemáticas', 'Lengua y Literatura', 'Ciencias Naturales', 'Historia', 'Geografía', 'Arte', 'Educación Física', 'Inglés', 'Tecnología', 'Otra']
const NIVELES = ['Preescolar', 'Primaria', 'Secundaria', 'Bachillerato', 'Universidad']

const ICONOS_TIPO: Record<string, string> = {
  actividad:    '⚡',
  evaluacion:   '📝',
  guia:         '📖',
  presentacion: '🎯',
  lectura:      '📚',
  juego:        '🎮',
  rubrica:      '📋',
  otro:         '📄',
}

const COLORES_TIPO: Record<string, string> = {
  actividad:    '#00A3FF',
  evaluacion:   '#8E2DE2',
  guia:         '#1A2B56',
  presentacion: '#00868a',
  lectura:      '#d97706',
  juego:        '#16a34a',
  rubrica:      '#dc2626',
  otro:         '#6B7280',
}

export default function ContenidosPage() {
  const supabase = createClient()

  const [contenidos,   setContenidos]   = useState<Contenido[]>([])
  const [cargando,     setCargando]     = useState(true)
  const [vistaGrilla,  setVistaGrilla]  = useState(true)
  const [seleccionados,setSeleccionados]= useState<Set<string>>(new Set())
  const [eliminando,   setEliminando]   = useState(false)
  const [filtros, setFiltros] = useState<Filtros>({
    busqueda:   '',
    tipo:       '',
    materia:    '',
    nivel:      '',
    ordenarPor: 'reciente',
  })

  // Debounce para búsqueda
  const [busquedaInput, setBusquedaInput] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setFiltros(f => ({ ...f, busqueda: busquedaInput })), 300)
    return () => clearTimeout(t)
  }, [busquedaInput])

  const cargarContenidos = useCallback(async () => {
    setCargando(true)
    const { data } = await supabase
      .from('contenidos')
      .select('*')
      .order('created_at', { ascending: false })
    setContenidos(data || [])
    setCargando(false)
  }, [])

  useEffect(() => { cargarContenidos() }, [cargarContenidos])

  const contenidosFiltrados = useContenidosFiltrados(contenidos, filtros)

  // Contar por tipo
  const conteosTipo = TIPOS.reduce((acc, tipo) => {
    acc[tipo] = contenidos.filter(c => c.tipo === tipo).length
    return acc
  }, {} as Record<string, number>)

  const limpiarFiltros = () => {
    setBusquedaInput('')
    setFiltros({ busqueda: '', tipo: '', materia: '', nivel: '', ordenarPor: 'reciente' })
  }

  const toggleSeleccion = (id: string) => {
    setSeleccionados(prev => {
      const nuevo = new Set(prev)
      nuevo.has(id) ? nuevo.delete(id) : nuevo.add(id)
      return nuevo
    })
  }

  const eliminarSeleccionados = async () => {
    if (seleccionados.size === 0) return
    if (!confirm(`¿Eliminar ${seleccionados.size} contenido(s)?`)) return
    setEliminando(true)
    await supabase.from('contenidos').delete().in('id', [...seleccionados])
    setSeleccionados(new Set())
    await cargarContenidos()
    setEliminando(false)
  }

  const duplicarContenido = async (contenido: Contenido) => {
    const { id, created_at, ...resto } = contenido
    await supabase.from('contenidos').insert({
      ...resto,
      titulo: `Copia de ${contenido.titulo}`,
    })
    await cargarContenidos()
  }

  const hayFiltrosActivos = filtros.busqueda || filtros.tipo || filtros.materia || filtros.nivel

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        .filtro-select { padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.82rem; color: #1A2B56; background: white; outline: none; font-family: inherit; cursor: pointer; transition: border-color 0.2s; }
        .filtro-select:focus { border-color: #00A3FF; }
        .card-contenido { background: white; border-radius: 12px; border: 1px solid #e2e8f0; transition: all 0.2s; overflow: hidden; position: relative; }
        .card-contenido:hover { box-shadow: 0 8px 24px rgba(0,163,255,0.1); transform: translateY(-2px); }
        .card-seleccionada { border-color: #00A3FF; box-shadow: 0 0 0 2px rgba(0,163,255,0.2); }
        .btn-accion { padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.15s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
        .chip-tipo { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; }
        .seccion-agrupada { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; margin-bottom: 14px; }
        .seccion-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; cursor: pointer; background: #F8F9FA; border-bottom: 1px solid #e2e8f0; transition: background 0.15s; }
        .seccion-header:hover { background: #EFF6FF; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2B56', letterSpacing: '-0.03em', marginBottom: 4 }}>
            Mis Contenidos
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
            {contenidos.length} contenidos · {contenidosFiltrados.length} mostrados
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {seleccionados.size > 0 && (
            <button
              onClick={eliminarSeleccionados}
              disabled={eliminando}
              style={{ padding: '9px 16px', background: '#FFF1F2', color: '#BE123C', border: '1.5px solid #FECDD3', borderRadius: 8, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              🗑️ Eliminar ({seleccionados.size})
            </button>
          )}
          <Link
            href="/dashboard/contenidos/nuevo"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', color: 'white', fontWeight: 700, fontSize: '0.85rem', borderRadius: 9, textDecoration: 'none' }}
          >
            + Nuevo contenido
          </Link>
        </div>
      </div>

      {/* Contadores por tipo */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {TIPOS.filter(t => conteosTipo[t] > 0).map(tipo => (
          <button
            key={tipo}
            onClick={() => setFiltros(f => ({ ...f, tipo: f.tipo === tipo ? '' : tipo }))}
            style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          6,
              padding:      '5px 12px',
              borderRadius: 999,
              border:       `1.5px solid ${filtros.tipo === tipo ? COLORES_TIPO[tipo] : '#e2e8f0'}`,
              background:   filtros.tipo === tipo ? COLORES_TIPO[tipo] + '15' : 'white',
              color:        filtros.tipo === tipo ? COLORES_TIPO[tipo] : '#6B7280',
              fontWeight:   600,
              fontSize:     '0.75rem',
              cursor:       'pointer',
              fontFamily:   'inherit',
              transition:   'all 0.15s',
            }}
          >
            {ICONOS_TIPO[tipo]} {tipo}
            <span style={{ background: filtros.tipo === tipo ? COLORES_TIPO[tipo] : '#e2e8f0', color: filtros.tipo === tipo ? 'white' : '#6B7280', borderRadius: 999, padding: '0 6px', fontSize: '0.68rem', fontWeight: 700 }}>
              {conteosTipo[tipo]}
            </span>
          </button>
        ))}
      </div>

      {/* Barra de filtros */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', marginBottom: 18, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Búsqueda */}
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '0.9rem' }}>🔍</span>
          <input
            type="text"
            value={busquedaInput}
            onChange={e => setBusquedaInput(e.target.value)}
            placeholder="Buscar por título, descripción o etiqueta..."
            style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.85rem', color: '#1A2B56', outline: 'none', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.borderColor = '#00A3FF'}
            onBlur={e  => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Materia */}
        <select className="filtro-select" value={filtros.materia} onChange={e => setFiltros(f => ({ ...f, materia: e.target.value }))}>
          <option value="">Todas las materias</option>
          {MATERIAS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {/* Nivel */}
        <select className="filtro-select" value={filtros.nivel} onChange={e => setFiltros(f => ({ ...f, nivel: e.target.value }))}>
          <option value="">Todos los niveles</option>
          {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        {/* Ordenar */}
        <select className="filtro-select" value={filtros.ordenarPor} onChange={e => setFiltros(f => ({ ...f, ordenarPor: e.target.value as Filtros['ordenarPor'] }))}>
          <option value="reciente">Más recientes</option>
          <option value="antiguo">Más antiguos</option>
          <option value="alfabetico">A → Z</option>
        </select>

        {/* Vista */}
        <div style={{ display: 'flex', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
          <button onClick={() => setVistaGrilla(true)}  style={{ padding: '7px 12px', background: vistaGrilla ? '#EFF6FF' : 'white', border: 'none', cursor: 'pointer', color: vistaGrilla ? '#00A3FF' : '#6B7280', fontSize: '0.9rem' }}>⊞</button>
          <button onClick={() => setVistaGrilla(false)} style={{ padding: '7px 12px', background: !vistaGrilla ? '#EFF6FF' : 'white', border: 'none', cursor: 'pointer', color: !vistaGrilla ? '#00A3FF' : '#6B7280', fontSize: '0.9rem' }}>☰</button>
        </div>

        {/* Limpiar */}
        {hayFiltrosActivos && (
          <button onClick={limpiarFiltros} style={{ padding: '8px 14px', background: '#FFF1F2', color: '#BE123C', border: '1.5px solid #FECDD3', borderRadius: 8, fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Loading */}
      {cargando && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#00A3FF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      )}

      {/* Estado vacío */}
      {!cargando && contenidosFiltrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1A2B56', marginBottom: 8 }}>
            {hayFiltrosActivos ? 'No hay contenidos con esos filtros' : 'Aún no tienes contenidos'}
          </h3>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: 20 }}>
            {hayFiltrosActivos ? 'Prueba con otros filtros o limpia la búsqueda.' : 'Crea tu primer contenido o genera uno con IA.'}
          </p>
          {hayFiltrosActivos
            ? <button onClick={limpiarFiltros} style={{ padding: '9px 20px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit', color: '#1A2B56' }}>Limpiar filtros</button>
            : <Link href="/dashboard/contenidos/nuevo" style={{ padding: '10px 22px', background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', color: 'white', fontWeight: 700, fontSize: '0.875rem', borderRadius: 9, textDecoration: 'none' }}>+ Crear primer contenido</Link>
          }
        </div>
      )}

      {/* Vista Grilla */}
      {!cargando && contenidosFiltrados.length > 0 && vistaGrilla && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {contenidosFiltrados.map(c => (
            <div key={c.id} className={`card-contenido ${seleccionados.has(c.id) ? 'card-seleccionada' : ''}`}>

              {/* Color top bar */}
              <div style={{ height: 4, background: COLORES_TIPO[c.tipo] || '#6B7280' }} />

              {/* Checkbox selección */}
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <input
                  type="checkbox"
                  checked={seleccionados.has(c.id)}
                  onChange={() => toggleSeleccion(c.id)}
                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#00A3FF' }}
                />
              </div>

              <div style={{ padding: '14px 16px' }}>
                {/* Tipo badge */}
                <div className="chip-tipo" style={{ background: (COLORES_TIPO[c.tipo] || '#6B7280') + '15', color: COLORES_TIPO[c.tipo] || '#6B7280', marginBottom: 10 }}>
                  <span>{ICONOS_TIPO[c.tipo] || '📄'}</span>
                  <span style={{ textTransform: 'capitalize' }}>{c.tipo}</span>
                </div>

                {/* Título */}
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1A2B56', marginBottom: 6, lineHeight: 1.4, letterSpacing: '-0.01em' }}>
                  {c.titulo}
                </h3>

                {/* Descripción */}
                {c.descripcion && (
                  <p style={{ fontSize: '0.8rem', color: '#6B7280', lineHeight: 1.6, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.descripcion}
                  </p>
                )}

                {/* Meta */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {c.materia && <span style={{ fontSize: '0.7rem', background: '#EFF6FF', color: '#1A2B56', padding: '2px 8px', borderRadius: 999, fontWeight: 500 }}>{c.materia}</span>}
                  {c.nivel   && <span style={{ fontSize: '0.7rem', background: '#F3F4F6', color: '#6B7280', padding: '2px 8px', borderRadius: 999, fontWeight: 500 }}>{c.nivel}</span>}
                  {c.origen === 'ia' && <span style={{ fontSize: '0.7rem', background: '#EDE9FE', color: '#8E2DE2', padding: '2px 8px', borderRadius: 999, fontWeight: 600 }}>🤖 IA</span>}
                </div>

                {/* Etiquetas */}
                {c.etiquetas?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                    {c.etiquetas.slice(0, 3).map(e => (
                      <span key={e} style={{ fontSize: '0.68rem', background: '#F8F9FA', color: '#6B7280', padding: '2px 7px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                        #{e}
                      </span>
                    ))}
                    {c.etiquetas.length > 3 && <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>+{c.etiquetas.length - 3}</span>}
                  </div>
                )}

                {/* Acciones */}
                <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                  <Link href={`/dashboard/contenidos/${c.id}`} className="btn-accion" style={{ flex: 1, textAlign: 'center', background: '#00A3FF', color: 'white', textDecoration: 'none', display: 'block', padding: '6px 0' }}>
                    Ver
                  </Link>
                  <button onClick={() => duplicarContenido(c)} className="btn-accion" style={{ background: '#1A2B56', color: 'white' }}>
                    Duplicar
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('¿Eliminar este contenido?')) return
                      await supabase.from('contenidos').delete().eq('id', c.id)
                      await cargarContenidos()
                    }}
                    className="btn-accion"
                    style={{ background: '#FFF1F2', color: '#BE123C' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista Lista */}
      {!cargando && contenidosFiltrados.length > 0 && !vistaGrilla && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {contenidosFiltrados.map(c => (
            <div key={c.id} className={`card-contenido ${seleccionados.has(c.id) ? 'card-seleccionada' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px' }}>
              <input type="checkbox" checked={seleccionados.has(c.id)} onChange={() => toggleSeleccion(c.id)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#00A3FF', flexShrink: 0 }} />
              <div style={{ width: 36, height: 36, borderRadius: 8, background: (COLORES_TIPO[c.tipo] || '#6B7280') + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                {ICONOS_TIPO[c.tipo] || '📄'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1A2B56', letterSpacing: '-0.01em', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.titulo}</h3>
                  {c.origen === 'ia' && <span style={{ fontSize: '0.65rem', background: '#EDE9FE', color: '#8E2DE2', padding: '1px 7px', borderRadius: 999, fontWeight: 600, flexShrink: 0 }}>🤖 IA</span>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: '0.7rem', color: COLORES_TIPO[c.tipo] || '#6B7280', fontWeight: 600, textTransform: 'capitalize' }}>{c.tipo}</span>
                  {c.materia && <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>· {c.materia}</span>}
                  {c.nivel   && <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>· {c.nivel}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <Link href={`/dashboard/contenidos/${c.id}`} className="btn-accion" style={{ background: '#00A3FF', color: 'white', textDecoration: 'none' }}>Ver</Link>
                <button onClick={() => duplicarContenido(c)} className="btn-accion" style={{ background: '#1A2B56', color: 'white' }}>Duplicar</button>
                <button onClick={async () => { if (!confirm('¿Eliminar?')) return; await supabase.from('contenidos').delete().eq('id', c.id); await cargarContenidos() }} className="btn-accion" style={{ background: '#FFF1F2', color: '#BE123C' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}