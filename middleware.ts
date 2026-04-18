import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Obtiene la sesión actual
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    '/login',
    '/registro',
    '/recuperar',
    '/terminos',
    '/privacidad',
  ]

  const isPublicRoute = publicRoutes.some(
    route => pathname.startsWith(route)
  )

  // Si no está autenticado e intenta acceder a ruta privada → login
  if (!user && !isPublicRoute && pathname !== '/') {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set(
      'error',
      'Debes iniciar sesión para acceder'
    )
    return NextResponse.redirect(loginUrl)
  }

  // Si está autenticado e intenta ir al login/registro → dashboard
  if (user && (pathname === '/login' || pathname === '/registro')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Si está autenticado y va a la raíz → dashboard
  if (user && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}