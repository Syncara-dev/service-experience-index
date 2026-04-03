export interface ProfileSummary {
  slug: string
  businessName: string
  location: string
  category: string
  overallScore: number
  sampleSize: number
  dateRange: string
  logoUrl?: string
  shortDescription: string
  email?: string
  website?: string
}

export const allProfiles: ProfileSummary[] = [
  {
    slug: "bespoke-windows-london",
    businessName: "Bespoke Windows London",
    location: "London",
    category: "Windows & Doors",
    overallScore: 9.2,
    sampleSize: 18,
    dateRange: "Jan–Jun 2025",
    logoUrl: "/images/bw-20logo-20small.png",
    shortDescription: "Premium window and door installations with consistently high workmanship ratings.",
    email: "info@bespokewindows.co.uk",
    website: "https://bespokewindows.co.uk",
  },
  {
    slug: "greenleaf-landscapes",
    businessName: "Greenleaf Landscapes",
    location: "Surrey",
    category: "Landscaping & Gardens",
    overallScore: 8.9,
    sampleSize: 24,
    dateRange: "Feb–Jun 2025",
    shortDescription: "Garden design and landscaping services with strong communication and project management.",
    email: "hello@greenleaflandscapes.co.uk",
    website: "https://greenleaflandscapes.co.uk",
  },
  {
    slug: "apex-roofing-solutions",
    businessName: "Apex Roofing Solutions",
    location: "Manchester",
    category: "Roofing",
    overallScore: 9.4,
    sampleSize: 31,
    dateRange: "Jan–Jun 2025",
    shortDescription: "Residential and commercial roofing with exceptional reliability scores.",
    email: "enquiries@apexroofing.co.uk",
    website: "https://apexroofing.co.uk",
  },
  {
    slug: "clarity-electrical",
    businessName: "Clarity Electrical",
    location: "Birmingham",
    category: "Electrical Services",
    overallScore: 8.7,
    sampleSize: 42,
    dateRange: "Mar–Jun 2025",
    shortDescription: "Domestic electrical work with consistently punctual and tidy service delivery.",
    email: "info@clarityelectrical.co.uk",
    website: "https://clarityelectrical.co.uk",
  },
  {
    slug: "heritage-kitchens",
    businessName: "Heritage Kitchens",
    location: "Bristol",
    category: "Kitchen Installation",
    overallScore: 9.1,
    sampleSize: 15,
    dateRange: "Jan–May 2025",
    shortDescription: "Bespoke kitchen design and fitting with high attention to detail.",
    email: "design@heritagekitchens.co.uk",
    website: "https://heritagekitchens.co.uk",
  },
  {
    slug: "clearview-plumbing",
    businessName: "Clearview Plumbing & Heating",
    location: "Leeds",
    category: "Plumbing & Heating",
    overallScore: 8.5,
    sampleSize: 56,
    dateRange: "Jan–Jun 2025",
    shortDescription: "Boiler installations and general plumbing with responsive customer service.",
    email: "bookings@clearviewplumbing.co.uk",
    website: "https://clearviewplumbing.co.uk",
  },
  {
    slug: "oakwood-builders",
    businessName: "Oakwood Builders",
    location: "Edinburgh",
    category: "Construction & Extensions",
    overallScore: 9.3,
    sampleSize: 12,
    dateRange: "Feb–Jun 2025",
    shortDescription: "Home extensions and renovations with excellent project communication.",
    email: "projects@oakwoodbuilders.co.uk",
    website: "https://oakwoodbuilders.co.uk",
  },
  {
    slug: "premier-decorators",
    businessName: "Premier Decorators",
    location: "Liverpool",
    category: "Painting & Decorating",
    overallScore: 8.8,
    sampleSize: 38,
    dateRange: "Jan–Jun 2025",
    shortDescription: "Interior and exterior painting with consistent quality finishes.",
    email: "quotes@premierdecorators.co.uk",
    website: "https://premierdecorators.co.uk",
  },
  {
    slug: "secure-systems-uk",
    businessName: "Secure Systems UK",
    location: "Reading",
    category: "Security Systems",
    overallScore: 9.0,
    sampleSize: 27,
    dateRange: "Mar–Jun 2025",
    shortDescription: "Alarm and CCTV installation with thorough customer education.",
    email: "info@securesystemsuk.co.uk",
    website: "https://securesystemsuk.co.uk",
  },
  {
    slug: "perfect-floors",
    businessName: "Perfect Floors",
    location: "Newcastle",
    category: "Flooring",
    overallScore: 8.6,
    sampleSize: 33,
    dateRange: "Feb–Jun 2025",
    shortDescription: "Hardwood, laminate, and tile flooring with clean installation practices.",
    email: "sales@perfectfloors.co.uk",
    website: "https://perfectfloors.co.uk",
  },
]

export const categories = [...new Set(allProfiles.map((p) => p.category))].sort()
