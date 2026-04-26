import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BannerRotativo from '@/components/BannerRotativo'
import { signOut } from '@/lib/auth/actions'

const tipsEducativos = [
  { titulo: 'Evaluación formativa', texto: 'La evaluación formativa continua mejora el aprendizaje hasta un 40% más que la evaluación sumativa tradicional.' },
  { titulo: 'Neuroeducación', texto: 'El cerebro consolida mejor la información cuando se estudia en sesiones cortas con descansos de 10 minutos.' },
  { titulo: 'Aprendizaje activo', texto: 'El aprendizaje basado en proyectos aumenta la motivación intrínseca y el pensamiento crítico en los estudiantes.' },
  { titulo: 'Reflexión docente', texto: 'El buen maestro no es el que da las mejores respuestas, sino el que hace las mejores preguntas. — Ken Robinson' },
  { titulo: 'IA pedagógica', texto: 'Usar IA como asistente pedagógico puede reducir el tiempo de planificación hasta en 8 horas semanales.' },
]

const sugerenciasIA = [
  { texto: 'Crea una evaluación diagnóstica para comenzar el nuevo período escolar.', accion: 'Crear ahora', href: '/dashboard/evaluaciones/nueva' },
  { texto: 'Genera una planificación semanal alineada al currículo de tu país en segundos.', accion: 'Planificar', href: '/dashboard/planeacion/nueva' },
  { texto: 'Diseña una rúbrica personalizada para tu próxima actividad con IA.', accion: 'Crear rúbrica', href: '/dashboard/evaluaciones/rubrica' },
  { texto: 'Redacta un comunicado para los padres de familia con lenguaje profesional.', accion: 'Redactar', href: '/dashboard/oficina/correos' },
  { texto: 'Genera actividades diferenciadas para estudiantes con distintos niveles.', accion: 'Generar', href: '/dashboard/clases/actividades' },
]

