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
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {categories
            ? categories.map((cat) => (
                <motion.div key={cat._id} variants={fadeInUp}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="group glass flex flex-col items-center gap-3 rounded-2xl p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/25"
                  >
                    {cat.image?.url ? (
                      <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted">
                        <img src={cat.image.url} alt={cat.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                        <FlaskConical className="h-6 w-6" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground text-center line-clamp-1">
                      {cat.name}
                    </span>
                    {cat.productCount !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {cat.productCount} products
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))
            : fallbackCategories.map((cat) => {
                const Icon = cat.icon
                return (
                  <motion.div key={cat.slug} variants={fadeInUp}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className="group glass flex flex-col items-center gap-3 rounded-2xl p-6 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/25"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-medium text-foreground text-center">
                        {cat.name}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
        </motion.div>
      </div>
    </section>
  )
}
