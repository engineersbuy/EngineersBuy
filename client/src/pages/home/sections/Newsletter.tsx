import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle2, Sparkles } from 'lucide-react'
import { fadeInUp } from '@/config/animations'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubmitted(true)
      setEmail('')
      setTimeout(() => setIsSubmitted(false), 4000)
    }
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="container">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-12 lg:p-16"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-grid opacity-[0.05]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/15 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

          <div className="relative text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-400 backdrop-blur-sm border border-amber-400/20 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Stay Updated on Laboratory Tech
            </div>

            <motion.h2 variants={fadeInUp} className="text-display-xs sm:text-display-sm font-heading text-white mb-3">
              Join Our Scientific Newsletter
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-body-md text-slate-300 mb-8 max-w-md mx-auto">
              Receive specialized product releases, institutional catalogs, educational guides, and lab equipment discounts directly.
            </motion.p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-500/20 border border-blue-400/30 px-6 py-3 text-blue-200"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="font-medium">You're subscribed! Check your inbox for updates.</span>
              </motion.div>
            ) : (
              <motion.form
                variants={fadeInUp}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="email"
                    placeholder="Enter your academic or lab email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition-all focus:border-primary/60 focus:bg-white/10 focus:ring-2 focus:ring-primary/30 backdrop-blur-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 rounded-xl bg-gradient-to-r from-blue-600 via-primary to-indigo-700 px-8 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98] shrink-0"
                >
                  Subscribe
                </button>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
