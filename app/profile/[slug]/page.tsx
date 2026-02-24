import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProfileHeader } from "@/components/profile-header"
import { ScoreBar } from "@/components/score-bar"
import { VerificationDisclosure } from "@/components/verification-disclosure"

// Sample data for demonstration
const sampleProfile = {
  businessName: "Hartley & Sons Plumbing",
  location: "Bristol, UK",
  category: "Plumbing Services",
  overallScore: 9.2,
  sampleSize: 18,
  dateRange: "Jan–Jun 2025",
  scores: {
    quality: 9.4,
    communication: 9.1,
    reliability: 9.3,
    value: 8.9,
    recommend: 9.5,
  },
  summary: `Hartley & Sons Plumbing demonstrates consistently strong performance across 
    all evaluation criteria. Customers particularly note the team's punctuality and 
    clear communication throughout the service process. Work quality is frequently 
    described as thorough and professional. Minor feedback suggests that initial 
    quote response times could be improved during peak periods, though this does 
    not significantly impact overall satisfaction.`,
  customerVoice: [
    "Clear explanation of the work needed and no surprises on the invoice.",
    "Arrived when they said they would, completed the job efficiently.",
    "Would use again. Professional team who cleaned up after themselves.",
  ],
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6">
          <ProfileHeader
            businessName={sampleProfile.businessName}
            location={sampleProfile.location}
            category={sampleProfile.category}
            overallScore={sampleProfile.overallScore}
            sampleSize={sampleProfile.sampleSize}
            dateRange={sampleProfile.dateRange}
          />

          {/* Experience Summary */}
          <section className="py-10 border-b border-border">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
              Experience Summary
            </h2>
            <p className="text-foreground leading-relaxed">{sampleProfile.summary}</p>
          </section>

          {/* Score Breakdown */}
          <section className="py-10 border-b border-border">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-6">Score Breakdown</h2>
            <div className="space-y-4">
              <ScoreBar label="Quality of Work" score={sampleProfile.scores.quality} />
              <ScoreBar label="Communication" score={sampleProfile.scores.communication} />
              <ScoreBar label="Reliability" score={sampleProfile.scores.reliability} />
              <ScoreBar label="Value for Money" score={sampleProfile.scores.value} />
              <ScoreBar label="Likelihood to Recommend" score={sampleProfile.scores.recommend} />
            </div>
          </section>

          {/* Customer Voice */}
          <section className="py-10 border-b border-border">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-6">Customer Voice</h2>
            <div className="space-y-4">
              {sampleProfile.customerVoice.map((quote, index) => (
                <blockquote key={index} className="pl-4 border-l-2 border-accent/30 text-muted-foreground italic">
                  "{quote}"
                </blockquote>
              ))}
            </div>
          </section>

          {/* Verification Disclosure */}
          <section className="py-10">
            <VerificationDisclosure />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
