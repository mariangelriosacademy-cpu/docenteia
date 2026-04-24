'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Actividad {
  titulo: string
  descripcion: string
  duracion: number
}

interface CriterioEval {
  criterio: string
  indicador: string
  nivel: string
}

interface PlanificacionData {
  titulo: string
  materia: string
  grado: string
  duracionTotal: string
  fecha: string
  objetivo: string
  competencias: string[]
  actividadesInicio: Actividad[]
  actividadesDesarrollo: Actividad[]
  actividadesCierre: Actividad[]
  recursos: { icono: string; nombre: string }[]
  criteriosEvaluacion: CriterioEval[]
  tareaParaCasa?: string
}

// ── Mock data (reemplaza con respuesta real de Claude cuando tengas API key) ──
const MOCK_PLANIFICACION: PlanificacionData = {
  titulo: 'Fracciones Equivalentes',
  materia: 'Matemáticas',
  grado: 'Primaria 4° (9 años)',
  duracionTotal: '60 minutos',
  fecha: new Date().toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  objetivo: 'El estudiante será capaz de identificar y construir fracciones equivalentes mediante el uso de material concreto y representaciones gráficas, para comprender el concepto de equivalencia numérica en situaciones cotidianas.',
  competencias: [
    'Identifica fracciones equivalentes usando modelos visuales',
    'Construye fracciones equivalentes multiplicando o dividiendo numerador y denominador',
    'Aplica fracciones equivalentes en la resolución de problemas contextualizados',
    'Comunica con precisión el concepto de equivalencia entre pares',
  ],
  actividadesInicio: [
    { titulo: 'La pizza compartida', descripcion: 'Se presenta una situación: "Ana tiene ½ de una pizza y Pedro tiene 2/4 de otra pizza igual. ¿Quién tiene más?" Los estudiantes debaten en parejas durante 2 minutos. Se recogen las respuestas y se genera la pregunta generadora del día.', duracion: 8 },
    { titulo: 'Exploración de saberes previos', descripcion: 'Los estudiantes responden en una tarjeta: ¿Qué es una fracción? Dibuja una fracción que conozcas. Se socializan 3-4 respuestas para activar conocimientos previos.', duracion: 5 },
  ],
  actividadesDesarrollo: [
    { titulo: 'Construcción con material concreto', descripcion: 'En grupos de 4, los estudiantes usan tiras de papel para doblar y representar fracciones. Doblan una tira en 2 partes iguales (½), luego en 4 partes (2/4) y en 8 partes (4/8). Descubren que todas representan lo mismo.', duracion: 15 },
    { titulo: 'Representación gráfica y simbólica', descripcion: 'Cada grupo registra en su cuaderno los hallazgos: dibuja las tiras, escribe las fracciones y completa la regla: "Para obtener fracciones equivalentes multiplico/divido numerador y denominador por el mismo número."', duracion: 12 },
    { titulo: 'Práctica guiada colectiva', descripcion: 'La docente presenta 5 ejercicios en el tablero. Los estudiantes los resuelven primero individualmente (2 min) y luego se corrige colectivamente explicando el procedimiento paso a paso.', duracion: 10 },
  ],
  actividadesCierre: [
    { titulo: 'Ticket de salida', descripcion: 'Cada estudiante resuelve en una tarjeta: Escribe 3 fracciones equivalentes a ¾ y explica con tus palabras por qué son equivalentes. La docente recoge las tarjetas para evaluación formativa.', duracion: 5 },
    { titulo: 'Síntesis colectiva', descripcion: 'Un estudiante voluntario explica a la clase la regla de fracciones equivalentes. Se construye un organizador gráfico conjunto en el tablero con los conceptos clave del día.', duracion: 5 },
  ],
  recursos: [
    { icono: '📄', nombre: 'Tiras de papel (3 por estudiante)' },
    { icono: '✏️', nombre: 'Cuaderno de matemáticas' },
    { icono: '🎨', nombre: 'Colores o marcadores' },
    { icono: '📋', nombre: 'Tarjetas de ticket de salida' },
    { icono: '🖥️', nombre: 'Tablero / Smartboard' },
    { icono: '📐', nombre: 'Regla para mediciones' },
  ],
  criteriosEvaluacion: [
    { criterio: 'Comprensión conceptual', indicador: 'Explica con sus palabras qué son fracciones equivalentes', nivel: 'Alto' },
    { criterio: 'Procedimiento', indicador: 'Construye correctamente fracciones equivalentes', nivel: 'Alto' },
    { criterio: 'Representación', indicador: 'Usa modelos gráficos para justificar equivalencias', nivel: 'Medio' },
    { criterio: 'Comunicación', indicador: 'Expresa ideas matemáticas con vocabulario apropiado', nivel: 'Medio' },
    { criterio: 'Aplicación', indicador: 'Resuelve problemas usando fracciones equivalentes', nivel: 'Básico' },
  ],
  tareaParaCasa: 'Busca en casa 3 ejemplos donde aparezcan fracciones (receta, medidas, porcentajes). Escribe cada fracción y encuentra una fracción equivalente. Trae los ejemplos al próximo clase para compartir.',
}

