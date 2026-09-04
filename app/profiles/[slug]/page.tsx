import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShareableProfileHeader } from "@/components/shareable-profile-header"
import { ScoreBar } from "@/components/score-bar"
import { ConsistencySignals } from "@/components/consistency-signals"
import { CustomerThemes } from "@/components/customer-themes"
import { VerificationDisclosure } from "@/components/verification-disclosure"
import { QuoteRequestForm } from "@/components/quote-request-form"
import { ProfileJsonLd } from "@/components/profile-json-ld"
import { MarketPresence } from "@/components/market-presence"
import { PaginatedRecords } from "@/components/paginated-records"
import { getProfileBySlug, getRecordsForProfile, getAllProfileSlugs } from "@/lib/data"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllProfileSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  if (!profile) return { title: "Profile Not Found | SEI" }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"
  const profileUrl = `${baseUrl}/profiles/${slug}`
  const title = `${profile.businessName} Verified Reviews & Experience Score | Service Experience Index`
  const description = `${profile.businessName} has an SEI score of ${profile.overallScore}/10 based on ${profile.sampleSize} verified customer interviews. Independent, structured experience data — not self-submitted reviews.`

  return {
    title,
    description,
    alternates: { canonical: profileUrl },
    openGraph: {
      title,
      description,
      url: profileUrl,
      type: "website",
      siteName: "Service Experience Index",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  if (!profile) notFound()

  const records = await getRecordsForProfile(slug)
  const displayDate = profile.dateRange.split("–")[1]?.trim() || profile.dateRange

  return (
    <div className="min-h-screen flex flex-col">
      <ProfileJsonLd {...profile} />
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <article className="mx-auto max-w-3xl px-6">
          {/* 1. Header contains Name, Score, and the FIRST "Based on 16..." line */}
          <ShareableProfileHeader {...profile} />

          {/* 2. Airtable Intro Block (No duplicated "Based on" lines here) */}
          <div className="mt-6 mb-4 space-y-4">
            {profile.profile_intro_public && (
              <p className="text-foreground leading-relaxed">
                {profile.profile_intro_public}
              </p>
            )}
            
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest border-t border-border pt-4">
              Profile last updated: {displayDate}
            </p>
          </div>

          {/* 3. Experience Summary Section */}
          {profile.experienceSummary && (
            <section className="py-10 border-b border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                Experience Summary
              </h2>
              <p className="text-foreground leading-relaxed">
                {profile.experienceSummary}
              </p>
            </section>
          )}

          <section className="py-10 border-b border-border">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
              Score Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12">
              <ScoreBar label="Product Satisfaction" score={profile.scores.productSatisfaction} />
              <ScoreBar label="Installation Satisfaction" score={profile.scores.installationSatisfaction} />
              <ScoreBar label="Process & Communication" score={profile.scores.processCommunication} />
              <ScoreBar label="Likelihood to Recommend" score={profile.scores.likelihoodToRecommend} />
            </div>
          </section>

          <section className="py-10 border-b border-border">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
              Consistency Signals
            </h2>
            <ConsistencySignals {...profile.consistencySignals} />
          </section>

          {profile.customerThemes && (
            <section className="py-10 border-b border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                What customers mention most
              </h2>
              <CustomerThemes data={profile.customerThemes} />
            </section>
          )}

          {profile.services && profile.services.length > 0 && (
            <section className="py-10 border-b border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                Services Offered
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-foreground">
                {profile.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </section>
          )}

          {(profile.baseLocation || (profile.areasCovered && profile.areasCovered.length > 0)) && (
            <section className="py-10 border-b border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Location</h2>
              <div className="space-y-4 text-sm text-foreground">
                {profile.baseLocation && (
                  <p><span className="text-muted-foreground">Based in</span> {profile.baseLocation}</p>
                )}
                {profile.areasCovered && profile.areasCovered.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block mb-3">Areas served</span>
                    <div className="flex flex-wrap gap-2">
                      {profile.areasCovered.map((area: string) => (
                        <span
                          key={area}
                          className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-accent/50 hover:bg-muted/30 transition-colors cursor-default"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          <div className="py-6 border-b border-border">
            <QuoteRequestForm
              profileSlug={profile.slug}
              businessName={profile.businessName}
              category={profile.category}
            />
          </div>

          <PaginatedRecords records={records} businessName={profile.businessName} />

          {profile.externalPresence && <MarketPresence externalPresence={profile.externalPresence} />}

          <section className="py-10">
            <VerificationDisclosure />
          </section>

          <div className="pb-10 text-center">
            <a
              href="https://serviceexperienceindex.com"
              className="text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
            >
              View more profiles on the Service Experience Index
            </a>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}