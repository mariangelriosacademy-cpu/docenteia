import { createClient } from '@/lib/supabase/server'
import { BookOpen, MessageSquare, Users, Zap } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, plan')
    .eq('id', user?.id)
    .single()

  const { count: planificacionesCount } = await supabase
    .from('planificaciones').select('*', { count: 'exact', head: true }).eq('user_id', user?.id)

  const { count: promptsCount } = await supabase
    .from('prompts').select('*', { count: 'exact', head: true }).eq('user_id', user?.id)

  const { count: estudiantesCount } = await supabase
    .from('estudiantes').select('*', { count: 'exact', head: true }).eq('user_id', user?.id)

  const nombre = profile?.nombre || 'Docente'
  const plan   = profile?.plan   || 'free'
  const hora   = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches'

  const stats = [
    {
      label: 'Total planificaciones',
      valor: planificacionesCount || 0,
      icono: BookOpen,
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-100',
    },
    {
      label: 'Prompts guardados',
      valor: promptsCount || 0,
      icono: MessageSquare,
      color: 'teal',
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-100',
      iconBg: 'bg-teal-100',
    },
    {
      label: 'Total estudiantes',
      valor: estudiantesCount || 0,
      icono: Users,
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-500',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-100',
    },
    {
      label: 'Plan actual',
      valor: plan.toUpperCase(),
      icono: Zap,
      color: 'teal',
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      border: 'border-teal-100',
      iconBg: 'bg-teal-100',
    },
  ]

  return (
    <div>
      {/* Saludo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {saludo}, {nombre.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Aquí tienes un resumen de tu actividad en Docenly
        </p>
      </div>

      {/* 4 tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => {
          const Icon = s.icono
          return (
            <div
              key={s.label}
              className={`rounded-xl border ${s.border} ${s.bg} p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition`}
            >
              <div className={`w-11 h-11 rounded-lg ${s.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={s.text} />
              </div>
              <div>
                <p className={`text-2xl font-extrabold ${s.text} leading-none`}>{s.valor}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}