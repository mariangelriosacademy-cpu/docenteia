'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { crearContenido } from '@/lib/contenidos/actions'

const TIPOS = ['Actividad', 'Evaluación', 'Guía', 'Presentación', 'Lectura', 'Juego', 'Otro']
const MATERIAS = [
  // Ciencias básicas
  'Matemáticas', 'Estadística', 'Cálculo', 'Geometría',
  // Lenguaje
  'Lenguaje y Literatura', 'Español', 'Comunicación', 'Lectura y Escritura',
  // Ciencias
  'Ciencias Naturales', 'Biología', 'Química', 'Física', 'Medio Ambiente',
  // Sociales
  'Ciencias Sociales', 'Historia', 'Geografía', 'Economía', 'Filosofía', 'Política',
  // Idiomas
  'Inglés', 'Francés', 'Portugués', 'Alemán', 'Otro idioma',
  // Artes y tecnología
  'Arte y Música', 'Educación Artística', 'Música', 'Tecnología e Informática',
  // Otras
  'Educación Física', 'Ética y Valores', 'Religión', 'Emprendimiento',
  'Otra',
]
const NIVELES = ['Preescolar', 'Primaria (1°-3°)', 'Primaria (4°-5°)', 'Secundaria (6°-8°)', 'Secundaria (9°-11°)', 'Universidad', 'Todos los niveles']

const ICONOS_TIPO: Record<string, string> = {
  'Actividad':     '⭐',
  'Evaluación':    '📋',
  'Guía':          '📖',
  'Presentación':  '📊',
  'Lectura':       '📚',
  'Juego':         '🎮',
  'Otro':          '📁',
}

export default function NuevoContenidoPage() {
  const router = useRouter()
  const [etiquetas, setEtiquetas]         = useState<string[]>([])
  const [etiquetaInput, setEtiquetaInput] = useState('')
  const [tabRecurso, setTabRecurso]       = useState<'archivo' | 'url'>('archivo')
  const [archivo, setArchivo]             = useState<File | null>(null)
  const [dragOver, setDragOver]           = useState(false)
  const [cargando, setCargando]           = useState(false)
  const [error, setError]                 = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [materiaOtra, setMateriaOtra] = useState(false)

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
    const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
    if (!tiposPermitidos.includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo PDF, DOC, DOCX, JPG, PNG.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo no puede superar 10MB.')
      return
    }
    setError('')
    setArchivo(file)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCargando(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)
    formData.set('etiquetas', etiquetas.join(','))

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

    console.log('Enviando formData...')
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
        .input-field:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,0.1); }
        .tab-btn { flex: 1; padding: 9px; border: 1.5px solid #e2e8f0; background: white; font-family: inherit; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .tab-btn.active { background: #059669; color: white; border-color: #059669; }
        .tag { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; background: #d1fae5; color: #065f46; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .btn-primary { padding: 12px 28px; background: linear-gradient(135deg, #059669, #0d9488); color: white; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 0.95rem; transition: all 0.2s; }
        .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .drop-zone { border: 2px dashed #d1d5db; border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; background: #f9fafb; }
        .drop-zone.over { border-color: #059669; background: #d1fae5; }
        .drop-zone.filled { border-color: #059669; background: #ecfdf5; border-style: solid; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <Link href="/dashboard/contenidos" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem' }}>← Volver</Link>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2B56', marginBottom: 2 }}>
            📁 Nuevo Contenido
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>Agrega un recurso a tu repositorio personal</p>
        </div>
      </div>

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
            <input className="input-field" name="titulo" required placeholder="Ej: Guía de comprensión lectora - 3° primaria" />
          </div>

          {/* Tipo + Materia */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="field-label">Tipo de contenido *</label>
              <select className="input-field" name="tipo" required>
  <option value="">Selecciona el tipo</option>
  {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
</select>
{materiaOtra && (
  <input
    className="input-field"
    name="materia_personalizada"
    placeholder="Escribe la materia..."
    style={{ marginTop: 8 }}
    required
  />
)}
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
                onClick={() => { setTabRecurso('archivo'); setTimeout(() => fileRef.current?.click(), 100) }}>
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
                    <p style={{ fontWeight: 700, color: '#065f46', fontSize: '0.9rem' }}>{archivo.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 4 }}>
                      {(archivo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button type="button" onClick={e => { e.stopPropagation(); setArchivo(null) }}
                      style={{ marginTop: 8, fontSize: '0.75rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                      ✕ Quitar archivo
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📎</div>
                    <p style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>
                      Arrastra tu archivo aquí o haz clic para seleccionar
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 6 }}>
                      PDF, DOC, DOCX, JPG, PNG · Máximo 10MB
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <input
                className="input-field"
                name="url_externa"
                type="url"
                placeholder="https://youtube.com/watch?v=... o https://drive.google.com/..."
              />
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
              <input
                type="text"
                value={etiquetaInput}
                onChange={e => setEtiquetaInput(e.target.value)}
                onKeyDown={agregarEtiqueta}
                placeholder="Escribe y presiona Enter..."
                style={{ border: 'none', outline: 'none', fontSize: '0.85rem', minWidth: 160, flex: 1 }}
              />
            </div>
            <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 4 }}>Presiona Enter o coma para agregar</p>
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
              {cargando ? '⏳ Guardando...' : '💾 Guardar contenido'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}