import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProfilesSearch } from "@/components/profiles-search"
import { getAllProfiles, getAllCategories } from "@/lib/data"

export const revalidate = 3600 // re-fetch from Airtable every hour

export const metadata: Metadata = {
  title: "Verified Business Profiles",
  description:
    "Browse verified customer experience profiles for service businesses. Independent, structured data from post-completion conversations.",
  alternates: { canonical: "/profiles" },
  openGraph: {
    title: "Verified Business Profiles | Service Experience Index",
    description:
      "Browse verified customer experience profiles for service businesses. Independent, structured data from post-completion conversations.",
    url: "/profiles",
  },
  twitter: {
    card: "summary",
    title: "Verified Business Profiles | Service Experience Index",
    description:
      "Browse verified customer experience profiles for service businesses. Independent, structured data from post-completion conversations.",
  },
}

export default async function ProfilesPage() {
  const profiles = await getAllProfiles()
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          {/* Page Header */}
          <header className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">Verified Business Profiles</h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Browse verified customer experience data for service businesses. Each profile represents structured
              feedback from post-completion conversations with actual customers.
            </p>
          </header>

          {/* Search and Profiles List */}
          <ProfilesSearch profiles={profiles} categories={categories} />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
