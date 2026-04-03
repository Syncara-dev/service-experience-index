import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BusinessLogo } from "@/components/business-logo"
import { getTradeConfig, getAllTradeSlugs } from "@/lib/trades"
import { getProfilesForTrade } from "@/lib/data" // Points to our smart engine

interface PageProps {
  params: Promise<{ tradeSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tradeSlug } = await params
  const trade = getTradeConfig(tradeSlug)
  if (!trade) return { title: "Trade Not Found" }
  return { title: `Top Rated ${trade.label}` }
}

export default async function TradePage({ params }: PageProps) {
  const { tradeSlug } = await params
  const trade = getTradeConfig(tradeSlug)

  if (!trade) {
    notFound()
  }

  // Use the smart engine we just updated in lib/data.ts
  const profiles = await getProfilesForTrade(tradeSlug)

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <header className="mb-10">
            <h1 className="text-3xl font-semibold text-foreground mb-4">{trade.label}</h1>
            <p className="text-muted-foreground">{trade.description}</p>
          </header>

          <section>
            {profiles.length > 0 ? (
              <div className="space-y-4">
                {profiles.map((profile, index) => (
                  <div key={profile.slug} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                        <BusinessLogo logoUrl={profile.logoUrl} businessName={profile.businessName} size="sm" />
                        <div>
                          <Link href={`/profiles/${profile.slug}`} className="font-medium hover:text-accent transition-colors">
                            {profile.businessName}
                          </Link>
                          <p className="text-xs text-muted-foreground">{profile.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-semibold tabular-nums">{profile.overallScore.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">/10</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">No {trade.label.toLowerCase()} found in Airtable yet.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}