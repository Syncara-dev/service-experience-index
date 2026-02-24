import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, secret } = body

    // Validate secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
    }

    // Revalidate the Airtable cache
    revalidateTag("airtable")

    // If a specific slug is provided, revalidate that profile's tag
    if (slug) {
      revalidateTag(`profile-${slug}`)
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      slug: slug || "all",
    })
  } catch (error) {
    console.error("[v0] Revalidation error:", error)
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 })
  }
}
