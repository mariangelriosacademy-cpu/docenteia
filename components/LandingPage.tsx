'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const navItems = [
  { label: 'Inicio',       href: '#inicio' },
  { label: 'Plataforma',   href: '#plataforma' },
  { label: 'Casos de uso', href: '#casos' },
  { label: 'Precios',      href: '#precios' },
  { label: 'Testimonios',  href: '#testimonios' },
  { label: 'Contacto',     href: '#contacto' },
]

const herramientas = [
  { icono: '🧾', titulo: 'Planificación inteligente', desc: 'Desde diagnóstico hasta retroalimentación automática.' },
  { icono: '📊', titulo: 'Seguimiento estudiantil',   desc: 'Datos claros, progreso en tiempo real.' },
  { icono: '🏫', titulo: 'Gestión institucional',     desc: 'Coordina docentes, áreas y resultados.' },
  { icono: '🎥', titulo: 'Clases en vivo',            desc: 'Enseña en tiempo real sin salir de la plataforma.' },
  { icono: '📚', titulo: 'Recursos y cursos',         desc: 'Contenido listo para usar o personalizar.' },
  { icono: '💬', titulo: 'Foros y comunidad',         desc: 'Interacción continua con estudiantes.' },
]

const casosDeUso = [
  'Crear una clase completa en minutos',
  'Generar evaluaciones alineadas al currículo',
  'Monitorear el avance de cada estudiante',
  'Coordinar toda una institución',
  'Dar clases en vivo',
  'Automatizar reportes',
  'Crear cursos digitales',
  'Gestionar múltiples grupos sin esfuerzo',
]

const testimonios = [
  { texto: 'Reduje horas de trabajo a la mitad. Ahora tengo tiempo para lo que realmente importa.', nombre: 'María G.', rol: 'Docente de Primaria' },
  { texto: 'Por fin tengo todo organizado en un solo lugar. Docenly cambió mi forma de enseñar.', nombre: 'Carlos R.', rol: 'Profesor de Secundaria' },
  { texto: 'Es como tener un asistente pedagógico disponible las 24 horas del día.', nombre: 'Ana L.', rol: 'Coordinadora Académica' },
]

