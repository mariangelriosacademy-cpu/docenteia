'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function crearContenido(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const titulo      = formData.get('titulo') as string
  const tipo        = formData.get('tipo') as string
  const materia = formData.get('materia') === 'Otra'
  ? formData.get('materia_personalizada') as string
  : formData.get('materia') as string
  const nivel       = formData.get('nivel') as string
  const descripcion = formData.get('descripcion') as string
  const etiquetas   = formData.get('etiquetas') as string
  const notas       = formData.get('notas') as string
  const url_externa = formData.get('url_externa') as string
  const archivo     = formData.get('archivo') as File | null

  let archivo_url: string | null = null
  let archivo_nombre: string | null = null
  let archivo_tipo: string | null = null

  // Upload archivo si existe
  if (archivo && archivo.size > 0) {
    const extension = archivo.name.split('.').pop()
    const nombreArchivo = `${user.id}/${Date.now()}.${extension}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('contenidos')
      .upload(nombreArchivo, archivo, {
        contentType: archivo.type,
        upsert: false,
      })

    if (uploadError) return { error: `Error al subir archivo: ${uploadError.message}` }

    const { data: urlData } = supabase.storage
      .from('contenidos')
      .getPublicUrl(uploadData.path)

    archivo_url    = urlData.publicUrl
    archivo_nombre = archivo.name
    archivo_tipo   = archivo.type
  }

  const { error } = await supabase.from('contenidos').insert({
    user_id:       user.id,
    titulo,
    tipo,
    materia,
    nivel,
    descripcion,
    etiquetas:     etiquetas ? etiquetas.split(',').filter(Boolean) : [],
    notas,
    url_externa:   url_externa || null,
    archivo_url,
    archivo_nombre,
    archivo_tipo,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard/contenidos')
  return { success: true }
}

export async function obtenerContenidos() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('contenidos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function eliminarContenido(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }
  console.log('Usuario:', user?.id)

  // Obtener el contenido para borrar el archivo de Storage
  const { data: contenido } = await supabase
    .from('contenidos')
    .select('archivo_url, archivo_nombre')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  // Si tiene archivo, borrarlo de Storage
  if (contenido?.archivo_url) {
    const path = contenido.archivo_url.split('/contenidos/')[1]
    if (path) {
      await supabase.storage.from('contenidos').remove([path])
    }
  }

  const { error } = await supabase
    .from('contenidos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/contenidos')
  return { success: true }
}