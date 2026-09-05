import { useFeaturedProducts, useBestSellers, useNewArrivals } from '@/hooks/useHomeData'
import {
  HeroBanner,
  PrecisionTrustBar,
  CategoryShowcase,
  ProductSection,
  PopularBrands,
  ValuableCustomersBanner,
  PromoBanners,
  WhyChooseUs,
  Newsletter,
  FooterCTA,
} from './sections'

// ─── Home Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const featured = useFeaturedProducts()
  const bestSellers = useBestSellers()
  const newArrivals = useNewArrivals()

  return (
    <>
      {/* 1. Hero Banner Carousel */}
      <HeroBanner />

      {/* 2. Precision Guarantees Trust Bar */}
      <PrecisionTrustBar />

      {/* 3. Category Showcase */}
      <CategoryShowcase />

      {/* 4. Featured Products */}
      <ProductSection
        title="Featured Scientific Instruments"
        subtitle="Precision apparatus and certified lab supplies for cutting-edge research"
        link="/shop?featured=true"
        linkText="See All Featured"
        products={featured.data}
        isLoading={featured.isLoading}
        isError={featured.isError}
      />

      {/* 5. Promotional & RFQ Banners */}
      <PromoBanners />

      {/* 6. Best Sellers */}
      <ProductSection
        title="Best Selling Lab Equipment"
        subtitle="Top-ordered glassware, analytical balances, and testing kits this month"
        link="/shop?sort=-sold"
        linkText="View Best Sellers"
        products={bestSellers.data}
        isLoading={bestSellers.isLoading}
        isError={bestSellers.isError}
      />

      {/* 7. Authorized Brands */}
      <PopularBrands />

      {/* 8. Valuable Customers Banner */}
      <ValuableCustomersBanner />

      {/* 9. New Arrivals */}
      <ProductSection
        title="New Laboratory Arrivals"
        subtitle="Latest additions to our scientific instrumentation and reagent inventory"
        link="/shop?sort=-createdAt"
        linkText="View New Arrivals"
        products={newArrivals.data}
        isLoading={newArrivals.isLoading}
        isError={newArrivals.isError}
      />

      {/* 8. Why Choose Scientific Wala */}
      <WhyChooseUs />

      {/* 9. Newsletter */}
      <Newsletter />

      {/* 10. Footer CTA */}
      <FooterCTA />
    </>
  )
}
