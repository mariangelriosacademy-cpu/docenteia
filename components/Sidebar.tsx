'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

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
      { label: 'Oficina', href: '/dashboard/oficina', icono: '◉',
        subs: [{ label: 'Correos', href: '/dashboard/oficina/correos' }, { label: 'Comunicados', href: '/dashboard/oficina/comunicados' }, { label: 'Plantillas', href: '/dashboard/oficina/plantillas' }, { label: 'Asistencias', href: '/dashboard/oficina/asistencias' }, { label: 'Calificaciones', href: '/dashboard/oficina/calificaciones' }, { label: 'Estudiantes', href: '/dashboard/oficina/estudiantes' }] },
      { label: 'Mis Clases', href: '/dashboard/clases', icono: '◉',
        subs: [{ label: 'Asignaturas/Niveles', href: '/dashboard/clases/asignaturas' }, { label: 'Actividades', href: '/dashboard/clases/actividades' }, { label: 'Instrumentos', href: '/dashboard/clases/instrumentos' }] },
      { label: 'Planeación', href: '/dashboard/planeacion', icono: '◉', subs: [] },
      { label: 'Evaluaciones', href: '/dashboard/evaluaciones', icono: '◉',
        subs: [{ label: 'Seguimiento', href: '/dashboard/evaluaciones/seguimiento' }, { label: 'Corrección', href: '/dashboard/evaluaciones/correccion' }, { label: 'Automatización', href: '/dashboard/evaluaciones/automatizacion' }] },
      { label: 'Retroalimentación', href: '/dashboard/retroalimentacion', icono: '◉',
        subs: [{ label: 'Foro', href: '/dashboard/retroalimentacion/foro' }, { label: 'Comentarios', href: '/dashboard/retroalimentacion/comentarios' }] },
      { label: 'Diagnóstico de Aula', href: '/dashboard/diagnostico', icono: '◉', subs: [] },
    ]
  },
  {
    grupo: 'Formación',
    items: [
      { label: 'Formación', href: '/dashboard/formacion', icono: '◉',
        subs: [{ label: 'Presencial', href: '/dashboard/formacion/presencial' }, { label: 'E-learning', href: '/dashboard/formacion/elearning' }, { label: 'En vivo', href: '/dashboard/formacion/vivo' }] },
      { label: 'Contenidos', href: '/dashboard/contenidos', icono: '◉',
        subs: [{ label: 'Mi repositorio', href: '/dashboard/contenidos' }, { label: 'Nuevo contenido', href: '/dashboard/contenidos/nuevo' }] },
      { label: 'Prompts IA', href: '/dashboard/prompts', icono: '◉',
        subs: [{ label: 'Mis prompts', href: '/dashboard/prompts' }, { label: 'Comunidad', href: '/dashboard/prompts/comunidad' }, { label: 'Nuevo prompt', href: '/dashboard/prompts/nuevo' }] },
      { label: 'Mi Aprendizaje', href: '/dashboard/aprendizaje', icono: '◉',
        subs: [{ label: 'Cursos', href: '/dashboard/aprendizaje/cursos' }, { label: 'Tutoriales', href: '/dashboard/aprendizaje/tutoriales' }] },
    ]
  },
  {
    grupo: 'Mi cuenta',
    items: [
      { label: 'Mi Perfil',     href: '/dashboard/perfil', icono: '◉', subs: [] },
      { label: 'Configuración', href: '/configuracion',    icono: '◉', subs: [] },
    ]
  },
]

// Iconos SVG por label
const ICONOS: Record<string, string> = {
  'Dashboard':           'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  'Oficina':             'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2',
  'Mis Clases':          'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'Planeación':          'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  'Evaluaciones':        'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2m-6 9l2 2 4-4',
  'Retroalimentación':   'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  'Diagnóstico de Aula': 'M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0 2 2h2',
  'Formación':           'M12 14l9-5-9-5-9 5 9 5zm0 7V14m-7-2.5A9.953 9.953 0 0 0 12 20.5a9.953 9.953 0 0 0 7-3',
  'Contenidos':          'M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10',
  'Prompts IA':          'M13 10V3L4 14h7v7l9-11h-7z',
  'Mi Aprendizaje':      'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0v10l4 2',
  'Mi Perfil':           'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'Configuración':       'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0v3m0-12v3m-6 6H3m18 0h-3m-1.5-7.5L15 9m-6 6-1.5 1.5M15 15l1.5 1.5M9 9 7.5 7.5',
}

function SvgIcon({ label, size = 15, color = 'currentColor' }: { label: string; size?: number; color?: string }) {
  const d = ICONOS[label] || 'M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0'
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      <path d={d} />
    </svg>
  )
}

interface NavItemProps {
  item: typeof navGroups[0]['items'][0]
  collapsed: boolean
}

