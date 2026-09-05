import { cn } from '@/lib/utils'

// ─── Brand Logo (static asset: /logo.svg) ────────────────────────────────────────

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-16 w-16',
} as const

interface BrandLogoProps {
  size?: keyof typeof sizeMap
  className?: string
}

export function BrandLogo({ size = 'md', className }: BrandLogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Scientific Wala"
      className={cn(
        'shrink-0 object-contain rounded-full shadow-sm border border-brand-700/15 dark:border-brand-400/20 transition-transform duration-300 group-hover:scale-105',
        sizeMap[size],
        className
      )}
    />
  )
}
