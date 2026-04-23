const fs = require('fs')
const path = require('path')

// Crear carpeta si no existe
const dir = './app/configuracion'
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const content = `'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const paises = ['Argentina','Bolivia','Chile','Colombia','Costa Rica','Cuba','Ecuador','El Salvador','España','Guatemala','Honduras','México','Nicaragua','Panamá','Paraguay','Perú','Puerto Rico','República Dominicana','Uruguay','Venezuela','Otro']

const materiasList = ['Matemáticas','Lenguaje','Ciencias Naturales','Ciencias Sociales','Historia','Geografía','Inglés','Educación Física','Arte','Música','Tecnología','Filosofía','Química','Física','Biología','Otro']

const planes = [
  { nombre: 'Gratis', precio: '$0', periodo: 'para siempre', creditos: '50 créditos/mes', features: ['50 créditos de IA', '3 evaluaciones', '1 proyecto', 'Soporte por email'], color: '#1A2B56' },
  { nombre: 'Pro Mensual', precio: '$20 USD', periodo: '/mes', creditos: '1.000 créditos/mes', features: ['1.000 créditos de IA', 'Evaluaciones ilimitadas', 'Proyectos ilimitados', 'Soporte prioritario'], color: '#00A3FF', popular: true },
  { nombre: 'Pro Anual', precio: '$200 USD', periodo: '/año', creditos: '1.000 créditos/mes', features: ['Todo lo de Pro Mensual', 'Ahorras $40 al año', 'Acceso anticipado'], color: '#8E2DE2' },
]

export default function ConfiguracionPage() {
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser]         = useState<any>(null)
  const [nombre, setNombre]     = useState('')
  const [pais, setPais]         = useState('')
  const [materias, setMaterias] = useState<string[]>([])
  const [idioma, setIdioma]     = useState('es')
  const [plan, setPlan]         = useState('free')
  const [saving, setSaving]     = useState(false)
  const [savedOk, setSavedOk]   = useState(false)

  const [passNueva, setPassNueva]     = useState('')
  const [passConfirm, setPassConfirm] = useState('')
  const [passError, setPassError]     = useState('')
  const [passOk, setPassOk]           = useState(false)
  const [savingPass, setSavingPass]   = useState(false)

  const [modalPlan, setModalPlan]     = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting]       = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        setNombre(profile.nombre || '')
        setPais(profile.pais || '')
        setMaterias(profile.materias || [])
        setIdioma(profile.idioma || 'es')
        setPlan(profile.plan || 'free')
      }
    }
    load()
  }, [])

  async function guardarPerfil() {
    if (!user) return
    setSaving(true); setSavedOk(false)
    await supabase.from('profiles').update({ nombre, pais, materias, idioma }).eq('id', user.id)
    setSaving(false); setSavedOk(true)
    setTimeout(() => setSavedOk(false), 3000)
  }

  async function cambiarPassword() {
    setPassError(''); setPassOk(false)
    if (passNueva !== passConfirm) { setPassError('Las contraseñas no coinciden.'); return }
    if (passNueva.length < 8) { setPassError('Mínimo 8 caracteres.'); return }
    setSavingPass(true)
    const { error } = await supabase.auth.updateUser({ password: passNueva })
    setSavingPass(false)
    if (error) { setPassError(error.message); return }
    setPassOk(true); setPassNueva(''); setPassConfirm('')
    setTimeout(() => setPassOk(false), 3000)
  }

  async function eliminarCuenta() {
    if (confirmText !== 'CONFIRMAR' || !user) return
    setDeleting(true)
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
    router.push('/')
  }

  function toggleMateria(m: string) {
    setMaterias(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }

  const isPro = plan === 'pro'
  const iniciales = nombre ? nombre.split(' ').map((n:string) => n[0]).join('').slice(0,2).toUpperCase() : 'D'

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'Inter', sans-serif", paddingBottom: 60 }}>
      <style>{\`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .card { background: white; border-radius: 14px; border: 1px solid #e8edf5; padding: 28px 32px; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .card-title { font-size: 0.95rem; font-weight: 700; color: #111827; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
        .card-desc { font-size: 0.8rem; color: #6B7280; margin-bottom: 22px; }
        .lbl { display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 5px; }
        .inp { width: 100%; padding: 10px 13px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.88rem; font-family: inherit; color: #111827; background: white; outline: none; transition: all 0.2s; }
        .inp:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.08); }
        .inp:disabled { background: #f9fafb; color: #9CA3AF; cursor: not-allowed; }
        .btn-main { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; background: linear-gradient(135deg,#00A3FF,#8E2DE2); color: white; font-weight: 600; font-size: 0.85rem; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; transition: all 0.2s; box-shadow: 0 2px 10px rgba(0,163,255,0.2); }
        .btn-main:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-sec { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; background: white; color: #1A2B56; font-weight: 600; font-size: 0.85rem; border: 1.5px solid #d1d5db; border-radius: 8px; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .btn-sec:hover { border-color: #00A3FF; color: #00A3FF; }
        .btn-danger { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; background: white; color: #dc2626; font-weight: 600; font-size: 0.85rem; border: 1.5px solid #fecaca; border-radius: 8px; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .btn-danger:hover { background: #fef2f2; border-color: #dc2626; }
        .chip { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 999px; font-size: 0.76rem; font-weight: 500; cursor: pointer; transition: all 0.15s; border: 1.5px solid #e2e8f0; background: white; color: #4B5563; margin: 3px; }
        .chip.on { background: rgba(0,163,255,0.1); border-color: #00A3FF; color: #00A3FF; font-weight: 600; }
        .chip:hover { border-color: #00A3FF; }
        .ok { display: flex; align-items: center; gap: 8px; padding: 9px 13px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; color: #166534; font-size: 0.82rem; font-weight: 500; margin-top: 12px; }
        .err { display: flex; align-items: center; gap: 8px; padding: 9px 13px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-size: 0.82rem; font-weight: 500; margin-top: 12px; }
        .plan-card { border-radius: 12px; padding: 20px 22px; border: 2px solid #e2e8f0; transition: all 0.2s; position: relative; }
        .plan-card.popular { border-color: #00A3FF; box-shadow: 0 8px 24px rgba(0,163,255,0.12); }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { background: white; border-radius: 16px; padding: 32px; max-width: 560px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }
        .divider { height: 1px; background: #f1f5f9; margin: 20px 0; }
      \`}</style>

      {/* Top bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e8edf5', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 0 #e8edf5' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500, transition: 'color 0.2s' }}>
          ← Dashboard
        </Link>
        <span style={{ color: '#e2e8f0' }}>|</span>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>⚙️ Configuración de cuenta</span>
      </div>

      <div style={{ maxWidth: 700, margin: '28px auto', padding: '0 20px' }}>

        {/* Avatar + nombre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '20px 24px', background: 'white', borderRadius: 14, border: '1px solid #e8edf5' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: 'white', flexShrink: 0 }}>
            {iniciales}
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#111827', fontSize: '1rem' }}>{nombre || 'Tu nombre'}</p>
            <p style={{ color: '#6B7280', fontSize: '0.82rem', marginTop: 2 }}>{user?.email}</p>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: isPro ? 'rgba(0,163,255,0.1)' : 'rgba(0,0,0,0.06)', color: isPro ? '#00A3FF' : '#6B7280', letterSpacing: '0.05em', marginTop: 4, display: 'inline-block' }}>
              {isPro ? '⭐ PRO' : 'FREE'}
            </span>
          </div>
        </div>

        {/* ── 1. INFORMACIÓN PERSONAL ── */}
        <div className="card">
          <p className="card-title">👤 Información personal</p>
          <p className="card-desc">Actualiza tus datos de perfil en la plataforma.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label className="lbl">Nombre completo</label>
              <input className="inp" type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" />
            </div>
            <div>
              <label className="lbl">Correo electrónico</label>
              <input className="inp" type="email" value={user?.email || ''} disabled />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label className="lbl">País</label>
              <select className="inp" value={pais} onChange={e => setPais(e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="">Selecciona tu país</option>
                {paises.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">Idioma preferido</label>
              <select className="inp" value={idioma} onChange={e => setIdioma(e.target.value)} style={{ cursor: 'pointer' }}>
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 English</option>
                <option value="pt">🇧🇷 Português</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="lbl">Materias que enseñas</label>
            <div style={{ marginTop: 4 }}>
              {materiasList.map(m => (
                <span key={m} className={\`chip \${materias.includes(m) ? 'on' : ''}\`} onClick={() => toggleMateria(m)}>{m}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn-main" onClick={guardarPerfil} disabled={saving}>
              {saving ? '⏳ Guardando...' : '💾 Guardar cambios'}
            </button>
            {savedOk && <div className="ok">✅ Cambios guardados correctamente</div>}
          </div>
        </div>

        {/* ── 2. PLAN ACTUAL ── */}
        <div className="card">
          <p className="card-title">💳 Plan actual</p>
          <p className="card-desc">Gestiona tu suscripción y accede a más funciones.</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 10, background: isPro ? 'linear-gradient(135deg, rgba(0,163,255,0.08), rgba(142,45,226,0.08))' : '#f9fafb', border: isPro ? '1.5px solid rgba(0,163,255,0.2)' : '1.5px solid #e2e8f0', marginBottom: 16 }}>
            <div>
              <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{isPro ? '⭐ Plan Pro' : '🆓 Plan Gratuito'}</p>
              <p style={{ color: '#6B7280', fontSize: '0.8rem', marginTop: 3 }}>
                {isPro ? '1.000 créditos/mes · Funciones ilimitadas' : '50 créditos/mes · Funciones básicas'}
              </p>
            </div>
            {!isPro && (
              <button className="btn-main" onClick={() => setModalPlan(true)}>✨ Mejorar a Pro</button>
            )}
            {isPro && (
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: 'rgba(0,163,255,0.1)', color: '#00A3FF' }}>Activo</span>
            )}
          </div>

          {!isPro && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {planes.map(p => (
                <div key={p.nombre} className={\`plan-card \${p.popular ? 'popular' : ''}\`}>
                  {p.popular && <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#00A3FF', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>MÁS POPULAR</span>}
                  <p style={{ fontWeight: 700, color: p.color, fontSize: '0.9rem', marginBottom: 4 }}>{p.nombre}</p>
                  <p style={{ fontWeight: 800, color: '#111827', fontSize: '1.3rem', letterSpacing: '-0.03em' }}>{p.precio}<span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 400 }}> {p.periodo}</span></p>
                  <p style={{ fontSize: '0.72rem', color: p.color, fontWeight: 600, marginTop: 4 }}>{p.creditos}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 3. SEGURIDAD ── */}
        <div className="card">
          <p className="card-title">🔒 Seguridad</p>
          <p className="card-desc">Cambia tu contraseña para mantener tu cuenta segura.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <div>
              <label className="lbl">Nueva contraseña</label>
              <input className="inp" type="password" value={passNueva} onChange={e => setPassNueva(e.target.value)} placeholder="Mínimo 8 caracteres" />
            </div>
            <div>
              <label className="lbl">Confirmar contraseña</label>
              <input className="inp" type="password" value={passConfirm} onChange={e => setPassConfirm(e.target.value)} placeholder="Repite la contraseña" />
            </div>
          </div>

          <button className="btn-main" onClick={cambiarPassword} disabled={savingPass || !passNueva || !passConfirm}>
            {savingPass ? '⏳ Actualizando...' : '🔑 Cambiar contraseña'}
          </button>
          {passError && <div className="err">⚠️ {passError}</div>}
          {passOk    && <div className="ok">✅ Contraseña actualizada correctamente</div>}
        </div>

        {/* ── 4. ZONA DE PELIGRO ── */}
        <div className="card" style={{ border: '1.5px solid #fecaca' }}>
          <p className="card-title" style={{ color: '#dc2626' }}>⚠️ Zona de peligro</p>
          <p className="card-desc">Estas acciones son permanentes e irreversibles.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#dc2626', fontSize: '0.88rem' }}>Eliminar mi cuenta</p>
              <p style={{ color: '#6B7280', fontSize: '0.78rem', marginTop: 2 }}>Se borrarán todos tus datos permanentemente.</p>
            </div>
            <button className="btn-danger" onClick={() => setModalDelete(true)}>🗑️ Eliminar cuenta</button>
          </div>
        </div>
      </div>

      {/* ── MODAL PLAN ── */}
      {modalPlan && (
        <div className="overlay" onClick={() => setModalPlan(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, color: '#111827', fontSize: '1.15rem' }}>✨ Elige tu plan</h2>
              <button onClick={() => setModalPlan(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#9CA3AF' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {planes.filter(p => p.nombre !== 'Gratis').map(p => (
                <div key={p.nombre} style={{ padding: '16px 20px', borderRadius: 12, border: \`2px solid \${p.popular ? p.color : '#e2e8f0'}\`, background: p.popular ? \`\${p.color}08\` : 'white', position: 'relative' }}>
                  {p.popular && <span style={{ position: 'absolute', top: -10, right: 16, background: p.color, color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px', borderRadius: 999 }}>MÁS POPULAR</span>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{p.nombre}</p>
                      <p style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: 2 }}>{p.creditos} · {p.features[0]}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 800, color: p.color, fontSize: '1.2rem', letterSpacing: '-0.03em' }}>{p.precio}</p>
                      <p style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{p.periodo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-main" style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: '12px' }} onClick={() => { setModalPlan(false); router.push('/precios') }}>
              Ver todos los planes →
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL ELIMINAR ── */}
      {modalDelete && (
        <div className="overlay" onClick={() => { setModalDelete(false); setConfirmText('') }}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚠️</div>
              <h2 style={{ fontWeight: 800, color: '#dc2626', fontSize: '1.1rem', marginBottom: 8 }}>¿Eliminar tu cuenta?</h2>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.6 }}>Esta acción es permanente. Se eliminarán todos tus datos, planificaciones, evaluaciones y configuraciones.</p>
            </div>
            <div className="divider" />
            <div style={{ marginBottom: 16 }}>
              <label className="lbl" style={{ color: '#dc2626' }}>Escribe CONFIRMAR para continuar</label>
              <input className="inp" type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="CONFIRMAR" style={{ borderColor: confirmText === 'CONFIRMAR' ? '#dc2626' : '#e2e8f0', marginTop: 6 }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-sec" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setModalDelete(false); setConfirmText('') }}>Cancelar</button>
              <button
                onClick={eliminarCuenta}
                disabled={confirmText !== 'CONFIRMAR' || deleting}
                style={{ flex: 1, padding: '10px 20px', background: confirmText === 'CONFIRMAR' ? '#dc2626' : '#f3f4f6', color: confirmText === 'CONFIRMAR' ? 'white' : '#9CA3AF', fontWeight: 600, fontSize: '0.85rem', border: 'none', borderRadius: 8, cursor: confirmText === 'CONFIRMAR' ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.2s' }}
              >
                {deleting ? 'Eliminando...' : '🗑️ Eliminar cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}`

fs.writeFileSync('./app/configuracion/page.tsx', content, 'utf8')
console.log('✅ Configuración creada!')