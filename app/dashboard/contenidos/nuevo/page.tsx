'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { crearContenido } from '@/lib/contenidos/actions'

const TIPOS = ['Actividad', 'Evaluación', 'Guía', 'Presentación', 'Lectura', 'Juego', 'Otro']
const TIPOS_IA = [
  { valor: 'actividad',    label: '⚡ Actividad didáctica' },
  { valor: 'evaluacion',   label: '📝 Evaluación' },
  { valor: 'guia',         label: '📖 Guía de trabajo' },
  { valor: 'rubrica',      label: '📋 Rúbrica' },
  { valor: 'lista_cotejo', label: '✅ Lista de cotejo' },
]
const MATERIAS = [
  'Matemáticas', 'Estadística', 'Cálculo', 'Geometría',
  'Lenguaje y Literatura', 'Español', 'Comunicación', 'Lectura y Escritura',
  'Ciencias Naturales', 'Biología', 'Química', 'Física', 'Medio Ambiente',
  'Ciencias Sociales', 'Historia', 'Geografía', 'Economía', 'Filosofía',
  'Inglés', 'Francés', 'Portugués', 'Alemán', 'Otro idioma',
  'Arte y Música', 'Educación Artística', 'Tecnología e Informática',
  'Educación Física', 'Ética y Valores', 'Religión', 'Emprendimiento', 'Otra',
]
const NIVELES = ['Preescolar', 'Primaria (1°-3°)', 'Primaria (4°-5°)', 'Secundaria (6°-8°)', 'Secundaria (9°-11°)', 'Universidad', 'Todos los niveles']

