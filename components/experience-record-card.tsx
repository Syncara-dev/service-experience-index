interface ExperienceRecordProps {
  customerLabel: string
  date: string
  headline: string
  projectType?: string
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
  customerNote?: string
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

// Extract postcode from customerLabel (e.g. "Sarah (SW11)" -> "SW11")
function extractPostcode(customerLabel: string): string | null {
  const match = customerLabel.match(/\(([A-Z0-9]+)\)/)
  return match ? match[1] : null
}

export function ExperienceRecordCard({
  customerLabel,
  date,
  headline,
  projectType,
  overallScore,
  summaryPublic,
  sentiment,
  tags,
  ratings,
  behaviouralNote,
  customerNote,
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
        {/* Score badge */}
        <div className="mb-3">
          <div
            className={`inline-flex w-10 h-10 rounded-md items-center justify-center font-medium text-sm tabular-nums ${scoreColor}`}
          >
            {overallScore.toFixed(1)}
          </div>
        </div>

        {/* Meta line: customer label + date + sentiment */}
        <div className="flex items-center gap-2 mb-3">
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

        {/* Project Details */}
        {(() => {
          const postcode = extractPostcode(customerLabel)
          const hasDetails = projectType || postcode
          if (!hasDetails) return null
          
          const detailParts: string[] = []
          if (projectType) detailParts.push(projectType)
          if (postcode) detailParts.push(postcode)
          
          return (
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Project Details
              </p>
              <p className="text-sm text-foreground">{detailParts.join(" · ")}</p>
            </div>
          )
        })()}

        {/* Customer summary */}
        <p className="text-sm text-foreground leading-relaxed mb-4">{summaryPublic}</p>

        {/* Customer Note */}
        {customerNote && customerNote.trim() && (
          <div className="mb-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 mb-1">
              Customer note
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {customerNote}
            </p>
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

      </div>
    </article>
  )
}
