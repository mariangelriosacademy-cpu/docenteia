import jsPDF from 'jspdf'

interface Actividad {
  titulo: string
  descripcion: string
  duracion_min?: number
}

interface Planificacion {
  titulo:              string
  materia:             string
  grado:               string
  tema:                string
  objetivo?:           string
  duracion_min?:       number
  metodologia?:        string
  contenido_generado?: string
}

interface ContenidoGenerado {
  objetivo_especifico?:    string
  competencias?:           string[]
  actividades_inicio?:     Actividad[]
  actividades_desarrollo?: Actividad[]
  actividades_cierre?:     Actividad[]
  recursos_necesarios?:    string[]
  criterios_evaluacion?:   string[]
  tarea_para_casa?:        string
  notas_docente?:          string
}

export function exportarPlanificacionPDF(
  planificacion: Planificacion,
  nombreDocente: string
) {
  const doc    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W      = 210
  const margin = 18
  const maxW   = W - margin * 2
  let   y      = margin

  // ── Colores Docenly ───────────────────────────────────────────
  const AZUL_PROF  = [26,  43,  86]  as [number, number, number] // #1A2B56
  const AZUL_ELEC  = [0,  163, 255]  as [number, number, number] // #00A3FF
  const VIOLETA    = [142, 45, 226]  as [number, number, number] // #8E2DE2
  const CIAN       = [0,  210, 255]  as [number, number, number] // #00D2FF
  const GRIS_TEXT  = [74,  85, 104]  as [number, number, number] // #4A5568
  const GRIS_LIGHT = [248, 249, 250] as [number, number, number] // #F8F9FA
  const BLANCO     = [255, 255, 255] as [number, number, number]

  // ── Helpers ───────────────────────────────────────────────────
  const addPage = () => {
    doc.addPage()
    y = margin
    // Mini header en páginas adicionales
    doc.setFillColor(...AZUL_PROF)
    doc.rect(0, 0, W, 10, 'F')
    doc.setFontSize(8)
    doc.setTextColor(...BLANCO)
    doc.text('Docenly · IA para docentes', margin, 7)
    doc.text(planificacion.titulo, W - margin, 7, { align: 'right' })
    y = 16
  }

  const checkY = (needed: number) => {
    if (y + needed > 275) addPage()
  }

  const wrapText = (text: string, x: number, maxWidth: number, lineH: number) => {
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach((line: string) => {
      checkY(lineH)
      doc.text(line, x, y)
      y += lineH
    })
  }

  // ── Parsear contenido generado ────────────────────────────────
  let contenido: ContenidoGenerado = {}
  if (planificacion.contenido_generado) {
    try {
      contenido = JSON.parse(planificacion.contenido_generado)
    } catch {
      contenido = {}
    }
  }

  // ══════════════════════════════════════════════════════════════
  // ENCABEZADO
  // ══════════════════════════════════════════════════════════════

  // Fondo degradado simulado con dos rectángulos
  doc.setFillColor(...AZUL_PROF)
  doc.rect(0, 0, W / 2, 42, 'F')
  doc.setFillColor(0, 130, 200)
  doc.rect(W / 2, 0, W / 2, 42, 'F')

  // Línea inferior del header en cian
  doc.setFillColor(...CIAN)
  doc.rect(0, 42, W, 2, 'F')

  // Logo texto: Docenly
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...BLANCO)
  doc.text('Docenly', margin, 20)

  // Subtítulo
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 210, 255)
  doc.text('IA para docentes', margin, 27)

  // Tipo de documento
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...BLANCO)
  doc.text('PLANIFICACIÓN PEDAGÓGICA', W - margin, 17, { align: 'right' })

  // Nombre del docente
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(200, 225, 255)
  doc.text(`Docente: ${nombreDocente}`, W - margin, 24, { align: 'right' })

  // Fecha
  const fecha = new Date().toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
  doc.text(`Generado: ${fecha}`, W - margin, 30, { align: 'right' })

  y = 52

  // ══════════════════════════════════════════════════════════════
  // TÍTULO DE LA PLANIFICACIÓN
  // ══════════════════════════════════════════════════════════════
  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...AZUL_PROF)
  const tituloLines = doc.splitTextToSize(planificacion.titulo || planificacion.tema, maxW)
  tituloLines.forEach((line: string) => {
    doc.text(line, margin, y)
    y += 8
  })
  y += 2

  // Línea separadora
  doc.setDrawColor(...AZUL_ELEC)
  doc.setLineWidth(0.8)
  doc.line(margin, y, W - margin, y)
  y += 8

  // ══════════════════════════════════════════════════════════════
  // TABLA DE DATOS GENERALES
  // ══════════════════════════════════════════════════════════════
  checkY(32)

  const datosGenerales = [
    ['Materia',      planificacion.materia     || '—'],
    ['Grado/Nivel',  planificacion.grado       || '—'],
    ['Tema',         planificacion.tema        || '—'],
    ['Duración',     planificacion.duracion_min ? `${planificacion.duracion_min} minutos` : '—'],
    ['Metodología',  planificacion.metodologia || '—'],
  ]

  const colW1 = 42
  const colW2 = maxW - colW1
  const rowH  = 8

  // Header de tabla
  doc.setFillColor(...AZUL_PROF)
  doc.rect(margin, y, maxW, rowH, 'F')
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...BLANCO)
  doc.text('Información General', margin + 3, y + 5.5)
  y += rowH

  datosGenerales.forEach(([label, valor], i) => {
    checkY(rowH)
    // Fondo alternado
    if (i % 2 === 0) {
      doc.setFillColor(...GRIS_LIGHT)
      doc.rect(margin, y, maxW, rowH, 'F')
    }
    // Borde
    doc.setDrawColor(220, 228, 240)
    doc.setLineWidth(0.3)
    doc.rect(margin, y, maxW, rowH)
    doc.line(margin + colW1, y, margin + colW1, y + rowH)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...AZUL_PROF)
    doc.text(label, margin + 3, y + 5.5)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRIS_TEXT)
    const valorLines = doc.splitTextToSize(valor, colW2 - 6)
    doc.text(valorLines[0], margin + colW1 + 3, y + 5.5)
    y += rowH
  })

  y += 8

  // ══════════════════════════════════════════════════════════════
  // OBJETIVO ESPECÍFICO
  // ══════════════════════════════════════════════════════════════
  const objetivo = contenido.objetivo_especifico || planificacion.objetivo || ''
  if (objetivo) {
    checkY(24)

    // Caja destacada con borde izquierdo
    doc.setFillColor(235, 245, 255)
    doc.roundedRect(margin, y, maxW, 4, 1, 1, 'F')

    // Calcular altura real del texto
    const objLines = doc.splitTextToSize(objetivo, maxW - 16)
    const boxH     = objLines.length * 5.5 + 12

    doc.setFillColor(235, 245, 255)
    doc.roundedRect(margin, y, maxW, boxH, 2, 2, 'F')
    doc.setFillColor(...AZUL_ELEC)
    doc.rect(margin, y, 3, boxH, 'F')

    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...AZUL_ELEC)
    doc.text('OBJETIVO ESPECÍFICO', margin + 7, y + 6)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...AZUL_PROF)
    doc.setFontSize(8.5)
    let objY = y + 11
    objLines.forEach((line: string) => {
      doc.text(line, margin + 7, objY)
      objY += 5.5
    })

    y += boxH + 8
  }

  // ══════════════════════════════════════════════════════════════
  // COMPETENCIAS
  // ══════════════════════════════════════════════════════════════
  if (contenido.competencias && contenido.competencias.length > 0) {
    checkY(20)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...AZUL_PROF)
    doc.text('Competencias', margin, y)
    y += 6

    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRIS_TEXT)

    contenido.competencias.forEach(comp => {
      checkY(8)
      doc.setFillColor(...AZUL_ELEC)
      doc.circle(margin + 2, y - 1.5, 1.2, 'F')
      const lines = doc.splitTextToSize(comp, maxW - 8)
      lines.forEach((line: string) => {
        doc.text(line, margin + 6, y)
        y += 5
      })
    })
    y += 4
  }

  // ══════════════════════════════════════════════════════════════
  // SECCIÓN DE ACTIVIDADES
  // ══════════════════════════════════════════════════════════════
  const secciones = [
    {
      titulo:      'ACTIVIDADES DE INICIO',
      actividades: contenido.actividades_inicio || [],
      color:       [0, 163, 255] as [number, number, number],
      bgColor:     [235, 248, 255] as [number, number, number],
    },
    {
      titulo:      'ACTIVIDADES DE DESARROLLO',
      actividades: contenido.actividades_desarrollo || [],
      color:       [142, 45, 226] as [number, number, number],
      bgColor:     [245, 235, 255] as [number, number, number],
    },
    {
      titulo:      'ACTIVIDADES DE CIERRE',
      actividades: contenido.actividades_cierre || [],
      color:       [0, 150, 180] as [number, number, number],
      bgColor:     [230, 248, 252] as [number, number, number],
    },
  ]

  secciones.forEach(seccion => {
    if (!seccion.actividades || seccion.actividades.length === 0) return

    checkY(18)

    // Header de sección
    doc.setFillColor(...seccion.color)
    doc.roundedRect(margin, y, maxW, 9, 1.5, 1.5, 'F')
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...BLANCO)
    doc.text(seccion.titulo, margin + 4, y + 6)
    y += 12

    seccion.actividades.forEach((act, idx) => {
      const actLines = doc.splitTextToSize(act.descripcion || '', maxW - 20)
      const actH     = actLines.length * 5 + 14
      checkY(actH)

      // Fondo de actividad
      doc.setFillColor(...seccion.bgColor)
      doc.roundedRect(margin, y, maxW, actH, 1.5, 1.5, 'F')
      doc.setDrawColor(...seccion.color)
      doc.setLineWidth(0.3)
      doc.roundedRect(margin, y, maxW, actH, 1.5, 1.5)

      // Número de actividad
      doc.setFillColor(...seccion.color)
      doc.circle(margin + 6, y + 6, 4, 'F')
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...BLANCO)
      doc.text(`${idx + 1}`, margin + 6, y + 7.5, { align: 'center' })

      // Título de actividad
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...AZUL_PROF)
      doc.text(act.titulo || `Actividad ${idx + 1}`, margin + 13, y + 6.5)

      // Duración
      if (act.duracion_min) {
        doc.setFontSize(7.5)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...seccion.color)
        doc.text(`⏱ ${act.duracion_min} min`, W - margin - 2, y + 6.5, { align: 'right' })
      }

      // Descripción
      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...GRIS_TEXT)
      let descY = y + 12
      actLines.forEach((line: string) => {
        doc.text(line, margin + 6, descY)
        descY += 5
      })

      y += actH + 4
    })

    y += 4
  })

  // ══════════════════════════════════════════════════════════════
  // RECURSOS NECESARIOS
  // ══════════════════════════════════════════════════════════════
  if (contenido.recursos_necesarios && contenido.recursos_necesarios.length > 0) {
    checkY(20)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...AZUL_PROF)
    doc.text('Recursos Necesarios', margin, y)
    y += 6

    // Grid de recursos
    const recursoW  = (maxW - 6) / 2
    let   colActual = 0
    let   startX    = margin

    contenido.recursos_necesarios.forEach(rec => {
      checkY(10)

      doc.setFillColor(245, 247, 252)
      doc.roundedRect(startX, y, recursoW, 8, 1, 1, 'F')
      doc.setDrawColor(210, 220, 240)
      doc.setLineWidth(0.3)
      doc.roundedRect(startX, y, recursoW, 8, 1, 1)

      doc.setFillColor(...AZUL_ELEC)
      doc.circle(startX + 4, y + 4, 1.5, 'F')

      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...GRIS_TEXT)
      const recText = doc.splitTextToSize(rec, recursoW - 12)
      doc.text(recText[0], startX + 8, y + 5.5)

      colActual++
      if (colActual % 2 === 0) {
        startX  = margin
        y      += 10
      } else {
        startX = margin + recursoW + 6
      }
    })

    if (colActual % 2 !== 0) y += 10
    y += 4
  }

  // ══════════════════════════════════════════════════════════════
  // CRITERIOS DE EVALUACIÓN
  // ══════════════════════════════════════════════════════════════
  if (contenido.criterios_evaluacion && contenido.criterios_evaluacion.length > 0) {
    checkY(20)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...AZUL_PROF)
    doc.text('Criterios de Evaluación', margin, y)
    y += 6

    contenido.criterios_evaluacion.forEach((crit, i) => {
      checkY(10)

      doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 250 : 255)
      doc.rect(margin, y, maxW, 8, 'F')
      doc.setDrawColor(220, 228, 240)
      doc.setLineWidth(0.3)
      doc.rect(margin, y, maxW, 8)

      // Número
      doc.setFillColor(...VIOLETA)
      doc.rect(margin, y, 8, 8, 'F')
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...BLANCO)
      doc.text(`${i + 1}`, margin + 4, y + 5.5, { align: 'center' })

      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...GRIS_TEXT)
      const critLines = doc.splitTextToSize(crit, maxW - 14)
      doc.text(critLines[0], margin + 11, y + 5.5)
      y += 8
    })
    y += 6
  }

  // ══════════════════════════════════════════════════════════════
  // TAREA PARA CASA
  // ══════════════════════════════════════════════════════════════
  if (contenido.tarea_para_casa) {
    checkY(20)

    const tareaLines = doc.splitTextToSize(contenido.tarea_para_casa, maxW - 16)
    const tareaH     = tareaLines.length * 5.5 + 14

    doc.setFillColor(255, 250, 235)
    doc.roundedRect(margin, y, maxW, tareaH, 2, 2, 'F')
    doc.setDrawColor(245, 180, 0)
    doc.setLineWidth(0.5)
    doc.roundedRect(margin, y, maxW, tareaH, 2, 2)

    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(180, 130, 0)
    doc.text('📚 TAREA PARA CASA', margin + 6, y + 7)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 80, 0)
    let tareaY = y + 13
    tareaLines.forEach((line: string) => {
      doc.text(line, margin + 6, tareaY)
      tareaY += 5.5
    })
    y += tareaH + 8
  }

  // ══════════════════════════════════════════════════════════════
  // FOOTER en todas las páginas
  // ══════════════════════════════════════════════════════════════
  const totalPages = (doc as any).internal.getNumberOfPages()

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)

    // Línea superior del footer
    doc.setDrawColor(...AZUL_ELEC)
    doc.setLineWidth(0.5)
    doc.line(margin, 285, W - margin, 285)

    // Texto izquierdo
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRIS_TEXT)
    doc.text('Generado con Docenly · IA para docentes · docenly.com', margin, 290)

    // Página número
    doc.setTextColor(...AZUL_PROF)
    doc.text(`Pág. ${i} / ${totalPages}`, W - margin, 290, { align: 'right' })
  }

  // ══════════════════════════════════════════════════════════════
  // GUARDAR PDF
  // ══════════════════════════════════════════════════════════════
  const materia = planificacion.materia?.replace(/\s+/g, '_') || 'Materia'
  const hoy     = new Date().toISOString().split('T')[0]
  doc.save(`Planificacion_${materia}_${hoy}.pdf`)
}