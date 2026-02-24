interface ProfileHeaderProps {
  businessName: string
  location: string
  category: string
  overallScore: number
  sampleSize: number
  dateRange: string
}

export function ProfileHeader({
  businessName,
  location,
  category,
  overallScore,
  sampleSize,
  dateRange,
}: ProfileHeaderProps) {
  return (
    <div className="border-b border-border pb-8">
      <div className="flex items-start justify-between gap-8 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded">
              Verified Experience Profile
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-3">{businessName}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{location}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{category}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-5xl font-serif font-medium text-foreground tabular-nums">{overallScore.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground mt-1">out of 10</div>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
        <div>
          <span className="text-foreground font-medium">{sampleSize}</span> post-completion conversations
        </div>
        <span className="w-1 h-1 rounded-full bg-border" />
        <div>Collected {dateRange}</div>
      </div>
    </div>
  )
}
