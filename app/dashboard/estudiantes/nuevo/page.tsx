import { crear } from '@/lib/estudiantes/actions'
import Link from 'next/link'

const GRADOS = [
  'Preescolar',
  'Primaria 1°', 'Primaria 2°', 'Primaria 3°',
  'Primaria 4°', 'Primaria 5°', 'Primaria 6°',
  'Secundaria 7°', 'Secundaria 8°', 'Secundaria 9°',
  'Bachillerato 10°', 'Bachillerato 11°',
  'Universidad',
]

export default function NuevoEstudiantePage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 640, margin: '0 auto' }}>
      <style>{`
        * { box-sizing: border-box; }
        .field-label { display: block; font-size: 0.78rem; font-weight: 600; color: #1A2B56; margin-bottom: 6px; letter-spacing: 0.02em; }
        .field-input { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 0.875rem; color: #1A2B56; background: white; outline: none; font-family: inherit; transition: border-color 0.2s; }
        .field-input:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.08); }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: '0.82rem', color: '#6B7280' }}>
        <Link href="/dashboard/estudiantes" style={{ color: '#00A3FF', textDecoration: 'none', fontWeight: 500 }}>Estudiantes</Link>
        <span>›</span>
        <span>Nuevo estudiante</span>
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0d0a2e 0%, #1A2B56 100%)', padding: '20px 24px' }}>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
            👤 Nuevo estudiante
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
            Completa la información del estudiante
          </p>
        </div>

        <form action={crear} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Nombre */}
            <div>
              <label className="field-label">Nombre completo *</label>
              <input name="nombre" type="text" required placeholder="Ej: María García López" className="field-input" />
            </div>

            {/* Grado */}
            <div>
              <label className="field-label">Grado / Nivel *</label>
              <select name="grado" required className="field-input" defaultValue="">
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

            {/* Nombre acudiente */}
            <div>
              <label className="field-label">Nombre del acudiente</label>
              <input name="acudiente_nombre" type="text" placeholder="Ej: Carlos García" className="field-input" />
            </div>

            {/* Grid email + teléfono */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="field-label">Email del acudiente</label>
                <input name="acudiente_email" type="email" placeholder="correo@ejemplo.com" className="field-input" />
              </div>
              <div>
                <label className="field-label">Teléfono del acudiente</label>
                <input name="acudiente_telefono" type="tel" placeholder="+57 300 000 0000" className="field-input" />
              </div>
            </div>

            <div style={{ height: 1, background: '#f1f5f9' }} />
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Observaciones especiales
            </p>

            {/* Observaciones */}
            <div>
              <label className="field-label">Notas médicas, alergias, condiciones especiales</label>
              <textarea
                name="observaciones"
                rows={4}
                placeholder="Ej: Alergia al maní, necesita silla especial, TDAH diagnosticado..."
                className="field-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
              <Link
                href="/dashboard/estudiantes"
                style={{ padding: '10px 20px', background: 'white', color: '#6B7280', border: '1.5px solid #e2e8f0', borderRadius: 9, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}
              >
                Cancelar
              </Link>
              <button
                type="submit"
                style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', color: 'white', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Guardar estudiante →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}