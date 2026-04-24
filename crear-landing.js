const fs = require('fs')
const path = require('path')

// Crear carpetas
const dirs = [
  './app/api/generate-planificacion',
  './components',
]
dirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }) })

// ── ARCHIVO 1: endpoint ──
const endpoint = `import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = \`Eres un experto pedagógico hispanohablante con más de 20 años de experiencia en educación preescolar, primaria, secundaria y bachillerato. Dominas metodologías modernas como:
- Aprendizaje Basado en Proyectos (ABP)
- Constructivismo
- Gamificación educativa
- Aula invertida (Flipped Classroom)
- Aprendizaje colaborativo
- Montessori

Tu especialidad es crear planificaciones de clase detalladas, prácticas y adaptadas al contexto latinoamericano y español. Siempre consideras:
- Los diferentes estilos de aprendizaje (visual, auditivo, kinestésico)
- La diversidad en el aula
- El tiempo disponible para cada actividad
- Los recursos reales disponibles en el aula
- Los estándares curriculares vigentes

IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown, sin explicaciones. Solo el JSON.\`

function buildPrompt(data: any): string {
  return \`Crea una planificación de clase completa con estos datos:

MATERIA: \${data.materia}
GRADO/NIVEL: \${data.grado}
TEMA ESPECÍFICO: \${data.tema}
OBJETIVO DE APRENDIZAJE: \${data.objetivo}
DURACIÓN: \${data.duracion}
NÚMERO DE ESTUDIANTES: \${data.numEstudiantes}
METODOLOGÍA: \${data.metodologia}
TIPO DE EVALUACIÓN: \${data.tipoEvaluacion}
RECURSOS DISPONIBLES: \${data.recursos?.join(', ') || 'No especificados'}
MOMENTO DE LA UNIDAD: \${data.momento || 'No especificado'}
OBSERVACIONES: \${data.observaciones || 'Ninguna'}

Responde ÚNICAMENTE con este JSON (sin markdown, sin texto extra):
{
  "titulo": "Título descriptivo de la clase",
  "objetivo_especifico": "Objetivo redactado con verbo de acción observable",
  "competencias": ["Competencia 1", "Competencia 2", "Competencia 3"],
  "actividades_inicio": [
    {
      "titulo": "Nombre de la actividad",
      "descripcion": "Descripción detallada paso a paso",
      "duracion_min": 10,
      "tipo": "motivacion"
    }
  ],
  "actividades_desarrollo": [
    {
      "titulo": "Nombre de la actividad",
      "descripcion": "Descripción detallada paso a paso",
      "duracion_min": 25,
      "recurso": "Recurso necesario",
      "tipo": "explicacion"
    }
  ],
  "actividades_cierre": [
    {
      "titulo": "Nombre de la actividad",
      "descripcion": "Descripción detallada",
      "duracion_min": 10,
      "tipo": "evaluacion"
    }
  ],
  "recursos_necesarios": ["Recurso 1", "Recurso 2"],
  "criterios_evaluacion": [
    {
      "criterio": "Descripción del criterio",
      "indicador": "Cómo se evidencia",
      "porcentaje": 100
    }
  ],
  "tarea_para_casa": "Descripción de la tarea o null si no aplica",
  "notas_docente": "Sugerencias importantes para el docente",
  "duracion_total_min": 45
}\`
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar autenticación
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // 2. Verificar API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key no configurada. Agrega ANTHROPIC_API_KEY en .env.local' },
        { status: 500 }
      )
    }

    // 3. Obtener y validar datos
    const data = await req.json()
    const camposRequeridos = ['materia', 'grado', 'tema', 'objetivo', 'duracion', 'metodologia', 'tipoEvaluacion']
    const faltantes = camposRequeridos.filter(c => !data[c])
    if (faltantes.length > 0) {
      return NextResponse.json(
        { error: \`Faltan campos requeridos: \${faltantes.join(', ')}\` },
        { status: 400 }
      )
    }

    // 4. Verificar créditos del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('creditos, plan')
      .eq('id', user.id)
      .single()

    const creditos = profile?.creditos ?? 0
    const plan = profile?.plan ?? 'free'
    const costoGeneracion = 5 // créditos por planificación

    if (plan === 'free' && creditos < costoGeneracion) {
      return NextResponse.json(
        { error: 'Créditos insuficientes. Mejora tu plan para continuar.' },
        { status: 402 }
      )
    }

    // 5. Streaming con Claude
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.messages.create({
            model: 'claude-opus-4-6',
            max_tokens: 2000,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: buildPrompt(data) }],
            stream: true,
          })

          let fullText = ''

          for await (const event of response) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              fullText += event.delta.text
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }

          // 6. Descontar créditos
          await supabase
            .from('profiles')
            .update({ creditos: Math.max(0, creditos - costoGeneracion) })
            .eq('id', user.id)

          // 7. Guardar en historial
          try {
            const parsed = JSON.parse(fullText)
            await supabase.from('planificaciones').insert({
              user_id: user.id,
              tipo: data.tipo || 'diaria',
              materia: data.materia,
              grado: data.grado,
              tema: data.tema,
              contenido: parsed,
              estado: 'borrador',
            })
          } catch (_) {
            // Si no se puede parsear o guardar, no es crítico
          }

          controller.close()
        } catch (err: any) {
          const errorMsg = JSON.stringify({ error: err.message || 'Error al generar' })
          controller.enqueue(encoder.encode(errorMsg))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    })

  } catch (err: any) {
    console.error('Error en generate-planificacion:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
`

