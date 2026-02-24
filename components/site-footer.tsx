import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
                <span className="text-[10px] font-semibold text-primary-foreground">SEI</span>
              </div>
              <span className="font-medium text-foreground">Service Experience Index</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Independent, verified customer experience data for service businesses.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Resources</span>
            <Link href="/standards" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
              Verification Standards
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            This index publishes verified customer experience records for service businesses meeting minimum data and
            verification thresholds.
          </p>
          <p className="text-xs text-muted-foreground">Published using Syncara verification standards</p>
        </div>
      </div>
    </footer>
  )
}
