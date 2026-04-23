const fs = require('fs')

const dir = './app/dashboard/planeacion/diaria'
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const content = `'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const materias = ['Matemáticas','Lengua y Literatura','Ciencias Naturales','Historia','Geografía','Arte','Educación Física','Inglés','Tecnología','Otra']
const grados = ['Preescolar','Primaria 1°','Primaria 2°','Primaria 3°','Primaria 4°','Primaria 5°','Primaria 6°','Secundaria 1°','Secundaria 2°','Secundaria 3°','Secundaria 4°','Secundaria 5°','Secundaria 6°','Bachillerato 1°','Bachillerato 2°','Bachillerato 3°','Universidad']
const duraciones = ['30 minutos','45 minutos','60 minutos','90 minutos','120 minutos']
const metodologias = ['Tradicional','Constructivista','Aprendizaje Basado en Proyectos','Gamificación','Aula Invertida','Montessori','Colaborativo']
const evaluaciones = ['Formativa','Sumativa','Mixta','Sin evaluación formal']
const recursosOpts = ['Proyector','Computadores','Tablets','Solo tablero','Material impreso','Videos','Laboratorio']
const momentos = ['Inicio de unidad','Desarrollo de unidad','Cierre de unidad','Repaso','Evaluación']

type Datos = {
  fecha: string
  materia: string
  grado: string
  tema: string
  momento: string
  objetivo: string
  duracion: string
  numEstudiantes: string
  inicio: string
  desarrollo: string
  cierre: string
  metodologia: string
  tipoEvaluacion: string
  recursos: string[]
  observaciones: string
}

const inicial: Datos = {
  fecha: new Date().toISOString().split('T')[0],
  materia: '', grado: '', tema: '', momento: '',
  objetivo: '', duracion: '', numEstudiantes: '',
  inicio: '', desarrollo: '', cierre: '',
  metodologia: '', tipoEvaluacion: '',
  recursos: [], observaciones: '',
}

const pasos = [
  { num: 1, titulo: 'Clase',      icono: '📚' },
  { num: 2, titulo: 'Desarrollo', icono: '🧩' },
  { num: 3, titulo: 'Evaluación', icono: '📝' },
]

export default function PlaneacionDiariaPage() {
  const router = useRouter()
  const [paso, setPaso]       = useState(1)
  const [datos, setDatos]     = useState<Datos>(inicial)
  const [errores, setErrores] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  function set(field: keyof Datos, value: string) {
    setDatos(prev => ({ ...prev, [field]: value }))
    setErrores([])
  }

  function toggleRecurso(r: string) {
    setDatos(prev => ({
      ...prev,
      recursos: prev.recursos.includes(r)
        ? prev.recursos.filter(x => x !== r)
        : [...prev.recursos, r]
    }))
  }

  function validar(): boolean {
    const errs: string[] = []
    if (paso === 1) {
      if (!datos.fecha)        errs.push('Selecciona la fecha de la clase')
      if (!datos.materia)      errs.push('Selecciona una materia')
      if (!datos.grado)        errs.push('Selecciona el grado')
      if (!datos.tema.trim())  errs.push('Escribe el tema de la clase')
      if (!datos.duracion)     errs.push('Selecciona la duración')
    }
    if (paso === 2) {
      if (!datos.objetivo.trim())   errs.push('Escribe el objetivo de aprendizaje')
      if (!datos.inicio.trim())     errs.push('Describe el momento de inicio')
      if (!datos.desarrollo.trim()) errs.push('Describe el desarrollo de la clase')
      if (!datos.cierre.trim())     errs.push('Describe el cierre de la clase')
    }
    if (paso === 3) {
      if (!datos.metodologia)    errs.push('Selecciona una metodología')
      if (!datos.tipoEvaluacion) errs.push('Selecciona el tipo de evaluación')
    }
    setErrores(errs)
    return errs.length === 0
  }

  function siguiente() { if (validar()) setPaso(p => Math.min(p + 1, 3)) }
  function anterior()  { setErrores([]); setPaso(p => Math.max(p - 1, 1)) }

  async function generar() {
    if (!validar()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    router.push('/dashboard/planeacion')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'Inter', sans-serif", paddingBottom: 60 }}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .lbl { display: block; font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .inp { width: 100%; padding: 11px 14px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 0.9rem; font-family: inherit; color: #111827; background: white; outline: none; transition: all 0.2s; }
        .inp:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.08); }
        .inp-sel { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
        .chip { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 999px; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.15s; border: 1.5px solid #e2e8f0; background: white; color: #4B5563; margin: 3px; }
        .chip.on { background: rgba(0,163,255,0.1); border-color: #00A3FF; color: #00A3FF; font-weight: 600; }
        .chip:hover { border-color: #00A3FF; }
        .btn-main { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 28px; background: linear-gradient(135deg,#00A3FF,#8E2DE2); color: white; font-weight: 700; font-size: 0.9rem; border: none; border-radius: 10px; cursor: pointer; font-family: inherit; transition: all 0.2s; box-shadow: 0 4px 16px rgba(0,163,255,0.25); }
        .btn-main:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-sec { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: white; color: #374151; font-weight: 600; font-size: 0.9rem; border: 1.5px solid #d1d5db; border-radius: 10px; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .btn-sec:hover { border-color: #00A3FF; color: #00A3FF; }
        .err-box { display: flex; align-items: flex-start; gap: 8px; padding: 10px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-size: 0.83rem; margin-top: 16px; }
        .campo { margin-bottom: 18px; }
        .step-circle { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 700; transition: all 0.3s; flex-shrink: 0; }
        .done   { background: linear-gradient(135deg,#00A3FF,#8E2DE2); color: white; }
        .active { background: white; border: 2px solid #00A3FF; color: #00A3FF; box-shadow: 0 0 0 4px rgba(0,163,255,0.1); }
        .next   { background: #f3f4f6; border: 2px solid #e2e8f0; color: #9CA3AF; }
        .momento-btn { flex: 1; padding: 10px 8px; border-radius: 8px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s; border: 1.5px solid #e2e8f0; background: white; color: #4B5563; text-align: center; font-family: inherit; }
        .momento-btn.on { background: rgba(0,163,255,0.1); border-color: #00A3FF; color: #00A3FF; }
        .momento-btn:hover { border-color: #00A3FF; }
        @keyframes spin { to { transform: rotate(360deg); } }
      \`}</style>

      {/* Top bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e8edf5', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, zIndex: 10 }}>
        <Link href="/dashboard/planeacion" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500 }}>← Planeación</Link>
        <span style={{ color: '#e2e8f0' }}>|</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>📅 Planificación Diaria con IA</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999, background: 'rgba(0,163,255,0.1)', color: '#00A3FF' }}>Plan del día</span>
      </div>

      <div style={{ maxWidth: 700, margin: '28px auto', padding: '0 20px' }}>

        {/* Pasos */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e8edf5', padding: '22px 28px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {pasos.map((p, i) => (
              <div key={p.num} style={{ display: 'flex', alignItems: 'center', flex: i < pasos.length - 1 ? 1 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div className={\`step-circle \${paso > p.num ? 'done' : paso === p.num ? 'active' : 'next'}\`}>
                    {paso > p.num ? '✓' : p.icono}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: paso === p.num ? 700 : 500, color: paso === p.num ? '#00A3FF' : paso > p.num ? '#111827' : '#9CA3AF', whiteSpace: 'nowrap' }}>{p.titulo}</span>
                </div>
                {i < pasos.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: paso > p.num ? 'linear-gradient(90deg,#00A3FF,#8E2DE2)' : '#e2e8f0', margin: '0 10px', marginBottom: 20, borderRadius: 999, transition: 'background 0.3s' }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, background: '#f3f4f6', borderRadius: 999, height: 5 }}>
            <div style={{ width: paso === 1 ? '10%' : paso === 2 ? '55%' : '100%', height: '100%', background: 'linear-gradient(90deg,#00A3FF,#8E2DE2)', borderRadius: 999, transition: 'width 0.4s ease' }} />
          </div>
          <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 6, textAlign: 'right' }}>Paso {paso} de 3</p>
        </div>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e8edf5', padding: '28px 32px', marginBottom: 20 }}>

          {/* PASO 1 */}
          {paso === 1 && (
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginBottom: 4 }}>📚 Información de la clase</h2>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 22 }}>Define los datos básicos de tu clase de hoy.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="campo">
                  <label className="lbl">Fecha de la clase *</label>
                  <input className="inp" type="date" value={datos.fecha} onChange={e => set('fecha', e.target.value)} />
                </div>
                <div className="campo">
                  <label className="lbl">Duración *</label>
                  <select className="inp inp-sel" value={datos.duracion} onChange={e => set('duracion', e.target.value)}>
                    <option value="">Selecciona</option>
                    {duraciones.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="campo">
                  <label className="lbl">Materia *</label>
                  <select className="inp inp-sel" value={datos.materia} onChange={e => set('materia', e.target.value)}>
                    <option value="">Selecciona</option>
                    {materias.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="campo">
                  <label className="lbl">Grado / Nivel *</label>
                  <select className="inp inp-sel" value={datos.grado} onChange={e => set('grado', e.target.value)}>
                    <option value="">Selecciona</option>
                    {grados.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="campo">
                <label className="lbl">Tema de la clase *</label>
                <input className="inp" type="text" value={datos.tema} onChange={e => set('tema', e.target.value)} placeholder="Ej: Fracciones equivalentes, La célula, La Revolución Francesa..." />
              </div>

              <div className="campo">
                <label className="lbl">Momento de la unidad</label>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                  {momentos.map(m => (
                    <button key={m} className={\`momento-btn \${datos.momento === m ? 'on' : ''}\`} onClick={() => set('momento', m)}>{m}</button>
                  ))}
                </div>
              </div>

              <div className="campo">
                <label className="lbl">Número de estudiantes</label>
                <select className="inp inp-sel" value={datos.numEstudiantes} onChange={e => set('numEstudiantes', e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="1-10">1 - 10</option>
                  <option value="11-20">11 - 20</option>
                  <option value="21-30">21 - 30</option>
                  <option value="más de 30">Más de 30</option>
                </select>
              </div>
            </div>
          )}

          {/* PASO 2 */}
          {paso === 2 && (
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginBottom: 4 }}>🧩 Estructura de la clase</h2>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 22 }}>Define los 3 momentos clave de tu clase.</p>

              <div className="campo">
                <label className="lbl">Objetivo de aprendizaje *</label>
                <textarea className="inp" value={datos.objetivo} onChange={e => set('objetivo', e.target.value)} placeholder="El estudiante será capaz de..." rows={3} style={{ resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div className="campo">
                <label className="lbl">🟢 Inicio / Motivación * <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(¿cómo captarás la atención?)</span></label>
                <textarea className="inp" value={datos.inicio} onChange={e => set('inicio', e.target.value)} placeholder="Ej: Pregunta generadora, video corto, experimento demostrativo, lluvia de ideas..." rows={3} style={{ resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div className="campo">
                <label className="lbl">🔵 Desarrollo * <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(actividades principales)</span></label>
                <textarea className="inp" value={datos.desarrollo} onChange={e => set('desarrollo', e.target.value)} placeholder="Ej: Explicación del concepto, trabajo en grupos, ejercicios guiados..." rows={4} style={{ resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div className="campo">
                <label className="lbl">🔴 Cierre * <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(¿cómo cerrarás la clase?)</span></label>
                <textarea className="inp" value={datos.cierre} onChange={e => set('cierre', e.target.value)} placeholder="Ej: Plenaria, reflexión, tarea, ticket de salida..." rows={3} style={{ resize: 'vertical', lineHeight: 1.6 }} />
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {paso === 3 && (
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', marginBottom: 4 }}>📝 Evaluación y recursos</h2>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 22 }}>Define cómo evaluarás y con qué recursos cuentas.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="campo">
                  <label className="lbl">Metodología *</label>
                  <select className="inp inp-sel" value={datos.metodologia} onChange={e => set('metodologia', e.target.value)}>
                    <option value="">Selecciona</option>
                    {metodologias.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="campo">
                  <label className="lbl">Tipo de evaluación *</label>
                  <select className="inp inp-sel" value={datos.tipoEvaluacion} onChange={e => set('tipoEvaluacion', e.target.value)}>
                    <option value="">Selecciona</option>
                    {evaluaciones.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div className="campo">
                <label className="lbl">Recursos disponibles <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(opcional)</span></label>
                <div style={{ marginTop: 6 }}>
                  {recursosOpts.map(r => (
                    <span key={r} className={\`chip \${datos.recursos.includes(r) ? 'on' : ''}\`} onClick={() => toggleRecurso(r)}>{r}</span>
                  ))}
                </div>
              </div>

              <div className="campo">
                <label className="lbl">Observaciones adicionales <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(opcional)</span></label>
                <textarea className="inp" value={datos.observaciones} onChange={e => set('observaciones', e.target.value)} placeholder="Estudiantes con necesidades especiales, contexto del grupo, notas importantes..." rows={3} style={{ resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              {/* Resumen */}
              <div style={{ background: 'linear-gradient(135deg, rgba(0,163,255,0.05), rgba(142,45,226,0.05))', border: '1px solid rgba(0,163,255,0.15)', borderRadius: 10, padding: '16px 20px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#00A3FF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>📋 Resumen de tu planificación</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[
                    ['Fecha', datos.fecha],
                    ['Materia', datos.materia],
                    ['Grado', datos.grado],
                    ['Tema', datos.tema],
                    ['Duración', datos.duracion],
                    ['Metodología', datos.metodologia],
                  ].map(([k, v]) => v ? (
                    <div key={k}>
                      <span style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 500 }}>{k}: </span>
                      <span style={{ fontSize: '0.78rem', color: '#111827', fontWeight: 600 }}>{v}</span>
                    </div>
                  ) : null)}
                </div>
              </div>
            </div>
          )}

          {errores.length > 0 && (
            <div className="err-box">
              <span>⚠️</span>
              <div>{errores.map(e => <p key={e}>{e}</p>)}</div>
            </div>
          )}
        </div>

        {/* Navegación */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {paso > 1 && <button className="btn-sec" onClick={anterior}>← Anterior</button>}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/dashboard/planeacion" style={{ fontSize: '0.82rem', color: '#9CA3AF', textDecoration: 'none', fontWeight: 500 }}>Cancelar</Link>
            {paso < 3 ? (
              <button className="btn-main" onClick={siguiente}>Siguiente →</button>
            ) : (
              <button className="btn-main" onClick={generar} disabled={loading} style={{ padding: '12px 32px' }}>
                {loading ? (
                  <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Generando…</>
                ) : <>⚡ Generar planificación con IA</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}`

fs.writeFileSync('./app/dashboard/planeacion/diaria/page.tsx', content, 'utf8')
console.log('✅ Planificación Diaria creada!')