import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BusinessLogo } from "@/components/business-logo"
import { AreaJsonLd } from "@/components/area-json-ld"
import { EVIDENCE_THRESHOLD, getAreaEvidence, normaliseAreaSlug, productSentence } from "@/lib/area-evidence"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ areaSlug: string }>
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"

function formatDate(iso?: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  if (!iso) return ""
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", opts)
}

function headlineFor(area: NonNullable<Awaited<ReturnType<typeof getAreaEvidence>>>) {
  return area.trades.length === 1
    ? `Verified ${area.trades[0].copy.installations} in ${area.label}`
    : `Verified home improvement work in ${area.label}`
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { areaSlug } = await params
  const area = await getAreaEvidence(areaSlug)
  if (!area) return { title: "Area not found | Service Experience Index" }

  const headline = headlineFor(area)
  const districts = area.postcodeDistricts.length ? ` (${area.postcodeDistricts.join(", ")})` : ""
  const scorePart = area.averageScore !== null ? `, average customer score ${area.averageScore}/10` : ""
  const products = area.trades.length === 1 ? productSentence(area.trades[0].products) : undefined
  return {
    title: `${headline}${districts} | Service Experience Index`,
    description: `${area.verifiedExperiences} verified customer experiences in ${area.label}${scorePart}.${products ? ` ${products}` : ""} Collected through structured phone interviews after each job was completed, not self-submitted reviews.`,
    alternates: { canonical: `/london/${area.areaKey}` },
    // Areas still building evidence are visible to visitors but kept out of search
    // results until they reach the publishing threshold.
    ...(area.status === "building" ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function AreaPage({ params }: PageProps) {
  const { areaSlug } = await params
  const canonical = normaliseAreaSlug(areaSlug)

  const area = await getAreaEvidence(canonical)
  if (!area) notFound()

  // Older links used slugs built from the "based in" text, e.g. /london/east-dulwich-(se22).
  if (areaSlug !== area.areaKey) permanentRedirect(`/london/${area.areaKey}`)

  const building = area.status === "building"
  const headline = headlineFor(area)
  const districts = area.postcodeDistricts.join(", ")
  const companyCount = area.trades.reduce((n, t) => n + t.companies.length, 0)
  const period =
    area.firstDate && area.latestDate
      ? `${formatDate(area.firstDate, { month: "short" })} – ${formatDate(area.latestDate, { month: "short", year: "numeric" })}`
      : ""

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <AreaJsonLd area={area} baseUrl={baseUrl} />

      <main className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-6">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <Link href="/locations" className="hover:text-foreground transition-colors">London</Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-foreground">{area.label}</span>
              </li>
            </ol>
          </nav>

          <header className="pb-8 border-b border-border">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-accent/10 text-accent rounded">
                Area evidence{districts ? ` · ${districts}` : ""}
              </span>
              <span className="text-xs text-muted-foreground">Verified from recorded customer conversations</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground text-balance mb-4">{headline}</h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              What {area.label} homeowners said after{" "}
              {area.trades.length === 1 ? area.trades[0].copy.afterPhrase : "the work was finished"}, from phone interviews SEI
              carried out once each job was completed. These are not reviews customers chose to post.
            </p>
            {area.trades.map((t) => {
              const sentence = productSentence(t.products)
              return sentence ? (
                <p key={t.category} className="mt-3 text-foreground leading-relaxed max-w-2xl">
                  {area.trades.length > 1 ? `${t.copy.companies.replace(/ companies$/, "")}: ` : ""}
                  {sentence}
                </p>
              ) : null
            })}
            {building && (
              <p className="mt-4 text-sm text-muted-foreground border border-border rounded-md px-4 py-3 max-w-2xl">
                Evidence is still building here. Scores are published once there are {EVIDENCE_THRESHOLD} or more verified
                projects in an area; {area.label} has {area.verifiedExperiences} so far.
              </p>
            )}
          </header>

          <section className="py-8 border-b border-border" aria-label="Key figures">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="px-5 py-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-serif font-medium text-foreground tabular-nums">{area.verifiedExperiences}</div>
                <p className="text-sm text-muted-foreground mt-1">verified {area.verifiedExperiences === 1 ? "project" : "projects"}</p>
              </div>
              <div className="px-5 py-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-serif font-medium text-foreground tabular-nums">
                  {area.averageScore !== null ? area.averageScore.toFixed(1) : "—"}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {area.averageScore !== null ? "average customer score" : "score once 5 projects are verified"}
                </p>
              </div>
              <div className="px-5 py-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-serif font-medium text-foreground tabular-nums">{area.unitsInstalled}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {area.trades.length === 1 ? area.trades[0].copy.unitsCaption : "items installed"}
                </p>
              </div>
              <div className="px-5 py-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-serif font-medium text-foreground tabular-nums">{companyCount}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {companyCount === 1 ? "company" : "companies"} with verified work here
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {period ? `${period}. ` : ""}Counts cover verified experiences in the SEI dataset, not every job completed in the area.
            </p>
          </section>

          {area.trades.map((trade) => (
            <div key={trade.category}>
              <section className="py-10 border-b border-border">
                <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
                  {trade.copy.companies} with verified work in {area.label}
                </h2>
                <div className="space-y-4">
                  {trade.companies.map((c) => (
                    <article key={c.slug} className="border border-border rounded-lg p-5 bg-card flex flex-col md:flex-row md:items-center gap-5">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <BusinessLogo logoUrl={c.logoUrl} businessName={c.name} size="md" />
                        <div className="min-w-0">
                          <Link href={`/profiles/${c.slug}`} className="font-serif text-xl font-medium text-foreground hover:text-accent transition-colors">
                            {c.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            {c.verifiedExperiences} verified {c.verifiedExperiences === 1 ? "project" : "projects"} in {area.label}
                            {c.basedIn ? ` · Based in ${c.basedIn}` : ""}
                            {c.fensaRegistered ? " · FENSA registered" : ""}
                          </p>
                          {c.mainProductSummary && (
                            <p className="text-sm text-foreground mt-1">Mostly {c.mainProductSummary}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-5 md:justify-end shrink-0">
                        <div className="text-right">
                          <div className="text-3xl font-serif font-medium text-foreground tabular-nums">
                            {c.averageScore !== null ? c.averageScore.toFixed(1) : "—"}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {c.averageScore !== null ? `in ${area.label}` : "building evidence"}
                          </div>
                        </div>
                        <Link
                          href={`/profiles/${c.slug}`}
                          className="px-4 py-2 border border-border rounded-md bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          View profile
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Companies are listed by the number of verified projects in this area. A local score is shown once a company
                  has {EVIDENCE_THRESHOLD} or more verified projects here.
                </p>
              </section>

              {trade.products.length > 0 && (
                <section className="py-10 border-b border-border">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
                    {trade.copy.installed} in {area.label}
                  </h2>
                  <div className="overflow-x-auto border border-border rounded-lg bg-card">
                    <table className="w-full text-sm min-w-[520px]">
                      <thead>
                        <tr className="text-left text-xs text-muted-foreground">
                          <th scope="col" className="px-5 py-3 font-medium">Product</th>
                          <th scope="col" className="px-5 py-3 font-medium text-right">Verified projects</th>
                          <th scope="col" className="px-5 py-3 font-medium text-right">Units installed</th>
                          <th scope="col" className="px-5 py-3 font-medium text-right">Average score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trade.products.map((p) => (
                          <tr key={p.key} className="border-t border-border">
                            <td className="px-5 py-3 text-foreground">{p.label}</td>
                            <td className="px-5 py-3 text-right tabular-nums">{p.verifiedProjects}</td>
                            <td className="px-5 py-3 text-right tabular-nums">{p.unitsInstalled}</td>
                            <td className="px-5 py-3 text-right tabular-nums">
                              {p.averageScore !== null ? (
                                <span className="font-medium text-foreground">{p.averageScore.toFixed(1)}</span>
                              ) : (
                                <span className="text-muted-foreground">Building evidence</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    A job with two product types counts once under each. Scores appear after {EVIDENCE_THRESHOLD} verified projects.
                  </p>
                </section>
              )}
            </div>
          ))}

          {area.recentRecords.length > 0 && (
            <section className="py-10 border-b border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Recent verified experiences in {area.label}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {area.recentRecords.map((r, i) => (
                  <article key={r.slug ?? i} className="border border-border rounded-lg p-5 bg-card flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">
                        {[r.postcodeArea, formatDate(r.date)].filter(Boolean).join(" · ")}
                      </span>
                      <span className="text-sm font-medium px-2 py-0.5 rounded bg-accent/10 text-accent tabular-nums">
                        {r.score % 1 === 0 ? r.score.toFixed(0) : r.score.toFixed(1)}
                      </span>
                    </div>
                    {r.installed && <p className="text-sm text-muted-foreground">Installed: {r.installed}</p>}
                    {r.quote && <p className="text-sm text-foreground leading-relaxed">&ldquo;{r.quote}&rdquo;</p>}
                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {r.slug && (
                        <Link href={`/records/${r.slug}`} className="text-accent hover:underline">
                          Full record
                        </Link>
                      )}
                      {r.companySlug && (
                        <Link href={`/profiles/${r.companySlug}`} className="text-muted-foreground hover:text-foreground">
                          {r.companyName}
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {area.otherAreas.length > 0 && (
            <section className="py-10 border-b border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Other areas with verified work{area.region ? ` in ${area.region}` : ""}
              </h2>
              <div className="flex flex-wrap gap-3">
                {area.otherAreas.map((o) => (
                  <Link
                    key={o.areaKey}
                    href={`/london/${o.areaKey}`}
                    className="px-4 py-2 border border-border rounded-md bg-card text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    {o.label} · {o.verifiedExperiences} {o.verifiedExperiences === 1 ? "project" : "projects"}
                    {o.averageScore !== null ? ` · ${o.averageScore.toFixed(1)}` : " · building"}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="py-10">
            <div className="bg-muted/50 rounded-lg px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Every figure on this page comes from structured phone interviews after a job was completed. Only the postcode
                district is published, never a customer&apos;s name or address.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm shrink-0">
                <Link href="/methodology" className="font-medium text-accent hover:underline">How SEI verifies experiences</Link>
                <a href={`/api/areas/${area.areaKey}`} className="text-muted-foreground hover:text-foreground">Data (JSON)</a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
