import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PackageSearch, RefreshCw, Microscope, ShieldCheck, Truck, ArrowUp } from 'lucide-react'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { ProductGridCard, ProductListCard } from '@/components/ui/product-card'
import { Button } from '@/components/ui/button'
import { useShopFilters } from '@/hooks/useShopFilters'
import { useProducts } from '@/hooks/useProducts'
import { useCategories, useBrands } from '@/hooks/useHomeData'
import { useProductActions } from '@/hooks/useProductActions'
import {
  FilterSidebar,
  ActiveFilterTags,
  SortControls,
  ShopSearch,
  MobileFilterDrawer,
  ShopPagination,
} from './components'
import ProductRequestCard from '@/components/common/ProductRequestCard'
import { staggerContainer, fadeInUp } from '@/config/animations'

// ─── Product Grid Skeleton ──────────────────────────────────────────────────────

function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 skeleton rounded" />
          <div className="h-3 w-8 skeleton rounded" />
        </div>
        <div className="h-5 w-20 skeleton rounded" />
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="h-44 w-44 shrink-0 skeleton rounded-xl" />
      <div className="flex-1 space-y-3 py-2">
        <div className="h-3 w-20 skeleton rounded" />
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-6 w-24 skeleton rounded mt-auto" />
      </div>
    </div>
  )
}

