import { useState } from 'react'
import { ShoppingCart, Zap, Heart, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types'

// ─── Add To Cart Section ────────────────────────────────────────────────────────

interface AddToCartProps {
  product: Product
  isWishlisted?: boolean
  onAddToCart?: (productId: string, quantity: number) => void
  onBuyNow?: (productId: string, quantity: number) => void
  onWishlistToggle?: (productId: string) => void
  isAddingToCart?: boolean
}

export default function AddToCart({
  product,
  isWishlisted = false,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  isAddingToCart = false,
}: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const isOutOfStock = product.stock === 0
  const maxQty = Math.min(product.stock, 10)
  const isLowStock = product.stock > 0 && product.stock <= 10

  const increment = () => setQuantity((q) => Math.min(q + 1, maxQty))
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1))

  const urgencyPercent = isLowStock
    ? Math.min(Math.round(((10 - product.stock) / 10) * 100), 95)
    : 0

  return (
    <div className="space-y-4">
      {/* Low Stock Urgency Bar */}
      {isLowStock && (
        <div className="space-y-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              ⚡ High institutional demand — only {product.stock} units remaining!
            </span>
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {urgencyPercent}% allocated
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-amber-500/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
              style={{ width: `${urgencyPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-semibold text-foreground">Order Quantity</label>
          <div className="flex items-center gap-1.5">
            <div className="inline-flex items-center rounded-xl border border-border bg-background overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={decrement}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="flex h-10 w-12 items-center justify-center text-sm font-bold border-x border-border">
                {quantity}
              </div>
              <button
                type="button"
                onClick={increment}
                disabled={quantity >= maxQty}
                className="flex h-10 w-10 items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              (Maximum {maxQty} per order)
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons: 2-column balanced grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 sm:h-12 gap-1.5 sm:gap-2 border-2 border-blue-600/35 bg-background text-foreground hover:bg-blue-600/5 hover:border-blue-600 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
          disabled={isOutOfStock}
          loading={isAddingToCart}
          loadingText="Adding..."
          onClick={() => onAddToCart?.(product._id, quantity)}
        >
          <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="truncate">{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </Button>
        <Button
          type="button"
          size="lg"
          variant="gradient"
          className="h-11 sm:h-12 gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-[0.98]"
          disabled={isOutOfStock}
          onClick={() => onBuyNow?.(product._id, quantity)}
        >
          <Zap className="h-4 w-4 fill-current shrink-0" />
          <span>Buy Now</span>
        </Button>
      </div>

      {/* Wishlist */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full h-9 gap-2 text-muted-foreground hover:text-foreground text-xs sm:text-sm font-medium rounded-xl border border-border/60 hover:bg-muted/50 transition-colors"
        onClick={() => onWishlistToggle?.(product._id)}
      >
        <Heart className={cn('h-4 w-4 transition-all', isWishlisted && 'fill-red-500 text-red-500 scale-110')} />
        {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
      </Button>
    </div>
  )
}
