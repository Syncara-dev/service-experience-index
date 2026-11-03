import { EVIDENCE_THRESHOLD, type AreaEvidence } from "@/lib/area-evidence"

interface AreaJsonLdProps {
  area: AreaEvidence
  baseUrl: string
}

/**
 * Structured data for an area evidence page, for search engines and AI systems.
 * Describes the page as a collection of verified evidence about one place, listing
 * the companies with verified work there. A local AggregateRating is only included
 * once a company has EVIDENCE_THRESHOLD or more verified experiences in the area.
 */
export function AreaJsonLd({ area, baseUrl }: AreaJsonLdProps) {
  const pageUrl = `${baseUrl}/london/${area.areaKey}`
  const place = {
    "@type": "Place",
    name: area.label,
    address: {
      "@type": "PostalAddress",
      addressLocality: area.label,
      ...(area.postcodeDistricts.length ? { postalCode: area.postcodeDistricts.join(", ") } : {}),
      addressRegion: "London",
      addressCountry: "GB",
    },
  }

  const companies = area.trades.flatMap((t) => t.companies)

  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    url: pageUrl,
    name: `Verified ${area.trades[0]?.copy.installations ?? "work"} in ${area.label}`,
    description: `${area.verifiedExperiences} verified customer experiences in ${area.label}, collected through structured post-completion interviews.`,
    inLanguage: "en-GB",
    about: place,
    ...(area.latestDate ? { dateModified: area.latestDate } : {}),
    isPartOf: { "@type": "WebSite", name: "Service Experience Index", url: baseUrl },
    publisher: { "@type": "Organization", name: "Service Experience Index", url: baseUrl },
    mainEntity: {
      "@type": "ItemList",
      name: `Companies with verified work in ${area.label}`,
      numberOfItems: companies.length,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: companies.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "HomeAndConstructionBusiness",
          name: c.name,
          url: `${baseUrl}/profiles/${c.slug}`,
          areaServed: place,
          ...(c.averageScore !== null && c.verifiedExperiences >= EVIDENCE_THRESHOLD
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: c.averageScore,
                  bestRating: 10,
                  worstRating: 1,
                  ratingCount: c.verifiedExperiences,
                },
              }
            : {}),
        },
      })),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}
