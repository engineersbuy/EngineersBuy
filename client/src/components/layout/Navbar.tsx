import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
  ChevronDown,
  FlaskConical,
  LayoutDashboard,
} from 'lucide-react'
import { useAuthStore, useCartStore, useUIStore } from '@/store'
import { useTheme } from '@/hooks'
import { useIsMobile } from '@/hooks'
import { cn } from '@/lib/utils'
import { getUserName } from '@/utils'
import { APP } from '@/constants'
import { BrandLogo } from '@/components/layout/BrandLogo'

// ─── Navbar ─────────────────────────────────────────────────────────────────────

export function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { totalItems } = useCartStore()
  const { isMobileMenuOpen, setMobileMenuOpen, openAuthModal } = useUIStore()
  useTheme()
  const isMobile = useIsMobile()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    navigate('/')
  }



  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70">
        {/* Top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <BrandLogo size="md" />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold font-heading text-foreground leading-tight tracking-tight">
                {APP.NAME}
              </span>
              <span className="text-[10px] font-medium text-primary/70 uppercase tracking-widest leading-none">
                {APP.TAGLINE}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/shop">Shop</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/brands">Brands</NavLink>
            <NavLink href="/deals">Deals</NavLink>
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="search"
                placeholder="Search instruments, chemicals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/40 focus:bg-background focus:ring-2 focus:ring-primary/15 focus:shadow-[0_0_0_4px_hsla(168,76%,36%,0.06)]"
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            {/* Mobile Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>



            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </Link>

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex h-10 items-center gap-2 rounded-xl pl-1 pr-3 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 text-primary text-xs font-semibold">
                    {user?.firstName?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isProfileOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/60 bg-popover/95 backdrop-blur-xl p-1.5 shadow-xl"
                    >
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{getUserName(user)}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <DropdownLink href="/profile" icon={<User className="h-4 w-4" />} onClick={() => setIsProfileOpen(false)}>
                        My Profile
                      </DropdownLink>
                      <DropdownLink href="/orders" icon={<Package className="h-4 w-4" />} onClick={() => setIsProfileOpen(false)}>
                        My Orders
                      </DropdownLink>
                      <DropdownLink href="/addresses" icon={<MapPin className="h-4 w-4" />} onClick={() => setIsProfileOpen(false)}>
                        Addresses
                      </DropdownLink>
                      {user?.role === 'admin' && (
                        <>
                          <div className="my-1 border-t border-border" />
                          <DropdownLink href="/admin" icon={<LayoutDashboard className="h-4 w-4" />} onClick={() => setIsProfileOpen(false)}>
                            Admin Dashboard
                          </DropdownLink>
                        </>
                      )}
                      {user?.role === 'vendor' && (
                        <>
                          <div className="my-1 border-t border-border" />
                          <DropdownLink href="/vendor" icon={<FlaskConical className="h-4 w-4" />} onClick={() => setIsProfileOpen(false)}>
                            Vendor Dashboard
                          </DropdownLink>
                        </>
                      )}
                      <div className="my-1 border-t border-border" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 active:scale-[0.98]"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && isMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border overflow-hidden"
            >
              <form onSubmit={handleSearch} className="container py-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search instruments, chemicals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full h-10 rounded-xl border border-border/60 bg-muted/30 pl-10 pr-4 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed right-0 top-0 z-30 h-full w-72 border-l border-border/40 bg-background/95 backdrop-blur-2xl p-6 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  <span className="text-lg font-bold font-heading">Menu</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
                <MobileNavLink href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</MobileNavLink>
                <MobileNavLink href="/categories" onClick={() => setMobileMenuOpen(false)}>Categories</MobileNavLink>
                <MobileNavLink href="/brands" onClick={() => setMobileMenuOpen(false)}>Brands</MobileNavLink>
                <MobileNavLink href="/deals" onClick={() => setMobileMenuOpen(false)}>Deals</MobileNavLink>
                {!isAuthenticated && (
                  <>
                    <div className="my-3 border-t border-border" />
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        openAuthModal('login')
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-medium text-white w-full shadow-sm"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      to={href}
      className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-accent relative"
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="flex items-center px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-colors"
    >
      {children}
    </Link>
  )
}

function DropdownLink({
  href,
  icon,
  onClick,
  children,
}: {
  href: string
  icon: React.ReactNode
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
    >
      {icon}
      {children}
    </Link>
  )
}
