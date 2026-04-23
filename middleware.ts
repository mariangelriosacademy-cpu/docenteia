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

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // ── Rutas públicas ──────────────────────────────────────
  const publicRoutes = [
    '/login',
    '/registro',
    '/recuperar',
    '/actualizar',
    '/onboarding',
    '/terminos',
    '/privacidad',
    '/auth',
  ]

  const isPublicRoute = publicRoutes.some(
    route => pathname.startsWith(route)
  )

  // ── Sin sesión → login ──────────────────────────────────
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ── Con sesión ──────────────────────────────────────────
  if (user) {

    // Si va al login o registro → dashboard
    if (pathname === '/login' || pathname === '/registro') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Si va a la raíz → verificar onboarding
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Si va al dashboard → verificar si completó onboarding
    if (pathname.startsWith('/dashboard') && !pathname.startsWith('/onboarding')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completo')
        .eq('id', user.id)
        .single()

      // Si no completó el onboarding → forzar onboarding
      if (!profile?.onboarding_completo) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}