import { ExperienceCard } from "@/components/experience-card"
import { ExperienceCardSkeleton } from "@/components/experience-card-skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const mockExperiences = [
  {
    id: "exp-001",
    createdAt: "2025-01-15T10:30:00Z",
    overallScore: 9.2,
    headline: "Excellent window installation, very professional team",
    summary:
      "The installation team arrived on time and completed the work efficiently. They were careful to protect our flooring and cleaned up thoroughly afterwards. The windows look fantastic and have made a noticeable difference to the warmth in our home.",
    tags: ["Communication", "Timeliness", "Quality"],
    sentiment: "positive" as const,
    companyActionNote:
      "Thank you for taking the time to share your experience. We're delighted the installation went smoothly and that you're already noticing the benefits. Our team takes pride in maintaining high standards of workmanship.",
    companyActionNoteApproved: true,
    companyName: "Bespoke Windows London",
  },
  {
    id: "exp-002",
    createdAt: "2025-01-10T14:00:00Z",
    overallScore: 8.5,
    headline: "Good quality product, minor scheduling delay",
    summary:
      "The final result is excellent and we're very happy with our new bay window. There was a slight delay in the initial scheduling which meant we had to rearrange our plans, but once the team arrived the work was completed to a high standard.",
    tags: ["Quality", "Value"],
    sentiment: "mixed" as const,
    // No companyActionNote - section should be hidden
    companyName: "Bespoke Windows London",
  },
  {
    id: "exp-003",
    createdAt: "2025-01-05T09:15:00Z",
    overallScore: 9.0,
    headline: "Transformed our living room with new French doors",
    summary:
      "We had French doors installed to replace an old sliding door. The difference is remarkable - so much more light and a beautiful finish. The surveyor was helpful in explaining our options and the installation was completed in one day.",
    tags: ["Communication", "Quality", "Professionalism"],
    sentiment: "positive" as const,
    companyActionNote: "We appreciate your feedback and are glad you're enjoying the new French doors.",
    companyActionNoteApproved: false, // Approved is false - section should be hidden
    companyName: "Bespoke Windows London",
  },
]

export default function ExperienceCardsDemo() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-10">
            <h1 className="text-2xl font-serif font-medium text-foreground mb-2">Experience Card Demo</h1>
            <p className="text-muted-foreground">
              Demonstrating the ExperienceCard component with different data scenarios.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
              1. With Company Action Note (Approved)
            </h2>
            <ExperienceCard experience={mockExperiences[0]} />
            <p className="text-xs text-muted-foreground mt-2 italic">
              Company action note is present and approved - section visible.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
              2. Without Company Action Note
            </h2>
            <ExperienceCard experience={mockExperiences[1]} />
            <p className="text-xs text-muted-foreground mt-2 italic">
              No company action note field - section hidden.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
              3. With Company Action Note (Not Approved)
            </h2>
            <ExperienceCard experience={mockExperiences[2]} />
            <p className="text-xs text-muted-foreground mt-2 italic">
              Company action note exists but approved is false - section hidden.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">Loading Skeleton</h2>
            <ExperienceCardSkeleton />
            <p className="text-xs text-muted-foreground mt-2 italic">Skeleton state for loading experiences.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
