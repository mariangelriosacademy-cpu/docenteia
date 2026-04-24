'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface PlanificacionInput {
  materia: string
  grado: string
  fecha: string
  tipo_plan: string
  pais?: string
  marco_curricular?: string
  tema: string
  objetivo?: string
  competencias?: string
  estrategias?: string
  inicio?: string
  desarrollo?: string
  cierre?: string
  recursos?: string[]
  metodologia?: string
  tipo_evaluacion?: string
  instrumentos_eval?: string
  observaciones?: string
  contenido_generado?: object
}

export async function guardarPlanificacion(input: PlanificacionInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const titulo = `Planificación de ${input.materia} - ${input.tema}`

  const { data, error } = await supabase
    .from('planificaciones')
    .insert({
      user_id: user.id,
      titulo,
      materia: input.materia,
      grado: input.grado,
      fecha: input.fecha,
      tipo_plan: input.tipo_plan,
      pais: input.pais,
      marco_curricular: input.marco_curricular,
      tema: input.tema,
      objetivo: input.objetivo,
      competencias: input.competencias,
      estrategias: input.estrategias,
      inicio: input.inicio,
      desarrollo: input.desarrollo,
      cierre: input.cierre,
      recursos: input.recursos || [],
      metodologia: input.metodologia,
      tipo_evaluacion: input.tipo_evaluacion,
      instrumentos_eval: input.instrumentos_eval,
      observaciones: input.observaciones,
      contenido_generado: input.contenido_generado || null,
      estado: 'completada',
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/planificaciones')
  return { data }
}

export async function duplicarPlanificacion(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: original, error: fetchError } = await supabase
    .from('planificaciones')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !original) return { error: 'Planificación no encontrada' }

  const { id: _, created_at, updated_at, ...rest } = original
  const { data, error } = await supabase
    .from('planificaciones')
    .insert({ ...rest, titulo: `${rest.titulo} (copia)`, estado: 'borrador' })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/planificaciones')
  return { data }
}

export async function eliminarPlanificacion(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { error } = await supabase
    .from('planificaciones')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/planificaciones')
  return { success: true }
}

export async function listarPlanificaciones() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado', data: [] }

  const { data, error } = await supabase
    .from('planificaciones')
    .select('id, titulo, materia, grado, fecha, tipo_plan, estado, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message, data: [] }
  return { data: data || [] }
}