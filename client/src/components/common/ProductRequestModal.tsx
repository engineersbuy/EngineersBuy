import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Mail, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useAuthStore } from '@/store'

export interface ProductRequestFormData {
  name: string
  email: string
  productName: string
  quantity: string
  targetPrice: string
  referenceUrl: string
  specifications: string
  notes: string
}

interface ProductRequestModalProps {
  isOpen: boolean
  onClose: () => void
  initialProductName?: string
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.15 },
  },
}

export default function ProductRequestModal({
  isOpen,
  onClose,
  initialProductName = '',
}: ProductRequestModalProps) {
  const { user } = useAuthStore()

  const [form, setForm] = useState<ProductRequestFormData>({
    name: '',
    email: '',
    productName: '',
    quantity: '',
    targetPrice: '',
    referenceUrl: '',
    specifications: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ProductRequestFormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false)
      setForm({
        name: user ? `${user.firstName} ${user.lastName}`.trim() : '',
        email: user?.email || '',
        productName: initialProductName,
        quantity: '1',
        targetPrice: '',
        referenceUrl: '',
        specifications: '',
        notes: '',
      })
      setErrors({})
    }
  }, [isOpen, initialProductName, user])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductRequestFormData, string>> = {}
    if (!form.name.trim()) newErrors.name = 'Please provide your name.'
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Please provide a valid email.'
    }
    if (!form.productName.trim()) {
      newErrors.productName = 'Product name or description is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // Simulate network request without touching backend
      await new Promise((resolve) => setTimeout(resolve, 600))
      setIsSuccess(true)
      toast.success('Your request has been received! Our procurement team will contact you shortly.')
    } catch {
      toast.error('Could not submit request. Please try emailing us directly.')
    } finally {
      setLoading(false)
    }
  }

  const directMailSubject = encodeURIComponent(
    form.productName
      ? `Product Inquiry / RFQ: ${form.productName}`
      : 'Scientific Instrument / Product Inquiry'
  )
  const directMailBody = encodeURIComponent(
    `Hello Scientific Wala Team,\n\nI am requesting quotation/stock for the following item:\n- Name: ${form.name}\n- Product/Model: ${form.productName}\n- Quantity: ${form.quantity || '1'}\n- Specs/Details: ${form.specifications || 'N/A'}\n- Notes: ${form.notes || 'N/A'}\n\nThank you!`
  )
  const directMailHref = `mailto:sales.scientificwala@gmail.com?subject=${directMailSubject}&body=${directMailBody}`

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Request Custom Product / RFQ
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Scientific Wala Procurement & Laboratory Supply Service
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto scrollbar-thin">
              {isSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-foreground">Inquiry Received</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong className="text-foreground">{form.name}</strong>. Our technical engineering & procurement desk will verify availability, pricing, and dispatch lead times within 24 hours.
                    </p>
                  </div>
                  <div className="pt-3 flex justify-center gap-3">
                    <Button variant="outline" size="sm" onClick={onClose}>
                      Close
                    </Button>
                    <a
                      href={directMailHref}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      <Mail className="h-3.5 w-3.5" /> Direct Email
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Your Name" required error={errors.name}>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Dr. Rajesh Sharma"
                      />
                    </FormField>

                    <FormField label="Email Address" required error={errors.email}>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="name@institute.edu.in"
                      />
                    </FormField>
                  </div>

                  <FormField label="Product / Model / Instrument Name" required error={errors.productName}>
                    <Input
                      value={form.productName}
                      onChange={(e) => setForm({ ...form, productName: e.target.value })}
                      placeholder="e.g. Rigol DS1054Z Digital Oscilloscope / Lab Centrifuge"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Estimated Quantity">
                      <Input
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        placeholder="e.g. 5 units"
                      />
                    </FormField>

                    <FormField label="Target Budget (₹ Optional)">
                      <Input
                        value={form.targetPrice}
                        onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
                        placeholder="e.g. ₹25,000"
                      />
                    </FormField>
                  </div>

                  <FormField label="Reference Link or Datasheet URL (Optional)">
                    <Input
                      value={form.referenceUrl}
                      onChange={(e) => setForm({ ...form, referenceUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </FormField>

                  <FormField label="Specifications & Requirements">
                    <Textarea
                      rows={3}
                      value={form.specifications}
                      onChange={(e) => setForm({ ...form, specifications: e.target.value })}
                      placeholder="Mention required measurement range, calibration certificates, voltage rating, or brand preferences..."
                    />
                  </FormField>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border mt-4">
                    <a
                      href={directMailHref}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
                    >
                      <Mail className="h-3.5 w-3.5" /> Email sales.scientificwala@gmail.com
                    </a>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button variant="outline" type="button" onClick={onClose} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="gradient"
                        loading={loading}
                        leftIcon={<Send className="h-4 w-4" />}
                        className="w-full sm:w-auto font-semibold"
                      >
                        Submit Request
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
