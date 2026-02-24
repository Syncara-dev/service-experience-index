export function ExperienceCardSkeleton() {
  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card animate-pulse">
      <div className="px-5 py-4">
        {/* Top row: score + headline */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-md bg-muted" />
          <div className="flex-1 pt-1">
            <div className="h-5 bg-muted rounded w-3/4" />
          </div>
        </div>

        {/* Meta line */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-16" />
        </div>

        {/* Summary lines */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5">
          <div className="h-5 bg-muted rounded-full w-20" />
          <div className="h-5 bg-muted rounded-full w-16" />
          <div className="h-5 bg-muted rounded-full w-14" />
        </div>
      </div>
    </div>
  )
}
