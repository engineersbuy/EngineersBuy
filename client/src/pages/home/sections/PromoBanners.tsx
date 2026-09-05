import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, GraduationCap, Sparkles, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fadeInUp } from '@/config/animations'

// ─── Promotional Banners ────────────────────────────────────────────────────────

export default function PromoBanners() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Banner — Institutional & R&D Labs */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#031533] via-[#072c63] to-[#041d44] p-8 sm:p-10 min-h-[300px] flex flex-col justify-between border border-blue-500/20 shadow-xl"
          >
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-hex-pattern opacity-10 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1.5 text-xs font-semibold text-blue-200 backdrop-blur-sm border border-blue-400/30">
                <Building2 className="h-3.5 w-3.5 text-amber-400" />
                Institutional & Bulk Inquiries
              </div>
              <h3 className="text-display-xs sm:text-display-sm font-heading text-white leading-tight">
                Universities & Industrial<br />Laboratory Quotes
              </h3>
              <p className="text-body-md text-slate-300 max-w-sm leading-relaxed text-sm sm:text-base">
                Purchase Order (PO) processing, formal GST quotations, and custom lab setups for engineering & research faculties.
              </p>
            </div>

            <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
              <Button asChild className="bg-white text-brand-900 hover:bg-slate-100 font-bold shadow-lg group/btn">
                <Link to="/contact">
                  <FileText className="h-4 w-4 mr-1 text-primary" />
                  Request Lab Quote
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
              <span className="text-xs text-blue-200 font-medium">Pan-India GST Invoicing</span>
            </div>
          </motion.div>

          {/* Right Banner — Student STEM & Lab Project Kits */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f1704] via-[#2d2208] to-[#0d1c38] p-8 sm:p-10 min-h-[300px] flex flex-col justify-between border border-amber-500/25 shadow-xl"
          >
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-hex-pattern opacity-10 pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-sm border border-amber-400/30">
                <GraduationCap className="h-3.5 w-3.5 text-amber-400" />
                Student & Academic Special
              </div>
              <h3 className="text-display-xs sm:text-display-sm font-heading text-white leading-tight">
                Curated STEM &<br />Engineering Lab Kits
              </h3>
              <p className="text-body-md text-slate-300 max-w-sm leading-relaxed text-sm sm:text-base">
                Pre-calibrated lab equipment, glassware sets, and electronics kits designed specifically for student experiments and thesis work.
              </p>
            </div>

            <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
              <Button asChild className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-lg group/btn shadow-amber-500/20">
                <Link to="/shop?tag=student">
                  <Sparkles className="h-4 w-4 mr-1 text-slate-950" />
                  Explore Student Kits
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
              <span className="text-xs text-amber-200/80 font-medium">Extra discounts with college ID</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
