import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-5xl px-6 py-5">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <span className="text-xs font-semibold text-primary-foreground">SEI</span>
            </div>
            <span className="text-lg font-medium tracking-tight text-foreground">Service Experience Index</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/profiles" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Profiles
            </Link>
            <Link href="/standards" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Verification Standards
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
