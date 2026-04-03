import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getAllTrades } from "@/lib/trades"
import { getAllProfiles } from "@/lib/airtable"

export const metadata: Metadata = {
  title: "Browse Companies by Trade | Service Experience Index",
  description: "Explore service companies by trade using verified Service Experience Index data.",
}

export default async function TradesListPage() {
  const allSupportedTrades = getAllTrades()
  const allProfiles = await getAllProfiles()

  // --- DEBUGGING LOGS (Check your terminal/console) ---
  console.log(`[TradesPage] Found ${allProfiles.length} active profiles in Airtable.`)
  allProfiles.forEach(p => console.log(` - Profile: ${p.businessName} | Category: "${p.category}"`))
  // ----------------------------------------------------

  const activeTrades = allSupportedTrades.filter((trade) => {
    const isMatched = allProfiles.some((profile) => {
      if (!profile.category) return false
      
      const profileCat = profile.category.toLowerCase().trim()
      
      return trade.categoryMatch.some((match) => {
        const matchLower = match.toLowerCase().trim()
        
        // This is the "Smart Match"
        // It catches "Kitchen" matching "Kitchens" AND "Kitchen Installation" matching "Kitchen"
        const matched = profileCat.includes(matchLower) || matchLower.includes(profileCat)
        
        if (matched) {
          console.log(` ✅ Match Found! Trade "${trade.name}" matches Profile "${profile.businessName}" (Match word: "${matchLower}")`)
        }
        return matched
      })
    })
    return isMatched
  })

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-foreground">Trades</span>
              </li>
            </ol>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl font-semibold text-foreground mb-4">Browse Companies by Trade</h1>
            <p className="text-muted-foreground leading-relaxed">
              Select a trade to view top-rated companies based on verified customer experiences.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeTrades.length > 0 ? (
              activeTrades.map((trade) => (
                <Link
                  key={trade.slug}
                  href={`/trades/${trade.slug}`}
                  className="group border border-border rounded-xl p-5 bg-card hover:border-accent/50 hover:bg-muted/30 transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {trade.name}
                    </h2>
                    <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {trade.description}
                  </p>
                </Link>
              ))
            ) : (
              <div className="col-span-full p-12 text-center border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">No trades with active profiles found in Airtable.</p>
                <p className="text-xs text-muted-foreground mt-2">Check terminal for matching logs.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}