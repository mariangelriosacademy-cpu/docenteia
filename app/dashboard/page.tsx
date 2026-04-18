import Link from 'next/link'

const secciones = [
  {
    titulo: 'Mis Clases',
    descripcion: 'Gestiona tus cursos y grupos',
    icono: '📚',
    href: '/dashboard/clases',
    color: 'from-blue-600 to-blue-800',
    stats: '0 clases activas',
  },
  {
    titulo: 'Estudiantes',
    descripcion: 'Administra tu lista de alumnos',
    icono: '👥',
    href: '/dashboard/estudiantes',
    color: 'from-emerald-600 to-emerald-800',
    stats: '0 estudiantes',
  },
  {
    titulo: 'Evaluaciones',
    descripcion: 'Crea y gestiona pruebas',
    icono: '📝',
    href: '/dashboard/evaluaciones',
    color: 'from-violet-600 to-violet-800',
    stats: '0 evaluaciones',
  },
  {
    titulo: 'Instrumentos',
    descripcion: 'Rúbricas, listas de cotejo y más',
    icono: '📋',
    href: '/dashboard/instrumentos',
    color: 'from-orange-500 to-orange-700',
    stats: '0 instrumentos',
  },
  {
    titulo: 'Proyectos Escolares',
    descripcion: 'Diseña proyectos curriculares',
    icono: '🎯',
    href: '/dashboard/proyectos',
    color: 'from-rose-500 to-rose-700',
    stats: '0 proyectos',
  },
  {
    titulo: 'Generar con IA',
    descripcion: 'Crea contenido con inteligencia artificial',
    icono: '🤖',
    href: '/dashboard/ia',
    color: 'from-cyan-500 to-cyan-700',
    stats: 'Disponible',
  },
  {
    titulo: 'Seguimiento',
    descripcion: 'Monitorea el progreso estudiantil',
    icono: '📊',
    href: '/dashboard/seguimiento',
    color: 'from-indigo-500 to-indigo-700',
    stats: '0 reportes',
  },
]

const navItems = [
  { label: 'Inicio',          href: '/dashboard',                icono: '🏠' },
  { label: 'Mis Clases',      href: '/dashboard/clases',         icono: '📚' },
  { label: 'Estudiantes',     href: '/dashboard/estudiantes',    icono: '👥' },
  { label: 'Evaluaciones',    href: '/dashboard/evaluaciones',   icono: '📝' },
  { label: 'Instrumentos',    href: '/dashboard/instrumentos',   icono: '📋' },
  { label: 'Proyectos',       href: '/dashboard/proyectos',      icono: '🎯' },
  { label: 'Generar con IA',  href: '/dashboard/ia',             icono: '🤖' },
  { label: 'Seguimiento',     href: '/dashboard/seguimiento',    icono: '📊' },
]

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Barra lateral */}
      <aside className="w-64 bg-[#1A1A5E] text-white flex flex-col fixed h-full z-10">
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-2xl font-bold">
            Class<span className="text-[#0D9488]">Mind</span>
          </h1>
          <p className="text-indigo-300 text-xs mt-1">Plataforma Educativa IA</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                         text-indigo-200 hover:bg-white/10 hover:text-white
                         transition-all text-sm font-medium"
            >
              <span>{item.icono}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <form action="/api/signout">
            <button
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                         text-indigo-300 hover:bg-white/10 hover:text-white
                         transition-all text-sm w-full"
            >
              <span>🚪</span>
              <span>Cerrar sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            ¡Bienvenido a ClassMind! 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Tu asistente pedagógico con inteligencia artificial
          </p>
        </div>

        {/* Tarjetas de acceso rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {secciones.map((seccion) => (
            <Link
              key={seccion.href}
              href={seccion.href}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100
                         hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${seccion.color} p-5`}>
                <span className="text-4xl">{seccion.icono}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#1A1A5E] transition-colors">
                  {seccion.titulo}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{seccion.descripcion}</p>
                <p className="text-xs text-gray-400 mt-3 font-medium">{seccion.stats}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Banner plan */}
        <div className="mt-8 bg-gradient-to-r from-[#1A1A5E] to-[#3D3B8E]
                        rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">🎁 14 días de Plan Pro gratis</p>
            <p className="text-indigo-200 text-sm mt-1">
              Accede a todas las funciones de IA sin límites
            </p>
          </div>
          <button className="bg-[#0D9488] text-white px-5 py-2.5 rounded-lg
                             font-semibold text-sm hover:bg-[#0B7A70] transition-all">
            Explorar Pro
          </button>
        </div>

      </main>
    </div>
  )
}