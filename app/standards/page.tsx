import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Verification Standards",
  description:
    "The principles and commitments that govern how customer experience data is collected, verified, and published by the Service Experience Index.",
  alternates: { canonical: "/standards" },
  openGraph: {
    title: "Verification Standards | Service Experience Index",
    description:
      "The principles and commitments that govern how customer experience data is collected, verified, and published by the Service Experience Index.",
    url: "/standards",
  },
}

export default function StandardsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <header className="mb-12">
            <p className="text-xs text-muted-foreground mb-2">Verification Standards — Version 1.0</p>
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-4">Verification Standards</h1>
            <p className="text-muted-foreground leading-relaxed">
              The principles and commitments that govern how customer experience data is collected, verified, and
              published.
            </p>
          </header>

          <div className="prose prose-neutral max-w-none">
            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">Independence</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Service Experience Index operates independently of the businesses it evaluates. Companies cannot pay
                for inclusion, improved scores, or preferential treatment. Published profiles reflect customer
                experience without commercial influence.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Editorial decisions regarding publication are made solely by the Index, based on verification criteria
                and data quality standards.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">Consistency</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every business in the Index is evaluated using the same methodology. The same questions are asked, the
                same criteria are applied, and the same scoring framework is used across all profiles.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This consistency enables meaningful comparison between businesses and ensures that scores reflect
                genuine differences in customer experience rather than methodological variation.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">Verification</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All data is collected directly from customers following service completion. Conversations are conducted
                with explicit consent and recorded for quality assurance purposes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Customer identity is verified against service records where possible. Specific verification processes
                are not publicly disclosed to preserve the integrity of the system and prevent gaming.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">Transparency</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every published profile includes the sample size, date range, and complete score breakdown. This
                information enables readers to assess the reliability and relevance of each profile.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Where data is limited or collected over a short period, this is clearly indicated in the profile.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">No Editorial Control by Companies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Companies featured in the Index cannot edit, filter, or selectively publish customer feedback. They
                cannot request removal of negative comments or adjustment of scores.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Companies may request corrections where factual inaccuracies are identified. All correction requests are
                reviewed independently against the original customer interaction.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Published profiles represent the complete picture of collected customer experience data, within the
                bounds of privacy, consent, and accuracy requirements.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">Privacy and Consent</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Customer participation is voluntary. All data collection follows explicit consent procedures and
                complies with applicable data protection regulations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Customer identities are anonymised in published profiles unless explicit consent is given for
                attribution. Aggregate data and anonymised excerpts are used to illustrate customer experience while
                protecting individual privacy.
              </p>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">What This Is</h2>
              <ul className="text-muted-foreground leading-relaxed space-y-1">
                <li>Independent verification of customer experience</li>
                <li>Based on post-completion customer conversations</li>
                <li>Consistent evaluation across all businesses</li>
              </ul>
            </section>

            <section className="mb-12 pb-12 border-b border-border">
              <h2 className="text-xl font-medium text-foreground mb-4">What This Isn't</h2>
              <ul className="text-muted-foreground leading-relaxed space-y-1">
                <li>A review marketplace</li>
                <li>A ranking or "best of" list</li>
                <li>A promotional platform</li>
              </ul>
            </section>

            <section>
              <p className="text-muted-foreground leading-relaxed">
                All businesses are evaluated using the same question framework, scoring scale, and aggregation approach.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
