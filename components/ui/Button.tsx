import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none'

  const variants = {
    primary:   'bg-gradient-to-r from-[#00A3FF] to-[#8E2DE2] text-white hover:opacity-90 shadow-md',
    secondary: 'border-2 border-[#1A2B56] text-[#1A2B56] hover:bg-[#1A2B56] hover:text-white',
    danger:    'bg-red-600 text-white hover:bg-red-700 shadow-md',
    ghost:     'text-[#1A2B56] hover:bg-gray-100',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}