const accionesRapidas = [
  { label: 'Nueva lección',    href: '/dashboard/clases/nueva',       desc: 'Crea y estructura tu clase' },
  { label: 'Nueva evaluación', href: '/dashboard/evaluaciones/nueva', desc: 'Pruebas y rúbricas con IA' },
  { label: 'Nueva actividad',  href: '/dashboard/planeacion/nueva',   desc: 'Planifica paso a paso' },
  { label: 'Añadir recurso',   href: '/dashboard/recursos/nuevo',     desc: 'Materiales digitales' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, plan')
    .eq('id', user?.id)
    .single()

  const { count: clasesCount }       = await supabase.from('planificaciones').select('*', { count: 'exact', head: true }).eq('user_id', user?.id)
  const { count: estudiantesCount }  = await supabase.from('estudiantes').select('*', { count: 'exact', head: true }).eq('user_id', user?.id)
  const { count: evaluacionesCount } = await supabase.from('calificaciones').select('*', { count: 'exact', head: true }).eq('estudiante_id', user?.id)
  const { count: promptsCount }      = await supabase.from('prompts').select('*', { count: 'exact', head: true }).eq('user_id', user?.id)
  const { count: pendientesCount }   = await supabase.from('planificaciones').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('estado', 'pendiente')
  const { count: sinCalificarCount } = await supabase.from('calificaciones').select('*', { count: 'exact', head: true }).eq('user_id', user?.id).eq('calificado', false)

  const nombre     = profile?.nombre || 'Docente'
  const plan       = profile?.plan   || 'free'
  const isPro      = plan === 'pro'
  const iniciales  = nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const hora       = new Date().getHours()
  const saludo     = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'
  const tipHoy     = tipsEducativos[new Date().getDay() % tipsEducativos.length]
  const sugerencia = sugerenciasIA[new Date().getDay() % sugerenciasIA.length]

  const stats = [
    { label: 'Planificaciones', valor: clasesCount      || 0, sub: `${pendientesCount || 0} pendientes`,  alerta: (pendientesCount || 0) > 0 },
    { label: 'Estudiantes',     valor: estudiantesCount  || 0, sub: 'registrados',                          alerta: false },
    { label: 'Sin calificar',   valor: sinCalificarCount || 0, sub: 'evaluaciones',                          alerta: (sinCalificarCount || 0) > 0 },
    { label: 'Prompts usados',  valor: promptsCount      || 0, sub: 'generados con IA',                      alerta: false },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        .stat-card {
          background: white;
          border-radius: 8px;
          border: 1px solid #E5E7EB;
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: box-shadow 0.15s;
          position: relative;
        }
        .stat-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .stat-card.alerta { border-left: 3px solid #F59E0B; }

        .accion-btn {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px 18px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.15s;
          cursor: pointer;
        }
        .accion-btn:hover {
          border-color: #00A3FF;
          box-shadow: 0 2px 12px rgba(0,163,255,0.08);
          transform: translateY(-1px);
        }

        .ia-block {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          background: #1A2B56;
          color: white;
          font-weight: 600;
          font-size: 0.82rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          font-family: inherit;
          transition: background 0.15s;
          letter-spacing: 0.01em;
        }
        .btn-primary:hover { background: #0d1f42; }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: transparent;
          color: #374151;
          font-weight: 500;
          font-size: 0.82rem;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          font-family: inherit;
          transition: all 0.15s;
          letter-spacing: 0.01em;
        }
        .btn-ghost:hover { background: #F9FAFB; border-color: #D1D5DB; }

        .btn-upgrade {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          background: #00A3FF;
          color: white;
          font-weight: 600;
          font-size: 0.82rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          font-family: inherit;
          transition: background 0.15s;
        }
        .btn-upgrade:hover { background: #0090e0; }

        .tip-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 18px 20px;
        }

        .label-tag {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #9CA3AF;
          margin-bottom: 10px;
        }

        .ia-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #00A3FF;
          display: inline-block;
          margin-right: 6px;
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      

      <main style={{ flex: 1, padding: '32px 36px', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', letterSpacing: '-0.015em', marginBottom: 2 }}>
              {saludo}, {nombre.split(' ')[0]}
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#9CA3AF', fontWeight: 400 }}>
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!isPro && (
              <Link href="/precios" className="btn-upgrade">
                Activar Pro
              </Link>
            )}
            <Link href="/dashboard/planeacion/nueva" className="btn-primary">
              + Nueva planificación
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} className={`stat-card ${s.alerta ? 'alerta' : ''}`}>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {s.valor}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>{s.label}</span>
              <span style={{ fontSize: '0.72rem', color: s.alerta ? '#F59E0B' : '#9CA3AF', fontWeight: s.alerta ? 600 : 400 }}>
                {s.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Acciones rápidas */}
        <div style={{ marginBottom: 24 }}>
          <span className="label-tag">Acciones rápidas</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {accionesRapidas.map(a => (
              <Link key={a.href} href={a.href} className="accion-btn">
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>+ {a.label.replace('Nueva ', '').replace('Añadir ', '')}</span>
                <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 400 }}>{a.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bloque IA */}
        <div className="ia-block" style={{ marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              <span className="ia-dot" />
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#00A3FF', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Docenly IA · Sugerencia</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.6, marginBottom: 12, fontWeight: 400 }}>
              {sugerencia.texto}
            </p>
            <Link href={sugerencia.href} className="btn-ghost" style={{ fontSize: '0.78rem' }}>
              {sugerencia.accion} →
            </Link>
          </div>
          <div style={{ borderLeft: '1px solid #E5E7EB', paddingLeft: 24, flexShrink: 0 }}>
            <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginBottom: 8, fontWeight: 500 }}>Acción rápida con IA</p>
            <Link href="/dashboard/planeacion/diaria" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Crear planificación
            </Link>
            <p style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: 6, textAlign: 'center' }}>Listo en &lt; 60 segundos</p>
          </div>
        </div>

        {/* Banner rotativo */}
        <div style={{ marginBottom: 24 }}>
          <BannerRotativo isPro={isPro} />
        </div>

        {/* Tip del día */}
        <div className="tip-card">
          <span className="label-tag">{tipHoy.titulo}</span>
          <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: 1.75, fontWeight: 400 }}>
            {tipHoy.texto}
          </p>
        </div>

      </main>
    </div>
  )
}