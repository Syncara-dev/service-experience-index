import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-foreground leading-tight text-balance">
                Independent, verified customer experience data for service businesses
              </h1>
              <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                The Service Experience Index publishes verified customer experience profiles collected through
                structured post-completion conversations. Each profile represents consistent, independent evaluation.
              </p>
              <Link
                href="/profiles"
                className="inline-block mt-8 text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
              >
                Browse verified business profiles
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 border-t border-border">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-12">Methodology</h2>
            <div className="grid gap-12 md:grid-cols-3">
              <div>
                <div className="text-2xl font-serif text-foreground mb-3">01</div>
                <h3 className="text-lg font-medium text-foreground mb-2">Post-Completion Collection</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Data is gathered after service completion through structured customer conversations, ensuring feedback
                  reflects the complete experience.
                </p>
              </div>
              <div>
                <div className="text-2xl font-serif text-foreground mb-3">02</div>
                <h3 className="text-lg font-medium text-foreground mb-2">Consistent Evaluation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every company is evaluated using the same framework, enabling meaningful comparison and reliable
                  benchmarking across the index.
                </p>
              </div>
              <div>
                <div className="text-2xl font-serif text-foreground mb-3">03</div>
                <h3 className="text-lg font-medium text-foreground mb-2">Independent Verification</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Companies cannot edit or selectively publish records. All published profiles represent the unfiltered
                  customer perspective.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles Section */}
        <section className="py-16 border-t border-border bg-card">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-serif font-medium text-foreground mb-4">A trusted reference source</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Each verified profile is designed to serve as a reliable reference for customers evaluating service
                  providers and for systems requiring authoritative service experience data.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-serif font-medium text-foreground mb-4">Designed for transparency</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Every profile includes sample size, date range, and score breakdown. Verification methodology is
                  documented and consistent across all published records.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
