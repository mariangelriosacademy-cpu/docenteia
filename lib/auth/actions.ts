'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ── SIGN IN ────────────────────────────────────────────────
export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const email    = formData.get('email')    as string
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=Completa todos los campos')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=Email o contraseña incorrectos')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// ── SIGN UP ────────────────────────────────────────────────
export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const nombre          = formData.get('nombre')          as string
  const email           = formData.get('email')           as string
  const password        = formData.get('password')        as string
  const pais            = formData.get('pais')            as string
  const nivel_educativo = formData.get('nivel_educativo') as string

  if (!nombre || !email || !password || !pais || !nivel_educativo) {
    redirect('/registro?error=Completa todos los campos')
  }

  if (password.length < 8) {
    redirect('/registro?error=La contraseña debe tener mínimo 8 caracteres')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre, pais, nivel_educativo },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      redirect('/registro?error=Este email ya está registrado')
    }
    redirect('/registro?error=Error al crear la cuenta. Intenta de nuevo')
  }

  if (data.user) {
    await supabase.from('profiles').upsert({
      id:               data.user.id,
      email,
      nombre,
      pais,
      nivel_educativo,
      plan:             'free',
    })
  }

  revalidatePath('/', 'layout')
  redirect(`/registro?mensaje=${encodeURIComponent('¡Registro exitoso! Revisa tu bandeja de entrada y confirma tu cuenta.')}`)
}

// ── SIGN OUT ───────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

// ── RECUPERAR PASSWORD ─────────────────────────────────────
export async function recuperarPassword(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    redirect(`/recuperar?error=${encodeURIComponent('Ingresa tu correo electrónico')}`)
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/actualizar`,
  })

  if (error) {
    redirect(`/recuperar?error=${encodeURIComponent(error.message)}`)
  }

  redirect(`/recuperar?mensaje=${encodeURIComponent('Te enviamos un enlace a ' + email + '. Revisa tu bandeja de entrada.')}`)
}