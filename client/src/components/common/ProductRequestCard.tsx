import { useState } from 'react'
import { Sparkles, Mail, Send, Microscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductRequestModal from './ProductRequestModal'

interface ProductRequestCardProps {
  searchTerm?: string
  className?: string
  variant?: 'card' | 'banner'
}

export default function ProductRequestCard({
  searchTerm = '',
  className = '',
  variant = 'card',
}: ProductRequestCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const directMailSubject = encodeURIComponent(
    searchTerm
      ? `Product Inquiry: ${searchTerm}`
      : 'Scientific Instrument Inquiry / Custom Quote Request'
  )
  const directMailBody = encodeURIComponent(
    `Hello Scientific Wala Procurement Team,\n\nI was looking for the following scientific product/instrument on your website:\n- Product Name: ${
      searchTerm || ''
    }\n- Specifications/Details:\n\nPlease let me know availability, official quotation, and academic/institutional pricing.\n\nThank you!`
  )
  const directMailHref = `mailto:sales.scientificwala@gmail.com?subject=${directMailSubject}&body=${directMailBody}`

  if (variant === 'banner') {
    return (
      <>
        <div
          className={`relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-amber-500/10 p-6 sm:p-8 shadow-sm ${className}`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Microscope className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground">
                  Didn't find your required scientific equipment or instrument?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                  Tell our technical laboratory instrumentation team what you need. We source genuine, certified instruments from accredited global and domestic manufacturers with GST invoicing.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
              <Button
                variant="gradient"
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto font-semibold"
                leftIcon={<Sparkles className="h-4 w-4" />}
              >
                Request Quote / Instrument
              </Button>
              <a
                href={directMailHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors w-full sm:w-auto text-center"
              >
                <Mail className="h-4 w-4" />
                Email Desk
              </a>
            </div>
          </div>
        </div>

        <ProductRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialProductName={searchTerm}
        />
      </>
    )
  }

  return (
    <>
      <div
        className={`w-full max-w-xl mx-auto overflow-hidden rounded-2xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm text-center space-y-4 ${className}`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <h4 className="text-base sm:text-lg font-heading font-semibold text-foreground">
            Looking for an unlisted laboratory instrument or component?
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {searchTerm ? (
              <>
                Couldn't find <span className="font-semibold text-foreground">"{searchTerm}"</span> in our catalog? Send an enquiry directly to our procurement team and we will source it for you.
              </>
            ) : (
              'Send a quick inquiry to our desk. We source custom precision sensors, lab glassware, optical instruments, and testing modules on request.'
            )}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="gradient"
            size="default"
            className="w-full sm:w-auto font-semibold"
            leftIcon={<Send className="h-4 w-4" />}
          >
            {searchTerm
              ? `Request "${searchTerm.slice(0, 20)}${searchTerm.length > 20 ? '...' : ''}"`
              : 'Request Instrument'}
          </Button>

          <a
            href={directMailHref}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors w-full sm:w-auto"
          >
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email (sales.scientificwala@gmail.com)
          </a>
        </div>
      </div>

      <ProductRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialProductName={searchTerm}
      />
    </>
  )
}
