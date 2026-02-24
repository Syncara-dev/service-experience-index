interface ExperienceRecordProps {
  customerLabel: string
  date: string
  headline: string
  overallScore: number
  summaryPublic: string
  sentiment: "positive" | "mixed" | "negative"
  tags: string[]
  ratings: {
    productSatisfaction: number
    installationSatisfaction: number
    processCommunication: number
    likelihoodToRecommend: number
  }
  behaviouralNote?: string
  companyActionNote?: string
  companyActionNoteApproved?: boolean
  companyName?: string
}

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  } catch {
    return isoDate
  }
}

function getSentimentStyles(sentiment: ExperienceRecordProps["sentiment"]): { bg: string; text: string; label: string } {
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

function shouldShowCompanyActionNote(props: ExperienceRecordProps): boolean {
  const note = props.companyActionNote
  if (!note || note.trim().length === 0) return false
  if (props.companyActionNoteApproved === false) return false
  return true
}

export function ExperienceRecordCard({
  customerLabel,
  date,
  headline,
  overallScore,
  summaryPublic,
  sentiment,
  tags,
  ratings,
  behaviouralNote,
  companyActionNote,
  companyActionNoteApproved,
  companyName,
}: ExperienceRecordProps) {
  const sentimentStyles = getSentimentStyles(sentiment)
  const scoreColor = getScoreColor(overallScore)
  const showActionNote = shouldShowCompanyActionNote({ companyActionNote, companyActionNoteApproved } as ExperienceRecordProps)

  return (
    <article className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="px-5 py-4">
        {/* Top row: score badge + headline */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center font-medium text-sm tabular-nums ${scoreColor}`}
          >
            {overallScore.toFixed(1)}
          </div>
          <h3 className="text-base font-medium text-foreground leading-snug pt-1">{headline}</h3>
        </div>

        {/* Meta line: customer label + date + sentiment */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">{customerLabel}</span>
          <span className="text-muted-foreground">·</span>
          <time dateTime={date} className="text-xs text-muted-foreground">
            {formatDate(date)}
          </time>
          <span className="text-muted-foreground">·</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${sentimentStyles.bg} ${sentimentStyles.text}`}>
            {sentimentStyles.label}
          </span>
        </div>

        {/* Customer summary */}
        <p className="text-sm text-foreground leading-relaxed mb-4">{summaryPublic}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating Breakdown */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Product Satisfaction</span>
            <span className="font-medium text-foreground tabular-nums">{ratings.productSatisfaction.toFixed(1)} / 10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Installation Satisfaction</span>
            <span className="font-medium text-foreground tabular-nums">{ratings.installationSatisfaction.toFixed(1)} / 10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Process & Communication</span>
            <span className="font-medium text-foreground tabular-nums">{ratings.processCommunication.toFixed(1)} / 10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Likelihood to Recommend</span>
            <span className="font-medium text-foreground tabular-nums">{ratings.likelihoodToRecommend.toFixed(1)} / 10</span>
          </div>
        </div>

        {/* Behavioural Note */}
        {behaviouralNote && (
          <p className="mt-4 text-sm text-muted-foreground italic">Customer noted: {behaviouralNote}</p>
        )}

        {/* Company action note (conditional) */}
        {showActionNote && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="bg-muted/50 border border-border rounded-md px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Company action note
              </p>
              <p className="text-sm text-foreground leading-relaxed">{companyActionNote}</p>
              {companyName && (
                <p className="text-xs text-muted-foreground mt-2">From {companyName}</p>
              )}
            </div>
          </div>
        )}

        {/* Verification line */}
        <p className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
          Verified customer · Record collected post-completion
        </p>
      </div>
    </article>
  )
}
