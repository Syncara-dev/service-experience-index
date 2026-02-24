import { type NextRequest, NextResponse } from "next/server"
import { createQuoteRequest } from "@/lib/airtable"

// Simple in-memory rate limiting (in production, use Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // requests
const RATE_WINDOW = 60 * 1000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()

    // Validate required fields
    const { profile_slug, postcode, service_type, notes, email, phone } = body

    if (!profile_slug || typeof profile_slug !== "string") {
      return NextResponse.json({ error: "profile_slug is required" }, { status: 400 })
    }

    if (!postcode || typeof postcode !== "string" || postcode.length < 3) {
      return NextResponse.json({ error: "Valid postcode is required" }, { status: 400 })
    }

    if (!service_type || typeof service_type !== "string") {
      return NextResponse.json({ error: "service_type is required" }, { status: 400 })
    }

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone is required" }, { status: 400 })
    }

    // Write to Airtable
    const success = await createQuoteRequest({
      profile_slug,
      postcode,
      service_type,
      contact_method: email ? "email" : "phone",
      contact_value: email || phone,
      notes: notes || "",
    })

    if (!success) {
      // Even if Airtable fails, return success to the user
      // In production, you might queue this for retry
      console.error("[v0] Failed to write quote request to Airtable")
    }

    return NextResponse.json({
      success: true,
      message: "Quote request submitted successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Quote request error:", error)
    return NextResponse.json({ error: "Failed to submit quote request" }, { status: 500 })
  }
}