function NavItem({ item, collapsed }: NavItemProps) {
  const [open, setOpen]   = useState(false)
  const [subY, setSubY]   = useState(0)
  const itemRef           = useRef<HTMLDivElement>(null)
  const closeTimer        = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasSubs           = item.subs.length > 0

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (itemRef.current) setSubY(itemRef.current.getBoundingClientRect().top)
    setOpen(true)
  }
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div ref={itemRef} style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={item.href} style={{
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 9,
        padding: collapsed ? '8px 0' : '6px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: 400,
        color: open ? 'white' : '#c5c7d4',
        textDecoration: 'none',
        background: open ? 'rgba(0,163,255,0.08)' : 'transparent',
        transition: 'all 0.2s',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'relative',
      }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white' } }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c5c7d4' } }}
      >
        {open && !collapsed && (
          <span style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: 2, background: '#00A3FF', borderRadius: 999 }} />
        )}
        <SvgIcon label={item.label} size={15} color={open ? '#00A3FF' : 'currentColor'} />
        {!collapsed && (
          <>
            <span style={{ flex: 1 }}>{item.label}</span>
            {hasSubs && (
              <span style={{
                fontSize: 8,
                color: open ? '#00A3FF' : 'rgba(255,255,255,0.2)',
                transform: open ? 'rotate(90deg)' : 'none',
                transition: 'transform 0.2s, color 0.2s',
                marginLeft: 'auto',
              }}>▶</span>
            )}
          </>
        )}
      </Link>

      {/* Submenú flotante */}
      {open && hasSubs && (
        <div
          onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current) }}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'fixed',
            left: collapsed ? 64 : 224,
            top: subY,
            background: 'linear-gradient(160deg, #1e2436 0%, #171c2e 100%)',
            borderRadius: '0 10px 10px 0',
            padding: '6px 0',
            minWidth: 210,
            boxShadow: '8px 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,163,255,0.15)',
            zIndex: 9999,
            borderLeft: '2px solid #00A3FF',
            animation: 'slideInSub 0.18s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px 10px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 4,
          }}>
            <SvgIcon label={item.label} size={13} color="#00A3FF" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {item.label}
            </span>
          </div>
          {item.subs.map(sub => (
            <Link key={sub.href} href={sub.href} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 18px',
              fontSize: 13, color: '#c5c7d4',
              textDecoration: 'none', fontWeight: 400,
              transition: 'all 0.12s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,163,255,0.1)'; e.currentTarget.style.color = '#00D2FF'; e.currentTarget.style.paddingLeft = '24px' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c5c7d4'; e.currentTarget.style.paddingLeft = '18px' }}
            >
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(0,163,255,0.4)', flexShrink: 0 }} />
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  nombre: string
  plan: string
  iniciales: string
  avatarUrl?: string | null
  signOutAction: () => Promise<void>
}

const W_EXPANDED  = 224
const W_COLLAPSED = 64

export default function Sidebar({ nombre, plan, iniciales, avatarUrl, signOutAction }: Props) {
  const isPro = plan === 'pro'
  const [collapsed, setCollapsed] = useState(false)

  // ── Sincroniza --sb-w en #dashboard-root para que el layout se mueva ──
  useEffect(() => {
    const root = document.getElementById('dashboard-root')
    if (root) {
      root.style.setProperty('--sb-w', collapsed ? `${W_COLLAPSED}px` : `${W_EXPANDED}px`)
    }
  }, [collapsed])

  const W = collapsed ? W_COLLAPSED : W_EXPANDED

  return (
    <>
      <style>{`
        @keyframes slideInSub {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 1; }
        }
        .scroll-sb {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.06) transparent;
        }
        .nav-grupo {
          font-size: 9px; font-weight: 600; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.18); padding: 14px 14px 4px;
          text-transform: uppercase; white-space: nowrap; overflow: hidden;
        }
        .signout-btn {
          display: flex; align-items: center; gap: 9px;
          padding: 6px 12px; border-radius: 6px;
          font-size: 13px; color: rgba(255,255,255,0.35);
          background: transparent; border: none; cursor: pointer;
          width: 100%; transition: all 0.15s; font-family: inherit;
        }
        .signout-btn:hover { color: #ff8080; background: rgba(255,60,60,0.08); }
        .toggle-btn {
          width: 22px; height: 22px; border-radius: 50%;
          background: #1e2436;
          border: 1px solid rgba(0,163,255,0.35);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0,163,255,0.25);
          transition: all 0.2s; flex-shrink: 0;
        }
        .toggle-btn:hover {
          background: rgba(0,163,255,0.15);
          box-shadow: 0 0 16px rgba(0,163,255,0.5);
          border-color: #00A3FF;
        }
      `}</style>

      <aside style={{
        width: W,
        position: 'fixed',
        height: '100vh',
        zIndex: 20,
        background: 'linear-gradient(180deg, #161b2e 0%, #191e2e 60%, #141828 100%)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '1px 0 0 rgba(255,255,255,0.04), 4px 0 32px rgba(0,0,0,0.5)',
        transition: 'width 0.65s cubic-bezier(0.16,1,0.3,1)',
        overflow: 'hidden',
      }}>

        {/* ── Efectos tech de fondo ── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(0,163,255,0.18), transparent)',
            animation: 'scanline 7s linear infinite',
          }} />
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 2,
            background: 'linear-gradient(180deg, transparent 0%, #00A3FF 40%, #8E2DE2 70%, transparent 100%)',
            animation: 'glowPulse 3s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(0,163,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,163,255,0.025) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
        </div>

        {/* ── LOGO + TOGGLE ── */}
        <div style={{
          padding: collapsed ? '12px 0' : '8px 12px 6px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          position: 'relative', zIndex: 1,
          minHeight: 60, gap: 8,
        }}>
          {collapsed ? (
            <Image src="/logo.png" alt="Docenly" width={30} height={30}
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          ) : (
            <Image src="/logo.png" alt="Docenly" width={148} height={44}
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', transition: 'opacity 0.2s' }} />
          )}
          <button
            className="toggle-btn"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              {collapsed
                ? <path d="M3 2l4 3-4 3" stroke="#00A3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                : <path d="M7 2L3 5l4 3" stroke="#00A3FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              }
            </svg>
          </button>
        </div>

        {/* ── PERFIL ── */}
        <div style={{
          padding: collapsed ? '10px 0' : '8px 12px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column',
          alignItems: collapsed ? 'center' : 'stretch',
          position: 'relative', zIndex: 1,
        }}>
          <Link href="/configuracion" style={{
            display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : 9,
            justifyContent: collapsed ? 'center' : 'flex-start',
            textDecoration: 'none', marginBottom: collapsed ? 0 : 6,
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={iniciales} style={{
                width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                border: '2px solid rgba(0,163,255,0.3)', boxShadow: '0 0 8px rgba(0,163,255,0.2)',
              }} />
            ) : (
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
                boxShadow: '0 0 10px rgba(0,163,255,0.3)',
              }}>
                {iniciales}
              </div>
            )}
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontSize: 13, fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</p>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: isPro ? 'rgba(0,163,255,0.2)' : 'rgba(255,255,255,0.07)', color: isPro ? '#00D2FF' : 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
                  {isPro ? 'PRO' : 'FREE'}
                </span>
              </div>
            )}
          </Link>

          {!collapsed && !isPro && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.07)', borderRadius: 999, height: 3, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(90deg,#00A3FF,#8E2DE2)', height: 3, borderRadius: 999, width: '30%', boxShadow: '0 0 6px #00A3FF' }} />
              </div>
              <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>15/50</span>
              <Link href="/precios" style={{ fontSize: 9.5, fontWeight: 700, color: '#00A3FF', textDecoration: 'none', whiteSpace: 'nowrap' }}>↑ Pro</Link>
            </div>
          )}
        </div>

        {/* ── NAV ── */}
        <nav className="scroll-sb" style={{
          flex: 1, padding: '4px 6px',
          overflowY: 'auto', overflowX: 'hidden',
          position: 'relative', zIndex: 1,
        }}>
          {navGroups.map(group => (
            <div key={group.grupo}>
              {group.grupo && !collapsed && <div className="nav-grupo">{group.grupo}</div>}
              {group.grupo && collapsed  && <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 6px' }} />}
              {group.items.map(item => (
                <NavItem key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          ))}
        </nav>

        {/* ── REFERIDOS ── */}
        <div style={{ padding: collapsed ? '8px 0' : '8px 10px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1, display: 'flex', justifyContent: collapsed ? 'center' : 'stretch' }}>
          {collapsed ? (
            <Link href="/dashboard/referidos" title="Gana 450 créditos" style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(142,45,226,0.1)', border: '1px solid rgba(142,45,226,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', fontSize: 16,
            }}>🎁</Link>
          ) : (
            <Link href="/dashboard/referidos" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 10px', borderRadius: 8,
              background: 'rgba(142,45,226,0.1)', border: '1px solid rgba(142,45,226,0.2)',
              textDecoration: 'none', boxShadow: '0 0 12px rgba(142,45,226,0.1)',
            }}>
              <span style={{ fontSize: 13 }}>🎁</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#c084fc', lineHeight: 1.2 }}>Gana 450 créditos</p>
                <p style={{ fontSize: 9.5, color: 'rgba(192,132,252,0.5)' }}>Referir un docente</p>
              </div>
            </Link>
          )}
        </div>

        {/* ── SIGN OUT ── */}
        <div style={{ padding: '4px 6px 10px', position: 'relative', zIndex: 1 }}>
          <form action={signOutAction}>
            <button type="submit" className="signout-btn"
              style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '8px 0' : '6px 12px' }}
              title={collapsed ? 'Cerrar sesión' : undefined}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              {!collapsed && <span>Cerrar sesión</span>}
            </button>
          </form>
        </div>

      </aside>
    </>
  )
}