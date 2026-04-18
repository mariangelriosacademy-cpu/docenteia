import Link from 'next/link'
import { signUp } from '@/lib/auth/actions'

const PAISES = [
  'Colombia', 'México', 'España', 'Argentina', 'Chile',
  'Venezuela', 'Perú', 'Ecuador', 'Bolivia', 'Uruguay',
  'Paraguay', 'Costa Rica', 'Panamá', 'Guatemala', 'Honduras',
  'El Salvador', 'Nicaragua', 'Cuba', 'República Dominicana', 'Otro',
]

const NIVELES = [
  { value: 'preescolar',   label: 'Preescolar / Inicial' },
  { value: 'primaria',     label: 'Primaria / Básica' },
  { value: 'secundaria',   label: 'Secundaria / Media' },
  { value: 'bachillerato', label: 'Bachillerato / Preparatoria' },
  { value: 'universidad',  label: 'Universidad / Superior' },
  { value: 'otro',         label: 'Otro' },
]

interface RegistroPageProps {
  searchParams: Promise<{ error?: string; mensaje?: string }>
}

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const params  = await searchParams
  const error   = params.error
  const mensaje = params.mensaje

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-[#1A1A5E] to-[#3D3B8E]
                    px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-2xl
                      shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#3D3B8E] px-8 py-7 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Docente<span className="text-[#0D9488]">IA</span>
          </h1>
          <p className="text-indigo-200 text-sm mt-1">
            Crea tu cuenta gratis — 14 días Pro incluidos
          </p>
        </div>

        <div className="px-8 py-8">

          {/* Estado: registro exitoso */}
          {mensaje ? (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">📬</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ¡Revisa tu correo!
              </h2>
              <p className="text-gray-500 text-sm mb-6">{mensaje}</p>
              <p className="text-gray-400 text-xs mb-6">
                Revisa también tu carpeta de spam si no lo encuentras.
              </p>
              <Link
                href="/login"
                className="block w-full py-3 bg-[#3D3B8E] text-white
                           font-semibold rounded-lg hover:bg-[#2D2B7E]
                           transition-all text-sm text-center"
              >
                Ir al inicio de sesión
              </Link>
            </div>

          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Crear cuenta
              </h2>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200
                                rounded-lg flex items-center gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form action={signUp} className="space-y-4">

                {/* Nombre */}
                <div>
                  <label htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <input
                    id="nombre" name="nombre" type="text" required
                    placeholder="María González"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-[#3D3B8E] focus:border-transparent
                               transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    id="email" name="email" type="email" required
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-[#3D3B8E] focus:border-transparent
                               transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    id="password" name="password" type="password"
                    required minLength={8}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-[#3D3B8E] focus:border-transparent
                               transition-all placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
                </div>

                {/* País */}
                <div>
                  <label htmlFor="pais"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <select
                    id="pais" name="pais" required defaultValue=""
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-[#3D3B8E] focus:border-transparent
                               transition-all bg-white text-gray-700"
                  >
                    <option value="" disabled>Selecciona tu país</option>
                    {PAISES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Nivel educativo */}
                <div>
                  <label htmlFor="nivel_educativo"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    Nivel educativo que impartes
                  </label>
                  <select
                    id="nivel_educativo" name="nivel_educativo"
                    required defaultValue=""
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-[#3D3B8E] focus:border-transparent
                               transition-all bg-white text-gray-700"
                  >
                    <option value="" disabled>Selecciona el nivel</option>
                    {NIVELES.map((n) => (
                      <option key={n.value} value={n.value}>{n.label}</option>
                    ))}
                  </select>
                </div>

                {/* Botón */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0D9488] text-white font-semibold
                             rounded-lg hover:bg-[#0B7A70] active:scale-95
                             transition-all text-sm shadow-md mt-2
                             focus:outline-none focus:ring-2
                             focus:ring-[#0D9488] focus:ring-offset-2"
                >
                  Crear cuenta gratis →
                </button>

                <p className="text-center text-xs text-gray-500">
                  🎁 Incluye <strong>14 días gratis</strong> del plan Pro
                </p>

              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-xs">¿Ya tienes cuenta?</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <Link
                href="/login"
                className="block w-full py-3 border-2 border-[#3D3B8E]
                           text-[#3D3B8E] font-semibold rounded-lg
                           hover:bg-[#3D3B8E] hover:text-white
                           transition-all text-sm text-center"
              >
                Iniciar sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}