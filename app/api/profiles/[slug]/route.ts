import { type NextRequest, NextResponse } from "next/server"
import { getProfileBySlug, getRecordsForProfile } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    const profile = await getProfileBySlug(slug)

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const records = await getRecordsForProfile(slug)

    return NextResponse.json({
      profile,
      records,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] API profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
