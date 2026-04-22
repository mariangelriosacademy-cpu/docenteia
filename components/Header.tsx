'use client'

import { useState } from 'react'
import { Menu, X, LogOut, Search } from 'lucide-react'
import Sidebar from '@/components/Sidebar'
import { signOut } from '@/lib/auth/actions'

interface Props {
  nombre: string
  iniciales: string
  signOutAction: () => Promise<void>
}

export default function Header({ nombre, iniciales, signOutAction }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white border-b border-gray-100 shadow-sm gap-4">
  {/* Botón hamburguesa — solo móvil */}
  <button
    className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition flex-shrink-0"
    onClick={() => setMobileOpen(true)}
    aria-label="Abrir menú"
  >
    <Menu size={20} />
  </button>

  {/* Buscador central */}
  <div className="flex-1 max-w-xl mx-auto">
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="¿Qué quieres hacer hoy?"
        className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
      />
    </div>
  </div>


        {/* Avatar + nombre + logout */}
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-sm text-gray-500 font-medium">{nombre}</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {iniciales}
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={14} />
              <span className="hidden sm:block">Salir</span>
            </button>
          </form>
        </div>
      </header>

      {/* Sidebar móvil — overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay oscuro */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar deslizable */}
          <div className="relative w-56 h-full">
            <button
              className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              onClick={() => setMobileOpen(false)}
            >
              <X size={16} />
            </button>
            <Sidebar
              nombre={nombre}
              plan="free"
              iniciales={iniciales}
              signOutAction={signOutAction}
            />
          </div>
        </div>
      )}
    </>
  )
}