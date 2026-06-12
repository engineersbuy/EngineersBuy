import { motion } from 'framer-motion'
import { Truck, ShieldCheck, GraduationCap, CreditCard, Headset, RotateCcw } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/config/animations'

// ─── Features ───────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Free shipping on orders above ₹999. Same-day delivery in select cities.',
  },
  {
    icon: ShieldCheck,
    title: 'Genuine Products',
    description: '100% genuine scientific instruments sourced directly from authorized distributors.',
  },
  {
    icon: GraduationCap,
    title: 'Student-Friendly',
    description: 'Special pricing and EMI options designed for students and young professionals.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Multiple payment options including UPI, cards, and net banking. 100% secure.',
  },
  {
    icon: Headset,
    title: '24/7 Support',
    description: 'Round-the-clock customer support via chat, email, and phone.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7-day hassle-free return and replacement policy on all products.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-slate-950 text-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-[0.04]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-teal-400/6 blur-[120px] pointer-events-none" />

      <div className="container relative">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-1.5 text-sm font-medium text-teal-300 backdrop-blur-sm border border-white/10 mb-5">
            Why Choose Us
          </span>
          <h2 className="text-display-xs sm:text-display-sm font-heading text-white">
            Why Choose Scientific Wala?
          </h2>
          <p className="mt-3 text-body-md text-white/60 max-w-2xl mx-auto">
            We're committed to providing the best lab equipment shopping experience in India.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-primary/20 hover:-translate-y-1"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-teal-300 mb-4 transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
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
