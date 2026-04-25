'use client'
import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'

interface Props {
  isOpen:   boolean
  onClose:  () => void
  prompt: {
    titulo:       string
    prompt_texto: string
  } | null
}

// Detecta variables en formato [VARIABLE]
function detectarVariables(texto: string): string[] {
  const matches = texto.match(/\[([A-ZÁÉÍÓÚÑ_\s]+)\]/g)
  if (!matches) return []
  return [...new Set(matches.map(m => m.slice(1, -1)))]
}

// Reemplaza variables en el texto
function reemplazarVariables(
  texto: string,
  valores: Record<string, string>
): string {
  let resultado = texto
  Object.entries(valores).forEach(([variable, valor]) => {
    if (valor) {
      resultado = resultado.replaceAll(`[${variable}]`, valor)
    }
  })
  return resultado
}

export default function UsarPromptModal({ isOpen, onClose, prompt }: Props) {
  const [textoPrompt,  setTextoPrompt]  = useState('')
  const [variables,    setVariables]    = useState<string[]>([])
  const [valores,      setValores]      = useState<Record<string, string>>({})
  const [textoPrevio,  setTextoPrevio]  = useState('')
  const [respuesta,    setRespuesta]    = useState('')
  const [cargando,     setCargando]     = useState(false)
  const [copiado,      setCopiado]      = useState(false)
  const [guardado,     setGuardado]     = useState(false)
  const [error,        setError]        = useState('')

  // Inicializar cuando cambia el prompt
  useEffect(() => {
    if (prompt && isOpen) {
      setTextoPrompt(prompt.prompt_texto)
      setTextoPrevio(prompt.prompt_texto)
      const vars = detectarVariables(prompt.prompt_texto)
      setVariables(vars)
      setValores({})
      setRespuesta('')
      setError('')
      setCopiado(false)
      setGuardado(false)
    }
  }, [prompt, isOpen])

  // Actualizar preview en tiempo real
  const textoFinal = useCallback(
    () => reemplazarVariables(textoPrompt, valores),
    [textoPrompt, valores]
  )

  const handleValorChange = (variable: string, valor: string) => {
    setValores(prev => ({ ...prev, [variable]: valor }))
  }

  // Llamar a Claude
  const handleGenerar = async () => {
    const promptFinal = textoFinal()
    if (!promptFinal.trim()) return

    setCargando(true)
    setRespuesta('')
    setError('')

    try {
      const res = await fetch('/api/usar-prompt', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ prompt: promptFinal }),
      })

      if (!res.ok) throw new Error('Error al generar la respuesta')

      const data = await res.json()
      setRespuesta(data.respuesta || '')
    } catch (err) {
      setError('Hubo un error al generar. Inténtalo de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  // Copiar respuesta
  const handleCopiar = async () => {
    await navigator.clipboard.writeText(respuesta)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  // Guardar como contenido
  const handleGuardar = async () => {
    try {
      await fetch('/api/contenidos/guardar', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          titulo:          `Resultado: ${prompt?.titulo}`,
          tipo:            'actividad',
          descripcion:     `Generado con el prompt: ${prompt?.titulo}`,
          contenido_texto: respuesta,
          origen:          'ia',
        }),
      })
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2000)
    } catch {
      setError('Error al guardar el contenido.')
    }
  }

  if (!isOpen || !prompt) return null

  return (
    <div
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          9999,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '16px',
        background:      'rgba(10,8,40,0.75)',
        backdropFilter:  'blur(6px)',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width:           '100%',
        maxWidth:        720,
        maxHeight:       '90vh',
        overflowY:       'auto',
        background:      'white',
        borderRadius:    20,
        boxShadow:       '0 24px 80px rgba(0,0,0,0.3)',
        fontFamily:      "'Inter', sans-serif",
      }}>

        {/* Header */}
        <div style={{
          background:    'linear-gradient(135deg, #0d0a2e 0%, #1A2B56 100%)',
          padding:       '20px 24px',
          borderRadius:  '20px 20px 0 0',
          display:       'flex',
          alignItems:    'flex-start',
          justifyContent:'space-between',
          gap:           16,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00D2FF' }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#00D2FF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Docenly IA · Usar Prompt
              </span>
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
              {prompt.titulo}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: 'white', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '24px' }}>

          {/* Variables dinámicas */}
          {variables.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00A3FF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
                Rellena las variables del prompt
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                {variables.map(variable => (
                  <div key={variable}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#1A2B56', marginBottom: 5 }}>
                      {variable}
                    </label>
                    <input
                      type="text"
                      value={valores[variable] || ''}
                      onChange={e => handleValorChange(variable, e.target.value)}
                      placeholder={`Ej: ${variable === 'MATERIA' ? 'Matemáticas' : variable === 'GRADO' ? '5to grado' : variable === 'TEMA' ? 'Fracciones' : '...'}`}
                      style={{
                        width:        '100%',
                        padding:      '9px 12px',
                        border:       '1.5px solid #e2e8f0',
                        borderRadius: 8,
                        fontSize:     '0.875rem',
                        color:        '#1A2B56',
                        outline:      'none',
                        fontFamily:   'inherit',
                        transition:   'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#00A3FF'}
                      onBlur={e  => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Textarea del prompt */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Texto del prompt {variables.length > 0 ? '(con variables reemplazadas)' : '(editable)'}
              </p>
              <button
                onClick={() => setTextoPrompt(prompt.prompt_texto)}
                style={{ fontSize: '0.72rem', color: '#00A3FF', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                ↺ Restaurar original
              </button>
            </div>
            <textarea
              value={variables.length > 0 ? textoFinal() : textoPrompt}
              onChange={e => {
                if (variables.length === 0) setTextoPrompt(e.target.value)
              }}
              readOnly={variables.length > 0}
              rows={6}
              style={{
                width:        '100%',
                padding:      '12px 14px',
                border:       '1.5px solid #e2e8f0',
                borderRadius: 10,
                fontSize:     '0.875rem',
                color:        '#1A2B56',
                background:   variables.length > 0 ? '#F8F9FA' : 'white',
                outline:      'none',
                fontFamily:   'inherit',
                resize:       'vertical',
                lineHeight:   1.7,
              }}
            />
          </div>

          {/* Botón generar */}
          <button
            onClick={handleGenerar}
            disabled={cargando}
            style={{
              width:         '100%',
              padding:       '13px',
              background:    cargando ? 'rgba(0,163,255,0.4)' : 'linear-gradient(135deg, #00A3FF 0%, #8E2DE2 100%)',
              color:         'white',
              fontWeight:    700,
              fontSize:      '0.95rem',
              border:        'none',
              borderRadius:  10,
              cursor:        cargando ? 'not-allowed' : 'pointer',
              fontFamily:    'inherit',
              boxShadow:     cargando ? 'none' : '0 4px 20px rgba(0,163,255,0.3)',
              transition:    'all 0.2s',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              gap:           8,
              marginBottom:  20,
            }}
          >
            {cargando ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Generando con IA...
              </>
            ) : (
              '⚡ Generar con IA'
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {/* Error */}
          {error && (
            <div style={{ padding: '12px 14px', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 8, color: '#BE123C', fontSize: '0.875rem', marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Respuesta */}
          {respuesta && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#00A3FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Respuesta de Docenly IA
                </p>
              </div>

              {/* Contenido markdown */}
              <div style={{
                background:   '#F8F9FA',
                border:       '1px solid #e2e8f0',
                borderRadius: 12,
                padding:      '16px 20px',
                marginBottom: 14,
                fontSize:     '0.9rem',
                color:        '#1A2B56',
                lineHeight:   1.75,
              }}>
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A2B56', marginBottom: 10, marginTop: 16 }}>{children}</h1>,
                    h2: ({children}) => <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1A2B56', marginBottom: 8, marginTop: 14 }}>{children}</h2>,
                    h3: ({children}) => <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00A3FF', marginBottom: 6, marginTop: 12 }}>{children}</h3>,
                    p:  ({children}) => <p style={{ marginBottom: 10, color: '#374151', lineHeight: 1.75 }}>{children}</p>,
                    ul: ({children}) => <ul style={{ paddingLeft: 20, marginBottom: 10 }}>{children}</ul>,
                    ol: ({children}) => <ol style={{ paddingLeft: 20, marginBottom: 10 }}>{children}</ol>,
                    li: ({children}) => <li style={{ marginBottom: 4, color: '#374151' }}>{children}</li>,
                    strong: ({children}) => <strong style={{ color: '#1A2B56', fontWeight: 700 }}>{children}</strong>,
                    code: ({children}) => <code style={{ background: '#E8F0FE', color: '#1A2B56', padding: '2px 6px', borderRadius: 4, fontSize: '0.82rem', fontFamily: 'monospace' }}>{children}</code>,
                    blockquote: ({children}) => <blockquote style={{ borderLeft: '3px solid #00A3FF', paddingLeft: 12, color: '#6B7280', fontStyle: 'italic', margin: '10px 0' }}>{children}</blockquote>,
                  }}
                >
                  {respuesta}
                </ReactMarkdown>
              </div>

              {/* Botones de acción */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={handleCopiar}
                  style={{
                    flex:          1,
                    minWidth:      120,
                    padding:       '10px 16px',
                    background:    copiado ? '#dcfce7' : 'white',
                    color:         copiado ? '#16a34a' : '#1A2B56',
                    border:        `1.5px solid ${copiado ? '#86efac' : '#e2e8f0'}`,
                    borderRadius:  8,
                    fontWeight:    600,
                    fontSize:      '0.85rem',
                    cursor:        'pointer',
                    fontFamily:    'inherit',
                    transition:    'all 0.2s',
                  }}
                >
                  {copiado ? '✅ Copiado' : '📋 Copiar todo'}
                </button>

                <button
                  onClick={handleGuardar}
                  style={{
                    flex:          1,
                    minWidth:      160,
                    padding:       '10px 16px',
                    background:    guardado ? '#dcfce7' : 'linear-gradient(135deg, #1A2B56, #2A65C9)',
                    color:         guardado ? '#16a34a' : 'white',
                    border:        guardado ? '1.5px solid #86efac' : 'none',
                    borderRadius:  8,
                    fontWeight:    600,
                    fontSize:      '0.85rem',
                    cursor:        'pointer',
                    fontFamily:    'inherit',
                    transition:    'all 0.2s',
                  }}
                >
                  {guardado ? '✅ Guardado' : '💾 Guardar como contenido'}
                </button>

                <button
                  onClick={() => { setRespuesta(''); setError('') }}
                  style={{
                    padding:    '10px 16px',
                    background: 'transparent',
                    color:      '#6B7280',
                    border:     '1.5px solid #e2e8f0',
                    borderRadius: 8,
                    fontWeight:  600,
                    fontSize:   '0.85rem',
                    cursor:     'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  ↺ Nueva respuesta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}