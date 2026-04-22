import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BannerRotativo from '@/components/BannerRotativo'
import { signOut } from '@/lib/auth/actions'

const tipsEducativos = [
  { icono: '💡', titulo: 'Tip del día', texto: 'La evaluación formativa continua mejora el aprendizaje hasta un 40% más que la evaluación sumativa tradicional.' },
  { icono: '🧠', titulo: 'Neuroeducación', texto: 'El cerebro consolida mejor la información cuando se estudia en sesiones cortas con descansos de 10 minutos.' },
  { icono: '🎯', titulo: 'Estrategia', texto: 'El aprendizaje basado en proyectos aumenta la motivación intrínseca y el pensamiento crítico.' },
  { icono: '📚', titulo: 'Reflexión', texto: '"El buen maestro no es el que da las mejores respuestas, sino el que hace las mejores preguntas." — Ken Robinson' },
  { icono: '🤖', titulo: 'IA en el aula', texto: 'Usar IA como asistente pedagógico puede reducir el tiempo de planificación hasta en 8 horas semanales.' },
]

const sugerenciasIA = [
  { texto: 'Crea una evaluación diagnóstica para comenzar el nuevo período escolar.', accion: 'Crear ahora', href: '/dashboard/evaluaciones/nueva' },
  { texto: 'Genera una planificación semanal alineada al currículo de tu país en segundos.', accion: 'Planificar', href: '/dashboard/planeacion/nueva' },
  { texto: 'Diseña una rúbrica personalizada para tu próxima actividad con IA.', accion: 'Crear rúbrica', href: '/dashboard/evaluaciones/rubrica' },
  { texto: 'Crea un comunicado para los padres de familia con lenguaje profesional.', accion: 'Redactar', href: '/dashboard/oficina/correos' },
  { texto: 'Genera actividades diferenciadas para estudiantes con distintos niveles.', accion: 'Generar', href: '/dashboard/clases/actividades' },
]

const accionesRapidas = [
  { label: '+ Lección',    href: '/dashboard/clases/nueva',       color: '#1A2B56' },
  { label: '+ Evaluación', href: '/dashboard/evaluaciones/nueva', color: '#8E2DE2' },
  { label: '+ Actividad',  href: '/dashboard/planeacion/nueva',   color: '#00A3FF' },
  { label: '+ Recursos',   href: '/dashboard/recursos/nuevo',     color: '#00868a' },
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

  const nombre    = profile?.nombre || 'Docente'
  const plan      = profile?.plan   || 'free'
  const isPro     = plan === 'pro'
  const hora      = new Date().getHours()
  const saludo    = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'
  const tipHoy    = tipsEducativos[new Date().getDay() % tipsEducativos.length]
  const sugerencia = sugerenciasIA[new Date().getDay() % sugerenciasIA.length]

  const stats = [
    { label: 'Planificaciones', valor: clasesCount      || 0, sub: `${pendientesCount || 0} pendientes`,  color: '#00A3FF', alerta: (pendientesCount || 0) > 0 },
    { label: 'Estudiantes',     valor: estudiantesCount  || 0, sub: 'registrados',                         color: '#1A2B56', alerta: false },
    { label: 'Sin calificar',   valor: sinCalificarCount || 0, sub: 'evaluaciones pendientes',              color: '#8E2DE2', alerta: (sinCalificarCount || 0) > 0 },
    { label: 'Prompts usados',  valor: promptsCount      || 0, sub: 'generados con IA',                     color: '#00D2FF', alerta: false },
  ]

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .stat-card { background: white; border-radius: 10px; border: 1px solid #e8edf5; padding: 18px 20px; display: flex; align-items: center; gap: 14px; transition: box-shadow 0.2s; position: relative; overflow: hidden; }
        .stat-card:hover { box-shadow: 0 4px 16px rgba(0,163,255,0.08); }
        .stat-alerta::after { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: #f59e0b; }
        .ia-card { background: linear-gradient(135deg, #0d0a2e 0%, #1A2B56 100%); border-radius: 12px; padding: 22px 26px; border: 1px solid rgba(0,163,255,0.2); position: relative; overflow: hidden; }
        .ia-card::before { content: ''; position: absolute; top: -40px; right: -40px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(0,163,255,0.12) 0%, transparent 70%); }
        .wow-btn { display: inline-flex; align-items: center; gap: 10px; padding: 14px 24px; background: linear-gradient(135deg, #00A3FF 0%, #8E2DE2 100%); color: white; font-weight: 700; font-size: 0.95rem; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,163,255,0.35); transition: all 0.2s; white-space: nowrap; }
        .wow-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,163,255,0.45); }
        .accion-card { display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 1.05rem; font-weight: 700; color: white; text-decoration: none; height: 90px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .accion-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.22); filter: brightness(1.1); }
        .tip-card { background: white; border-radius: 10px; border: 1px solid #e8edf5; padding: 20px; }
        @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse-dot { animation: pulse-dot 2s infinite; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#111827', letterSpacing: '-0.025em', marginBottom: 4 }}>
            {saludo}, {nombre.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 400 }}>Aquí tienes un resumen de tu actividad en Docenly</p>
        </div>
        {!isPro && (
          <Link href="/precios" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', color: 'white', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', boxShadow: '0 2px 12px rgba(0,163,255,0.25)' }}>
            ✨ Activar Pro
          </Link>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} className={`stat-card ${s.alerta ? 'stat-alerta' : ''}`}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: s.color }} />
              {s.alerta && <div className="pulse-dot" style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', border: '2px solid white' }} />}
            </div>
            <div>
              <p style={{ fontSize: '1.65rem', fontWeight: 800, color: s.color, lineHeight: 1, letterSpacing: '-0.04em' }}>{s.valor}</p>
              <p style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: 2, fontWeight: 500 }}>{s.label}</p>
              <p style={{ fontSize: '0.65rem', color: s.alerta ? '#f59e0b' : '#9CA3AF', marginTop: 1, fontWeight: s.alerta ? 600 : 400 }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* IA Card */}
      <div className="ia-card" style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00D2FF' }} className="pulse-dot" />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#00D2FF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Docenly IA · Sugerencia para ti</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: 8, letterSpacing: '-0.02em' }}>
                🤖 Basado en tu actividad reciente…
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 14 }}>
                {sugerencia.texto}
              </p>
              <Link href={sugerencia.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, background: 'rgba(0,163,255,0.2)', border: '1px solid rgba(0,163,255,0.35)', color: '#00D2FF', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none' }}>
                {sugerencia.accion} →
              </Link>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <Link href="/dashboard/planeacion/nueva" className="wow-btn">
                ⚡ Crear planificación con IA
              </Link>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>Listo en menos de 60 segundos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.09em', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 12 }}>Acciones rápidas</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {accionesRapidas.map(a => (
            <Link key={a.href} href={a.href} className="accion-card" style={{ background: a.color }}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Banner rotativo */}
      <div style={{ marginBottom: 24 }}>
        <BannerRotativo isPro={isPro} />
      </div>

      {/* Tip del día */}
      <div className="tip-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: '1.2rem' }}>{tipHoy.icono}</span>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#00A3FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tipHoy.titulo}</p>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.75, fontWeight: 400 }}>{tipHoy.texto}</p>
      </div>

    </div>
  )
}