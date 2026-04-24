'use client'
import { useState } from 'react'

const TIPOS_PLANIFICACION = [
  {
    id: 'anual',
    icono: '📅',
    titulo: 'Planificación Anual',
    descripcion: 'Visión general del curso completo con malla curricular y secuencia progresiva.',
    color: '#1A2B56',
    badge: 'Macro',
  },
  {
    id: 'periodo',
    icono: '📊',
    titulo: 'Planificación por Periodo',
    descripcion: 'Organización bimestral o trimestral con secuencia de unidades y cronograma.',
    color: '#00A3FF',
    badge: 'Meso',
  },
  {
    id: 'unidad',
    icono: '📘',
    titulo: 'Unidad Didáctica',
    descripcion: 'Conjunto estructurado de clases con objetivo común y pregunta problematizadora.',
    color: '#8E2DE2',
    badge: 'Meso',
  },
  {
    id: 'clase',
    icono: '🧑‍🏫',
    titulo: 'Plan de Clase',
    descripcion: 'Microplanificación de clase individual con inicio, desarrollo, cierre y evaluación.',
    color: '#00868a',
    badge: 'Micro',
    popular: true,
  },
  {
    id: 'evaluacion',
    icono: '📝',
    titulo: 'Plan de Evaluación',
    descripcion: 'Rúbricas, indicadores y descriptores por nivel alineados a competencias.',
    color: '#c2410c',
    badge: 'Evaluación',
  },
  {
    id: 'adaptacion',
    icono: '♿',
    titulo: 'Adaptaciones / Inclusión',
    descripcion: 'Estrategias diferenciadas y ajustes para necesidades educativas especiales.',
    color: '#4A5568',
    badge: 'Inclusión',
  },
]

const PAISES = ['Colombia', 'México', 'España', 'Argentina', 'Chile', 'Venezuela', 'Perú', 'Ecuador', 'Otro']
const NIVELES = ['Preescolar', 'Primaria', 'Secundaria', 'Bachillerato', 'Universidad']
const ENFOQUES = ['Tradicional', 'Constructivista', 'ABP', 'Aprendizaje significativo', 'STEAM', 'Otro']

