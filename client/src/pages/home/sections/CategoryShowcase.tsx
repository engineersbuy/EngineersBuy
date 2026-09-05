import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  FlaskConical, Microscope, TestTubes, Thermometer, Beaker,
  Scaling, ShieldCheck, Flame, ScanLine, Atom,
} from 'lucide-react'
import { useCategories } from '@/hooks/useHomeData'
import { staggerContainer, fadeInUp } from '@/config/animations'
import { SectionHeader } from './SectionHeader'

// ─── Fallback Categories ────────────────────────────────────────────────────────

const fallbackCategories = [
  { name: 'Lab Glassware', slug: 'lab-glassware', icon: FlaskConical },
  { name: 'Microscopes', slug: 'microscopes', icon: Microscope },
  { name: 'Lab Chemicals', slug: 'lab-chemicals', icon: TestTubes },
  { name: 'Measuring Instruments', slug: 'measuring-instruments', icon: Scaling },
  { name: 'Lab Kits', slug: 'lab-kits', icon: Beaker },
  { name: 'Lab Furniture', slug: 'lab-furniture', icon: Atom },
  { name: 'Safety Equipment', slug: 'safety-equipment', icon: ShieldCheck },
  { name: 'Heating & Cooling', slug: 'heating-cooling', icon: Flame },
  { name: 'Testing Equipment', slug: 'testing-equipment', icon: ScanLine },
  { name: 'Research Tools', slug: 'research-tools', icon: Thermometer },
]

// ─── Category Showcase ──────────────────────────────────────────────────────────

export default function CategoryShowcase() {
  const { data: apiCategories } = useCategories()

  const categories = apiCategories && apiCategories.length > 0
    ? apiCategories.slice(0, 10)
    : null

  return (
    <section className="py-16 lg:py-20">
      <div className="container">
        <SectionHeader
          title="Shop by Category"
          subtitle="Lab Glassware, Microscopes, Chemicals, Measuring Instruments, and Lab Kits"
          link="/categories"
          linkText="All Categories"
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
        >
          {categories
            ? categories.map((cat) => (
                <motion.div key={cat._id} variants={fadeInUp}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="group relative flex flex-col items-center gap-3.5 rounded-2xl border border-border/70 bg-card/80 p-5 sm:p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-primary/40 hover:bg-card overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-500" />
                    {cat.image?.url ? (
                      <div className="h-16 w-16 rounded-2xl overflow-hidden bg-muted p-1 border border-border/50 group-hover:border-primary/30 transition-colors">
                        <img src={cat.image.url} alt={cat.name} className="h-full w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105" />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/25 group-hover:scale-105">
                        <FlaskConical className="h-7 w-7" />
                      </div>
                    )}
                    <div className="text-center">
                      <span className="text-sm font-semibold text-foreground text-center line-clamp-1 group-hover:text-primary transition-colors">
                        {cat.name}
                      </span>
                      {cat.productCount !== undefined ? (
                        <span className="text-xs text-muted-foreground mt-0.5 block">
                          {cat.productCount} products
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 block">
                          View Range →
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))
            : fallbackCategories.map((cat) => {
                const Icon = cat.icon
                return (
                  <motion.div key={cat.slug} variants={fadeInUp}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className="group relative flex flex-col items-center gap-3.5 rounded-2xl border border-border/70 bg-card/80 p-5 sm:p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-primary/40 hover:bg-card overflow-hidden"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/70 transition-all duration-500" />
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/25 group-hover:scale-105">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-semibold text-foreground text-center group-hover:text-primary transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-[11px] font-medium text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 block">
                          View Range →
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
        </motion.div>
      </div>
    </section>
  )
}