// ── ARCHIVO 2: componente resultado ──
const resultado = `'use client'
import { useState } from 'react'

interface Actividad {
  titulo: string
  descripcion: string
  duracion_min: number
  recurso?: string
  tipo?: string
}

interface CriterioEval {
  criterio: string
  indicador: string
  porcentaje: number
}

interface PlanData {
  titulo: string
  objetivo_especifico: string
  competencias: string[]
  actividades_inicio: Actividad[]
  actividades_desarrollo: Actividad[]
  actividades_cierre: Actividad[]
  recursos_necesarios: string[]
  criterios_evaluacion: CriterioEval[]
  tarea_para_casa: string | null
  notas_docente: string
  duracion_total_min: number
}

interface Props {
  plan: PlanData
  meta: { materia: string; grado: string; duracion: string }
  onGuardar: () => void
  onRegenerar: () => void
  onExportar: () => void
  guardando?: boolean
}

function Acordeon({ titulo, color, icono, children, defaultOpen = false }: {
  titulo: string; color: string; icono: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ border: \`1.5px solid \${color}30\`, borderRadius: 12, overflow: 'hidden', marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: \`\${color}10\`, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}>
          <span>{icono}</span>{titulo}
        </span>
        <span style={{ color: color, fontWeight: 700, fontSize: '1.1rem', transition: 'transform 0.2s', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {open && <div style={{ padding: '16px 18px', borderTop: \`1px solid \${color}20\` }}>{children}</div>}
    </div>
  )
}

function ActividadCard({ act, color }: { act: Actividad; color: string }) {
  const [copiado, setCopiado] = useState(false)

  function copiar() {
    navigator.clipboard.writeText(\`\${act.titulo}\\n\${act.descripcion}\`)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div style={{ background: 'white', border: '1px solid #e8edf5', borderRadius: 10, padding: '14px 16px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: \`\${color}15\`, color }}>{act.duracion_min} min</span>
          <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.88rem' }}>{act.titulo}</span>
        </div>
        <button onClick={copiar} style={{ fontSize: '0.72rem', fontWeight: 600, color: copiado ? '#16a34a' : '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
          {copiado ? '✅ Copiado' : '📋 Copiar'}
        </button>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.7 }}>{act.descripcion}</p>
      {act.recurso && (
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 6 }}>📦 Recurso: {act.recurso}</p>
      )}
    </div>
  )
}

export default function PlanificacionResultado({ plan, meta, onGuardar, onRegenerar, onExportar, guardando }: Props) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", paddingBottom: 100 }}>
      <style>{\`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');\`}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d0a2e, #1A2B56)', borderRadius: 14, padding: '24px 28px', marginBottom: 20, color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00D2FF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>✅ Planificación generada con IA</p>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{plan.titulo}</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[meta.materia, meta.grado, meta.duracion, \`\${plan.duracion_total_min} min total\`].map(t => (
                <span key={t} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Objetivo */}
      <div style={{ background: 'rgba(0,210,255,0.06)', border: '1.5px solid rgba(0,210,255,0.2)', borderRadius: 12, padding: '18px 22px', marginBottom: 20 }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00A3FF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>🎯 Objetivo específico</p>
        <p style={{ fontSize: '0.95rem', color: '#111827', lineHeight: 1.7, fontWeight: 500 }}>{plan.objetivo_especifico}</p>
      </div>

      {/* Competencias */}
      {plan.competencias?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>🏆 Competencias</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {plan.competencias.map((c, i) => (
              <span key={i} style={{ fontSize: '0.8rem', fontWeight: 600, padding: '6px 14px', borderRadius: 999, background: ['rgba(0,163,255,0.1)','rgba(142,45,226,0.1)','rgba(0,134,138,0.1)','rgba(245,158,11,0.1)'][i % 4], color: ['#00A3FF','#8E2DE2','#00868a','#d97706'][i % 4] }}>{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Actividades */}
      <Acordeon titulo="Actividades de Inicio" color="#16a34a" icono="🟢" defaultOpen={true}>
        {plan.actividades_inicio?.map((a, i) => <ActividadCard key={i} act={a} color="#16a34a" />)}
      </Acordeon>

      <Acordeon titulo="Actividades de Desarrollo" color="#00A3FF" icono="🔵" defaultOpen={true}>
        {plan.actividades_desarrollo?.map((a, i) => <ActividadCard key={i} act={a} color="#00A3FF" />)}
      </Acordeon>

      <Acordeon titulo="Actividades de Cierre" color="#8E2DE2" icono="🔴" defaultOpen={true}>
        {plan.actividades_cierre?.map((a, i) => <ActividadCard key={i} act={a} color="#8E2DE2" />)}
      </Acordeon>

      {/* Recursos */}
      {plan.recursos_necesarios?.length > 0 && (
        <div style={{ background: 'white', border: '1px solid #e8edf5', borderRadius: 12, padding: '18px 20px', marginBottom: 12 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>📦 Recursos necesarios</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {plan.recursos_necesarios.map((r, i) => (
              <span key={i} style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: 8, background: '#f3f4f6', color: '#374151', fontWeight: 500 }}>📌 {r}</span>
            ))}
          </div>
        </div>
      )}

      {/* Criterios */}
      {plan.criterios_evaluacion?.length > 0 && (
        <div style={{ background: 'white', border: '1px solid #e8edf5', borderRadius: 12, padding: '18px 20px', marginBottom: 12 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>📊 Criterios de evaluación</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Criterio','Indicador','%'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e8edf5' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plan.criterios_evaluacion.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', color: '#111827', fontWeight: 500 }}>{c.criterio}</td>
                    <td style={{ padding: '10px 12px', color: '#4B5563' }}>{c.indicador}</td>
                    <td style={{ padding: '10px 12px', color: '#00A3FF', fontWeight: 700 }}>{c.porcentaje}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tarea */}
      {plan.tarea_para_casa && (
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#d97706', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>🏠 Tarea para casa</p>
          <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.7 }}>{plan.tarea_para_casa}</p>
        </div>
      )}

      {/* Notas */}
      {plan.notas_docente && (
        <div style={{ background: '#f9fafb', border: '1px solid #e8edf5', borderRadius: 12, padding: '16px 20px', marginBottom: 12 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>💡 Notas para el docente</p>
          <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.7 }}>{plan.notas_docente}</p>
        </div>
      )}

      {/* Barra de acciones fija */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e8edf5', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <button onClick={onRegenerar} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', background: 'white', color: '#374151', fontWeight: 600, fontSize: '0.85rem', border: '1.5px solid #d1d5db', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
          🔄 Regenerar
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onExportar} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', background: 'white', color: '#374151', fontWeight: 600, fontSize: '0.85rem', border: '1.5px solid #d1d5db', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit' }}>
            📄 Exportar PDF
          </button>
          <button onClick={onGuardar} disabled={guardando} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 24px', background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', color: 'white', fontWeight: 700, fontSize: '0.85rem', border: 'none', borderRadius: 9, cursor: guardando ? 'not-allowed' : 'pointer', opacity: guardando ? 0.7 : 1, fontFamily: 'inherit' }}>
            {guardando ? '⏳ Guardando...' : '💾 Guardar planificación'}
          </button>
        </div>
      </div>
    </div>
  )
}
`

