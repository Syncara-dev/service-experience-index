import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShareableProfileHeader } from "@/components/shareable-profile-header"
import { ScoreBar } from "@/components/score-bar"
import { ConsistencySignals } from "@/components/consistency-signals"
import { ExperienceRecordCard } from "@/components/experience-record-card"
import { VerificationDisclosure } from "@/components/verification-disclosure"
import { QuoteRequestForm } from "@/components/quote-request-form"
import { ProfileJsonLd } from "@/components/profile-json-ld"
import { MarketPresence } from "@/components/market-presence"
import { getProfileBySlug, getRecordsForProfile, getAllProfileSlugs } from "@/lib/data"

export const revalidate = 3600 // re-fetch from Airtable every hour

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

  if (!profile) {
    return { title: "Profile Not Found | Service Experience Index" }
  }

  return {
    title: `${profile.businessName} – Verified Experience Profile | Service Experience Index`,
    description: `Verified customer experience data for ${profile.businessName}. Overall score: ${profile.overallScore}/10 based on ${profile.sampleSize} post-completion conversations.`,
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { slug } = await params

  const profile = await getProfileBySlug(slug)

  if (!profile) {
    notFound()
  }

  const records = await getRecordsForProfile(slug)

  return (
    <div className="min-h-screen flex flex-col">
      <ProfileJsonLd
        businessName={profile.businessName}
        location={profile.location}
        category={profile.category}
        overallScore={profile.overallScore}
        sampleSize={profile.sampleSize}
        slug={profile.slug}
      />

      <SiteHeader />

      <main className="flex-1 py-10 md:py-14 print:py-8">
        <article className="mx-auto max-w-3xl px-6">
          {/* Header with score, badges, and share button */}
          <ShareableProfileHeader
            businessName={profile.businessName}
            location={profile.location}
            category={profile.category}
            overallScore={profile.overallScore}
            sampleSize={profile.sampleSize}
            dateRange={profile.dateRange}
            logoUrl={profile.logoUrl}
            website={profile.website}
          />

          {/* Profile Last Updated */}
          <p className="text-xs text-muted-foreground mt-6">
            Profile last updated: {profile.dateRange.split("–")[1]?.trim() || profile.dateRange}
          </p>

          {/* Experience Summary */}
          <section className="py-10 border-b border-border">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Experience Summary
            </h2>
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
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
              Consistency Signals
            </h2>
            <ConsistencySignals
              highScorePercentage={profile.consistencySignals.highScorePercentage}
              recommendationRate={profile.consistencySignals.recommendationRate}
              topThemes={profile.consistencySignals.topThemes}
            />
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

          {/* Location */}
          {(profile.baseLocation || (profile.areasCovered && profile.areasCovered.length > 0)) && (
            <section className="py-10 border-b border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Location</h2>
              <div className="space-y-2 text-sm text-foreground">
                {profile.baseLocation && (
                  <p>
                    <span className="text-muted-foreground">Based in</span> {profile.baseLocation}
                  </p>
                )}
                {profile.areasCovered && profile.areasCovered.length > 0 && (
                  <p>
                    <span className="text-muted-foreground">Areas covered</span> {profile.areasCovered.join(", ")}
                  </p>
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

          {/* Customer Voice */}
          {profile.customerVoice && profile.customerVoice.length > 0 && (
            <section className="py-10 border-b border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Customer Voice
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.customerVoice.map((item, index) => (
                  <blockquote key={index} className="pl-4 border-l-2 border-accent/30 text-sm text-muted-foreground">
                    <p className="italic">"{item.quote}"</p>
                    <footer className="mt-1 text-xs text-muted-foreground/70 not-italic">— {item.name}</footer>
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {/* Experience Records */}
          {records && records.length > 0 && (
            <section className="py-10 border-b border-border">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
                Experience Records
              </h2>
              <div className="space-y-4">
                {records.map((record, index) => (
                  <ExperienceRecordCard
                    key={index}
                    customerLabel={record.customerLabel}
                    date={record.date}
                    headline={record.headline}
                    overallScore={record.overallScore}
                    summaryPublic={record.summaryPublic}
                    sentiment={record.sentiment}
                    tags={record.tags}
                    ratings={record.ratings}
                    behaviouralNote={record.behaviouralNote}
                    companyActionNote={record.companyActionNote}
                    companyActionNoteApproved={record.companyActionNoteApproved}
                    companyName={profile.businessName}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Market Presence */}
          {profile.externalPresence && <MarketPresence externalPresence={profile.externalPresence} />}

          {/* Transparency Section */}
          <section className="py-10">
            <VerificationDisclosure />
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
