import { useState, useRef, useCallback, useMemo } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, PackageX, Sliders } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { useProductBySlug } from '@/hooks/useProductDetail'
import { useTrackView } from '@/hooks/useRecentlyViewed'
import { useAddToCart, useToggleWishlist } from '@/hooks'
import { useAuthStore, useWishlistStore } from '@/store'
import {
  ProductGallery,
  ProductInfo,
  AddToCart,
  ProductTabs,
  ReviewsSection,
  RelatedProducts,
  RecentlyViewedProducts,
  StickyCartBar,
} from './sections'
import { fadeInUp, staggerContainer } from '@/config/animations'
import toast from 'react-hot-toast'
import CustomizeOrderModal from '@/components/product/CustomizeOrderModal'

// ─── Product Detail Skeleton ────────────────────────────────────────────────────

function ProductDetailSkeleton() {
  return (
    <div className="container py-6 lg:py-8 space-y-10">
      <div className="h-4 w-48 skeleton rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 skeleton rounded-xl shrink-0" />
            ))}
          </div>
        </div>
        {/* Info skeleton */}
        <div className="space-y-5">
          <div className="h-4 w-20 skeleton rounded" />
          <div className="h-8 w-3/4 skeleton rounded" />
          <div className="h-4 w-32 skeleton rounded" />
          <div className="h-10 w-40 skeleton rounded" />
          <div className="h-4 w-full skeleton rounded" />
          <div className="h-4 w-2/3 skeleton rounded" />
          <div className="h-12 w-full skeleton rounded-lg mt-6" />
          <div className="h-12 w-full skeleton rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// ─── Product Detail Page ────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, isError, refetch } = useProductBySlug(slug || '')
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const addToCartRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)

  // Track recently viewed
  useTrackView(product)

  // Build breadcrumb
  const category = product && typeof product.category === 'object' ? product.category : null
  const breadcrumbItems: { label: string; href?: string }[] = [{ label: 'Shop', href: '/shop' }]
  if (category) {
    breadcrumbItems.push({ label: category.name, href: `/category/${category.slug}` })
  }
  if (product) {
    breadcrumbItems.push({ label: product.name })
  }

  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isInWishlist = useWishlistStore((s) => s.isInWishlist)
  const addToCart = useAddToCart()
  const toggleWishlist = useToggleWishlist()

  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue')
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)
      return false
    }
    return true
  }

  const handleAddToCart = (productId: string, quantity: number) => {
    if (!requireAuth()) return
    addToCart.mutate({ productId, quantity })
  }

  const handleBuyNow = (productId: string, quantity: number) => {
    if (!requireAuth()) return
    addToCart.mutate(
      { productId, quantity },
      { onSuccess: () => navigate('/checkout') }
    )
  }

  const handleWishlistToggle = (productId: string) => {
    if (!requireAuth()) return
    toggleWishlist.mutate(productId)
  }

  const scrollToReviews = useCallback(() => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Construct dynamic JSON-LD Product Schema
  const price = product ? (product.salePrice ?? product.price) : 0
  const brandName = product && typeof product.brand === 'object' && product.brand ? product.brand.name : 'Scientific Wala'
  const categoryName = product && typeof product.category === 'object' && product.category ? product.category.name : ''
  const imagesArray = product?.images?.map((img) => img.url) || []

  const productSchema = useMemo(() => {
    if (!product) return null
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: imagesArray.length > 0 ? imagesArray : ['/placeholder.png'],
      description: product.shortDescription || product.description?.substring(0, 300),
      sku: product.sku,
      mpn: product.sku,
      brand: {
        '@type': 'Brand',
        name: brandName,
      },
      category: categoryName,
      offers: {
        '@type': 'Offer',
        url: typeof window !== 'undefined' ? window.location.href : `https://scientificwala.com/product/${product.slug}`,
        priceCurrency: 'INR',
        price: price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Scientific Wala',
        },
      },
      ...(product.ratingsCount > 0
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.ratingsAverage,
              reviewCount: product.ratingsCount,
            },
          }
        : {}),
    }
  }, [product, price, brandName, categoryName, imagesArray])

  // ── Loading ──
  if (isLoading) return <ProductDetailSkeleton />

  // ── Error ──
  if (isError || !product) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20 px-6 text-center max-w-lg mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mb-4 text-red-500">
            <PackageX className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Product Not Found</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6">
            The scientific instrument or product you are searching for does not exist or has been archived.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button asChild variant="gradient">
              <Link to="/shop">Browse Catalog</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const categoryId = typeof product.category === 'object' ? product.category._id : product.category

  return (
    <>
      <div className="container py-6 lg:py-8">
        {/* Dynamic SEO & Schema */}
        {productSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
          />
        )}

        {/* Top Breadcrumb & Back button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/shop">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Catalog
            </Link>
          </Button>
        </div>

        {/* Main Product Layout */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* Left: Gallery (5 cols on lg) */}
          <motion.div variants={fadeInUp} className="lg:col-span-5 xl:col-span-6">
            <div className="sticky top-24">
              <ProductGallery images={product.images} name={product.name} />
            </div>
          </motion.div>

          {/* Right: Info + Actions (7 cols on lg) */}
          <motion.div variants={fadeInUp} className="lg:col-span-7 xl:col-span-6 space-y-6 sm:space-y-8">
            <ProductInfo
              product={product}
              onScrollToReviews={scrollToReviews}
            />

            <div ref={addToCartRef} className="border-t border-border pt-6 space-y-3">
              <AddToCart
                product={product}
                isWishlisted={isInWishlist(product._id)}
                isAddingToCart={addToCart.isPending}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onWishlistToggle={handleWishlistToggle}
              />

              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 border-primary/25 text-primary hover:bg-primary/5 hover:text-primary transition-all duration-200"
                onClick={() => setIsCustomizeOpen(true)}
              >
                <Sliders className="h-4 w-4" />
                Customize / Institutional Specifications
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── Tabbed Content: Description + Specifications + Package Contents ── */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-10 sm:mt-14"
        >
          <ProductTabs
            description={product.description}
            specifications={product.specifications || []}
            features={product.packageContents || []}
          />
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          ref={reviewsRef}
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-10 sm:mt-14 border-t border-border pt-10 sm:pt-14 scroll-mt-24"
        >
          <ReviewsSection
            productId={product._id}
            ratingsAverage={product.ratingsAverage}
            ratingsQuantity={product.ratingsCount}
          />
        </motion.div>

        {/* Related Products */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-10 sm:mt-14 border-t border-border pt-10 sm:pt-14"
        >
          <RelatedProducts categoryId={categoryId} currentProductId={product._id} />
        </motion.div>

        {/* Recently Viewed Carousel */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-10 sm:mt-14 border-t border-border pt-10 sm:pt-14"
        >
          <RecentlyViewedProducts currentProductId={product._id} />
        </motion.div>

        {/* Institutional / Customization Modal */}
        <CustomizeOrderModal
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          productName={product.name}
          productId={product._id}
        />
      </div>

      {/* Floating Bottom Sticky Cart Bar */}
      <StickyCartBar
        product={product}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isAddingToCart={addToCart.isPending}
        targetRef={addToCartRef}
      />
    </>
  )
}
