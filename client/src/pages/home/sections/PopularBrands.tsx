import { useBrands } from '@/hooks/useHomeData'
import { SectionHeader } from './SectionHeader'
import { Link } from 'react-router'

// ─── Popular Brands ─────────────────────────────────────────────────────────────

const fallbackBrands = [
  { name: 'Borosil', slug: 'borosil' },
  { name: 'Himedia', slug: 'himedia' },
  { name: 'Riviera', slug: 'riviera' },
  { name: 'Labman', slug: 'labman' },
  { name: 'Remi', slug: 'remi' },
  { name: 'Tarsons', slug: 'tarsons' },
  { name: 'Fisher Scientific', slug: 'fisher-scientific' },
  { name: 'Merck', slug: 'merck' },
  { name: 'Loba Chemie', slug: 'loba-chemie' },
  { name: 'SRL', slug: 'srl' },
]

export default function PopularBrands() {
  const { data: apiBrands } = useBrands()
  const brands = apiBrands && apiBrands.length > 0 ? apiBrands : fallbackBrands

  // Double the brands for seamless marquee
  const marqueeItems = [...brands, ...brands]

  return (
    <section className="py-16 lg:py-20 overflow-hidden">
      <div className="container">
        <SectionHeader
          title="Authorized Scientific Brands"
          subtitle="Directly sourced from premier Indian and international laboratory manufacturers"
          link="/brands"
          linkText="All Brands"
        />
      </div>

      {/* Marquee row 1 */}
      <div className="relative mt-2">
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {marqueeItems.map((brand, i) => (
            <Link
              key={`r1-${brand.slug}-${i}`}
              to={`/brand/${brand.slug}`}
              className="shrink-0 mx-2 group"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/85 backdrop-blur-sm px-6 py-3 transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover hover:-translate-y-0.5">
                <span className="h-2 w-2 rounded-full bg-amber-400/80 group-hover:bg-amber-400 group-hover:scale-125 transition-all shadow-sm" />
                <span className="text-sm font-semibold text-foreground whitespace-nowrap group-hover:text-primary transition-colors">
                  {brand.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Marquee row 2 — reversed direction */}
      <div className="relative mt-3">
        <div className="flex animate-marquee hover:[animation-play-state:paused]" style={{ animationDirection: 'reverse', animationDuration: '35s' }}>
          {marqueeItems.map((brand, i) => (
            <Link
              key={`r2-${brand.slug}-${i}`}
              to={`/brand/${brand.slug}`}
              className="shrink-0 mx-2 group"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/85 backdrop-blur-sm px-6 py-3 transition-all duration-300 hover:border-primary/40 hover:shadow-card-hover hover:-translate-y-0.5">
                <span className="h-2 w-2 rounded-full bg-amber-400/80 group-hover:bg-amber-400 group-hover:scale-125 transition-all shadow-sm" />
                <span className="text-sm font-semibold text-foreground whitespace-nowrap group-hover:text-primary transition-colors">
                  {brand.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
