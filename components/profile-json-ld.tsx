interface ProfileJsonLdProps {
  businessName: string
  location: string
  category: string
  overallScore: number
  sampleSize: number
  slug: string
  shortDescription?: string
  website?: string
  areasCovered?: string[]
  customerVoice?: { quote: string; name: string }[]
}

const SCHEMA_TYPE_MAP: Record<string, string> = {
  "Windows & Doors": "HomeAndConstructionBusiness",
  "Windows": "HomeAndConstructionBusiness",
  "Doors": "HomeAndConstructionBusiness",
  "Kitchen Installation": "HomeAndConstructionBusiness",
  "Kitchens": "HomeAndConstructionBusiness",
  "Kitchen Fitting": "HomeAndConstructionBusiness",
  "Roofing": "RoofingContractor",
  "Roof Repair": "RoofingContractor",
  "Electrical Services": "Electrician",
  "Electrical": "Electrician",
  "Electrician": "Electrician",
  "Plumbing & Heating": "Plumber",
  "Plumbing": "Plumber",
  "Heating": "Plumber",
  "Bathroom Installation": "HomeAndConstructionBusiness",
  "Bathrooms": "HomeAndConstructionBusiness",
  "Landscaping & Gardens": "LandscapingBusiness",
  "Landscaping": "LandscapingBusiness",
  "Garden Design": "LandscapingBusiness",
  "Construction & Extensions": "GeneralContractor",
  "Builders": "GeneralContractor",
  "Building": "GeneralContractor",
  "Extensions": "GeneralContractor",
  "Painting & Decorating": "HomeAndConstructionBusiness",
  "Flooring": "HomeAndConstructionBusiness",
  "Security Systems": "HomeAndConstructionBusiness",
}

export function ProfileJsonLd({
  businessName,
  location,
  category,
  overallScore,
  sampleSize,
  slug,
  shortDescription,
  website,
  areasCovered,
  customerVoice,
}: ProfileJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"
  const schemaType = SCHEMA_TYPE_MAP[category] || "LocalBusiness"
  const profileUrl = `${baseUrl}/profiles/${slug}`

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": profileUrl,
    name: businessName,
    url: profileUrl,
    description: shortDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressCountry: "GB",
    },
    areaServed: areasCovered && areasCovered.length > 0
      ? areasCovered.map((area) => ({ "@type": "Place", name: area }))
      : location
      ? [{ "@type": "Place", name: location }]
      : undefined,
    sameAs: website ? [website] : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: overallScore.toFixed(1),
      bestRating: "10",
      worstRating: "1",
      ratingCount: sampleSize,
    },
  }

  if (customerVoice && customerVoice.length > 0) {
    jsonLd.review = customerVoice.slice(0, 5).map((v) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: overallScore.toFixed(1),
        bestRating: "10",
        worstRating: "1",
      },
      author: { "@type": "Person", name: v.name || "Verified Customer" },
      reviewBody: v.quote,
    }))
  }

  // Strip undefined keys so the output stays clean
  const cleaned = JSON.parse(JSON.stringify(jsonLd))

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cleaned) }} />
}
