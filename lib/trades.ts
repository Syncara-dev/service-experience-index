// Trade/category configuration for multi-trade support
// Maps trade slugs to display labels and metadata

export interface TradeConfig {
  slug: string
  name: string // Display name, e.g. "Windows"
  label: string // Natural label for lists, e.g. "Window Companies"
  labelSingular: string // e.g. "Window Company"
  categoryMatch: string[] // Categories from profile data that match this trade
  description: string
}

// Core trades supported by SEI
export const trades: Record<string, TradeConfig> = {
  windows: {
    slug: "windows",
    name: "Windows",
    label: "Window Companies",
    labelSingular: "Window Company",
    categoryMatch: ["Windows & Doors", "Windows", "Doors"],
    description: "Window and door installation, replacement, and repair services.",
  },
  kitchens: {
    slug: "kitchens",
    name: "Kitchens",
    label: "Kitchen Fitters",
    labelSingular: "Kitchen Fitter",
    categoryMatch: ["Kitchen Installation", "Kitchens", "Kitchen Fitting"],
    description: "Kitchen design, fitting, and installation services.",
  },
  roofing: {
    slug: "roofing",
    name: "Roofing",
    label: "Roofers",
    labelSingular: "Roofer",
    categoryMatch: ["Roofing", "Roof Repair"],
    description: "Residential and commercial roofing services.",
  },
  electrical: {
    slug: "electrical",
    name: "Electrical",
    label: "Electricians",
    labelSingular: "Electrician",
    categoryMatch: ["Electrical Services", "Electrical", "Electrician"],
    description: "Domestic and commercial electrical installation and repair.",
  },
  plumbing: {
    slug: "plumbing",
    name: "Plumbing",
    label: "Plumbers",
    labelSingular: "Plumber",
    categoryMatch: ["Plumbing & Heating", "Plumbing", "Heating"],
    description: "Plumbing, heating, and boiler installation services.",
  },
  bathrooms: {
    slug: "bathrooms",
    name: "Bathrooms",
    label: "Bathroom Fitters",
    labelSingular: "Bathroom Fitter",
    categoryMatch: ["Bathroom Installation", "Bathrooms", "Bathroom Fitting"],
    description: "Bathroom design and installation services.",
  },
  landscaping: {
    slug: "landscaping",
    name: "Landscaping",
    label: "Landscapers",
    labelSingular: "Landscaper",
    categoryMatch: ["Landscaping & Gardens", "Landscaping", "Garden Design"],
    description: "Garden design, landscaping, and outdoor services.",
  },
  builders: {
    slug: "builders",
    name: "Builders",
    label: "Builders",
    labelSingular: "Builder",
    categoryMatch: ["Construction & Extensions", "Builders", "Building", "Extensions"],
    description: "Home extensions, renovations, and construction services.",
  },
  decorating: {
    slug: "decorating",
    name: "Decorating",
    label: "Decorators",
    labelSingular: "Decorator",
    categoryMatch: ["Painting & Decorating", "Decorating", "Painters"],
    description: "Interior and exterior painting and decorating services.",
  },
  flooring: {
    slug: "flooring",
    name: "Flooring",
    label: "Flooring Specialists",
    labelSingular: "Flooring Specialist",
    categoryMatch: ["Flooring", "Floor Installation"],
    description: "Hardwood, laminate, tile, and carpet flooring services.",
  },
  security: {
    slug: "security",
    name: "Security",
    label: "Security Installers",
    labelSingular: "Security Installer",
    categoryMatch: ["Security Systems", "Security", "CCTV", "Alarms"],
    description: "Alarm, CCTV, and home security system installation.",
  },
}

export function getTradeConfig(tradeSlug: string): TradeConfig | null {
  return trades[tradeSlug] || null
}

export function getAllTradeSlugs(): string[] {
  return Object.keys(trades)
}

export function getAllTrades(): TradeConfig[] {
  return Object.values(trades)
}

// Get trade slug from a profile category
export function getTradeSlugFromCategory(category: string): string | null {
  const categoryLower = category.toLowerCase()
  
  for (const [slug, trade] of Object.entries(trades)) {
    if (trade.categoryMatch.some(match => match.toLowerCase() === categoryLower)) {
      return slug
    }
  }
  
  // Partial match fallback
  for (const [slug, trade] of Object.entries(trades)) {
    if (trade.categoryMatch.some(match => 
      categoryLower.includes(match.toLowerCase()) || 
      match.toLowerCase().includes(categoryLower)
    )) {
      return slug
    }
  }
  
  return null
}

// Get breadcrumbs for trade + area page
export function getTradeBreadcrumbs(
  tradeSlug: string,
  areaSlug?: string,
  areaName?: string
): { label: string; href: string }[] {
  const trade = trades[tradeSlug]
  if (!trade) return []

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Trades", href: "/trades" },
    { label: trade.name, href: `/trades/${trade.slug}` },
  ]

  if (areaSlug && areaName) {
    crumbs.push({
      label: areaName,
      href: `/london/${areaSlug}/${trade.slug}`,
    })
  }

  return crumbs
}
