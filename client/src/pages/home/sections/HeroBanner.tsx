import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Award, Microscope, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useActiveBanners } from '@/hooks/useHomeData'

// ─── Fallback Banners ───────────────────────────────────────────────────────────

const fallbackBanners = [
  {
    _id: '1',
    badge: 'Innovation with Precision',
    badgeColor: 'border-amber-400/30 bg-amber-500/10 text-amber-300',
    title: 'Equipping Scientific Minds with Precision Instruments',
    subtitle: 'From analytical balances and microscopes to borosilicate glassware — authentic laboratory tools sourced for research excellence.',
    link: '/shop',
    secondaryLink: '/categories',
    secondaryText: 'Explore Categories',
    gradient: 'from-[#031430] via-[#072654] to-[#0a4595]',
    accentGlow: 'bg-blue-500/20',
    stats: { primary: '5,000+', label: 'Lab Products' },
  },
  {
    _id: '2',
    badge: 'Certified Research Quality',
    badgeColor: 'border-blue-400/30 bg-blue-500/10 text-blue-200',
    title: 'Lab Glassware & Precision Analytical Tools',
    subtitle: 'Up to 40% off on Borosil, Riviera, and Labman equipment. Certified for university labs, hospitals, and industrial testing.',
    link: '/deals',
    secondaryLink: '/brands',
    secondaryText: 'View Top Brands',
    gradient: 'from-[#041a3a] via-[#093574] to-[#06244f]',
    accentGlow: 'bg-amber-500/15',
    stats: { primary: '150+', label: 'Partner Universities' },
  },
  {
    _id: '3',
    badge: 'Student & Institutional Support',
    badgeColor: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
    title: 'STEM & Engineering Lab Project Kits',
    subtitle: 'Tailored laboratory kits, chemicals, and measurement sensors for colleges, engineering students, and educators at institutional rates.',
    link: '/shop?tag=student',
    secondaryLink: '/contact',
    secondaryText: 'Request Institutional RFQ',
    gradient: 'from-[#020e24] via-[#072552] to-[#0b489d]',
    accentGlow: 'bg-blue-600/20',
    stats: { primary: '100%', label: 'Breakage-Safe Dispatch' },
  },
]

// ─── Hero Banner ────────────────────────────────────────────────────────────────

export default function HeroBanner() {
  const { data: banners } = useActiveBanners()
  const [current, setCurrent] = useState(0)

  const slides = banners && banners.length > 0 ? banners : null
  const items = slides || fallbackBanners
  const total = items.length

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative w-full overflow-hidden bg-slate-950">
      <div className="relative h-[480px] sm:h-[520px] lg:h-[580px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            {slides ? (
              /* API banner with image */
              <div className="relative h-full w-full">
                <img
                  src={slides[current].image?.url}
                  alt={slides[current].title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container">
                    <div className="max-w-2xl space-y-6">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                        Scientific Wala • Innovation with Precision
                      </div>
                      <motion.h2
                        initial={{ y: 25, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-display-md sm:text-display-lg lg:text-display-xl font-heading text-white tracking-tight"
                      >
                        {slides[current].title}
                      </motion.h2>
                      {slides[current].subtitle && (
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.35, duration: 0.5 }}
                          className="text-body-md sm:text-body-lg text-slate-200/90 max-w-xl leading-relaxed"
                        >
                          {slides[current].subtitle}
                        </motion.p>
                      )}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        <Button asChild size="xl" variant="gradient" className="group shadow-lg shadow-blue-500/25">
                          <Link to={slides[current].link || '/shop'}>
                            Shop Now
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback gradient banner with high-precision laboratory visual */
              <div className={`relative h-full w-full bg-gradient-to-br ${fallbackBanners[current].gradient}`}>
                {/* Precision Grid & Hex Dot Pattern */}
                <div className="absolute inset-0 bg-grid opacity-[0.06]" />
                <div className="absolute inset-0 bg-hex-pattern opacity-[0.12]" />

                {/* Atmospheric Glow Orbs */}
                <div className={`absolute -top-10 right-1/4 w-[500px] h-[500px] rounded-full ${fallbackBanners[current].accentGlow} blur-[140px] pointer-events-none`} />
                <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

                {/* Decorative Hexagon Molecule Emblem (Logo Motif) */}
                <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none opacity-25">
                  <svg width="420" height="420" viewBox="0 0 200 200" fill="none" className="animate-float">
                    <polygon
                      points="100,20 170,60 170,140 100,180 30,140 30,60"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />
                    <polygon
                      points="100,35 155,67 155,133 100,165 45,133 45,67"
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                    />
                    {/* Node circles */}
                    <circle cx="100" cy="20" r="7" fill="#f59e0b" />
                    <circle cx="170" cy="60" r="7" fill="#3b82f6" />
                    <circle cx="170" cy="140" r="7" fill="#3b82f6" />
                    <circle cx="100" cy="180" r="7" fill="#f59e0b" />
                    <circle cx="30" cy="140" r="7" fill="#3b82f6" />
                    <circle cx="30" cy="60" r="7" fill="#3b82f6" />
                    <circle cx="100" cy="100" r="12" fill="#0b5ed7" stroke="#f59e0b" strokeWidth="3" />
                  </svg>
                </div>

                <div className="absolute inset-0 flex items-center">
                  <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-8 max-w-2xl space-y-6">
                        {/* Eyebrow Badge */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.5 }}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold backdrop-blur-md border ${fallbackBanners[current].badgeColor}`}
                        >
                          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                          {fallbackBanners[current].badge}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                          initial={{ y: 25, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="text-display-sm sm:text-display-lg lg:text-display-xl font-heading text-white tracking-tight leading-[1.12]"
                        >
                          {fallbackBanners[current].title}
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.35, duration: 0.5 }}
                          className="text-body-md sm:text-body-lg text-slate-300 max-w-xl leading-relaxed"
                        >
                          {fallbackBanners[current].subtitle}
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className="flex flex-wrap gap-3.5 pt-2"
                        >
                          <Button
                            asChild
                            size="lg"
                            className="bg-white text-brand-900 hover:bg-slate-100 font-bold shadow-xl shadow-black/20 group hover:shadow-brand-500/20"
                          >
                            <Link to={fallbackBanners[current].link}>
                              Explore Products
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-md"
                          >
                            <Link to={fallbackBanners[current].secondaryLink}>
                              {fallbackBanners[current].secondaryText}
                            </Link>
                          </Button>
                        </motion.div>
                      </div>

                      {/* Right Metric Pill on Large Screens */}
                      <div className="hidden lg:flex lg:col-span-4 justify-end">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-xl p-6 text-white max-w-xs shadow-2xl space-y-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                              <Microscope className="h-6 w-6" />
                            </div>
                            <div>
                              <div className="text-2xl font-black text-white">
                                {fallbackBanners[current].stats.primary}
                              </div>
                              <div className="text-xs text-slate-300 font-medium">
                                {fallbackBanners[current].stats.label}
                              </div>
                            </div>
                          </div>
                          <div className="h-px w-full bg-white/10" />
                          <div className="space-y-2 text-xs text-slate-300">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                              <span>100% Genuine Certified Equipment</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-amber-400 shrink-0" />
                              <span>Institutional & Academic GST Invoicing</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Navigation Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Pagination Indicators */}
      {total > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
