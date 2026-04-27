import Link from 'next/link'
import { obtener_todos } from '@/lib/estudiantes/actions'
import BuscadorEstudiantes from './BuscadorEstudiantes'

export default async function EstudiantesPage() {
  const estudiantes = await obtener_todos()
  const activos   = estudiantes.filter(e => e.activo).length
  const inactivos = estudiantes.filter(e => !e.activo).length

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`* { box-sizing: border-box; }`}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A2B56', letterSpacing: '-0.03em', marginBottom: 4 }}>Estudiantes</h1>
          <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>{estudiantes.length} total · {activos} activos · {inactivos} archivados</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <label htmlFor="csv-upload" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'white', color: '#1A2B56', border: '1.5px solid #e2e8f0', fontWeight: 600, fontSize: '0.82rem', borderRadius: 9, cursor: 'pointer' }}>
            📥 Importar CSV
          </label>
          <input id="csv-upload" type="file" accept=".csv" style={{ display: 'none' }} />
          <Link href="/dashboard/estudiantes/nuevo" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', color: 'white', fontWeight: 700, fontSize: '0.85rem', borderRadius: 9, textDecoration: 'none' }}>
            + Nuevo estudiante
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total',      valor: estudiantes.length, color: '#1A2B56', bg: '#EFF6FF' },
          { label: 'Activos',    valor: activos,            color: '#16a34a', bg: '#dcfce7' },
          { label: 'Archivados', valor: inactivos,          color: '#6B7280', bg: '#F3F4F6' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: s.color }}>{s.label}</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, letterSpacing: '-0.04em' }}>{s.valor}</span>
          </div>
        ))}
      </div>

      <BuscadorEstudiantes estudiantes={estudiantes} />
    </div>
  )
}