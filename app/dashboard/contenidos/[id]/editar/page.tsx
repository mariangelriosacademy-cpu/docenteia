'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const TIPOS = ['Actividad', 'Evaluación', 'Guía', 'Presentación', 'Lectura', 'Juego', 'Otro']
const MATERIAS = [
  'Matemáticas', 'Estadística', 'Cálculo', 'Geometría',
  'Lenguaje y Literatura', 'Español', 'Comunicación', 'Lectura y Escritura',
  'Ciencias Naturales', 'Biología', 'Química', 'Física', 'Medio Ambiente',
  'Ciencias Sociales', 'Historia', 'Geografía', 'Economía', 'Filosofía', 'Política',
  'Inglés', 'Francés', 'Portugués', 'Alemán', 'Otro idioma',
  'Arte y Música', 'Educación Artística', 'Música', 'Tecnología e Informática',
  'Educación Física', 'Ética y Valores', 'Religión', 'Emprendimiento',
  'Otra',
]
const NIVELES = ['Preescolar', 'Primaria (1°-3°)', 'Primaria (4°-5°)', 'Secundaria (6°-8°)', 'Secundaria (9°-11°)', 'Universidad', 'Todos los niveles']

export default function EditarContenidoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [titulo, setTitulo]           = useState('')
  const [tipo, setTipo]               = useState('')
  const [materia, setMateria]         = useState('')
  const [materiaOtra, setMateriaOtra] = useState(false)
  const [materiaCustom, setMateriaCustom] = useState('')
  const [nivel, setNivel]             = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [notas, setNotas]             = useState('')
  const [etiquetas, setEtiquetas]     = useState<string[]>([])
  const [etiquetaInput, setEtiquetaInput] = useState('')
  const [urlExterna, setUrlExterna]   = useState('')
  const [archivoActual, setArchivoActual] = useState<string | null>(null)
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null)
  const [nuevoArchivo, setNuevoArchivo]   = useState<File | null>(null)
  const [tabRecurso, setTabRecurso]   = useState<'archivo' | 'url'>('archivo')
  const [dragOver, setDragOver]       = useState(false)
  const [cargando, setCargando]       = useState(true)
  const [guardando, setGuardando]     = useState(false)
  const [error, setError]             = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  useEffect(() => { cargarContenido() }, [id])

  async function cargarContenido() {
    const { data } = await supabase
      .from('contenidos')
      .select('*')
      .eq('id', id)
      .single()

    if (data) {
      setTitulo(data.titulo || '')
      setTipo(data.tipo || '')
      setNivel(data.nivel || '')
      setDescripcion(data.descripcion || '')
      setNotas(data.notas || '')
      setEtiquetas(data.etiquetas || [])
      setUrlExterna(data.url_externa || '')
      setArchivoActual(data.archivo_url || null)
      setArchivoNombre(data.archivo_nombre || null)

      // Verificar si la materia es personalizada
      if (data.materia && !MATERIAS.includes(data.materia)) {
        setMateria('Otra')
        setMateriaOtra(true)
        setMateriaCustom(data.materia)
      } else {
        setMateria(data.materia || '')
      }

      if (data.url_externa) setTabRecurso('url')
      else if (data.archivo_url) setTabRecurso('archivo')
    }
    setCargando(false)
  }

  const agregarEtiqueta = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const nueva = etiquetaInput.trim()
      if (nueva && !etiquetas.includes(nueva)) setEtiquetas([...etiquetas, nueva])
      setEtiquetaInput('')
    }
  }

  const validarYSetArchivo = (file: File) => {
    const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
    if (!tiposPermitidos.includes(file.type)) { setError('Tipo no permitido. Solo PDF, DOC, DOCX, JPG, PNG.'); return }
    if (file.size > 10 * 1024 * 1024) { setError('El archivo no puede superar 10MB.'); return }
    setError('')
    setNuevoArchivo(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setError('')

    const materiaFinal = materiaOtra ? materiaCustom : materia
    let archivo_url = archivoActual
    let archivo_nombre = archivoNombre
    let archivo_tipo = null

    // Subir nuevo archivo si existe
    if (nuevoArchivo) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const extension = nuevoArchivo.name.split('.').pop()
      const nombreArchivo = `${user.id}/${Date.now()}.${extension}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('contenidos')
        .upload(nombreArchivo, nuevoArchivo, { contentType: nuevoArchivo.type })

      if (uploadError) { setError(`Error al subir archivo: ${uploadError.message}`); setGuardando(false); return }

      const { data: urlData } = supabase.storage.from('contenidos').getPublicUrl(uploadData.path)
      archivo_url    = urlData.publicUrl
      archivo_nombre = nuevoArchivo.name
      archivo_tipo   = nuevoArchivo.type
    }

    const { error: updateError } = await supabase
      .from('contenidos')
      .update({
        titulo,
        tipo,
        materia:      materiaFinal,
        nivel,
        descripcion,
        notas,
        etiquetas,
        url_externa:   tabRecurso === 'url' ? urlExterna : null,
        archivo_url:   tabRecurso === 'archivo' ? archivo_url : null,
        archivo_nombre: tabRecurso === 'archivo' ? archivo_nombre : null,
        archivo_tipo:  tabRecurso === 'archivo' ? archivo_tipo : null,
        updated_at:    new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) { setError(updateError.message); setGuardando(false); return }

    router.push('/dashboard/contenidos')
  }

  if (cargando) return (
    <div style={{ textAlign: 'center', padding: 64, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
      Cargando contenido...
    </div>
  )

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
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .drop-zone { border: 2px dashed #d1d5db; border-radius: 12px; padding: 28px; text-align: center; cursor: pointer; transition: all 0.2s; background: #f9fafb; }
        .drop-zone.over { border-color: #059669; background: #d1fae5; }
        .drop-zone.filled { border-color: #059669; background: #ecfdf5; border-style: solid; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <Link href="/dashboard/contenidos" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem' }}>← Volver</Link>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2B56', marginBottom: 2 }}>✏️ Editar Contenido</h1>
          <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>Modifica los datos de tu recurso</p>
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
            <input className="input-field" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          </div>

          {/* Tipo + Materia */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="field-label">Tipo *</label>
              <select className="input-field" value={tipo} onChange={e => setTipo(e.target.value)} required>
                <option value="">Selecciona</option>
                {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Materia *</label>
              <select className="input-field" value={materia}
                onChange={e => { setMateria(e.target.value); setMateriaOtra(e.target.value === 'Otra') }} required>
                <option value="">Selecciona</option>
                {MATERIAS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {materiaOtra && (
                <input className="input-field" value={materiaCustom}
                  onChange={e => setMateriaCustom(e.target.value)}
                  placeholder="Escribe la materia..." style={{ marginTop: 8 }} required />
              )}
            </div>
          </div>

          {/* Nivel */}
          <div>
            <label className="field-label">Nivel *</label>
            <select className="input-field" value={nivel} onChange={e => setNivel(e.target.value)} required>
              <option value="">Selecciona</option>
              {NIVELES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="field-label">Descripción</label>
            <textarea className="input-field" value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} style={{ resize: 'none' }} />
          </div>

          {/* Tabs recurso */}
          <div>
            <label className="field-label">Recurso</label>
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1.5px solid #e2e8f0', marginBottom: 14 }}>
              <button type="button" className={`tab-btn ${tabRecurso === 'archivo' ? 'active' : ''}`}
                style={{ borderRadius: '6px 0 0 6px' }} onClick={() => setTabRecurso('archivo')}>
                📎 Subir archivo
              </button>
              <button type="button" className={`tab-btn ${tabRecurso === 'url' ? 'active' : ''}`}
                style={{ borderRadius: '0 6px 6px 0', borderLeft: 'none' }} onClick={() => setTabRecurso('url')}>
                🔗 URL externa
              </button>
            </div>

            {tabRecurso === 'archivo' ? (
              <div
                className={`drop-zone ${dragOver ? 'over' : ''} ${nuevoArchivo || archivoActual ? 'filled' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) validarYSetArchivo(f) }}
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) validarYSetArchivo(f) }} />
                {nuevoArchivo ? (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                    <p style={{ fontWeight: 700, color: '#065f46', fontSize: '0.9rem' }}>{nuevoArchivo.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 4 }}>{(nuevoArchivo.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button type="button" onClick={e => { e.stopPropagation(); setNuevoArchivo(null) }}
                      style={{ marginTop: 8, fontSize: '0.75rem', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                      ✕ Quitar
                    </button>
                  </div>
                ) : archivoActual ? (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>📎</div>
                    <p style={{ fontWeight: 600, color: '#065f46', fontSize: '0.85rem' }}>{archivoNombre || 'Archivo actual'}</p>
                    <p style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: 4 }}>Haz clic para reemplazar</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📎</div>
                    <p style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Arrastra o haz clic para seleccionar</p>
                    <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 6 }}>PDF, DOC, DOCX, JPG, PNG · Máximo 10MB</p>
                  </div>
                )}
              </div>
            ) : (
              <input className="input-field" type="url" value={urlExterna}
                onChange={e => setUrlExterna(e.target.value)}
                placeholder="https://youtube.com/... o https://drive.google.com/..." />
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
              <input type="text" value={etiquetaInput} onChange={e => setEtiquetaInput(e.target.value)}
                onKeyDown={agregarEtiqueta} placeholder="Escribe y presiona Enter..."
                style={{ border: 'none', outline: 'none', fontSize: '0.85rem', minWidth: 160, flex: 1 }} />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="field-label">Notas adicionales</label>
            <textarea className="input-field" value={notas} onChange={e => setNotas(e.target.value)}
              rows={2} style={{ resize: 'none', fontSize: '0.85rem' }} />
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <Link href="/dashboard/contenidos" style={{
              padding: '11px 24px', background: 'transparent', color: '#1A2B56',
              fontWeight: 600, border: '2px solid #e5e7eb', borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem',
            }}>Cancelar</Link>
            <button type="submit" className="btn-primary" disabled={guardando}>
              {guardando ? '⏳ Guardando...' : '💾 Guardar cambios'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}