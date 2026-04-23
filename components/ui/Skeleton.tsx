interface SkeletonProps {
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

export default function Skeleton({ width = 'w-full', height = 'h-4', rounded = 'md', className = '' }: SkeletonProps) {
  const roundeds = { sm: 'rounded', md: 'rounded-lg', lg: 'rounded-xl', full: 'rounded-full' }

  return (
    <div className={`animate-pulse bg-gray-200 ${width} ${height} ${roundeds[rounded]} ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <Skeleton height="h-5" width="w-1/3" />
      <Skeleton height="h-4" />
      <Skeleton height="h-4" width="w-4/5" />
      <Skeleton height="h-4" width="w-3/5" />
    </div>
  )
}