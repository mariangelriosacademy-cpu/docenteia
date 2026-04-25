'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearPrompt } from '@/lib/prompts/actions'
import Link from 'next/link'
import UsarPromptModal from '@/components/UsarPromptModal'

const CATEGORIAS = [
  'Planificación', 'Evaluación', 'Actividades',
  'Comunicación', 'Creatividad', 'Adaptaciones', 'Otro'
]

export default function NuevoPromptPage() {
  const router = useRouter()
  const [etiquetas, setEtiquetas] = useState<string[]>([])
  const [etiquetaInput, setEtiquetaInput] = useState('')
  const [esPublico, setEsPublico] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
const [promptActivo, setPromptActivo] = useState<any>(null)


  const agregarEtiqueta = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const nueva = etiquetaInput.trim()
      if (nueva && !etiquetas.includes(nueva)) {
        setEtiquetas([...etiquetas, nueva])
      }
      setEtiquetaInput('')
    }
  }

  const eliminarEtiqueta = (tag: string) => {
  setEtiquetas(etiquetas.filter(e => e !== tag))
}


const handleUsarPrompt = (prompt: any) => {
  setPromptActivo(prompt)
  setModalOpen(true)
}

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCargando(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    formData.set('etiquetas', etiquetas.join(','))
    formData.set('es_publico', String(esPublico))

    const result = await crearPrompt(formData)
    if (result?.error) {
      setError(result.error)
      setCargando(false)
    } else {
      router.push('/dashboard/prompts')
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .input-field { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; font-family: inherit; color: #1e293b; background: white; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.1); }
        .btn-primary { padding: 12px 28px; background: linear-gradient(135deg, #00A3FF, #8E2DE2); color: white; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; font-family: inherit; font-size: 0.95rem; transition: all 0.2s; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(0,163,255,0.1); color: #0369a1; border-radius: 999px; font-size: 0.78rem; font-weight: 600; }
        .tag-x { cursor: pointer; color: #00A3FF; font-weight: 800; }
        .tag-x:hover { color: #dc2626; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <Link href="/dashboard/prompts" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Volver
        </Link>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2B56', marginBottom: 2 }}>
            💡 Nuevo Prompt
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
            Crea un prompt pedagógico reutilizable
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb' }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Título */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Título *
            </label>
            <input className="input-field" name="titulo" required placeholder="Ej: Generador de rúbricas por competencias" />
          </div>

          {/* Descripción */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Descripción corta
            </label>
            <textarea className="input-field" name="descripcion" rows={2} placeholder="¿Para qué sirve este prompt?" style={{ resize: 'none' }} />
          </div>

          {/* Prompt texto */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Prompt completo *
            </label>
            <textarea
              className="input-field"
              name="prompt_texto"
              required
              rows={8}
              placeholder="Escribe el prompt completo aquí..."
              style={{ resize: 'vertical', fontFamily: "'Courier New', monospace", fontSize: '0.85rem', lineHeight: 1.6 }}
            />
            <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 4 }}>
              Usa [VARIABLE] para marcar los campos que el docente debe personalizar
            </p>
          </div>

          {/* Categoría */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Categoría *
            </label>
            <select className="input-field" name="categoria" required>
              <option value="">Selecciona una categoría</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Etiquetas */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Etiquetas
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', minHeight: 44 }}>
              {etiquetas.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <span className="tag-x" onClick={() => eliminarEtiqueta(tag)}>✕</span>
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
            <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 4 }}>
              Presiona Enter o coma para agregar
            </p>
          </div>

          {/* Es público */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#f8f9fa', borderRadius: 10 }}>
            <div
              onClick={() => setEsPublico(!esPublico)}
              style={{
                width: 44, height: 24, borderRadius: 999, cursor: 'pointer',
                background: esPublico ? 'linear-gradient(135deg, #00A3FF, #8E2DE2)' : '#d1d5db',
                position: 'relative', transition: 'all 0.2s', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: 2, left: esPublico ? 22 : 2,
                width: 20, height: 20, borderRadius: '50%', background: 'white',
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </div>
            <div>
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1A2B56', marginBottom: 2 }}>
                Compartir con la comunidad
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                Otros docentes podrán ver y usar este prompt
              </p>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <Link href="/dashboard/prompts" style={{
              padding: '11px 24px', background: 'transparent', color: '#1A2B56',
              fontWeight: 600, border: '2px solid #e5e7eb', borderRadius: 10,
              textDecoration: 'none', fontSize: '0.9rem',
            }}>
              Cancelar
            </Link>
            <button type="submit" className="btn-primary" disabled={cargando}>
              {cargando ? '⏳ Guardando...' : '💾 Guardar prompt'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
