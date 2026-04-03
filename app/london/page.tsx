import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getAllProfiles } from "@/lib/airtable" 

export const metadata: Metadata = {
  title: "Browse by Location | Service Experience Index",
}

export default async function LondonPage() {
  // 1. Fetch profiles ONLY from Airtable
  const allProfiles = await getAllProfiles()

  // 2. Extract areas strictly from the 'based_in' field (which maps to profile.location)
  const uniqueAreas = new Set<string>()
  allProfiles.forEach(profile => {
    if (profile.location && profile.location.trim() !== "") {
      uniqueAreas.add(profile.location.trim())
    }
  })

  const activeAreas = Array.from(uniqueAreas).sort()

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <header className="mb-10">
            <h1 className="text-3xl font-semibold text-foreground mb-4">Browse by Location</h1>
            <p className="text-muted-foreground leading-relaxed">
              Showing only areas with verified {activeAreas.length > 0 ? "companies" : "data"}.
            </p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {activeAreas.length > 0 ? (
              activeAreas.map((area) => {
                // Dynamically create a clean URL slug from the Airtable string
                const areaSlug = area.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, "")
                return (
                  <Link
                    key={area}
                    href={`/london/${areaSlug}`}
                    className="border border-border rounded-lg px-4 py-3 bg-card hover:border-accent/50 hover:bg-muted/30 transition-colors text-center"
                  >
                    <span className="text-sm font-medium text-foreground">{area}</span>
                  </Link>
                )
              })
            ) : (
              <div className="col-span-full p-12 text-center border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground mb-2">No active locations found in Airtable.</p>
                <p className="text-xs text-muted-foreground/60">
                  (Make sure your Airtable records are not set to "Draft")
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}