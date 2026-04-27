import { obtener_por_id, actualizar } from '@/lib/estudiantes/actions'
import { notFound } from 'next/navigation'
import Link         from 'next/link'

const GRADOS = [
  'Preescolar',
  'Primaria 1°', 'Primaria 2°', 'Primaria 3°',
  'Primaria 4°', 'Primaria 5°', 'Primaria 6°',
  'Secundaria 7°', 'Secundaria 8°', 'Secundaria 9°',
  'Bachillerato 10°', 'Bachillerato 11°',
  'Universidad',
]

export default async function EditarEstudiantePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const est = await obtener_por_id(id)
  if (!est) notFound()

  const actualizarConId = actualizar.bind(null, id)

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 640, margin: '0 auto' }}>
      <style>{`
        * { box-sizing: border-box; }
        .field-label { display: block; font-size: 0.78rem; font-weight: 600; color: #1A2B56; margin-bottom: 6px; }
        .field-input { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 0.875rem; color: #1A2B56; background: white; outline: none; font-family: inherit; transition: border-color 0.2s; }
        .field-input:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.08); }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: '0.82rem', color: '#6B7280' }}>
        <Link href="/dashboard/estudiantes" style={{ color: '#00A3FF', textDecoration: 'none', fontWeight: 500 }}>Estudiantes</Link>
        <span>›</span>
        <Link href={`/dashboard/estudiantes/${id}`} style={{ color: '#00A3FF', textDecoration: 'none', fontWeight: 500 }}>{est.nombre}</Link>
        <span>›</span>
        <span>Editar</span>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #0d0a2e 0%, #1A2B56 100%)', padding: '20px 24px' }}>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
            ✏️ Editar estudiante
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{est.nombre}</p>
        </div>

        <form action={actualizarConId} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label className="field-label">Nombre completo *</label>
              <input name="nombre" type="text" required defaultValue={est.nombre} className="field-input" />
            </div>

            <div>
              <label className="field-label">Grado / Nivel *</label>
              <select name="grado" required defaultValue={est.grado} className="field-input">
                <option value="" disabled>Selecciona el grado</option>
                {GRADOS.map(g => <option key={g} value={g}>{g}</option>)}
              </select><div>
  <label className="field-label">Asignatura(s) *</label>
  <select name="asignatura" className="field-input">
    <option value="">Selecciona la asignatura</option>
    <option value="Matemáticas">Matemáticas</option>
    <option value="Lenguaje">Lenguaje</option>
    <option value="Ciencias Naturales">Ciencias Naturales</option>
    <option value="Ciencias Sociales">Ciencias Sociales</option>
    <option value="Inglés">Inglés</option>
    <option value="Arte">Arte</option>
    <option value="Educación Física">Educación Física</option>
    <option value="Tecnología">Tecnología</option>
    <option value="Otra">Otra</option>
  </select>
</div>
            </div>

            <div style={{ height: 1, background: '#f1f5f9' }} />
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Información del acudiente
            </p>

            <div>
              <label className="field-label">Nombre del acudiente</label>
              <input name="acudiente_nombre" type="text" defaultValue={est.acudiente_nombre || ''} className="field-input" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="field-label">Email del acudiente</label>
                <input name="acudiente_email" type="email" defaultValue={est.acudiente_email || ''} className="field-input" />
              </div>
              <div>
                <label className="field-label">Teléfono del acudiente</label>
                <input name="acudiente_telefono" type="tel" defaultValue={est.acudiente_telefono || ''} className="field-input" />
              </div>
            </div>

            <div style={{ height: 1, background: '#f1f5f9' }} />

            <div>
              <label className="field-label">Observaciones especiales</label>
              <textarea name="observaciones" rows={4} defaultValue={est.observaciones || ''} className="field-input" style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
              <Link href={`/dashboard/estudiantes/${id}`} style={{ padding: '10px 20px', background: 'white', color: '#6B7280', border: '1.5px solid #e2e8f0', borderRadius: 9, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                Cancelar
              </Link>
              <button type="submit" style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', color: 'white', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                Guardar cambios →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}