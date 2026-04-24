'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearPrompt(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const etiquetasRaw = formData.get('etiquetas') as string
  const etiquetas = etiquetasRaw ? etiquetasRaw.split(',').map(e => e.trim()).filter(Boolean) : []

  const { error } = await supabase.from('prompts').insert({
    user_id:      user.id,
    titulo:       formData.get('titulo')       as string,
    descripcion:  formData.get('descripcion')  as string,
    prompt_texto: formData.get('prompt_texto') as string,
    categoria:    formData.get('categoria')    as string,
    etiquetas,
    es_publico:   formData.get('es_publico') === 'true',
    estrellas:    0,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/prompts')
  return { success: true }
}

export async function actualizarPrompt(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const etiquetasRaw = formData.get('etiquetas') as string
  const etiquetas = etiquetasRaw ? etiquetasRaw.split(',').map(e => e.trim()).filter(Boolean) : []

  const { error } = await supabase.from('prompts').update({
    titulo:       formData.get('titulo')       as string,
    descripcion:  formData.get('descripcion')  as string,
    prompt_texto: formData.get('prompt_texto') as string,
    categoria:    formData.get('categoria')    as string,
    etiquetas,
    es_publico:   formData.get('es_publico') === 'true',
    updated_at:   new Date().toISOString(),
  }).eq('id', id).eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/prompts')
  return { success: true }
}

export async function eliminarPrompt(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('prompts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/prompts')
  return { success: true }
}

export async function actualizarEstrellas(id: string, estrellas: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase.from('prompts')
    .update({ estrellas })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/prompts')
  return { success: true }
}