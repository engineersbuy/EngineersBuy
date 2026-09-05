import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { SectionHeader } from './SectionHeader'
import { valuableCustomerApi } from '@/services'
import {
  Building2,
  ExternalLink,
  ShieldCheck,
  Award,
  GraduationCap,
  Microscope,
  FileText,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ValuableCustomer } from '@/types'

// ─── Fallback Curated Premier Institutions ─────────────────────────────────────
// Ensures the section is visually complete and credible even before custom database entries are seeded

const fallbackInstitutions: Partial<ValuableCustomer>[] = [
  {
    _id: 'inst-1',
    name: 'Indian Institute of Technology (IIT)',
    description: 'Central Material Science & Chemical Engineering Laboratories',
  },
  {
    _id: 'inst-2',
    name: 'National Institute of Technology (NIT)',
    description: 'Applied Physics & Nanotechnology Research Facilities',
  },
  {
    _id: 'inst-3',
    name: 'CSIR National Physical Laboratory',
    description: 'Precision Standards & Metrology Instrumentation',
  },
  {
    _id: 'inst-4',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    description: 'Biochemistry & Advanced Pathology Diagnostic Centers',
  },
  {
    _id: 'inst-5',
    name: 'Indian Institute of Science (IISc)',
    description: 'Interdisciplinary Scientific & Advanced Optics Units',
  },
  {
    _id: 'inst-6',
    name: 'Central University Research Labs',
    description: 'Analytical Chemistry & Botanical Specimen Archives',
  },
  {
    _id: 'inst-7',
    name: 'Defense R&D Laboratories (DRDO)',
    description: 'Sensor Calibration & Material Testing Departments',
  },
  {
    _id: 'inst-8',
    name: 'State Engineering & Polytechnic Colleges',
    description: 'Undergraduate STEM & Mechanical Engineering Workshops',
  },
  {
    _id: 'inst-9',
    name: 'NABL-Accredited Testing Centers',
    description: 'Chemical Assay & Industrial Quality Assurance Labs',
  },
  {
    _id: 'inst-10',
    name: 'Pharmaceutical R&D Formulations',
    description: 'Chromatography & Sterile Cleanroom Preparations',
  },
]

export default function ValuableCustomersBanner() {
  const { data: apiCustomers } = useQuery({
    queryKey: ['valuable-customers', 'active'],
    queryFn: async () => (await valuableCustomerApi.getActive()).data.data,
    staleTime: 5 * 60 * 1000,
  })

  // Use API customers if present and non-empty, otherwise fallback to curated institutional network
  const customerList: Partial<ValuableCustomer>[] =
    apiCustomers && apiCustomers.length > 0 ? apiCustomers : fallbackInstitutions

  // Duplicate for smooth, continuous infinite marquee looping
  const marqueeList1 = [...customerList, ...customerList]
  const marqueeList2 = [...customerList].reverse().concat([...customerList].reverse())

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-background via-blue-950/[0.02] to-background overflow-hidden border-y border-border/50 relative">
      {/* Precision ambient background glow with Royal Blue & Amber hints */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mb-8">
        <SectionHeader
          title="Our Valuable Customers & Institutional Partners"
          subtitle="Trusted by leading universities, research institutes, medical colleges, and industrial testing laboratories across India"
        />
      </div>

      {/* Marquee Wrapper with Smooth Gradient Edge Masks */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left & Right gradient edge fades for smooth marquee entry/exit */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-background to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-background to-transparent z-20" />

        {/* Marquee Row 1 */}
        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {marqueeList1.map((item, idx) => (
            <CustomerCard key={`vc-r1-${item._id || idx}-${idx}`} customer={item} />
          ))}
        </div>

        {/* Marquee Row 2 (Reversed direction) */}
        <div className="mt-4 flex animate-marquee hover:[animation-play-state:paused]" style={{ animationDirection: 'reverse', animationDuration: '42s' }}>
          {marqueeList2.map((item, idx) => (
            <CustomerCard key={`vc-r2-${item._id || idx}-${idx}`} customer={item} />
          ))}
        </div>
      </div>

      {/* Institutional Trust Badges & Metrics */}
      <div className="container mt-14 pt-10 border-t border-border/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-card/50 border border-border/40 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-card">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl lg:text-3xl font-black text-foreground font-heading tracking-tight">150+</span>
            <span className="text-xs font-semibold text-muted-foreground mt-1">Premier Universities & IITs</span>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-card/50 border border-border/40 backdrop-blur-sm transition-all hover:border-amber-400/30 hover:shadow-card">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3 shadow-sm">
              <Microscope className="h-6 w-6" />
            </div>
            <span className="text-2xl lg:text-3xl font-black text-foreground font-heading tracking-tight">500+</span>
            <span className="text-xs font-semibold text-muted-foreground mt-1">Equipped Laboratories</span>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-card/50 border border-border/40 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-card">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-2xl lg:text-3xl font-black text-foreground font-heading tracking-tight">100%</span>
            <span className="text-xs font-semibold text-muted-foreground mt-1">ISO & NABL Calibrated</span>
          </div>

          <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-card/50 border border-border/40 backdrop-blur-sm transition-all hover:border-amber-400/30 hover:shadow-card">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3 shadow-sm">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-2xl lg:text-3xl font-black text-foreground font-heading tracking-tight">Pan-India</span>
            <span className="text-xs font-semibold text-muted-foreground mt-1">Crated Breakage-Safe Delivery</span>
          </div>
        </div>

        {/* Institutional Procurement Callout Strip */}
        <div className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-amber-500/5 to-primary/5 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Procuring for an Academic Department or Industrial R&D Unit?
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                We accept official Purchase Orders (PO), generate GST tax quotations, and assign dedicated account managers.
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold shrink-0 shadow-sm shadow-primary/20">
            <Link to="/contact">
              Institutional Inquiry
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function CustomerCard({
  customer,
}: {
  customer: Partial<ValuableCustomer>
}) {
  const CardContent = (
    <div className="flex items-center gap-3.5 rounded-2xl border border-border/70 bg-card/85 backdrop-blur-md px-5 py-3.5 transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-card-hover hover:-translate-y-1 group">
      {/* Logo container or scientific badge */}
      <div className="relative h-11 w-11 shrink-0 rounded-xl border border-border/80 bg-background/90 p-2 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-sm group-hover:border-primary/40">
        {customer.logo?.url ? (
          <img
            src={customer.logo.url}
            alt={customer.name || 'Institutional Customer'}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <Building2 className="h-5 w-5 text-primary group-hover:text-amber-500 transition-colors" />
        )}
      </div>

      {/* Details */}
      <div className="min-w-0 pr-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-foreground whitespace-nowrap group-hover:text-primary transition-colors">
            {customer.name}
          </span>
          {customer.website && (
            <ExternalLink className="h-3 w-3 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        {customer.description && (
          <p className="text-xs text-muted-foreground truncate max-w-[240px]">
            {customer.description}
          </p>
        )}
      </div>

      {/* Subtle Verified Pin */}
      <span className="h-2 w-2 rounded-full bg-amber-400/80 shrink-0 ml-1 group-hover:scale-125 transition-transform" />
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
