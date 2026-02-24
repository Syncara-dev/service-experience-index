interface ProfileJsonLdProps {
  businessName: string
  location: string
  category: string
  overallScore: number
  sampleSize: number
  slug: string
}

export function ProfileJsonLd({
  businessName,
  location,
  category,
  overallScore,
  sampleSize,
  slug,
}: ProfileJsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressCountry: "GB",
    },
    "@id": `${baseUrl}/profiles/${slug}`,
    url: `${baseUrl}/profiles/${slug}`,
    category: category,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: overallScore.toFixed(1),
      bestRating: "10",
      worstRating: "1",
      ratingCount: sampleSize,
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
