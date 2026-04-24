'use client'
import { exportarPlanificacionPDF } from '@/lib/exportarPDF'
import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { duplicarPlanificacion, eliminarPlanificacion, listarPlanificaciones } from '@/lib/planificaciones/actions'

// ── Tipos planificacion ───────────────────────────────────────────────────────
const TIPOS_PLANIFICACION = [
  { id: 'anual', icono: '📅', titulo: 'Planificación Anual', descripcion: 'Visión general del curso completo con malla curricular y secuencia progresiva.', color: '#1A2B56', badge: 'Macro' },
  { id: 'periodo', icono: '📊', titulo: 'Planificación por Periodo', descripcion: 'Organización bimestral o trimestral con secuencia de unidades y cronograma.', color: '#00A3FF', badge: 'Meso' },
  { id: 'unidad', icono: '📘', titulo: 'Unidad Didáctica', descripcion: 'Conjunto estructurado de clases con objetivo común y pregunta problematizadora.', color: '#8E2DE2', badge: 'Meso' },
  { id: 'clase', icono: '🧑‍🏫', titulo: 'Plan de Clase', descripcion: 'Microplanificación de clase individual con inicio, desarrollo, cierre y evaluación.', color: '#00868a', badge: 'Micro', popular: true },
  { id: 'evaluacion', icono: '📝', titulo: 'Plan de Evaluación', descripcion: 'Rúbricas, indicadores y descriptores por nivel alineados a competencias.', color: '#c2410c', badge: 'Evaluación' },
  { id: 'adaptacion', icono: '♿', titulo: 'Adaptaciones / Inclusión', descripcion: 'Estrategias diferenciadas y ajustes para necesidades educativas especiales.', color: '#4A5568', badge: 'Inclusión' },
]

const PAISES = ['Colombia', 'México', 'España', 'Argentina', 'Chile', 'Venezuela', 'Perú', 'Ecuador', 'Otro']
const NIVELES = ['Preescolar', 'Primaria', 'Secundaria', 'Bachillerato', 'Universidad']
const ENFOQUES = ['Tradicional', 'Constructivista', 'ABP', 'Aprendizaje significativo', 'STEAM', 'Otro']

// ── Types lista ───────────────────────────────────────────────────────────────
interface Planificacion {
  id: string
  titulo: string
  materia: string
  grado: string
  fecha: string
  tipo_plan: string
  estado: string
  created_at: string
  tema?: string
}

