export default function PlanificacionSkeleton() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .sk {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 1000px 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
      `}</style>

      {/* Header skeleton */}
      <div style={{ background: '#f3f4f6', borderRadius: 14, padding: '24px 28px', marginBottom: 20 }}>
        <div className="sk" style={{ height: 12, width: 180, marginBottom: 12 }} />
        <div className="sk" style={{ height: 20, width: '70%', marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          {[80,70,90,100].map(w => <div key={w} className="sk" style={{ height: 26, width: w }} />)}
        </div>
      </div>

      {/* Objetivo skeleton */}
      <div style={{ border: '1.5px solid #e8edf5', borderRadius: 12, padding: '18px 22px', marginBottom: 20 }}>
        <div className="sk" style={{ height: 10, width: 140, marginBottom: 12 }} />
        <div className="sk" style={{ height: 14, width: '100%', marginBottom: 8 }} />
        <div className="sk" style={{ height: 14, width: '80%' }} />
      </div>

      {/* Actividades skeleton */}
      {['🟢 Actividades de Inicio','🔵 Actividades de Desarrollo','🔴 Actividades de Cierre'].map((t, i) => (
        <div key={i} style={{ border: '1.5px solid #e8edf5', borderRadius: 12, padding: '14px 18px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="sk" style={{ height: 14, width: 200 }} />
            <div className="sk" style={{ height: 14, width: 14 }} />
          </div>
        </div>
      ))}

      {/* Loader central */}
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(0,163,255,0.2)', borderTopColor: '#00A3FF', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 500 }}>Docenly IA está creando tu planificación…</p>
          <p style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Esto puede tomar hasta 30 segundos</p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
