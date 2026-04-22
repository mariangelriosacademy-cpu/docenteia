'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-left { flex: 1; background: linear-gradient(135deg, #0a0828 0%, #1a1060 50%, #0D3B6E 100%); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 48px; position: relative; overflow: hidden; }
        .login-left::before { content: ''; position: absolute; width: 500px; height: 500px; background: radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); }
        .login-right { width: 480px; background: #f8fafc; display: flex; flex-direction: column; justify-content: center; padding: 48px; }
        .input-field { width: 100%; padding: 13px 16px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.95rem; font-family: inherit; color: #1e293b; background: white; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: #F97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
        .btn-primary { width: 100%; padding: 14px; background: #F97316; color: white; font-weight: 700; font-size: 1rem; border: none; border-radius: 10px; cursor: pointer; font-family: inherit; transition: all 0.2s; box-shadow: 0 4px 16px rgba(249,115,22,0.35); }
        .btn-primary:hover:not(:disabled) { background: #ea6a0a; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-secondary { width: 100%; padding: 13px; background: transparent; color: #0D3B6E; font-weight: 600; font-size: 0.95rem; border: 2px solid #0D3B6E; border-radius: 10px; cursor: pointer; font-family: inherit; transition: all 0.2s; text-decoration: none; display: block; text-align: center; }
        .btn-secondary:hover { background: #0D3B6E; color: white; }
        .feature-item { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.75); font-size: 0.9rem; padding: 6px 0; }
        .feature-dot { width: 8px; height: 8px; background: #F97316; border-radius: 50%; flex-shrink: 0; }
        @media (max-width: 768px) { .login-left { display: none; } .login-right { width: 100%; } }
      `}</style>

      <div className="login-left">
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 420 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>
            <Image src="/logo.png" alt="Didactia IA" width={160} height={48} style={{ objectFit: 'contain' }} priority />
          </Link>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: 12, letterSpacing: '-0.02em' }}>
            La plataforma que los docentes <span style={{ color: '#F97316' }}>merecen</span> tener
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 40 }}>
            Crea evaluaciones, proyectos y contenido pedagógico adaptado al currículo de tu país en segundos.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['+2.000 docentes activos', 'Evaluaciones con IA en segundos', 'Proyectos curriculares por país', '14 días Pro gratis'].map(f => (
              <div key={f} className="feature-item"><div className="feature-dot" />{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0D3B6E', marginBottom: 6, letterSpacing: '-0.02em' }}>Bienvenido de vuelta</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Inicia sesión en tu cuenta de{' '}
            <span style={{ fontWeight: 800, color: '#0D3B6E' }}>Didactia</span>
            <span style={{ fontWeight: 800, color: '#F97316' }}> IA</span>
          </p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Correo electrónico</label>
            <input className="input-field" type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Contraseña</label>
              <Link href="/recuperar" style={{ fontSize: '0.8rem', color: '#F97316', textDecoration: 'none', fontWeight: 500 }}>¿Olvidaste tu contraseña?</Link>
            </div>
            <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
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
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>¿No tienes cuenta?</span>
          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        </div>
        <Link href="/registro" className="btn-secondary">Registrarse</Link>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: 32 }}>
          Al continuar aceptas nuestros{' '}
          <Link href="/terminos" style={{ color: '#F97316', textDecoration: 'none' }}>Términos de uso</Link>
        </p>
      </div>
    </div>
  )
}