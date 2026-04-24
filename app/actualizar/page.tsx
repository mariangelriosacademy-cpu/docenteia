'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'

export default function ActualizarPasswordPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [password,  setPassword]  = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error,     setError]     = useState('')
  const [cargando,  setCargando]  = useState(false)
  const [exito,     setExito]     = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres')
      return
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    setCargando(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Error al actualizar. El enlace puede haber expirado.')
      setCargando(false)
      return
    }

    setExito(true)
    setCargando(false)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .actualizar-left {
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
        .actualizar-left::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(0,163,255,0.10) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
        }
        .actualizar-left::after {
          content: '';
          position: absolute;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(142,45,226,0.12) 0%, transparent 70%);
          bottom: 10%; right: 10%;
        }
        .actualizar-right {
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
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .feature-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.65); font-size: 0.88rem; padding: 7px 0; }
        .feature-dot { width: 7px; height: 7px; background: linear-gradient(135deg,#00A3FF,#8E2DE2); border-radius: 50%; flex-shrink: 0; }
        @media (max-width: 768px) { .actualizar-left { display: none; } .actualizar-right { width: 100%; } }
      `}</style>

      {/* Lado izquierdo */}
      <div className="actualizar-left">
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
            Crea una{' '}
            <span style={{ background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              nueva contraseña
            </span>{' '}
            segura
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: 40 }}>
            Elige una contraseña segura para proteger tu cuenta de Docenly.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['Mínimo 8 caracteres', 'Cifrado seguro', 'Acceso inmediato', 'Tus datos protegidos'].map(f => (
              <div key={f} className="feature-item">
                <div className="feature-dot" />{f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado derecho */}
      <div className="actualizar-right">

        {exito ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎉</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: 10, letterSpacing: '-0.025em' }}>
              ¡Contraseña actualizada!
            </h1>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 24 }}>
              Redirigiendo a tu dashboard...
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 28, height: 28, border: '3px solid #00A3FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>

        ) : (
          <>
            <div style={{ marginBottom: 36 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: 6, letterSpacing: '-0.025em' }}>
                Nueva contraseña
              </h1>
              <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>
                Elige una contraseña segura para tu cuenta de{' '}
                <span style={{ fontWeight: 700, color: '#111827' }}>Docenly</span>
              </p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Nueva contraseña
                </label>
                <input
                  className="input-field"
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Confirmar contraseña
                </label>
                <input
                  className="input-field"
                  id="confirmar"
                  type="password"
                  required
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                  placeholder="Repite la contraseña"
                />
                {confirmar && (
                  <p style={{ fontSize: '0.75rem', marginTop: 6, color: password === confirmar ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
                    {password === confirmar ? '✅ Las contraseñas coinciden' : '❌ Las contraseñas no coinciden'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={cargando || password !== confirmar}
                style={{ marginTop: 4 }}
              >
                {cargando ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Actualizando...
                  </span>
                ) : (
                  'Actualizar contraseña →'
                )}
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
                textDecoration: 'none', textAlign: 'center',
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