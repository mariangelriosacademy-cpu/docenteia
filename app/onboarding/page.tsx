import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const MATERIAS = [
  'Matemáticas',
  'Lengua y Literatura',
  'Ciencias Naturales',
  'Física',
  'Química',
  'Biología',
  'Historia',
  'Geografía',
  'Ciencias Sociales',
  'Educación Cívica',
  'Arte y Cultura',
  'Educación Física',
  'Inglés',
  'Francés',
  'Tecnología e Informática',
  'Filosofía',
  'Ética y Valores',
  'Economía',
  'Estadística',
  'Psicología',
  'Otra',
]

async function guardarPerfil(formData: FormData) {
  'use server'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const materiasSeleccionadas = formData.getAll('materias') as string[]
  const otraMateria = formData.get('otra_materia') as string

  const materias = otraMateria?.trim()
    ? [...materiasSeleccionadas.filter(m => m !== 'Otra'), otraMateria.trim()]
    : materiasSeleccionadas

  await supabase.from('profiles').upsert({
    id:                  user.id,
    materias,
    onboarding_completo: true,
  })

  redirect('/dashboard')
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completo, nombre, plan')
    .eq('id', user.id)
    .single()

  if (profile?.onboarding_completo) redirect('/dashboard')

  const nombre = profile?.nombre || user.user_metadata?.nombre || 'Docente'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d0a2e 0%, #1A2B56 60%, #0d2a4e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .materia-chip input[type="checkbox"] { display: none; }
        .materia-chip label { display: inline-block; padding: 8px 16px; border-radius: 999px; font-size: 0.85rem; font-weight: 500; border: 1.5px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.18s; background: rgba(255,255,255,0.04); user-select: none; }
        .materia-chip input:checked + label { background: rgba(0,163,255,0.2); border-color: #00A3FF; color: #00D2FF; font-weight: 600; }
        .materia-chip label:hover { border-color: rgba(0,163,255,0.4); color: white; }
        .btn-submit { width: 100%; padding: 14px; background: linear-gradient(135deg, #00A3FF 0%, #8E2DE2 100%); color: white; font-weight: 700; font-size: 1rem; border: none; border-radius: 10px; cursor: pointer; transition: all 0.2s; font-family: inherit; box-shadow: 0 4px 20px rgba(0,163,255,0.3); }
        .btn-submit:hover { opacity: 0.92; transform: translateY(-1px); }
        .otra-input { width: 100%; padding: 10px 14px; border: 1.5px solid rgba(255,255,255,0.12); border-radius: 9px; font-size: 0.9rem; font-family: inherit; color: white; background: rgba(255,255,255,0.06); outline: none; transition: all 0.2s; margin-top: 12px; }
        .otra-input:focus { border-color: #00A3FF; background: rgba(0,163,255,0.08); }
        .otra-input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>

      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎓</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: 10 }}>
            ¡Bienvenido a Docenly,{' '}
            <span style={{ background: 'linear-gradient(135deg, #00D2FF, #8E2DE2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {nombre.split(' ')[0]}!
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Un último paso — ¿qué materias impartes?<br />
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Esto nos ayuda a personalizar tu contenido con IA.</span>
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '32px 36px',
          backdropFilter: 'blur(12px)',
        }}>
          <form action={guardarPerfil}>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 16, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Selecciona todas las que apliquen
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {MATERIAS.map(m => (
                  <div key={m} className="materia-chip">
                    <input
                      type="checkbox"
                      id={`materia-${m}`}
                      name="materias"
                      value={m}
                    />
                    <label htmlFor={`materia-${m}`}>{m}</label>
                  </div>
                ))}
              </div>

              {/* Campo para escribir si selecciona Otra */}
              <input
                type="text"
                name="otra_materia"
                placeholder="Si seleccionaste 'Otra', escríbela aquí..."
                className="otra-input"
              />
            </div>

            <button type="submit" className="btn-submit">
              Comenzar mi experiencia en Docenly ✨
            </button>

          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.78rem', color: 'rgba(255,255,255,0.25)' }}>
          Puedes actualizar esta información en tu perfil en cualquier momento.
        </p>
      </div>
    </div>
  )
}