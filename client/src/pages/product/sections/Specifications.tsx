import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { ProductSpecification } from '@/types'

// ─── Tabbed Product Details (Description + Specifications + Package Contents) ──

interface ProductTabsProps {
  description?: string
  specifications?: ProductSpecification[]
  features?: string[]
}

type TabKey = 'description' | 'specifications' | 'package'

export default function ProductTabs({
  description,
  specifications = [],
  features = [],
}: ProductTabsProps) {
  const tabs: { key: TabKey; label: string; show: boolean }[] = [
    { key: 'description', label: 'Description & Overview', show: !!description },
    { key: 'specifications', label: 'Technical Specifications', show: specifications.length > 0 },
    { key: 'package', label: 'Package & Inclusions', show: features.length > 0 },
  ]

  const visibleTabs = tabs.filter((t) => t.show)

  // Default to first visible tab
  const [activeTab, setActiveTab] = useState<TabKey>(visibleTabs[0]?.key || 'description')

  if (visibleTabs.length === 0) return null

  return (
    <div className="space-y-6">
      {/* Tab Headers */}
      <div className="relative border-b border-border">
        <div className="flex gap-0 overflow-x-auto no-scrollbar">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative px-4 sm:px-6 py-3 text-sm font-semibold whitespace-nowrap transition-colors',
                activeTab === tab.key
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="product-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'description' && description && (
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-3">
              {description.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          {activeTab === 'specifications' && specifications.length > 0 && (
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <table className="w-full text-left">
                <tbody className="divide-y divide-border text-xs sm:text-sm">
                  {specifications.map((spec, i) => (
                    <tr
                      key={spec.key}
                      className={cn(
                        'transition-colors hover:bg-muted/40',
                        i % 2 === 0 ? 'bg-muted/20' : 'bg-background'
                      )}
                    >
                      <td className="px-4 py-3.5 font-medium text-muted-foreground w-1/3 sm:w-2/5">
                        {spec.key}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-foreground">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'package' && features.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
