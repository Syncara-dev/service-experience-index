// lib/area-evidence.ts
//
// Verified evidence per area, built directly from the SEI Public base:
//   Areas            -> the recognised localities (area_key, label, region)
//   Public Records   -> verified experiences, linked to an Area and a profile (Live only)
//   Project Items    -> what was installed on each experience (product type + quantity)
//   Product Types    -> unit names ("sash window" / "sash windows")
//   Public Profiles  -> the company behind each experience
//
// Counting rules (match the nightly evidence JSON):
//   - A verified experience counts once in the Area linked on its record.
//   - A product's verified projects = distinct experiences containing it; units = sum of quantities.
//   - A score is only published once there are EVIDENCE_THRESHOLD or more verified experiences
//     behind it. Below that the evidence is "building" and no score is shown.
// Material is deliberately not used: most historic items carry provisional material values.

import {
  fetchAirtable,
  PROFILES_TABLE,
  RECORDS_TABLE,
  PROJECT_ITEMS_TABLE,
  PRODUCT_TYPES_TABLE,
  type ProjectItemFields,
  type ProductTypeFields,
} from "./airtable"

export const EVIDENCE_THRESHOLD = 5

const AREAS_TABLE = "Areas"

interface AreaFields {
  area_key?: string
  label?: string
  region?: string
  status?: string
}

interface AreaRecordFields {
  profile?: string[]
  Area?: string[]
  overall_score?: number
  experience_date?: string
  customer_note?: string
  "Record Slug"?: string
  "Postcode Area"?: string
  publish_status?: string
}

interface AreaProfileFields {
  name?: string
  slug?: string
  category?: string
  based_in?: string
  "FENSA Registered"?: boolean
  "Company Logo"?: Array<{ url: string }>
  logo_url?: string
}

interface ProductTypeWithKey extends ProductTypeFields {
  product_type_key?: string
}

export interface TradeCopy {
  /** "window and door installations" */
  installations: string
  /** "Window and door companies" */
  companies: string
  /** "Windows and doors installed" */
  installed: string
  /** "windows and doors installed" (lower case, for stat captions) */
  unitsCaption: string
  /** "windows and doors" (lower case, used in sentences) */
  noun: string
  /** "their windows and doors were fitted" (completes "What X homeowners said after …") */
  afterPhrase: string
}

const WINDOWS_AND_DOORS: TradeCopy = {
  installations: "window and door installations",
  companies: "Window and door companies",
  installed: "Windows and doors installed",
  unitsCaption: "windows and doors installed",
  noun: "windows and doors",
  afterPhrase: "their windows and doors were fitted",
}

const TRADE_COPY: Record<string, TradeCopy> = {
  windows: WINDOWS_AND_DOORS,
  "windows & doors": WINDOWS_AND_DOORS,
  "windows and doors": WINDOWS_AND_DOORS,
  doors: WINDOWS_AND_DOORS,
}

/** Wording for a trade, keyed by the profile's category. Unknown trades get neutral wording. */
export function tradeCopy(category: string): TradeCopy {
  const known = TRADE_COPY[category.trim().toLowerCase()]
  if (known) return known
  const lower = category.trim().toLowerCase()
  return {
    installations: `${lower} work`,
    companies: `${category.trim()} companies`,
    installed: "Work completed",
    unitsCaption: "items installed",
    noun: lower,
    afterPhrase: "the work was finished",
  }
}

export interface AreaProduct {
  key: string
  label: string
  verifiedProjects: number
  unitsInstalled: number
  averageScore: number | null
}

export interface AreaCompany {
  name: string
  slug: string
  logoUrl?: string
  basedIn?: string
  fensaRegistered: boolean
  verifiedExperiences: number
  /** Score from this company's experiences in this area; null below the threshold. */
  averageScore: number | null
  /** e.g. "13 sash window projects, 44 windows" */
  mainProductSummary?: string
}

export interface AreaTrade {
  category: string
  copy: TradeCopy
  verifiedExperiences: number
  unitsInstalled: number
  companies: AreaCompany[]
  products: AreaProduct[]
}

export interface AreaRecordSummary {
  slug?: string
  date?: string
  score: number
  quote?: string
  installed?: string
  postcodeArea?: string
  companyName: string
  companySlug: string
}

export interface AreaSummary {
  areaKey: string
  label: string
  region?: string
  postcodeDistricts: string[]
  verifiedExperiences: number
  averageScore: number | null
  status: "published" | "building"
}

export interface AreaEvidence extends AreaSummary {
  unitsInstalled: number
  firstDate?: string
  latestDate?: string
  trades: AreaTrade[]
  recentRecords: AreaRecordSummary[]
  otherAreas: AreaSummary[]
  generatedAt: string
}

function average(scores: number[]): number | null {
  if (scores.length < EVIDENCE_THRESHOLD) return null
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
}

function slugKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Turns any older or messy area slug into the canonical form. Earlier pages built slugs
 * from the "based in" text, giving /london/east-dulwich-(se22) and /london/east-dulwich-se22;
 * both become "east-dulwich".
 */
export function normaliseAreaSlug(slug: string): string {
  let decoded = slug
  try {
    decoded = decodeURIComponent(slug)
  } catch {
    // keep the raw slug
  }
  return slugKey(decoded).replace(/-[a-z]{1,2}\d{1,2}[a-z]?$/, "")
}

interface ItemLine {
  key: string
  label: string
  unitSingular: string
  unitPlural: string
  qty: number
  sort: number
}

interface Dataset {
  areas: { id: string; key: string; label: string; region?: string }[]
  records: {
    id: string
    areaId: string
    profileId: string
    score: number
    date?: string
    quote?: string
    slug?: string
    postcodeArea?: string
  }[]
  profiles: Map<string, AreaProfileFields>
  itemsByRecord: Map<string, ItemLine[]>
}

async function loadDataset(): Promise<Dataset> {
  const [areaRows, recordRows, profileRows, itemRows, typeRows] = await Promise.all([
    fetchAirtable<AreaFields>(AREAS_TABLE),
    fetchAirtable<AreaRecordFields>(RECORDS_TABLE),
    fetchAirtable<AreaProfileFields>(PROFILES_TABLE),
    fetchAirtable<ProjectItemFields>(PROJECT_ITEMS_TABLE),
    fetchAirtable<ProductTypeWithKey>(PRODUCT_TYPES_TABLE),
  ])

  const areas = areaRows
    .filter((a) => (a.fields.status || "Active") !== "Inactive" && a.fields.label)
    .map((a) => ({
      id: a.id,
      key: slugKey(a.fields.area_key || a.fields.label || ""),
      label: a.fields.label!.trim(),
      region: a.fields.region,
    }))
    .filter((a) => a.key)

  const records = recordRows
    .filter((r) => r.fields.publish_status === "Live")
    .filter((r) => r.fields.Area?.[0] && r.fields.profile?.[0] && typeof r.fields.overall_score === "number")
    .map((r) => ({
      id: r.id,
      areaId: r.fields.Area![0],
      profileId: r.fields.profile![0],
      score: r.fields.overall_score!,
      date: r.fields.experience_date,
      quote: r.fields.customer_note?.trim() || undefined,
      slug: r.fields["Record Slug"],
      postcodeArea: r.fields["Postcode Area"]?.trim().toUpperCase() || undefined,
    }))

  const profiles = new Map(profileRows.map((p) => [p.id, p.fields]))

  const typesById = new Map(typeRows.map((t) => [t.id, t.fields]))
  const itemsByRecord = new Map<string, ItemLine[]>()
  for (const item of itemRows) {
    const recordId = item.fields["Verified Experience"]?.[0]
    const type = typesById.get(item.fields["Product Type"]?.[0] ?? "")
    const qty = item.fields.quantity
    if (!recordId || !type || !qty || qty < 1) continue
    const unitSingular = type.display_unit_singular || type.label_singular?.toLowerCase() || ""
    const unitPlural = type.display_unit_plural || type.label_plural?.toLowerCase() || unitSingular
    if (!unitSingular) continue
    if (!itemsByRecord.has(recordId)) itemsByRecord.set(recordId, [])
    itemsByRecord.get(recordId)!.push({
      key: type.product_type_key || unitSingular,
      label: type.label_plural || unitPlural,
      unitSingular,
      unitPlural,
      qty,
      sort: type.sort_order ?? 999,
    })
  }

  return { areas, records, profiles, itemsByRecord }
}

function installedLine(lines: ItemLine[] | undefined): string | undefined {
  if (!lines?.length) return undefined
  return [...lines]
    .sort((a, b) => b.qty - a.qty || a.sort - b.sort)
    .map((l) => `${l.qty} ${l.qty === 1 ? l.unitSingular : l.unitPlural}`)
    .join(" + ")
}

function summarise(data: Dataset): AreaSummary[] {
  return data.areas
    .map((area) => {
      const recs = data.records.filter((r) => r.areaId === area.id)
      return {
        areaKey: area.key,
        label: area.label,
        region: area.region,
        postcodeDistricts: [...new Set(recs.map((r) => r.postcodeArea).filter(Boolean) as string[])].sort(),
        verifiedExperiences: recs.length,
        averageScore: average(recs.map((r) => r.score)),
        status: (recs.length >= EVIDENCE_THRESHOLD ? "published" : "building") as AreaSummary["status"],
      }
    })
    .filter((a) => a.verifiedExperiences > 0)
    .sort((a, b) => b.verifiedExperiences - a.verifiedExperiences || a.label.localeCompare(b.label))
}

/** Every area with at least one verified experience, most evidence first. */
export async function getAreaSummaries(): Promise<AreaSummary[]> {
  return summarise(await loadDataset())
}

