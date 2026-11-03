import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { EVIDENCE_THRESHOLD, getAreaSummaries } from "@/lib/area-evidence"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Verified work by area | Service Experience Index",
  description:
    "Areas with verified customer experiences, from structured phone interviews after each job was completed. Each area shows the number of verified projects and, once there are enough, the average customer score.",
  alternates: { canonical: "/locations" },
}

export default async function LocationsListPage() {
  const areas = await getAreaSummaries()
  const published = areas.filter((a) => a.status === "published")
  const building = areas.filter((a) => a.status === "building")

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-4">Verified work by area</h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              Every area where SEI holds verified customer experiences, counted by the area of the job, not where a company
              says it works. Scores appear once an area has {EVIDENCE_THRESHOLD} or more verified projects.
            </p>
          </header>

          {areas.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground">No verified area evidence is available yet.</p>
            </div>
          ) : (
            <>
              {published.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Areas with published scores</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {published.map((a) => (
                      <Link
                        key={a.areaKey}
                        href={`/london/${a.areaKey}`}
                        className="border border-border rounded-lg px-4 py-3 bg-card hover:border-accent/50 hover:bg-muted/30 transition-colors"
                      >
                        <span className="block text-sm font-medium text-foreground">{a.label}</span>
                        <span className="block text-xs text-muted-foreground mt-1">
                          {a.verifiedExperiences} verified projects
                          {a.averageScore !== null ? ` · ${a.averageScore.toFixed(1)} average` : ""}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {building.length > 0 && (
                <section>
                  <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Evidence building</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {building.map((a) => (
                      <Link
                        key={a.areaKey}
                        href={`/london/${a.areaKey}`}
                        className="border border-border rounded-lg px-4 py-3 bg-card hover:border-accent/50 hover:bg-muted/30 transition-colors"
                      >
                        <span className="block text-sm font-medium text-foreground">{a.label}</span>
                        <span className="block text-xs text-muted-foreground mt-1">
                          {a.verifiedExperiences} verified {a.verifiedExperiences === 1 ? "project" : "projects"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
