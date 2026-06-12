import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sliders } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '@/api/apiClient'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { modalOverlayVariants, modalContentVariants } from '@/config/animations'

interface CustomizeOrderModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productId: string
}

export default function CustomizeOrderModal({
  isOpen,
  onClose,
  productName,
  productId,
}: CustomizeOrderModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null)

  // Focus trap inside the modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    const container = modalRef.current
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector)
      if (focusableElements.length === 0) return

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return

    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.error('All fields are required')
      return
    }

    setIsLoading(true)
    try {
      await apiClient.post('/customize-order', {
        name,
        email,
        phone,
        message,
        productName,
        productId,
      })
      toast.success('Customization request submitted successfully!')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
      onClose()
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            variants={modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="customize-modal-title"
            variants={modalContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 flex flex-col w-full max-w-[500px] max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Sliders className="h-4 w-4 text-primary" />
                </div>
                <h2 id="customize-modal-title" className="text-lg font-semibold text-foreground">
                  Customize Your Order
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <FormField label="Product Name">
                <Input value={productName} disabled className="bg-muted text-muted-foreground cursor-not-allowed opacity-80" />
              </FormField>

              <FormField label="Product ID">
                <Input value={productId} disabled className="font-mono bg-muted text-muted-foreground cursor-not-allowed opacity-80" />
              </FormField>

              <FormField label="Your Name" required>
                <Input
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </FormField>

              <FormField label="Email Address" required>
                <Input
                  required
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </FormField>

              <FormField label="Phone Number" required>
                <Input
                  required
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </FormField>

              <FormField label="Message / Customization Details" required>
                <Textarea
                  required
                  placeholder="Describe your custom requirements (dimensions, custom values, additional components, quantity, etc.)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  disabled={isLoading}
                />
              </FormField>

              {/* Submit Button */}
              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  className="flex-1"
                  loading={isLoading}
                  loadingText="Submitting..."
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
