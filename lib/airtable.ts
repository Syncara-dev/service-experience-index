// Airtable data fetching utilities
// Uses environment variables for configuration

interface AirtableRecord<T> {
  id: string
  fields: T
  createdTime: string
}

interface AirtableResponse<T> {
  records: AirtableRecord<T>[]
  offset?: string
}

// Raw field types from Airtable — names match actual Airtable column names exactly
interface PublicProfileFields {
  profile_id: string
  name: string              // business name
  slug: string
  status?: string           // e.g. "Active", "Draft"
  category: string
  framework_type?: string   // e.g. "trades_v1"
  based_in?: string         // primary location
  areas_covered?: string | string[]
  website_url?: string
  last_updated_at?: string
  sample_size?: number
  overall_score_avg?: number
  count_8_plus?: number
  pct_8_plus?: number
  count_recommended?: number
  recommendation_rate?: number
  Tags?: string | string[]  // multi-select or linked
  // Fields not yet in Airtable — optional for future use
  summary?: string
  short_description?: string
  logo_url?: string
  date_range_start?: string
  date_range_end?: string
  score_product?: number
  score_installation?: number
  score_communication?: number
  score_recommend?: number
  top_themes?: string
  public_quotes?: string
  services?: string
  platform_1_name?: string
  platform_1_review_count?: number
  platform_1_url?: string
  platform_2_name?: string
  platform_2_review_count?: number
  platform_2_url?: string
}

interface PublicRecordFields {
  record_id?: string
  profile?: string[]           // linked record IDs to Public Profiles
  customer_label?: string
  experience_date?: string
  overall_score?: number
  recommended?: boolean | number  // Airtable returns 1/0 for checkboxes
  record_summary_public?: string
  publish_status?: string      // e.g. "Published"
  experience_month?: string
  flag_8_plus?: boolean | number
  flag_recommended?: boolean | number
  company_action_note_status?: string
  company_action_note_over_limit?: boolean
  syncara_record_id?: string
}

interface DimensionScoreFields {
  rds_id?: string              // format: "{recordId}::{dimensionName}" e.g. "recXXX::process"
  record?: string[]            // linked record IDs to Public Records
  dimension?: string[]         // linked record IDs to a Dimensions table (not the name)
  score?: number
  profile?: string[]           // linked record IDs to Public Profiles
  framework?: string[]
}

// Transformed types for the application
export interface Profile {
  profileId: string
  slug: string
  businessName: string
  location: string
  category: string
  tags: string[]
  overallScore: number
  sampleSize: number
  dateRange: string
  summary: string
  scores: {
    productSatisfaction: number
    installationSatisfaction: number
    processCommunication: number
    likelihoodToRecommend: number
  }
  consistencySignals: {
    highScorePercentage: number
    recommendationRate: number
    topThemes: string[]
  }
  customerVoice: { quote: string; name: string }[]
  logoUrl?: string
  website?: string
  shortDescription?: string
  services?: string[]
  baseLocation?: string
  areasCovered?: string[]
  externalPresence?: {
    platform1Name?: string
    platform1ReviewCount?: number
    platform1Url?: string
    platform2Name?: string
    platform2ReviewCount?: number
    platform2Url?: string
  }
}

export interface ProfileSummary {
  profileId: string
  slug: string
  businessName: string
  location: string
  category: string
  tags: string[]
  overallScore: number
  sampleSize: number
  dateRange: string
  logoUrl?: string
  shortDescription: string
  website?: string
}

export interface ExperienceRecord {
  customerLabel: string // e.g. "Sarah (SW11)"
  date: string // ISO date
  headline: string // short title
  overallScore: number
  summaryPublic: string
  sentiment: "positive" | "mixed" | "negative"
  tags: string[]
  ratings: {
    productSatisfaction: number
    installationSatisfaction: number
    processCommunication: number
    likelihoodToRecommend: number
  }
  behaviouralNote?: string
  companyActionNote?: string
  companyActionNoteApproved?: boolean
}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
const PROFILES_TABLE = process.env.AIRTABLE_PUBLIC_PROFILES_TABLE || "Public Profiles"
const RECORDS_TABLE = process.env.AIRTABLE_PUBLIC_RECORDS_TABLE || "Public Records"
const DIMENSION_SCORES_TABLE = "Record Dimension Scores"