const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/appointments'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [count3, setCount3] = useState(0)
  const statsRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let c1 = 0, c2 = 0, c3 = 0
        const interval = setInterval(() => {
          c1 = Math.min(c1 + 50, 2000)
          c2 = Math.min(c2 + 1, 20)
          c3 = Math.min(c3 + 0.2, 8)
          setCount1(c1)
          setCount2(c2)
          setCount3(parseFloat(c3.toFixed(1)))
          if (c1 >= 2000 && c2 >= 20 && c3 >= 8) clearInterval(interval)
        }, 30)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .nav-glass    { background: rgba(255,255,255,0.95); backdrop-filter: blur(18px); border-bottom: 1px solid rgba(0,0,0,0.07); }
        .nav-scrolled { background: rgba(255,255,255,0.99); box-shadow: 0 2px 24px rgba(26,43,86,0.10); }
        .nav-link { color: #1A2B56; font-size: 1.05rem; font-weight: 600; transition: color 0.2s; text-decoration: none; white-space: nowrap; }
        .nav-link:hover { color: #00A3FF; }

        .hero-bg { position: relative; min-height: 100vh; background: linear-gradient(135deg, #0d0a2e 0%, #1A2B56 40%, #0d2a4e 100%); overflow: hidden; }
        .hero-bg::before { content: ''; position: absolute; inset: 0; background: url('/hero-bg.png') center/cover no-repeat; opacity: 0.20; }
        .hero-bg::after  { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 60%, rgba(0,163,255,0.12) 0%, transparent 65%), linear-gradient(to bottom, rgba(10,8,40,0.45) 0%, rgba(10,8,40,0.78) 100%); }
        .hero-content { position: relative; z-index: 2; }

        .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,163,255,0.15); border: 1px solid rgba(0,163,255,0.35); color: #00D2FF; font-size: 0.85rem; font-weight: 600; padding: 8px 20px; border-radius: 999px; }

        .btn-primary { background: linear-gradient(135deg, #00A3FF 0%, #8E2DE2 100%); color: white; font-weight: 700; font-size: 1.05rem; padding: 16px 36px; border-radius: 14px; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 4px 24px rgba(0,163,255,0.35); }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,163,255,0.45); }
        .btn-outline { background: transparent; color: white; font-weight: 700; font-size: 1.05rem; padding: 15px 36px; border-radius: 14px; border: 2px solid rgba(255,255,255,0.4); cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; }
        .btn-outline:hover { border-color: white; background: rgba(255,255,255,0.1); transform: translateY(-2px); }

        .btn-nav-login { color: #1A2B56; font-weight: 600; font-size: 1rem; padding: 11px 24px; border-radius: 10px; border: 1.5px solid rgba(26,43,86,0.25); background: transparent; text-decoration: none; transition: all 0.2s; }
        .btn-nav-login:hover { background: rgba(26,43,86,0.06); }
        .btn-nav-cta { background: linear-gradient(135deg, #00A3FF 0%, #8E2DE2 100%); color: white; font-weight: 700; font-size: 1rem; padding: 11px 24px; border-radius: 10px; border: none; text-decoration: none; transition: opacity 0.2s; box-shadow: 0 2px 12px rgba(0,163,255,0.3); }
        .btn-nav-cta:hover { opacity: 0.9; }

        .section-tag { display: inline-block; background: rgba(0,163,255,0.1); color: #00A3FF; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 16px; border-radius: 999px; margin-bottom: 14px; border: 1px solid rgba(0,163,255,0.2); }

        .card-herramienta { background: white; border-radius: 18px; padding: 32px; border: 1px solid #e2e8f0; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.04); cursor: default; }
        .card-herramienta:hover { box-shadow: 0 16px 48px rgba(0,163,255,0.15); transform: translateY(-6px); border-color: rgba(0,163,255,0.25); }

        .caso-item { display: flex; align-items: center; gap: 14px; padding: 16px 20px; background: white; border-radius: 14px; border: 1px solid #e2e8f0; font-size: 1rem; font-weight: 600; color: #1A2B56; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .caso-item:hover { border-color: #00A3FF; box-shadow: 0 8px 24px rgba(0,163,255,0.12); transform: translateX(4px); }

        .testimonio-card { background: white; border-radius: 20px; padding: 36px; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.05); position: relative; transition: all 0.25s; }
        .testimonio-card:hover { box-shadow: 0 12px 36px rgba(0,163,255,0.12); transform: translateY(-4px); }

        .input-contacto { width: 100%; padding: 14px 18px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 1rem; font-family: inherit; color: #1e293b; background: white; outline: none; transition: all 0.2s; }
        .input-contacto:focus { border-color: #00A3FF; box-shadow: 0 0 0 3px rgba(0,163,255,0.1); }

        .dolor-item { display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: #F8F9FA; border-radius: 14px; border-left: 4px solid #00A3FF; }

        .footer-bg { background: #070520; }
        .stat-num { font-size: 3.5rem; font-weight: 900; color: white; line-height: 1; letter-spacing: -0.04em; background: linear-gradient(135deg, #00D2FF, #00A3FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up  { animation: fadeUp 0.7s ease both; }
        .delay-1  { animation-delay: 0.15s; }
        .delay-2  { animation-delay: 0.3s; }
        .delay-3  { animation-delay: 0.45s; }
        .delay-4  { animation-delay: 0.6s; }

        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(0,163,255,0.4); } 50% { box-shadow: 0 0 0 12px rgba(0,163,255,0); } }
        .pulse { animation: pulse 2s infinite; }
      `}</style>

      {/* NAVBAR */}
      <header className={scrolled ? 'nav-scrolled' : 'nav-glass'} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'all 0.3s' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80, gap: 16 }}>
          <a href="#inicio" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <Image src="/logo.png" alt="Docenly" width={160} height={56} style={{ objectFit: 'contain' }} priority />
          </a>
          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {navItems.map(item => (<a key={item.href} href={item.href} className="nav-link">{item.label}</a>))}
          </nav>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <Link href="/login"    className="btn-nav-login">Acceder</Link>
            <Link href="/registro" className="btn-nav-cta">Prueba gratis</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="hero-bg">
        <div className="hero-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingTop: 110 }}>
          <div className="badge fade-up" style={{ marginBottom: 32 }}>✦ La educación evolucionó. Tú también.</div>
          <h1 className="fade-up delay-1" style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 900, color: 'white', lineHeight: 1.05, letterSpacing: '-0.04em', maxWidth: 860, marginBottom: 28 }}>
            La plataforma que <span style={{ background: 'linear-gradient(135deg, #00D2FF, #8E2DE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>transforma</span> tu forma de enseñar
          </h1>
          <p className="fade-up delay-2" style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.75)', maxWidth: 640, lineHeight: 1.7, marginBottom: 16 }}>
            Crea, planifica, evalúa y gestiona <strong style={{ color: 'white' }}>TODO en un solo lugar</strong> con IA.
          </p>
          <p className="fade-up delay-2" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', maxWidth: 560, lineHeight: 1.7, marginBottom: 48 }}>
            Desde el diagnóstico hasta la retroalimentación, ahorra horas cada semana y enfócate en lo que realmente importa: enseñar.
          </p>
          <div className="fade-up delay-3" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
            <Link href="/registro" className="btn-primary pulse">🚀 Empezar gratis — soy docente</Link>
            <a href="#instituciones" className="btn-outline">🏫 Ver solución para instituciones</a>
          </div>
          <p className="fade-up delay-4" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: 80 }}>
            Sin tarjeta de crédito · Resultados desde el primer día
          </p>

          {/* Stats animados */}
          <div ref={statsRef} className="fade-up delay-4" style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 64 }}>
            <div style={{ textAlign: 'center' }}>
              <div className="stat-num">+{count1.toLocaleString()}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: 6, fontWeight: 500 }}>Docentes activos</div>
            </div>
            <div style={{ width: 1, height: 52, background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ textAlign: 'center' }}>
              <div className="stat-num">{count2}+</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: 6, fontWeight: 500 }}>Países disponibles</div>
            </div>
            <div style={{ width: 1, height: 52, background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ textAlign: 'center' }}>
              <div className="stat-num">{count3} hrs</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: 6, fontWeight: 500 }}>Ahorradas por semana</div>
            </div>
            <div style={{ width: 1, height: 52, background: 'rgba(255,255,255,0.12)' }} />
            <div style={{ textAlign: 'center' }}>
              <div className="stat-num">99.9%</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: 6, fontWeight: 500 }}>Satisfacción docente</div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE DE IMPACTO */}
      <section style={{ background: '#F8F9FA', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <span className="section-tag">El problema real</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#1A2B56', letterSpacing: '-0.03em', marginBottom: 20 }}>
            ¿Aún pierdes horas en tareas que la IA puede hacer por ti?
          </h2>
          <p style={{ color: '#4A5568', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 640, margin: '0 auto 56px' }}>
            Planificaciones, evaluaciones, seguimiento, reportes… Docenly automatiza todo el proceso pedagógico para que recuperes tu tiempo.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { icono: '⏰', titulo: 'Horas perdidas en papeleo', desc: 'Docentes gastan hasta 3 horas diarias en tareas administrativas que no aportan al aprendizaje.' },
              { icono: '📋', titulo: 'Herramientas desconectadas', desc: 'Usar 5 apps distintas para una sola clase genera caos, errores y pérdida de información.' },
              { icono: '😓', titulo: 'Agotamiento docente', desc: 'La carga administrativa afecta la calidad de enseñanza y el bienestar del profesor.' },
            ].map(item => (
              <div key={item.titulo} className="dolor-item" style={{ flexDirection: 'column', background: 'white', borderLeft: '4px solid #00A3FF' }}>
                <span style={{ fontSize: '2.2rem' }}>{item.icono}</span>
                <div style={{ fontWeight: 700, color: '#1A2B56', fontSize: '1.05rem', marginTop: 8 }}>{item.titulo}</div>
                <div style={{ color: '#4A5568', fontSize: '0.9rem', lineHeight: 1.7, marginTop: 6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODO EN UNO */}
      <section id="plataforma" style={{ background: 'white', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="section-tag">Plataforma</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#1A2B56', letterSpacing: '-0.03em', marginBottom: 16 }}>
              Todo lo que necesitas, en una sola plataforma
            </h2>
            <p style={{ color: '#4A5568', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>
              Sin herramientas separadas. Sin caos. Sin perder tiempo.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {herramientas.map(h => (
              <div key={h.titulo} className="card-herramienta">
                <div style={{ fontSize: '2.4rem', marginBottom: 18 }}>{h.icono}</div>
                <h3 style={{ fontWeight: 800, color: '#1A2B56', fontSize: '1.15rem', marginBottom: 10 }}>{h.titulo}</h3>
                <p style={{ color: '#4A5568', fontSize: '0.95rem', lineHeight: 1.7 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIADOR */}
      <section style={{ background: 'linear-gradient(135deg, #0d0a2e 0%, #1A2B56 100%)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(0,163,255,0.2)', color: '#00D2FF', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 16px', borderRadius: 999, marginBottom: 20, border: '1px solid rgba(0,163,255,0.3)' }}>Por qué Docenly</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 20 }}>
            No es solo una herramienta.<br />Es tu <span style={{ background: 'linear-gradient(135deg, #00D2FF, #8E2DE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>sistema completo</span> de enseñanza.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.15rem', lineHeight: 1.8, maxWidth: 640, margin: '0 auto 48px' }}>
            Mientras otras plataformas hacen una sola cosa… Docenly conecta todo tu ecosistema educativo en un solo lugar.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {['Menos tareas, más enseñanza', 'Tu asistente educativo con IA', 'Ahorra horas. Enseña mejor.', 'Diseñada para docentes reales', 'La educación evolucionó. Tú también.'].map(f => (
              <span key={f} style={{ background: 'rgba(0,163,255,0.15)', border: '1px solid rgba(0,163,255,0.3)', color: '#00D2FF', padding: '8px 18px', borderRadius: 999, fontSize: '0.9rem', fontWeight: 600 }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CASOS DE USO */}
      <section id="casos" style={{ background: '#F8F9FA', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-tag">Casos de uso</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#1A2B56', letterSpacing: '-0.03em' }}>
              ¿Qué puedes hacer con Docenly?
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {casosDeUso.map((caso, i) => (
              <div key={caso} className="caso-item">
                <span style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #00A3FF, #8E2DE2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{i + 1}</span>
                {caso}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/registro" className="btn-primary">🚀 Empezar gratis ahora</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" style={{ background: 'white', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-tag">Testimonios</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#1A2B56', letterSpacing: '-0.03em', marginBottom: 12 }}>
              Docentes que ya están transformando su enseñanza
            </h2>
            <p style={{ color: '#4A5568', fontSize: '1rem' }}>Diseñada junto a docentes reales que enfrentan estos desafíos todos los días.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {testimonios.map(t => (
              <div key={t.nombre} className="testimonio-card">
                <div style={{ fontSize: '2rem', color: '#00A3FF', marginBottom: 16, lineHeight: 1 }}>"</div>
                <p style={{ color: '#4A5568', fontSize: '1rem', lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic' }}>{t.texto}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #00A3FF, #8E2DE2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1rem' }}>{t.nombre[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1A2B56', fontSize: '0.95rem' }}>{t.nombre}</div>
                    <div style={{ color: '#4A5568', fontSize: '0.82rem' }}>{t.rol}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTITUCIONES */}
      <section id="instituciones" style={{ background: 'linear-gradient(135deg, #0d0a2e 0%, #1A2B56 100%)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-block', background: 'rgba(0,163,255,0.2)', color: '#00D2FF', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '5px 16px', borderRadius: 999, marginBottom: 16, border: '1px solid rgba(0,163,255,0.3)' }}>Escuela</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 20, letterSpacing: '-0.03em' }}>
              Lleva Docenly a toda tu institución
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: 36 }}>
              Un panel centralizado para coordinadores y directivos. Gestiona docentes, visualiza reportes y mide el impacto real de la IA en el aprendizaje.
            </p>
            <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex' }}>
              📅 Agendar cita virtual
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icono: '👥', titulo: 'Docentes ilimitados',      desc: 'Todos tus profesores en una sola plataforma.' },
              { icono: '📊', titulo: 'Reportes institucionales', desc: 'Visualiza el uso y el impacto por área y grado.' },
              { icono: '🎓', titulo: 'Onboarding dedicado',      desc: 'Te acompañamos en cada paso de la implementación.' },
              { icono: '🔗', titulo: 'Integración con sistemas', desc: 'Compatible con tus herramientas actuales.' },
            ].map(item => (
              <div key={item.titulo} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{item.icono}</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{item.titulo}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: 2 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FUERTE */}
      <section style={{ background: '#F8F9FA', padding: '96px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#1A2B56', letterSpacing: '-0.04em', marginBottom: 20 }}>
            Empieza hoy.<br /><span style={{ background: 'linear-gradient(135deg, #00A3FF, #8E2DE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sin complicaciones.</span>
          </h2>
          <p style={{ color: '#4A5568', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: 40 }}>
            No necesitas tarjeta. Resultados desde el primer día.
          </p>
          <Link href="/registro" className="btn-primary pulse" style={{ fontSize: '1.15rem', padding: '18px 44px' }}>
            👉 Crear cuenta gratis
          </Link>
          <p style={{ color: '#4A5568', fontSize: '0.85rem', marginTop: 20 }}>Úsalo gratis para siempre · Actualiza cuando quieras</p>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ background: 'white', padding: '96px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-tag">Contacto</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: '#1A2B56', letterSpacing: '-0.03em' }}>¿Tienes preguntas?</h2>
            <p style={{ color: '#4A5568', marginTop: 12, fontSize: '1rem' }}>Escríbeme y te respondo en menos de 24 horas.</p>
            <a href={GOOGLE_CALENDAR_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, background: '#1A2B56', color: 'white', fontWeight: 600, fontSize: '0.95rem', padding: '12px 28px', borderRadius: 12, textDecoration: 'none' }}>
              📅 O agenda una cita virtual
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <input className="input-contacto" type="text"  placeholder="Tu nombre" />
              <input className="input-contacto" type="email" placeholder="Tu correo" />
            </div>
            <input    className="input-contacto" type="text" placeholder="Asunto" />
            <textarea className="input-contacto" rows={5}    placeholder="¿En qué puedo ayudarte?" style={{ resize: 'vertical' }} />
            <button className="btn-primary" style={{ alignSelf: 'flex-end', padding: '14px 36px', fontSize: '1rem' }}>Enviar mensaje</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-bg" style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, background: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/logo.png" alt="Docenly" width={36} height={36} style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>Docenly</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>IA para docentes</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            {navItems.map(item => (
              <a key={item.href} href={item.href} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00A3FF')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >{item.label}</a>
            ))}
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', width: '100%' }} />
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
            © ${new Date().getFullYear()} Docenly. Todos los derechos reservados. · IA para docentes reales.
          </p>
        </div>
      </footer>
    </div>
  )
}
