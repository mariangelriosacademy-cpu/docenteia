interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'violet' | 'gray'
  size?: 'sm' | 'md'
}

export default function Badge({ children, variant = 'blue', size = 'md' }: BadgeProps) {
  const variants = {
    blue:   'bg-blue-50 text-blue-700 border border-blue-200',
    green:  'bg-green-50 text-green-700 border border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    red:    'bg-red-50 text-red-700 border border-red-200',
    violet: 'bg-violet-50 text-violet-700 border border-violet-200',
    gray:   'bg-gray-50 text-gray-600 border border-gray-200',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  }

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}