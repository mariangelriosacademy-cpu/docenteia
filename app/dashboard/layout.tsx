import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { signOut } from '@/lib/auth/actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, plan, avatar_url')
    .eq('id', user.id)
    .single()

  const nombre    = profile?.nombre    || user.user_metadata?.nombre || user.email?.split('@')[0] || 'Docente'
  const plan      = profile?.plan      || 'free'
  const iniciales = nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const avatarUrl = profile?.avatar_url || null

  return (
    // ── El div raíz expone --sb-w como variable CSS.
    // Sidebar la actualiza en tiempo real; el main la lee.
    <div
      id="dashboard-root"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#F8F9FA',
        // valor inicial: expandido = 224px
        ['--sb-w' as string]: '224px',
      }}
    >
      {/* Sidebar — solo visible en md+ */}
      <div className="hidden md:block">
        <Sidebar
          nombre={nombre}
          plan={plan}
          iniciales={iniciales}
          avatarUrl={avatarUrl}
          signOutAction={signOut}
        />
      </div>

      {/*
        Columna derecha: su margin-left sigue a --sb-w con transición,
        igual que el sidebar. Así el contenido se mueve perfectamente.
      */}
      <div
        style={{
          marginLeft: 'var(--sb-w)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.65s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <Header
          nombre={nombre}
          iniciales={iniciales}
          avatarUrl={avatarUrl}
          signOutAction={signOut}
        />
        <main style={{ flex: 1, padding: '32px 36px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}