'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'

const navGroups = [
  {
    grupo: '',
    items: [
      { label: 'Dashboard', href: '/dashboard', icono: '⊞', subs: [] },
    ]
  },
  {
    grupo: 'Gestión',
    items: [
      { label: 'Oficina', href: '/dashboard/oficina', icono: '◈',
        subs: [{ label: 'Correos', href: '/dashboard/oficina/correos' }, { label: 'Comunicados', href: '/dashboard/oficina/comunicados' }, { label: 'Plantillas', href: '/dashboard/oficina/plantillas' }, { label: 'Asistencias', href: '/dashboard/oficina/asistencias' }, { label: 'Calificaciones', href: '/dashboard/oficina/calificaciones' }] },
      { label: 'Mis Clases', href: '/dashboard/clases', icono: '⊟',
        subs: [{ label: 'Asignaturas/Niveles', href: '/dashboard/clases/asignaturas' }, { label: 'Actividades', href: '/dashboard/clases/actividades' }, { label: 'Instrumentos', href: '/dashboard/clases/instrumentos' }] },
      { label: 'Planeación', href: '/dashboard/planeacion', icono: '⊡', subs: [] },
      { label: 'Evaluaciones', href: '/dashboard/evaluaciones', icono: '◎',
        subs: [{ label: 'Seguimiento', href: '/dashboard/evaluaciones/seguimiento' }, { label: 'Corrección', href: '/dashboard/evaluaciones/correccion' }, { label: 'Automatización', href: '/dashboard/evaluaciones/automatizacion' }] },
      { label: 'Retroalimentación', href: '/dashboard/retroalimentacion', icono: '◉',
        subs: [{ label: 'Foro', href: '/dashboard/retroalimentacion/foro' }, { label: 'Comentarios', href: '/dashboard/retroalimentacion/comentarios' }] },
        { label: 'Diagnóstico de Aula', href: '/dashboard/diagnostico', icono: '🔍', subs: [] },
    ]
  },
  {
    grupo: 'Formación',
    items: [
      { label: 'Formación', href: '/dashboard/formacion', icono: '◈',
        subs: [{ label: 'Presencial', href: '/dashboard/formacion/presencial' }, { label: 'E-learning', href: '/dashboard/formacion/elearning' }, { label: 'En vivo', href: '/dashboard/formacion/vivo' }] },
      { label: 'Contenidos', href: '/dashboard/contenidos', icono: '🗂️',
  subs: [{ label: 'Mi repositorio', href: '/dashboard/contenidos' }, { label: 'Nuevo contenido', href: '/dashboard/contenidos/nuevo' }] },
      { label: 'Prompts IA', href: '/dashboard/prompts', icono: '◬',
  subs: [
    { label: 'Mis prompts', href: '/dashboard/prompts' },
    { label: 'Comunidad', href: '/dashboard/prompts/comunidad' },
    { label: 'Nuevo prompt', href: '/dashboard/prompts/nuevo' },
  ]},
      { label: 'Mi Aprendizaje', href: '/dashboard/aprendizaje', icono: '◍',
        subs: [{ label: 'Cursos', href: '/dashboard/aprendizaje/cursos' }, { label: 'Tutoriales', href: '/dashboard/aprendizaje/tutoriales' }] },
    ]
  },
  
  {
    grupo: 'Mi cuenta',
    items: [
      { label: 'Mi Perfil',     href: '/dashboard/perfil',        icono: '◯', subs: [] },
      { label: 'Configuración', href: '/configuracion',           icono: '◎', subs: [] },
    ]
  },
]

interface Props {
  nombre: string
  plan: string
  iniciales: string
  avatarUrl?: string | null
  signOutAction: () => Promise<void>
}