/** Full evidence for one area, or null when the area has no verified experiences. */
export async function getAreaEvidence(areaKey: string): Promise<AreaEvidence | null> {
  const data = await loadDataset()
  const key = normaliseAreaSlug(areaKey)
  const area = data.areas.find((a) => a.key === key)
  if (!area) return null

  const recs = data.records.filter((r) => r.areaId === area.id)
  if (recs.length === 0) return null

  const summaries = summarise(data)
  const summary = summaries.find((s) => s.areaKey === area.key)!

  // Group experiences by trade (the company's category).
  const byTrade = new Map<string, typeof recs>()
  for (const r of recs) {
    const category = data.profiles.get(r.profileId)?.category?.trim() || "Other"
    if (!byTrade.has(category)) byTrade.set(category, [])
    byTrade.get(category)!.push(r)
  }

  const trades: AreaTrade[] = [...byTrade.entries()].map(([category, tradeRecs]) => {
    // Companies
    const byCompany = new Map<string, typeof recs>()
    for (const r of tradeRecs) {
      if (!byCompany.has(r.profileId)) byCompany.set(r.profileId, [])
      byCompany.get(r.profileId)!.push(r)
    }
    const companies: AreaCompany[] = [...byCompany.entries()]
      .map(([profileId, companyRecs]) => {
        const p = data.profiles.get(profileId) || {}
        const productTotals = new Map<string, { label: string; unitPlural: string; projects: number; units: number }>()
        for (const r of companyRecs) {
          for (const line of data.itemsByRecord.get(r.id) || []) {
            const t = productTotals.get(line.key) || { label: line.label, unitPlural: line.unitPlural, projects: 0, units: 0 }
            t.projects += 1
            t.units += line.qty
            productTotals.set(line.key, t)
          }
        }
        const top = [...productTotals.values()].sort((a, b) => b.projects - a.projects)[0]
        return {
          name: p.name || "Unnamed company",
          slug: p.slug || "",
          logoUrl: p["Company Logo"]?.[0]?.url ?? p.logo_url,
          basedIn: p.based_in,
          fensaRegistered: Boolean(p["FENSA Registered"]),
          verifiedExperiences: companyRecs.length,
          averageScore: average(companyRecs.map((r) => r.score)),
          mainProductSummary: top
            ? `${top.projects} ${top.label.toLowerCase()} ${top.projects === 1 ? "project" : "projects"}, ${top.units} ${top.unitPlural}`
            : undefined,
        }
      })
      .sort((a, b) => b.verifiedExperiences - a.verifiedExperiences || a.name.localeCompare(b.name))

    // Products
    const productMap = new Map<string, { label: string; projects: Set<string>; units: number; scores: number[]; sort: number }>()
    for (const r of tradeRecs) {
      for (const line of data.itemsByRecord.get(r.id) || []) {
        const p = productMap.get(line.key) || { label: line.label, projects: new Set<string>(), units: 0, scores: [], sort: line.sort }
        if (!p.projects.has(r.id)) {
          p.projects.add(r.id)
          p.scores.push(r.score)
        }
        p.units += line.qty
        productMap.set(line.key, p)
      }
    }
    const products: AreaProduct[] = [...productMap.entries()]
      .map(([key, p]) => ({
        key,
        label: p.label,
        verifiedProjects: p.projects.size,
        unitsInstalled: p.units,
        averageScore: average(p.scores),
        sort: p.sort,
      }))
      .sort((a, b) => b.verifiedProjects - a.verifiedProjects || a.sort - b.sort)
      .map(({ sort: _sort, ...rest }) => rest)

    return {
      category,
      copy: tradeCopy(category),
      verifiedExperiences: tradeRecs.length,
      unitsInstalled: products.reduce((sum, p) => sum + p.unitsInstalled, 0),
      companies,
      products,
    }
  })
  trades.sort((a, b) => b.verifiedExperiences - a.verifiedExperiences)

  const dated = recs.filter((r) => r.date).sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  const recentRecords: AreaRecordSummary[] = dated
    .filter((r) => r.quote)
    .slice(0, 3)
    .map((r) => {
      const p = data.profiles.get(r.profileId) || {}
      return {
        slug: r.slug,
        date: r.date,
        score: r.score,
        quote: r.quote,
        installed: installedLine(data.itemsByRecord.get(r.id)),
        postcodeArea: r.postcodeArea,
        companyName: p.name || "",
        companySlug: p.slug || "",
      }
    })

  const otherAreas = summaries
    .filter((s) => s.areaKey !== area.key && (!area.region || s.region === area.region))
    .slice(0, 6)

  return {
    ...summary,
    unitsInstalled: trades.reduce((sum, t) => sum + t.unitsInstalled, 0),
    firstDate: dated[dated.length - 1]?.date,
    latestDate: dated[0]?.date,
    trades,
    recentRecords,
    otherAreas,
    generatedAt: new Date().toISOString(),
  }
}
