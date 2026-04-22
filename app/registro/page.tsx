import Link from 'next/link'
import Image from 'next/image'
import { signUp } from '@/lib/auth/actions'

const PAISES = [
  'Colombia', 'México', 'España', 'Argentina', 'Chile',
  'Venezuela', 'Perú', 'Ecuador', 'Bolivia', 'Uruguay',
  'Paraguay', 'Costa Rica', 'Panamá', 'Guatemala', 'Honduras',
  'El Salvador', 'Nicaragua', 'Cuba', 'República Dominicana', 'Otro',
]

const NIVELES = [
  { value: 'preescolar',   label: 'Preescolar / Inicial' },
  { value: 'primaria',     label: 'Primaria / Básica' },
  { value: 'secundaria',   label: 'Secundaria / Media' },
  { value: 'bachillerato', label: 'Bachillerato / Preparatoria' },
  { value: 'universidad',  label: 'Universidad / Superior' },
  { value: 'otro',         label: 'Otro' },
]

interface RegistroPageProps {
  searchParams: Promise<{ error?: string; mensaje?: string }>
}

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const params  = await searchParams
  const error   = params.error
  const mensaje = params.mensaje

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .reg-left {
          flex: 1;
          background: #191e2e;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }
        .reg-left::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(0,163,255,0.10) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
        }
        .reg-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(142,45,226,0.12) 0%, transparent 70%);
          bottom: 10%; right: 10%;
        }
        .reg-right {
          width: 520px;
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px;
          overflow-y: auto;
        }
        .input-field {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
          color: #1e293b;
          background: white;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.12); }
        .btn-primary {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #00A3FF 0%, #8E2DE2 100%);
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,163,255,0.35);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,163,255,0.45); }
        .btn-secondary {
          width: 100%;
          padding: 12px;
          background: transparent;
          color: #191e2e;
          font-weight: 600;
          font-size: 0.9rem;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          text-decoration: none;
          display: block;
          text-align: center;
        }
        .btn-secondary:hover { background: #191e2e; color: white; border-color: #191e2e; }
        .feature-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.65); font-size: 0.88rem; padding: 7px 0; }
        .feature-dot { width: 7px; height: 7px; background: linear-gradient(135deg,#00A3FF,#8E2DE2); border-radius: 50%; flex-shrink: 0; }
        @media (max-width: 768px) { .reg-left { display: none; } .reg-right { width: 100%; } }
      `}</style>

      {/* Lado izquierdo */}
      <div className="reg-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 420 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 36 }}>
            <Image
              src="/logo.png"
              alt="Docenly"
              width={160}
              height={48}
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              priority
            />
          </Link>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: 12, letterSpacing: '-0.02em' }}>
            Únete a miles de docentes que ya usan{' '}
            <span style={{ background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Docenly
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: 40 }}>
            Crea evaluaciones, proyectos y contenido pedagógico adaptado al currículo de tu país en segundos.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['14 días Pro gratis incluidos', '+2.000 docentes activos', 'Evaluaciones con IA en segundos', 'Proyectos curriculares por país'].map(f => (
              <div key={f} className="feature-item"><div className="feature-dot" />{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado derecho */}
      <div className="reg-right">

        {mensaje ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📬</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: 8 }}>¡Revisa tu correo!</h2>
            <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: 8 }}>{mensaje}</p>
            <p style={{ color: '#9CA3AF', fontSize: '0.78rem', marginBottom: 24 }}>Revisa también tu carpeta de spam si no lo encuentras.</p>
            <Link href="/login" className="btn-primary" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
              Ir al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginBottom: 6, letterSpacing: '-0.025em' }}>
                Crear cuenta
              </h1>
              <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>
                Gratis — <span style={{ fontWeight: 600, color: '#00A3FF' }}>14 días Pro incluidos</span>
              </p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ {error}
              </div>
            )}

            <form action={signUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Nombre completo</label>
                <input className="input-field" id="nombre" name="nombre" type="text" required placeholder="María González" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Correo electrónico</label>
                <input className="input-field" id="email" name="email" type="email" required placeholder="tu@correo.com" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Contraseña</label>
                <input className="input-field" id="password" name="password" type="password" required minLength={8} placeholder="Mínimo 8 caracteres" />
                <p style={{ fontSize: '0.72rem', color: '#9CA3AF', marginTop: 4 }}>Mínimo 8 caracteres</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>País</label>
                <select className="input-field" id="pais" name="pais" required defaultValue="">
                  <option value="" disabled>Selecciona tu país</option>
                  {PAISES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Nivel educativo que impartes</label>
                <select className="input-field" id="nivel_educativo" name="nivel_educativo" required defaultValue="">
                  <option value="" disabled>Selecciona el nivel</option>
                  {NIVELES.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
                Crear cuenta gratis →
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF' }}>
                🎁 Incluye <strong style={{ color: '#111827' }}>14 días gratis</strong> del plan Pro
              </p>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>¿Ya tienes cuenta?</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            <Link href="/login" className="btn-secondary">Iniciar sesión</Link>
          </>
        )}
      </div>
    </div>
  )
}