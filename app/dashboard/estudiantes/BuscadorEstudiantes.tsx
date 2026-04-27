'use client'
import { useState } from 'react'
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

interface Estudiante {
  id: string
  nombre: string
  grado: string
  activo: boolean
  acudiente_nombre?: string
  acudiente_email?: string
  acudiente_telefono?: string
  observaciones?: string
}

export default function BuscadorEstudiantes({ estudiantes }: { estudiantes: Estudiante[] }) {
  const [busqueda, setBusqueda]   = useState('')
  const [filtro, setFiltro]       = useState<'todos' | 'activos' | 'archivados'>('activos')
  const [archivando, setArchivando] = useState<string | null>(null)

  const filtrados = estudiantes.filter(e => {
    const coincide = e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                     e.grado.toLowerCase().includes(busqueda.toLowerCase())
    if (filtro === 'activos')    return coincide && e.activo
    if (filtro === 'archivados') return coincide && !e.activo
    return coincide
  })

  async function handleArchivar(id: string) {
    setArchivando(id)
    await archivar(id)
    setArchivando(null)
  }

  return (
    <div>
      <style>{`
        .est-row { display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: white; border-radius: 10px; border: 1px solid #e2e8f0; transition: all 0.18s; margin-bottom: 6px; }
        .est-row:hover { box-shadow: 0 4px 16px rgba(0,163,255,0.08); border-color: rgba(0,163,255,0.2); }
        .badge-activo   { padding: 3px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; background: #dcfce7; color: #16a34a; }
        .badge-inactivo { padding: 3px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 700; background: #F3F4F6; color: #6B7280; }
        .btn-filtro { padding: 6px 14px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; border: 1px solid #e2e8f0; cursor: pointer; font-family: inherit; transition: all 0.15s; background: white; color: #6B7280; }
        .btn-filtro.on { background: #1A2B56; color: white; border-color: #1A2B56; }
      `}</style>

      {/* Barra búsqueda + filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o grado..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', color: '#111827' }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {(['todos','activos','archivados'] as const).map(f => (
            <button key={f} className={`btn-filtro ${filtro === f ? 'on' : ''}`} onClick={() => setFiltro(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF', fontSize: '0.875rem' }}>
          {busqueda ? 'No se encontraron estudiantes con esa búsqueda.' : 'No hay estudiantes en esta categoría.'}
        </div>
      ) : (
        filtrados.map(e => {
          const color = getAvatarColor(e.nombre)
          return (
            <div key={e.id} className="est-row">
              {/* Avatar */}
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                {getIniciales(e.nombre)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: 2 }}>{e.nombre}</p>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{e.grado}</p>
              </div>

              {/* Estado */}
              <span className={e.activo ? 'badge-activo' : 'badge-inactivo'}>
                {e.activo ? '● Activo' : '○ Archivado'}
              </span>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <Link href={`/dashboard/estudiantes/${e.id}`} style={{ padding: '5px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, background: '#F3F4F6', color: '#374151', textDecoration: 'none' }}>
                  Ver
                </Link>
                <Link href={`/dashboard/estudiantes/${e.id}/editar`} style={{ padding: '5px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, background: '#EFF6FF', color: '#00A3FF', textDecoration: 'none' }}>
                  Editar
                </Link>
                <button
                  onClick={() => handleArchivar(e.id)}
                  disabled={archivando === e.id}
                  style={{ padding: '5px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, background: e.activo ? '#FEF3C7' : '#dcfce7', color: e.activo ? '#d97706' : '#16a34a', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {archivando === e.id ? '...' : e.activo ? 'Archivar' : 'Activar'}
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}