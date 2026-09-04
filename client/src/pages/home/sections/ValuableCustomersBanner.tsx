import { useQuery } from '@tanstack/react-query'
import { SectionHeader } from './SectionHeader'
import { valuableCustomerApi } from '@/services'
import { Building2, ExternalLink, ShieldCheck, Award, GraduationCap, Microscope } from 'lucide-react'
import type { ValuableCustomer } from '@/types'

export default function ValuableCustomersBanner() {
  const { data: apiCustomers } = useQuery({
    queryKey: ['valuable-customers', 'active'],
    queryFn: async () => (await valuableCustomerApi.getActive()).data.data,
    staleTime: 5 * 60 * 1000,
  })

  // Only render when real customers are configured and active in the database
  if (!apiCustomers || apiCustomers.length === 0) {
    return null
  }

  const rawList = apiCustomers

  // Duplicate for smooth infinite marquee looping
  const marqueeList1 = [...rawList, ...rawList]
  const marqueeList2 = [...rawList].reverse().concat([...rawList].reverse())

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden border-y border-border/40 relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <SectionHeader
          title="Our Valuable Customers"
          subtitle="Trusted by premier research institutions, universities, and industrial laboratories across India"
        />
      </div>

      {/* Marquee Row 1 */}
      <div className="relative mt-2">
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {marqueeList1.map((item, idx) => (
            <CustomerCard key={`vc-row1-${item._id || idx}-${idx}`} customer={item} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (Reversed direction) */}
      <div className="relative mt-4">
        <div
          className="flex animate-marquee hover:[animation-play-state:paused]"
          style={{ animationDirection: 'reverse', animationDuration: '40s' }}
        >
          {marqueeList2.map((item, idx) => (
            <CustomerCard key={`vc-row2-${item._id || idx}-${idx}`} customer={item} />
          ))}
        </div>
      </div>

      {/* Institutional Trust Badges */}
      <div className="container mt-12 pt-8 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2.5">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">150+</span>
            <span className="text-xs text-muted-foreground mt-0.5">Premier Universities</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
              <Microscope className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">500+</span>
            <span className="text-xs text-muted-foreground mt-0.5">Equipped Laboratories</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">100%</span>
            <span className="text-xs text-muted-foreground mt-0.5">Certified Genuine Instruments</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">Pan-India</span>
            <span className="text-xs text-muted-foreground mt-0.5">Institutional Delivery</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function CustomerCard({ customer }: { customer: Partial<ValuableCustomer> }) {
  const CardContent = (
    <div className="flex items-center gap-3.5 rounded-2xl border border-border/60 bg-card/75 backdrop-blur-md px-5 py-3.5 transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-glow hover:-translate-y-1 group">
      {/* Logo container */}
      <div className="relative h-11 w-11 shrink-0 rounded-xl border border-border/70 bg-white dark:bg-zinc-800 p-1.5 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-sm">
        {customer.logo?.url ? (
          <img
            src={customer.logo.url}
            alt={customer.name || 'Valuable Customer'}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <Building2 className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {/* Details */}
      <div className="min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-foreground whitespace-nowrap group-hover:text-primary transition-colors">
            {customer.name}
          </span>
          {customer.website && (
            <ExternalLink className="h-3 w-3 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        {customer.description && (
          <p className="text-xs text-muted-foreground truncate max-w-[220px]">
            {customer.description}
          </p>
        )}
      </div>
    </div>
  )

  if (customer.website) {
    return (
      <a
        href={customer.website}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 mx-2.5 block outline-none"
        title={`Visit ${customer.name}`}
      >
        {CardContent}
      </a>
    )
  }

  return <div className="shrink-0 mx-2.5">{CardContent}</div>
}
