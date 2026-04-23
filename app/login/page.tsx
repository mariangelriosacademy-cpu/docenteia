'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/hooks/useNotification'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const router = useRouter()
  const { notifySuccess, notifyError, notifyLoading, notifyDismiss } = useNotification()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const toastId = notifyLoading('Iniciando sesión...')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    notifyDismiss(toastId)

    if (error) {
      notifyError('Correo o contraseña incorrectos')
      setError('Correo o contraseña incorrectos')
      setLoading(false)
    } else {
      notifySuccess('¡Bienvenido de vuelta! 👋')
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-left {
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
        .login-left::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(0,163,255,0.10) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
        }
        .login-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(142,45,226,0.12) 0%, transparent 70%);
          bottom: 10%; right: 10%;
        }
        .login-right {
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
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,163,255,0.45); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-secondary {
          width: 100%;
          padding: 13px;
          background: transparent;
          color: #191e2e;
          font-weight: 600;
          font-size: 0.95rem;
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
        @media (max-width: 768px) { .login-left { display: none; } .login-right { width: 100%; } }
      `}</style>

      {/* Lado izquierdo */}
      <div className="login-left">
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
            La plataforma que los docentes{' '}
            <span style={{ background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              merecen
            </span>{' '}
            tener
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: 40 }}>
            Crea evaluaciones, proyectos y contenido pedagógico adaptado al currículo de tu país en segundos.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['+2.000 docentes activos', 'Evaluaciones con IA en segundos', 'Proyectos curriculares por país', '14 días Pro gratis'].map(f => (
              <div key={f} className="feature-item"><div className="feature-dot" />{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado derecho */}
      <div className="login-right">
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: 6, letterSpacing: '-0.025em' }}>
            Bienvenido de vuelta
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>
            Inicia sesión en tu cuenta de{' '}
            <span style={{ fontWeight: 700, color: '#111827' }}>Docenly</span>
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Correo electrónico
            </label>
            <input
              className="input-field"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>Contraseña</label>
              <Link href="/recuperar" style={{ fontSize: '0.78rem', color: '#00A3FF', textDecoration: 'none', fontWeight: 500 }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión →'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <span style={{ color: '#9CA3AF', fontSize: '0.78rem' }}>¿No tienes cuenta?</span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>

        <Link href="/registro" className="btn-secondary">Registrarse</Link>

        <p style={{ textAlign: 'center', fontSize: '0.73rem', color: '#9CA3AF', marginTop: 32 }}>
          Al continuar aceptas nuestros{' '}
          <Link href="/terminos" style={{ color: '#00A3FF', textDecoration: 'none' }}>Términos de uso</Link>
        </p>
      </div>
    </div>
  )
}