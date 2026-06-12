import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Truck, FlaskConical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fadeInUp } from '@/config/animations'

export default function FooterCTA() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 via-teal-600 to-emerald-700 p-8 sm:p-12 lg:p-16"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-grid opacity-[0.06]" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-[80px] pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: CTA text */}
            <div>
              <motion.h2 variants={fadeInUp} className="text-display-sm sm:text-display-md font-heading text-white mb-4">
                Ready to equip your lab?
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-body-lg text-white/80 mb-8 max-w-lg">
                Join thousands of happy customers who trust Scientific Wala for their lab equipment needs.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-white/90 shadow-lg group">
                  <Link to="/shop">
                    Browse Products
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </motion.div>
            </div>

            {/* Right: Trust indicators */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {[
                { icon: FlaskConical, label: 'Genuine Instruments', sub: 'Authorized distributors' },
                { icon: Truck, label: 'Free Shipping', sub: 'On orders above ₹999' },
                { icon: Shield, label: 'Secure Payments', sub: '100% encrypted checkout' },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-3 transition-all hover:bg-white/15"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-white/60">{sub}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
