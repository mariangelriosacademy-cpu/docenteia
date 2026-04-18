import Link from 'next/link'
import { signIn } from '@/lib/auth/actions'

interface LoginPageProps {
  searchParams: Promise<{ error?: string; message?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const error  = params.error
  const msg    = params.message

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-[#1A1A5E] to-[#3D3B8E] px-4">

      {/* Tarjeta principal */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl
                      overflow-hidden">

        {/* Header */}
        <div className="bg-[#3D3B8E] px-8 py-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Docente<span className="text-[#0D9488]">IA</span>
          </h1>
          <p className="text-indigo-200 text-sm mt-1">
            Tu asistente pedagógico con IA
          </p>
        </div>

        {/* Formulario */}
        <div className="px-8 py-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Iniciar sesión
          </h2>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200
                            rounded-lg flex items-center gap-2">
              <span className="text-red-500 text-lg">⚠️</span>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {msg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200
                            rounded-lg flex items-center gap-2">
              <span className="text-green-500 text-lg">✅</span>
              <p className="text-green-600 text-sm">{msg}</p>
            </div>
          )}

          <form action={signIn} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-[#3D3B8E] focus:border-transparent
                           transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <Link
                  href="/recuperar"
                  className="text-xs text-[#3D3B8E] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-[#3D3B8E] focus:border-transparent
                           transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full py-3 bg-[#3D3B8E] text-white font-semibold
                         rounded-lg hover:bg-[#2D2B7E] active:scale-95
                         transition-all text-sm shadow-md
                         focus:outline-none focus:ring-2
                         focus:ring-[#3D3B8E] focus:ring-offset-2"
            >
              Iniciar sesión →
            </button>

          </form>

          {/* Separador */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">¿No tienes cuenta?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Link registro */}
          <Link
            href="/registro"
            className="block w-full py-3 border-2 border-[#3D3B8E]
                       text-[#3D3B8E] font-semibold rounded-lg
                       hover:bg-[#3D3B8E] hover:text-white
                       transition-all text-sm text-center"
          >
            Crear cuenta gratis
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-6">
          Al continuar aceptas nuestros{' '}
          <Link href="/terminos" className="underline hover:text-[#3D3B8E]">
            Términos de uso
          </Link>
        </p>
      </div>
    </div>
  )
}