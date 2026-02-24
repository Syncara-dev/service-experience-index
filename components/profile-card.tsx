import Link from "next/link"
import type { ProfileSummary } from "@/lib/profiles-data"
import { BusinessLogo } from "./business-logo"

interface ProfileCardProps {
  profile: ProfileSummary
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Link
      href={`/profiles/${profile.slug}`}
      className="block border border-border bg-card p-6 transition-colors hover:border-accent/50 hover:bg-card/80"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <BusinessLogo logoUrl={profile.logoUrl} businessName={profile.businessName} size="sm" />
            <h3 className="font-medium text-foreground">{profile.businessName}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{profile.shortDescription}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground/70">
            <span>{profile.location}</span>
            <span className="hidden sm:inline">·</span>
            <span>{profile.category}</span>
            <span className="hidden sm:inline">·</span>
            <span>{profile.sampleSize} verified experiences</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-semibold text-foreground">{profile.overallScore}</div>
          <div className="text-xs text-muted-foreground">/10</div>
        </div>
      </div>
    </Link>
  )
}
