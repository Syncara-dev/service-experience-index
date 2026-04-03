import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BusinessLogo } from "@/components/business-logo"
import { getAllProfiles } from "@/lib/airtable"

interface PageProps {
  params: Promise<{ areaSlug: string; tradeSlug: string }>
}

export default async function DynamicTradeAreaPage({ params }: PageProps) {
  // Grab the dynamic variables from the URL
  const { areaSlug, tradeSlug } = await params
  
  // Clean up the URL slugs for searching Airtable (e.g., "east-dulwich" -> "east dulwich")
  const searchTrade = decodeURIComponent(tradeSlug).toLowerCase().replace(/-/g, " ")
  const searchArea = decodeURIComponent(areaSlug).toLowerCase().replace(/-/g, " ")

  // Capitalize the area for the UI (e.g., "East Dulwich")
  const displayArea = searchArea.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  // 1. Fetch ALL data directly from Airtable
  const allProfiles = await getAllProfiles()

  // 2. Filter for the TRADE (using the "category" field from Airtable)
  const tradeProfiles = allProfiles.filter(profile => {
    if (!profile.category) return false
    return profile.category.toLowerCase().includes(searchTrade)
  })

  // If there are zero profiles for this trade in the whole database, 404.
  if (tradeProfiles.length === 0) {
    notFound()
  }

  // Get the exact category name straight from Airtable (e.g., "Windows")
  const displayCategory = tradeProfiles[0].category

  // 3. Filter for the AREA (using "baseLocation" OR "areasCovered" fields)
  const exactAreaProfiles = tradeProfiles.filter(profile => {
    const basedIn = (profile.baseLocation || "").toLowerCase()
    const areasCovered = (profile.areasCovered || []).map(a => a.toLowerCase())
    
    return basedIn.includes(searchArea) || areasCovered.some(a => a.includes(searchArea))
  })

  // 4. Fallback Logic (Rule 5 of your Developer Brief)
  // If we have local companies, show them. If not, show ALL London companies for this trade + a disclaimer.
  const hasExactData = exactAreaProfiles.length > 0
  const profilesToDisplay = hasExactData ? exactAreaProfiles : tradeProfiles

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <Link href="/london" className="hover:text-foreground transition-colors">London</Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-foreground">{displayArea}</span>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-foreground">{displayCategory}</span>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-semibold text-foreground mb-4">
              Top Rated {displayCategory} in {displayArea}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Based on verified Service Experience Index data, find the best {displayCategory.toLowerCase()} serving {displayArea} and surrounding areas.
            </p>
          </header>

          {/* Results Section */}
          <section className="mb-12">
            
            {/* Rule 5 Disclaimer: Injected if exact local data is limited */}
            {!hasExactData && (
              <div className="mb-8 p-4 border border-amber-200 bg-amber-50 rounded-lg text-amber-800 text-sm">
                <strong>Note:</strong> We are still gathering specific data for {displayArea}. Displaying top {displayCategory.toLowerCase()} who cover the broader London area.
              </div>
            )}

            <div className="space-y-4">
              {profilesToDisplay.map((profile, index) => (
                <div key={profile.slug} className="border border-border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                      <BusinessLogo logoUrl={profile.logoUrl} businessName={profile.businessName} size="sm" />
                      <div>
                        <Link href={`/profiles/${profile.slug}`} className="font-medium text-foreground hover:text-accent transition-colors">
                          {profile.businessName}
                        </Link>
                        <p className="text-xs text-muted-foreground">{profile.location || profile.baseLocation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-foreground tabular-nums">
                        {profile.overallScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">/10</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{profile.shortDescription}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-muted rounded-md">{profile.category}</span>
                    <span>{profile.sampleSize} verified records</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}