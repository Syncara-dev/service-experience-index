"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Helper to close the menu when a link is clicked on mobile
  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
      <div className="mx-auto max-w-5xl px-6 py-4 md:py-5">
        <nav className="flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary">
              <span className="text-xs font-semibold text-primary-foreground">SEI</span>
            </div>
            <span className="text-base md:text-lg font-medium tracking-tight text-foreground truncate">
              Service Experience Index
            </span>
          </Link>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/profiles" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Profiles
            </Link>
            <Link href="/trades" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Trades
            </Link>
            <Link href="/locations" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Locations
            </Link>
            <Link href="/standards" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Verification Standards
            </Link>
          </div>

          {/* Mobile Menu Toggle Button (Hidden on Desktop) */}
          <button
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-6 py-4 shadow-lg flex flex-col gap-4">
          <Link href="/profiles" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" onClick={closeMenu}>
            Profiles
          </Link>
          <Link href="/trades" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" onClick={closeMenu}>
            Trades
          </Link>
          <Link href="/locations" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" onClick={closeMenu}>
            Locations
          </Link>
          <Link href="/standards" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" onClick={closeMenu}>
            Verification Standards
          </Link>
        </div>
      )}
    </header>
  )
}