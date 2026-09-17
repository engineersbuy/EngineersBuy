import { useState } from 'react'
import { Link } from 'react-router'
import { Star, Shield, Truck, BadgeCheck, CreditCard, Headset, Share2, Link2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProductBadge } from '@/components/ui/product-badge'
import { formatPrice, effectivePrice, productDiscount } from '@/utils'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

// ─── Product Info ───────────────────────────────────────────────────────────────

interface ProductInfoProps {
  product: Product
  onScrollToReviews?: () => void
}

export default function ProductInfo({ product, onScrollToReviews }: ProductInfoProps) {
  const discount = productDiscount(product)
  const price = effectivePrice(product)
  const hasDiscount = product.salePrice != null && product.salePrice < product.price
  const brand = typeof product.brand === 'object' ? product.brand : null
  const category = typeof product.category === 'object' ? product.category : null
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Product link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || `Check out ${product.name} on Scientific Wala`,
          url: window.location.href,
        })
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {discount > 0 && <ProductBadge variant="sale">-{discount}% OFF</ProductBadge>}
        {product.isFeatured && <ProductBadge variant="featured">Featured Instrument</ProductBadge>}
        {product.stock > 0 && product.stock <= 5 && (
          <ProductBadge variant="limited">Only {product.stock} units left</ProductBadge>
        )}
        {product.stock === 0 && <ProductBadge variant="out-of-stock">Out of Stock</ProductBadge>}
      </div>

      {/* Brand */}
      {brand && (
        <Link
          to={`/brand/${brand.slug}`}
          className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider"
        >
          {brand.name}
        </Link>
      )}

      {/* Name */}
      <h1 className="text-display-xs sm:text-display-sm font-heading font-black text-foreground leading-tight tracking-tight">
        {product.name}
      </h1>

      {/* Rating — clickable to scroll to reviews */}
      {product.ratingsCount > 0 && (
        <button
          type="button"
          onClick={onScrollToReviews}
          className="flex items-center gap-3 group text-left"
        >
          <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 transition-colors group-hover:bg-amber-500/20">
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
              {product.ratingsAverage.toFixed(1)}
            </span>
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors underline-offset-2 group-hover:underline">
            {product.ratingsCount} {product.ratingsCount === 1 ? 'verified review' : 'verified reviews'}
          </span>
        </button>
      )}

      {/* Price Section */}
      <div className="space-y-1.5 rounded-2xl bg-muted/20 border border-border/70 p-4">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-base sm:text-lg text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {hasDiscount && (
          <p className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            You save {formatPrice(product.price - price)} ({discount}% off)
          </p>
        )}
        <p className="text-[11px] text-muted-foreground">
          GST-inclusive price • Institutional invoice issued upon checkout
        </p>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Stock Status + Share Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {product.stock > 0 ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                In Stock — Dispatches within 24 hours
              </span>
            </>
          ) : (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-xs sm:text-sm font-medium text-red-500">
                Currently Out of Stock
              </span>
            </>
          )}
        </div>

        {/* Share & Copy Link */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Copy product link"
            title="Copy link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Link2 className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Share product"
            title="Share"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm pt-1">
        {category && (
          <div>
            <span className="text-muted-foreground">Category: </span>
            <Link
              to={`/category/${category.slug}`}
              className="font-medium text-foreground hover:text-blue-600 transition-colors"
            >
              {category.name}
            </Link>
          </div>
        )}
        <div>
          <span className="text-muted-foreground">SKU: </span>
          <span className="font-mono font-medium text-foreground text-xs">{product.sku}</span>
        </div>
        {product.soldCount > 0 && (
          <div>
            <span className="text-muted-foreground">Supplied: </span>
            <span className="font-medium text-foreground">{product.soldCount}+ units to institutions</span>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap gap-2 pt-2">
        {[
          { icon: BadgeCheck, label: 'Genuine Lab Certified', color: 'from-blue-500/10 to-indigo-500/10' },
          { icon: Shield, label: 'Tested Calibration', color: 'from-emerald-500/10 to-teal-500/10' },
          { icon: Truck, label: 'Crated Safe Shipping', color: 'from-amber-500/10 to-orange-500/10' },
          { icon: CreditCard, label: 'GST Invoicing', color: 'from-violet-500/10 to-purple-500/10' },
          { icon: Headset, label: 'Technical Lab Support', color: 'from-rose-500/10 to-pink-500/10' },
        ].map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className={cn(
              'flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1.5 text-[11px] sm:text-xs font-medium text-foreground/80 border border-border/50 transition-all hover:scale-[1.02]',
              color
            )}
          >
            <Icon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
