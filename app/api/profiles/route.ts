import { type NextRequest, NextResponse } from "next/server"
import { searchProfiles } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const location = searchParams.get("location") || undefined
    const category = searchParams.get("category") || undefined
    const minScore = searchParams.get("minScore") ? Number.parseFloat(searchParams.get("minScore")!) : undefined
    const minSample = searchParams.get("minSample") ? Number.parseInt(searchParams.get("minSample")!, 10) : undefined

    const profiles = await searchProfiles({
      location,
      category,
      minScore,
      minSample,
    })

    return NextResponse.json({
      profiles,
      count: profiles.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] API profiles error:", error)
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 })
  }
}
