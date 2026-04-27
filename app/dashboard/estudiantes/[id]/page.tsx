import { obtener_por_id } from '@/lib/estudiantes/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { archivar } from '@/lib/estudiantes/actions'

function getAvatarColor(nombre: string): string {
  const colores = ['#00A3FF','#8E2DE2','#1A2B56','#00868a','#d97706','#16a34a','#dc2626','#7c3aed']
  let hash = 0
  for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash)
  return colores[Math.abs(hash) % colores.length]
}

function getIniciales(nombre: string): string {
  return nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default async function PerfilEstudiantePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const est = await obtener_por_id(id)
  if (!est) notFound()

  const color    = getAvatarColor(est.nombre)
  const iniciales = getIniciales(est.nombre)

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 720, margin: '0 auto' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .info-card { background: white; borderRadius: 14px; border: 1px solid #e2e8f0; padding: 24px; margin-bottom: 16px; }
        .field-row { display: flex; flex-direction: column; gap: 4px; }
        .field-label { font-size: 0.72rem; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.06em; }
        .field-value { font-size: 0.9rem; color: #1A2B56; font-weight: 500; }
        .btn-action { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.15s; text-decoration: none; font-family: inherit; border: none; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: '0.82rem', color: '#9CA3AF' }}>
        <Link href="/dashboard/estudiantes" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Estudiantes</Link>
        <span>›</span>
        <span style={{ color: '#374151', fontWeight: 500 }}>{est.nombre}</span>
      </div>

      {/* Header perfil */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
            {iniciales}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2B56', marginBottom: 4 }}>{est.nombre}</h1>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>{est.grado}</span>
              <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: est.activo ? '#dcfce7' : '#F3F4F6', color: est.activo ? '#16a34a' : '#6B7280' }}>
                {est.activo ? '● Activo' : '○ Archivado'}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
          <Link href={`/dashboard/estudiantes/${id}/editar`} className="btn-action"
            style={{ background: '#EFF6FF', color: '#00A3FF' }}>
            ✏️ Editar
          </Link>
          <form action={async () => {
            'use server'
            await archivar(id)
          }}>
            <button type="submit" className="btn-action"
              style={{ background: est.activo ? '#FEF3C7' : '#dcfce7', color: est.activo ? '#d97706' : '#16a34a' }}>
              {est.activo ? '📦 Archivar' : '✅ Activar'}
            </button>
          </form>
        </div>
      </div>

      {/* Información general */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, marginBottom: 16 }}>
        <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
          Información general
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="field-row">
            <span className="field-label">Nombre completo</span>
            <span className="field-value">{est.nombre}</span>
          </div>
          <div className="field-row">
            <span className="field-label">Grado</span>
            <span className="field-value">{est.grado}</span>
          </div>
        </div>
      </div>

      {/* Información del acudiente */}
      {(est.acudiente_nombre || est.acudiente_email || est.acudiente_telefono) && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            Información del acudiente
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {est.acudiente_nombre && (
              <div className="field-row">
                <span className="field-label">Nombre</span>
                <span className="field-value">{est.acudiente_nombre}</span>
              </div>
            )}
            {est.acudiente_email && (
              <div className="field-row">
                <span className="field-label">Email</span>
                <a href={`mailto:${est.acudiente_email}`} style={{ fontSize: '0.9rem', color: '#00A3FF', fontWeight: 500 }}>
                  {est.acudiente_email}
                </a>
              </div>
            )}
            {est.acudiente_telefono && (
              <div className="field-row">
                <span className="field-label">Teléfono</span>
                <a href={`tel:${est.acudiente_telefono}`} style={{ fontSize: '0.9rem', color: '#00A3FF', fontWeight: 500 }}>
                  {est.acudiente_telefono}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Observaciones */}
      {est.observaciones && (
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, marginBottom: 16 }}>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Observaciones especiales
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.75, fontSize: '0.9rem' }}>{est.observaciones}</p>
        </div>
      )}

    </div>
  )
}