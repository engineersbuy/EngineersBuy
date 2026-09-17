import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import type { ProductImage } from '@/types'

// ─── Product Gallery ────────────────────────────────────────────────────────────

interface ProductGalleryProps {
  images?: ProductImage[]
  name: string
}

export default function ProductGallery({ images = [], name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const allImages = images && images.length > 0 ? images : [{ url: '/placeholder.png', publicId: '', alt: name }]
  const total = allImages.length

  const goNext = useCallback(() => setSelected((s) => (s + 1) % total), [total])
  const goPrev = useCallback(() => setSelected((s) => (s - 1 + total) % total), [total])

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, goNext, goPrev])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {/* Main Image */}
        <div
          className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-muted/20 cursor-zoom-in"
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={selected}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.2 }}
              src={allImages[selected].url}
              alt={allImages[selected].alt || name}
              className="h-full w-full object-contain p-2"
              loading={selected === 0 ? 'eager' : 'lazy'}
              style={
                zoomed
                  ? {
                      transform: 'scale(2)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transition: 'transform-origin 0.1s ease',
                    }
                  : undefined
              }
            />
          </AnimatePresence>

          {/* Image Counter Badge */}
          {total > 1 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white pointer-events-none">
              {selected + 1} / {total}
            </div>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(true)
            }}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/75"
            aria-label="View fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {/* Arrow Navigation */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-md text-foreground opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-md text-foreground opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {total > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {allImages.map((img, i) => (
              <button
                key={img.publicId || i}
                onClick={() => setSelected(i)}
                className={cn(
                  'relative shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-xl border-2 overflow-hidden bg-muted/20 p-1 transition-all',
                  i === selected
                    ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                    : 'border-border/60 hover:border-border opacity-70 hover:opacity-100'
                )}
              >
                <img
                  src={img.url}
                  alt={img.alt || `${name} ${i + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close fullscreen view"
            >
              <X className="h-5 w-5" />
            </button>

            {total > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="max-h-[85vh] max-w-[85vw] overflow-hidden">
              <motion.img
                key={selected}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={allImages[selected].url}
                alt={allImages[selected].alt || name}
                className="max-h-[85vh] max-w-[85vw] object-contain"
              />
            </div>

            {total > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                {selected + 1} of {total}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