// ── ARCHIVO 3: skeleton ──
const skeleton = `export default function PlanificacionSkeleton() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{\`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .sk {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
      \`}</style>

      {/* Header skeleton */}
      <div style={{ background: '#f3f4f6', borderRadius: 14, padding: '24px 28px', marginBottom: 20 }}>
        <div className="sk" style={{ height: 12, width: 180, marginBottom: 12 }} />
        <div className="sk" style={{ height: 20, width: '70%', marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          {[80,70,90,100].map(w => <div key={w} className="sk" style={{ height: 26, width: w }} />)}
        </div>
      </div>

      {/* Objetivo skeleton */}
      <div style={{ border: '1.5px solid #e8edf5', borderRadius: 12, padding: '18px 22px', marginBottom: 20 }}>
        <div className="sk" style={{ height: 10, width: 140, marginBottom: 12 }} />
        <div className="sk" style={{ height: 14, width: '100%', marginBottom: 8 }} />
        <div className="sk" style={{ height: 14, width: '80%' }} />
      </div>

      {/* Actividades skeleton */}
      {['🟢 Actividades de Inicio','🔵 Actividades de Desarrollo','🔴 Actividades de Cierre'].map((t, i) => (
        <div key={i} style={{ border: '1.5px solid #e8edf5', borderRadius: 12, padding: '14px 18px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="sk" style={{ height: 14, width: 200 }} />
            <div className="sk" style={{ height: 14, width: 14 }} />
          </div>
        </div>
      ))}

      {/* Loader central */}
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(0,163,255,0.2)', borderTopColor: '#00A3FF', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 500 }}>Docenly IA está creando tu planificación…</p>
          <p style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Esto puede tomar hasta 30 segundos</p>
        </div>
      </div>

      <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
    </div>
  )
}
`

fs.writeFileSync('./app/api/generate-planificacion/route.ts', endpoint, 'utf8')
fs.writeFileSync('./components/PlanificacionResultado.tsx', resultado, 'utf8')
fs.writeFileSync('./components/PlanificacionSkeleton.tsx', skeleton, 'utf8')
console.log('✅ Endpoint, Resultado y Skeleton creados!')