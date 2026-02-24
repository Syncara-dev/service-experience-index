interface ExternalPlatform {
  name?: string
  reviewCount?: number
  url?: string
}

interface MarketPresenceProps {
  externalPresence: {
    platform1Name?: string
    platform1ReviewCount?: number
    platform1Url?: string
    platform2Name?: string
    platform2ReviewCount?: number
    platform2Url?: string
  }
}

function isValidPlatform(platform: ExternalPlatform): boolean {
  return Boolean(platform.name && platform.name.trim().length > 0 && platform.reviewCount && platform.reviewCount > 0)
}

export function MarketPresence({ externalPresence }: MarketPresenceProps) {
  const platforms: ExternalPlatform[] = [
    {
      name: externalPresence.platform1Name,
      reviewCount: externalPresence.platform1ReviewCount,
      url: externalPresence.platform1Url,
    },
    {
      name: externalPresence.platform2Name,
      reviewCount: externalPresence.platform2ReviewCount,
      url: externalPresence.platform2Url,
    },
  ].filter(isValidPlatform)

  if (platforms.length === 0) return null

  return (
    <section className="py-10 border-b border-border">
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Market Presence</h2>
      <p className="text-xs text-muted-foreground mb-5">Independent platform review volume (for context only)</p>
      <div className="space-y-2">
        {platforms.map((platform) => (
          <div key={platform.name} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{platform.name}</span>
            <span>—</span>
            <span>{platform.reviewCount?.toLocaleString("en-GB")} reviews</span>
            {platform.url && (
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                View
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
