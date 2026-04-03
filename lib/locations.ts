// Location page configuration
// Defines areas, their metadata, and related areas for internal linking

export interface AreaConfig {
  slug: string
  name: string
  postcodePrefix: string // For filtering records
  parentRegion: string
  relatedAreas: string[] // slugs of nearby areas
}

// London areas configuration
export const londonAreas: Record<string, AreaConfig> = {
  dulwich: {
    slug: "dulwich",
    name: "Dulwich",
    postcodePrefix: "SE21",
    parentRegion: "London",
    relatedAreas: ["clapham", "brixton", "peckham", "camberwell"],
  },
  clapham: {
    slug: "clapham",
    name: "Clapham",
    postcodePrefix: "SW4",
    parentRegion: "London",
    relatedAreas: ["battersea", "brixton", "balham", "wandsworth"],
  },
  wimbledon: {
    slug: "wimbledon",
    name: "Wimbledon",
    postcodePrefix: "SW19",
    parentRegion: "London",
    relatedAreas: ["putney", "wandsworth", "kingston", "merton"],
  },
  richmond: {
    slug: "richmond",
    name: "Richmond",
    postcodePrefix: "TW9",
    parentRegion: "London",
    relatedAreas: ["twickenham", "kingston", "putney", "kew"],
  },
  putney: {
    slug: "putney",
    name: "Putney",
    postcodePrefix: "SW15",
    parentRegion: "London",
    relatedAreas: ["wandsworth", "fulham", "richmond", "wimbledon"],
  },
  battersea: {
    slug: "battersea",
    name: "Battersea",
    postcodePrefix: "SW11",
    parentRegion: "London",
    relatedAreas: ["clapham", "wandsworth", "chelsea", "vauxhall"],
  },
  brixton: {
    slug: "brixton",
    name: "Brixton",
    postcodePrefix: "SW9",
    parentRegion: "London",
    relatedAreas: ["clapham", "dulwich", "camberwell", "streatham"],
  },
  peckham: {
    slug: "peckham",
    name: "Peckham",
    postcodePrefix: "SE15",
    parentRegion: "London",
    relatedAreas: ["dulwich", "camberwell", "bermondsey", "deptford"],
  },
  wandsworth: {
    slug: "wandsworth",
    name: "Wandsworth",
    postcodePrefix: "SW18",
    parentRegion: "London",
    relatedAreas: ["battersea", "putney", "clapham", "tooting"],
  },
  fulham: {
    slug: "fulham",
    name: "Fulham",
    postcodePrefix: "SW6",
    parentRegion: "London",
    relatedAreas: ["chelsea", "hammersmith", "putney", "earls-court"],
  },
  "south-west-london": {
    slug: "south-west-london",
    name: "South West London",
    postcodePrefix: "SW",
    parentRegion: "London",
    relatedAreas: ["clapham", "battersea", "wandsworth", "putney", "wimbledon"],
  },
  "central-london": {
    slug: "central-london",
    name: "Central London",
    postcodePrefix: "W1",
    parentRegion: "London",
    relatedAreas: ["chelsea", "kensington", "mayfair", "westminster"],
  },
}

export function getAreaConfig(areaSlug: string): AreaConfig | null {
  return londonAreas[areaSlug] || null
}

export function getAllAreaSlugs(): string[] {
  return Object.keys(londonAreas)
}

export function getRelatedAreas(areaSlug: string): AreaConfig[] {
  const area = londonAreas[areaSlug]
  if (!area) return []

  return area.relatedAreas
    .map((slug) => londonAreas[slug])
    .filter((a): a is AreaConfig => a !== undefined)
}

// For generating breadcrumbs (legacy window pages)
export function getBreadcrumbs(areaSlug: string): { label: string; href: string }[] {
  const area = londonAreas[areaSlug]
  if (!area) return []

  return [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: area.name, href: `/london/${area.slug}/best-window-companies` },
  ]
}

// For generating breadcrumbs with trade context
export function getAreaBreadcrumbsForTrade(
  areaSlug: string,
  tradeSlug: string,
  tradeName: string
): { label: string; href: string }[] {
  const area = londonAreas[areaSlug]
  if (!area) return []

  return [
    { label: "Home", href: "/" },
    { label: "Trades", href: "/trades" },
    { label: tradeName, href: `/trades/${tradeSlug}` },
    { label: area.name, href: `/london/${area.slug}/${tradeSlug}` },
  ]
}

// Find area slug by name (case-insensitive partial match)
export function getAreaSlugByName(name: string): string | null {
  const nameLower = name.toLowerCase().trim()

  // Direct match first
  for (const [slug, area] of Object.entries(londonAreas)) {
    if (area.name.toLowerCase() === nameLower) {
      return slug
    }
  }

  // Partial match (e.g. "South West London" matches area name)
  for (const [slug, area] of Object.entries(londonAreas)) {
    if (area.name.toLowerCase().includes(nameLower) || nameLower.includes(area.name.toLowerCase())) {
      return slug
    }
  }

  return null
}
