import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  footer?: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

export default function Card({ children, title, subtitle, footer, className = '', padding = 'md' }: CardProps) {
  const paddings = { sm: 'p-4', md: 'p-6', lg: 'p-8' }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      {(title || subtitle) && (
        <div className={`${paddings[padding]} border-b border-gray-100`}>
          {title && <h3 className="text-base font-bold text-gray-800">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
      {footer && (
        <div className={`${paddings[padding]} border-t border-gray-100`}>{footer}</div>
      )}
    </div>
  )
}