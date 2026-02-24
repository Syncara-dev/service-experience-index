import { ShareButton } from "./share-button"
import { BusinessLogo } from "./business-logo"
import { Globe } from "lucide-react"

interface ShareableProfileHeaderProps {
  businessName: string
  location: string
  category: string
  overallScore: number
  sampleSize: number
  dateRange: string
  logoUrl?: string
  website?: string
  email?: string
}

export function ShareableProfileHeader({
  businessName,
  location,
  category,
  overallScore,
  sampleSize,
  dateRange,
  logoUrl,
  website,
  email,
}: ShareableProfileHeaderProps) {
  return (
    <header className="pb-8 border-b border-border">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1 min-w-0">
          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-accent/10 text-accent rounded">
              Verified Experience Profile
            </span>
            <span className="text-xs text-muted-foreground">Verified from recorded customer conversations</span>
          </div>

          <div className="flex items-start gap-5 mb-4">
            <BusinessLogo logoUrl={logoUrl} businessName={businessName} size="lg" />
            <div>
              {/* Business name */}
              <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground text-balance">
                {businessName}
              </h1>

              {/* Location and category */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <span>{location}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{category}</span>
              </div>

              {website && (
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{website.replace(/^https?:\/\//, "")}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Score and share */}
        <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
          <div className="text-right">
            <div className="text-5xl md:text-6xl font-serif font-medium text-foreground tabular-nums">
              {overallScore.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">out of 10</div>
          </div>
          <ShareButton />
        </div>
      </div>

      {/* Sample info */}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <div>
          Based on <span className="text-foreground font-medium">{sampleSize}</span> post-completion conversations
        </div>
        <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
        <div>Collected {dateRange}</div>
      </div>
    </header>
  )
}
