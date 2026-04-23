'use client'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Skeleton, { SkeletonCard } from '@/components/ui/Skeleton'

export default function UIDemoPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLoadingDemo = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1A2B56', marginBottom: 8 }}>
        🎨 Librería de Componentes UI
      </h1>
      <p style={{ color: '#6B7280', marginBottom: 48 }}>Docenly — Componentes reutilizables</p>

      {/* BUTTONS */}
      <Card title="Botones" subtitle="4 variantes y 3 tamaños" className="mb-8">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <Button size="sm">Pequeño</Button>
          <Button size="md">Mediano</Button>
          <Button size="lg">Grande</Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Button loading={loading} onClick={handleLoadingDemo}>
            {loading ? 'Cargando...' : 'Probar loading'}
          </Button>
          <Button disabled>Deshabilitado</Button>
        </div>
      </Card>

      {/* INPUTS */}
      <Card title="Inputs" subtitle="Con label, error y helper text" className="mb-8">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Input label="Nombre completo" placeholder="María González" required />
          <Input label="Correo electrónico" type="email" placeholder="tu@correo.com" />
          <Input label="Con error" placeholder="Escribe algo" error="Este campo es requerido" />
          <Input label="Con helper text" placeholder="Escribe algo" helperText="Mínimo 8 caracteres" />
          <Input label="Textarea" textarea placeholder="Escribe tu mensaje aquí..." />
        </div>
      </Card>

      {/* BADGES */}
      <Card title="Badges" subtitle="6 variantes de color" className="mb-8">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Badge variant="blue">Matemáticas</Badge>
          <Badge variant="green">Activo</Badge>
          <Badge variant="yellow">Pendiente</Badge>
          <Badge variant="red">Urgente</Badge>
          <Badge variant="violet">Pro</Badge>
          <Badge variant="gray">Borrador</Badge>
          <Badge variant="blue" size="sm">Pequeño</Badge>
          <Badge variant="green" size="sm">✓ Completado</Badge>
        </div>
      </Card>

      {/* MODAL */}
      <Card title="Modal" subtitle="Diálogo de confirmación" className="mb-8">
        <Button onClick={() => setModalOpen(true)}>Abrir Modal</Button>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="¿Confirmar acción?"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button variant="danger" onClick={() => setModalOpen(false)}>Confirmar</Button>
            </>
          }
        >
          <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7 }}>
            ¿Estás seguro de que deseas realizar esta acción? Esta operación no se puede deshacer.
          </p>
        </Modal>
      </Card>

      {/* SKELETON */}
      <Card title="Skeleton" subtitle="Estados de carga" className="mb-8">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton height="h-6" width="w-1/2" />
            <Skeleton height="h-4" />
            <Skeleton height="h-4" width="w-4/5" />
            <Skeleton height="h-4" width="w-3/5" />
            <Skeleton height="h-10" rounded="lg" />
          </div>
          <SkeletonCard />
        </div>
      </Card>

    </div>
  )
}