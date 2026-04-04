import { type NextRequest, NextResponse } from "next/server"
import { createQuoteRequest } from "@/lib/airtable"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 60 * 1000 

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
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await request.json()

    // Destructure the EXACT variables sent by the frontend
    const { profile, customer_name, customer_email, customer_phone, postcode_full, job_description } = body

    // Validation
    if (!profile || typeof profile !== "string") {
      return NextResponse.json({ error: "Profile is required" }, { status: 400 })
    }
    
    if (!customer_email || typeof customer_email !== "string" || !customer_email.includes('@')) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 })
    }

    if (!postcode_full || typeof postcode_full !== "string" || postcode_full.length < 3) {
      return NextResponse.json({ error: "Valid postcode is required" }, { status: 400 })
    }

    if (!job_description || typeof job_description !== "string") {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 })
    }

    // Write to Airtable via helper function
    const success = await createQuoteRequest({
      profile,
      customer_name,
      customer_email,
      customer_phone,
      postcode_full,
      job_description
    })

    if (!success) {
      console.error("[v0] Failed to write quote request to Airtable")
      // Depending on your preference, you might want to return a 500 error here if Airtable fails
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