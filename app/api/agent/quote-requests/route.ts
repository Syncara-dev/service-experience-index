import { type NextRequest, NextResponse } from "next/server"
import { getProfileRecordByProfileId, createAgentQuoteRequest } from "@/lib/airtable"

// --- AUTH ---
function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return false
  const token = authHeader.slice(7).trim()
  const validKeys = (process.env.SEI_AGENT_KEY || "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
  if (validKeys.length === 0) return false
  return validKeys.includes(token)
}

// --- RATE LIMITING ---
// Per API key: 30 req/min
const keyRateMap = new Map<string, { count: number; resetTime: number }>()
// Per company_id: 10 req/hour
const companyRateMap = new Map<string, { count: number; resetTime: number }>()

function checkKeyRateLimit(key: string): boolean {
  const now = Date.now()
  const record = keyRateMap.get(key)
  if (!record || now > record.resetTime) {
    keyRateMap.set(key, { count: 1, resetTime: now + 60_000 })
    return true
  }
  if (record.count >= 30) return false
  record.count++
  return true
}

function checkCompanyRateLimit(companyId: string): boolean {
  const now = Date.now()
  const record = companyRateMap.get(companyId)
  if (!record || now > record.resetTime) {
    companyRateMap.set(companyId, { count: 1, resetTime: now + 3_600_000 })
    return true
  }
  if (record.count >= 10) return false
  record.count++
  return true
}

// --- DEDUPE ---
// Store recent submissions: key -> { leadId, timestamp }
const dedupeMap = new Map<string, { leadId: string; timestamp: number }>()
const DEDUPE_WINDOW = 24 * 60 * 60 * 1000 // 24 hours

function getDedupeKey(companyId: string, agentRef?: string, email?: string, phone?: string, postcode?: string): string {
  if (agentRef) {
    return `ref:${companyId}:${agentRef}`
  }
  const contactKey = email || phone || ""
  return `contact:${companyId}:${contactKey}:${postcode || ""}`
}

function checkDedupe(key: string): { isDuplicate: boolean; leadId?: string } {
  const now = Date.now()
  const existing = dedupeMap.get(key)
  if (existing && now - existing.timestamp < DEDUPE_WINDOW) {
    return { isDuplicate: true, leadId: existing.leadId }
  }
  return { isDuplicate: false }
}

function recordDedupe(key: string, leadId: string) {
  dedupeMap.set(key, { leadId, timestamp: Date.now() })
}

// --- VALIDATION ---
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i

interface ValidationError {
  code: "VALIDATION_ERROR"
  message: string
  fields: string[]
}

interface AgentQuotePayload {
  company_id: string
  customer: {
    name?: string
    email?: string
    phone?: string
    postcode_full: string
  }
  job: {
    description: string
  }
  source?: {
    agent_name?: string
    agent_ref?: string
  }
}

function validatePayload(body: unknown): { valid: true; data: AgentQuotePayload } | { valid: false; error: ValidationError } {
  const errors: string[] = []

  if (!body || typeof body !== "object") {
    return { valid: false, error: { code: "VALIDATION_ERROR", message: "Request body must be a JSON object", fields: ["body"] } }
  }

  const b = body as Record<string, unknown>

  // company_id
  if (!b.company_id || typeof b.company_id !== "string") {
    errors.push("company_id")
  }

  // customer
  const customer = b.customer as Record<string, unknown> | undefined
  if (!customer || typeof customer !== "object") {
    errors.push("customer")
  } else {
    if (!customer.postcode_full || typeof customer.postcode_full !== "string") {
      errors.push("customer.postcode_full")
    } else if (!UK_POSTCODE_REGEX.test((customer.postcode_full as string).trim())) {
      errors.push("customer.postcode_full (invalid UK postcode format)")
    }

    const hasEmail = customer.email && typeof customer.email === "string" && (customer.email as string).length > 0
    const hasPhone = customer.phone && typeof customer.phone === "string" && (customer.phone as string).length > 0
    if (!hasEmail && !hasPhone) {
      errors.push("customer.email or customer.phone (at least one required)")
    }
  }

  // job
  const job = b.job as Record<string, unknown> | undefined
  if (!job || typeof job !== "object") {
    errors.push("job")
  } else {
    if (!job.description || typeof job.description !== "string" || (job.description as string).trim().length === 0) {
      errors.push("job.description")
    }
  }

  if (errors.length > 0) {
    return {
      valid: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `Missing or invalid fields: ${errors.join(", ")}`,
        fields: errors,
      },
    }
  }

  return { valid: true, data: b as unknown as AgentQuotePayload }
}

// --- HANDLER ---
export async function POST(request: NextRequest) {
  // Auth check
  if (!validateAuth(request)) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Missing or invalid Authorization header" } },
      { status: 401 },
    )
  }

  const authToken = request.headers.get("authorization")!.slice(7).trim()

  // Key rate limit
  if (!checkKeyRateLimit(authToken)) {
    return NextResponse.json(
      { ok: false, error: { code: "RATE_LIMITED", message: "API key rate limit exceeded (30/min)" } },
      { status: 429 },
    )
  }

  try {
    const body = await request.json()
    const validation = validatePayload(body)

    if (!validation.valid) {
      return NextResponse.json({ ok: false, error: validation.error }, { status: 400 })
    }

    const { data } = validation

    // Company rate limit
    if (!checkCompanyRateLimit(data.company_id)) {
      return NextResponse.json(
        { ok: false, error: { code: "RATE_LIMITED", message: `Company rate limit exceeded for ${data.company_id} (10/hour)` } },
        { status: 429 },
      )
    }

    // Dedupe check
    const dedupeKey = getDedupeKey(
      data.company_id,
      data.source?.agent_ref,
      data.customer.email,
      data.customer.phone,
      data.customer.postcode_full,
    )
    const dedupeResult = checkDedupe(dedupeKey)
    if (dedupeResult.isDuplicate) {
      return NextResponse.json({
        ok: true,
        deduped: true,
        lead_id: dedupeResult.leadId,
        message: "Duplicate request detected, returning existing lead",
      })
    }

    // Verify company exists
    const profileRecord = await getProfileRecordByProfileId(data.company_id)
    if (!profileRecord) {
      return NextResponse.json(
        { ok: false, error: { code: "NOT_FOUND", message: `No profile found for company_id: ${data.company_id}` } },
        { status: 404 },
      )
    }

    // Write to Airtable
    const result = await createAgentQuoteRequest({
      profileRecordId: profileRecord.recordId,
      customerName: data.customer.name || "Not provided",
      customerEmail: data.customer.email,
      customerPhone: data.customer.phone,
      postcodeFullValue: data.customer.postcode_full.trim(),
      jobDescription: data.job.description.trim(),
      source: "agent",
    })

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: { code: "WRITE_FAILED", message: "Failed to create lead record" } },
        { status: 500 },
      )
    }

    // Record for dedupe
    if (result.leadId) {
      recordDedupe(dedupeKey, result.leadId)
    }

    return NextResponse.json({
      ok: true,
      deduped: false,
      lead_id: result.leadId,
      company: {
        id: data.company_id,
        name: profileRecord.name,
        profile_url: `/profiles/${profileRecord.slug}`,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Agent quote request error:", error)
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 },
    )
  }
}
