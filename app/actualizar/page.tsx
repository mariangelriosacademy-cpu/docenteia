'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ActualizarPasswordPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [password,  setPassword]  = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error,     setError]     = useState('')
  const [cargando,  setCargando]  = useState(false)
  const [exito,     setExito]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres')
      return
    }

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    setCargando(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Error al actualizar. El enlace puede haber expirado.')
      setCargando(false)
      return
    }

    setExito(true)
    setCargando(false)

    // Redirige al dashboard después de 2 segundos
    setTimeout(() => router.push('/dashboard'), 2000)
  }

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
            Crea tu nueva contraseña
          </p>
        </div>

        <div className="px-8 py-8">

          {/* Éxito */}
          {exito ? (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ¡Contraseña actualizada!
              </h2>
              <p className="text-gray-500 text-sm">
                Redirigiendo a tu dashboard...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 border-2 border-[#3D3B8E]
                                border-t-transparent rounded-full animate-spin" />
              </div>
            </div>

          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Nueva contraseña
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Elige una contraseña segura para tu cuenta.
              </p>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200
                                rounded-lg flex items-center gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Nueva contraseña */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nueva contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full px-4 py-3 border border-gray-300
                               rounded-lg text-sm focus:outline-none
                               focus:ring-2 focus:ring-[#3D3B8E]
                               focus:border-transparent transition-all
                               placeholder:text-gray-400"
                  />
                </div>

                {/* Confirmar contraseña */}
                <div>
                  <label
                    htmlFor="confirmar"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmar"
                    type="password"
                    required
                    value={confirmar}
                    onChange={e => setConfirmar(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full px-4 py-3 border border-gray-300
                               rounded-lg text-sm focus:outline-none
                               focus:ring-2 focus:ring-[#3D3B8E]
                               focus:border-transparent transition-all
                               placeholder:text-gray-400"
                  />

                  {/* Indicador de coincidencia */}
                  {confirmar && (
                    <p className={`text-xs mt-1 ${
                      password === confirmar
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {password === confirmar
                        ? '✅ Las contraseñas coinciden'
                        : '❌ Las contraseñas no coinciden'}
                    </p>
                  )}
                </div>

                {/* Botón */}
                <button
                  type="submit"
                  disabled={cargando || password !== confirmar}
                  className="w-full py-3 bg-[#0D9488] text-white
                             font-semibold rounded-lg hover:bg-[#0B7A70]
                             active:scale-95 transition-all text-sm
                             shadow-md disabled:opacity-50
                             disabled:cursor-not-allowed
                             focus:outline-none focus:ring-2
                             focus:ring-[#0D9488] focus:ring-offset-2"
                >
                  {cargando ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white
                                       border-t-transparent rounded-full
                                       animate-spin" />
                      Actualizando...
                    </span>
                  ) : (
                    'Actualizar contraseña →'
                  )}
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