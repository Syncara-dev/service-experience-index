import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { londonAreas } from "@/lib/locations"

export const metadata: Metadata = {
  title: "Window Companies in London | Service Experience Index",
  description:
    "Find verified window companies serving London areas. Compare SEI scores, verified customer records, and project types.",
}

export default function LondonPage() {
  const areas = Object.values(londonAreas).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <article className="mx-auto max-w-4xl px-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-foreground">London</span>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-semibold text-foreground mb-4 text-balance">Window Companies in London</h1>
            <p className="text-muted-foreground leading-relaxed">
              Browse verified window installation companies serving London areas. Each area page compares companies
              using SEI scores derived from post-completion customer conversations.
            </p>
          </header>

          {/* Area Grid */}
          <section className="mb-12">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">Browse by area</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {areas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/london/${area.slug}/best-window-companies`}
                  className="px-4 py-3 text-sm text-center border border-border rounded-lg hover:border-accent/50 hover:bg-muted/50 transition-colors"
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="py-10 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-foreground mb-1">Looking nationwide?</h2>
                <p className="text-sm text-muted-foreground">Browse all verified company profiles across the UK.</p>
              </div>
              <Link
                href="/profiles"
                className="text-sm px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                All profiles
              </Link>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