// ── Skeleton loader ────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px', paddingBottom: 120 }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -800px 0 }
          100% { background-position: 800px 0 }
        }
        .sk { background: linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%); background-size: 800px 100%; animation: shimmer 1.4s infinite linear; border-radius: 8px; }
      `}</style>
      {/* Header skeleton */}
      <div style={{ background: 'white', borderRadius: 16, padding: '28px 32px', marginBottom: 20, border: '1px solid #e8edf5' }}>
        <div className="sk" style={{ height: 14, width: '40%', marginBottom: 16 }} />
        <div className="sk" style={{ height: 32, width: '70%', marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          {[120, 100, 90].map(w => <div key={w} className="sk" style={{ height: 28, width: w }} />)}
        </div>
      </div>
      {/* Objetivo skeleton */}
      <div style={{ background: 'white', borderRadius: 16, padding: '24px 32px', marginBottom: 16, border: '1px solid #e8edf5' }}>
        <div className="sk" style={{ height: 12, width: '25%', marginBottom: 14 }} />
        <div className="sk" style={{ height: 14, width: '100%', marginBottom: 8 }} />
        <div className="sk" style={{ height: 14, width: '85%', marginBottom: 8 }} />
        <div className="sk" style={{ height: 14, width: '60%' }} />
      </div>
      {/* Accordions skeleton */}
      {['verde', 'indigo', 'teal'].map(c => (
        <div key={c} style={{ background: 'white', borderRadius: 16, padding: '20px 32px', marginBottom: 12, border: '1px solid #e8edf5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="sk" style={{ height: 16, width: '35%' }} />
            <div className="sk" style={{ height: 28, width: 28, borderRadius: '50%' }} />
          </div>
        </div>
      ))}
      {/* AI generating message */}
      <div style={{ textAlign: 'center', padding: '32px 0', color: '#6366f1' }}>
        <div style={{ fontSize: '2rem', marginBottom: 12, animation: 'spin 2s linear infinite', display: 'inline-block' }}>✨</div>
        <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>La IA está generando tu planificación…</p>
        <p style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>Esto puede tomar unos segundos</p>
      </div>
    </div>
  )
}

// ── Accordion ─────────────────────────────────────────────────────────────────
function Accordion({
  titulo, emoji, color, actividades, duracionTotal
}: {
  titulo: string; emoji: string; color: string; actividades: Actividad[]; duracionTotal: number
}) {
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)

  const colores: Record<string, { bg: string; border: string; badge: string; text: string; light: string }> = {
    verde:  { bg: '#f0fdf4', border: '#86efac', badge: '#dcfce7', text: '#16a34a', light: '#bbf7d0' },
    indigo: { bg: '#eef2ff', border: '#a5b4fc', badge: '#e0e7ff', text: '#4f46e5', light: '#c7d2fe' },
    teal:   { bg: '#f0fdfa', border: '#5eead4', badge: '#ccfbf1', text: '#0d9488', light: '#99f6e4' },
  }
  const c = colores[color]

  function copiar() {
    const texto = actividades.map(a => `${a.titulo} (${a.duracion} min)\n${a.descripcion}`).join('\n\n')
    navigator.clipboard.writeText(texto)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${c.border}`, marginBottom: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ background: c.bg, padding: '16px 24px', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 12 }}
      >
        <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>{titulo}</span>
          <span style={{ marginLeft: 10, fontSize: '0.72rem', fontWeight: 600, background: c.badge, color: c.text, padding: '2px 10px', borderRadius: 999, border: `1px solid ${c.light}` }}>
            {duracionTotal} min
          </span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); copiar() }}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: copied ? c.badge : 'white', border: `1px solid ${c.border}`, borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, color: c.text, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
        >
          {copied ? '✓ Copiado' : '📋 Copiar'}
        </button>
        <span style={{ color: c.text, fontSize: '0.9rem', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </div>

      {/* Content */}
      {open && (
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {actividades.map((act, i) => (
            <div key={i} style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: c.badge, border: `1px solid ${c.light}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: c.text, textAlign: 'center', lineHeight: 1.2 }}>{act.duracion}<br/>min</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', marginBottom: 4 }}>{act.titulo}</p>
                <p style={{ fontSize: '0.83rem', color: '#4B5563', lineHeight: 1.65 }}>{act.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function PlanificacionResultado() {
  const router = useRouter()
  const [cargando, setCargando] = useState(true)
  const [plan, setPlan] = useState<PlanificacionData | null>(null)
  const [guardado, setGuardado] = useState(false)
  const [regenerando, setRegenerando] = useState(false)

  // Simula el streaming/carga de la IA
  useEffect(() => {
    const t = setTimeout(() => {
      setPlan(MOCK_PLANIFICACION)
      setCargando(false)
    }, 2800)
    return () => clearTimeout(t)
  }, [])

  async function handleGuardar() {
    setGuardado(true)
    setTimeout(() => router.push('/dashboard/planeacion'), 1500)
  }

  async function handleRegenerar() {
    setRegenerando(true)
    setCargando(true)
    setPlan(null)
    setTimeout(() => {
      setPlan(MOCK_PLANIFICACION)
      setCargando(false)
      setRegenerando(false)
    }, 2800)
  }

  function handleExportarPDF() {
    window.print()
  }

  const nivelColor: Record<string, { bg: string; text: string }> = {
    'Alto':   { bg: '#dcfce7', text: '#16a34a' },
    'Medio':  { bg: '#fef9c3', text: '#ca8a04' },
    'Básico': { bg: '#fee2e2', text: '#dc2626' },
  }

  if (cargando) return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: "'DM Sans', sans-serif", paddingTop: 28 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Skeleton />
    </div>
  )

  if (!plan) return null

  const totalMin = [...plan.actividadesInicio, ...plan.actividadesDesarrollo, ...plan.actividadesCierre]
    .reduce((acc, a) => acc + a.duracion, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", paddingBottom: 120 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        @media print { .no-print { display: none !important; } body { background: white; } }
      `}</style>

      {/* Top bar */}
      <div className="no-print" style={{ background: 'white', borderBottom: '1px solid #e8edf5', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <button onClick={() => router.back()} style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
          ← Volver
        </button>
        <span style={{ color: '#e2e8f0' }}>|</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>📋 Resultado de planificación</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' }}>✓ Generada con IA</span>
      </div>

      <div style={{ maxWidth: 860, margin: '28px auto', padding: '0 20px' }}>

        {/* ── Header ── */}
        <div className="fade-up" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4f46e5)', borderRadius: 20, padding: '32px 36px', marginBottom: 20, color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: '30%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Planificación Diaria</p>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>{plan.titulo}</h1>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { icon: '📚', label: plan.materia },
              { icon: '🎓', label: plan.grado },
              { icon: '⏱️', label: plan.duracionTotal },
              { icon: '📅', label: plan.fecha },
            ].map(({ icon, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,255,255,0.12)', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)' }}>
                {icon} {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Objetivo ── */}
        <div className="fade-up" style={{ background: 'white', borderRadius: 16, border: '1px solid #99f6e4', padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animationDelay: '0.05s' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0d9488', marginBottom: 10 }}>🎯 Objetivo específico</p>
          <p style={{ fontSize: '0.95rem', color: '#111827', lineHeight: 1.75, fontWeight: 500 }}>{plan.objetivo}</p>
        </div>

        {/* ── Competencias ── */}
        <div className="fade-up" style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf5', padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animationDelay: '0.1s' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4f46e5', marginBottom: 14 }}>🏆 Competencias</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {plan.competencias.map((c, i) => {
              const colors = ['#eef2ff|#4f46e5|#c7d2fe', '#f0fdf4|#16a34a|#86efac', '#fef9c3|#ca8a04|#fde68a', '#fdf4ff|#9333ea|#e9d5ff']
              const [bg, text, border] = colors[i % colors.length].split('|')
              return (
                <span key={i} style={{ padding: '7px 14px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 600, background: bg, color: text, border: `1px solid ${border}`, lineHeight: 1.4 }}>
                  {c}
                </span>
              )
            })}
          </div>
        </div>

        {/* ── Acordeones ── */}
        <div className="fade-up" style={{ animationDelay: '0.15s' }}>
          <Accordion titulo="Actividades de Inicio" emoji="🟢" color="verde" actividades={plan.actividadesInicio} duracionTotal={plan.actividadesInicio.reduce((a, x) => a + x.duracion, 0)} />
          <Accordion titulo="Actividades de Desarrollo" emoji="🔵" color="indigo" actividades={plan.actividadesDesarrollo} duracionTotal={plan.actividadesDesarrollo.reduce((a, x) => a + x.duracion, 0)} />
          <Accordion titulo="Actividades de Cierre" emoji="🔴" color="teal" actividades={plan.actividadesCierre} duracionTotal={plan.actividadesCierre.reduce((a, x) => a + x.duracion, 0)} />
        </div>

        {/* ── Recursos ── */}
        <div className="fade-up" style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf5', padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animationDelay: '0.2s' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#374151', marginBottom: 14 }}>🧰 Recursos necesarios</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {plan.recursos.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e8edf5' }}>
                <span style={{ fontSize: '1.1rem' }}>{r.icono}</span>
                <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>{r.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Criterios de evaluación ── */}
        <div className="fade-up" style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf5', padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animationDelay: '0.25s' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#374151', marginBottom: 14 }}>📊 Criterios de evaluación</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: '#374151', borderBottom: '2px solid #e8edf5', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Criterio</th>
                  <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: '#374151', borderBottom: '2px solid #e8edf5', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Indicador de logro</th>
                  <th style={{ textAlign: 'center', padding: '10px 14px', fontWeight: 700, color: '#374151', borderBottom: '2px solid #e8edf5', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nivel</th>
                </tr>
              </thead>
              <tbody>
                {plan.criteriosEvaluacion.map((cr, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#111827' }}>{cr.criterio}</td>
                    <td style={{ padding: '12px 14px', color: '#4B5563', lineHeight: 1.5 }}>{cr.indicador}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: nivelColor[cr.nivel]?.bg || '#f3f4f6', color: nivelColor[cr.nivel]?.text || '#374151' }}>
                        {cr.nivel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Tarea para casa ── */}
        {plan.tareaParaCasa && (
          <div className="fade-up" style={{ background: 'linear-gradient(135deg,#fef9c3,#fef3c7)', borderRadius: 16, border: '1px solid #fde68a', padding: '22px 28px', marginBottom: 16, animationDelay: '0.3s' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ca8a04', marginBottom: 10 }}>🏠 Tarea para casa</p>
            <p style={{ fontSize: '0.88rem', color: '#78350f', lineHeight: 1.7 }}>{plan.tareaParaCasa}</p>
          </div>
        )}

        {/* ── Resumen de tiempo ── */}
        <div className="fade-up" style={{ background: 'white', borderRadius: 16, border: '1px solid #e8edf5', padding: '20px 28px', marginBottom: 100, animationDelay: '0.35s' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#374151', marginBottom: 14 }}>⏱️ Distribución del tiempo</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Inicio', min: plan.actividadesInicio.reduce((a, x) => a + x.duracion, 0), color: '#16a34a', bg: '#dcfce7' },
              { label: 'Desarrollo', min: plan.actividadesDesarrollo.reduce((a, x) => a + x.duracion, 0), color: '#4f46e5', bg: '#eef2ff' },
              { label: 'Cierre', min: plan.actividadesCierre.reduce((a, x) => a + x.duracion, 0), color: '#0d9488', bg: '#ccfbf1' },
              { label: 'Total', min: totalMin, color: '#111827', bg: '#f1f5f9' },
            ].map(({ label, min, color, bg }) => (
              <div key={label} style={{ flex: 1, minWidth: 100, padding: '12px 16px', background: bg, borderRadius: 12, textAlign: 'center' }}>
                <p style={{ fontSize: '1.4rem', fontWeight: 900, color }}>{min}</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color, opacity: 0.8 }}>min · {label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Barra de acciones fija ── */}
      <div className="no-print" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e8edf5', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <button
          onClick={handleRegenerar}
          disabled={regenerando}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 20px', background: 'white', border: '1.5px solid #d1d5db', borderRadius: 11, fontSize: '0.85rem', fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#6366f1'; (e.currentTarget as HTMLButtonElement).style.color = '#4f46e5' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#d1d5db'; (e.currentTarget as HTMLButtonElement).style.color = '#374151' }}
        >
          {regenerando ? '⏳ Regenerando…' : '🔄 Generar de nuevo'}
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleExportarPDF}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 20px', background: 'white', border: '1.5px solid #d1d5db', borderRadius: 11, fontSize: '0.85rem', fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#6366f1'; (e.currentTarget as HTMLButtonElement).style.color = '#4f46e5' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#d1d5db'; (e.currentTarget as HTMLButtonElement).style.color = '#374151' }}
          >
            📄 Exportar PDF
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardado}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 24px', background: guardado ? '#dcfce7' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: guardado ? '#16a34a' : 'white', border: 'none', borderRadius: 11, fontSize: '0.85rem', fontWeight: 700, cursor: guardado ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: guardado ? 'none' : '0 4px 12px rgba(99,102,241,0.3)' }}
          >
            {guardado ? '✓ Guardado — redirigiendo…' : '💾 Guardar planificación'}
          </button>
        </div>
      </div>
    </div>
  )
}