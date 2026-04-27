'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface Estudiante {
  id?:                 string
  user_id?:            string
  nombre:              string
  grado:               string
  acudiente_nombre:    string
  acudiente_email:     string
  acudiente_telefono:  string
  observaciones:       string
  activo:              boolean
  created_at?:         string
}

// ── Obtener todos ──────────────────────────────────────────
export async function obtener_todos() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('estudiantes')
    .select('*')
    .eq('user_id', user.id)
    .order('nombre', { ascending: true })

  return data || []
}

// ── Obtener por ID ─────────────────────────────────────────
export async function obtener_por_id(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('estudiantes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return data
}

// ── Crear ──────────────────────────────────────────────────
export async function crear(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('estudiantes').insert({
    user_id:             user.id,
    nombre:              formData.get('nombre')             as string,
    grado:               formData.get('grado')              as string,
    asignatura: formData.get('asignatura') as string,
    acudiente_nombre:    formData.get('acudiente_nombre')   as string,
    acudiente_email:     formData.get('acudiente_email')    as string,
    acudiente_telefono:  formData.get('acudiente_telefono') as string,
    observaciones:       formData.get('observaciones')      as string,
    activo:              true,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/estudiantes')
  redirect('/dashboard/estudiantes')
}

// ── Actualizar ─────────────────────────────────────────────
export async function actualizar(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('estudiantes')
    .update({
      nombre:             formData.get('nombre')             as string,
      grado:              formData.get('grado')              as string,
      asignatura: formData.get('asignatura') as string,
      acudiente_nombre:   formData.get('acudiente_nombre')   as string,
      acudiente_email:    formData.get('acudiente_email')    as string,
      acudiente_telefono: formData.get('acudiente_telefono') as string,
      observaciones:      formData.get('observaciones')      as string,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/estudiantes')
  redirect('/dashboard/estudiantes')
}

// ── Archivar ───────────────────────────────────────────────
export async function archivar(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: estudiante } = await supabase
    .from('estudiantes')
    .select('activo')
    .eq('id', id)
    .single()

  await supabase
    .from('estudiantes')
    .update({ activo: !estudiante?.activo })
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath('/dashboard/estudiantes')
}