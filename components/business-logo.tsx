import Image from "next/image"

interface BusinessLogoProps {
  logoUrl?: string
  businessName: string
  size?: "sm" | "md" | "lg"
}

const sizeConfig = {
  sm: { container: "h-8 w-8", text: "text-xs", pixels: "32px" },
  md: { container: "h-12 w-12", text: "text-sm", pixels: "48px" },
  lg: { container: "h-20 w-20", text: "text-xl", pixels: "80px" },
}

/**
 * Standardised logo container for business identification.
 * - Fixed dimensions ensure consistent visual weight
 * - Logos scale down to fit but never scale up
 * - Centered with preserved aspect ratio
 * - Neutral placeholder when logo is missing
 */
export function BusinessLogo({ logoUrl, businessName, size = "md" }: BusinessLogoProps) {
  const dimensions = sizeConfig[size]

  // Generate initials for fallback
  const initials = (businessName || "?")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (!logoUrl) {
    return (
      <div
        className={`${dimensions.container} shrink-0 flex items-center justify-center rounded bg-white border border-border`}
        aria-hidden="true"
      >
        <span className={`${dimensions.text} font-medium text-muted-foreground`}>{initials}</span>
      </div>
    )
  }

  return (
    <div className={`${dimensions.container} relative shrink-0 overflow-hidden rounded bg-white border border-border`}>
      <Image
        src={logoUrl || "/placeholder.svg"}
        alt={`${businessName} logo`}
        fill
        sizes={dimensions.pixels}
        className="object-contain object-center"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </div>
  )
}
