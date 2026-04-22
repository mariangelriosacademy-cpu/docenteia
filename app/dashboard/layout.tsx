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
    .select('nombre, plan')
    .eq('id', user.id)
    .single()

  const nombre   = profile?.nombre || 'Docente'
  const plan     = profile?.plan   || 'free'
  const iniciales = nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar nombre={nombre} plan={plan} iniciales={iniciales} signOutAction={signOut} />
      </div>
      <div className="flex flex-col flex-1 md:ml-56">
        <Header nombre={nombre} iniciales={iniciales} signOutAction={signOut} />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}