import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BusinessLogo } from "@/components/business-logo"
import { getProfilesForTradeAndArea, getRecentRecordsForArea, getTopProfilesForTrade } from "@/lib/data"
import { getAreaConfig, getAllAreaSlugs, getRelatedAreas, getBreadcrumbs } from "@/lib/locations"
import { getTradeConfig, getAllTradeSlugs } from "@/lib/trades"
import { ExternalLink } from "lucide-react"

interface PageProps {
  params: Promise<{ areaSlug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllAreaSlugs()
  return slugs.map((areaSlug) => ({ areaSlug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { areaSlug } = await params
  const area = getAreaConfig(areaSlug)

  if (!area) {
    return { title: "Area Not Found | Service Experience Index" }
  }

  return {
    title: `Best Window Companies in ${area.name} | Service Experience Index`,
    description: `Compare window companies serving ${area.name} using verified customer experience records, SEI scores, project types, and recent activity.`,
    alternates: {
      canonical: `/london/${area.slug}/best-window-companies`,
    },
  }
}

export default async function LocationPage({ params }: PageProps) {
  const { areaSlug } = await params
  const area = getAreaConfig(areaSlug)

  if (!area) {
    notFound()
  }

  // This page is specifically for windows - use the new trade-based data layer
  const trade = getTradeConfig("windows")!
  let profiles = await getProfilesForTradeAndArea("windows", area.name)
  const recentRecords = await getRecentRecordsForArea(area.name, area.postcodePrefix, 6)
  const relatedAreas = getRelatedAreas(areaSlug)
  const breadcrumbs = getBreadcrumbs(areaSlug)

  // Track if we're using fallback data
  let usingFallbackProfiles = false

  // If no area-specific profiles for windows, fall back to top window companies
  if (profiles.length === 0) {
    profiles = await getTopProfilesForTrade("windows", 5)
    usingFallbackProfiles = true
  }

  const totalRecords = profiles.reduce((sum, p) => sum + p.sampleSize, 0)
  const lastUpdated = new Date().toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  })

  // Check if we have area-specific data
  const hasAreaSpecificRecords = recentRecords.length > 0
  // Determine if we have enough verified records to use "Best" title
  const hasSubstantialData = totalRecords >= 5 && hasAreaSpecificRecords && !usingFallbackProfiles

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <article className="mx-auto max-w-4xl px-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-foreground">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-foreground transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Browse all locations link */}
          <p className="text-sm text-muted-foreground mb-6">
            <Link href="/locations" className="text-accent hover:text-accent/80 transition-colors">
              Browse all locations &rarr;
            </Link>
          </p>

          {/* Hero / Page Intro */}
          <header className="mb-10">
            <h1 className="text-3xl font-semibold text-foreground mb-4 text-balance">
              {profiles.length > 0
                ? `Best Window Companies Serving ${area.name}`
                : `Window Companies Serving ${area.name}`}
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Service Experience Index ranks window companies serving {area.name} using verified post-completion
              customer records, including workmanship, communication, and recommendation signals.{" "}
              <Link href="/profiles" className="text-accent hover:text-accent/80 transition-colors">
                Explore all company profiles &rarr;
              </Link>
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground">{profiles.length}</strong>{" "}
                {profiles.length === 1 ? "company currently ranked" : "companies currently ranked"}
              </span>
              {hasSubstantialData ? (
                <span>
                  <strong className="text-foreground">{totalRecords}</strong> verified records
                </span>
              ) : (
                <span>Limited verified data currently available for this area</span>
              )}
              <span>Last updated: {lastUpdated}</span>
            </div>
          </header>

          {/* Limited Data Disclaimer */}
          {(!hasSubstantialData || usingFallbackProfiles) && profiles.length > 0 && (
            <div className="mb-8 p-4 border border-border rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">
                We do not yet have enough verified records specific to {area.name}. The companies below are
                top-performing SEI profiles currently operating in or around {area.name}.
              </p>
            </div>
          )}

          {/* Answer Line */}
          {profiles.length > 0 && (
            <p className="text-muted-foreground mb-6">
              Top window companies serving {area.name} based on verified SEI data:
            </p>
          )}

          {/* Ranked Comparison Table */}
          <section className="mb-12">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Ranked Comparison
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Rankings are based on verified post-completion customer records.
              </p>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border border-border rounded-lg overflow-hidden">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Company
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        SEI Score
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Records
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Latest Record
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Project Types
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {profiles.map((profile, index) => (
                      <tr key={profile.slug} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4 text-sm font-medium text-foreground">{index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <BusinessLogo
                              logoUrl={profile.logoUrl}
                              businessName={profile.businessName}
                              size="sm"
                            />
                            <Link
                              href={`/profiles/${profile.slug}`}
                              className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                            >
                              {profile.businessName}
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-12 h-8 rounded bg-accent/10 text-accent text-sm font-medium tabular-nums">
                            {profile.overallScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-muted-foreground">
                          {profile.sampleSize > 0 ? profile.sampleSize : "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {profile.dateRange ? profile.dateRange.split("–").pop()?.trim() : "—"}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {profile.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/profiles/${profile.slug}`}
                              className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                              View profile
                            </Link>
                            {profile.website && (
                              <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                              >
                                Website
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {profiles.map((profile, index) => (
                  <div key={profile.slug} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                        <BusinessLogo logoUrl={profile.logoUrl} businessName={profile.businessName} size="sm" />
                        <Link
                          href={`/profiles/${profile.slug}`}
                          className="font-medium text-foreground hover:text-accent transition-colors"
                        >
                          {profile.businessName}
                        </Link>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-semibold text-foreground">{profile.overallScore.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">/10</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      {profile.sampleSize > 0 ? (
                        <>
                          <span>{profile.sampleSize} verified records</span>
                          {profile.dateRange && (
                            <span>Latest: {profile.dateRange.split("–").pop()?.trim()}</span>
                          )}
                        </>
                      ) : (
                        <span>Serves {area.name} area</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {profile.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/profiles/${profile.slug}`}
                        className="flex-1 text-center text-sm px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        View profile
                      </Link>
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                          Website
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          {/* Company Evidence Blocks */}
          {profiles.length > 0 && (
            <section className="mb-12 py-10 border-t border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Company Evidence
              </h2>
              <div className="space-y-6">
                {profiles.map((profile) => (
                  <div key={profile.slug} className="border border-border rounded-lg p-6 bg-card">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <BusinessLogo logoUrl={profile.logoUrl} businessName={profile.businessName} size="md" />
                        <div>
                          <h3 className="font-medium text-foreground">{profile.businessName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {profile.sampleSize > 0
                              ? `${profile.sampleSize} verified records · ${profile.dateRange}`
                              : `Serves ${area.name} area`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-foreground tabular-nums">
                          {profile.overallScore.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">/10</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{profile.shortDescription}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {profile.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/profiles/${profile.slug}`}
                      className="text-sm text-accent hover:text-accent/80 transition-colors"
                    >
                      View full profile
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Records Section */}
          {hasAreaSpecificRecords && (
            <section className="mb-12 py-10 border-t border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Recent verified records in {area.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentRecords.map((record, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link
                        href={`/profiles/${record.profileSlug}`}
                        className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                      >
                        {record.companyName}
                      </Link>
                      <span className="text-sm font-medium text-foreground tabular-nums">
                        {record.overallScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      {record.projectType && <span>{record.projectType}</span>}
                      {record.projectType && <span>·</span>}
                      <span>
                        {new Date(record.date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{record.summaryPublic}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Methodology Section */}
          <section className="mb-12 py-10 border-t border-border">
            <h2 className="text-lg font-medium text-foreground mb-4">How we rank companies in {area.name}</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Rankings are based on publicly available SEI data collected through verified customer conversations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Verified post-completion records are prioritised over self-reported reviews.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Communication quality, workmanship signals, and recommendation likelihood inform company performance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Sample size matters alongside score. Companies with more verified records provide stronger evidence.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>There are no paid placements. Rankings reflect verified customer experience data only.</span>
              </li>
            </ul>
          </section>

          {/* FAQ Section */}
          <section className="mb-12 py-10 border-t border-border">
            <h2 className="text-lg font-medium text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">
                  How does SEI rank window companies in {area.name}?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Companies are ranked by overall SEI score, which is calculated from verified post-completion customer
                  conversations. The score reflects product satisfaction, installation quality, communication, and
                  likelihood to recommend.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Are these reviews verified?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Yes. All records are collected through structured conversations with customers after project
                  completion. Companies cannot edit, filter, or selectively publish any records.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">What does the SEI score measure?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The SEI score is a composite measure of four factors: product satisfaction, installation quality,
                  process and communication, and likelihood to recommend. Scores range from 1 to 10.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">How often is this page updated?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rankings update automatically as new verified records are added to the index. Companies may move up or
                  down as more customer experience data is collected.
                </p>
              </div>
            </div>
          </section>

          {/* Related Areas */}
          {relatedAreas.length > 0 && (
            <section className="mb-12 py-10 border-t border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                Window companies in nearby areas
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedAreas.map((relatedArea) => (
                  <Link
                    key={relatedArea.slug}
                    href={`/london/${relatedArea.slug}/windows`}
                    className="text-sm px-4 py-2 rounded-full border border-border hover:border-accent/50 hover:bg-muted/50 transition-colors"
                  >
                    {relatedArea.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Other Trades in This Area */}
          <section className="mb-12 py-10 border-t border-border">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Other trades in {area.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {getAllTradeSlugs()
                .filter((slug) => slug !== "windows")
                .slice(0, 6)
                .map((slug) => {
                  const t = getTradeConfig(slug)
                  if (!t) return null
                  return (
                    <Link
                      key={slug}
                      href={`/london/${areaSlug}/${slug}`}
                      className="text-sm px-4 py-2 rounded-full border border-border hover:border-accent/50 hover:bg-muted/50 transition-colors"
                    >
                      {t.label}
                    </Link>
                  )
                })}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-10 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-medium text-foreground mb-1">Looking for other services?</h2>
                <p className="text-sm text-muted-foreground">
                  Browse all verified company profiles or learn about our methodology.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/profiles"
                  className="text-sm px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  All profiles
                </Link>
                <Link
                  href="/standards"
                  className="text-sm px-4 py-2 rounded border border-border bg-transparent hover:bg-muted/50 transition-colors"
                >
                  Methodology
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
