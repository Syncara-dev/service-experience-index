import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShareableProfileHeader } from "@/components/shareable-profile-header"
import { ScoreBar } from "@/components/score-bar"
import { ConsistencySignals } from "@/components/consistency-signals"
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

  const title = `${profile.businessName} – Verified Experience Profile`
  return {
    title,
    description: `Verified experience for ${profile.businessName}. Score: ${profile.overallScore}/10 based on ${profile.sampleSize} conversations.`,
    openGraph: { title, type: "profile" },
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  if (!profile) notFound()

  const records = await getRecordsForProfile(slug)

  return (
    <div className="min-h-screen flex flex-col">
      <ProfileJsonLd {...profile} />
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <article className="mx-auto max-w-3xl px-6">
          <ShareableProfileHeader {...profile} />

          <p className="text-xs text-muted-foreground mt-6">
            Profile last updated: {profile.dateRange.split("–")[1]?.trim() || profile.dateRange}
          </p>

          {/* Experience Summary */}
          <section className="py-10 border-b border-border">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Experience Summary</h2>
            <p className="text-foreground leading-relaxed">{profile.summary}</p>
          </section>

          {/* Score Breakdown */}
          <section className="py-10 border-b border-border">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">Score Breakdown</h2>
            <div className="space-y-4">
              <ScoreBar label="Product Satisfaction" score={profile.scores.productSatisfaction} />
              <ScoreBar label="Installation Satisfaction" score={profile.scores.installationSatisfaction} />
              <ScoreBar label="Process & Communication" score={profile.scores.processCommunication} />
              <ScoreBar label="Likelihood to Recommend" score={profile.scores.likelihoodToRecommend} />
            </div>
          </section>

          {/* Consistency Signals */}
          <section className="py-10 border-b border-border">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">Consistency Signals</h2>
            <ConsistencySignals {...profile.consistencySignals} />
          </section>
          
          {/* Services Offered */}
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

          {/* Location Section - STRICTLY AIRTABLE */}
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

          {/* Pagination Component - Shows 5 swapped records */}
          <PaginatedRecords records={records} businessName={profile.businessName} />

          {profile.externalPresence && <MarketPresence externalPresence={profile.externalPresence} />}

          <section className="py-10">
            <VerificationDisclosure />
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}