function NavItem({ item }: { item: typeof navGroups[0]['items'][0] }) {
  const [open, setOpen] = useState(false)
  const [subY, setSubY] = useState(0)
  const itemRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect()
      setSubY(rect.top)
    }
    setOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }

  const handleSubEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  const handleSubLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }

  if (item.subs.length === 0) {
    return (
      <Link href={item.href} style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '6px 12px', borderRadius: 4,
        fontSize: 13.5, fontWeight: 400,
        color: '#c5c7d4', textDecoration: 'none',
        transition: 'all 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c5c7d4' }}
      >
        <span style={{ fontSize: 12, opacity: 0.6 }}>{item.icono}</span>
        <span>{item.label}</span>
      </Link>
    )
  }

  return (
    <div ref={itemRef} style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={item.href} style={{
        display: 'flex', alignItems: 'center', gap: 9,
        padding: '6px 12px', borderRadius: 4,
        fontSize: 13.5, fontWeight: 400,
        color: open ? 'white' : '#c5c7d4', textDecoration: 'none',
        background: open ? 'rgba(255,255,255,0.07)' : 'transparent',
        transition: 'all 0.15s',
      }}>
        <span style={{ fontSize: 12, opacity: 0.6 }}>{item.icono}</span>
        <span>{item.label}</span>
        <span style={{
          fontSize: 8, marginLeft: 'auto',
          color: open ? '#00A3FF' : 'rgba(255,255,255,0.25)',
          transform: open ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.2s',
        }}>▶</span>
      </Link>

      {open && (
        <div
          onMouseEnter={handleSubEnter}
          onMouseLeave={handleSubLeave}
          style={{
            position: 'fixed',
            left: 224,
            top: subY,
            background: '#1e2230',
            borderRadius: '0 8px 8px 0',
            padding: '6px 0',
            minWidth: 200,
            boxShadow: '8px 4px 32px rgba(0,0,0,0.5)',
            zIndex: 9999,
            border: '1px solid rgba(255,255,255,0.07)',
            borderLeft: '3px solid #00A3FF',
          }}
        >
          <div style={{
            fontSize: 10, fontWeight: 700,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '8px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 4,
          }}>
            {item.label}
          </div>
          {item.subs.map(sub => (
            <Link key={sub.href} href={sub.href} style={{
              display: 'block', padding: '9px 18px',
              fontSize: 13, color: '#c5c7d4',
              textDecoration: 'none', fontWeight: 400,
              transition: 'all 0.12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,163,255,0.12)'; e.currentTarget.style.color = '#00D2FF'; e.currentTarget.style.paddingLeft = '24px' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c5c7d4'; e.currentTarget.style.paddingLeft = '18px' }}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ nombre, plan, iniciales, avatarUrl, signOutAction }: Props) {
  const isPro = plan === 'pro'

  return (
    <>
      <style>{`
        .scroll-sb { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent; }
        .nav-grupo { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; color: rgba(255,255,255,0.22); padding: 16px 14px 5px; text-transform: uppercase; }
        .signout-btn { display: flex; align-items: center; gap: 9px; padding: 6px 12px; border-radius: 4px; font-size: 13px; color: rgba(255,255,255,0.35); background: transparent; border: none; cursor: pointer; width: 100%; transition: all 0.15s; font-family: inherit; }
        .signout-btn:hover { color: #ff8080; background: rgba(255,60,60,0.08); }
      `}</style>

      <aside style={{
        width: 224, position: 'fixed', height: '100vh', zIndex: 20,
        background: '#191e2e', display: 'flex', flexDirection: 'column',
        boxShadow: '1px 0 0 rgba(255,255,255,0.05)',
      }}>

        {/* Logo */}
        <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/logo.png" alt="DocenteIA" width={180} height={56}
            style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>

        {/* Perfil */}
        <div style={{ padding: '3px 12px 4px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/configuracion" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginBottom: 8 }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={iniciales}
                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.15)' }}
              />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {iniciales}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: 'white', fontSize: 13, fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</p>
              <span style={{ fontSize: 9.5, fontWeight: 600, padding: '1px 6px', borderRadius: 999, background: isPro ? 'rgba(0,163,255,0.2)' : 'rgba(255,255,255,0.07)', color: isPro ? '#00D2FF' : 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                {isPro ? 'PRO' : 'FREE'}
              </span>
            </div>
          </Link>
          {!isPro && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 999, height: 3 }}>
                <div style={{ background: 'linear-gradient(90deg,#00A3FF,#8E2DE2)', height: 3, borderRadius: 999, width: '30%' }} />
              </div>
              <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>15/50</span>
              <Link href="/precios" style={{ fontSize: 9.5, fontWeight: 600, color: '#00A3FF', textDecoration: 'none', whiteSpace: 'nowrap' }}>↑ Pro</Link>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="scroll-sb" style={{ flex: 1, padding: '0px 6px', overflowY: 'auto' }}>
          {navGroups.map(group => (
            <div key={group.grupo}>
              {group.grupo && <div className="nav-grupo">{group.grupo}</div>}
              {group.items.map(item => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
          ))}
        </nav>

        {/* Referidos */}
        <div style={{ padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/dashboard/referidos" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, background: 'rgba(142,45,226,0.1)', border: '1px solid rgba(142,45,226,0.18)', textDecoration: 'none' }}>
            <span style={{ fontSize: 13 }}>🎁</span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#c084fc', lineHeight: 1.2 }}>Gana 450 créditos</p>
              <p style={{ fontSize: 9.5, color: 'rgba(192,132,252,0.55)' }}>Referir un docente</p>
            </div>
          </Link>
        </div>

        {/* Sign out */}
        <div style={{ padding: '4px 6px 10px' }}>
          <form action={signOutAction}>
            <button type="submit" className="signout-btn">
              <span style={{ fontSize: 13 }}>⎋</span>
              <span>Cerrar sesión</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}