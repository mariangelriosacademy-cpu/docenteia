import { useMemo } from 'react'

export interface Contenido {
  id:              string
  titulo:          string
  tipo:            string
  materia:         string
  nivel:           string
  descripcion:     string
  contenido_texto?: string
  archivo_url?:    string
  url_externa?:    string
  etiquetas:       string[]
  origen:          string
  created_at:      string
}

export interface Filtros {
  busqueda:   string
  tipo:       string
  materia:    string
  nivel:      string
  ordenarPor: 'reciente' | 'antiguo' | 'alfabetico'
}

export function useContenidosFiltrados(
  contenidos: Contenido[],
  filtros:    Filtros
): Contenido[] {
  return useMemo(() => {
    let resultado = [...contenidos]

    // Búsqueda en título, descripción y etiquetas
    if (filtros.busqueda.trim()) {
      const q = filtros.busqueda.toLowerCase().trim()
      resultado = resultado.filter(c =>
        c.titulo.toLowerCase().includes(q) ||
        c.descripcion?.toLowerCase().includes(q) ||
        c.etiquetas?.some(e => e.toLowerCase().includes(q))
      )
    }

    // Filtro por tipo
    if (filtros.tipo) {
      resultado = resultado.filter(c => c.tipo === filtros.tipo)
    }

    // Filtro por materia
    if (filtros.materia) {
      resultado = resultado.filter(c =>
        c.materia?.toLowerCase().includes(filtros.materia.toLowerCase())
      )
    }

    // Filtro por nivel
    if (filtros.nivel) {
      resultado = resultado.filter(c =>
        c.nivel?.toLowerCase().includes(filtros.nivel.toLowerCase())
      )
    }

    // Ordenar
    switch (filtros.ordenarPor) {
      case 'reciente':
        resultado.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      case 'antiguo':
        resultado.sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
        break
      case 'alfabetico':
        resultado.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'))
        break
    }

    return resultado
  }, [contenidos, filtros])
}