export default function NuevoContenidoPage() {
  const router = useRouter()
  const [etiquetas, setEtiquetas]         = useState<string[]>([])
  const [etiquetaInput, setEtiquetaInput] = useState('')
  const [tabRecurso, setTabRecurso]       = useState<'archivo' | 'url'>('archivo')
  const [archivo, setArchivo]             = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragOver, setDragOver]           = useState(false)
  const [cargando, setCargando]           = useState(false)
  const [error, setError]                 = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Estados para IA
  const [mostrarIA, setMostrarIA]               = useState(false)
  const [tipoIA, setTipoIA]                     = useState('actividad')
  const [materiaIA, setMateriaIA]               = useState('')
  const [gradoIA, setGradoIA]                   = useState('')
  const [temaIA, setTemaIA]                     = useState('')
  const [instruccionesIA, setInstruccionesIA]   = useState('')
  const [generando, setGenerando]               = useState(false)
  const [contenidoGenerado, setContenidoGenerado] = useState('')
  const [errorIA, setErrorIA]                   = useState('')

  const agregarEtiqueta = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const nueva = etiquetaInput.trim()
      if (nueva && !etiquetas.includes(nueva)) setEtiquetas([...etiquetas, nueva])
      setEtiquetaInput('')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) validarYSetArchivo(file)
  }

  const validarYSetArchivo = (file: File) => {
  const TIPOS_PERMITIDOS = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ]
  const EXTENSIONES_PERMITIDAS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()

  if (!TIPOS_PERMITIDOS.includes(file.type) && !EXTENSIONES_PERMITIDAS.includes(extension)) {
    setError('Tipo no permitido. Solo PDF, DOC, DOCX, JPG, PNG.')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    setError(`El archivo pesa ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo 10MB.`)
    return
  }
  if (file.size === 0) {
    setError('El archivo está vacío.')
    return
  }
  setError('')
  if (file.type.startsWith('image/')) {
  setPreviewUrl(URL.createObjectURL(file))
} else {
  setPreviewUrl(null)
}
  setArchivo(file)
}

  async function generarConIA() {
    if (!temaIA) { setErrorIA('El tema es requerido'); return }
    setGenerando(true)
    setErrorIA('')
    setContenidoGenerado('')

    try {
      const response = await fetch('/api/generate-contenido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_contenido:          tipoIA,
          materia:                 materiaIA,
          grado:                   gradoIA,
          tema:                    temaIA,
          instrucciones_adicionales: instruccionesIA,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        setErrorIA(err.error || 'Error al generar')
        setGenerando(false)
        return
      }

      // Leer streaming
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let texto = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  texto += parsed.delta.text
                  setContenidoGenerado(texto)
                }
              } catch {}
            }
          }
        }
      }
    } catch (err) {
      setErrorIA('Error de conexión. Verifica tu API key.')
    }

    setGenerando(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCargando(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('etiquetas', etiquetas.join(','))

    // Si hay contenido generado por IA, agregarlo
    if (contenidoGenerado) {
      formData.set('contenido_texto', contenidoGenerado)
      formData.set('origen', 'ia')
    }

    if (tabRecurso === 'archivo' && archivo) {
      formData.set('archivo', archivo)
    } else {
      formData.delete('archivo')
    }

    if (tabRecurso === 'url') {
      formData.delete('archivo')
    } else {
      formData.delete('url_externa')
    }

    const result = await crearContenido(formData)
    if (result?.error) {
      setError(result.error)
      setCargando(false)
    } else {
      router.push('/dashboard/contenidos')
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .field-label { font-size: 0.78rem; font-weight: 600; color: #374151; display: block; margin-bottom: 6px; }
        .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; color: #1e293b; background: white; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.1); }
        .tab-btn { flex: 1; padding: 9px; border: 1.5px solid #e2e8f0; background: white; font-family: inherit; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .tab-btn.active { background: #1A2B56; color: white; border-color: #1A2B56; }
        .tag { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; background: #dbeafe; color: #1e40af; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .btn-primary { padding: 12px 28px; background: linear-gradient(135deg, #00A3FF, #8E2DE2); color: white; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 0.95rem; transition: all 0.2s; }
        .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .drop-zone { border: 2px dashed #d1d5db; border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; background: #f9fafb; }
        .drop-zone.over { border-color: #00A3FF; background: #eff6ff; }
        .drop-zone.filled { border-color: #00A3FF; background: #eff6ff; border-style: solid; }
        .ia-panel { background: linear-gradient(135deg, #0d0a2e, #1A2B56); border-radius: 14px; padding: 24px; margin-bottom: 24px; }
        .ia-input { width: 100%; padding: 10px 14px; border: 1.5px solid rgba(255,255,255,0.15); border-radius: 8px; font-size: 0.88rem; font-family: inherit; color: white; background: rgba(255,255,255,0.08); outline: none; transition: all 0.2s; }
        .ia-input:focus { border-color: #00A3FF; background: rgba(0,163,255,0.1); }
        .ia-input option { background: #1A2B56; }
        .ia-input::placeholder { color: rgba(255,255,255,0.35); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard/contenidos" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem' }}>← Volver</Link>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2B56', marginBottom: 2 }}>
              📁 Nuevo Contenido
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>Agrega un recurso a tu repositorio personal</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMostrarIA(!mostrarIA)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 18px',
            background: mostrarIA ? 'linear-gradient(135deg, #00A3FF, #8E2DE2)' : 'white',
            color: mostrarIA ? 'white' : '#1A2B56',
            border: `2px solid ${mostrarIA ? 'transparent' : '#e5e7eb'}`,
            borderRadius: 10, fontWeight: 700, fontSize: '0.875rem',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
          }}
        >
          🤖 {mostrarIA ? 'Ocultar IA' : 'Generar con IA'}
        </button>
      </div>

      {/* Panel de IA */}
      {mostrarIA && (
        <div className="ia-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00D2FF', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00D2FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Docenly IA · Generador de contenido
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Tipo de contenido
              </label>
              <select className="ia-input" value={tipoIA} onChange={e => setTipoIA(e.target.value)}>
                {TIPOS_IA.map(t => <option key={t.valor} value={t.valor}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Materia
              </label>
              <input className="ia-input" value={materiaIA} onChange={e => setMateriaIA(e.target.value)} placeholder="Ej: Ciencias Naturales" />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Grado / Nivel
              </label>
              <input className="ia-input" value={gradoIA} onChange={e => setGradoIA(e.target.value)} placeholder="Ej: 5° primaria" />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Tema *
              </label>
              <input className="ia-input" value={temaIA} onChange={e => setTemaIA(e.target.value)} placeholder="Ej: La fotosíntesis" required />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Instrucciones adicionales
            </label>
            <textarea
              className="ia-input"
              value={instruccionesIA}
              onChange={e => setInstruccionesIA(e.target.value)}
              rows={2}
              placeholder="Ej: Incluir trabajo en grupo, enfoque constructivista, para estudiantes con NEE..."
              style={{ resize: 'none' }}
            />
          </div>

          {errorIA && (
            <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '10px 14px', borderRadius: 8, fontSize: '0.82rem', marginBottom: 14 }}>
              ⚠️ {errorIA}
            </div>
          )}

          <button
            type="button"
            onClick={generarConIA}
            disabled={generando || !temaIA}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 24px',
              background: generando || !temaIA ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #00A3FF, #8E2DE2)',
              color: 'white', fontWeight: 700, fontSize: '0.9rem',
              border: 'none', borderRadius: 10, cursor: generando || !temaIA ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}
          >
            {generando ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Generando...
              </>
            ) : '⚡ Generar contenido con IA'}
          </button>

          {/* Contenido generado */}
          {contenidoGenerado && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00D2FF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ✅ Contenido generado — edita si necesitas
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(contenidoGenerado)}
                  style={{ fontSize: '0.72rem', color: '#00A3FF', background: 'rgba(0,163,255,0.1)', border: '1px solid rgba(0,163,255,0.3)', borderRadius: 6, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  📋 Copiar
                </button>
              </div>
              <textarea
                value={contenidoGenerado}
                onChange={e => setContenidoGenerado(e.target.value)}
                rows={14}
                style={{
                  width: '100%', padding: '14px', borderRadius: 10,
                  border: '1px solid rgba(0,163,255,0.3)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white', fontFamily: "'Courier New', monospace",
                  fontSize: '0.82rem', lineHeight: 1.7, resize: 'vertical', outline: 'none',
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Formulario principal */}
      <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb' }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Título */}
          <div>
            <label className="field-label">Título *</label>
            <input
              className="input-field"
              name="titulo"
              required
              placeholder="Ej: Guía de comprensión lectora - 3° primaria"
              defaultValue={temaIA ? `${TIPOS_IA.find(t => t.valor === tipoIA)?.label.split(' ').slice(1).join(' ')} - ${temaIA}` : ''}
            />
          </div>

          {/* Tipo + Materia */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="field-label">Tipo de contenido *</label>
              <select className="input-field" name="tipo" required>
                <option value="">Selecciona el tipo</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Materia *</label>
              <select className="input-field" name="materia" required>
                <option value="">Selecciona la materia</option>
                {MATERIAS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Nivel */}
          <div>
            <label className="field-label">Nivel educativo *</label>
            <select className="input-field" name="nivel" required>
              <option value="">Selecciona el nivel</option>
              {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="field-label">Descripción</label>
            <textarea className="input-field" name="descripcion" rows={3} placeholder="¿De qué trata este contenido? ¿Para qué sirve?" style={{ resize: 'none' }} />
          </div>

          {/* Tabs recurso */}
          <div>
            <label className="field-label">Recurso</label>
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1.5px solid #e2e8f0', marginBottom: 14 }}>
              <button type="button" className={`tab-btn ${tabRecurso === 'archivo' ? 'active' : ''}`}
                style={{ borderRadius: '6px 0 0 6px' }}
                onClick={() => setTabRecurso('archivo')}>
                📎 Subir archivo
              </button>
              <button type="button" className={`tab-btn ${tabRecurso === 'url' ? 'active' : ''}`}
                style={{ borderRadius: '0 6px 6px 0', borderLeft: 'none' }}
                onClick={() => setTabRecurso('url')}>
                🔗 URL externa
              </button>
            </div>

            {tabRecurso === 'archivo' ? (
              <div
                className={`drop-zone ${dragOver ? 'over' : ''} ${archivo ? 'filled' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  name="archivo"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) validarYSetArchivo(f) }}
                />
                {archivo ? (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                    <p style={{ fontWeight: 700, color: '#1A2B56', fontSize: '0.9rem' }}>{archivo.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 4 }}>{(archivo.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button type="button" onClick={e => { e.stopPropagation(); setArchivo(null) }}
                      style={{ marginTop: 8, fontSize: '0.75rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                      ✕ Quitar archivo
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📎</div>
                    <p style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Arrastra tu archivo o haz clic</p>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 6 }}>PDF, DOC, DOCX, JPG, PNG · Máximo 10MB</p>
                  </div>
                )}
              </div>
            ) : (
              <input className="input-field" name="url_externa" type="url" placeholder="https://youtube.com/... o https://drive.google.com/..." />
            )}
          </div>

          {/* Etiquetas */}
          <div>
            <label className="field-label">Etiquetas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, minHeight: 44 }}>
              {etiquetas.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <span style={{ cursor: 'pointer', fontWeight: 800 }} onClick={() => setEtiquetas(etiquetas.filter(e => e !== tag))}>✕</span>
                </span>
              ))}
              <input type="text" value={etiquetaInput} onChange={e => setEtiquetaInput(e.target.value)} onKeyDown={agregarEtiqueta}
                placeholder="Escribe y presiona Enter..."
                style={{ border: 'none', outline: 'none', fontSize: '0.85rem', minWidth: 160, flex: 1 }} />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="field-label">Notas adicionales</label>
            <textarea className="input-field" name="notas" rows={2} placeholder="Contexto de uso, observaciones, fuente..." style={{ resize: 'none', fontSize: '0.85rem' }} />
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <Link href="/dashboard/contenidos" style={{
              padding: '11px 24px', background: 'transparent', color: '#1A2B56',
              fontWeight: 600, border: '2px solid #e5e7eb', borderRadius: 10,
              textDecoration: 'none', fontSize: '0.9rem',
            }}>Cancelar</Link>
            <button type="submit" className="btn-primary" disabled={cargando}>
              {cargando ? '⏳ Guardando...' : contenidoGenerado ? '💾 Guardar contenido IA' : '💾 Guardar contenido'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}