// ─── Shop Page ──────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const { filters, setFilters, clearFilters, activeFilterCount } = useShopFilters()
  const { data, isLoading, isError, refetch, isFetching } = useProducts(filters)
  const { data: categories } = useCategories()
  const { data: brands } = useBrands()
  const { onAddToCart, onWishlistToggle, isInWishlist } = useProductActions()

  const products = data?.data || []
  const pagination = data?.pagination
  const isListView = filters.view === 'list'

  // Back to top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false)
  useEffect(() => {
    const handler = () => setShowBackToTop(window.scrollY > 600)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Build JSON-LD structured data for CollectionPage
  const jsonLdData = useMemo(() => {
    const itemListElements = products.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: p.name,
      url: `https://scientificwala.com/product/${p.slug}`,
      image: p.images?.[0]?.url || '',
      offers: {
        '@type': 'Offer',
        price: p.salePrice || p.price,
        priceCurrency: 'INR',
        availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Scientific Equipment & Laboratory Instruments — Scientific Wala',
      description: 'Explore certified precision scientific instruments, lab equipment, sensors, and educational STEM kits across India.',
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: itemListElements,
      },
    }
  }, [products])

  // Build breadcrumb
  const breadcrumbItems: { label: string; href?: string }[] = [{ label: 'Shop', href: '/shop' }]
  if (filters.search) {
    breadcrumbItems.push({ label: `Search: "${filters.search}"` })
  }

  return (
    <div className="overflow-x-clip">
      {/* Dynamic JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* ─── Gradient Hero Banner ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#072147] to-slate-950 dark:from-slate-950 dark:via-[#03152e] dark:to-slate-950">
        {/* Precision Background Patterns & Glow */}
        <div className="absolute inset-0 bg-grid opacity-[0.08]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent" />
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-52 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="container relative py-8 sm:py-12 lg:py-14">
          <Breadcrumb
            items={breadcrumbItems}
            className="mb-5 [&_*]:text-white/60 [&_a]:hover:text-white/90"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Certified Precision Equipment
            </div>

            <h1 className="text-display-xs sm:text-display-sm lg:text-display-md font-heading font-black text-white leading-tight tracking-tight">
              {filters.search ? (
                <>
                  Results for <span className="text-amber-400">"{filters.search}"</span>
                </>
              ) : (
                <>
                  Scientific Equipment & Lab{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300">
                    Catalog
                  </span>
                </>
              )}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Explore high-precision laboratory instruments, measurement tools, sensors, and academic kits curated for universities, research institutes, and industrial laboratories.
            </p>
          </motion.div>

          {/* Search Bar — integrated into hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mt-6 max-w-xl"
          >
            <ShopSearch
              value={filters.search || ''}
              onChange={(search) => setFilters({ search })}
              isSearching={isFetching && !isLoading}
              className="[&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-slate-400 [&_input]:focus-visible:border-blue-400 [&_input]:backdrop-blur-md [&_svg]:text-slate-400"
            />
          </motion.div>
        </div>
      </div>

      {/* ─── Main Content ─────────────────────────────────────────────────────── */}
      <div className="container py-6 lg:py-10">
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-[260px] shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onClear={clearFilters}
                activeCount={activeFilterCount}
              />
            </div>
          </div>

          {/* Product Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: Mobile Filter + Sort + View */}
            <SortControls
              filters={filters}
              onFilterChange={setFilters}
              total={pagination?.totalResults}
              mobileFilterTrigger={
                <MobileFilterDrawer
                  filters={filters}
                  onFilterChange={setFilters}
                  onClear={clearFilters}
                  activeCount={activeFilterCount}
                />
              }
            />

            {/* Active Filter Tags */}
            {activeFilterCount > 0 && (
              <div className="mb-4">
                <ActiveFilterTags
                  filters={filters}
                  onFilterChange={setFilters}
                  onClear={clearFilters}
                  categories={categories}
                  brands={brands}
                />
              </div>
            )}

            {/* Background refetch indicator */}
            {isFetching && !isLoading && (
              <div className="flex items-center gap-2 mb-4 text-xs font-medium text-blue-600 dark:text-blue-400">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Updating product catalogue...
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div
                className={
                  isListView
                    ? 'space-y-4'
                    : 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6'
                }
              >
                {Array.from({ length: 6 }).map((_, i) =>
                  isListView ? <ListSkeleton key={i} /> : <ProductSkeleton key={i} />
                )}
              </div>
            )}

            {/* Error State */}
            {isError && !isLoading && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mb-4 text-red-500">
                  <PackageSearch className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Unable to load catalogue</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-sm">
                  We encountered an issue retrieving the products list. Please try reloading.
                </p>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && products.length === 0 && (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-12 px-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4 text-muted-foreground">
                    <PackageSearch className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1.5">No products found</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-5 max-w-sm leading-relaxed">
                    {filters.search
                      ? `No laboratory instruments matched your search for "${filters.search}".`
                      : "Try adjusting your filters or price range to find matching equipment."}
                  </p>
                  {activeFilterCount > 0 && (
                    <Button onClick={clearFilters} variant="outline" size="sm">
                      Clear All Filters
                    </Button>
                  )}
                </div>

                {/* Product Request Card */}
                <ProductRequestCard searchTerm={filters.search || ''} />
              </div>
            )}

            {/* Product Grid / List */}
            {!isLoading && !isError && products.length > 0 && (
              <>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  key={`${filters.page}-${filters.sort}-${filters.view}`}
                  className={
                    isListView
                      ? 'space-y-4'
                      : 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6'
                  }
                >
                  {products.map((product) => (
                    <motion.div key={product._id} variants={fadeInUp}>
                      {isListView ? (
                        <ProductListCard
                          product={product}
                          isWishlisted={isInWishlist(product._id)}
                          onAddToCart={onAddToCart}
                          onWishlistToggle={onWishlistToggle}
                        />
                      ) : (
                        <ProductGridCard
                          product={product}
                          isWishlisted={isInWishlist(product._id)}
                          onAddToCart={onAddToCart}
                          onWishlistToggle={onWishlistToggle}
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {pagination && (
                  <ShopPagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.totalResults}
                    limit={pagination.limit}
                    onPageChange={(page) => setFilters({ page })}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Product Request Banner */}
        <div className="mt-10 sm:mt-16">
          <ProductRequestCard variant="banner" searchTerm={filters.search || ''} />
        </div>

        {/* ─── Rich SEO & Institutional Procurement Guide Section ────────────── */}
        <section className="mt-10 sm:mt-16 pt-10 sm:pt-14 border-t border-border space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                <Microscope className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">100% Tested & Calibrated</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Every laboratory instrument, microscope, and sensor is calibrated and quality-verified before dispatch for precision research.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">Pan-India Crated Delivery</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Fragile scientific glassware and optics shipped in shock-absorbent multi-layer crating to universities and labs across India.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">Institutional GST Invoicing</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Full GST compliance, department purchase orders (PO), educational discounts, and institutional quotation support.
                </p>
              </div>
            </div>
          </div>

          {/* Informative Catalog Text & Scientific Brand Assurance */}
          <div className="rounded-2xl bg-muted/40 border border-border p-6 sm:p-8 space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-base sm:text-lg font-heading font-bold text-foreground mb-2">
                Procure Certified Scientific Equipment, Laboratory Instruments & Engineering Kits Online
              </h2>
              <p>
                Welcome to <strong className="text-foreground">Scientific Wala</strong>, India's trusted platform for academic departments, industrial R&D centers, colleges, and innovation labs.
                Whether you are setting up a state-of-the-art physics or chemistry laboratory, equipping an electronics & robotics maker space, or sourcing calibrated digital measurement tools,
                we deliver verified instruments from leading manufacturers backed by technical guidance and manufacturer warranties.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 animate-in fade-in zoom-in-75 duration-200"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