const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`

async function fetchAirtable<T>(table: string, params: Record<string, string> = {}): Promise<AirtableRecord<T>[]> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn("[v0] Airtable not configured, returning empty results")
    return []
  }

  const url = new URL(`${BASE_URL}/${encodeURIComponent(table)}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    next: { tags: ["airtable", `table-${table}`] },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`[v0] Airtable fetch failed: ${response.status}`, errorBody)
    throw new Error(`Airtable fetch failed: ${response.status}`)
  }

  const data: AirtableResponse<T> = await response.json()
  return data.records
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startMonth = startDate.toLocaleString("en-GB", { month: "short" })
  const endMonth = endDate.toLocaleString("en-GB", { month: "short" })
  const year = endDate.getFullYear()
  return `${startMonth}–${endMonth} ${year}`
}

function parseQuotes(quotesField: string): { quote: string; name: string }[] {
  try {
    // Try JSON array first
    const parsed = JSON.parse(quotesField)
    if (Array.isArray(parsed)) {
      return parsed.map((item) =>
        typeof item === "string"
          ? { quote: item, name: "Verified Customer" }
          : { quote: item.quote || item.text, name: item.name || "Verified Customer" },
      )
    }
  } catch {
    // Fall back to multi-line format
    return quotesField
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const match = line.match(/^"?(.+?)"?\s*[-–—]\s*(.+)$/)
        if (match) {
          return { quote: match[1], name: match[2] }
        }
        return { quote: line.replace(/^["']|["']$/g, ""), name: "Verified Customer" }
      })
  }
  return []
}

function parseTags(tags?: string | string[]): string[] {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  return tags.split(",").map((t) => t.trim()).filter(Boolean)
}

function transformProfile(record: AirtableRecord<PublicProfileFields>): Profile {
  const f = record.fields
  const dateRange =
    f.date_range_start && f.date_range_end
      ? formatDateRange(f.date_range_start, f.date_range_end)
      : f.last_updated_at
        ? new Date(f.last_updated_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
        : ""
  return {
    profileId: f.profile_id,
    slug: f.slug,
    businessName: f.name,
    location: f.based_in || "",
    category: f.category,
    tags: parseTags(f.Tags),
    overallScore: f.overall_score_avg || 0,
    sampleSize: f.sample_size || 0,
    dateRange,
    summary: f.summary || "",
    scores: {
      productSatisfaction: f.score_product || 0,
      installationSatisfaction: f.score_installation || 0,
      processCommunication: f.score_communication || 0,
      likelihoodToRecommend: f.score_recommend || 0,
    },
    consistencySignals: {
      highScorePercentage: f.pct_8_plus || 0,
      recommendationRate: f.recommendation_rate || 0,
      topThemes: f.top_themes?.split(",").map((t) => t.trim()) || [],
    },
    customerVoice: parseQuotes(f.public_quotes || ""),
    logoUrl: f.logo_url,
    website: f.website_url,
    shortDescription: f.short_description,
    services: f.services?.split(",").map((s) => s.trim()) || [],
    baseLocation: f.based_in,
    areasCovered: parseTags(f.areas_covered),
    externalPresence: {
      platform1Name: f.platform_1_name,
      platform1ReviewCount: f.platform_1_review_count,
      platform1Url: f.platform_1_url,
      platform2Name: f.platform_2_name,
      platform2ReviewCount: f.platform_2_review_count,
      platform2Url: f.platform_2_url,
    },
  }
}

function transformProfileSummary(record: AirtableRecord<PublicProfileFields>): ProfileSummary {
  const f = record.fields
  const dateRange =
    f.date_range_start && f.date_range_end
      ? formatDateRange(f.date_range_start, f.date_range_end)
      : f.last_updated_at
        ? new Date(f.last_updated_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
        : ""
  return {
    profileId: f.profile_id,
    slug: f.slug,
    businessName: f.name,
    location: f.based_in || "",
    category: f.category,
    tags: parseTags(f.Tags),
    overallScore: f.overall_score_avg || 0,
    sampleSize: f.sample_size || 0,
    dateRange,
    logoUrl: f.logo_url,
    shortDescription: f.short_description || (f.summary ? f.summary.slice(0, 120) + "..." : ""),
    website: f.website_url,
  }
}

function transformRecord(
  record: AirtableRecord<PublicRecordFields>,
  dimensionScores: Record<string, number> = {},
): ExperienceRecord {
  const f = record.fields
  const score = f.overall_score || 0
  const sentiment: "positive" | "mixed" | "negative" =
    score >= 8 ? "positive" : score >= 5 ? "mixed" : "negative"
  return {
    customerLabel: f.customer_label || "Verified Customer",
    date: f.experience_date || f.experience_month || "",
    headline: "",
    overallScore: score,
    summaryPublic: f.record_summary_public || "",
    sentiment,
    tags: [],
    ratings: {
      productSatisfaction: dimensionScores["product"] ?? 0,
      installationSatisfaction: dimensionScores["installation"] ?? 0,
      processCommunication: dimensionScores["process"] ?? 0,
      likelihoodToRecommend: dimensionScores["recommend"] ?? (f.recommended ? 10 : 0),
    },
    behaviouralNote: undefined,
    companyActionNote: f.company_action_note_status,
    companyActionNoteApproved: undefined,
  }
}

// Public API functions
export async function getAllProfiles(): Promise<ProfileSummary[]> {
  const records = await fetchAirtable<PublicProfileFields>(PROFILES_TABLE)
  return records.map(transformProfileSummary).sort((a, b) => a.businessName.localeCompare(b.businessName))
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const records = await fetchAirtable<PublicProfileFields>(PROFILES_TABLE, {
    filterByFormula: `{slug} = "${slug}"`,
    maxRecords: "1",
  })
  if (records.length === 0) return null

  const profileRecordId = records[0].id

  // Fetch dimension scores and public records in parallel (no Airtable filter — JS-side filter below)
  // Airtable's ARRAYJOIN on linked fields returns display values, not record IDs, so FIND() fails
  const [allDimensionScores, allPublicRecords] = await Promise.all([
    fetchAirtable<DimensionScoreFields>(DIMENSION_SCORES_TABLE),
    fetchAirtable<PublicRecordFields>(RECORDS_TABLE),
  ])

  const dimensionScoreRecords = allDimensionScores.filter((ds) =>
    ds.fields.profile?.includes(profileRecordId),
  )
  const publicRecords = allPublicRecords.filter((r) =>
    r.fields.profile?.includes(profileRecordId),
  )

  // Accumulate totals per dimension, then average
  // Dimension name is extracted from rds_id: "{recordId}::{dimensionName}"
  const totals: Record<string, { sum: number; count: number }> = {}
  for (const ds of dimensionScoreRecords) {
    const dim = ds.fields.rds_id?.split("::")[1]
    const score = ds.fields.score
    if (!dim || score === undefined) continue
    if (!totals[dim]) totals[dim] = { sum: 0, count: 0 }
    totals[dim].sum += score
    totals[dim].count++
  }
  const avg = (dim: string) => (totals[dim] ? totals[dim].sum / totals[dim].count : 0)

  // Compute all metrics from actual records
  const total = publicRecords.length
  const highScoreCount = publicRecords.filter((r) => (r.fields.overall_score || 0) >= 8).length
  const recommendedCount = publicRecords.filter((r) => !!r.fields.recommended).length
  const overallScoreAvg =
    total > 0
      ? publicRecords.reduce((sum, r) => sum + (r.fields.overall_score || 0), 0) / total
      : 0

  const profile = transformProfile(records[0])
  profile.overallScore = Math.round(overallScoreAvg * 10) / 10  // 1 decimal place
  profile.sampleSize = total
  profile.scores = {
    productSatisfaction: avg("product"),
    installationSatisfaction: avg("installation"),
    processCommunication: avg("process"),
    likelihoodToRecommend: avg("recommend"),
  }
  profile.consistencySignals = {
    highScorePercentage: total > 0 ? Math.round((highScoreCount / total) * 100) : 0,
    recommendationRate: total > 0 ? Math.round((recommendedCount / total) * 100) : 0,
    topThemes: profile.consistencySignals.topThemes,
  }

  return profile
}

export async function getRecordsForProfile(profileSlug: string): Promise<ExperienceRecord[]> {
  // Linked records require filtering by Airtable record ID, not slug
  const profileRecords = await fetchAirtable<PublicProfileFields>(PROFILES_TABLE, {
    filterByFormula: `{slug} = "${profileSlug}"`,
    maxRecords: "1",
  })
  if (profileRecords.length === 0) return []

  const profileRecordId = profileRecords[0].id

  // Fetch all records and dimension scores in parallel, filter by profile ID in JS
  // Airtable's ARRAYJOIN on linked fields returns display values, not record IDs, so FIND() fails
  const [allRecords, allDimensionScores] = await Promise.all([
    fetchAirtable<PublicRecordFields>(RECORDS_TABLE),
    fetchAirtable<DimensionScoreFields>(DIMENSION_SCORES_TABLE),
  ])

  const records = allRecords.filter((r) => r.fields.profile?.includes(profileRecordId))
  const profileDimensionScores = allDimensionScores.filter((ds) =>
    ds.fields.profile?.includes(profileRecordId),
  )

  // Build a map: publicRecordAirtableId -> { dimension -> score }
  // Dimension name is extracted from rds_id: "{recordId}::{dimensionName}"
  const scoreMap = new Map<string, Record<string, number>>()
  for (const ds of profileDimensionScores) {
    const linkedRecordId = ds.fields.record?.[0]
    const dim = ds.fields.rds_id?.split("::")[1]
    if (!linkedRecordId || !dim || ds.fields.score === undefined) continue
    if (!scoreMap.has(linkedRecordId)) scoreMap.set(linkedRecordId, {})
    scoreMap.get(linkedRecordId)![dim] = ds.fields.score
  }

  return records
    .map((r) => transformRecord(r, scoreMap.get(r.id) ?? {}))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
}

export async function getAllCategories(): Promise<string[]> {
  const profiles = await getAllProfiles()
  const categories = [...new Set(profiles.map((p) => p.category))]
  return categories.sort()
}

export async function getAllProfileSlugs(): Promise<string[]> {
  const profiles = await getAllProfiles()
  return profiles.map((p) => p.slug)
}

// API-friendly versions (for JSON endpoints)
export async function searchProfiles(params: {
  location?: string
  category?: string
  minScore?: number
  minSample?: number
}): Promise<ProfileSummary[]> {
  let profiles = await getAllProfiles()

  if (params.location) {
    profiles = profiles.filter((p) => p.location.toLowerCase().includes(params.location!.toLowerCase()))
  }
  if (params.category) {
    profiles = profiles.filter((p) => p.category.toLowerCase().includes(params.category!.toLowerCase()))
  }
  if (params.minScore !== undefined) {
    profiles = profiles.filter((p) => p.overallScore >= params.minScore!)
  }
  if (params.minSample !== undefined) {
    profiles = profiles.filter((p) => p.sampleSize >= params.minSample!)
  }

  return profiles
}

// Write to Airtable (for UI quote requests)
export async function createQuoteRequest(data: {
  profile_slug: string
  postcode: string
  service_type: string
  notes?: string
  contact_method: string  // "email" | "phone"
  contact_value: string
}): Promise<boolean> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("[v0] Airtable not configured")
    return false
  }

  const jobDescription = [data.service_type, data.notes].filter(Boolean).join(" — ")

  const fields: Record<string, unknown> = {
    postcode_full: data.postcode,
    job_description: jobDescription,
    lead_status: "new",
    source: "website",
  }
  fields.profile = data.profile_slug
  if (data.contact_method === "email") fields.customer_email = data.contact_value
  if (data.contact_method === "phone") fields.customer_phone = data.contact_value

  const response = await fetch(`${BASE_URL}/${encodeURIComponent("Inbound Leads")}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: [{ fields }] }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`[airtable] createQuoteRequest failed ${response.status}:`, errorBody)
  }
  return response.ok
}

// Agent-facing: lookup profile Airtable record ID by profile_id
export async function getProfileRecordByProfileId(
  profileId: string,
): Promise<{ recordId: string; name: string; slug: string } | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return null

  const records = await fetchAirtable<PublicProfileFields>(PROFILES_TABLE, {
    filterByFormula: `{profile_id} = "${profileId}"`,
    maxRecords: "1",
  })

  if (records.length === 0) return null
  return {
    recordId: records[0].id,
    name: records[0].fields.name,
    slug: records[0].fields.slug,
  }
}

// Agent-facing: create inbound lead with linked record
export async function createAgentQuoteRequest(data: {
  profileRecordId: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  postcodeFullValue: string
  jobDescription: string
  source: string
}): Promise<{ ok: boolean; leadId?: string }> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return { ok: false }
  }

  const fields: Record<string, unknown> = {
    profile: [data.profileRecordId],
    customer_name: data.customerName,
    postcode_full: data.postcodeFullValue,
    job_description: data.jobDescription,
    lead_status: "new",
    source: data.source,
  }
  if (data.customerEmail) fields.customer_email = data.customerEmail
  if (data.customerPhone) fields.customer_phone = data.customerPhone

  const response = await fetch(`${BASE_URL}/${encodeURIComponent("Inbound Leads")}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [{ fields }],
    }),
  })

  if (!response.ok) return { ok: false }

  const result = await response.json()
  return { ok: true, leadId: result.records?.[0]?.id }
}

// Agent-facing: get all non-draft profiles with tags for search
export async function getAllProfilesForAgentSearch(): Promise<
  Array<{
    profileId: string
    name: string
    slug: string
    category: string
    tags: string[]
    basedIn: string
    areasCovered: string[]
  }>
> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) return []

  const records = await fetchAirtable<PublicProfileFields>(PROFILES_TABLE, {
    filterByFormula: `{status} != "Draft"`,
  })

  return records.map((r) => ({
    profileId: r.fields.profile_id,
    name: r.fields.name,
    slug: r.fields.slug,
    category: r.fields.category,
    tags: parseTags(r.fields.Tags),
    basedIn: r.fields.based_in || "",
    areasCovered: parseTags(r.fields.areas_covered),
  }))
}
