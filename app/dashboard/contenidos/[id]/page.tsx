import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { eliminarContenido, duplicarContenido } from '@/lib/contenidos/actions'

const ICONOS_TIPO: Record<string, string> = {
  'Actividad':    '⭐',
  'Evaluación':   '📋',
  'Guía':         '📖',
  'Presentación': '📊',
  'Lectura':      '📚',
  'Juego':        '🎮',
  'Otro':         '📁',
}

const COLORES_TIPO: Record<string, { bg: string; color: string }> = {
  'Actividad':    { bg: '#fef9c3', color: '#854d0e' },
  'Evaluación':   { bg: '#ede9fe', color: '#5b21b6' },
  'Guía':         { bg: '#d1fae5', color: '#065f46' },
  'Presentación': { bg: '#dbeafe', color: '#1e40af' },
  'Lectura':      { bg: '#fce7f3', color: '#9d174d' },
  'Juego':        { bg: '#ffedd5', color: '#9a3412' },
  'Otro':         { bg: '#f3f4f6', color: '#374151' },
}

export default async function DetalleContenidoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: contenido } = await supabase
    .from('contenidos')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!contenido) notFound()

  const colores = COLORES_TIPO[contenido.tipo] || COLORES_TIPO['Otro']
  const icono   = ICONOS_TIPO[contenido.tipo] || '📁'

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })

  // URL firmada para descarga segura
  let urlDescarga: string | null = null
  if (contenido.archivo_url) {
    const path = contenido.archivo_url.split('/contenidos/')[1]
    if (path) {
      const { data } = await supabase.storage
        .from('contenidos')
        .createSignedUrl(path, 3600)
      urlDescarga = data?.signedUrl || contenido.archivo_url
    } else {
      urlDescarga = contenido.archivo_url
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .btn-action { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.15s; text-decoration: none; font-family: inherit; border: none; }
        .prose p { margin-bottom: 12px; line-height: 1.75; color: #374151; }
        .prose h1, .prose h2, .prose h3 { color: #1A2B56; font-weight: 700; margin: 20px 0 10px; }
        .prose ul, .prose ol { padding-left: 20px; margin-bottom: 12px; }
        .prose li { margin-bottom: 6px; color: #374151; line-height: 1.6; }
        .prose code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; }
        .prose pre { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; margin-bottom: 12px; }
        .prose strong { color: #1A2B56; font-weight: 700; }
        .prose blockquote { border-left: 3px solid #059669; padding-left: 16px; color: #6B7280; font-style: italic; margin: 16px 0; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: '0.82rem', color: '#9CA3AF' }}>
        <Link href="/dashboard" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Inicio</Link>
        <span>›</span>
        <Link href="/dashboard/contenidos" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Mis Contenidos</Link>
        <span>›</span>
        <span style={{ color: '#374151', fontWeight: 500 }}>{contenido.titulo}</span>
      </div>

      {/* Header */}
      <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: colores.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', flexShrink: 0,
          }}>
            {icono}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A2B56', marginBottom: 10, lineHeight: 1.3 }}>
              {contenido.titulo}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: colores.bg, color: colores.color }}>
                {icono} {contenido.tipo}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: '#f3f4f6', color: '#374151' }}>
                📚 {contenido.materia}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: '#eff6ff', color: '#1e40af' }}>
                🎓 {contenido.nivel}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', padding: '4px 0' }}>
                📅 {formatFecha(contenido.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
          <Link href={`/dashboard/contenidos/${id}/editar`} className="btn-action"
            style={{ background: '#1A2B56', color: 'white' }}>
            ✏️ Editar
          </Link>
          <Link href={`/dashboard/contenidos/${id}/duplicar`} className="btn-action"
  style={{ background: '#00A3FF', color: 'white' }}>
  📋 Duplicar
</Link>
<Link href={`/dashboard/contenidos/${id}/eliminar`} className="btn-action"
  style={{ background: '#fee2e2', color: '#dc2626' }}>
  🗑️ Eliminar
</Link>
        </div>
      </div>

      {/* Descripción */}
      {contenido.descripcion && (
        <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #e5e7eb', marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Descripción
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.75, fontSize: '0.95rem' }}>{contenido.descripcion}</p>
        </div>
      )}

      {/* Recurso */}
      {(urlDescarga || contenido.url_externa) && (
        <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #e5e7eb', marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Recurso
          </h2>
          {urlDescarga && (
            <a href={urlDescarga} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'linear-gradient(135deg, #059669, #0d9488)', color: 'white', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
              ⬇️ Descargar {contenido.archivo_nombre || 'archivo'}
            </a>
          )}
          {contenido.url_externa && (
            <a href={contenido.url_externa} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: '#eff6ff', color: '#1e40af', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1.5px solid #bfdbfe' }}>
              🔗 Abrir recurso externo ↗
            </a>
          )}
        </div>
      )}

      {/* Notas */}
      {contenido.notas && (
        <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #e5e7eb', marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Notas adicionales
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.75, fontSize: '0.9rem', fontStyle: 'italic' }}>{contenido.notas}</p>
        </div>
      )}

      {/* Etiquetas */}
      {contenido.etiquetas?.length > 0 && (
        <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #e5e7eb', marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Etiquetas
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {contenido.etiquetas.map((tag: string) => (
              <span key={tag} style={{ fontSize: '0.82rem', padding: '5px 14px', background: '#d1fae5', color: '#065f46', borderRadius: 999, fontWeight: 600 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}