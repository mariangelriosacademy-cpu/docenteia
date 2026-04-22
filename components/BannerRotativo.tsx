'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const banners = [
  {
    tipo: 'imagen',
    bg: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80',
    titulo: 'Planifica mejor, enseña más',
    subtitulo: 'Genera planificaciones completas en minutos con IA adaptada a tu currículo.',
    cta: 'Ir a Planeación',
    href: '/dashboard/planeacion',
    overlay: 'rgba(26,43,86,0.82)',
  },
  {
    tipo: 'imagen',
    bg: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1200&q=80',
    titulo: 'Evalúa con inteligencia',
    subtitulo: 'Crea evaluaciones, rúbricas y listas de cotejo adaptadas al nivel de tus estudiantes.',
    cta: 'Crear evaluación',
    href: '/dashboard/evaluaciones/nueva',
    overlay: 'rgba(142,45,226,0.82)',
  },
  {
    tipo: 'imagen',
    bg: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
    titulo: 'El aula que siempre quisiste',
    subtitulo: 'Gestiona asistencia, calificaciones y comunicados desde un solo lugar.',
    cta: 'Ver Oficina',
    href: '/dashboard/oficina',
    overlay: 'rgba(0,134,138,0.82)',
  },
  {
    tipo: 'pro',
    bg: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200&q=80',
    titulo: '¡Pásate a Pro y desbloquea todo!',
    subtitulo: 'Planificaciones ilimitadas, IA avanzada, exportar PDF/Word y soporte prioritario.',
    cta: '✨ Activar Pro ahora',
    href: '/precios',
    overlay: 'rgba(10,8,40,0.88)',
    esPro: true,
  },
]

export default function BannerRotativo({ isPro }: { isPro: boolean }) {
  const [actual, setActual] = useState(0)
  const [animando, setAnimando] = useState(false)

  const bannersVisibles = isPro
    ? banners.filter(b => !b.esPro)
    : banners

  const cambiar = useCallback((idx: number) => {
    setAnimando(true)
    setTimeout(() => {
      setActual(idx)
      setAnimando(false)
    }, 300)
  }, [])

  const siguiente = useCallback(() => {
    cambiar((actual + 1) % bannersVisibles.length)
  }, [actual, bannersVisibles.length, cambiar])

  const anterior = () => {
    cambiar((actual - 1 + bannersVisibles.length) % bannersVisibles.length)
  }

  useEffect(() => {
    const timer = setInterval(siguiente, 5000)
    return () => clearInterval(timer)
  }, [siguiente])

  const banner = bannersVisibles[actual]
  if (!banner) return null

  return (
    <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 200 }}>

      {/* Imagen de fondo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('${banner.bg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.3s ease',
        opacity: animando ? 0 : 1,
      }} />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: banner.overlay,
        transition: 'opacity 0.3s ease',
        opacity: animando ? 0 : 1,
      }} />

      {/* Contenido */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        opacity: animando ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}>
        <div style={{ maxWidth: 560 }}>
          {banner.esPro && (
            <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,#00A3FF,#8E2DE2)', color: 'white', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 999, marginBottom: 10, letterSpacing: '0.06em' }}>
              OFERTA ESPECIAL
            </span>
          )}
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {banner.titulo}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, marginBottom: 16 }}>
            {banner.subtitulo}
          </p>
          <Link href={banner.href} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 20px', borderRadius: 8,
            background: banner.esPro ? 'linear-gradient(135deg,#00A3FF,#8E2DE2)' : 'white',
            color: banner.esPro ? 'white' : '#1A2B56',
            fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            transition: 'opacity 0.2s',
          }}>
            {banner.cta} →
          </Link>
        </div>

        {/* Flechas */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={anterior} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>‹</button>
          <button onClick={siguiente} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white', fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>›</button>
        </div>
      </div>

      {/* Indicadores */}
      <div style={{
        position: 'absolute', bottom: 14, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 6, zIndex: 3,
      }}>
        {bannersVisibles.map((_, i) => (
          <button
            key={i}
            onClick={() => cambiar(i)}
            style={{
              width: i === actual ? 20 : 6,
              height: 6, borderRadius: 999,
              background: i === actual ? 'white' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}