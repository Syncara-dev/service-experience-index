import { type NextRequest, NextResponse } from "next/server"
import { getAllProfilesForAgentSearch } from "@/lib/airtable"
import { fallbackProfiles, fallbackProfileDetails } from "@/lib/fallback-data"

const isAirtableConfigured = () => Boolean(process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID)

interface ScoredResult {
  company_id: string
  name: string
  slug: string
  match_type: "direct" | "category" | "partial"
  location_match: boolean
  relevance_score: number
  profile_url: string
}

function scoreProfile(
  profile: { profileId: string; name: string; slug: string; category: string; tags: string[]; basedIn: string; areasCovered: string[] },
  query: string,
  location?: string,
): ScoredResult | null {
  const queryLower = query.toLowerCase()
  const keywords = queryLower.split(/\s+/).filter(Boolean)
  let score = 0
  let matchType: ScoredResult["match_type"] = "partial"

  // Full phrase match in tags (+3)
  const tagsLower = profile.tags.map((t) => t.toLowerCase())
  if (tagsLower.some((tag) => tag.includes(queryLower) || queryLower.includes(tag))) {
    score += 3
    matchType = "direct"
  }

  // Per-keyword match in tags (+2 each)
  for (const kw of keywords) {
    if (tagsLower.some((tag) => tag.includes(kw))) {
      score += 2
    }
  }

  // Category match (+1)
  if (profile.category.toLowerCase().includes(queryLower) || keywords.some((kw) => profile.category.toLowerCase().includes(kw))) {
    score += 1
    if (matchType === "partial") matchType = "category"
  }

  // No relevance at all? Skip
  if (score === 0) return null

  // Location matching
  let locationMatch = false
  if (location) {
    const locLower = location.toLowerCase()
    const areasLower = profile.areasCovered.map((a) => a.toLowerCase())
    if (areasLower.some((a) => a.includes(locLower) || locLower.includes(a))) {
      locationMatch = true
    } else if (profile.basedIn.toLowerCase().includes(locLower) || locLower.includes(profile.basedIn.toLowerCase())) {
      // Broader city match - still include but location_match = false
      locationMatch = false
    }
  }

  return {
    company_id: profile.profileId,
    name: profile.name,
    slug: profile.slug,
    match_type: matchType,
    location_match: locationMatch,
    relevance_score: score,
    profile_url: `/profiles/${profile.slug}`,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const location = searchParams.get("location") || undefined
    const limit = Math.min(Math.max(Number.parseInt(searchParams.get("limit") || "10", 10) || 10, 1), 50)

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: { code: "VALIDATION_ERROR", message: "query parameter is required" } },
        { status: 400 },
      )
    }

    // Get profiles from Airtable or fallback
    let profiles: Array<{
      profileId: string
      name: string
      slug: string
      category: string
      tags: string[]
      basedIn: string
      areasCovered: string[]
    }>

    if (isAirtableConfigured()) {
      try {
        profiles = await getAllProfilesForAgentSearch()
      } catch {
        // Fall through to fallback
        profiles = fallbackProfiles.map((p) => ({
          profileId: p.profileId,
          name: p.businessName,
          slug: p.slug,
          category: p.category,
          tags: p.tags,
          basedIn: fallbackProfileDetails[p.slug]?.baseLocation || p.location,
          areasCovered: fallbackProfileDetails[p.slug]?.areasCovered || [],
        }))
      }
    } else {
      profiles = fallbackProfiles.map((p) => ({
        profileId: p.profileId,
        name: p.businessName,
        slug: p.slug,
        category: p.category,
        tags: p.tags,
        basedIn: fallbackProfileDetails[p.slug]?.baseLocation || p.location,
        areasCovered: fallbackProfileDetails[p.slug]?.areasCovered || [],
      }))
    }

    // Score and rank
    const results = profiles
      .map((p) => scoreProfile(p, query.trim(), location))
      .filter((r): r is ScoredResult => r !== null)
      .sort((a, b) => {
        // Higher relevance first
        if (b.relevance_score !== a.relevance_score) return b.relevance_score - a.relevance_score
        // location_match true before false
        if (a.location_match !== b.location_match) return a.location_match ? -1 : 1
        // Alphabetical name
        return a.name.localeCompare(b.name)
      })
      .slice(0, limit)

    return NextResponse.json({
      ok: true,
      query: query.trim(),
      location: location || null,
      results,
    })
  } catch (error) {
    console.error("[v0] Agent search error:", error)
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Search failed" } },
      { status: 500 },
    )
  }
}
