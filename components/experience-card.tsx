interface Experience {
  id: string
  createdAt: string
  overallScore: number
  headline: string
  summary: string
  tags: string[]
  sentiment: "positive" | "mixed" | "negative"
  companyActionNote?: string | null
  companyActionNoteApproved?: boolean
  companyName: string
}

interface ExperienceCardProps {
  experience: Experience
}

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  } catch {
    return isoDate
  }
}

function getSentimentStyles(sentiment: Experience["sentiment"]): { bg: string; text: string; label: string } {
  switch (sentiment) {
    case "positive":
      return { bg: "bg-accent/10", text: "text-accent", label: "Positive" }
    case "mixed":
      return { bg: "bg-muted", text: "text-muted-foreground", label: "Mixed" }
    case "negative":
      return { bg: "bg-destructive/10", text: "text-destructive", label: "Negative" }
    default:
      return { bg: "bg-muted", text: "text-muted-foreground", label: "Unknown" }
  }
}

function getScoreColor(score: number): string {
  if (score >= 8) return "bg-accent text-accent-foreground"
  if (score >= 5) return "bg-muted text-foreground"
  return "bg-destructive/10 text-destructive"
}

function shouldShowCompanyActionNote(experience: Experience): boolean {
  const note = experience.companyActionNote
  if (!note || note.trim().length === 0) return false
  if (experience.companyActionNoteApproved === false) return false
  return true
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const sentimentStyles = getSentimentStyles(experience.sentiment)
  const scoreColor = getScoreColor(experience.overallScore)
  const showActionNote = shouldShowCompanyActionNote(experience)

  return (
    <article className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="px-5 py-4">
        {/* Top row: score + headline */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center font-medium text-sm tabular-nums ${scoreColor}`}
          >
            {experience.overallScore.toFixed(1)}
          </div>
          <h3 className="text-base font-medium text-foreground leading-snug pt-1">{experience.headline}</h3>
        </div>

        {/* Meta line: date + sentiment */}
        <div className="flex items-center gap-2 mb-4">
          <time dateTime={experience.createdAt} className="text-xs text-muted-foreground">
            {formatDate(experience.createdAt)}
          </time>
          <span className="text-muted-foreground">·</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${sentimentStyles.bg} ${sentimentStyles.text}`}>
            {sentimentStyles.label}
          </span>
        </div>

        {/* Customer summary */}
        <p className="text-sm text-foreground leading-relaxed mb-4">{experience.summary}</p>

        {/* Tags */}
        {experience.tags && experience.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {experience.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Company action note (conditional) */}
        {showActionNote && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="bg-muted/50 border border-border rounded-md px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Company action note
              </p>
              <p className="text-sm text-foreground leading-relaxed">{experience.companyActionNote}</p>
              {experience.companyName && (
                <p className="text-xs text-muted-foreground mt-2">From {experience.companyName}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
