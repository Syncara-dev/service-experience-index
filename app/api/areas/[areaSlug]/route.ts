import { type NextRequest, NextResponse } from "next/server"
import { EVIDENCE_THRESHOLD, getAreaEvidence } from "@/lib/area-evidence"

export const revalidate = 3600

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serviceexperienceindex.com"

/**
 * GET /api/areas/{areaSlug}
 * Machine-readable verified evidence for one area: the same figures as /london/{areaSlug}.
 * Public, read-only, no customer names or addresses.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ areaSlug: string }> }) {
  try {
    const { areaSlug } = await params
    const area = await getAreaEvidence(areaSlug)
    if (!area) return NextResponse.json({ error: "Area not found or no verified evidence" }, { status: 404 })

    return NextResponse.json({
      area: area.label,
      area_key: area.areaKey,
      region: area.region ?? null,
      postcode_districts: area.postcodeDistricts,
      page_url: `${baseUrl}/london/${area.areaKey}`,
      evidence_status: area.status,
      verified_experiences: area.verifiedExperiences,
      average_score: area.averageScore,
      units_installed: area.unitsInstalled,
      window_start: area.firstDate ?? null,
      window_end: area.latestDate ?? null,
      trades: area.trades.map((t) => ({
        trade: t.category,
        verified_experiences: t.verifiedExperiences,
        units_installed: t.unitsInstalled,
        companies: t.companies.map((c) => ({
          name: c.name,
          profile_url: `${baseUrl}/profiles/${c.slug}`,
          verified_experiences_in_area: c.verifiedExperiences,
          average_score_in_area: c.averageScore,
          fensa_registered: c.fensaRegistered,
        })),
        products: t.products.map((p) => ({
          product: p.label,
          key: p.key,
          verified_projects: p.verifiedProjects,
          units_installed: p.unitsInstalled,
          average_score: p.averageScore,
        })),
      })),
      recent_experiences: area.recentRecords.map((r) => ({
        date: r.date ?? null,
        score: r.score,
        installed: r.installed ?? null,
        customer_quote: r.quote ?? null,
        company: r.companyName,
        record_url: r.slug ? `${baseUrl}/records/${r.slug}` : null,
      })),
      methodology: {
        source: "Structured phone interviews with customers after each job was completed. Not self-submitted reviews.",
        threshold: EVIDENCE_THRESHOLD,
        threshold_rule: `Scores (area, company-in-area and product) are only published with ${EVIDENCE_THRESHOLD} or more verified experiences; otherwise null and evidence_status is "building".`,
        counting_rule:
          "A verified experience counts once in the area linked on its record. A product's verified projects are distinct experiences containing it; units are the sum of installed quantities.",
        scale: "1–10",
        url: `${baseUrl}/methodology`,
      },
      generated_at: area.generatedAt,
    })
  } catch (error) {
    console.error("[API] area evidence error:", error)
    return NextResponse.json({ error: "Failed to fetch area evidence" }, { status: 500 })
  }
}
