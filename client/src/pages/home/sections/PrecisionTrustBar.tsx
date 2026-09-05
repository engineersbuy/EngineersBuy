import { motion } from 'framer-motion'
import { Award, PackageCheck, ReceiptText, Truck } from 'lucide-react'
import { fadeInUp } from '@/config/animations'

const trustFeatures = [
  {
    icon: Award,
    title: 'Certified Precision',
    description: 'ISO & NABL compliant instruments with manufacturer test reports.',
    badge: '100% Genuine',
    badgeColor: 'bg-blue-500/10 text-brand-600 dark:text-blue-400 border-blue-500/20',
  },
  {
    icon: PackageCheck,
    title: 'Breakage-Safe Packaging',
    description: 'Custom multi-layer shockproof crating for glassware & optics.',
    badge: 'Zero Risk',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  {
    icon: ReceiptText,
    title: 'Institutional Invoicing',
    description: 'Direct GST billing & bulk RFQ support for Universities & R&D labs.',
    badge: 'GST Ready',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  {
    icon: Truck,
    title: 'Pan-India Safe Dispatch',
    description: 'Express tracked delivery across 20,000+ pin codes in India.',
    badge: 'Fast Dispatch',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  },
]

export function PrecisionTrustBar() {
  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 container">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="rounded-2xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-card p-4 sm:p-6 lg:p-7 transition-all"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {trustFeatures.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className={`flex items-start gap-3.5 ${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''} group`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
