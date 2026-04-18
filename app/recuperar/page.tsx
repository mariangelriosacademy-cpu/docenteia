import Link from 'next/link'
import { recuperarPassword } from '@/lib/auth/actions'

interface RecuperarPageProps {
  searchParams: Promise<{ error?: string; mensaje?: string }>
}

export default async function RecuperarPage({ searchParams }: RecuperarPageProps) {
  const params  = await searchParams
  const error   = params.error
  const mensaje = params.mensaje

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-[#1A1A5E] to-[#3D3B8E] px-4">

      <div className="w-full max-w-md bg-white rounded-2xl
                      shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#3D3B8E] px-8 py-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Docente<span className="text-[#0D9488]">IA</span>
          </h1>
          <p className="text-indigo-200 text-sm mt-1">
            Recupera el acceso a tu cuenta
          </p>
        </div>

        <div className="px-8 py-8">

          {mensaje ? (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">📬</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ¡Correo enviado!
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
                Volver al inicio de sesión
              </Link>
            </div>

          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ¿Olvidaste tu contraseña?
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Ingresa tu correo y te enviaremos un enlace
                para restablecer tu contraseña.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200
                                rounded-lg flex items-center gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form action={recuperarPassword} className="space-y-5">
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
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-3 border border-gray-300
                               rounded-lg text-sm focus:outline-none
                               focus:ring-2 focus:ring-[#3D3B8E]
                               focus:border-transparent transition-all
                               placeholder:text-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#3D3B8E] text-white
                             font-semibold rounded-lg hover:bg-[#2D2B7E]
                             active:scale-95 transition-all text-sm
                             shadow-md focus:outline-none focus:ring-2
                             focus:ring-[#3D3B8E] focus:ring-offset-2"
                >
                  Enviar enlace de recuperación →
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-[#3D3B8E] hover:underline font-medium"
                >
                  ← Volver al inicio de sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}