import Link from 'next/link'
import Image from 'next/image'
import { recuperarPassword } from '@/lib/auth/actions'

interface RecuperarPageProps {
  searchParams: Promise<{ error?: string; mensaje?: string }>
}

export default async function RecuperarPage({ searchParams }: RecuperarPageProps) {
  const params  = await searchParams
  const error   = params.error
  const mensaje = params.mensaje

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .recuperar-left {
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
        .recuperar-left::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(0,163,255,0.10) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
        }
        .recuperar-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(142,45,226,0.12) 0%, transparent 70%);
          bottom: 10%; right: 10%;
        }
        .recuperar-right {
          width: 480px;
          background: #f8f9fa;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px;
        }
        .input-field {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #1e293b;
          background: white;
          outline: none;
          transition: all 0.2s;
        }
        .input-field:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.12); }
        .btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #00A3FF 0%, #8E2DE2 100%);
          color: white;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,163,255,0.35);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,163,255,0.45); }
        .feature-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.65); font-size: 0.88rem; padding: 7px 0; }
        .feature-dot { width: 7px; height: 7px; background: linear-gradient(135deg,#00A3FF,#8E2DE2); border-radius: 50%; flex-shrink: 0; }
        @media (max-width: 768px) { .recuperar-left { display: none; } .recuperar-right { width: 100%; } }
      `}</style>

      {/* Lado izquierdo */}
      <div className="recuperar-left">
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
            Recupera el acceso a{' '}
            <span style={{ background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              tu cuenta
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: 40 }}>
            Te enviaremos un enlace seguro para restablecer tu contraseña en segundos.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['Enlace seguro por correo', 'Válido por 24 horas', 'Sin perder tus datos', 'Soporte disponible'].map(f => (
              <div key={f} className="feature-item">
                <div className="feature-dot" />{f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado derecho */}
      <div className="recuperar-right">

        {mensaje ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>📬</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: 10, letterSpacing: '-0.025em' }}>
              ¡Correo enviado!
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 8 }}>
              {mensaje}
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '0.82rem', marginBottom: 32 }}>
              Revisa también tu carpeta de spam.
            </p>
            <Link
              href="/login"
              style={{
                display: 'block', width: '100%', padding: '14px',
                background: 'linear-gradient(135deg, #00A3FF 0%, #8E2DE2 100%)',
                color: 'white', fontWeight: 700, fontSize: '1rem',
                borderRadius: 8, textDecoration: 'none', textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,163,255,0.35)',
              }}
            >
              Volver al inicio de sesión
            </Link>
          </div>

        ) : (
          <>
            <div style={{ marginBottom: 36 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: 6, letterSpacing: '-0.025em' }}>
                ¿Olvidaste tu contraseña?
              </h1>
              <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>
                Ingresa tu correo y te enviaremos un enlace para restablecerla.
              </p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ {error}
              </div>
            )}

            <form action={recuperarPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Correo electrónico
                </label>
                <input
                  className="input-field"
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="tu@correo.com"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
                Enviar enlace de recuperación →
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
              <span style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>¿Recuerdas tu contraseña?</span>
              <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            </div>

            <Link
              href="/login"
              style={{
                display: 'block', width: '100%', padding: '13px',
                background: 'transparent', color: '#1A2B56',
                fontWeight: 600, fontSize: '0.95rem',
                border: '1.5px solid #d1d5db', borderRadius: 8,
                textDecoration: 'none', textAlign: 'center', transition: 'all 0.2s',
              }}
            >
              Volver al inicio de sesión
            </Link>
          </>
        )}
      </div>
    </div>
  )
}