import { motion } from 'framer-motion'
import { Truck, ShieldCheck, GraduationCap, FileCheck2, Headphones, Sparkles, Award } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/config/animations'

// ─── Features ───────────────────────────────────────────────────────────────────

const features = [
  {
    icon: ShieldCheck,
    title: '100% Genuine Instruments',
    description: 'Sourced directly from authorized manufacturers like Borosil, Riviera, Labman, and Remi with batch test certificates.',
    tag: 'Authentic OEM',
  },
  {
    icon: Award,
    title: 'Certified Calibration',
    description: 'Precision analytical balances, pH meters, and optical microscopes pre-calibrated to ISO & NABL research standards.',
    tag: 'Lab Standard',
  },
  {
    icon: Truck,
    title: 'Breakage-Safe Lab Dispatch',
    description: 'Engineered multi-layer shockproof crating specially designed to safeguard delicate glassware and precision optics.',
    tag: 'Zero Damage Guarantee',
  },
  {
    icon: FileCheck2,
    title: 'Institutional GST & PO Billing',
    description: 'Formal quotes, GST tax invoices, and tender/PO processing for universities, engineering colleges, and industrial labs.',
    tag: 'College Ready',
  },
  {
    icon: GraduationCap,
    title: 'Student & Academic Rates',
    description: 'Subsidized pricing on STEM kits, glassware sets, and electronics components to support student innovation.',
    tag: 'Student Friendly',
  },
  {
    icon: Headphones,
    title: 'Expert Technical Support',
    description: 'Direct assistance from scientific equipment specialists for specification matching and custom apparatus requirements.',
    tag: 'Lab Specialists',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-[#020b18] text-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-[0.05]" />
      <div className="absolute inset-0 bg-hex-pattern opacity-[0.08]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-400 backdrop-blur-sm border border-amber-400/20 mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            The Scientific Wala Advantage
          </span>
          <h2 className="text-display-xs sm:text-display-sm lg:text-display-md font-heading text-white">
            Why Laboratories & Researchers Trust Us
          </h2>
          <p className="mt-3 text-body-md text-slate-300 max-w-2xl mx-auto">
            From premier university departments to industrial R&D centers, we provide the precision and reliability scientific endeavors demand.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-7 transition-all duration-300 hover:bg-white/[0.07] hover:border-blue-500/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
