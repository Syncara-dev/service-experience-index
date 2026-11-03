import { NextResponse } from "next/server"
import { EVIDENCE_THRESHOLD, getAreaSummaries } from "@/lib/area-evidence"

export const revalidate = 3600

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"

/**
 * GET /api/areas
 * Every area with at least one verified experience, most evidence first.
 */
export async function GET() {
  try {
    const areas = await getAreaSummaries()
    return NextResponse.json({
      threshold: EVIDENCE_THRESHOLD,
      areas: areas.map((a) => ({
        area: a.label,
        area_key: a.areaKey,
        region: a.region ?? null,
        postcode_districts: a.postcodeDistricts,
        verified_experiences: a.verifiedExperiences,
        average_score: a.averageScore,
        evidence_status: a.status,
        page_url: `${baseUrl}/london/${a.areaKey}`,
        data_url: `${baseUrl}/api/areas/${a.areaKey}`,
      })),
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[API] area list error:", error)
    return NextResponse.json({ error: "Failed to fetch areas" }, { status: 500 })
  }
}
