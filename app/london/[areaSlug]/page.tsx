import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BusinessLogo } from "@/components/business-logo"
import { getAllProfiles } from "@/lib/airtable"

interface PageProps {
  params: Promise<{ areaSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { areaSlug } = await params
  const areaName = decodeURIComponent(areaSlug).replace(/-/g, " ").split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  
  return {
    title: `Top Rated Service Companies in ${areaName} | SEI`,
    description: `Find the best verified service providers in ${areaName} based on actual customer experience data.`
  }
}

export default async function AreaPage({ params }: PageProps) {
  const { areaSlug } = await params
  
  // Clean up the slug (e.g., "east-dulwich" -> "east dulwich")
  const searchArea = decodeURIComponent(areaSlug).toLowerCase().replace(/-/g, " ")
  const displayArea = searchArea.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  // 1. Fetch all profiles from Airtable
  const allProfiles = await getAllProfiles()

  // 2. Filter profiles that match this area
  const areaProfiles = allProfiles.filter(profile => {
    const basedIn = (profile.location || "").toLowerCase()
    // Check if they are based there OR if they cover that area
    // (Assuming your profile object has these fields from the Airtable transform)
    return basedIn.includes(searchArea)
  })

  if (areaProfiles.length === 0) {
    notFound()
  }

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
                <Link href="/locations" className="hover:text-foreground transition-colors">Locations</Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-foreground">{displayArea}</span>
              </li>
            </ol>
          </nav>

          <header className="mb-10">
            <h1 className="text-3xl font-semibold text-foreground mb-4">
              Best Service Companies in {displayArea}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Browse top-rated professionals serving {displayArea}. All ratings are based on verified post-completion data.
            </p>
          </header>

          <section className="space-y-4">
            {areaProfiles.map((profile, index) => (
              <div key={profile.slug} className="border border-border rounded-lg p-4 bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                    <BusinessLogo logoUrl={profile.logoUrl} businessName={profile.businessName} size="sm" />
                    <div>
                      <Link href={`/profiles/${profile.slug}`} className="font-medium text-foreground hover:text-accent transition-colors">
                        {profile.businessName}
                      </Link>
                      <p className="text-xs text-muted-foreground">{profile.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold text-foreground tabular-nums">
                      {profile.overallScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">/10</div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                   <p className="text-sm text-muted-foreground line-clamp-1 flex-1 mr-4">
                    {profile.shortDescription}
                  </p>
                  {/* Link to the specific Trade + Area page */}
                  <Link 
                    href={`/london/${areaSlug}/${profile.category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    View more {profile.category} in {displayArea} →
                  </Link>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}