const MATERIAS_COLORES: Record<string, { bg: string; text: string; border: string }> = {
  'Matemáticas':         { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Lengua y Literatura': { bg: '#fdf4ff', text: '#9333ea', border: '#e9d5ff' },
  'Ciencias Naturales':  { bg: '#f0fdf4', text: '#16a34a', border: '#86efac' },
  'Historia':            { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa' },
  'Geografía':           { bg: '#fefce8', text: '#ca8a04', border: '#fde68a' },
  'Inglés':              { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4' },
  'Arte':                { bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8' },
  'Tecnología':          { bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' },
}
const COLOR_DEFAULT = { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
function materiaColor(m: string) { return MATERIAS_COLORES[m] || COLOR_DEFAULT }
function formatFecha(iso: string) { return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' }) }
const ESTADO_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  completada: { bg: '#dcfce7', text: '#16a34a', dot: '#16a34a' },
  borrador:   { bg: '#fef9c3', text: '#ca8a04', dot: '#ca8a04' },
  archivada:  { bg: '#f3f4f6', text: '#6b7280', dot: '#9ca3af' },
}
const PER_PAGE = 12

// ── Skeleton ──────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf5', padding: '22px 24px' }}>
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}.sk{background:linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%);background-size:600px 100%;animation:shimmer 1.3s infinite linear;border-radius:6px}`}</style>
      <div className="sk" style={{ height: 11, width: '40%', marginBottom: 14 }} />
      <div className="sk" style={{ height: 18, width: '85%', marginBottom: 8 }} />
      <div className="sk" style={{ height: 14, width: '55%', marginBottom: 20 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="sk" style={{ height: 26, width: 80 }} />
        <div className="sk" style={{ height: 26, width: 60 }} />
      </div>
    </div>
  )
}

// ── Menu opciones ─────────────────────────────────────────────────────────────
function MenuOpciones({ plan, onDuplicar, onEliminar }: { plan: Planificacion; onDuplicar: (id: string) => void; onEliminar: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  useEffect(() => {
    function close() { setOpen(false) }
    if (open) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [open])
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={e => { e.stopPropagation(); setOpen(o => !o) }} style={{ width: 32, height: 32, borderRadius: 8, background: open ? '#f3f4f6' : 'transparent', border: '1px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#6b7280', fontFamily: 'inherit' }}>⋯</button>
      {open && (
        <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: 38, right: 0, background: 'white', borderRadius: 12, border: '1px solid #e8edf5', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 50, minWidth: 180, overflow: 'hidden' }}>
          {[
            { icon: '👁️', label: 'Ver completo', action: () => router.push(`/dashboard/planeacion/resultado?id=${plan.id}`) },
            { icon: '📋', label: 'Duplicar', action: () => { onDuplicar(plan.id); setOpen(false) } },
          ].map(({ icon, label, action }) => (
            <button key={label} onClick={() => { action(); setOpen(false) }} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.83rem', fontWeight: 500, color: '#374151', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'none'}
            >{icon} {label}</button>
          ))}
          <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />
          <button onClick={() => { onEliminar(plan.id); setOpen(false) }} style={{ width: '100%', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.83rem', fontWeight: 500, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit' }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'none'}
          >🗑️ Eliminar</button>
        </div>
      )}
    </div>
  )
}

// ── Tarjeta planificacion ─────────────────────────────────────────────────────
function TarjetaPlan({ plan, onDuplicar, onEliminar }: { plan: Planificacion; onDuplicar: (id: string) => void; onEliminar: (id: string) => void }) {
  const router = useRouter()
  const mc = materiaColor(plan.materia)
  const es = ESTADO_STYLES[plan.estado] || ESTADO_STYLES.borrador
  return (
    <div onClick={() => router.push(`/dashboard/planeacion/resultado?id=${plan.id}`)}
      style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf5', padding: '22px 24px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: mc.bg, color: mc.text, border: `1px solid ${mc.border}` }}>{plan.materia}</span>
          <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600, background: '#f1f5f9', color: '#64748b' }}>{plan.tipo_plan}</span>
        </div>
        <div onClick={e => e.stopPropagation()}>
          <MenuOpciones plan={plan} onDuplicar={onDuplicar} onEliminar={onEliminar} />
        </div>
      </div>
      <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827', lineHeight: 1.4, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{plan.titulo}</h3>
      <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 16 }}>{plan.grado}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: es.dot, display: 'inline-block' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: es.text }}>{plan.estado}</span>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>📅 {formatFecha(plan.created_at)}</span>
      </div>
    </div>
  )
}

// ── Tab: Mis planificaciones ──────────────────────────────────────────────────
function MisPlanificaciones() {
  const [planes, setPlanes] = useState<Planificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroMateria, setFiltro] = useState('')
  const [pagina, setPagina] = useState(1)
  const [toast, setToast] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    listarPlanificaciones().then(({ data }) => { setPlanes(data as Planificacion[]); setLoading(false) })
  }, [])

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  function handleDuplicar(id: string) {
    startTransition(async () => {
      const res = await duplicarPlanificacion(id)
      if (res.error) { showToast('❌ Error al duplicar'); return }
      const { data } = await listarPlanificaciones()
      setPlanes(data as Planificacion[])
      showToast('📋 Duplicada correctamente')
    })
  }

  function handleEliminar(id: string) {
    if (!confirm('¿Eliminar esta planificación? No se puede deshacer.')) return
    startTransition(async () => {
      const res = await eliminarPlanificacion(id)
      if (res.error) { showToast('❌ Error al eliminar'); return }
      setPlanes(prev => prev.filter(p => p.id !== id))
      showToast('🗑️ Eliminada')
    })
  }

  const materias = [...new Set(planes.map(p => p.materia).filter(Boolean))]
  const filtradas = planes.filter(p => {
    const matchB = !busqueda || p.titulo?.toLowerCase().includes(busqueda.toLowerCase())
    const matchM = !filtroMateria || p.materia === filtroMateria
    return matchB && matchM
  })
  const totalPaginas = Math.ceil(filtradas.length / PER_PAGE)
  const paginadas = filtradas.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE)
  const hayFiltro = !!busqueda || !!filtroMateria

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100, background: '#1e293b', color: 'white', padding: '12px 20px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>{toast}</div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
          <input type="text" placeholder="Buscar por título…" value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
            style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1.5px solid #e2e8f0', borderRadius: 11, fontSize: '0.88rem', fontFamily: 'inherit', color: '#111827', background: 'white', outline: 'none' }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#6366f1'}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'}
          />
        </div>
        <select value={filtroMateria} onChange={e => { setFiltro(e.target.value); setPagina(1) }}
          style={{ padding: '10px 36px 10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 11, fontSize: '0.88rem', fontFamily: 'inherit', color: filtroMateria ? '#111827' : '#9ca3af', background: 'white', outline: 'none', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', minWidth: 160 }}
        >
          <option value="">Todas las materias</option>
          {materias.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        {hayFiltro && (
          <button onClick={() => { setBusqueda(''); setFiltro(''); setPagina(1) }}
            style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: 11, fontSize: '0.82rem', fontWeight: 600, color: '#6b7280', background: 'white', cursor: 'pointer', fontFamily: 'inherit' }}
          >✕ Limpiar</button>
        )}
      </div>

      {/* Contador */}
      <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 16 }}>
        {loading ? 'Cargando…' : `${planes.length} planificación${planes.length !== 1 ? 'es' : ''} guardada${planes.length !== 1 ? 's' : ''}`}
      </p>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16, marginBottom: 28 }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : paginadas.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>{hayFiltro ? '🔍' : '📋'}</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>
              {hayFiltro ? 'Sin resultados' : 'Aún no tienes planificaciones guardadas'}
            </h3>
            <p style={{ fontSize: '0.83rem', color: '#6b7280', maxWidth: 340, margin: '0 auto 20px' }}>
              {hayFiltro ? 'Intenta con otro filtro.' : 'Crea tu primera planificación en la pestaña "Nueva planificación".'}
            </p>
          </div>
        ) : (
          paginadas.map(plan => <TarjetaPlan key={plan.id} plan={plan} onDuplicar={handleDuplicar} onEliminar={handleEliminar} />)
        )}
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
            style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: '0.82rem', fontWeight: 600, color: pagina === 1 ? '#d1d5db' : '#374151', background: 'white', cursor: pagina === 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >← Anterior</button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPagina(n)}
              style={{ width: 36, height: 36, border: `1.5px solid ${n === pagina ? '#6366f1' : '#e2e8f0'}`, borderRadius: 9, fontSize: '0.85rem', fontWeight: n === pagina ? 700 : 500, color: n === pagina ? 'white' : '#374151', background: n === pagina ? '#6366f1' : 'white', cursor: 'pointer', fontFamily: 'inherit' }}
            >{n}</button>
          ))}
          <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
            style={{ padding: '8px 16px', border: '1.5px solid #e2e8f0', borderRadius: 9, fontSize: '0.82rem', fontWeight: 600, color: pagina === totalPaginas ? '#d1d5db' : '#374151', background: 'white', cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >Siguiente →</button>
        </div>
      )}
    </div>
  )
}

// ── Tab: Nueva planificacion (codigo original completo) ───────────────────────
function NuevaPlanificacion() {
  const [paso, setPaso] = useState<'inicio' | 'diagnostico' | 'tipo' | 'formulario'>('inicio')
  const [usarDiagnostico, setUsarDiagnostico] = useState<boolean | null>(null)
  const [tipoPlan, setTipoPlan] = useState<string | null>(null)
  const [contexto, setContexto] = useState({
    pais: '', nivel: '', grado: '', area: '', asignatura: '',
    numEstudiantes: '', edadPromedio: '', desempeno: '',
    estilosAprendizaje: '', nee: false, enfoque: '',
  })

  return (
    <div>
      <style>{`
        .tipo-card { background: white; border: 2px solid #e5e7eb; border-radius: 14px; padding: 22px; cursor: pointer; transition: all 0.2s; position: relative; }
        .tipo-card:hover { border-color: #00A3FF; box-shadow: 0 8px 24px rgba(0,163,255,0.12); transform: translateY(-2px); }
        .tipo-card.selected { border-color: #00A3FF; box-shadow: 0 8px 24px rgba(0,163,255,0.2); }
        .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; color: #1e293b; background: white; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.1); }
        .btn-primary { padding: 12px 28px; background: linear-gradient(135deg, #00A3FF, #8E2DE2); color: white; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 0.95rem; transition: all 0.2s; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-secondary { padding: 11px 24px; background: transparent; color: #1A2B56; font-weight: 600; border: 2px solid #1A2B56; border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 0.9rem; transition: all 0.2s; }
        .btn-secondary:hover { background: #1A2B56; color: white; }
      `}</style>

      {paso === 'inicio' && (
        <div style={{ background: 'linear-gradient(135deg, #0d0a2e, #1A2B56)', borderRadius: 20, padding: '40px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12 }}>¿Deseas usar un diagnóstico de aula?</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 32px' }}>
            El diagnóstico permite a la IA personalizar mejor tu planificación según el contexto real de tu grupo.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => { setUsarDiagnostico(true); setPaso('diagnostico') }}>✅ Sí, usar diagnóstico</button> 
            <button className="btn-secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }} onClick={() => { setUsarDiagnostico(false); setPaso('tipo') }}>⏭️ Continuar sin diagnóstico</button>
          </div>
        </div>
      )}

      {paso === 'diagnostico' && (
        <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A2B56', marginBottom: 6 }}>📋 Diagnóstico de Aula</h2>
          <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: 28 }}>Completa la información de tu contexto educativo para personalizar la planificación con IA.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>País *</label>
              <select className="input-field" value={contexto.pais} onChange={e => setContexto({...contexto, pais: e.target.value})}>
                <option value="">Selecciona tu país</option>
                {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Nivel educativo *</label>
              <select className="input-field" value={contexto.nivel} onChange={e => setContexto({...contexto, nivel: e.target.value})}>
                <option value="">Selecciona el nivel</option>
                {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Grado / Año</label>
              <input className="input-field" placeholder="Ej: 5° grado, 2° año" value={contexto.grado} onChange={e => setContexto({...contexto, grado: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Área</label>
              <input className="input-field" placeholder="Ej: Ciencias Naturales" value={contexto.area} onChange={e => setContexto({...contexto, area: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Asignatura específica</label>
              <input className="input-field" placeholder="Ej: Biología" value={contexto.asignatura} onChange={e => setContexto({...contexto, asignatura: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Número de estudiantes</label>
              <input className="input-field" type="number" placeholder="Ej: 30" value={contexto.numEstudiantes} onChange={e => setContexto({...contexto, numEstudiantes: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Nivel de desempeño del grupo</label>
              <select className="input-field" value={contexto.desempeno} onChange={e => setContexto({...contexto, desempeno: e.target.value})}>
                <option value="">Selecciona</option>
                <option value="alto">Alto</option><option value="medio">Medio</option>
                <option value="bajo">Bajo</option><option value="mixto">Mixto</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Enfoque pedagógico</label>
              <select className="input-field" value={contexto.enfoque} onChange={e => setContexto({...contexto, enfoque: e.target.value})}>
                <option value="">Selecciona</option>
                {ENFOQUES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, padding: '12px 16px', background: '#f8f9fa', borderRadius: 10 }}>
            <input type="checkbox" id="nee" checked={contexto.nee} onChange={e => setContexto({...contexto, nee: e.target.checked})} style={{ width: 16, height: 16, accentColor: '#00A3FF' }} />
            <label htmlFor="nee" style={{ fontSize: '0.88rem', color: '#374151', fontWeight: 500, cursor: 'pointer' }}>El grupo tiene estudiantes con Necesidades Educativas Especiales (NEE)</label>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-secondary" onClick={() => setPaso('inicio')}>← Volver</button>
            <button className="btn-primary" onClick={() => setPaso('tipo')}>Continuar → Elegir tipo de planificación</button>
          </div>
        </div>
      )}

      {paso === 'tipo' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A2B56', marginBottom: 4 }}>¿Qué tipo de planificación necesitas?</h2>
              <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>{usarDiagnostico ? '✅ Diagnóstico completado' : '⏭️ Sin diagnóstico — Puedes completarlo después'}</p>
            </div>
            <button className="btn-secondary" onClick={() => setPaso(usarDiagnostico ? 'diagnostico' : 'inicio')} style={{ fontSize: '0.82rem', padding: '8px 16px' }}>← Volver</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {TIPOS_PLANIFICACION.map(tipo => (
              <div key={tipo.id} className={`tipo-card ${tipoPlan === tipo.id ? 'selected' : ''}`} onClick={() => { setTipoPlan(tipo.id); setPaso('formulario') }}>
                {tipo.popular && (
                  <span style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>MÁS USADO</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.8rem' }}>{tipo.icono}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1A2B56', fontSize: '0.95rem' }}>{tipo.titulo}</p>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: tipo.color + '18', color: tipo.color }}>{tipo.badge}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.6 }}>{tipo.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {paso === 'formulario' && tipoPlan && (
        <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: '2rem' }}>{TIPOS_PLANIFICACION.find(t => t.id === tipoPlan)?.icono}</span>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A2B56' }}>{TIPOS_PLANIFICACION.find(t => t.id === tipoPlan)?.titulo}</h2>
              <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>Completa los datos para generar tu planificación con IA</p>
            </div>
          </div>
          {tipoPlan === 'clase' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Tema de la clase *</label><input className="input-field" placeholder="Ej: La célula y sus partes" /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Duración</label>
                <select className="input-field"><option>Clase corta (30-45 min)</option><option>Clase estándar (60 min)</option><option>Bloque doble (90-120 min)</option></select>
              </div>
              <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Objetivo de aprendizaje *</label><textarea className="input-field" rows={3} placeholder="¿Qué aprenderán los estudiantes al finalizar esta clase?" style={{ resize: 'none' }} /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Tipo de evaluación</label>
                <select className="input-field"><option>Diagnóstica</option><option>Formativa</option><option>Sumativa</option></select>
              </div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Instrumento de evaluación</label>
                <select className="input-field"><option>Rúbrica</option><option>Lista de cotejo</option><option>Escala de estimación</option><option>Prueba escrita</option><option>Observación directa</option></select>
              </div>
            </div>
          )}
          {tipoPlan !== 'clase' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Título / Nombre *</label><input className="input-field" placeholder="Nombre de la planificación" /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Objetivo principal *</label><textarea className="input-field" rows={3} placeholder="¿Qué se quiere lograr?" style={{ resize: 'none' }} /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Duración</label><input className="input-field" placeholder="Ej: 4 semanas, 1 periodo" /></div>
              <div><label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Nivel de detalle</label><select className="input-field"><option>Básico</option><option>Intermedio</option><option>Avanzado</option></select></div>
              <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Competencias / Estándares</label><textarea className="input-field" rows={2} placeholder="Lista las competencias o estándares a trabajar" style={{ resize: 'none' }} /></div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-secondary" onClick={() => setPaso('tipo')}>← Volver</button>
            <button className="btn-primary">
  ⚡ Generar planificación con IA
</button>
<button
  onClick={() => exportarPlanificacionPDF(
    {
      titulo: 'Mi planificación',
      materia: contexto.area || 'Materia',
      grado: contexto.grado || 'Grado',
      tema: 'Tema de la clase',
    },
    'Docente'
  )}
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #00A3FF, #8E2DE2)',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.875rem',
    border: 'none',
    borderRadius: 9,
    cursor: 'pointer',
  }}
>
  📄 Exportar PDF
</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Página principal con pestañas ─────────────────────────────────────────────
export default function PlaneacionPage() {
  const [tab, setTab] = useState<'mis' | 'nueva'>('mis')

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); *{box-sizing:border-box;}`}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1A2B56', marginBottom: 4 }}>🧠 Planificaciones</h1>
        <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>Crea y gestiona tus planificaciones pedagógicas con IA</p>
      </div>

      {/* Pestañas */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#f1f5f9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {([
          { key: 'mis',   label: '📋 Mis planificaciones' },
          { key: 'nueva', label: '✨ Nueva planificación'  },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '9px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontSize: '0.88rem', fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.2s',
              background: tab === key ? 'white' : 'transparent',
              color: tab === key ? '#1A2B56' : '#6b7280',
              boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >{label}</button>
        ))}
      </div>

      {/* Contenido */}
      {tab === 'mis'   && <MisPlanificaciones />}
      {tab === 'nueva' && <NuevaPlanificacion />}
    </div>
  )
}