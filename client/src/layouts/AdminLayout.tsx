import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  Tags,
  Building2,
  ShoppingBag,
  Users,
  Ticket,
  Image,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Store,
  ClipboardCheck,
  Award,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP } from '@/constants'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { useIsMobile } from '@/hooks'
import { ScrollToTop } from '@/components/layout/ScrollToTop'

// ─── Admin Layout ───────────────────────────────────────────────────────────────

import { FileSpreadsheet } from 'lucide-react'

// ─── Admin Layout Groups ────────────────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const sidebarGroups: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Inventory & Catalog',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Categories', href: '/admin/categories', icon: Tags },
      { label: 'Brands', href: '/admin/brands', icon: Building2 },
      { label: 'Bulk Import', href: '/admin/products?action=bulk-import', icon: FileSpreadsheet, badge: 'New' },
    ],
  },
  {
    title: 'Orders & Commerce',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Review Queue', href: '/admin/review-queue', icon: ClipboardCheck },
      { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
    ],
  },
  {
    title: 'Store & Content',
    items: [
      { label: 'Banners', href: '/admin/banners', icon: Image },
      { label: 'Valuable Customers', href: '/admin/valuable-customers', icon: Award },
      { label: 'Vendors', href: '/admin/vendors', icon: Store },
      { label: 'Users', href: '/admin/users', icon: Users },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isMobile = useIsMobile()

  const isActive = (href: string) => {
    if (href === '/admin') return location.pathname === '/admin'
    const cleanHref = href.split('?')[0]
    return location.pathname === cleanHref || location.pathname.startsWith(`${cleanHref}/`)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ScrollToTop selector="#admin-main" />
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-all duration-300 shadow-sm',
          collapsed ? 'w-[70px]' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed ? (
            <Link to="/admin" className="flex items-center gap-2.5 group">
              <BrandLogo size="sm" />
              <div>
                <span className="text-sm font-bold font-heading text-foreground block leading-tight group-hover:text-primary transition-colors">
                  {APP.NAME}
                </span>
                <span className="text-[9px] font-semibold text-amber-500 uppercase tracking-wider block">
                  Admin Console
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/admin" className="mx-auto block">
              <BrandLogo size="sm" />
            </Link>
          )}
          <button
            onClick={() => isMobile ? setMobileOpen(false) : setCollapsed(!collapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Categorized Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {sidebarGroups.map((group, groupIdx) => (
            <div key={group.title} className="space-y-1">
              {!collapsed ? (
                <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  {group.title}
                </div>
              ) : groupIdx !== 0 ? (
                <div className="my-2 border-t border-border/60 mx-1" />
              ) : null}

              <div className="space-y-0.5">
                {group.items.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.href)

                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => isMobile && setMobileOpen(false)}
                      title={collapsed ? link.label : undefined}
                      className={cn(
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
                        active
                          ? 'bg-primary/10 text-primary font-semibold shadow-xs'
                          : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                        collapsed && 'justify-center px-2'
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary" />
                      )}
                      <Icon className={cn('h-4 w-4 shrink-0 transition-transform group-hover:scale-110', active && 'text-primary')} />
                      {!collapsed && (
                        <span className="flex-1 truncate">{link.label}</span>
                      )}
                      {!collapsed && link.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 leading-none">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Back to Store */}
        <div className="border-t border-border p-2">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Admin Top Bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-background px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <span className="text-xs font-medium text-muted-foreground border border-border bg-muted/40 px-2.5 py-1 rounded-full">
            Admin Panel
          </span>
        </header>

        {/* Page Content */}
        <main id="admin-main" className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