export default function PlaneacionPage() {
  const [paso, setPaso] = useState<'inicio' | 'diagnostico' | 'tipo' | 'formulario'>('inicio')
  const [usarDiagnostico, setUsarDiagnostico] = useState<boolean | null>(null)
  const [tipoPlan, setTipoPlan] = useState<string | null>(null)

  const [contexto, setContexto] = useState({
    pais: '', nivel: '', grado: '', area: '', asignatura: '',
    numEstudiantes: '', edadPromedio: '', desempeno: '',
    estilosAprendizaje: '', nee: false, enfoque: '',
  })

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tipo-card { background: white; border: 2px solid #e5e7eb; border-radius: 14px; padding: 22px; cursor: pointer; transition: all 0.2s; position: relative; }
        .tipo-card:hover { border-color: #00A3FF; box-shadow: 0 8px 24px rgba(0,163,255,0.12); transform: translateY(-2px); }
        .tipo-card.selected { border-color: #00A3FF; box-shadow: 0 8px 24px rgba(0,163,255,0.2); }
        .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; color: #1e293b; background: white; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.1); }
        .btn-primary { padding: 12px 28px; background: linear-gradient(135deg, #00A3FF, #8E2DE2); color: white; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 0.95rem; transition: all 0.2s; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-secondary { padding: 11px 24px; background: transparent; color: #1A2B56; font-weight: 600; border: 2px solid #1A2B56; border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 0.9rem; transition: all 0.2s; }
        .btn-secondary:hover { background: #1A2B56; color: white; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1A2B56', marginBottom: 6, letterSpacing: '-0.02em' }}>
          🧠 Planificación Inteligente
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
          Crea planificaciones pedagógicas completas con IA adaptadas a tu contexto educativo
        </p>
      </div>

      {/* PASO 1: ¿Usar diagnóstico? */}
      {paso === 'inicio' && (
        <div style={{ background: 'linear-gradient(135deg, #0d0a2e, #1A2B56)', borderRadius: 20, padding: '40px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
            ¿Deseas usar un diagnóstico de aula?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 32px' }}>
            El diagnóstico permite a la IA personalizar mejor tu planificación según el contexto real de tu grupo: nivel de desempeño, estilos de aprendizaje y necesidades especiales.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => { setUsarDiagnostico(true); setPaso('diagnostico') }}
            >
              ✅ Sí, usar diagnóstico
            </button>
            <button
              className="btn-secondary"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
              onClick={() => { setUsarDiagnostico(false); setPaso('tipo') }}
            >
              ⏭️ Continuar sin diagnóstico
            </button>
          </div>
        </div>
      )}

      {/* PASO 2: Diagnóstico de aula */}
      {paso === 'diagnostico' && (
        <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A2B56', marginBottom: 6 }}>
            📋 Diagnóstico de Aula
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: 28 }}>
            Completa la información de tu contexto educativo para personalizar la planificación con IA.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

            {/* País */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>País *</label>
              <select className="input-field" value={contexto.pais} onChange={e => setContexto({...contexto, pais: e.target.value})}>
                <option value="">Selecciona tu país</option>
                {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Nivel */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Nivel educativo *</label>
              <select className="input-field" value={contexto.nivel} onChange={e => setContexto({...contexto, nivel: e.target.value})}>
                <option value="">Selecciona el nivel</option>
                {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Grado */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Grado / Año</label>
              <input className="input-field" placeholder="Ej: 5° grado, 2° año" value={contexto.grado} onChange={e => setContexto({...contexto, grado: e.target.value})} />
            </div>

            {/* Área */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Área</label>
              <input className="input-field" placeholder="Ej: Ciencias Naturales" value={contexto.area} onChange={e => setContexto({...contexto, area: e.target.value})} />
            </div>

            {/* Asignatura */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Asignatura específica</label>
              <input className="input-field" placeholder="Ej: Biología" value={contexto.asignatura} onChange={e => setContexto({...contexto, asignatura: e.target.value})} />
            </div>

            {/* Número de estudiantes */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Número de estudiantes</label>
              <input className="input-field" type="number" placeholder="Ej: 30" value={contexto.numEstudiantes} onChange={e => setContexto({...contexto, numEstudiantes: e.target.value})} />
            </div>

            {/* Nivel de desempeño */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Nivel de desempeño del grupo</label>
              <select className="input-field" value={contexto.desempeno} onChange={e => setContexto({...contexto, desempeno: e.target.value})}>
                <option value="">Selecciona</option>
                <option value="alto">Alto</option>
                <option value="medio">Medio</option>
                <option value="bajo">Bajo</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>

            {/* Enfoque pedagógico */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Enfoque pedagógico</label>
              <select className="input-field" value={contexto.enfoque} onChange={e => setContexto({...contexto, enfoque: e.target.value})}>
                <option value="">Selecciona</option>
                {ENFOQUES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* NEE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, padding: '12px 16px', background: '#f8f9fa', borderRadius: 10 }}>
            <input
              type="checkbox"
              id="nee"
              checked={contexto.nee}
              onChange={e => setContexto({...contexto, nee: e.target.checked})}
              style={{ width: 16, height: 16, accentColor: '#00A3FF' }}
            />
            <label htmlFor="nee" style={{ fontSize: '0.88rem', color: '#374151', fontWeight: 500, cursor: 'pointer' }}>
              El grupo tiene estudiantes con Necesidades Educativas Especiales (NEE)
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-secondary" onClick={() => setPaso('inicio')}>← Volver</button>
            <button className="btn-primary" onClick={() => setPaso('tipo')}>
              Continuar → Elegir tipo de planificación
            </button>
          </div>
        </div>
      )}

      {/* PASO 3: Elegir tipo de planificación */}
      {paso === 'tipo' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A2B56', marginBottom: 4 }}>
                ¿Qué tipo de planificación necesitas?
              </h2>
              <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>
                {usarDiagnostico ? '✅ Diagnóstico completado — La IA personalizará según tu contexto' : '⏭️ Sin diagnóstico — Puedes completarlo después'}
              </p>
            </div>
            <button className="btn-secondary" onClick={() => setPaso(usarDiagnostico ? 'diagnostico' : 'inicio')} style={{ fontSize: '0.82rem', padding: '8px 16px' }}>← Volver</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {TIPOS_PLANIFICACION.map(tipo => (
              <div
                key={tipo.id}
                className={`tipo-card ${tipoPlan === tipo.id ? 'selected' : ''}`}
                onClick={() => { setTipoPlan(tipo.id); setPaso('formulario') }}
              >
                {tipo.popular && (
                  <span style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>
                    MÁS USADO
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: '1.8rem' }}>{tipo.icono}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1A2B56', fontSize: '0.95rem' }}>{tipo.titulo}</p>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: tipo.color + '18', color: tipo.color }}>
                      {tipo.badge}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.6 }}>{tipo.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASO 4: Formulario según tipo */}
      {paso === 'formulario' && tipoPlan && (
        <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: '2rem' }}>{TIPOS_PLANIFICACION.find(t => t.id === tipoPlan)?.icono}</span>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A2B56' }}>
                {TIPOS_PLANIFICACION.find(t => t.id === tipoPlan)?.titulo}
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>Completa los datos para generar tu planificación con IA</p>
            </div>
          </div>

          {/* Formulario Plan de Clase (el más usado) */}
          {tipoPlan === 'clase' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Tema de la clase *</label>
                <input className="input-field" placeholder="Ej: La célula y sus partes" />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Duración</label>
                <select className="input-field">
                  <option>Clase corta (30-45 min)</option>
                  <option>Clase estándar (60 min)</option>
                  <option>Bloque doble (90-120 min)</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Objetivo de aprendizaje *</label>
                <textarea className="input-field" rows={3} placeholder="¿Qué aprenderán los estudiantes al finalizar esta clase?" style={{ resize: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Tipo de evaluación</label>
                <select className="input-field">
                  <option>Diagnóstica</option>
                  <option>Formativa</option>
                  <option>Sumativa</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Instrumento de evaluación</label>
                <select className="input-field">
                  <option>Rúbrica</option>
                  <option>Lista de cotejo</option>
                  <option>Escala de estimación</option>
                  <option>Prueba escrita</option>
                  <option>Observación directa</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Nivel de detalle</label>
                <select className="input-field">
                  <option>Básico</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Estilo de salida</label>
                <select className="input-field">
                  <option>Formal institucional</option>
                  <option>Creativo</option>
                  <option>Simplificado</option>
                </select>
              </div>
            </div>
          )}

          {/* Formulario genérico para otros tipos */}
          {tipoPlan !== 'clase' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Título / Nombre *</label>
                <input className="input-field" placeholder="Nombre de la planificación" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Objetivo principal *</label>
                <textarea className="input-field" rows={3} placeholder="¿Qué se quiere lograr?" style={{ resize: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Duración</label>
                <input className="input-field" placeholder="Ej: 4 semanas, 1 periodo" />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Nivel de detalle</label>
                <select className="input-field">
                  <option>Básico</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Competencias / Estándares</label>
                <textarea className="input-field" rows={2} placeholder="Lista las competencias o estándares a trabajar" style={{ resize: 'none' }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-secondary" onClick={() => setPaso('tipo')}>← Volver</button>
            <button className="btn-primary">
              ⚡ Generar planificación con IA</button>
          <button
            onClick={() => exportarPlanificacionPDF(
              {
                titulo: "Mi planificación",
                materia: contexto.area || "Materia",
                grado: contexto.grado || "Grado",
                tema: "Tema de la clase",
              },
              "Docente"
            )}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "linear-gradient(135deg, #00A3FF, #8E2DE2)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.875rem",
              border: "none",
              borderRadius: 9,
              cursor: "pointer",
            }}
          >
            📄 Exportar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
